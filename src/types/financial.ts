// Tipos para o sistema financeiro da MenezesTech

export interface ContaReceber {
  id: string
  numero: string
  cliente: string
  clienteId: string
  descricao: string
  osId?: string // Vinculada a uma OS
  valor: number
  dataVencimento: string
  dataEmissao: string
  dataPagamento?: string
  status: 'pendente' | 'pago' | 'vencido' | 'parcial' | 'cancelado'
  formaPagamento?: 'pix' | 'boleto' | 'cartao' | 'dinheiro' | 'transferencia'
  observacoes?: string
  tentativasCobranca: number
  ultimaCobranca?: string
  valorPago?: number
  categoria: 'lgpd' | 'infraestrutura' | 'backup' | 'seguranca' | 'consultoria' | 'manutencao'
}

export interface ContaPagar {
  id: string
  numero: string
  fornecedor: string
  descricao: string
  valor: number
  dataVencimento: string
  dataEmissao: string
  dataPagamento?: string
  status: 'pendente' | 'pago' | 'vencido' | 'agendado'
  categoria: 'licencas' | 'equipamentos' | 'aluguel' | 'salarios' | 'marketing' | 'contabilidade' | 'outros'
  prioridade: 'baixa' | 'media' | 'alta' | 'critica'
  formaPagamento?: 'pix' | 'boleto' | 'cartao' | 'dinheiro' | 'transferencia'
  observacoes?: string
  recorrente: boolean
  proximoVencimento?: string
}

export interface FluxoCaixa {
  data: string
  entradas: number
  saidas: number
  saldo: number
  saldoAcumulado: number
}

export interface MovimentacaoFinanceira {
  id: string
  data: string
  tipo: 'entrada' | 'saida'
  valor: number
  descricao: string
  categoria: string
  origem: 'conta_receber' | 'conta_pagar' | 'outros'
  referencia?: string // ID da conta receber/pagar
}

export interface DashboardFinanceiro {
  saldoAtual: number
  previsaoMes: number
  receitaMes: number
  despesasMes: number
  contasReceberAbertas: number
  contasPagarAbertas: number
  inadimplencia: number
  crescimentoMes: number
  ticketMedio: number
}

export interface RelatorioInadimplencia {
  clienteId: string
  cliente: string
  valorTotal: number
  quantidadeFaturas: number
  diasAtraso: number
  ultimaCobranca?: string
  telefone?: string
  email?: string
}

export interface PrevisaoFluxoCaixa {
  mes: string
  entradasPrevistas: number
  saidasPrevistas: number
  saldoPrevisto: number
  probabilidade: 'alta' | 'media' | 'baixa'
} 