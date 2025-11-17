"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { OSForm } from "@/components/os/os-form"
import { useRouter } from "next/navigation"

export default function NovaOSPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/dashboard/os')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <ProtectedRoute requiredRole={['superadmin', 'admin']}>
      <DashboardLayout title="Nova Ordem de Serviço">
        <OSForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
