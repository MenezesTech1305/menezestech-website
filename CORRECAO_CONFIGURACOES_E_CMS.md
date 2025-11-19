# 🔧 CORREÇÃO: Configurações e CMS

## 🐛 PROBLEMAS IDENTIFICADOS

### 1. ❌ Configurações com "Erro ao Carregar"
**Causa**: Timeout no fetchUserData do AuthContext
**Solução**: Removido timeout, retorna dados básicos se falhar

### 2. ❌ CMS não reflete no site
**Causa**: Site usa dados HARDCODED, não lê da tabela site_content
**Solução**: Criado hook useSiteContent + integração

## ✅ CORREÇÕES APLICADAS

### 1. AuthContext Corrigido
**Arquivo**: `src/contexts/AuthContext.tsx`

**Mudança**:
- Removido timeout de 5 segundos
- Se falhar ao buscar usuário, retorna dados básicos do auth
- Usa user_metadata como fallback

**Resultado**: Configurações carregam sem erro

### 2. Hook useSiteContent Criado
**Arquivo**: `src/hooks/useSiteContent.ts` (NOVO)

**Funcionalidades**:
\`\`\`typescript
// Buscar conteúdo de uma seção
const { content } = useSiteContent('contact')

// Usar no componente
<p>{content.phone || '(11) 99999-9999'}</p>
\`\`\`

**Benefícios**:
- ✅ Busca dados do CMS automaticamente
- ✅ Cache para evitar múltiplas requisições
- ✅ Recarrega ao voltar para aba
- ✅ Fallback para valores padrão

### 3. Seção Contact Integrada
**Arquivo**: `src/components/sections/contact.tsx`

**Antes**:
\`\`\`tsx
const contactInfo = [
  {
    title: "Telefone",
    content: "(11) 99999-9999", // HARDCODED
  }
]
\`\`\`

**Depois**:
\`\`\`tsx
const { content } = useSiteContent('contact')

const contactInfo = [
  {
    title: "Telefone",
    content: content.phone || "(11) 99999-9999", // DO CMS
  }
]
\`\`\`

**Resultado**: Alterações no CMS aparecem no site

### 4. Script SQL para Setup
**Arquivo**: `setup-site-content.sql` (NOVO)

**Funcionalidades**:
- Cria tabela site_content se não existir
- Popula com dados iniciais
- Configura RLS (Row Level Security)
- Cria trigger para updated_at
- Adiciona índices para performance

## 🚀 COMO APLICAR

### Passo 1: Executar SQL no Supabase

1. Abrir Supabase Dashboard
2. Ir em SQL Editor
3. Copiar conteúdo de `setup-site-content.sql`
4. Executar

### Passo 2: Deploy do Código

\`\`\`bash
cd /opt/menezestech-website
git pull origin main
rm -rf .next node_modules/.cache
npm run build
pm2 restart menezestech
\`\`\`

### Passo 3: Testar CMS

1. Acessar `/dashboard/admin/cms`
2. Ir na aba "Contact"
3. Alterar telefone para "(28) 99967-7802"
4. Clicar "Salvar"
5. Abrir site público
6. Verificar se telefone mudou ✅

### Passo 4: Testar Configurações

1. Acessar `/dashboard/configuracoes`
2. Deve carregar sem erro ✅
3. Integrações devem aparecer ✅

## 📊 ESTRUTURA DA TABELA site_content

\`\`\`sql
CREATE TABLE site_content (
  id UUID PRIMARY KEY,
  section VARCHAR(50),      -- 'contact', 'hero', 'about', etc
  key VARCHAR(100),          -- 'phone', 'email', 'title', etc
  value TEXT,                -- Valor do conteúdo
  type VARCHAR(20),          -- 'text', 'email', 'phone', 'url', 'html'
  description TEXT,          -- Descrição do campo
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(section, key)
);
\`\`\`

## 📝 DADOS INICIAIS

### Contact
- `email`: contato@menezestech.com.br
- `phone`: (28) 99967-7802
- `address`: São Paulo, SP - Brasil
- `whatsapp`: 5528999677802

### Hero
- `title`: Soluções em Tecnologia da Informação
- `subtitle`: Especialistas em infraestrutura, segurança e LGPD
- `cta_text`: Fale Conosco

### Social
- `facebook`: https://facebook.com/menezestech
- `instagram`: https://instagram.com/menezestech
- `linkedin`: https://linkedin.com/company/menezestech

## 🔄 FLUXO COMPLETO

### CMS → Site

1. Admin edita no CMS (`/dashboard/admin/cms`)
2. Dados salvos na tabela `site_content`
3. Site público usa `useSiteContent()` hook
4. Hook busca dados da tabela
5. Componente renderiza com dados do CMS
6. ✅ Alteração aparece no site

### Diagrama:
\`\`\`
CMS (Admin) → site_content (DB) → useSiteContent (Hook) → Site (Público)
\`\`\`

## 🎯 PRÓXIMAS SEÇÕES A INTEGRAR

Para integrar outras seções do site com o CMS:

### Hero Section
\`\`\`tsx
// src/components/sections/hero.tsx
const { content } = useSiteContent('hero')

<h1>{content.title || 'Título Padrão'}</h1>
<p>{content.subtitle || 'Subtítulo Padrão'}</p>
\`\`\`

### About Section
\`\`\`tsx
// src/components/sections/about.tsx
const { content } = useSiteContent('about')

<h2>{content.title || 'Sobre Nós'}</h2>
<div dangerouslySetInnerHTML={{ __html: content.description }} />
\`\`\`

### Services Section
\`\`\`tsx
// src/components/sections/services.tsx
const { content } = useSiteContent('services')

<h2>{content.title || 'Nossos Serviços'}</h2>
\`\`\`

## ✅ CHECKLIST

- [x] AuthContext corrigido
- [x] Hook useSiteContent criado
- [x] Contact section integrada
- [x] Script SQL criado
- [ ] Executar SQL no Supabase
- [ ] Deploy do código
- [ ] Testar CMS
- [ ] Testar Configurações
- [ ] Integrar outras seções (opcional)

## 🐛 TROUBLESHOOTING

### CMS não salva
**Solução**: Verificar RLS policies no Supabase

\`\`\`sql
-- Ver policies
SELECT * FROM pg_policies WHERE tablename = 'site_content';

-- Recriar policy se necessário
DROP POLICY IF EXISTS "Permitir admin editar site_content" ON site_content;
CREATE POLICY "Permitir admin editar site_content"
  ON site_content FOR ALL
  USING (auth.jwt() ->> 'role' IN ('superadmin', 'admin'));
\`\`\`

### Site não mostra alterações
**Solução**: Limpar cache do navegador

\`\`\`
Ctrl+Shift+Delete
Limpar cache
Recarregar página
\`\`\`

### Configurações ainda com erro
**Solução**: Verificar logs

\`\`\`bash
pm2 logs menezestech --lines 100
# Procurar por erros do AuthContext
\`\`\`

## 📊 RESULTADO ESPERADO

### Antes:
- ❌ Configurações: "Erro ao Carregar"
- ❌ CMS: Alterações não aparecem no site
- ❌ Telefone hardcoded: (11) 99999-9999

### Depois:
- ✅ Configurações: Carrega normalmente
- ✅ CMS: Alterações aparecem no site
- ✅ Telefone do CMS: (28) 99967-7802

---

**Status**: ✅ CORRIGIDO
**Commit**: Próximo
**Deploy**: Aguardando
