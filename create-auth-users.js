#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const SUPABASE_URL = 'https://lrjkyupznspzvxrhxtsh.supabase.co';
const SUPABASE_SERVICE_KEY = 'SUA_SERVICE_KEY_AQUI'; // Precisa ser obtida do dashboard

// ⚠️ ATENÇÃO: Para usar este script, você precisa:
// 1. Ir no Dashboard Supabase > Settings > API
// 2. Copiar a "service_role" key (não a anon key)
// 3. Substituir SUA_SERVICE_KEY_AQUI pela chave real

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Usuários para criar
const users = [
  {
    email: 'admin@menezestech.com.br',
    password: 'Admin123!',
    name: 'Administrador Sistema',
    role: 'superadmin',
    company: 'MenezesTech'
  },
  {
    email: 'nattan@menezestech.com.br',
    password: 'Nattan123!',
    name: 'Nattan Menezes',
    role: 'superadmin',
    company: 'MenezesTech'
  },
  {
    email: 'carlos@menezestech.com.br',
    password: 'Carlos123!',
    name: 'Carlos Silva',
    role: 'admin',
    company: 'MenezesTech'
  },
  {
    email: 'ana@menezestech.com.br',
    password: 'Ana123!',
    name: 'Ana Santos',
    role: 'funcionario',
    company: 'MenezesTech'
  },
  {
    email: 'cliente@empresa.com.br',
    password: 'Cliente123!',
    name: 'João Cliente',
    role: 'cliente',
    company: 'Empresa Exemplo Ltda'
  }
];

async function createAuthUsers() {
  console.log('🚀 Criando usuários no Supabase Auth...\n');

  for (const user of users) {
    try {
      console.log(`📧 Criando usuário: ${user.email}`);
      
      // Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          role: user.role,
          company: user.company
        }
      });

      if (authError) {
        console.error(`❌ Erro ao criar ${user.email}:`, authError.message);
        continue;
      }

      // Atualizar/inserir na tabela users
      const { error: dbError } = await supabase
        .from('users')
        .upsert({
          id: authData.user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          company: user.company,
          is_active: true,
          email_verified: true
        });

      if (dbError) {
        console.error(`⚠️ Erro ao atualizar tabela users para ${user.email}:`, dbError.message);
      } else {
        console.log(`✅ Usuário ${user.email} criado com sucesso!`);
      }

    } catch (error) {
      console.error(`💥 Erro inesperado para ${user.email}:`, error.message);
    }
  }

  console.log('\n🎉 Processo concluído!');
  console.log('📋 Verifique o dashboard: https://supabase.com/dashboard/project/lrjkyupznspzvxrhxtsh');
}

// Verificar se tem a service key
if (SUPABASE_SERVICE_KEY === 'SUA_SERVICE_KEY_AQUI') {
  console.log('⚠️ CONFIGURAÇÃO NECESSÁRIA:');
  console.log('1. Acesse: https://supabase.com/dashboard/project/lrjkyupznspzvxrhxtsh');
  console.log('2. Vá em Settings > API');
  console.log('3. Copie a "service_role" key');
  console.log('4. Substitua SUA_SERVICE_KEY_AQUI neste arquivo');
  console.log('5. Execute: node create-auth-users.js');
} else {
  createAuthUsers();
}

module.exports = { createAuthUsers, users }; 