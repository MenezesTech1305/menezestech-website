"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface FinancialCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info'
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  className?: string
  onClick?: () => void
}

export function FinancialCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
  change,
  className,
  onClick
}: FinancialCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    }
    return val
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'danger':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'info':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'danger':
        return 'text-red-600 bg-red-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'info':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getChangeColor = () => {
    if (!change) return ''
    return change.type === 'increase' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <Card 
      className={cn(
        getVariantStyles(),
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
            {change && (
              <div className="flex items-center mt-2">
                <span className={cn("text-sm font-medium", getChangeColor())}>
                  {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {change.period}
                </span>
              </div>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-full",
            getIconColor()
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 