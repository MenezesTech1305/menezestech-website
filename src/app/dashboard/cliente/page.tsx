"use client"

import { useState, useEffect } from "react"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { getClienteDashboardData } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  DollarSign,
  AlertTriangle,
  Eye,
  Download,
  MessageSquare,
  Star,
  Calendar
} from "lucide-react"

interface ClienteStats {
  osAbertas: number
  osConcluidas: number
  valorContratado: number
  proximoPagamento: number
  satisfacao: number
}

interface MinhaOS {
  id: string
  titulo: string
  status: string
  prioridade: string
  created_at: string | null
  responsavel_id: string | null
}

interface Fatura {
  id: string
  valor: number
  data_vencimento: string
  status: string
  descricao: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'concluida':
      return 'bg-green-100 text-green-800'
    case 'em_andamento':
      return 'bg-blue-100 text-blue-800'
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800'
    case 'pago':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function ClienteDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<ClienteStats | null>(null)
  const [minhasOS, setMinhasOS] = useState<MinhaOS[]>([])
  const [faturas, setFaturas] = useState<Fatura[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar dados do dashboard
  const loadDashboardData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const result = await getClienteDashboardData(user.id)
      
      if (result.data) {
        setStats(result.data.stats)
        setMinhasOS(result.data.minhasOS)
        setFaturas(result.data.faturas)
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

  // Handlers para botões
  const handleVerOS = (osId: string) => {
    window.location.href = `/dashboard/os/${osId}`
  }

  const handleBaixarFatura = (faturaId: string) => {
    toast({
      title: "Em desenvolvimento",
      description: "Download de fatura em desenvolvimento",
    })
  }

  const handleNovaOS = () => {
    toast({
      title: "Nova solicitação",
      description: "Entre em contato conosco para solicitar um novo serviço!",
    })
  }

  const handleContato = () => {
    toast({
      title: "Contato",
      description: "Redirecionando para nossos canais de atendimento",
    })
  }

  const handleAvaliacao = () => {
    toast({
      title: "Em desenvolvimento",
      description: "Sistema de avaliação em desenvolvimento",
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="cliente">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="cliente">
      <div className="space-y-6">
          {/* Boas-vindas */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Bem-vindo(a), {user?.name}!
                  </h2>
                  <p className="text-gray-600">
                    Acompanhe o andamento dos seus projetos e serviços contratados.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleNovaOS}>
                    <FileText className="h-4 w-4 mr-2" />
                    Nova Solicitação
                  </Button>
                  <Button variant="outline" onClick={handleContato}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contato
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatsCard
              title="OS em Aberto"
              value={stats?.osAbertas || 0}
              icon={Clock}
              variant="warning"
            />
            <StatsCard
              title="OS Concluídas"
              value={stats?.osConcluidas || 0}
              icon={CheckCircle}
              variant="success"
            />
            <StatsCard
              title="Valor Contratado"
              value={formatCurrency(stats?.valorContratado || 0)}
              icon={DollarSign}
              variant="success"
            />
            <StatsCard
              title="Próximo Pagamento"
              value={formatCurrency(stats?.proximoPagamento || 0)}
              icon={AlertTriangle}
              variant="warning"
            />
            <StatsCard
              title="Satisfação"
              value={`${stats?.satisfacao || 0}/5`}
              icon={Star}
              variant="success"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Minhas OS */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Minhas Ordens de Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {minhasOS.length > 0 ? minhasOS.map((os) => (
                    <div key={os.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{os.titulo}</h3>
                          <p className="text-xs text-gray-500">#{os.id}</p>
                          <p className="text-xs text-gray-400">
                            {os.created_at ? new Date(os.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(os.status)}`}>
                          {os.status === 'em_andamento' ? 'Em Andamento' :
                           os.status === 'pendente' ? 'Pendente' : 
                           os.status === 'concluida' ? 'Concluída' : os.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerOS(os.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAvaliacao}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Avaliar
                        </Button>
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

            {/* Faturas */}
            <Card>
              <CardHeader>
                <CardTitle>Faturas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {faturas.length > 0 ? faturas.slice(0, 5).map((fatura) => (
                    <div key={fatura.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{formatCurrency(fatura.valor)}</p>
                          <p className="text-xs text-gray-600">{fatura.descricao}</p>
                          <p className="text-xs text-gray-500">
                            Venc: {new Date(fatura.data_vencimento).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fatura.status)}`}>
                          {fatura.status === 'pago' ? 'Pago' : 
                           fatura.status === 'pendente' ? 'Pendente' : 
                           fatura.status === 'vencido' ? 'Vencido' : fatura.status}
                        </span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => handleBaixarFatura(fatura.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-8">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhuma fatura encontrada</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={handleNovaOS}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-sm">Solicitar Serviço</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={handleContato}
                >
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <span className="text-sm">Falar com Suporte</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={handleAvaliacao}
                >
                  <Star className="h-6 w-6 mb-2" />
                  <span className="text-sm">Avaliar Serviços</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
    </ProtectedRoute>
  )
} 