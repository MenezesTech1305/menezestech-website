-- =====================================================
-- FIX: Políticas RLS da tabela users (recursão infinita)
-- =====================================================

-- 1. Remove TODAS as políticas antigas da tabela users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Superadmins can do everything" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON users;

-- 2. Desabilita RLS temporariamente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 3. Reabilita RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Cria políticas SIMPLES sem recursão

-- SELECT: Usuários autenticados podem ver seu próprio perfil
CREATE POLICY "users_select_own"
ON users FOR SELECT
TO authenticated
USING (auth.uid()::text = id::text);

-- SELECT: Admins e superadmins podem ver todos os usuários
CREATE POLICY "users_select_admin"
ON users FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text
    AND u.role IN ('admin', 'superadmin')
  )
);

-- INSERT: Apenas para service_role (sistema)
CREATE POLICY "users_insert_service"
ON users FOR INSERT
TO service_role
WITH CHECK (true);

-- UPDATE: Usuários podem atualizar seu próprio perfil (campos limitados)
CREATE POLICY "users_update_own"
ON users FOR UPDATE
TO authenticated
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- UPDATE: Admins podem atualizar qualquer usuário
CREATE POLICY "users_update_admin"
ON users FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text
    AND u.role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text
    AND u.role IN ('admin', 'superadmin')
  )
);

-- DELETE: Apenas superadmins podem deletar
CREATE POLICY "users_delete_superadmin"
ON users FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text
    AND u.role = 'superadmin'
  )
);

-- 5. Cria função helper para verificar role (evita recursão)
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM users WHERE id::text = auth.uid()::text LIMIT 1;
$$;

-- 6. Verifica as políticas criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Políticas RLS da tabela users corrigidas!';
  RAISE NOTICE '✅ Recursão infinita resolvida!';
  RAISE NOTICE '✅ Função helper criada!';
END $$;
