"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { OrdemServicoInsert, CategoriaOS, PrioridadeOS, StatusOS } from "@/types/supabase"
import { Loader2, Save, X } from "lucide-react"

interface OSFormProps {
  osId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

interface Cliente {
  id: string
  name: string
  email: string
  company?: string
}

interface Funcionario {
  id: string
  name: string
  email: string
}

export function OSForm({ osId, onSuccess, onCancel }: OSFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(!!osId)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    cliente_id: "",
    responsavel_id: "",
    categoria: "consultoria" as CategoriaOS,
    prioridade: "media" as PrioridadeOS,
    status: "pendente" as StatusOS,
    data_vencimento: "",
    valor_orcado: "",
    observacoes: ""
  })

  // Carregar clientes e funcionários
  useEffect(() => {
    loadUsers()
    if (osId) {
      loadOSData()
    }
  }, [osId])

  const loadUsers = async () => {
    try {
      // Buscar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('users')
        .select('id, name, email, company')
        .eq('role', 'cliente')
        .eq('is_active', true)
        .order('name')

      if (clientesError) throw clientesError
      setClientes(clientesData || [])

      // Buscar funcionários
      const { data: funcionariosData, error: funcionariosError } = await supabase
        .from('users')
        .select('id, name, email')
        .in('role', ['funcionario', 'admin', 'superadmin'])
        .eq('is_active', true)
        .order('name')

      if (funcionariosError) throw funcionariosError
      setFuncionarios(funcionariosData || [])

    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar lista de usuários",
        variant: "destructive",
      })
    }
  }

  const loadOSData = async () => {
    if (!osId) return

    try {
      setLoadingData(true)
      const { data, error } = await supabase
        .from('ordens_servico')
        .select('*')
        .eq('id', osId)
        .single()

      if (error) throw error

      if (data) {
        setFormData({
          titulo: data.titulo || "",
          descricao: data.descricao || "",
          cliente_id: data.cliente_id || "",
          responsavel_id: data.responsavel_id || "",
          categoria: data.categoria || "consultoria",
          prioridade: data.prioridade || "media",
          status: data.status || "pendente",
          data_vencimento: data.data_vencimento || "",
          valor_orcado: data.valor_orcado?.toString() || "",
          observacoes: data.observacoes || ""
        })
      }
    } catch (error) {
      console.error('Erro ao carregar OS:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar dados da OS",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!formData.titulo.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (!formData.cliente_id) {
      toast({
        title: "Erro",
        description: "Selecione um cliente",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const osData: any = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim() || null,
        cliente_id: formData.cliente_id,
        responsavel_id: formData.responsavel_id || null,
        categoria: formData.categoria,
        prioridade: formData.prioridade,
        status: formData.status,
        data_vencimento: formData.data_vencimento || null,
        valor_orcado: formData.valor_orcado ? parseFloat(formData.valor_orcado) : null,
        observacoes: formData.observacoes.trim() || null
      }

      if (osId) {
        // Atualizar OS existente
        const { error } = await supabase
          .from('ordens_servico')
          .update(osData)
          .eq('id', osId)

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "OS atualizada com sucesso!",
        })
      } else {
        // Criar nova OS
        // Gerar número da OS
        const { data: lastOS } = await supabase
          .from('ordens_servico')
          .select('numero')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        let nextNumber = 1
        if (lastOS?.numero) {
          const match = lastOS.numero.match(/OS-(\d{4})-(\d+)/)
          if (match) {
            nextNumber = parseInt(match[2]) + 1
          }
        }

        const year = new Date().getFullYear()
        const numero = `OS-${year}-${nextNumber.toString().padStart(4, '0')}`

        const { error } = await supabase
          .from('ordens_servico')
          .insert({
            ...osData,
            numero,
            data_abertura: new Date().toISOString()
          })

        if (error) throw error

        toast({
          title: "Sucesso",
          description: `OS ${numero} criada com sucesso!`,
        })
      }

      if (onSuccess) {
        onSuccess()
      }

    } catch (error: any) {
      console.error('Erro ao salvar OS:', error)
      toast({
        title: "Erro",
        description: error.message || "Falha ao salvar OS",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{osId ? "Editar" : "Nova"} Ordem de Serviço</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Implementação LGPD - Cartório Santos"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva os detalhes do serviço..."
              rows={4}
            />
          </div>

          {/* Cliente e Responsável */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente *</Label>
              <select
                id="cliente"
                value={formData.cliente_id}
                onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.name} {cliente.company ? `- ${cliente.company}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <select
                id="responsavel"
                value={formData.responsavel_id}
                onChange={(e) => setFormData({ ...formData, responsavel_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Não atribuído</option>
                {funcionarios.map((func) => (
                  <option key={func.id} value={func.id}>
                    {func.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Categoria e Prioridade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <select
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value as CategoriaOS })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lgpd">LGPD</option>
                <option value="infraestrutura">Infraestrutura</option>
                <option value="backup">Backup</option>
                <option value="seguranca">Segurança</option>
                <option value="consultoria">Consultoria</option>
                <option value="manutencao">Manutenção</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade</Label>
              <select
                id="prioridade"
                value={formData.prioridade}
                onChange={(e) => setFormData({ ...formData, prioridade: e.target.value as PrioridadeOS })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>

          {/* Status e Data de Vencimento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusOS })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="aguardando_cliente">Aguardando Cliente</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_vencimento">Data de Vencimento</Label>
              <Input
                id="data_vencimento"
                type="date"
                value={formData.data_vencimento}
                onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
              />
            </div>
          </div>

          {/* Valor Orçado */}
          <div className="space-y-2">
            <Label htmlFor="valor_orcado">Valor Orçado (R$)</Label>
            <Input
              id="valor_orcado"
              type="number"
              step="0.01"
              min="0"
              value={formData.valor_orcado}
              onChange={(e) => setFormData({ ...formData, valor_orcado: e.target.value })}
              placeholder="0.00"
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {osId ? "Atualizar" : "Criar"} OS
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
