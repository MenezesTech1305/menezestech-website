"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { FinancialCard } from "@/components/financeiro/financial-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { 
  DollarSign, 
  CreditCard,
  AlertTriangle,
  Clock,
  Plus,
  Download,
  CheckCircle,
  TrendingDown,
  Building,
  Calendar,
  Flag,
  Edit,
  Eye
} from "lucide-react"
import { ContaPagar } from "@/types/financial"
import { cn } from "@/lib/utils"

// Dados mockados realistas para contas a pagar da MenezesTech
const mockContasPagar: ContaPagar[] = [
  {
    id: "CP-2024-001",
    numero: "2024001",
    fornecedor: "Microsoft Brasil",
    descricao: "Licenças Office 365 - Fevereiro",
    valor: 3200,
    dataVencimento: "2024-02-10",
    dataEmissao: "2024-01-10",
    status: "pendente",
    categoria: "licencas",
    prioridade: "alta",
    recorrente: true,
    proximoVencimento: "2024-03-10"
  },
  {
    id: "CP-2024-002",
    numero: "2024002",
    fornecedor: "Dell Technologies",
    descricao: "Servidor PowerEdge R740",
    valor: 12000,
    dataVencimento: "2024-02-20",
    dataEmissao: "2024-01-20",
    status: "pendente",
    categoria: "equipamentos",
    prioridade: "media",
    recorrente: false
  },
  {
    id: "CP-2024-003",
    numero: "2024003",
    fornecedor: "Contabilidade Santos",
    descricao: "Serviços Contábeis - Janeiro",
    valor: 1500,
    dataVencimento: "2024-01-25",
    dataEmissao: "2024-01-01",
    status: "vencido",
    categoria: "contabilidade",
    prioridade: "media",
    recorrente: true,
    proximoVencimento: "2024-02-25"
  },
  {
    id: "CP-2024-004",
    numero: "2024004",
    fornecedor: "Imobiliária Centro",
    descricao: "Aluguel Escritório - Fevereiro",
    valor: 4000,
    dataVencimento: "2024-02-05",
    dataEmissao: "2024-01-25",
    status: "pago",
    categoria: "aluguel",
    prioridade: "alta",
    recorrente: true,
    proximoVencimento: "2024-03-05",
    dataPagamento: "2024-02-03",
    formaPagamento: "pix"
  },
  {
    id: "CP-2024-005",
    numero: "2024005",
    fornecedor: "Marketing Digital Pro",
    descricao: "Campanha Google Ads - Janeiro",
    valor: 2500,
    dataVencimento: "2024-02-15",
    dataEmissao: "2024-02-01",
    status: "pendente",
    categoria: "marketing",
    prioridade: "baixa",
    recorrente: false
  },
  {
    id: "CP-2024-006",
    numero: "2024006",
    fornecedor: "Telefônica Brasil",
    descricao: "Internet + Telefonia - Janeiro",
    valor: 800,
    dataVencimento: "2024-01-15",
    dataEmissao: "2024-01-01",
    status: "pago",
    categoria: "outros",
    prioridade: "media",
    recorrente: true,
    proximoVencimento: "2024-02-15",
    dataPagamento: "2024-01-10",
    formaPagamento: "boleto"
  },
  {
    id: "CP-2024-007",
    numero: "2024007",
    fornecedor: "VMware Inc.",
    descricao: "Licenças vSphere - Anual",
    valor: 8500,
    dataVencimento: "2024-02-28",
    dataEmissao: "2024-02-01",
    status: "agendado",
    categoria: "licencas",
    prioridade: "alta",
    recorrente: false
  }
]

