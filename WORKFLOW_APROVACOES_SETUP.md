# 🔄 Sistema de Workflow de Aprovações - Setup

## 📋 Visão Geral

O sistema de workflow de aprovações permite que funcionários solicitem aprovações para ações importantes nas Ordens de Serviço, e que administradores aprovem ou rejeitem essas solicitações.

## 🎯 Tipos de Aprovação

1. **Orçamento** - Aprovação do valor orçado antes de iniciar o serviço
2. **Início** - Aprovação para iniciar a execução do serviço
3. **Conclusão** - Aprovação para finalizar a OS
4. **Cancelamento** - Aprovação para cancelar a OS

## 🛠️ Configuração no Supabase

### Passo 1: Criar a Tabela de Aprovações

Acesse o **SQL Editor** no dashboard do Supabase e execute o seguinte script:

```sql
-- Criar tabela de aprovações de OS
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_os_approvals_os_id ON os_approvals(os_id);
CREATE INDEX IF NOT EXISTS idx_os_approvals_status ON os_approvals(status);
CREATE INDEX IF NOT EXISTS idx_os_approvals_aprovador ON os_approvals(aprovador_id);

-- RLS Policies
ALTER TABLE os_approvals ENABLE ROW LEVEL SECURITY;

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

-- Trigger para atualizar updated_at
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
```

### Passo 2: Criar Funções RPC

Execute o seguinte script para criar as funções necessárias:

```sql
-- Função para solicitar aprovação
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
  -- Obter usuário atual
  v_user_id := auth.uid();
  
  -- Verificar role do usuário
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- Verificar se usuário tem permissão
  IF v_user_role NOT IN ('superadmin', 'admin', 'funcionario') THEN
    RAISE EXCEPTION 'Usuário não tem permissão para solicitar aprovações';
  END IF;
  
  -- Criar solicitação de aprovação
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
  
  -- Criar notificação para admins
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
  
  -- Registrar log
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

-- Função para aprovar/rejeitar
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
  -- Obter usuário atual
  v_user_id := auth.uid();
  
  -- Verificar role do usuário
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- Verificar se usuário tem permissão
  IF v_user_role NOT IN ('superadmin', 'admin') THEN
    RAISE EXCEPTION 'Usuário não tem permissão para aprovar/rejeitar';
  END IF;
  
  -- Verificar se aprovação existe e está pendente
  SELECT os_id, tipo_aprovacao INTO v_os_id, v_tipo_aprovacao
  FROM os_approvals
  WHERE id = p_approval_id AND status = 'pendente';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aprovação não encontrada ou já foi respondida';
  END IF;
  
  -- Atualizar aprovação
  UPDATE os_approvals
  SET 
    status = p_status,
    aprovador_id = v_user_id,
    data_resposta = NOW(),
    motivo_rejeicao = CASE WHEN p_status = 'rejeitado' THEN p_motivo_rejeicao ELSE NULL END
  WHERE id = p_approval_id;
  
  -- Se aprovado, atualizar status da OS conforme o tipo
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
        -- Para orçamento, apenas registra a aprovação
        NULL;
    END CASE;
  END IF;
  
  -- Criar notificação para o solicitante
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
  
  -- Registrar log
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

-- Função para listar aprovações pendentes
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
```

## 🎨 Como Usar no Sistema

### Para Funcionários

1. Acesse uma OS que você é responsável
2. Na seção "Workflow de Aprovação", selecione o tipo de aprovação
3. Preencha os campos necessários (valor, observações)
4. Clique em "Solicitar Aprovação"
5. Aguarde a resposta do administrador

### Para Administradores

1. Acesse o dashboard administrativo
2. Visualize as "Aprovações Pendentes"
3. Revise os detalhes da solicitação
4. Clique em "Aprovar" ou "Rejeitar"
5. Se rejeitar, informe o motivo

## 📊 Fluxo de Aprovação

```
Funcionário Solicita
        ↓
   Pendente (notifica admins)
        ↓
    Admin Revisa
        ↓
   ┌────────────┐
   ↓            ↓
Aprovado    Rejeitado
   ↓            ↓
Atualiza OS  Notifica Solicitante
```

## ✅ Benefícios

- ✅ **Controle**: Todas as ações importantes passam por aprovação
- ✅ **Auditoria**: Histórico completo de aprovações
- ✅ **Notificações**: Alertas automáticos para admins e solicitantes
- ✅ **Rastreabilidade**: Logs detalhados de todas as ações
- ✅ **Segurança**: RLS garante que apenas usuários autorizados vejam/modifiquem

## 🔐 Permissões

| Role | Solicitar | Aprovar/Rejeitar | Ver Próprias | Ver Todas |
|------|-----------|------------------|--------------|-----------|
| **Superadmin** | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **Funcionário** | ✅ | ❌ | ✅ | ❌ |
| **Cliente** | ❌ | ❌ | ✅ | ❌ |

## 📝 Notas Importantes

1. **Orçamento**: Não altera automaticamente o status da OS, apenas registra a aprovação
2. **Início**: Muda status para "em_andamento" e registra data_inicio
3. **Conclusão**: Muda status para "concluida" e registra data_conclusao
4. **Cancelamento**: Muda status para "cancelada"

## 🚀 Próximos Passos

Após configurar o banco de dados:

1. Teste criando uma OS
2. Solicite uma aprovação como funcionário
3. Aprove/rejeite como admin
4. Verifique as notificações
5. Revise os logs de auditoria

---

**Status**: ✅ Componentes implementados, aguardando configuração do banco de dados
**Versão**: 1.0.0
**Data**: Janeiro 2025
