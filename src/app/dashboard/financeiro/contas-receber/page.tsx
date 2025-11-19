"use client"

import { useState } from "react"
import { InvoiceTable } from "@/components/financeiro/invoice-table"
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
  Send,
  CheckCircle,
  TrendingUp
} from "lucide-react"
import { ContaReceber } from "@/types/financial"

// Dados mockados expandidos para contas a receber
const mockContasReceber: ContaReceber[] = [
  {
    id: "CR-2024-001",
    numero: "2024001",
    cliente: "Cartório Santos Central",
    clienteId: "cli-001",
    descricao: "Implementação LGPD Completa + Auditoria",
    osId: "OS-2024-001",
    valor: 15000,
    dataVencimento: "2024-01-25",
    dataEmissao: "2024-01-10",
    status: "vencido",
    categoria: "lgpd",
    tentativasCobranca: 2,
    ultimaCobranca: "2024-01-30"
  },
  {
    id: "CR-2024-002",
    numero: "2024002",
    cliente: "Empresa ABC Ltda",
    clienteId: "cli-002",
    descricao: "Migração Servidor Cloud + Backup Automático",
    osId: "OS-2024-002",
    valor: 8500,
    dataVencimento: "2024-02-15",
    dataEmissao: "2024-01-15",
    status: "pendente",
    categoria: "infraestrutura",
    tentativasCobranca: 0
  },
  {
    id: "CR-2024-003",
    numero: "2024003",
    cliente: "Advocacia Menezes & Associados",
    clienteId: "cli-003",
    descricao: "Auditoria de Segurança + Implementação VPN",
    osId: "OS-2024-003",
    valor: 5500,
    dataVencimento: "2024-02-05",
    dataEmissao: "2024-01-05",
    status: "pago",
    categoria: "seguranca",
    tentativasCobranca: 0,
    dataPagamento: "2024-02-03",
    formaPagamento: "pix",
    valorPago: 5500
  },
  {
    id: "CR-2024-004",
    numero: "2024004",
    cliente: "Cartório Registro Civil",
    clienteId: "cli-004",
    descricao: "Manutenção Mensal Sistemas",
    valor: 2800,
    dataVencimento: "2024-02-20",
    dataEmissao: "2024-02-01",
    status: "pendente",
    categoria: "manutencao",
    tentativasCobranca: 0
  },
  {
    id: "CR-2024-005",
    numero: "2024005",
    cliente: "Construtora Silva",
    clienteId: "cli-005",
    descricao: "Consultoria Infraestrutura TI",
    valor: 4200,
    dataVencimento: "2024-01-30",
    dataEmissao: "2024-01-10",
    status: "vencido",
    categoria: "consultoria",
    tentativasCobranca: 1,
    ultimaCobranca: "2024-02-05"
  },
  {
    id: "CR-2024-006",
    numero: "2024006",
    cliente: "Farmácia Popular",
    clienteId: "cli-006",
    descricao: "Sistema de Backup + Monitoramento",
    valor: 3800,
    dataVencimento: "2024-02-25",
    dataEmissao: "2024-02-01",
    status: "pendente",
    categoria: "backup",
    tentativasCobranca: 0
  },
  {
    id: "CR-2024-007",
    numero: "2024007",
    cliente: "Clínica São José",
    clienteId: "cli-007",
    descricao: "Implementação LGPD Setor Saúde",
    valor: 12000,
    dataVencimento: "2024-02-28",
    dataEmissao: "2024-02-05",
    status: "pendente",
    categoria: "lgpd",
    tentativasCobranca: 0
  },
  {
    id: "CR-2024-008",
    numero: "2024008",
    cliente: "Empresa ABC Ltda",
    clienteId: "cli-002",
    descricao: "Suporte Técnico Janeiro",
    valor: 1500,
    dataVencimento: "2024-01-20",
    dataEmissao: "2024-01-01",
    status: "pago",
    categoria: "manutencao",
    tentativasCobranca: 0,
    dataPagamento: "2024-01-18",
    formaPagamento: "boleto",
    valorPago: 1500
  }
]

