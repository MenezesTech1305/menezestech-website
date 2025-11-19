#!/bin/bash

echo "🔧 Corrigindo sintaxe do Input no arquivo..."

# Cria um arquivo temporário com o conteúdo correto
cat > /tmp/page_fixed.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NovoPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    tags: ''
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
      meta_title: title
    })
  }

  const handleSubmit = async (e: React.FormEvent, status: string) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const postData = {
        ...formData,
        status,
        author_id: user.id,
        published_at: status === 'published' ? new Date().toISOString() : null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single()

      if (error) throw error

      toast.success(`Post ${status === 'published' ? 'publicado' : 'salvo como rascunho'} com sucesso!`)
      router.push('/dashboard/admin/blog')
    } catch (error: any) {
      console.error('Erro ao salvar post:', error)
      toast.error(error.message || 'Erro ao salvar post')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/admin/blog">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Novo Post</h1>
          <p className="text-gray-600 mt-1">Crie um novo post para o blog</p>
        </div>
      </div>

      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Digite o título do post"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-do-post"
              />
              <p className="text-sm text-gray-500">
                URL: /blog/{formData.slug || 'url-do-post'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve resumo do post"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured_image">Imagem Destacada (URL)</Label>
              <Input
                id="featured_image"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conteúdo</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Escreva o conteúdo do post aqui..."
              rows={15}
              className="font-mono"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Título</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="Título para SEO"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Descrição</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Descrição para SEO"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tecnologia, gestão, tutorial"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center space-x-4">
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={saving}
            variant="outline"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Rascunho
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            Publicar
          </Button>
        </div>
      </form>
    </div>
  )
}
EOF

# Substitui o arquivo
cp /tmp/page_fixed.tsx src/app/dashboard/admin/blog/novo/page.tsx

echo "✅ Arquivo corrigido!"
echo "🔨 Fazendo build..."

# Limpa cache
rm -rf .next

# Build
npm run build

# Se o build funcionar, commita
if [ $? -eq 0 ]; then
  echo "✅ Build OK! Reiniciando PM2..."
  pm2 restart menezestech-site
  pm2 save
else
  echo "❌ Build falhou!"
  exit 1
fi
