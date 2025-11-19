"use client"

import { useState } from "react"
import { FinancialCard } from "@/components/financeiro/financial-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  ArrowUp,
  ArrowDown,
  Activity
} from "lucide-react"
import { FluxoCaixa, DashboardFinanceiro } from "@/types/financial"
import { cn } from "@/lib/utils"

// Dados mockados para fluxo de caixa
const mockFluxoCaixa: FluxoCaixa[] = [
  {
    data: "2024-02-01",
    entradas: 58000,
    saidas: 42000,
    saldo: 16000,
    saldoAcumulado: 91000
  },
  {
    data: "2024-03-01",
    entradas: 52000,
    saidas: 39000,
    saldo: 13000,
    saldoAcumulado: 104000
  },
  {
    data: "2024-04-01",
    entradas: 48000,
    saidas: 41000,
    saldo: 7000,
    saldoAcumulado: 111000
  },
  {
    data: "2024-05-01",
    entradas: 62000,
    saidas: 44000,
    saldo: 18000,
    saldoAcumulado: 129000
  },
  {
    data: "2024-06-01",
    entradas: 55000,
    saidas: 40000,
    saldo: 15000,
    saldoAcumulado: 144000
  }
]

// Mock dashboard data
const mockDashboard: DashboardFinanceiro = {
  saldoAtual: 75000,
  previsaoMes: 18000,
  receitaMes: 52000,
  despesasMes: 38000,
  contasReceberAbertas: 45300,
  contasPagarAbertas: 22000,
  inadimplencia: 8.5,
  crescimentoMes: 12.5,
  ticketMedio: 4500
}

export default function FluxoCaixaPage() {
  const { user } = useAuth()
  const [viewType, setViewType] = useState<'chart' | 'table'>('chart')

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
  }

  const totalEntradas = mockFluxoCaixa.reduce((sum, item) => sum + item.entradas, 0)
  const totalSaidas = mockFluxoCaixa.reduce((sum, item) => sum + item.saidas, 0)
  const saldoProjetado = mockDashboard.saldoAtual + (totalEntradas - totalSaidas)

  const getVariationColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getVariationIcon = (value: number) => {
    return value >= 0 ? ArrowUp : ArrowDown
  }

  // Categorias mais rentáveis
  const categoriasMaisRentaveis = [
    { categoria: 'LGPD', valor: 140000, percentual: 42 },
    { categoria: 'Infraestrutura', valor: 97000, percentual: 29 },
    { categoria: 'Backup', valor: 48000, percentual: 14 },
    { categoria: 'Segurança', valor: 50000, percentual: 15 }
  ]

  // Maiores gastos
  const maioresGastos = [
    { categoria: 'Salários', valor: 108000, percentual: 52 },
    { categoria: 'Licenças', valor: 66000, percentual: 32 },
    { categoria: 'Equipamentos', valor: 40000, percentual: 19 },
    { categoria: 'Aluguel', valor: 24000, percentual: 12 }
  ]

  const handleExportReport = () => {
    alert('Exportação de relatório de fluxo de caixa será implementada em breve!')
  }

  return (
    <ProtectedRoute requiredRole={['superadmin', 'admin']}>
      <div className="space-y-6">
          {/* KPIs Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FinancialCard
              title="Saldo Atual"
              value={mockDashboard.saldoAtual}
              icon={DollarSign}
              variant="info"
            />
            <FinancialCard
              title="Entradas (5m)"
              value={totalEntradas}
              icon={TrendingUp}
              variant="success"
            />
            <FinancialCard
              title="Saídas (5m)"
              value={totalSaidas}
              icon={TrendingDown}
              variant="danger"
            />
            <FinancialCard
              title="Saldo Projetado"
              value={saldoProjetado}
              icon={Activity}
              variant={saldoProjetado > mockDashboard.saldoAtual ? "success" : "warning"}
            />
          </div>

          {/* Controles */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <CardTitle>Análise Temporal - Últimos 5 Meses</CardTitle>
                
                <div className="flex gap-4">
                  <select
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="chart">Gráfico</option>
                    <option value="table">Tabela</option>
                  </select>
                  
                  <Button variant="outline" onClick={handleExportReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Visualização Principal */}
          {viewType === 'chart' ? (
            <Card>
              <CardHeader>
                <CardTitle>Fluxo de Caixa - Análise Gráfica</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Gráfico de Fluxo de Caixa</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Visualização interativa dos dados financeiros
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Integração com biblioteca de gráficos será implementada
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Detalhamento Mensal</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mês
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Entradas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Saídas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Saldo Líquido
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Saldo Acumulado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockFluxoCaixa.map((item) => {
                        const VariationIcon = getVariationIcon(item.saldo)
                        return (
                          <tr key={item.data} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {new Date(item.data).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                              {formatCurrency(item.entradas)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                              {formatCurrency(item.saidas)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className={cn("flex items-center", getVariationColor(item.saldo))}>
                                <VariationIcon className="h-4 w-4 mr-1" />
                                {formatCurrency(item.saldo)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(item.saldoAcumulado)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Análises Complementares */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categorias Mais Rentáveis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Categorias Mais Rentáveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoriasMaisRentaveis.map((item, index) => (
                    <div key={item.categoria} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.categoria}</p>
                          <p className="text-sm text-gray-500">{item.percentual}% do total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{formatCurrency(item.valor)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maiores Gastos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
                  Maiores Gastos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maioresGastos.map((item, index) => (
                    <div key={item.categoria} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-700 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.categoria}</p>
                          <p className="text-sm text-gray-500">{item.percentual}% do total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">{formatCurrency(item.valor)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Previsões e Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Previsões e Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Próximos 30 Dias</h4>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    Previsão de entrada: {formatCurrency(mockDashboard.previsaoMes)}
                  </p>
                  <p className="text-xs text-blue-600">
                    Com base no histórico e contratos ativos
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Crescimento</h4>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    +{mockDashboard.crescimentoMes}% vs mês anterior
                  </p>
                  <p className="text-xs text-green-600">
                    Desempenho acima da meta
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <PieChart className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-900">Margem Líquida</h4>
                  </div>
                  <p className="text-sm text-yellow-700 mb-2">
                    26.9% de margem média
                  </p>
                  <p className="text-xs text-yellow-600">
                    Excelente performance financeira
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </ProtectedRoute>
  )
} 