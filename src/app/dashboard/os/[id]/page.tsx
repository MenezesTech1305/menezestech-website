"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { OSDetails } from "@/components/os/os-details"
import { OSForm } from "@/components/os/os-form"
import { OSApprovalWorkflow } from "@/components/os/os-approval-workflow"
import { useParams, useRouter } from "next/navigation"

export default function OSDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const osId = params.id as string

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSuccess = () => {
    setIsEditing(false)
    setRefreshKey(prev => prev + 1)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleClose = () => {
    router.push('/dashboard/os')
  }

  const handleApprovalRequested = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <ProtectedRoute requiredRole={['superadmin', 'admin', 'funcionario', 'cliente']}>
      <DashboardLayout title={isEditing ? "Editar OS" : "Detalhes da OS"}>
        <div className="space-y-6">
          {isEditing ? (
            <OSForm 
              osId={osId} 
              onSuccess={handleSuccess} 
              onCancel={handleCancel} 
            />
          ) : (
            <>
              <OSDetails 
                key={refreshKey}
                osId={osId} 
                onEdit={handleEdit} 
                onClose={handleClose} 
              />
              <OSApprovalWorkflow 
                osId={osId}
                onApprovalRequested={handleApprovalRequested}
              />
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