export default function ContasReceberPage() {
  const { user } = useAuth()
  const [contasReceber, setContasReceber] = useState(mockContasReceber)
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false)

  // Calcular métricas
  const totalEmAberto = contasReceber
    .filter(conta => ['pendente', 'vencido'].includes(conta.status))
    .reduce((sum, conta) => sum + conta.valor, 0)

  const totalVencido = contasReceber
    .filter(conta => conta.status === 'vencido')
    .reduce((sum, conta) => sum + conta.valor, 0)

  const totalRecebido = contasReceber
    .filter(conta => conta.status === 'pago')
    .reduce((sum, conta) => sum + (conta.valorPago || conta.valor), 0)

  const quantidadeVencidas = contasReceber.filter(conta => conta.status === 'vencido').length

  const ticketMedio = contasReceber.length > 0 
    ? contasReceber.reduce((sum, conta) => sum + conta.valor, 0) / contasReceber.length 
    : 0

  const handleViewInvoice = (id: string) => {
    const conta = contasReceber.find(c => c.id === id)
    if (conta) {
      alert(`Visualizando fatura:\n\nCliente: ${conta.cliente}\nValor: ${formatCurrency(conta.valor)}\nVencimento: ${conta.dataVencimento}\nStatus: ${conta.status}`)
    }
  }

  const handleEditInvoice = (id: string) => {
    const conta = contasReceber.find(c => c.id === id)
    if (conta) {
      alert(`Editando fatura de ${conta.cliente}.\nFuncionalidade completa será implementada em breve!`)
    }
  }

  const handleMarkAsPaid = (id: string) => {
    setContasReceber(prev => prev.map(conta => 
      conta.id === id 
        ? { 
            ...conta, 
            status: 'pago' as const,
            dataPagamento: new Date().toISOString().split('T')[0],
            valorPago: conta.valor,
            formaPagamento: 'pix' as const
          }
        : conta
    ))
    console.log('Fatura marcada como paga:', id)
  }

  const handleSendReminder = (id: string) => {
    setContasReceber(prev => prev.map(conta => 
      conta.id === id 
        ? { 
            ...conta, 
            tentativasCobranca: conta.tentativasCobranca + 1,
            ultimaCobranca: new Date().toISOString().split('T')[0]
          }
        : conta
    ))
    console.log('Lembrete enviado para:', id)
  }

  const handleNewInvoice = () => {
    setIsNewInvoiceModalOpen(true)
  }

  const handleExportReport = () => {
    const totalContas = contasReceber.length
    const totalEmAberto = contasReceber.filter(c => ['pendente', 'vencido'].includes(c.status)).length
    const totalVencidas = contasReceber.filter(c => c.status === 'vencido').length
    
    alert(`Relatório de Contas a Receber:\n\nTotal de contas: ${totalContas}\nEm aberto: ${totalEmAberto}\nVencidas: ${totalVencidas}\n\nExportação para PDF/Excel será implementada em breve!`)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  return (
    <ProtectedRoute requiredRole={['superadmin', 'admin']}>
      <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FinancialCard
              title="Total em Aberto"
              value={totalEmAberto}
              icon={DollarSign}
              variant="info"
            />
            <FinancialCard
              title="Total Vencido"
              value={totalVencido}
              icon={AlertTriangle}
              variant="danger"
            />
            <FinancialCard
              title="Total Recebido"
              value={totalRecebido}
              icon={CheckCircle}
              variant="success"
            />
            <FinancialCard
              title="Ticket Médio"
              value={ticketMedio}
              icon={TrendingUp}
              variant="default"
            />
          </div>

          {/* Resumo Executivo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status das Faturas */}
            <Card>
              <CardHeader>
                <CardTitle>Status das Faturas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pendentes</span>
                    <span className="font-medium">
                      {contasReceber.filter(c => c.status === 'pendente').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vencidas</span>
                    <span className="font-medium text-red-600">
                      {quantidadeVencidas}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pagas</span>
                    <span className="font-medium text-green-600">
                      {contasReceber.filter(c => c.status === 'pago').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-medium">Total</span>
                    <span className="font-bold">{contasReceber.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formas de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Formas de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['pix', 'boleto', 'cartao', 'transferencia'].map((forma) => {
                    const count = contasReceber.filter(c => c.formaPagamento === forma).length
                    const percentage = contasReceber.length > 0 ? (count / contasReceber.length) * 100 : 0
                    
                    return (
                      <div key={forma} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 capitalize">{forma}</span>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    onClick={handleNewInvoice}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Fatura
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleExportReport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Relatório
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      const vencidas = contasReceber.filter(c => c.status === 'vencido')
                      vencidas.forEach(conta => handleSendReminder(conta.id))
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Cobrar Vencidas ({quantidadeVencidas})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Faturas */}
          <InvoiceTable
            invoices={contasReceber}
            onViewInvoice={handleViewInvoice}
            onEditInvoice={handleEditInvoice}
            onMarkAsPaid={handleMarkAsPaid}
            onSendReminder={handleSendReminder}
            title="Contas a Receber"
          />

          {/* Modal Nova Fatura */}
          {isNewInvoiceModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Nova Fatura</h2>
                    <Button 
                      variant="ghost"
                      onClick={() => setIsNewInvoiceModalOpen(false)}
                    >
                      ✕
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cliente
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Selecione o cliente</option>
                          <option value="cli-001">Cartório Santos Central</option>
                          <option value="cli-002">Empresa ABC Ltda</option>
                          <option value="cli-003">Advocacia Menezes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoria
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="lgpd">LGPD</option>
                          <option value="infraestrutura">Infraestrutura</option>
                          <option value="backup">Backup</option>
                          <option value="seguranca">Segurança</option>
                          <option value="consultoria">Consultoria</option>
                          <option value="manutencao">Manutenção</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea 
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Descrição dos serviços..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor (R$)
                        </label>
                        <input 
                          type="number"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data de Vencimento
                        </label>
                        <input 
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsNewInvoiceModalOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={() => {
                        // Implementar criação da fatura
                        setIsNewInvoiceModalOpen(false)
                      }}>
                        Criar Fatura
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    </ProtectedRoute>
  )
} 