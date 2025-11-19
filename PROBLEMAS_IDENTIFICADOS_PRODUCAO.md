# PROBLEMAS IDENTIFICADOS E CORREÇÕES

## 🔴 PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. **FALTA DE LAYOUT NO DASHBOARD**
- **Problema**: Não existe `layout.tsx` em `src/app/dashboard/`
- **Impacto**: Todas as páginas do dashboard não têm estrutura comum, causando 404 e bugs de navegação
- **Solução**: Criar layout.tsx no dashboard com DashboardLayout

### 2. **PÁGINAS SEM WRAPPER DE LAYOUT**
- **Problema**: Páginas como CMS e Configurações não usam DashboardLayout corretamente
- **Impacto**: Navegação quebrada, sem sidebar, sem header
- **Solução**: Envolver conteúdo com DashboardLayout

### 3. **AUTHCONTEXT COM LOOP INFINITO**
- **Problema**: `fetchUserData` chama RPC que pode não existir, causando loops
- **Impacto**: Lentidão extrema, travamentos
- **Solução**: Remover RPC desnecessário, simplificar autenticação

### 4. **NGINX SEM TRATAMENTO DE SPA**
- **Problema**: Nginx não redireciona rotas do Next.js corretamente
- **Impacto**: 404 em rotas dinâmicas e navegação direta
- **Solução**: Adicionar try_files correto

### 5. **BUILD NÃO OTIMIZADO**
- **Problema**: Output standalone sem configuração adequada
- **Impacto**: Lentidão no carregamento
- **Solução**: Otimizar configuração do Next.js

### 6. **FALTA DE LOADING STATES**
- **Problema**: Páginas não mostram loading adequado
- **Impacto**: Usuário vê tela branca, parece travado
- **Solução**: Adicionar Suspense e loading.tsx

## 📋 PLANO DE CORREÇÃO

1. ✅ Criar layout.tsx no dashboard
2. ✅ Corrigir AuthContext (remover RPC problemático)
3. ✅ Corrigir nginx.conf
4. ✅ Adicionar loading.tsx nas rotas
5. ✅ Otimizar next.config.js
6. ✅ Corrigir página CMS
7. ✅ Corrigir página Configurações
8. ✅ Adicionar error.tsx para tratamento de erros
