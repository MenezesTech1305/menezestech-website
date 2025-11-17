"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Loader2, 
  Calendar, 
  User, 
  Building, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  X,
  MessageSquare,
  FileText,
  TrendingUp
} from "lucide-react"

interface OSDetailsProps {
  osId: string
  onEdit?: () => void
  onClose?: () => void
}

interface OSData {
  id: string
  numero: string
  titulo: string
  descricao?: string
  status: string
  prioridade: string
  categoria: string
  data_abertura: string
  data_vencimento?: string
  data_inicio?: string
  data_conclusao?: string
  valor_orcado?: number
  valor_final?: number
  observacoes?: string
  cliente: {
    id: string
    name: string
    email: string
    company?: string
  }
  responsavel?: {
    id: string
    name: string
    email: string
  }
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
  const statusMap: Record<string, string> = {
    'concluida': 'Concluída',
    'em_andamento': 'Em Andamento',
    'pendente': 'Pendente',
    'aguardando_cliente': 'Aguardando Cliente',
    'cancelada': 'Cancelada'
  }
  return statusMap[status] || status
}

const getPriorityText = (priority: string) => {
  const priorityMap: Record<string, string> = {
    'critica': 'Crítica',
    'alta': 'Alta',
    'media': 'Média',
    'baixa': 'Baixa'
  }
  return priorityMap[priority] || priority
}

const getCategoryText = (category: string) => {
  const categoryMap: Record<string, string> = {
    'lgpd': 'LGPD',
    'infraestrutura': 'Infraestrutura',
    'backup': 'Backup',
    'seguranca': 'Segurança',
    'consultoria': 'Consultoria',
    'manutencao': 'Manutenção'
  }
  return categoryMap[category] || category
}

export function OSDetails({ osId, onEdit, onClose }: OSDetailsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [osData, setOSData] = useState<OSData | null>(null)
  const [editingObservacoes, setEditingObservacoes] = useState(false)
  const [observacoes, setObservacoes] = useState("")
  const [savingObservacoes, setSavingObservacoes] = useState(false)

  useEffect(() => {
    loadOSData()
  }, [osId])

  const loadOSData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ordens_servico')
        .select(`
          *,
          cliente:users!ordens_servico_cliente_id_fkey(id, name, email, company),
          responsavel:users!ordens_servico_responsavel_id_fkey(id, name, email)
        `)
        .eq('id', osId)
        .single()

      if (error) throw error

      setOSData(data)
      setObservacoes(data.observacoes || "")
    } catch (error) {
      console.error('Erro ao carregar OS:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar detalhes da OS",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveObservacoes = async () => {
    try {
      setSavingObservacoes(true)
      const { error } = await supabase
        .from('ordens_servico')
        .update({ observacoes: observacoes.trim() || null })
        .eq('id', osId)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Observações atualizadas com sucesso!",
      })

      setEditingObservacoes(false)
      await loadOSData()
    } catch (error) {
      console.error('Erro ao salvar observações:', error)
      toast({
        title: "Erro",
        description: "Falha ao salvar observações",
        variant: "destructive",
      })
    } finally {
      setSavingObservacoes(false)
    }
  }

  const handleChangeStatus = async (newStatus: string) => {
    try {
      const updateData: any = { status: newStatus }
      
      // Atualizar datas baseado no status
      if (newStatus === 'em_andamento' && !osData?.data_inicio) {
        updateData.data_inicio = new Date().toISOString()
      } else if (newStatus === 'concluida' && !osData?.data_conclusao) {
        updateData.data_conclusao = new Date().toISOString()
      }

      const { error } = await supabase
        .from('ordens_servico')
        .update(updateData)
        .eq('id', osId)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: `Status alterado para ${getStatusText(newStatus)}`,
      })

      await loadOSData()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      toast({
        title: "Erro",
        description: "Falha ao alterar status",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (value?: number) => {
    if (!value) return "Não definido"
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatDate = (date?: string) => {
    if (!date) return "Não definido"
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const calculateProgress = () => {
    if (!osData) return 0
    
    switch (osData.status) {
      case 'pendente':
        return 0
      case 'em_andamento':
        return 50
      case 'aguardando_cliente':
        return 75
      case 'concluida':
        return 100
      case 'cancelada':
        return 0
      default:
        return 0
    }
  }

  const canEdit = user && ['superadmin', 'admin', 'funcionario'].includes(user.role)

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    )
  }

  if (!osData) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>OS não encontrada</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <CardTitle className="text-2xl">{osData.titulo}</CardTitle>
                <Badge className={getPriorityColor(osData.prioridade)}>
                  {getPriorityText(osData.prioridade)}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">OS #{osData.numero}</p>
            </div>
            <div className="flex space-x-2">
              {canEdit && onEdit && (
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  <X className="h-4 w-4 mr-2" />
                  Fechar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status e Progresso */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">Status:</span>
                {canEdit ? (
                  <select
                    value={osData.status}
                    onChange={(e) => handleChangeStatus(e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(osData.status)}`}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="aguardando_cliente">Aguardando Cliente</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                ) : (
                  <Badge className={getStatusColor(osData.status)}>
                    {getStatusText(osData.status)}
                  </Badge>
                )}
              </div>
              <span className="text-sm text-gray-600">
                Categoria: <strong>{getCategoryText(osData.categoria)}</strong>
              </span>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso</span>
                <span className="font-medium">{calculateProgress()}%</span>
              </div>
              <Progress value={calculateProgress()} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-medium">{osData.cliente.name}</p>
              <p className="text-sm text-gray-600">{osData.cliente.email}</p>
              {osData.cliente.company && (
                <p className="text-sm text-gray-600">{osData.cliente.company}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Responsável */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2" />
              Responsável
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {osData.responsavel ? (
              <div>
                <p className="font-medium">{osData.responsavel.name}</p>
                <p className="text-sm text-gray-600">{osData.responsavel.email}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Não atribuído</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Datas e Valores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Datas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Datas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Abertura:</span>
              <span className="text-sm font-medium">{formatDate(osData.data_abertura)}</span>
            </div>
            {osData.data_inicio && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Início:</span>
                <span className="text-sm font-medium">{formatDate(osData.data_inicio)}</span>
              </div>
            )}
            {osData.data_vencimento && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Vencimento:</span>
                <span className="text-sm font-medium">{formatDate(osData.data_vencimento)}</span>
              </div>
            )}
            {osData.data_conclusao && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Conclusão:</span>
                <span className="text-sm font-medium">{formatDate(osData.data_conclusao)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Valores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Valores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Orçado:</span>
              <span className="text-sm font-medium">{formatCurrency(osData.valor_orcado)}</span>
            </div>
            {osData.valor_final && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Final:</span>
                <span className="text-sm font-medium">{formatCurrency(osData.valor_final)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Descrição */}
      {osData.descricao && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Descrição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{osData.descricao}</p>
          </CardContent>
        </Card>
      )}

      {/* Observações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Observações
            </CardTitle>
            {canEdit && !editingObservacoes && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingObservacoes(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingObservacoes ? (
            <div className="space-y-4">
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={4}
                placeholder="Adicione observações sobre esta OS..."
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingObservacoes(false)
                    setObservacoes(osData.observacoes || "")
                  }}
                  disabled={savingObservacoes}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveObservacoes}
                  disabled={savingObservacoes}
                >
                  {savingObservacoes ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {osData.observacoes || "Nenhuma observação adicionada"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
