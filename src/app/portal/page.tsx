"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Shield, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function PortalPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  
  const { signIn, user, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    console.log('useEffect executado:', { isAuthenticated, user: user?.email, role: user?.role })
    
    if (isAuthenticated && user) {
      console.log('Usuário autenticado, redirecionando...')
      setIsRedirecting(true)
      
      // Redirecionar baseado no role
      let targetRoute = '/dashboard'
      switch (user.role) {
        case 'superadmin':
        case 'admin':
          targetRoute = '/dashboard/admin'
          break
        case 'funcionario':
          targetRoute = '/dashboard/funcionario'
          break
        case 'cliente':
          targetRoute = '/dashboard/cliente'
          break
        default:
          targetRoute = '/dashboard'
      }
      
      console.log(`Redirecionando para: ${targetRoute}`)
      router.push(targetRoute)
    }
  }, [isAuthenticated, user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Timeout de segurança
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setError("O login está demorando mais que o esperado. Tente recarregar a página.")
        setIsLoading(false)
      }
    }, 15000) // 15 segundos

    try {
      console.log('Iniciando login...')
      const result = await signIn(formData.email, formData.password)
      console.log('Resultado do login:', result)
      
      if (!result.success) {
        clearTimeout(timeoutId)
        setError(result.error || "Email ou senha incorretos. Tente novamente.")
        setIsLoading(false)
      } else {
        // Login bem-sucedido, aguardar redirecionamento
        console.log('Login bem-sucedido, aguardando redirecionamento...')
        // O timeout será limpo quando o componente for desmontado ou redirecionado
      }
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Erro no login:', error)
      setError("Erro interno. Tente novamente mais tarde.")
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Limpar erro ao digitar
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold menezes-text-gradient">
                MenezesTech Portal
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
            >
              Voltar ao Site
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Portal de <span className="menezes-text-gradient">Acesso</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Acesse sua área exclusiva para acompanhar projetos, gerenciar OS 
              e utilizar nossos serviços de TI de forma personalizada.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Formulário de Login */}
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Acesse sua Conta
                </CardTitle>
                <p className="text-gray-600">
                  Entre com suas credenciais para acessar o portal
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  {error && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span className="text-blue-700 text-sm">
                        Processando login... Se demorar mais de 10 segundos, abra o console do navegador (F12) para ver detalhes.
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 pr-12"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || isRedirecting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-lg py-6 disabled:opacity-50"
                  >
                    {isRedirecting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Redirecionando para dashboard...
                      </>
                    ) : isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Autenticando e sincronizando...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Entrar no Portal
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Informação de segurança */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-blue-600" />
                    Acesso Seguro
                  </h3>
                  <p className="text-xs text-gray-600">
                    Use suas credenciais fornecidas pela equipe MenezesTech para acessar o portal com segurança.
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Ainda não tem acesso? {" "}
                    <a href="/#contact" className="text-blue-600 hover:text-blue-700 font-medium">
                      Entre em contato conosco
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recursos do Portal */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                O que você encontra no Portal
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dashboard Inteligente</h3>
                    <p className="text-gray-600 text-sm">
                      Interface personalizada baseada no seu perfil com métricas em tempo real
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">📋</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Gestão de OS Completa</h3>
                    <p className="text-gray-600 text-sm">
                      Crie, acompanhe e gerencie ordens de serviço com workflow automatizado
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">💬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Comunicação Integrada</h3>
                    <p className="text-gray-600 text-sm">
                      WhatsApp, email e chat interno em uma só plataforma
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-600 font-bold">📁</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Relatórios Avançados</h3>
                    <p className="text-gray-600 text-sm">
                      Relatórios LGPD, certificados e análises de performance
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mt-8">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">
                    Sistema Multi-Level
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Acesso personalizado para clientes, funcionários, administradores e superadministradores 
                  com diferentes níveis de permissão e funcionalidades específicas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 