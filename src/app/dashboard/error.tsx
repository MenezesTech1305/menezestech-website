'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Algo deu errado
              </h2>
              <p className="text-gray-600 mt-2">
                Ocorreu um erro ao carregar esta página.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
                className="flex-1"
              >
                Ir para Dashboard
              </Button>
              <Button 
                onClick={reset}
                className="flex-1"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