export default function ContasPagarPage() {
  const { user } = useAuth()
  const [contasPagar, setContasPagar] = useState(mockContasPagar)
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false)
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'vencido' | 'pago' | 'agendado'>('todos')
  const [newExpenseData, setNewExpenseData] = useState({
    fornecedor: '',
    categoria: 'outros' as ContaPagar['categoria'],
    descricao: '',
    valor: '',
    dataVencimento: '',
    prioridade: 'media' as ContaPagar['prioridade'],
    recorrente: false
  })

  // Calcular métricas
  const totalEmAberto = contasPagar
    .filter(conta => ['pendente', 'vencido', 'agendado'].includes(conta.status))
    .reduce((sum, conta) => sum + conta.valor, 0)

  const totalVencido = contasPagar
    .filter(conta => conta.status === 'vencido')
    .reduce((sum, conta) => sum + conta.valor, 0)

  const totalPago = contasPagar
    .filter(conta => conta.status === 'pago')
    .reduce((sum, conta) => sum + conta.valor, 0)

  const quantidadeVencidas = contasPagar.filter(conta => conta.status === 'vencido').length

  const getStatusColor = (status: ContaPagar['status']) => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'vencido':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'agendado':
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getStatusText = (status: ContaPagar['status']) => {
    switch (status) {
      case 'pago': return 'Pago'
      case 'pendente': return 'Pendente'
      case 'vencido': return 'Vencido'
      case 'agendado': return 'Agendado'
    }
  }

  const getPriorityColor = (prioridade: ContaPagar['prioridade']) => {
    switch (prioridade) {
      case 'critica': return 'bg-red-100 text-red-800'
      case 'alta': return 'bg-orange-100 text-orange-800'
      case 'media': return 'bg-yellow-100 text-yellow-800'
      case 'baixa': return 'bg-green-100 text-green-800'
    }
  }

  const getCategoryColor = (categoria: ContaPagar['categoria']) => {
    switch (categoria) {
      case 'licencas': return 'bg-purple-100 text-purple-800'
      case 'equipamentos': return 'bg-blue-100 text-blue-800'
      case 'aluguel': return 'bg-green-100 text-green-800'
      case 'salarios': return 'bg-indigo-100 text-indigo-800'
      case 'marketing': return 'bg-pink-100 text-pink-800'
      case 'contabilidade': return 'bg-gray-100 text-gray-800'
      case 'outros': return 'bg-slate-100 text-slate-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const getDaysOverdue = (vencimento: string) => {
    const today = new Date()
    const dueDate = new Date(vencimento)
    const diffTime = today.getTime() - dueDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const handleMarkAsPaid = (id: string) => {
    setContasPagar(prev => prev.map(conta => 
      conta.id === id 
        ? { 
            ...conta, 
            status: 'pago' as const,
            dataPagamento: new Date().toISOString().split('T')[0],
            formaPagamento: 'pix' as const
          }
        : conta
    ))
  }

  const handleViewExpense = (id: string) => {
    const conta = contasPagar.find(c => c.id === id)
    if (conta) {
      alert(`Visualizando despesa:\n\nFornecedor: ${conta.fornecedor}\nValor: ${formatCurrency(conta.valor)}\nVencimento: ${formatDate(conta.dataVencimento)}\nStatus: ${conta.status}\nPrioridade: ${conta.prioridade}`)
    }
  }

  const handleEditExpense = (id: string) => {
    const conta = contasPagar.find(c => c.id === id)
    if (conta) {
      alert(`Editando despesa de ${conta.fornecedor}.\nFuncionalidade completa será implementada em breve!`)
    }
  }

  const handleCreateExpense = () => {
    if (!newExpenseData.fornecedor || !newExpenseData.valor || !newExpenseData.dataVencimento) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const newExpense: ContaPagar = {
      id: `CP-2024-${String(contasPagar.length + 1).padStart(3, '0')}`,
      numero: `2024${String(contasPagar.length + 1).padStart(3, '0')}`,
      fornecedor: newExpenseData.fornecedor,
      descricao: newExpenseData.descricao || `Despesa - ${newExpenseData.categoria}`,
      valor: parseFloat(newExpenseData.valor),
      dataVencimento: newExpenseData.dataVencimento,
      dataEmissao: new Date().toISOString().split('T')[0],
      status: 'pendente',
      categoria: newExpenseData.categoria,
      prioridade: newExpenseData.prioridade,
      recorrente: newExpenseData.recorrente
    }

    setContasPagar(prev => [...prev, newExpense])
    setNewExpenseData({
      fornecedor: '',
      categoria: 'outros',
      descricao: '',
      valor: '',
      dataVencimento: '',
      prioridade: 'media',
      recorrente: false
    })
    setIsNewExpenseModalOpen(false)
    alert('Despesa criada com sucesso!')
  }

  const filteredContas = contasPagar.filter(conta => 
    filter === 'todos' || conta.status === filter
  )

  return (
    <ProtectedRoute requiredRole={['superadmin', 'admin']}>
      <DashboardLayout title="Contas a Pagar">
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FinancialCard
              title="Total em Aberto"
              value={totalEmAberto}
              icon={DollarSign}
              variant="warning"
            />
            <FinancialCard
              title="Total Vencido"
              value={totalVencido}
              icon={AlertTriangle}
              variant="danger"
            />
            <FinancialCard
              title="Total Pago"
              value={totalPago}
              icon={CheckCircle}
              variant="success"
            />
            <FinancialCard
              title="Vencidas"
              value={quantidadeVencidas.toString()}
              icon={Clock}
              variant="danger"
            />
          </div>

          {/* Filtros e Ações */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <CardTitle>Contas a Pagar ({filteredContas.length})</CardTitle>
                
                <div className="flex gap-4">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todos</option>
                    <option value="pendente">Pendente</option>
                    <option value="vencido">Vencido</option>
                    <option value="agendado">Agendado</option>
                    <option value="pago">Pago</option>
                  </select>
                  
                  <Button onClick={() => setIsNewExpenseModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Despesa
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Lista de Contas */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                {filteredContas.map((conta) => (
                  <div key={conta.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                      {/* Info Principal */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">
                            #{conta.numero}
                          </span>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium border",
                            getStatusColor(conta.status)
                          )}>
                            {getStatusText(conta.status)}
                          </span>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getPriorityColor(conta.prioridade)
                          )}>
                            {conta.prioridade}
                          </span>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getCategoryColor(conta.categoria)
                          )}>
                            {conta.categoria}
                          </span>
                          {conta.recorrente && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              Recorrente
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span><strong>Fornecedor:</strong> {conta.fornecedor}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span><strong>Vencimento:</strong> {formatDate(conta.dataVencimento)}</span>
                            {conta.status === 'vencido' && (
                              <span className="text-red-600 text-xs">
                                ({getDaysOverdue(conta.dataVencimento)} dias)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span><strong>Valor:</strong> {formatCurrency(conta.valor)}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600">{conta.descricao}</p>
                        
                        {conta.recorrente && conta.proximoVencimento && (
                          <p className="text-xs text-blue-600">
                            Próximo vencimento: {formatDate(conta.proximoVencimento)}
                          </p>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewExpense(conta.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        
                        {(conta.status === 'pendente' || conta.status === 'vencido') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsPaid(conta.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Marcar Pago
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditExpense(conta.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredContas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p>Nenhuma conta encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modal Nova Despesa */}
          {isNewExpenseModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Nova Despesa</h2>
                    <Button 
                      variant="ghost"
                      onClick={() => setIsNewExpenseModalOpen(false)}
                    >
                      ✕
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fornecedor
                        </label>
                        <input 
                          type="text"
                          value={newExpenseData.fornecedor}
                          onChange={(e) => setNewExpenseData(prev => ({...prev, fornecedor: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nome do fornecedor"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoria
                        </label>
                        <select 
                          value={newExpenseData.categoria}
                          onChange={(e) => setNewExpenseData(prev => ({...prev, categoria: e.target.value as ContaPagar['categoria']}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="licencas">Licenças</option>
                          <option value="equipamentos">Equipamentos</option>
                          <option value="aluguel">Aluguel</option>
                          <option value="salarios">Salários</option>
                          <option value="marketing">Marketing</option>
                          <option value="contabilidade">Contabilidade</option>
                          <option value="outros">Outros</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea 
                        rows={3}
                        value={newExpenseData.descricao}
                        onChange={(e) => setNewExpenseData(prev => ({...prev, descricao: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Descrição da despesa..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor (R$)
                        </label>
                        <input 
                          type="number"
                          step="0.01"
                          value={newExpenseData.valor}
                          onChange={(e) => setNewExpenseData(prev => ({...prev, valor: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vencimento
                        </label>
                        <input 
                          type="date"
                          value={newExpenseData.dataVencimento}
                          onChange={(e) => setNewExpenseData(prev => ({...prev, dataVencimento: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prioridade
                        </label>
                        <select 
                          value={newExpenseData.prioridade}
                          onChange={(e) => setNewExpenseData(prev => ({...prev, prioridade: e.target.value as ContaPagar['prioridade']}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="baixa">Baixa</option>
                          <option value="media">Média</option>
                          <option value="alta">Alta</option>
                          <option value="critica">Crítica</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="recorrente"
                        checked={newExpenseData.recorrente}
                        onChange={(e) => setNewExpenseData(prev => ({...prev, recorrente: e.target.checked}))}
                        className="rounded"
                      />
                      <label htmlFor="recorrente" className="text-sm text-gray-700">
                        Despesa recorrente
                      </label>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsNewExpenseModalOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateExpense}>
                        Criar Despesa
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 