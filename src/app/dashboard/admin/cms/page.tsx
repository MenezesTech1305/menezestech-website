'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
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

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section', { ascending: true })

      if (error) throw error
      setContent(data || [])
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error)
      toast.error('Erro ao carregar conteúdo do site')
    } finally {
      setLoading(false)
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
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
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
  )
}
