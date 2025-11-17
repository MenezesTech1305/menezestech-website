# 🚀 Deploy para GitHub e Produção

## 📋 Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `menezes-tech-sistema-os`
3. Descrição: `Sistema completo de gestão de Ordens de Serviço com workflow de aprovações`
4. Visibilidade: **Público** ou **Privado** (sua escolha)
5. **NÃO** marque "Initialize with README"
6. Clique em "Create repository"

---

## 📤 Passo 2: Enviar Código para o GitHub

Copie e execute estes comandos no terminal:

```bash
git remote add origin https://github.com/SEU_USUARIO/menezes-tech-sistema-os.git
git branch -M main
git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu username do GitHub!**

---

## 🌐 Passo 3: Deploy na Vercel (Recomendado)

### Opção A: Via Interface Web

1. Acesse: https://vercel.com/new
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em "Deploy"

### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy para produção
vercel --prod
```

---

## 🔐 Passo 4: Configurar Variáveis de Ambiente

### No Vercel:

1. Vá em: **Settings** → **Environment Variables**
2. Adicione:

```
NEXT_PUBLIC_SUPABASE_URL=https://adyugmeyhmidncqhehiv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu_anon_key_aqui
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

### Obter as chaves do Supabase:

1. Acesse: https://supabase.com/dashboard/project/adyugmeyhmidncqhehiv/settings/api
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🎯 Passo 5: Configurar Domínio Personalizado (Opcional)

### Na Vercel:

1. Vá em: **Settings** → **Domains**
2. Adicione seu domínio: `menezes.tech` ou `os.menezes.tech`
3. Configure os DNS conforme instruções da Vercel

### Registradores Comuns:

**Registro.br:**
```
Tipo: CNAME
Nome: os (ou @)
Valor: cname.vercel-dns.com
```

**Cloudflare:**
```
Tipo: CNAME
Nome: os (ou @)
Valor: cname.vercel-dns.com
Proxy: Desativado (nuvem cinza)
```

---

## ✅ Passo 6: Verificar Deploy

Após o deploy, teste:

1. **Homepage:** `https://seu-dominio.vercel.app`
2. **Portal:** `https://seu-dominio.vercel.app/portal`
3. **Dashboard:** `https://seu-dominio.vercel.app/dashboard`

---

## 🔄 Passo 7: Configurar CI/CD Automático

O deploy automático já está configurado! Toda vez que você fizer push para `main`:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

A Vercel automaticamente:
- ✅ Faz build do projeto
- ✅ Roda os testes
- ✅ Faz deploy para produção
- ✅ Gera preview URL

---

## 📊 Monitoramento

### Vercel Analytics:

1. Vá em: **Analytics** no dashboard da Vercel
2. Ative o Analytics (gratuito)
3. Monitore:
   - Visitantes
   - Performance
   - Erros

### Supabase Logs:

1. Acesse: https://supabase.com/dashboard/project/adyugmeyhmidncqhehiv/logs
2. Monitore:
   - Queries SQL
   - Autenticação
   - Erros de API

---

## 🛡️ Segurança em Produção

### Checklist:

- ✅ RLS habilitado em todas as tabelas
- ✅ Políticas de acesso configuradas
- ✅ Variáveis de ambiente protegidas
- ✅ HTTPS habilitado (automático na Vercel)
- ✅ CORS configurado no Supabase

### Configurar CORS no Supabase:

1. Vá em: **Settings** → **API**
2. Em "CORS Origins", adicione:
   - `https://seu-dominio.vercel.app`
   - `https://seu-dominio-personalizado.com`

---

## 🚨 Troubleshooting

### Erro: "Supabase connection failed"
- Verifique as variáveis de ambiente
- Confirme que o projeto Supabase está ativo

### Erro: "Build failed"
- Verifique os logs no Vercel
- Rode `npm run build` localmente para testar

### Erro: "RLS policy violation"
- Verifique as políticas no Supabase
- Confirme que o usuário tem as permissões corretas

---

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## 🎉 Pronto!

Seu sistema está em produção! 🚀

**URLs Importantes:**
- 🌐 Site: `https://seu-dominio.vercel.app`
- 📊 Dashboard Vercel: `https://vercel.com/dashboard`
- 🗄️ Dashboard Supabase: `https://supabase.com/dashboard/project/adyugmeyhmidncqhehiv`
- 💻 Repositório: `https://github.com/SEU_USUARIO/menezes-tech-sistema-os`
