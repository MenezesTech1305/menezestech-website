import React from 'react'
import { X } from 'lucide-react'
import { Toast as ToastType } from '@/hooks/use-toast'

interface ToastProps {
  toast: ToastType
  onDismiss: (id: string) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const getVariantStyles = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-600 text-white border-red-600'
      case 'success':
        return 'bg-green-600 text-white border-green-600'
      case 'warning':
        return 'bg-yellow-600 text-white border-yellow-600'
      default:
        return 'bg-white text-gray-900 border-gray-200 shadow-lg'
    }
  }

  return (
    <div
      className={`
        relative flex w-full items-center justify-between space-x-4 
        overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all
        ${getVariantStyles(toast.variant)}
      `}
    >
      <div className="grid gap-1">
        {toast.title && (
          <div className="text-sm font-semibold">
            {toast.title}
          </div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90">
            {toast.description}
          </div>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

export function Toaster() {
  // This will be implemented with the toast provider
  return null
} 