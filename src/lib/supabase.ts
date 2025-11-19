import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas. Verifique .env.local')
}

// Cliente Supabase tipado com configuração otimizada
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'menezestech-auth',
      flowType: 'pkce', // Mais seguro
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    global: {
      headers: {
        'X-Client-Info': 'menezestech-system',
        'Cache-Control': 'no-cache',
      }
    },
    db: {
      schema: 'public'
    }
  }
)

// Função para limpar cache do Supabase
export const clearSupabaseCache = () => {
  if (typeof window !== 'undefined') {
    // Limpar storage do Supabase
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase') || key === 'menezestech-auth') {
        localStorage.removeItem(key)
      }
    })
  }
}

// Função para verificar e renovar sessão
export const ensureValidSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Erro ao verificar sessão:', error)
      return false
    }
    
    if (!session) {
      return false
    }
    
    // Verificar se a sessão está próxima de expirar (menos de 5 minutos)
    const expiresAt = session.expires_at
    if (expiresAt) {
      const now = Math.floor(Date.now() / 1000)
      const timeUntilExpiry = expiresAt - now
      
      if (timeUntilExpiry < 300) { // Menos de 5 minutos
        console.log('Sessão próxima de expirar, renovando...')
        const { data, error: refreshError } = await supabase.auth.refreshSession()
        
        if (refreshError) {
          console.error('Erro ao renovar sessão:', refreshError)
          return false
        }
        
        return !!data.session
      }
    }
    
    return true
  } catch (error) {
    console.error('Erro ao verificar sessão:', error)
    return false
  }
}

// Cliente para uso no servidor (Server Components)
export const createServerClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
}

// Função para autenticação
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro no login:', error)
    return { data: null, error }
  }
}

// Função para registro
export const signUp = async (email: string, password: string, userData: {
  name: string
  role?: Database['public']['Enums']['user_role']
  company?: string
}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro no registro:', error)
    return { data: null, error }
  }
}

// Função para logout
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Erro no logout:', error)
    return { error }
  }
}

// Função para obter usuário atual
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    console.error('Erro ao obter usuário:', error)
    return { user: null, error }
  }
}

// Função para obter sessão atual
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return { session, error: null }
  } catch (error) {
    console.error('Erro ao obter sessão:', error)
    return { session: null, error }
  }
}

// Verificar se usuário está autenticado
export const isAuthenticated = async () => {
  const { session } = await getCurrentSession()
  return !!session
}

// Funções específicas do negócio

// Dashboard financeiro
export const getFinancialDashboard = async () => {
  try {
    const { data, error } = await supabase.rpc('get_financial_dashboard')
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao obter dashboard financeiro:', error)
    return { data: null, error }
  }
}

// Estatísticas das OS
export const getOSStats = async () => {
  try {
    const { data, error } = await supabase.rpc('get_os_stats')
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao obter estatísticas das OS:', error)
    return { data: null, error }
  }
}

// Buscar usuário por ID com dados completos
export const getUserById = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return { data: null, error }
  }
}

// Buscar ordens de serviço com relacionamentos
export const getOrdensServico = async (filters?: {
  status?: Database['public']['Enums']['status_os']
  cliente_id?: string
  responsavel_id?: string
  categoria?: Database['public']['Enums']['categoria_os']
}) => {
  try {
    let query = supabase
      .from('ordens_servico')
      .select(`
        *,
        cliente:users!ordens_servico_cliente_id_fkey(id, name, email, company),
        responsavel:users!ordens_servico_responsavel_id_fkey(id, name, email)
      `)
      .order('data_abertura', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.cliente_id) {
      query = query.eq('cliente_id', filters.cliente_id)
    }
    if (filters?.responsavel_id) {
      query = query.eq('responsavel_id', filters.responsavel_id)
    }
    if (filters?.categoria) {
      query = query.eq('categoria', filters.categoria)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar ordens de serviço:', error)
    return { data: null, error }
  }
}

// Buscar contas a receber com relacionamentos
export const getContasReceber = async (filters?: {
  status?: Database['public']['Enums']['status_conta']
  cliente_id?: string
  categoria?: Database['public']['Enums']['categoria_receita']
}) => {
  try {
    let query = supabase
      .from('contas_receber')
      .select(`
        *,
        cliente:users!contas_receber_cliente_id_fkey(id, name, email, company),
        os:ordens_servico(id, numero, titulo)
      `)
      .order('data_vencimento', { ascending: true })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.cliente_id) {
      query = query.eq('cliente_id', filters.cliente_id)
    }
    if (filters?.categoria) {
      query = query.eq('categoria', filters.categoria)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar contas a receber:', error)
    return { data: null, error }
  }
}

// Buscar contas a pagar
export const getContasPagar = async (filters?: {
  status?: Database['public']['Enums']['status_conta']
  categoria?: Database['public']['Enums']['categoria_despesa']
  prioridade?: Database['public']['Enums']['prioridade_pagamento']
}) => {
  try {
    let query = supabase
      .from('contas_pagar')
      .select('*')
      .order('data_vencimento', { ascending: true })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.categoria) {
      query = query.eq('categoria', filters.categoria)
    }
    if (filters?.prioridade) {
      query = query.eq('prioridade', filters.prioridade)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar contas a pagar:', error)
    return { data: null, error }
  }
}

// Buscar notificações do usuário
export const getNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return { data: null, error }
  }
}

