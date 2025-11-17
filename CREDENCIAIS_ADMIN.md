# 🔐 Credenciais de Acesso - Sistema MenezesTech

## ✅ Usuário Administrador Criado

### 📧 Credenciais de Login:

```
Email: suporte@menezestech.com
Senha: Mnz1305ii@#!
```

### 👤 Informações do Usuário:

- **Nome:** Suporte MenezesTech
- **Role:** superadmin (Acesso Total)
- **Status:** Ativo
- **ID:** acddc18a-763f-486a-9a5c-2a7b2da6cac3

---

## ⚠️ IMPORTANTE - Confirmar Email:

O email precisa ser confirmado no Supabase antes do primeiro login:

### Opção 1: Via Dashboard (Recomendado)
1. Acesse: https://supabase.com/dashboard/project/adyugmeyhmidncqhehiv/auth/users
2. Encontre o usuário `suporte@menezestech.com`
3. Clique nos 3 pontos (...) → **"Confirm Email"**
4. Pronto! Agora pode fazer login

### Opção 2: Desabilitar Confirmação de Email
1. Acesse: https://supabase.com/dashboard/project/adyugmeyhmidncqhehiv/auth/providers
2. Em "Email" → Desabilite **"Enable email confirmations"**
3. Salve as alterações

---

## 🚀 Como Usar:

1. **Confirme o email** (veja acima)
2. Acesse o sistema em: `http://localhost:3000/portal`
3. Use as credenciais acima para fazer login
4. Você terá acesso total ao sistema como superadmin

---

## 🔧 Criar Novos Usuários:

### Via Script:
```bash
node create-admin-user.js
```

### Via Supabase Dashboard:
1. Acesse: https://supabase.com/dashboard/project/adyugmeyhmidncqhehiv/auth/users
2. Clique em "Add User"
3. Preencha email e senha
4. Depois, adicione na tabela `users` com o mesmo ID

### Via SQL:
```sql
-- 1. Criar no Auth (via Dashboard ou API)
-- 2. Adicionar na tabela users:
INSERT INTO users (id, email, name, role, is_active)
VALUES (
  'id-do-auth-user',
  'email@exemplo.com',
  'Nome do Usuário',
  'funcionario', -- ou 'admin', 'superadmin', 'cliente'
  true
);
```

---

## 🎯 Roles Disponíveis:

| Role | Permissões |
|------|-----------|
| **superadmin** | Acesso total ao sistema |
| **admin** | Gerenciar OS, usuários, aprovar solicitações |
| **funcionario** | Criar e gerenciar suas OS, solicitar aprovações |
| **cliente** | Visualizar suas OS e faturas |

---

## ⚠️ Segurança:

- **NÃO** compartilhe essas credenciais
- Altere a senha após o primeiro login
- Use senhas fortes para novos usuários
- Ative 2FA quando disponível

---

## 🔄 Resetar Senha:

### Via Supabase Dashboard:
1. Acesse: https://supabase.com/dashboard/project/adyugmeyhmidncqhehiv/auth/users
2. Encontre o usuário
3. Clique em "..." → "Reset Password"
4. Envie o link de reset por email

### Via Código:
```javascript
await supabase.auth.resetPasswordForEmail('email@exemplo.com')
```

---

## 📊 Status do Sistema:

- ✅ Backend Supabase: Configurado
- ✅ Tabelas: Criadas
- ✅ Funções RPC: Implementadas
- ✅ Usuário Admin: Criado
- ✅ Autenticação: Funcionando

**Sistema pronto para uso!** 🎉
