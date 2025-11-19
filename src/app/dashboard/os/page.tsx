"use client"

import { useState, useEffect } from "react"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { getOrdensServico, updateOSProgress } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Calendar,
  User,
  Building,
  Save,
  X
} from "lucide-react"

interface OS {
  id: string
  titulo: string
  descricao?: string
  cliente_id: string
  responsavel_id?: string | null
  status: 'pendente' | 'em_andamento' | 'aguardando_cliente' | 'concluida' | 'cancelada'
  prioridade: 'baixa' | 'media' | 'alta' | 'critica'
  created_at: string | null
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'concluida':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'em_andamento':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'aguardando_cliente':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'cancelada':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critica':
      return 'bg-red-600 text-white'
    case 'alta':
      return 'bg-red-100 text-red-800'
    case 'media':
      return 'bg-yellow-100 text-yellow-800'
    case 'baixa':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'concluida':
      return 'Concluída'
    case 'em_andamento':
      return 'Em Andamento'
    case 'pendente':
      return 'Pendente'
    case 'aguardando_cliente':
      return 'Aguardando Cliente'
    case 'cancelada':
      return 'Cancelada'
    default:
      return status
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'critica':
      return 'Crítica'
    case 'alta':
      return 'Alta'
    case 'media':
      return 'Média'
    case 'baixa':
      return 'Baixa'
    default:
      return priority
  }
}

export default function OSManagement() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [osData, setOSData] = useState<OS[]>([])
  const [filteredOS, setFilteredOS] = useState<OS[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [priorityFilter, setPriorityFilter] = useState("todas")

  // Carregar ordens de serviço
  const loadOS = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      
      // Aplicar filtros baseados no tipo de usuário
      if (user?.role === 'funcionario') {
        filters.responsavel_id = user.id
      } else if (user?.role === 'cliente') {
        filters.cliente_id = user.id
      }

      const result = await getOrdensServico(filters)
      
      if (result.data) {
        setOSData(result.data)
        setFilteredOS(result.data)
      } else if (result.error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar ordens de serviço",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erro ao carregar OS:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar ordens de serviço",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOS()
  }, [user?.id])

  // Calcular estatísticas
  const stats = {
    total: osData.length,
    pendentes: osData.filter(os => os.status === 'pendente').length,
    emAndamento: osData.filter(os => os.status === 'em_andamento').length,
    concluidas: osData.filter(os => os.status === 'concluida').length,
    aguardandoCliente: osData.filter(os => os.status === 'aguardando_cliente').length,
  }

  // Filtrar OS
  useEffect(() => {
    let filtered = osData

    // Filtro por texto
    if (searchTerm) {
      filtered = filtered.filter(os => 
        os.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        os.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por status
    if (statusFilter !== "todos") {
      filtered = filtered.filter(os => os.status === statusFilter)
    }

    // Filtro por prioridade
    if (priorityFilter !== "todas") {
      filtered = filtered.filter(os => os.prioridade === priorityFilter)
    }

    setFilteredOS(filtered)
  }, [osData, searchTerm, statusFilter, priorityFilter])

  // Handlers
  const handleStatusChange = async (osId: string, newStatus: string) => {
    try {
      // Implementar mudança de status via API
      toast({
        title: "Status atualizado",
        description: `OS ${osId} atualizada para ${getStatusText(newStatus)}`,
      })
      await loadOS() // Recarregar dados
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar status da OS",
        variant: "destructive",
      })
    }
  }

  const handleCreateNewOS = () => {
    window.location.href = '/dashboard/os/nova'
  }

  const handleViewOS = (osId: string) => {
    window.location.href = `/dashboard/os/${osId}`
  }

  const handleEditOS = (osId: string) => {
    window.location.href = `/dashboard/os/${osId}`
  }

  const handleDeleteOS = (osId: string) => {
    toast({
      title: "Em desenvolvimento",
      description: "Exclusão de OS em desenvolvimento",
    })
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole={['superadmin', 'admin', 'funcionario', 'cliente']}>
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole={['superadmin', 'admin', 'funcionario', 'cliente']}>
      <div className="space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatsCard
              title="Total"
              value={stats.total}
              icon={FileText}
            />
            <StatsCard
              title="Pendentes"
              value={stats.pendentes}
              icon={Clock}
              variant="warning"
            />
            <StatsCard
              title="Em Andamento"
              value={stats.emAndamento}
              icon={Play}
              variant="default"
            />
            <StatsCard
              title="Concluídas"
              value={stats.concluidas}
              icon={CheckCircle}
              variant="success"
            />
            <StatsCard
              title="Aguardando Cliente"
              value={stats.aguardandoCliente}
              icon={AlertTriangle}
              variant="warning"
            />
          </div>

          {/* Filtros e Ações */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle>Ordens de Serviço</CardTitle>
                {['superadmin', 'admin'].includes(user?.role || '') && (
                  <Button onClick={handleCreateNewOS}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova OS
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      placeholder="Buscar por título ou ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="aguardando_cliente">Aguardando Cliente</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                
                <div className="w-48">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todas">Todas as Prioridades</option>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
              </div>

              {/* Lista de OS */}
              <div className="space-y-4">
                {filteredOS.length > 0 ? filteredOS.map((os) => (
                  <div key={os.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{os.titulo}</h3>
                        <p className="text-sm text-gray-600">#{os.id}</p>
                        <p className="text-xs text-gray-500">
                          {os.created_at ? new Date(os.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
                        </p>
                        {os.descricao && (
                          <p className="text-sm text-gray-600 mt-2">{os.descricao}</p>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(os.status)}`}>
                          {getStatusText(os.status)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(os.prioridade)}`}>
                          {getPriorityText(os.prioridade)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOS(os.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        
                        {(['superadmin', 'admin', 'funcionario'].includes(user?.role || '') || 
                          user?.id === os.responsavel_id) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditOS(os.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        )}
                        
                        {['superadmin', 'admin'].includes(user?.role || '') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOS(os.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </Button>
                        )}
                      </div>
                      
                      {(['superadmin', 'admin', 'funcionario'].includes(user?.role || '') || 
                        user?.id === os.responsavel_id) && (
                        <div className="w-48">
                          <select
                            value={os.status}
                            onChange={(e) => handleStatusChange(os.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pendente">Pendente</option>
                            <option value="em_andamento">Em Andamento</option>
                            <option value="aguardando_cliente">Aguardando Cliente</option>
                            <option value="concluida">Concluída</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma OS encontrada</h3>
                    <p className="text-sm">
                      {searchTerm || statusFilter !== "todos" || priorityFilter !== "todas"
                        ? "Tente ajustar os filtros para ver mais resultados"
                        : "Não há ordens de serviço para exibir"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
    </ProtectedRoute>
  )
} 