// Marcar notificação como lida
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        status: 'read',
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error)
    return { data: null, error }
  }
}

// Função para buscar estatísticas do dashboard administrativo
export const getAdminDashboardStats = async () => {
  try {
    // Buscar estatísticas básicas usando queries existentes
    const [osStats, usersCount, financeData] = await Promise.all([
      supabase.from('ordens_servico').select('status', { count: 'exact' }),
      supabase.from('users').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('contas_receber').select('valor', { count: 'exact' })
    ])

    const osTotal = osStats.count || 0
    const osAbertas = osStats.data?.filter(os => os.status === 'em_andamento').length || 0
    const clientesAtivos = usersCount.count || 0
    const receitaMes = financeData.data?.reduce((acc, conta) => acc + (conta.valor || 0), 0) || 0

    return { 
      data: {
        osTotal,
        osAbertas, 
        clientesAtivos,
        receitaMes,
        osConcluidas: osStats.data?.filter(os => os.status === 'concluida').length || 0,
        osAtrasadas: 0, // Implementar lógica de atraso depois
        crescimentoMes: 12 // Mockado por enquanto
      }, 
      error: null 
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard admin:', error)
    return { data: null, error }
  }
}

// Função para buscar OS recentes
export const getRecentOS = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('ordens_servico')
      .select(`
        id,
        titulo,
        status,
        prioridade,
        created_at,
        cliente_id,
        responsavel_id
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar OS recentes:', error)
    return { data: null, error }
  }
}

// Função para buscar alertas baseado em notificações  
export const getCriticalAlerts = async () => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('status', 'unread')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar alertas críticos:', error)
    return { data: null, error }
  }
}

// Função para buscar dados do dashboard de funcionário
export const getFuncionarioDashboardData = async (funcionarioId: string) => {
  try {
    const [osData, statsData] = await Promise.all([
      supabase
        .from('ordens_servico')
        .select(`
          id,
          titulo,
          status,
          prioridade,
          created_at,
          cliente_id
        `)
        .eq('responsavel_id', funcionarioId)
        .order('created_at', { ascending: false }),
      
      supabase
        .from('ordens_servico')
        .select('status', { count: 'exact' })
        .eq('responsavel_id', funcionarioId)
    ])

    if (osData.error) throw osData.error
    if (statsData.error) throw statsData.error

    const minhasOS = osData.data || []
    const osAtribuidas = statsData.count || 0
    const osEmAndamento = minhasOS.filter(os => os.status === 'em_andamento').length
    const osConcluidas = minhasOS.filter(os => os.status === 'concluida').length

    return {
      data: {
        stats: {
          osAtribuidas,
          osEmAndamento,
          osConcluidas,
          clientesAtivos: 0, // Calcular depois
          horasTrabalhadasMes: 0, // Calcular depois
          metaMensal: 180
        },
        minhasOS,
        performanceData: {
          resolutionTime: 2.4,
          customerSatisfaction: 4.8,
          tasksCompleted: osConcluidas,
          efficiency: 92
        }
      },
      error: null
    }
  } catch (error) {
    console.error('Erro ao buscar dados do funcionário:', error)
    return { data: null, error }
  }
}

// Função para buscar dados do dashboard de cliente
export const getClienteDashboardData = async (clienteId: string) => {
  try {
    const [osData, faturaData] = await Promise.all([
      supabase
        .from('ordens_servico')
        .select(`
          id,
          titulo,
          status,
          prioridade,
          created_at,
          responsavel_id
        `)
        .eq('cliente_id', clienteId)
        .order('created_at', { ascending: false }),
      
      supabase
        .from('contas_receber')
        .select('*')
        .eq('cliente_id', clienteId)
        .order('data_vencimento', { ascending: false })
    ])

    if (osData.error) throw osData.error
    if (faturaData.error) throw faturaData.error

    const minhasOS = osData.data || []
    const faturas = faturaData.data || []
    
    const osAbertas = minhasOS.filter(os => ['pendente', 'em_andamento'].includes(os.status)).length
    const osConcluidas = minhasOS.filter(os => os.status === 'concluida').length
    const valorContratado = faturas.reduce((acc, f) => acc + (f.valor || 0), 0)
    const proximoPagamento = faturas.find(f => f.status === 'pendente')?.valor || 0

    return {
      data: {
        stats: {
          osAbertas,
          osConcluidas,
          valorContratado,
          proximoPagamento,
          satisfacao: 4.8
        },
        minhasOS,
        faturas
      },
      error: null
    }
  } catch (error) {
    console.error('Erro ao buscar dados do cliente:', error)
    return { data: null, error }
  }
}

// Função para atualizar progresso de uma OS (funcionário)
export const updateOSProgress = async (osId: string, progresso: number, observacoes?: string) => {
  try {
    const { data, error } = await supabase
      .from('ordens_servico')
      .update({ 
        progresso,
        observacoes,
        updated_at: new Date().toISOString()
      })
      .eq('id', osId)
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao atualizar progresso da OS:', error)
    return { data: null, error }
  }
}

export default supabase 