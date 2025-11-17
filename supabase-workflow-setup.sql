-- ============================================
-- SISTEMA DE WORKFLOW DE APROVAÇÕES
-- MenezesTech - Ordens de Serviço
-- ============================================

-- Passo 1: Criar tabela de aprovações
CREATE TABLE IF NOT EXISTS os_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  os_id UUID NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
  tipo_aprovacao TEXT NOT NULL CHECK (tipo_aprovacao IN ('orcamento', 'inicio', 'conclusao', 'cancelamento')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  solicitado_por UUID NOT NULL REFERENCES users(id),
  aprovador_id UUID REFERENCES users(id),
  data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_resposta TIMESTAMP WITH TIME ZONE,
  valor_aprovacao DECIMAL(10,2),
  observacoes TEXT,
  motivo_rejeicao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Passo 2: Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_os_approvals_os_id ON os_approvals(os_id);
CREATE INDEX IF NOT EXISTS idx_os_approvals_status ON os_approvals(status);
CREATE INDEX IF NOT EXISTS idx_os_approvals_aprovador ON os_approvals(aprovador_id);

-- Passo 3: Habilitar RLS
ALTER TABLE os_approvals ENABLE ROW LEVEL SECURITY;

-- Passo 4: Criar políticas RLS

-- Superadmin e admin podem ver todas as aprovações
CREATE POLICY "Superadmin e admin podem ver todas as aprovações"
  ON os_approvals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('superadmin', 'admin')
    )
  );

-- Funcionários podem ver aprovações das suas OS
CREATE POLICY "Funcionários podem ver aprovações das suas OS"
  ON os_approvals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ordens_servico os
      WHERE os.id = os_approvals.os_id
      AND os.responsavel_id = auth.uid()
    )
  );

-- Clientes podem ver aprovações das suas OS
CREATE POLICY "Clientes podem ver aprovações das suas OS"
  ON os_approvals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ordens_servico os
      WHERE os.id = os_approvals.os_id
      AND os.cliente_id = auth.uid()
    )
  );

-- Funcionários e admins podem criar solicitações de aprovação
CREATE POLICY "Funcionários e admins podem criar aprovações"
  ON os_approvals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('superadmin', 'admin', 'funcionario')
    )
  );

-- Apenas admins e superadmins podem aprovar/rejeitar
CREATE POLICY "Admins podem atualizar aprovações"
  ON os_approvals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('superadmin', 'admin')
    )
  );

-- Passo 5: Criar trigger para updated_at
CREATE OR REPLACE FUNCTION update_os_approvals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER os_approvals_updated_at
  BEFORE UPDATE ON os_approvals
  FOR EACH ROW
  EXECUTE FUNCTION update_os_approvals_updated_at();

