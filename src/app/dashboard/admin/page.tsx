"use client"

import { useState, useEffect } from "react"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { 
  getAdminDashboardStats, 
  getRecentOS, 
  getCriticalAlerts,
  markNotificationAsRead 
} from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Settings,
  BarChart3,
  MessageSquare,
  Shield,
  Plus
} from "lucide-react"
import { PendingApprovalsList } from "@/components/os/os-approval-workflow"

interface DashboardStats {
  osTotal: number
  osAbertas: number
  clientesAtivos: number
  receitaMes: number
  osConcluidas: number
  osAtrasadas: number
  crescimentoMes: number
}

interface OSRecente {
  id: string
  titulo: string
  status: string
  prioridade: string
  created_at: string | null
  cliente_id: string
  responsavel_id: string | null
}

interface Alerta {
  id: string
  title: string
  message: string
  status: string
  created_at: string | null
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [osRecentes, setOsRecentes] = useState<OSRecente[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar dados do dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [statsResult, osResult, alertasResult] = await Promise.all([
        getAdminDashboardStats(),
        getRecentOS(5),
        getCriticalAlerts()
      ])

      if (statsResult.data) {
        setStats(statsResult.data)
      }

      if (osResult.data) {
        setOsRecentes(osResult.data)
      }

      if (alertasResult.data) {
        setAlertas(alertasResult.data)
      }

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do dashboard",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Handlers para botões
  const handleResolverAlerta = async (alertaId: string) => {
    try {
      const result = await markNotificationAsRead(alertaId)
      if (result.error) throw result.error
      
      toast({
        title: "Alerta resolvido",
        description: "O alerta foi marcado como resolvido.",
      })
      
      // Recarregar alertas
      const alertasResult = await getCriticalAlerts()
      if (alertasResult.data) {
        setAlertas(alertasResult.data)
      }
    } catch (error) {
      console.error('Erro ao resolver alerta:', error)
      toast({
        title: "Erro",
        description: "Falha ao resolver alerta",
        variant: "destructive",
      })
    }
  }

  const handleNovaOS = () => {
    window.location.href = '/dashboard/os'
  }

  const handleGerenciarUsuarios = () => {
    window.location.href = '/dashboard/admin/usuarios'
  }

  const handleRelatorios = () => {
    toast({
      title: "Em desenvolvimento",
      description: "Módulo de relatórios em desenvolvimento",
    })
  }

  const handleConfiguracoes = () => {
    window.location.href = '/dashboard/configuracoes'
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole={['superadmin', 'admin']}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole={['superadmin', 'admin']}>
      <div className="space-y-6">
          {/* Estatísticas principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total de OS"
              value={stats?.osTotal || 0}
              icon={FileText}
              change={{
                value: 25,
                type: 'increase',
                period: 'este mês'
              }}
            />
            <StatsCard
              title="OS em Aberto"
              value={stats?.osAbertas || 0}
              icon={Clock}
              variant="warning"
            />
            <StatsCard
              title="Clientes Ativos"
              value={stats?.clientesAtivos || 0}
              icon={Users}
              change={{
                value: 8,
                type: 'increase',
                period: 'vs. mês anterior'
              }}
            />
            <StatsCard
              title="Receita Mensal"
              value={`R$ ${(stats?.receitaMes || 0).toLocaleString('pt-BR')}`}
              icon={DollarSign}
              variant="success"
              change={{
                value: stats?.crescimentoMes || 0,
                type: 'increase',
                period: 'vs. mês anterior'
              }}
            />
          </div>

          {/* Alertas */}
          {alertas.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-900">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Alertas Críticos ({alertas.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertas.map((alerta) => (
                    <div key={alerta.id} className="border rounded-lg p-3 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{alerta.title}</h4>
                          <p className="text-sm text-gray-600">{alerta.message}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleResolverAlerta(alerta.id)}
                        >
                          Resolver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Aprovações Pendentes */}
          <PendingApprovalsList onApprovalResponded={loadDashboardData} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* OS Recentes */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ordens de Serviço Recentes</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNovaOS}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova OS
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {osRecentes.length > 0 ? osRecentes.map((os) => (
                    <div key={os.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{os.titulo}</h3>
                          <p className="text-xs text-gray-500">#{os.id}</p>
                          <p className="text-xs text-gray-400">
                            {os.created_at ? new Date(os.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          os.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' : 
                          os.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {os.status === 'em_andamento' ? 'Em Andamento' :
                           os.status === 'pendente' ? 'Pendente' : 
                           os.status === 'concluida' ? 'Concluída' : os.status}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhuma OS encontrada</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleGerenciarUsuarios}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gerenciar Usuários
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleRelatorios}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleConfiguracoes}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/dashboard/financeiro'}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financeiro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
    </ProtectedRoute>
  )
} 