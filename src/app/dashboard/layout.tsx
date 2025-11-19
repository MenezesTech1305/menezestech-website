'use client'

import { useEffect } from 'react'
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ensureValidSession } from '@/lib/supabase'

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Verificar sessão ao montar o dashboard
    const checkSession = async () => {
      const isValid = await ensureValidSession()
      if (!isValid) {
        console.warn('Sessão inválida ou expirada')
        // Redirecionar para login se necessário
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/portal')) {
          window.location.href = '/portal'
        }
      }
    }

    checkSession()

    // Verificar sessão periodicamente (a cada 5 minutos)
    const interval = setInterval(checkSession, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return <DashboardLayout title="Dashboard">{children}</DashboardLayout>
}