-- Passo 6: Função para solicitar aprovação
CREATE OR REPLACE FUNCTION solicitar_aprovacao_os(
  p_os_id UUID,
  p_tipo_aprovacao TEXT,
  p_valor_aprovacao DECIMAL DEFAULT NULL,
  p_observacoes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_approval_id UUID;
  v_user_id UUID;
  v_user_role TEXT;
BEGIN
  v_user_id := auth.uid();
  
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  IF v_user_role NOT IN ('superadmin', 'admin', 'funcionario') THEN
    RAISE EXCEPTION 'Usuário não tem permissão para solicitar aprovações';
  END IF;
  
  INSERT INTO os_approvals (
    os_id,
    tipo_aprovacao,
    solicitado_por,
    valor_aprovacao,
    observacoes,
    status
  ) VALUES (
    p_os_id,
    p_tipo_aprovacao,
    v_user_id,
    p_valor_aprovacao,
    p_observacoes,
    'pendente'
  ) RETURNING id INTO v_approval_id;
  
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    entity_type,
    entity_id,
    action_url
  )
  SELECT 
    u.id,
    'Nova Solicitação de Aprovação',
    'Uma nova solicitação de aprovação de ' || p_tipo_aprovacao || ' foi criada',
    'warning',
    'os_approval',
    v_approval_id,
    '/dashboard/os/' || p_os_id
  FROM users u
  WHERE u.role IN ('superadmin', 'admin')
  AND u.is_active = true;
  
  INSERT INTO activity_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    new_values
  ) VALUES (
    v_user_id,
    'solicitar_aprovacao',
    'os_approval',
    v_approval_id,
    jsonb_build_object(
      'os_id', p_os_id,
      'tipo_aprovacao', p_tipo_aprovacao,
      'valor_aprovacao', p_valor_aprovacao
    )
  );
  
  RETURN json_build_object(
    'success', true,
    'approval_id', v_approval_id,
    'message', 'Solicitação de aprovação criada com sucesso'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Passo 7: Função para aprovar/rejeitar
CREATE OR REPLACE FUNCTION responder_aprovacao_os(
  p_approval_id UUID,
  p_status TEXT,
  p_motivo_rejeicao TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_os_id UUID;
  v_tipo_aprovacao TEXT;
BEGIN
  v_user_id := auth.uid();
  
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  IF v_user_role NOT IN ('superadmin', 'admin') THEN
    RAISE EXCEPTION 'Usuário não tem permissão para aprovar/rejeitar';
  END IF;
  
  SELECT os_id, tipo_aprovacao INTO v_os_id, v_tipo_aprovacao
  FROM os_approvals
  WHERE id = p_approval_id AND status = 'pendente';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aprovação não encontrada ou já foi respondida';
  END IF;
  
  UPDATE os_approvals
  SET 
    status = p_status,
    aprovador_id = v_user_id,
    data_resposta = NOW(),
    motivo_rejeicao = CASE WHEN p_status = 'rejeitado' THEN p_motivo_rejeicao ELSE NULL END
  WHERE id = p_approval_id;
  
  IF p_status = 'aprovado' THEN
    CASE v_tipo_aprovacao
      WHEN 'inicio' THEN
        UPDATE ordens_servico
        SET status = 'em_andamento', data_inicio = NOW()
        WHERE id = v_os_id;
      WHEN 'conclusao' THEN
        UPDATE ordens_servico
        SET status = 'concluida', data_conclusao = NOW()
        WHERE id = v_os_id;
      WHEN 'cancelamento' THEN
        UPDATE ordens_servico
        SET status = 'cancelada'
        WHERE id = v_os_id;
      ELSE
        NULL;
    END CASE;
  END IF;
  
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    entity_type,
    entity_id,
    action_url
  )
  SELECT 
    solicitado_por,
    'Aprovação ' || CASE WHEN p_status = 'aprovado' THEN 'Aprovada' ELSE 'Rejeitada' END,
    'Sua solicitação de ' || tipo_aprovacao || ' foi ' || 
    CASE WHEN p_status = 'aprovado' THEN 'aprovada' ELSE 'rejeitada' END,
    CASE WHEN p_status = 'aprovado' THEN 'success' ELSE 'error' END,
    'os_approval',
    p_approval_id,
    '/dashboard/os/' || v_os_id
  FROM os_approvals
  WHERE id = p_approval_id;
  
  INSERT INTO activity_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    new_values
  ) VALUES (
    v_user_id,
    'responder_aprovacao',
    'os_approval',
    p_approval_id,
    jsonb_build_object(
      'status', p_status,
      'motivo_rejeicao', p_motivo_rejeicao
    )
  );
  
  RETURN json_build_object(
    'success', true,
    'message', 'Aprovação respondida com sucesso'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Passo 8: Função para listar aprovações pendentes
CREATE OR REPLACE FUNCTION get_pending_approvals()
RETURNS TABLE (
  id UUID,
  os_id UUID,
  os_numero TEXT,
  os_titulo TEXT,
  tipo_aprovacao TEXT,
  valor_aprovacao DECIMAL,
  solicitado_por_nome TEXT,
  data_solicitacao TIMESTAMP WITH TIME ZONE,
  observacoes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.os_id,
    os.numero,
    os.titulo,
    a.tipo_aprovacao,
    a.valor_aprovacao,
    u.name,
    a.data_solicitacao,
    a.observacoes
  FROM os_approvals a
  JOIN ordens_servico os ON os.id = a.os_id
  JOIN users u ON u.id = a.solicitado_por
  WHERE a.status = 'pendente'
  ORDER BY a.data_solicitacao DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- Para executar:
-- 1. Acesse https://supabase.com/dashboard/project/lrjkyupznspzvxrhxtsh
-- 2. Vá em "SQL Editor"
-- 3. Clique em "New Query"
-- 4. Cole este script completo
-- 5. Clique em "Run" ou pressione Ctrl+Enter
-- 6. Verifique se todas as operações foram bem-sucedidas
