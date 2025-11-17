"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { 
  Eye, 
  Edit, 
  CheckCircle, 
  Send, 
  AlertTriangle,
  Calendar,
  Building,
  CreditCard,
  Filter
} from "lucide-react"
import { ContaReceber } from "@/types/financial"

interface InvoiceTableProps {
  invoices: ContaReceber[]
  onViewInvoice: (id: string) => void
  onEditInvoice: (id: string) => void
  onMarkAsPaid: (id: string) => void
  onSendReminder: (id: string) => void
  title?: string
}

export function InvoiceTable({
  invoices,
  onViewInvoice,
  onEditInvoice,
  onMarkAsPaid,
  onSendReminder,
  title = "Faturas"
}: InvoiceTableProps) {
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'vencido' | 'pago'>('todos')
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: ContaReceber['status']) => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'vencido':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'parcial':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelado':
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: ContaReceber['status']) => {
    switch (status) {
      case 'pago': return 'Pago'
      case 'pendente': return 'Pendente'
      case 'vencido': return 'Vencido'
      case 'parcial': return 'Parcial'
      case 'cancelado': return 'Cancelado'
    }
  }

  const getCategoryColor = (categoria: ContaReceber['categoria']) => {
    switch (categoria) {
      case 'lgpd': return 'bg-purple-100 text-purple-800'
      case 'infraestrutura': return 'bg-blue-100 text-blue-800'
      case 'backup': return 'bg-green-100 text-green-800'
      case 'seguranca': return 'bg-red-100 text-red-800'
      case 'consultoria': return 'bg-yellow-100 text-yellow-800'
      case 'manutencao': return 'bg-gray-100 text-gray-800'
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

  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === 'todos' || invoice.status === filter
    const matchesSearch = 
      invoice.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>{title} ({filteredInvoices.length})</span>
          </CardTitle>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <input
              type="text"
              placeholder="Buscar cliente, número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Filtro */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="vencido">Vencido</option>
              <option value="pago">Pago</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                  {/* Info Principal */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">
                        #{invoice.numero}
                      </span>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        getStatusColor(invoice.status)
                      )}>
                        {getStatusText(invoice.status)}
                      </span>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getCategoryColor(invoice.categoria)
                      )}>
                        {invoice.categoria}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span><strong>Cliente:</strong> {invoice.cliente}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span><strong>Vencimento:</strong> {formatDate(invoice.dataVencimento)}</span>
                        {invoice.status === 'vencido' && (
                          <span className="text-red-600 text-xs">
                            ({getDaysOverdue(invoice.dataVencimento)} dias)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span><strong>Valor:</strong> {formatCurrency(invoice.valor)}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{invoice.descricao}</p>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewInvoice(invoice.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    
                    {(invoice.status === 'pendente' || invoice.status === 'vencido') && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMarkAsPaid(invoice.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar Pago
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSendReminder(invoice.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Lembrete
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditInvoice(invoice.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>Nenhuma fatura encontrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 