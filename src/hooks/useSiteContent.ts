'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface SiteContent {
  [key: string]: string
}

/**
 * Hook para buscar conteúdo do CMS
 * Cacheia os dados para evitar múltiplas requisições
 */
export function useSiteContent(section?: string) {
  const [content, setContent] = useState<SiteContent>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        
        let query = supabase
          .from('site_content')
          .select('key, value, section')

        if (section) {
          query = query.eq('section', section)
        }

        const { data, error: fetchError } = await query

        if (fetchError) {
          console.error('Erro ao buscar conteúdo do site:', fetchError)
          setError(fetchError.message)
          return
        }

        // Transformar array em objeto para fácil acesso
        const contentMap: SiteContent = {}
        data?.forEach(item => {
          contentMap[item.key] = item.value
        })

        setContent(contentMap)
      } catch (err: any) {
        console.error('Erro ao buscar conteúdo:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()

    // Recarregar quando a aba ficar visível
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchContent()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [section])

  return { content, loading, error }
}

/**
 * Hook para buscar um valor específico do CMS
 */
export function useSiteValue(key: string, defaultValue: string = '') {
  const { content, loading } = useSiteContent()
  return loading ? defaultValue : (content[key] || defaultValue)
}

export default useSiteContent
