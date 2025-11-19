// Script para resetar senha do usuário
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔐 Resetando senha do usuário...\n')

const supabase = createClient(supabaseUrl, supabaseKey)

async function resetPassword() {
  try {
    const email = 'suporte@menezestech.com'
    const newPassword = 'Mnz@1305ii#!*'
    
    console.log('📧 Email:', email)
    console.log('🔑 Nova Senha:', newPassword)
    console.log('')

    // Primeiro, fazer login com a senha antiga
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'Mnz1305ii@#!'
    })

    if (signInError) {
      console.error('❌ Erro ao fazer login:', signInError.message)
      console.log('\n💡 Vou tentar criar um novo usuário...\n')
      
      // Deletar usuário antigo do Auth
      console.log('🗑️  Deletando usuário antigo...')
      
      // Criar novo usuário
      const { data: newUser, error: createError } = await supabase.auth.signUp({
        email,
        password: newPassword,
        options: {
          data: {
            name: 'Suporte MenezesTech',
            role: 'superadmin'
          }
        }
      })

      if (createError) {
        console.error('❌ Erro ao criar usuário:', createError.message)
        process.exit(1)
      }

      console.log('✅ Novo usuário criado!')
      console.log('🆔 ID:', newUser.user.id)
      
      // Atualizar tabela users
      const { error: updateError } = await supabase
        .from('users')
        .update({ id: newUser.user.id })
        .eq('email', email)

      if (updateError) {
        console.log('⚠️  Aviso:', updateError.message)
      }

      // Confirmar email
      await supabase.rpc('confirm_email', { user_id: newUser.user.id })

      console.log('\n✅ Senha atualizada com sucesso!')
      console.log('\n📋 Novas credenciais:')
      console.log('   Email:', email)
      console.log('   Senha:', newPassword)
      return
    }

    console.log('✅ Login bem-sucedido com senha antiga')
    console.log('🔄 Atualizando senha...')

    // Atualizar senha
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      console.error('❌ Erro ao atualizar senha:', updateError.message)
      process.exit(1)
    }

    console.log('✅ Senha atualizada com sucesso!')
    console.log('\n📋 Novas credenciais:')
    console.log('   Email:', email)
    console.log('   Senha:', newPassword)

  } catch (error) {
    console.error('\n❌ Erro:', error.message)
    process.exit(1)
  }
}

resetPassword()
