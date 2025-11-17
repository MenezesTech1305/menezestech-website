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
  TrendingUp, 
  TrendingDown,
  CreditCard,
  AlertTriangle,
  FileText,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from "lucide-react"
import { ContaReceber, ContaPagar, DashboardFinanceiro } from "@/types/financial"

// Dados mockados realistas para MenezesTech
const mockFinancialData: DashboardFinanceiro = {
  saldoAtual: 75000,
  previsaoMes: 65000,
  receitaMes: 52000,
  despesasMes: 38000,
  contasReceberAbertas: 18,
  contasPagarAbertas: 12,
  inadimplencia: 8.5,
  crescimentoMes: 15.2,
  ticketMedio: 4500
}

const mockContasReceber: ContaReceber[] = [
  {
    id: "CR-2024-001",
    numero: "2024001",
    cliente: "Cartório Santos Central",
    clienteId: "cli-001",
    descricao: "Implementação LGPD Completa",
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
    descricao: "Migração Servidor + Backup",
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
    cliente: "Advocacia Menezes",
    clienteId: "cli-003",
    descricao: "Auditoria de Segurança",
    valor: 5500,
    dataVencimento: "2024-02-05",
    dataEmissao: "2024-01-05",
    status: "pago",
    categoria: "seguranca",
    tentativasCobranca: 0,
    dataPagamento: "2024-02-03",
    formaPagamento: "pix"
  }
]

const mockContasPagar: ContaPagar[] = [
  {
    id: "CP-2024-001",
    numero: "2024001",
    fornecedor: "Microsoft Brasil",
    descricao: "Licenças Office 365 - Mensal",
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
  }
]

export default function FinanceiroDashboard() {
  const { user } = useAuth()
  const [data] = useState(mockFinancialData)
  const [contasReceber] = useState(mockContasReceber)
  const [contasPagar] = useState(mockContasPagar)

  const contasVencidas = contasReceber.filter(conta => conta.status === 'vencido')
  const contasVencendoHoje = contasReceber.filter(conta => {
    const hoje = new Date().toISOString().split('T')[0]
    return conta.dataVencimento === hoje && conta.status === 'pendente'
  })

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Handlers para ações rápidas
  const handleNovaFatura = () => {
    window.location.href = '/dashboard/financeiro/contas-receber'
  }

  const handleRegistrarPagamento = () => {
    alert('Funcionalidade de registrar pagamento será implementada em breve!')
  }

  const handleRelatorios = () => {
    alert('Módulo de relatórios será implementado em breve!')
  }

  const handleConciliacao = () => {
    alert('Funcionalidade de conciliação bancária será implementada em breve!')
  }

  const handleCobrarConta = (contaId: string) => {
    alert(`Enviando cobrança para conta ${contaId}...`)
  }

  const handlePagarConta = (contaId: string) => {
    alert(`Processando pagamento da conta ${contaId}...`)
  }

  const handleVerTodasVencidas = () => {
    window.location.href = '/dashboard/financeiro/contas-receber'
  }

  const handleVerFluxoCompleto = () => {
    window.location.href = '/dashboard/financeiro/fluxo-caixa'
  }

  return (
    <ProtectedRoute requiredRole={['superadmin', 'admin']}>
      <DashboardLayout title="Dashboard Financeiro">
        <div className="space-y-6">
          {/* KPIs Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FinancialCard
              title="Saldo Atual"
              value={data.saldoAtual}
              icon={DollarSign}
              variant="success"
            />
            <FinancialCard
              title="Receita do Mês"
              value={data.receitaMes}
              icon={TrendingUp}
              variant="info"
              change={{
                value: data.crescimentoMes,
                type: 'increase',
                period: 'vs. mês anterior'
              }}
            />
            <FinancialCard
              title="Despesas do Mês"
              value={data.despesasMes}
              icon={TrendingDown}
              variant="warning"
            />
            <FinancialCard
              title="Previsão do Mês"
              value={data.previsaoMes}
              icon={Calendar}
              variant="default"
            />
          </div>

          {/* Métricas Secundárias */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FinancialCard
              title="Contas a Receber"
              value={data.contasReceberAbertas.toString()}
              icon={CreditCard}
              variant="info"
            />
            <FinancialCard
              title="Ticket Médio"
              value={data.ticketMedio}
              icon={FileText}
              variant="default"
            />
            <FinancialCard
              title="Taxa Inadimplência"
              value={`${data.inadimplencia}%`}
              icon={AlertTriangle}
              variant="warning"
            />
          </div>

          {/* Alertas e Ações Rápidas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contas Vencidas */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Contas Vencidas ({contasVencidas.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contasVencidas.slice(0, 3).map((conta) => (
                    <div key={conta.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{conta.cliente}</p>
                        <p className="text-sm text-gray-600">
                          Venc: {formatDate(conta.dataVencimento)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          {formatCurrency(conta.valor)}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-1"
                          onClick={() => handleCobrarConta(conta.id)}
                        >
                          Cobrar
                        </Button>
                      </div>
                    </div>
                  ))}
                  {contasVencidas.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleVerTodasVencidas}
                    >
                      Ver todas ({contasVencidas.length})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contas a Pagar Urgentes */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-yellow-800">
                  <Clock className="h-5 w-5" />
                  <span>Próximos Vencimentos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contasPagar.slice(0, 3).map((conta) => (
                    <div key={conta.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{conta.fornecedor}</p>
                        <p className="text-sm text-gray-600">
                          Venc: {formatDate(conta.dataVencimento)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-yellow-600">
                          {formatCurrency(conta.valor)}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-1"
                          onClick={() => handlePagarConta(conta.id)}
                        >
                          Pagar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fluxo de Caixa Resumido */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Fluxo de Caixa - Próximos 30 dias</CardTitle>
                <Button 
                  variant="outline"
                  onClick={handleVerFluxoCompleto}
                >
                  Ver Completo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <ArrowUpRight className="h-5 w-5 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-gray-600">Entradas Previstas</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(45000)}
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <ArrowDownRight className="h-5 w-5 text-red-600 mr-1" />
                    <span className="text-sm font-medium text-gray-600">Saídas Previstas</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(32000)}
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600 mr-1" />
                    <span className="text-sm font-medium text-gray-600">Saldo Projetado</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(88000)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  className="h-20 flex-col"
                  onClick={handleNovaFatura}
                >
                  <Plus className="h-6 w-6 mb-2" />
                  Nova Fatura
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={handleRegistrarPagamento}
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  Registrar Pagamento
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={handleRelatorios}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  Relatórios
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={handleConciliacao}
                >
                  <Building className="h-6 w-6 mb-2" />
                  Conciliação
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 