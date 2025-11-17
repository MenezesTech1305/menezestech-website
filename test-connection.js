// Script para testar conexão com Supabase
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testando conexão com Supabase...\n')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? '✅ Configurada' : '❌ Não configurada')
console.log('')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('📊 Testando acesso às tabelas...\n')

    // Testar tabela users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (usersError) throw usersError
    console.log('✅ Tabela users: OK')

    // Testar tabela ordens_servico
    const { data: os, error: osError } = await supabase
      .from('ordens_servico')
      .select('count')
      .limit(1)
    
    if (osError) throw osError
    console.log('✅ Tabela ordens_servico: OK')

    // Testar tabela os_approvals
    const { data: approvals, error: approvalsError } = await supabase
      .from('os_approvals')
      .select('count')
      .limit(1)
    
    if (approvalsError) throw approvalsError
    console.log('✅ Tabela os_approvals: OK')

    // Testar tabela notifications
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('count')
      .limit(1)
    
    if (notificationsError) throw notificationsError
    console.log('✅ Tabela notifications: OK')

    // Testar tabela activity_logs
    const { data: logs, error: logsError } = await supabase
      .from('activity_logs')
      .select('count')
      .limit(1)
    
    if (logsError) throw logsError
    console.log('✅ Tabela activity_logs: OK')

    console.log('\n🎉 Todas as tabelas estão acessíveis!')
    console.log('\n📋 Testando funções RPC...\n')

    // Testar função get_pending_approvals
    const { data: pendingApprovals, error: pendingError } = await supabase
      .rpc('get_pending_approvals')
    
    if (pendingError) {
      console.log('⚠️  Função get_pending_approvals:', pendingError.message)
    } else {
      console.log('✅ Função get_pending_approvals: OK')
      console.log(`   Aprovações pendentes: ${pendingApprovals?.length || 0}`)
    }

    console.log('\n✨ Conexão com Supabase estabelecida com sucesso!')
    console.log('\n🚀 Backend está pronto para uso!')
    
  } catch (error) {
    console.error('\n❌ Erro ao testar conexão:', error.message)
    process.exit(1)
  }
}

testConnection()
