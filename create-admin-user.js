// Script para criar usuário admin no Supabase Auth
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔐 Criando usuário admin no Supabase Auth...\n')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdminUser() {
  try {
    const email = 'suporte@menezestech.com'
    const password = 'Mnz1305ii@#!'
    
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', password)
    console.log('')

    // Criar usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: 'Suporte MenezesTech',
          role: 'superadmin'
        },
        emailRedirectTo: undefined // Desabilitar confirmação de email
      }
    })

    if (authError) {
      // Se o erro for que o usuário já existe, tentar fazer login
      if (authError.message.includes('already registered')) {
        console.log('⚠️  Usuário já existe. Testando login...\n')
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (signInError) {
          console.error('❌ Erro ao fazer login:', signInError.message)
          console.log('\n💡 Dica: A senha pode estar diferente. Use o Supabase Dashboard para resetar.')
          process.exit(1)
        }

        console.log('✅ Login bem-sucedido!')
        console.log('👤 Usuário:', signInData.user.email)
        console.log('🆔 ID:', signInData.user.id)
        
        // Atualizar tabela users com o ID correto
        const { error: updateError } = await supabase
          .from('users')
          .update({ id: signInData.user.id })
          .eq('email', email)

        if (updateError) {
          console.log('⚠️  Aviso ao atualizar ID:', updateError.message)
        } else {
          console.log('✅ ID sincronizado na tabela users')
        }

        console.log('\n🎉 Usuário admin está pronto para uso!')
        console.log('\n📋 Credenciais:')
        console.log('   Email:', email)
        console.log('   Senha:', password)
        return
      }

      throw authError
    }

    console.log('✅ Usuário criado no Auth!')
    console.log('👤 Email:', authData.user.email)
    console.log('🆔 ID:', authData.user.id)

    // Atualizar tabela users com o ID do Auth
    const { error: updateError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email: email,
        name: 'Suporte MenezesTech',
        role: 'superadmin',
        is_active: true
      })

    if (updateError) {
      console.log('⚠️  Aviso ao sincronizar com tabela users:', updateError.message)
    } else {
      console.log('✅ Dados sincronizados na tabela users')
    }

    console.log('\n🎉 Usuário admin criado com sucesso!')
    console.log('\n📋 Credenciais de acesso:')
    console.log('   Email:', email)
    console.log('   Senha:', password)
    console.log('\n💡 Use essas credenciais para fazer login no sistema')

  } catch (error) {
    console.error('\n❌ Erro ao criar usuário:', error.message)
    process.exit(1)
  }
}

createAdminUser()
