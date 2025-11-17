// Types para autenticação
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  company?: string
  avatar?: string
  permissions: Permission[]
  lastLogin?: Date
  isActive: boolean
}

export type UserRole = 'superadmin' | 'admin' | 'funcionario' | 'cliente'

export interface Permission {
  module: string
  actions: ('read' | 'write' | 'delete' | 'admin')[]
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Configuração de roles e permissões
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  superadmin: [
    { module: 'all', actions: ['read', 'write', 'delete', 'admin'] }
  ],
  admin: [
    { module: 'dashboard', actions: ['read', 'write'] },
    { module: 'os', actions: ['read', 'write', 'delete'] },
    { module: 'users', actions: ['read', 'write'] },
    { module: 'reports', actions: ['read', 'write'] },
    { module: 'integrations', actions: ['read'] }
  ],
  funcionario: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'os', actions: ['read', 'write'] },
    { module: 'clients', actions: ['read'] },
    { module: 'reports', actions: ['read'] }
  ],
  cliente: [
    { module: 'portal', actions: ['read'] },
    { module: 'my-os', actions: ['read'] },
    { module: 'my-profile', actions: ['read', 'write'] }
  ]
}

// Funções utilitárias
export const hasPermission = (user: User | null, module: string, action: 'read' | 'write' | 'delete' | 'admin'): boolean => {
  if (!user) return false
  
  // Superadmin tem acesso total
  if (user.role === 'superadmin') return true
  
  const userPermissions = ROLE_PERMISSIONS[user.role]
  return userPermissions.some(permission => 
    (permission.module === module || permission.module === 'all') && 
    permission.actions.includes(action)
  )
}

export const isRole = (user: User | null, role: UserRole): boolean => {
  return user?.role === role
}

export const isAuthenticated = (user: User | null): boolean => {
  return user !== null && user.isActive
}

// Mock de usuários para desenvolvimento
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Nattan Menezes',
    email: 'nattan@menezestech.com.br',
    role: 'superadmin',
    permissions: ROLE_PERMISSIONS.superadmin,
    isActive: true,
    lastLogin: new Date(),
    avatar: 'https://avatar.vercel.sh/nattan'
  },
  {
    id: '2',
    name: 'Carlos Silva',
    email: 'carlos@menezestech.com.br',
    role: 'admin',
    permissions: ROLE_PERMISSIONS.admin,
    isActive: true,
    lastLogin: new Date(),
    avatar: 'https://avatar.vercel.sh/carlos'
  },
  {
    id: '3',
    name: 'Ana Santos',
    email: 'ana@menezestech.com.br',
    role: 'funcionario',
    permissions: ROLE_PERMISSIONS.funcionario,
    isActive: true,
    lastLogin: new Date(),
    avatar: 'https://avatar.vercel.sh/ana'
  },
  {
    id: '4',
    name: 'João Oliveira',
    email: 'joao@empresaclient.com.br',
    role: 'cliente',
    company: 'Empresa Cliente Ltda',
    permissions: ROLE_PERMISSIONS.cliente,
    isActive: true,
    lastLogin: new Date(),
    avatar: 'https://avatar.vercel.sh/joao'
  }
]

// Simulação de autenticação (em produção usar JWT/OAuth)
export const authenticate = async (email: string, password: string): Promise<User | null> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Buscar usuário (em produção seria uma API call)
  const user = MOCK_USERS.find(u => u.email === email)
  
  if (user && password === 'demo123') {
    return {
      ...user,
      lastLogin: new Date()
    }
  }
  
  return null
}

export const logout = async (): Promise<void> => {
  // Limpar tokens, cookies, etc.
  await new Promise(resolve => setTimeout(resolve, 500))
} 