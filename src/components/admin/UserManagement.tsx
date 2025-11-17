'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  UserPlus, 
  Edit, 
  Shield, 
  ShieldCheck, 
  User, 
  Users,
  Mail,
  Building,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string | null
  role: 'superadmin' | 'admin' | 'funcionario' | 'cliente'
  company?: string | null
  phone?: string | null
  is_active: boolean | null
  last_login?: string | null
  created_at: string | null
}

const roleLabels = {
  superadmin: 'Super Admin',
  admin: 'Administrador',
  funcionario: 'Funcionário',
  cliente: 'Cliente'
}

const roleColors = {
  superadmin: 'bg-red-100 text-red-800',
  admin: 'bg-blue-100 text-blue-800',
  funcionario: 'bg-green-100 text-green-800',
  cliente: 'bg-gray-100 text-gray-800'
}

const roleIcons = {
  superadmin: ShieldCheck,
  admin: Shield,
  funcionario: User,
  cliente: Users
}

export function UserManagement() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar usuários
  const loadUsers = async () => {
    try {
      setLoading(true)
      
      // Buscar usuários diretamente da tabela users
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setUsers(data || [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      alert('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  // Carregar usuários ao montar
  useEffect(() => {
    loadUsers()
  }, [])

  // Verificar se pode editar usuário
  const canEditUser = (targetUser: User) => {
    if (currentUser?.role === 'superadmin') return true
    if (currentUser?.role === 'admin' && !['admin', 'superadmin'].includes(targetUser.role)) return true
    if (targetUser.id === currentUser?.id) return true
    return false
  }

  // Verificar se pode criar usuários
  const canCreate = currentUser?.role === 'superadmin' || currentUser?.role === 'admin'

  const handleCreateUser = () => {
    alert('Criação de usuários será implementada em breve')
  }

  const handleEditUser = (userId: string) => {
    alert('Edição de usuários será implementada em breve')
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId)
      
      if (error) throw error
      
      alert(`Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`)
      
      await loadUsers()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status do usuário')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie usuários e permissões do sistema
          </p>
        </div>
        
        {canCreate && (
          <Button onClick={handleCreateUser}>
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        )}
      </div>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Usuários do Sistema ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.length > 0 ? users.map((user) => {
              const RoleIcon = roleIcons[user.role]
              
              return (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{user.name || 'Nome não informado'}</h3>
                          <Badge variant="secondary" className={roleColors[user.role]}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {roleLabels[user.role]}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </span>
                          {user.company && (
                            <span className="flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              {user.company}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                          <span>Criado em: {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'Data não informada'}</span>
                          {user.last_login && (
                            <span>Último login: {new Date(user.last_login).toLocaleDateString('pt-BR')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Status */}
                      <div className="flex items-center space-x-2">
                        {user.is_active ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          user.is_active ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {user.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      
                      {/* Ações */}
                      <div className="flex space-x-2">
                        {canEditUser(user) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user.id)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        )}
                        
                        {currentUser?.role === 'superadmin' && user.id !== currentUser?.id && (
                          <Button
                            variant={user.is_active ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleUserStatus(user.id, user.is_active || false)}
                          >
                            {user.is_active ? 'Desativar' : 'Ativar'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }) : (
              <div className="text-center text-gray-500 py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Nenhum usuário encontrado</h3>
                <p className="text-sm">Não há usuários cadastrados no sistema</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserManagement 