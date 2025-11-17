'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  status: string
  published_at: string
  views: number
  created_at: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
      toast.error('Erro ao carregar posts do blog')
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este post?')) return

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPosts(posts.filter(p => p.id !== id))
      toast.success('Post deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar:', error)
      toast.error('Erro ao deletar post')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      published: 'default',
      draft: 'secondary',
      archived: 'destructive'
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os posts do blog
          </p>
        </div>
        <Link href="/dashboard/admin/blog/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {posts.map(post => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </div>
                {getStatusBadge(post.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {post.views} visualizações
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  </Link>
                  <Link href={`/dashboard/admin/blog/${post.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {posts.length === 0 && !loading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">Nenhum post encontrado</p>
              <Link href="/dashboard/admin/blog/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
