"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { 
  MessageSquare, 
  Mail, 
  Zap, 
  Settings, 
  Shield, 
  Save,
  TestTube,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  enabled: boolean
  status: 'connected' | 'disconnected' | 'error'
  config: Record<string, any>
}

const mockIntegrations: Integration[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Envio automático de notificações via WhatsApp',
    icon: MessageSquare,
    enabled: true,
    status: 'connected',
    config: {
      token: 'EAAxxxxxxxxxxxxxxxx',
      phoneNumber: '+5511999999999',
      webhookUrl: 'https://menezestech.com.br/webhook/whatsapp'
    }
  },
  {
    id: 'email',
    name: 'Email Marketing',
    description: 'Campanhas de email e notificações automáticas',
    icon: Mail,
    enabled: true,
    status: 'connected',
    config: {
      provider: 'sendgrid',
      apiKey: 'SG.xxxxxxxxxxxxxxxx',
      fromEmail: 'noreply@menezestech.com.br',
      fromName: 'MenezesTech'
    }
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automação entre diferentes plataformas',
    icon: Zap,
    enabled: false,
    status: 'disconnected',
    config: {
      webhookUrl: '',
      apiKey: ''
    }
  }
]

export default function ConfiguracoesPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleIntegration = async (integrationId: string) => {
    setIsLoading(true)
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, enabled: !integration.enabled }
        : integration
    ))
    
    setIsLoading(false)
  }

  const handleTestIntegration = async (integrationId: string) => {
    setIsLoading(true)
    
    // Simular teste de integração
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert(`Teste da integração ${integrationId} realizado com sucesso!`)
    setIsLoading(false)
  }

  const handleSaveConfig = async (integrationId: string, newConfig: Record<string, any>) => {
    setIsLoading(true)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, config: { ...integration.config, ...newConfig } }
        : integration
    ))
    
    alert('Configurações salvas com sucesso!')
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100'
      case 'disconnected':
        return 'text-gray-600 bg-gray-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Conectado'
      case 'disconnected':
        return 'Desconectado'
      case 'error':
        return 'Erro'
      default:
        return status
    }
  }

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const maskSecret = (value: string) => {
    if (!value) return ''
    return value.substring(0, 4) + '*'.repeat(Math.max(0, value.length - 8)) + value.substring(Math.max(4, value.length - 4))
  }

  return (
    <ProtectedRoute requiredRole="superadmin">
      <div className="space-y-6">
          {/* Header com informações */}
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-full">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900">Integrações e APIs</h2>
                  <p className="text-blue-700">
                    Configure e gerencie todas as integrações do sistema de forma centralizada
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Integrações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration) => {
              const Icon = integration.icon
              return (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Icon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                          {getStatusText(integration.status)}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={integration.enabled}
                            onChange={() => handleToggleIntegration(integration.id)}
                            disabled={isLoading}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {integration.enabled && (
                      <div className="space-y-4">
                        {/* Configurações específicas por integração */}
                        {integration.id === 'whatsapp' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Token da API
                              </label>
                              <div className="relative">
                                <input
                                  type={showSecrets['whatsapp_token'] ? "text" : "password"}
                                  value={showSecrets['whatsapp_token'] ? integration.config.token : maskSecret(integration.config.token)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                                  readOnly
                                />
                                <button
                                  onClick={() => toggleSecretVisibility('whatsapp_token')}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                  {showSecrets['whatsapp_token'] ? 
                                    <EyeOff className="h-4 w-4 text-gray-400" /> : 
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  }
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Número do WhatsApp
                              </label>
                              <input
                                type="text"
                                value={integration.config.phoneNumber}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                readOnly
                              />
                            </div>
                          </div>
                        )}

                        {integration.id === 'email' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Provider
                              </label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                <option value="sendgrid">SendGrid</option>
                                <option value="mailchimp">Mailchimp</option>
                                <option value="smtp">SMTP Customizado</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                API Key
                              </label>
                              <div className="relative">
                                <input
                                  type={showSecrets['email_key'] ? "text" : "password"}
                                  value={showSecrets['email_key'] ? integration.config.apiKey : maskSecret(integration.config.apiKey)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                                  readOnly
                                />
                                <button
                                  onClick={() => toggleSecretVisibility('email_key')}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                  {showSecrets['email_key'] ? 
                                    <EyeOff className="h-4 w-4 text-gray-400" /> : 
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  }
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email de Envio
                              </label>
                              <input
                                type="email"
                                value={integration.config.fromEmail}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                readOnly
                              />
                            </div>
                          </div>
                        )}

                        {integration.id === 'zapier' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Webhook URL
                              </label>
                              <input
                                type="url"
                                placeholder="https://hooks.zapier.com/hooks/catch/..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                API Key (Opcional)
                              </label>
                              <input
                                type="password"
                                placeholder="Chave da API do Zapier"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                          </div>
                        )}

                        {/* Ações */}
                        <div className="flex space-x-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestIntegration(integration.id)}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            <TestTube className="h-4 w-4 mr-2" />
                            Testar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveConfig(integration.id, integration.config)}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Configurações de Notificações */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">WhatsApp Automático</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Nova OS criada</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">OS concluída</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">OS em atraso</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Email Automático</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Relatórios semanais</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Certificados LGPD</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Campanhas promocionais</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs de Integração */}
          <Card>
            <CardHeader>
              <CardTitle>Logs de Integração (Últimas 24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '14:32', type: 'whatsapp', message: 'Mensagem enviada para +5511999888777', status: 'success' },
                  { time: '14:15', type: 'email', message: 'Email de boas-vindas enviado para cliente@empresa.com', status: 'success' },
                  { time: '13:45', type: 'whatsapp', message: 'Falha ao enviar mensagem - Token inválido', status: 'error' },
                  { time: '12:30', type: 'email', message: 'Relatório semanal enviado para 15 clientes', status: 'success' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">{log.time}</div>
                    <div className={`p-1 rounded-full ${log.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {log.status === 'success' ? 
                        <CheckCircle className="h-4 w-4 text-green-600" /> : 
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      }
                    </div>
                    <div className="flex-1 text-sm">{log.message}</div>
                    <div className="text-xs text-gray-500 uppercase">{log.type}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
    </ProtectedRoute>
  )
} 