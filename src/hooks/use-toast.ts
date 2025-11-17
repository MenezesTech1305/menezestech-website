import React, { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  duration?: number
}

interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  duration?: number
}

const toasts: Toast[] = []
const listeners: Array<(toasts: Toast[]) => void> = []

let toastCount = 0

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_VALUE
  return toastCount.toString()
}

const addToast = (toastOptions: ToastOptions) => {
  const id = genId()
  const toast: Toast = {
    id,
    ...toastOptions,
    duration: toastOptions.duration ?? 5000,
  }
  
  toasts.push(toast)
  listeners.forEach((listener) => listener([...toasts]))
  
  // Auto remove toast after duration
  setTimeout(() => {
    removeToast(id)
  }, toast.duration)
  
  return {
    id,
    dismiss: () => removeToast(id),
    update: (options: Partial<ToastOptions>) => updateToast(id, options),
  }
}

const removeToast = (id: string) => {
  const index = toasts.findIndex((toast) => toast.id === id)
  if (index > -1) {
    toasts.splice(index, 1)
    listeners.forEach((listener) => listener([...toasts]))
  }
}

const updateToast = (id: string, options: Partial<ToastOptions>) => {
  const index = toasts.findIndex((toast) => toast.id === id)
  if (index > -1) {
    toasts[index] = { ...toasts[index], ...options }
    listeners.forEach((listener) => listener([...toasts]))
  }
}

export function useToast() {
  const [toastList, setToastList] = useState<Toast[]>([...toasts])

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  const toast = useCallback((options: ToastOptions) => {
    return addToast(options)
  }, [])

  // Subscribe to toast changes
  React.useEffect(() => {
    const unsubscribe = subscribe(setToastList)
    return unsubscribe
  }, [subscribe])

  return {
    toast,
    toasts: toastList,
    dismiss: removeToast,
  }
}

// Export the toast function for direct usage
export const toast = addToast 