'use client'

import { useEffect } from 'react'

/**
 * Componente para limpar cache e garantir que a aplicação sempre use dados frescos
 */
export function CacheBuster() {
  useEffect(() => {
    // Desregistrar service workers se existirem
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister()
          console.log('Service Worker desregistrado')
        })
      })
    }

    // Limpar cache do navegador se a API estiver disponível
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }

    // Adicionar listener para detectar quando a aba fica visível novamente
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Aba ficou visível, verificando cache...')
        // Forçar reload de dados quando voltar para a aba
        window.dispatchEvent(new Event('tab-visible'))
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Adicionar listener para detectar navegação
    const handleFocus = () => {
      console.log('Janela recebeu foco')
      window.dispatchEvent(new Event('window-focus'))
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return null // Componente invisível
}

export default CacheBuster
