'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Save, RefreshCw, Image, FileText, Phone, Mail, Globe } from 'lucide-react'
import { toast } from 'sonner'

interface SiteContent {
  id: string
  section: string
  key: string
  value: string
  type: string
  description: string
}

export default function CMSPage() {
  const [content, setContent] = useState<SiteContent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadContent()

    return () => {
      setMounted(false)
    }
  }, [])

  const loadContent = async () => {
    if (!mounted) return
    
    try {
      setLoading(true)
      console.log('CMS: Carregando conteúdo...')
      
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section', { ascending: true })

      if (error) {
        console.error('Erro ao carregar conteúdo:', error)
        toast.error(`Erro: ${error.message}`)
        setContent([])
        return
      }
      
      console.log('CMS: Conteúdo carregado:', data?.length || 0, 'itens')
      setContent(data || [])
      
      if (!data || data.length === 0) {
        toast.info('Nenhum conteúdo encontrado. Verifique se a tabela site_content foi criada.')
      }
    } catch (error: any) {
      console.error('Erro ao carregar conteúdo:', error)
      toast.error(error.message || 'Erro ao carregar conteúdo')
      setContent([])
    } finally {
      if (mounted) {
        setLoading(false)
      }
    }
  }

  const updateContent = async (id: string, value: string) => {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('site_content')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setContent(content.map(item => 
        item.id === id ? { ...item, value } : item
      ))

      toast.success('Conteúdo atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      toast.error('Erro ao atualizar conteúdo')
    } finally {
      setSaving(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />
      case 'phone': return <Phone className="h-4 w-4" />
      case 'email': return <Mail className="h-4 w-4" />
      case 'url': return <Globe className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = []
    }
    acc[item.section].push(item)
    return acc
  }, {} as Record<string, SiteContent[]>)

  if (loading) {
    return (
      <ProtectedRoute requiredRole={['superadmin', 'admin']}>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Carregando conteúdo...</p>
        </div>
      </ProtectedRoute>
    )
  }

  if (!loading && content.length === 0) {
    return (
      <ProtectedRoute requiredRole={['superadmin', 'admin']}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Editor de Conteúdo</h1>
              <p className="text-gray-600 mt-1">
                Edite todo o conteúdo do site em tempo real
              </p>
            </div>
            <Button onClick={loadContent} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Recarregar
            </Button>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum conteúdo encontrado
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-4">
                A tabela site_content está vazia ou não foi criada. Execute o SQL de criação no Supabase.
              </p>
              <Button onClick={loadContent}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole={['superadmin', 'admin']}>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Editor de Conteúdo</h1>
          <p className="text-gray-600 mt-1">
            Edite todo o conteúdo do site em tempo real
          </p>
        </div>
        <Button onClick={loadContent} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Recarregar
        </Button>
      </div>

      <Tabs defaultValue={Object.keys(groupedContent)[0]} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          {Object.keys(groupedContent).map(section => (
            <TabsTrigger key={section} value={section} className="capitalize">
              {section}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedContent).map(([section, items]) => (
          <TabsContent key={section} value={section} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{section}</CardTitle>
                <CardDescription>
                  Edite o conteúdo da seção {section}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getIcon(item.type)}
                        <label className="font-medium capitalize">
                          {item.key.replace(/_/g, ' ')}
                        </label>
                        <Badge variant="outline">{item.type}</Badge>
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-gray-500">{item.description}</p>
                    )}

                    {item.type === 'html' ? (
                      <Textarea
                        value={item.value}
                        onChange={(e) => {
                          const newContent = content.map(c =>
                            c.id === item.id ? { ...c, value: e.target.value } : c
                          )
                          setContent(newContent)
                        }}
                        rows={4}
                        className="font-mono text-sm"
                      />
                    ) : (
                      <Input
                        type={item.type === 'email' ? 'email' : item.type === 'url' ? 'url' : 'text'}
                        value={item.value}
                        onChange={(e) => {
                          const newContent = content.map(c =>
                            c.id === item.id ? { ...c, value: e.target.value } : c
                          )
                          setContent(newContent)
                        }}
                      />
                    )}

                    <Button
                      onClick={() => updateContent(item.id, item.value)}
                      disabled={saving}
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
    </ProtectedRoute>
  )
}
