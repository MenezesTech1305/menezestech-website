# Sistema de Usuários e Hierarquia - MenezesTech

## 📋 Visão Geral

Sistema completo de gerenciamento de usuários com controle hierárquico implementado usando Supabase Auth + Database personalizado.

## 🏗️ Arquitetura Implementada

### Usuário Principal Configurado
- **Email:** admin@menezestech.com
- **Senha:** Mnz1305ii@#!
- **Role:** superadmin (controle total)

### Hierarquia de Permissões

```
SUPERADMIN (admin@menezestech.com)
├── Pode criar/editar qualquer tipo de usuário
├── Acesso total ao sistema
└── Gerencia outros superadmins

ADMIN
├── Pode criar funcionários e clientes
├── Não pode criar outros admins
└── Acesso aos módulos administrativos

FUNCIONARIO
├── Acesso limitado aos módulos operacionais
├── Pode editar apenas seu próprio perfil
└── Não pode criar outros usuários

CLIENTE
├── Acesso apenas ao portal do cliente
├── Visualiza apenas suas próprias informações
└── Sem permissões administrativas
```

## 🛠️ Funcionalidades Implementadas

### 1. Sistema de Autenticação
- ✅ Integração completa com Supabase Auth
- ✅ Sincronização automática auth.users ↔ public.users
- ✅ Controle de sessão e estados
- ✅ Proteção de rotas por role

### 2. Gerenciamento de Usuários
- ✅ Interface completa de administração
- ✅ Criação de usuários com validação hierárquica
- ✅ Sistema de convites com tokens únicos
- ✅ Listagem filtrada por permissões
- ✅ Edição respeitando hierarquia

### 3. Banco de Dados
- ✅ Tabela `users` com RLS (Row Level Security)
- ✅ Tabela `user_invites` para convites pendentes
- ✅ Funções SQL para operações seguras
- ✅ Logs de auditoria completos

## 📊 Estrutura do Banco

### Tabela: users
```sql
- id (UUID, PK) - Sincronizado com auth.users
- email (TEXT, UNIQUE)
- name (TEXT)
- role (ENUM: superadmin, admin, funcionario, cliente)
- company (TEXT)
- phone (TEXT)
- document (TEXT)
- is_active (BOOLEAN)
- email_verified (BOOLEAN)
- last_login (TIMESTAMP)
- created_at/updated_at (TIMESTAMP)
```

### Tabela: user_invites
```sql
- id (UUID, PK)
- email (TEXT, UNIQUE)
- name (TEXT)
- role (user_role)
- company, phone, document (TEXT)
- invite_token (TEXT, UNIQUE)
- expires_at (TIMESTAMP) - 7 dias
- created_by (UUID, FK users.id)
- used_at (TIMESTAMP)
- created_at/updated_at (TIMESTAMP)
```

## 🔐 Políticas de Segurança (RLS)

### Users Table
```sql
-- Ver usuários: baseado na hierarquia
-- Superadmin: vê todos
-- Admin: vê funcionários e clientes
-- Funcionário/Cliente: vê apenas si mesmo

-- Editar usuários: mesma lógica hierárquica
-- Criar usuários: apenas superadmin e admin
```

### User Invites Table
```sql
-- Ver/criar convites: apenas superadmin e admin
-- Aceitar convites: função especial com token
```

## 🎛️ Funções SQL Implementadas

### 1. `create_user_invite()`
- Cria convite para novo usuário
- Valida hierarquia de permissões
- Gera token único de 7 dias
- Registra auditoria

### 2. `accept_user_invite()`
- Aceita convite usando token
- Valida email correspondente
- Cria usuário na tabela users
- Marca convite como usado

### 3. `get_users_by_permission()`
- Lista usuários baseado na role atual
- Aplica filtros hierárquicos
- Retorna dados formatados

### 4. `update_user_data()`
- Atualiza dados do usuário
- Respeita hierarquia para edições
- Registra alterações no log

### 5. `get_pending_invites()`
- Lista convites pendentes
- Apenas para admin/superadmin
- Inclui informações do criador

## 🚀 Como Usar o Sistema

### 1. Login como Superadmin
```
Email: admin@menezestech.com
Senha: Mnz1305ii@#!
```

### 2. Acessar Gerenciamento de Usuários
- Navegue para: Dashboard → Usuários
- Ou acesse: `/dashboard/admin/usuarios`

