"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Shield, 
  BarChart3,
  MessageSquare,
  Bell,
  User,
  ChevronDown,
  DollarSign,
  Edit3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

interface NavItem {
  label: string
  href: string
  icon: any
  roles?: string[]
  subItems?: {
    label: string
    href: string
  }[]
}

const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Ordens de Serviço", href: "/dashboard/os", icon: FileText },
  { 
    label: "Financeiro", 
    href: "/dashboard/financeiro", 
    icon: DollarSign, 
    roles: ['superadmin', 'admin'],
    subItems: [
      { label: "Visão Geral", href: "/dashboard/financeiro" },
      { label: "Contas a Receber", href: "/dashboard/financeiro/contas-receber" },
      { label: "Contas a Pagar", href: "/dashboard/financeiro/contas-pagar" },
      { label: "Fluxo de Caixa", href: "/dashboard/financeiro/fluxo-caixa" }
    ]
  },
  { label: "Clientes", href: "/dashboard/clientes", icon: Users, roles: ['superadmin', 'admin', 'funcionario'] },
  { label: "Usuários", href: "/dashboard/admin/usuarios", icon: Shield, roles: ['superadmin', 'admin'] },
  { label: "Editor de Conteúdo", href: "/dashboard/admin/cms", icon: Edit3, roles: ['superadmin', 'admin'] },
  { label: "Relatórios", href: "/dashboard/relatorios", icon: BarChart3, roles: ['superadmin', 'admin'] },
  { label: "Mensagens", href: "/dashboard/mensagens", icon: MessageSquare },
  { label: "Configurações", href: "/dashboard/configuracoes", icon: Settings, roles: ['superadmin'] },
]

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/portal'
  }

  const filteredNavigation = navigationItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || '')
  )

  // Debug: mostrar role do usuário e itens filtrados
  console.log('User role:', user?.role)
  console.log('Filtered navigation:', filteredNavigation.map(i => i.label))

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold menezes-text-gradient">
              MenezesTech
            </span>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {filteredNavigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      active 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold menezes-text-gradient">
                  MenezesTech
                </span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        active 
                          ? "bg-blue-50 text-blue-600" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow border-b border-gray-200">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
            
            <div className="ml-4 flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <Avatar className="h-8 w-8">
                    <img
                      src={user?.avatar || `https://avatar.vercel.sh/${user?.name}`}
                      alt={user?.name}
                      className="h-8 w-8 rounded-full"
                    />
                  </Avatar>
                  <span className="ml-3 text-gray-700 text-sm font-medium">{user?.name}</span>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b">
                        {user?.role === 'superadmin' && 'Superadministrador'}
                        {user?.role === 'admin' && 'Administrador'}
                        {user?.role === 'funcionario' && 'Funcionário'}
                        {user?.role === 'cliente' && 'Cliente'}
                      </div>
                      <Link href="/dashboard/perfil" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="mr-3 h-4 w-4" />
                        Meu Perfil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 