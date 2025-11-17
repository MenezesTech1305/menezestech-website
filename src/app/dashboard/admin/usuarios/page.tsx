'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import UserManagement from '@/components/admin/UserManagement'

export default function UsuariosPage() {
  return (
    <ProtectedRoute requiredRole={['superadmin', 'admin']}>
      <div className="container mx-auto py-6">
        <UserManagement />
      </div>
    </ProtectedRoute>
  )
} 