### 3. Criar Novo Usuário
1. Clique em "Novo Usuário"
2. Preencha os dados:
   - Email
   - Nome completo
   - Tipo de usuário (baseado na sua permissão)
   - Empresa (opcional)
   - Telefone (opcional)
3. Clique em "Criar Usuário"

### 4. Configurar no Supabase Auth
Após criar o usuário no sistema, você precisa:

1. Acessar o Dashboard do Supabase
2. Ir em Authentication → Users
3. Criar o usuário com o mesmo email
4. Definir senha temporária
5. Enviar convite por email (opcional)

## 🔄 Fluxo de Criação de Usuários

```
SUPERADMIN
    ↓
Cria usuário no sistema (tabela users)
    ↓
Cria usuário no Supabase Auth
    ↓
Usuário recebe credenciais
    ↓
Primeiro login sincroniza dados
    ↓
Sistema funcional completo
```

## 🎨 Interface do Usuário

### Dashboard Principal
- Estatísticas por tipo de usuário
- Listagem completa com filtros
- Ações rápidas de edição

### Formulário de Criação
- Validação em tempo real
- Campos condicionais por role
- Feedback de sucesso/erro

### Tabela de Usuários
- Informações organizadas
- Status visual (ativo/inativo)
- Badges coloridos por role
- Ações disponíveis por permissão

## 🚦 Validações e Regras

### Hierarquia de Criação
- ✅ Superadmin: cria qualquer tipo
- ✅ Admin: cria funcionário e cliente
- ❌ Admin: NÃO cria outros admins
- ❌ Funcionário/Cliente: NÃO cria usuários

### Validações de Email
- ✅ Email único no sistema
- ✅ Formato válido
- ✅ Não pode duplicar convites pendentes

### Segurança
- ✅ Tokens únicos com expiração
- ✅ RLS em todas as tabelas
- ✅ Auditoria completa de ações
- ✅ Validação de permissões em cada operação

## 📱 Páginas e Componentes

### Páginas Criadas
- `/dashboard/admin/usuarios` - Gerenciamento de usuários

### Componentes Principais
- `UserManagement.tsx` - Interface principal
- `ProtectedRoute.tsx` - Proteção por role
- `usePermissions.ts` - Hook de permissões

### Navegação
- Menu lateral com item "Usuários"
- Visível apenas para admin/superadmin
- Link direto para gerenciamento

## 🔧 Manutenção e Monitoramento

### Logs de Auditoria
Todas as ações são registradas em `activity_logs`:
- Criação de usuários
- Criação de convites
- Aceitação de convites
- Edições de dados

### Convites Pendentes
- Expiram automaticamente em 7 dias
- Podem ser visualizados na interface
- Função para reenvio (futura implementação)

### Limpeza Automática
- Convites expirados são mantidos para auditoria
- Logs são preservados permanentemente
- Users inativos podem ser marcados

## ✅ Status da Implementação

### Concluído ✅
- [x] Estrutura completa do banco
- [x] Políticas RLS funcionais
- [x] Funções SQL seguras
- [x] Interface de gerenciamento
- [x] Proteção de rotas
- [x] Sistema de hierarquia
- [x] Usuário superadmin configurado
- [x] Integração Supabase Auth
- [x] Documentação completa

### Melhorias Futuras 🚀
- [ ] Interface para reenvio de convites
- [ ] Notificações por email automáticas
- [ ] Histórico detalhado de ações
- [ ] Importação em lote
- [ ] API REST para integrações
- [ ] Dashboard de analytics

## 🎯 Próximos Passos

1. **Teste o Sistema**
   - Faça login como admin@menezestech.com
   - Acesse o gerenciamento de usuários
   - Crie um usuário de teste

2. **Configure Usuários Reais**
   - Crie os usuários da MenezesTech
   - Configure permissões adequadas
   - Teste fluxos completos

3. **Personalize Conforme Necessário**
   - Ajuste campos adicionais
   - Customize validações
   - Adicione funcionalidades específicas

---

## 📞 Suporte

Sistema desenvolvido para **MenezesTech** com foco em escalabilidade e segurança empresarial.

Para dúvidas ou melhorias, consulte esta documentação ou revise o código implementado.

**Versão:** 1.0.0  
**Data:** 2024-12-26  
**Status:** Produção Ready ✅ 