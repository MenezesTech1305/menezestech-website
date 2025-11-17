import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types/supabase'

// Hook para verificar se o usuário tem a role necessária
export function useRole(requiredRole?: UserRole | UserRole[]) {
  const { user } = useAuth()
  
  if (!user) return false
  
  if (!requiredRole) return true
  
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  
  // Superadmin tem acesso a tudo
  if (user.role === 'superadmin') return true
  
  return roles.includes(user.role)
}

// Hook para verificar se o usuário tem permissão para uma ação específica
export function usePermission(
  action: 'read' | 'write' | 'delete' | 'admin',
  module?: string
) {
  const { user } = useAuth()
  
  if (!user) return false
  
  // Superadmin tem acesso total
  if (user.role === 'superadmin') return true
  
  // Admin tem acesso a quase tudo, exceto algumas configurações
  if (user.role === 'admin') {
    if (action === 'admin' && module === 'system') return false
    return true
  }
  
  // Funcionário tem acesso limitado
  if (user.role === 'funcionario') {
    if (action === 'admin' || action === 'delete') return false
    return ['read', 'write'].includes(action)
  }
  
  // Cliente só tem acesso de leitura aos próprios dados
  if (user.role === 'cliente') {
    return action === 'read'
  }
  
  return false
}

// Hook para verificar se pode acessar dados de um cliente específico
export function useClientAccess(clienteId?: string) {
  const { user } = useAuth()
  
  if (!user) return false
  
  // Superadmin e admin podem acessar todos os clientes
  if (['superadmin', 'admin'].includes(user.role)) return true
  
  // Cliente só pode acessar seus próprios dados
  if (user.role === 'cliente') {
    return user.id === clienteId
  }
  
  // Funcionário pode acessar se tiver OS atribuídas para o cliente
  // (isso seria verificado com uma query no banco em uma implementação real)
  return user.role === 'funcionario'
}

// Hook para verificar se pode gerenciar uma OS específica
export function useOSAccess(osData?: { cliente_id: string; responsavel_id?: string | null }) {
  const { user } = useAuth()
  
  if (!user || !osData) return false
  
  // Superadmin e admin podem gerenciar todas as OS
  if (['superadmin', 'admin'].includes(user.role)) return true
  
  // Cliente pode ver suas próprias OS
  if (user.role === 'cliente') {
    return user.id === osData.cliente_id
  }
  
  // Funcionário pode gerenciar OS atribuídas a ele
  if (user.role === 'funcionario') {
    return user.id === osData.responsavel_id
  }
  
  return false
}

// Hook para verificar se pode acessar dados financeiros
export function useFinancialAccess(type: 'receber' | 'pagar' | 'dashboard') {
  const { user } = useAuth()
  
  if (!user) return false
  
  // Superadmin e admin têm acesso total
  if (['superadmin', 'admin'].includes(user.role)) return true
  
  // Funcionário pode ver mas não editar
  if (user.role === 'funcionario') {
    return type !== 'pagar' // Não pode ver contas a pagar
  }
  
  // Cliente pode ver apenas suas próprias contas a receber
  if (user.role === 'cliente') {
    return type === 'receber'
  }
  
  return false
}

export default {
  useRole,
  usePermission,
  useClientAccess,
  useOSAccess,
  useFinancialAccess
} 