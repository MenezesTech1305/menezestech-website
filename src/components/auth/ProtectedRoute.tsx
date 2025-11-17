'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRole, usePermission } from '@/hooks/usePermissions'
import { UserRole } from '@/types/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldIcon, LogInIcon } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  requiredPermission?: {
    action: 'read' | 'write' | 'delete' | 'admin'
    module?: string
  }
  fallback?: React.ReactNode
  loadingComponent?: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback,
  loadingComponent,
  requireAuth = true
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, signOut } = useAuth()
  const hasRole = useRole(requiredRole)
  const hasPermission = usePermission(
    requiredPermission?.action || 'read',
    requiredPermission?.module
  )

  // Mostrar loading
  if (loading) {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Verificar autenticação
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <LogInIcon className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Acesso Restrito
                </h2>
                <p className="text-gray-600 mt-2">
                  Você precisa estar logado para acessar esta página.
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/login'}
                className="w-full"
              >
                Fazer Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Verificar role se especificado
  if (requiredRole && !hasRole) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <ShieldIcon className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Permissão Insuficiente
                </h2>
                <p className="text-gray-600 mt-2">
                  Você não tem permissão para acessar esta página.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Role necessária: {Array.isArray(requiredRole) ? requiredRole.join(', ') : requiredRole}
                </p>
                <p className="text-sm text-gray-500">
                  Sua role: {user?.role}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => signOut()}
                  className="flex-1"
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Verificar permissão específica se especificado
  if (requiredPermission && !hasPermission) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <ShieldIcon className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Acesso Negado
                </h2>
                <p className="text-gray-600 mt-2">
                  Você não tem permissão para executar esta ação.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Ação necessária: {requiredPermission.action}
                  {requiredPermission.module && ` no módulo ${requiredPermission.module}`}
                </p>
                <p className="text-sm text-gray-500">
                  Sua role: {user?.role}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => signOut()}
                  className="flex-1"
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Se passou por todas as verificações, renderizar o conteúdo
  return <>{children}</>
}

// Componente específico para proteger páginas de admin
export function AdminRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute requiredRole={['superadmin', 'admin']} {...props}>
      {children}
    </ProtectedRoute>
  )
}

// Componente específico para proteger páginas de superadmin
export function SuperAdminRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute requiredRole="superadmin" {...props}>
      {children}
    </ProtectedRoute>
  )
}

// Componente específico para proteger páginas de funcionários
export function EmployeeRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute requiredRole={['superadmin', 'admin', 'funcionario']} {...props}>
      {children}
    </ProtectedRoute>
  )
}

export default ProtectedRoute 