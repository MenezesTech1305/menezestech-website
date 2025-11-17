"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  AlertTriangle,
  Send,
  Loader2
} from "lucide-react"

interface ApprovalWorkflowProps {
  osId: string
  onApprovalRequested?: () => void
}

interface PendingApproval {
  id: string
  tipo_aprovacao: string
  valor_aprovacao?: number
  observacoes?: string
  data_solicitacao: string
  solicitado_por_nome: string
  status: string
}

export function OSApprovalWorkflow({ osId, onApprovalRequested }: ApprovalWorkflowProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [tipoAprovacao, setTipoAprovacao] = useState<string>("")
  const [valorAprovacao, setValorAprovacao] = useState<string>("")
  const [observacoes, setObservacoes] = useState<string>("")

  const canRequestApproval = user && ['superadmin', 'admin', 'funcionario'].includes(user.role)
  const canApprove = user && ['superadmin', 'admin'].includes(user.role)

  const handleRequestApproval = async () => {
    if (!tipoAprovacao) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de aprovação",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Chamar função RPC do Supabase
      const { data, error } = await supabase.rpc('solicitar_aprovacao_os', {
        p_os_id: osId,
        p_tipo_aprovacao: tipoAprovacao,
        p_valor_aprovacao: valorAprovacao ? parseFloat(valorAprovacao) : null,
        p_observacoes: observacoes.trim() || null
      })

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Solicitação de aprovação enviada com sucesso!",
      })

      // Limpar formulário
      setTipoAprovacao("")
      setValorAprovacao("")
      setObservacoes("")

      if (onApprovalRequested) {
        onApprovalRequested()
      }

    } catch (error: any) {
      console.error('Erro ao solicitar aprovação:', error)
      
      // Se a função RPC não existir, mostrar mensagem específica
      if (error.message?.includes('function') || error.message?.includes('does not exist')) {
        toast({
          title: "Funcionalidade não disponível",
          description: "O sistema de aprovações precisa ser configurado no banco de dados. Consulte a documentação.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro",
          description: error.message || "Falha ao solicitar aprovação",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const getTipoAprovacaoText = (tipo: string) => {
    const tipos: Record<string, string> = {
      'orcamento': 'Orçamento',
      'inicio': 'Início do Serviço',
      'conclusao': 'Conclusão do Serviço',
      'cancelamento': 'Cancelamento'
    }
    return tipos[tipo] || tipo
  }

  if (!canRequestApproval) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Workflow de Aprovação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulário de Solicitação */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium text-sm">Solicitar Aprovação</h4>
          
          <div className="space-y-2">
            <Label htmlFor="tipo_aprovacao">Tipo de Aprovação *</Label>
            <select
              id="tipo_aprovacao"
              value={tipoAprovacao}
              onChange={(e) => setTipoAprovacao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              <option value="orcamento">Orçamento</option>
              <option value="inicio">Início do Serviço</option>
              <option value="conclusao">Conclusão do Serviço</option>
              <option value="cancelamento">Cancelamento</option>
            </select>
          </div>

          {tipoAprovacao === 'orcamento' && (
            <div className="space-y-2">
              <Label htmlFor="valor_aprovacao">Valor (R$)</Label>
              <Input
                id="valor_aprovacao"
                type="number"
                step="0.01"
                min="0"
                value={valorAprovacao}
                onChange={(e) => setValorAprovacao(e.target.value)}
                placeholder="0.00"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Adicione observações sobre esta solicitação..."
              rows={3}
            />
          </div>

          <Button
            onClick={handleRequestApproval}
            disabled={loading || !tipoAprovacao}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Solicitar Aprovação
              </>
            )}
          </Button>
        </div>

        {/* Informações sobre o Workflow */}
        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium">Como funciona:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Orçamento:</strong> Solicita aprovação do valor orçado antes de iniciar</li>
            <li><strong>Início:</strong> Solicita aprovação para iniciar o serviço</li>
            <li><strong>Conclusão:</strong> Solicita aprovação para finalizar a OS</li>
            <li><strong>Cancelamento:</strong> Solicita aprovação para cancelar a OS</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            * Apenas administradores podem aprovar ou rejeitar solicitações
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para listar aprovações pendentes (para admins)
interface PendingApprovalsListProps {
  onApprovalResponded?: () => void
}

export function PendingApprovalsList({ onApprovalResponded }: PendingApprovalsListProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [approvals, setApprovals] = useState<PendingApproval[]>([])
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [motivoRejeicao, setMotivoRejeicao] = useState<string>("")

  const canApprove = user && ['superadmin', 'admin'].includes(user.role)

  const loadPendingApprovals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.rpc('get_pending_approvals')

      if (error) throw error

      setApprovals(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar aprovações:', error)
      
      if (!error.message?.includes('function') && !error.message?.includes('does not exist')) {
        toast({
          title: "Erro",
          description: "Falha ao carregar aprovações pendentes",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async (approvalId: string, status: 'aprovado' | 'rejeitado') => {
    if (status === 'rejeitado' && !motivoRejeicao.trim()) {
      toast({
        title: "Erro",
        description: "Informe o motivo da rejeição",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase.rpc('responder_aprovacao_os', {
        p_approval_id: approvalId,
        p_status: status,
        p_motivo_rejeicao: status === 'rejeitado' ? motivoRejeicao.trim() : null
      })

      if (error) throw error

      toast({
        title: "Sucesso",
        description: `Aprovação ${status === 'aprovado' ? 'aprovada' : 'rejeitada'} com sucesso!`,
      })

      setRespondingTo(null)
      setMotivoRejeicao("")
      await loadPendingApprovals()

      if (onApprovalResponded) {
        onApprovalResponded()
      }

    } catch (error: any) {
      console.error('Erro ao responder aprovação:', error)
      toast({
        title: "Erro",
        description: error.message || "Falha ao responder aprovação",
        variant: "destructive",
      })
    }
  }

  if (!canApprove) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Aprovações Pendentes
          </CardTitle>
          <Button variant="outline" size="sm" onClick={loadPendingApprovals}>
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : approvals.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma aprovação pendente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div key={approval.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">
                      {getTipoAprovacaoText(approval.tipo_aprovacao)}
                    </h4>
                    <p className="text-xs text-gray-600">
                      Solicitado por: {approval.solicitado_por_nome}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(approval.data_solicitacao).toLocaleString('pt-BR')}
                    </p>
                    {approval.valor_aprovacao && (
                      <p className="text-sm font-medium text-green-600 mt-1">
                        Valor: {approval.valor_aprovacao.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </p>
                    )}
                    {approval.observacoes && (
                      <p className="text-sm text-gray-700 mt-2">{approval.observacoes}</p>
                    )}
                  </div>
                </div>

                {respondingTo === approval.id ? (
                  <div className="space-y-3 mt-3 p-3 bg-gray-50 rounded">
                    <Textarea
                      value={motivoRejeicao}
                      onChange={(e) => setMotivoRejeicao(e.target.value)}
                      placeholder="Motivo da rejeição..."
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRespondingTo(null)
                          setMotivoRejeicao("")
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRespond(approval.id, 'rejeitado')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Confirmar Rejeição
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      onClick={() => handleRespond(approval.id, 'aprovado')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      onClick={() => setRespondingTo(approval.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeitar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  function getTipoAprovacaoText(tipo: string): string {
    const tipos: Record<string, string> = {
      'orcamento': 'Orçamento',
      'inicio': 'Início do Serviço',
      'conclusao': 'Conclusão do Serviço',
      'cancelamento': 'Cancelamento'
    }
    return tipos[tipo] || tipo
  }
}
