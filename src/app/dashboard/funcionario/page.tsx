"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { getFuncionarioDashboardData, updateOSProgress } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Users,
  Calendar,
  Target,
  Zap,
  AlertCircle,
  Play,
  Pause,
  Edit
} from "lucide-react"

interface FuncionarioStats {
  osAtribuidas: number
  osEmAndamento: number
  osConcluidas: number
  clientesAtivos: number
  horasTrabalhadasMes: number
  metaMensal: number
}

interface MinhaOS {
  id: string
  titulo: string
  status: string
  prioridade: string
  created_at: string | null
  cliente_id: string
}

interface PerformanceData {
  resolutionTime: number
  customerSatisfaction: number
  tasksCompleted: number
  efficiency: number
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'concluida':
      return 'bg-green-100 text-green-800'
    case 'em_andamento':
      return 'bg-blue-100 text-blue-800'
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800'
    case 'atrasada':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'alta':
    case 'critica':
      return 'text-red-600 bg-red-100'
    case 'media':
      return 'text-yellow-600 bg-yellow-100'
    case 'baixa':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export default function FuncionarioDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<FuncionarioStats | null>(null)
  const [minhasOS, setMinhasOS] = useState<MinhaOS[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Carregar dados do dashboard
  const loadDashboardData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const result = await getFuncionarioDashboardData(user.id)
      
      if (result.data) {
        setStats(result.data.stats)
        setMinhasOS(result.data.minhasOS)
        setPerformanceData(result.data.performanceData)
      } else if (result.error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do dashboard",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do dashboard",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [user?.id])

  const progressoMeta = stats ? (stats.horasTrabalhadasMes / stats.metaMensal) * 100 : 0

  // Handlers para botões
  const handleAtualizarProgresso = async (osId: string) => {
    try {
      // Em uma implementação real, isso abriria um modal para editar
      const novoProgresso = Math.min(100, Math.random() * 100)
      const result = await updateOSProgress(osId, novoProgresso, 'Progresso atualizado')
      
      if (result.data) {
        toast({
          title: "Progresso atualizado",
          description: `OS ${osId} atualizada com sucesso`,
        })
        await loadDashboardData() // Recarregar dados
      } else {
        throw result.error
      }
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar progresso da OS",
        variant: "destructive",
      })
    }
  }

  const handleVerDetalhes = (osId: string) => {
    window.location.href = `/dashboard/os/${osId}`
  }

  const handleVerOS = () => {
    window.location.href = '/dashboard/os'
  }

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
    toast({
      title: isTimerRunning ? "Timer pausado" : "Timer iniciado",
      description: isTimerRunning ? "Tempo de trabalho pausado" : "Tempo de trabalho iniciado",
    })
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="funcionario">
        <DashboardLayout title={`Dashboard - ${user?.name}`}>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="funcionario">
      <DashboardLayout title={`Dashboard - ${user?.name}`}>
        <div className="space-y-6">
          {/* Controle de Tempo */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Controle de Tempo de Trabalho
                  </h2>
                  <p className="text-gray-600">
                    {stats?.horasTrabalhadasMes}h de {stats?.metaMensal}h trabalhadas este mês
                  </p>
                  <Progress value={progressoMeta} className="w-64 mt-2" />
                </div>
                <Button
                  onClick={handleToggleTimer}
                  variant={isTimerRunning ? "destructive" : "default"}
                  size="lg"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Iniciar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="OS Atribuídas"
              value={stats?.osAtribuidas || 0}
              icon={FileText}
              change={{
                value: 15,
                type: 'increase',
                period: 'este mês'
              }}
            />
            <StatsCard
              title="Em Andamento"
              value={stats?.osEmAndamento || 0}
              icon={Clock}
              variant="warning"
            />
            <StatsCard
              title="Concluídas"
              value={stats?.osConcluidas || 0}
              icon={CheckCircle}
              variant="success"
              change={{
                value: 20,
                type: 'increase',
                period: 'vs. mês anterior'
              }}
            />
            <StatsCard
              title="Clientes Ativos"
              value={stats?.clientesAtivos || 0}
              icon={Users}
            />
          </div>

          {/* Métricas de Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Tempo Médio de Resolução"
              value={`${performanceData?.resolutionTime || 0} dias`}
              icon={Target}
              variant="success"
            />
            <StatsCard
              title="Satisfação do Cliente"
              value={`${performanceData?.customerSatisfaction || 0}/5`}
              icon={Zap}
              variant="success"
            />
            <StatsCard
              title="Eficiência"
              value={`${performanceData?.efficiency || 0}%`}
              icon={Target}
              variant="success"
            />
            <StatsCard
              title="Tarefas Completadas"
              value={performanceData?.tasksCompleted || 0}
              icon={CheckCircle}
              variant="success"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Minhas OS */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Minhas Ordens de Serviço</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleVerOS}
                >
                  Ver Todas
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {minhasOS.length > 0 ? minhasOS.slice(0, 5).map((os) => (
                    <div key={os.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{os.titulo}</h3>
                          <p className="text-xs text-gray-500">#{os.id}</p>
                          <p className="text-xs text-gray-400">
                            {os.created_at ? new Date(os.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(os.status)}`}>
                            {os.status === 'em_andamento' ? 'Em Andamento' :
                             os.status === 'pendente' ? 'Pendente' : 
                             os.status === 'concluida' ? 'Concluída' : os.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(os.prioridade)}`}>
                            {os.prioridade === 'alta' ? 'Alta' :
                             os.prioridade === 'critica' ? 'Crítica' :
                             os.prioridade === 'media' ? 'Média' : 
                             os.prioridade === 'baixa' ? 'Baixa' : os.prioridade}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerDetalhes(os.id)}
                        >
                          Ver Detalhes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAtualizarProgresso(os.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Atualizar
                        </Button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhuma OS atribuída</p>
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
                  onClick={handleVerOS}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Todas as OS
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/dashboard/configuracoes'}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Meu Calendário
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast({ title: "Em desenvolvimento", description: "Funcionalidade em desenvolvimento" })}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 