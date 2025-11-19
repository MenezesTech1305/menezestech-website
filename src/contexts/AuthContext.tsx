"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase, signIn, signOut, getCurrentUser, getCurrentSession } from '@/lib/supabase'
import { User } from '@/types/supabase'
import { Session, AuthError } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  clearError: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar dados completos do usuário
  const fetchUserData = async (authUser: any) => {
    if (!authUser) return null
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', authUser.email)
        .single()

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error)
        // Se falhar, retornar dados básicos do auth
        return {
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário',
          role: authUser.user_metadata?.role || 'cliente' as any,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }

      return data
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err)
      // Se falhar, retornar dados básicos do auth
      return {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário',
        role: authUser.user_metadata?.role || 'cliente' as any,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  }

  // Inicializar autenticação
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Verificar sessão atual
        const { session: currentSession } = await getCurrentSession()
        
        if (mounted) {
          setSession(currentSession)
          
          if (currentSession?.user) {
            const userData = await fetchUserData(currentSession.user)
            setUser(userData)
          } else {
            setUser(null)
          }
        }
      } catch (err) {
        console.error('Erro ao inicializar autenticação:', err)
        if (mounted) {
          setError('Erro ao carregar dados de autenticação')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listener para mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log('Auth state changed:', event, session?.user?.email)

      try {
        setSession(session)
        setLoading(true)

        if (session?.user) {
          const userData = await fetchUserData(session.user)
          setUser(userData)
        } else {
          setUser(null)
        }

        // Atualizar último login
        if (event === 'SIGNED_IN' && session?.user?.email) {
          try {
            await supabase
              .from('users')
              .update({ last_login: new Date().toISOString() })
              .eq('email', session.user.email)
          } catch (err) {
            console.error('Erro ao atualizar último login:', err)
          }
        }
      } catch (err) {
        console.error('Erro no onAuthStateChange:', err)
      } finally {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Função de login
  const handleSignIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await signIn(email, password)

             if (error) {
         let errorMessage = 'Erro ao fazer login'
         
         if (error instanceof Error) {
           if (error.message.includes('Invalid login credentials')) {
             errorMessage = 'Email ou senha incorretos'
           } else if (error.message.includes('Email not confirmed')) {
             errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.'
           } else if (error.message.includes('Too many requests')) {
             errorMessage = 'Muitas tentativas de login. Tente novamente em alguns minutos.'
           }
         }

         setError(errorMessage)
         return { success: false, error: errorMessage }
       }

       if (data?.session) {
         const userData = await fetchUserData(data.user)
         setUser(userData)
         setSession(data.session)
         return { success: true }
       }

      return { success: false, error: 'Erro inesperado no login' }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro inesperado no login'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Função de logout
  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      setUser(null)
      setSession(null)
      setError(null)
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err)
      setError('Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  // Limpar erros
  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signIn: handleSignIn,
    signOut: handleSignOut,
    clearError,
    isAuthenticated: !!session && !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export default AuthContext 