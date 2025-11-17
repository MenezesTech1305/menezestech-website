// Script para confirmar email do usuário no Supabase
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('✉️  Confirmando email do usuário...\n')

const supabase = createClient(supabaseUrl, supabaseKey)

async function confirmEmail() {
  try {
    const email = 'suporte@menezestech.com'
    
    console.log('📧 Email:', email)
    console.log('⏳ Processando...\n')

    // Fazer login para confirmar
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'Mnz1305ii@#!'
    })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        console.log('⚠️  Email não confirmado!')
        console.log('\n📋 Soluções:')
        console.log('1. Acesse o Supabase Dashboard')
        console.log('2. Vá em Authentication → Users')
        console.log('3. Encontre o usuário suporte@menezestech.com')
        console.log('4. Clique nos 3 pontos → "Confirm Email"')
        console.log('\nOu desabilite a confirmação de email:')
        console.log('1. Vá em Authentication → Settings')
        console.log('2. Desabilite "Enable email confirmations"')
        return
      }
      throw error
    }

    console.log('✅ Email confirmado e login bem-sucedido!')
    console.log('👤 Usuário:', data.user.email)
    console.log('🆔 ID:', data.user.id)
    console.log('\n🎉 Pronto para usar!')

  } catch (error) {
    console.error('\n❌ Erro:', error.message)
  }
}

confirmEmail()
