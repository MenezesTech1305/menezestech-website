import { supabase } from './supabase'

/**
 * Sistema de Workflow de Aprovações
 * Funções para gerenciar aprovações de Ordens de Serviço
 */

export type TipoAprovacao = 'orcamento' | 'inicio' | 'conclusao' | 'cancelamento'
export type StatusAprovacao = 'pendente' | 'aprovado' | 'rejeitado'

export interface SolicitarAprovacaoParams {
  os_id: string
  tipo_aprovacao: TipoAprovacao
  valor_aprovacao?: number
  observacoes?: string
}

export interface ResponderAprovacaoParams {
  approval_id: string
  status: 'aprovado' | 'rejeitado'
  motivo_rejeicao?: string
}

/**
 * Solicitar uma aprovação para uma OS
 * Pode ser chamado por funcionários e admins
 */
export const solicitarAprovacao = async (params: SolicitarAprovacaoParams) => {
  try {
    const { data, error } = await supabase.rpc('solicitar_aprovacao_os', {
      p_os_id: params.os_id,
      p_tipo_aprovacao: params.tipo_aprovacao,
      p_valor_aprovacao: params.valor_aprovacao,
      p_observacoes: params.observacoes
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao solicitar aprovação:', error)
    return { data: null, error }
  }
}

/**
 * Aprovar ou rejeitar uma solicitação de aprovação
 * Apenas admins e superadmins podem chamar
 */
export const responderAprovacao = async (params: ResponderAprovacaoParams) => {
  try {
    const { data, error } = await supabase.rpc('responder_aprovacao_os', {
      p_approval_id: params.approval_id,
      p_status: params.status,
      p_motivo_rejeicao: params.motivo_rejeicao
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao responder aprovação:', error)
    return { data: null, error }
  }
}

/**
 * Listar todas as aprovações pendentes
 * Retorna lista formatada com informações da OS e solicitante
 */
export const listarAprovacoesPendentes = async () => {
  try {
    const { data, error } = await supabase.rpc('get_pending_approvals')

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao listar aprovações pendentes:', error)
    return { data: null, error }
  }
}

/**
 * Buscar aprovações de uma OS específica
 */
export const buscarAprovacoesDaOS = async (osId: string) => {
  try {
    const { data, error } = await supabase
      .from('os_approvals')
      .select(`
        *,
        solicitante:users!os_approvals_solicitado_por_fkey(id, name, email),
        aprovador:users!os_approvals_aprovador_id_fkey(id, name, email)
      `)
      .eq('os_id', osId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar aprovações da OS:', error)
    return { data: null, error }
  }
}

/**
 * Buscar uma aprovação específica por ID
 */
export const buscarAprovacaoPorId = async (approvalId: string) => {
  try {
    const { data, error } = await supabase
      .from('os_approvals')
      .select(`
        *,
        os:ordens_servico(id, numero, titulo, status),
        solicitante:users!os_approvals_solicitado_por_fkey(id, name, email),
        aprovador:users!os_approvals_aprovador_id_fkey(id, name, email)
      `)
      .eq('id', approvalId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar aprovação:', error)
    return { data: null, error }
  }
}

/**
 * Contar aprovações pendentes (para badge de notificação)
 */
export const contarAprovacoesPendentes = async () => {
  try {
    const { count, error } = await supabase
      .from('os_approvals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pendente')

    if (error) throw error
    return { count: count || 0, error: null }
  } catch (error) {
    console.error('Erro ao contar aprovações pendentes:', error)
    return { count: 0, error }
  }
}

/**
 * Buscar histórico de aprovações de um usuário
 */
export const buscarHistoricoAprovacoes = async (userId: string, tipo: 'solicitadas' | 'aprovadas') => {
  try {
    const campo = tipo === 'solicitadas' ? 'solicitado_por' : 'aprovador_id'
    
    const { data, error } = await supabase
      .from('os_approvals')
      .select(`
        *,
        os:ordens_servico(id, numero, titulo),
        solicitante:users!os_approvals_solicitado_por_fkey(id, name),
        aprovador:users!os_approvals_aprovador_id_fkey(id, name)
      `)
      .eq(campo, userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar histórico de aprovações:', error)
    return { data: null, error }
  }
}

/**
 * Subscribe para mudanças em aprovações (realtime)
 */
export const subscribeToApprovals = (
  callback: (payload: any) => void,
  filters?: { os_id?: string; status?: StatusAprovacao }
) => {
  let channel = supabase
    .channel('os_approvals_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'os_approvals',
        filter: filters?.os_id ? `os_id=eq.${filters.os_id}` : undefined
      },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Verificar se usuário pode aprovar (é admin ou superadmin)
 */
export const podeAprovar = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data?.role === 'admin' || data?.role === 'superadmin'
  } catch (error) {
    console.error('Erro ao verificar permissão:', error)
    return false
  }
}

/**
 * Verificar se usuário pode solicitar aprovação
 */
export const podeSolicitarAprovacao = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error
    return ['admin', 'superadmin', 'funcionario'].includes(data?.role || '')
  } catch (error) {
    console.error('Erro ao verificar permissão:', error)
    return false
  }
}
