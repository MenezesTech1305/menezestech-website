const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Definida' : '❌ Não definida')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Definida' : '❌ Não definida')
  process.exit(1)
}

// Cliente normal para testes
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLoginAndInstructions() {
  try {
    console.log('🔐 Testando credenciais do administrador...')
    
    const adminEmail = 'admin@menezestech.com'
    const adminPassword = 'Mnz1305ii@#!'
    
    console.log('\n📊 Informações de conexão:')
    console.log('🌐 URL:', supabaseUrl)
    console.log('🔑 Anon Key:', supabaseAnonKey.substring(0, 50) + '...')
    
    // Testar login
    console.log('\n🧪 Testando login...')
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    })
    
    if (loginError) {
      console.error('❌ Erro no login:', loginError.message)
      console.log('\n🛠️  INSTRUÇÕES PARA CORRIGIR:')
      console.log('1. Acesse o Dashboard do Supabase: https://supabase.com/dashboard')
      console.log('2. Vá para seu projeto: MenezesTech System')
      console.log('3. Navegue para: Authentication → Users')
      console.log('4. Encontre o usuário: admin@menezestech.com')
      console.log('5. Se não existir, clique em "Add user" e crie:')
      console.log('   📧 Email: admin@menezestech.com')
      console.log('   🔑 Password: Mnz1305ii@#!')
      console.log('   ✅ Email confirmed: true')
      console.log('6. Se existir, clique nos 3 pontos → "Reset password"')
      console.log('7. Defina a nova senha: Mnz1305ii@#!')
      console.log('8. Execute este script novamente')
      
      return false
    }
    
    console.log('✅ Login realizado com sucesso!')
    console.log('👤 Usuário logado:', loginData.user.email)
    console.log('🆔 ID do usuário:', loginData.user.id)
    
    // Verificar dados na tabela users
    console.log('\n🔍 Verificando dados na tabela users...')
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single()
    
    if (userError) {
      console.log('⚠️  Usuário não encontrado na tabela users. Isso é normal.')
      console.log('📝 O usuário precisa fazer login pela primeira vez no sistema.')
    } else {
      console.log('✅ Dados encontrados na tabela users:')
      console.log('📧 Email:', userData.email)
      console.log('👤 Nome:', userData.name)
      console.log('🔰 Role:', userData.role)
      console.log('🏢 Empresa:', userData.company)
      console.log('✅ Ativo:', userData.is_active)
    }
    
    // Fazer logout
    await supabase.auth.signOut()
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ TESTE CONCLUÍDO COM SUCESSO!')
    console.log('📧 Email: admin@menezestech.com')
    console.log('🔑 Senha: Mnz1305ii@#!')
    console.log('🌐 Portal: http://localhost:3000/portal')
    console.log('🚀 Execute: npm run dev (se não estiver rodando)')
    console.log('='.repeat(60))
    
    return true
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message)
    return false
  }
}

testLoginAndInstructions() 