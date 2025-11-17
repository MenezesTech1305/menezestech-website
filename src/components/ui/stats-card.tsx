import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    period: string
  }
  icon?: React.ComponentType<any>
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className,
  variant = 'default'
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'danger':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'danger':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  const getChangeIcon = () => {
    switch (change?.type) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getChangeColor = () => {
    switch (change?.type) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className={cn(getVariantStyles(), className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            
            {change && (
              <div className="flex items-center mt-2">
                {getChangeIcon()}
                <span className={cn("text-sm font-medium ml-1", getChangeColor())}>
                  {change.value > 0 ? '+' : ''}{change.value}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {change.period}
                </span>
              </div>
            )}
          </div>
          
          {Icon && (
            <div className={cn("p-3 rounded-full", getIconColor())}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 