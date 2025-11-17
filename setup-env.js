#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Template do arquivo .env.local
const envTemplate = `# 🔒 CONFIGURAÇÕES DO SUPABASE - MENEZESTECH
NEXT_PUBLIC_SUPABASE_URL=https://lrjkyupznspzvxrhxtsh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyamt5dXB6bnNwenZ4cmh4dHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDQ2MzUsImV4cCI6MjA2NjUyMDYzNX0.EkuQ9LD7JqiYew852c68QuE1GkucLDHPIeAUOfYjT70

# 🔐 NEXTAUTH CONFIGURATION
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=menezestech-super-secret-key-2024-production-ready

# 📧 EMAIL CONFIGURATION (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@menezestech.com.br
SMTP_PASS=your-app-password-here

# 📱 WHATSAPP BUSINESS API
WHATSAPP_TOKEN=your-whatsapp-business-token
WHATSAPP_PHONE=+5511999999999
WHATSAPP_WEBHOOK_VERIFY_TOKEN=menezestech-webhook-verify

# 💳 PAYMENT GATEWAY (MERCADO PAGO / STRIPE)
PAYMENT_GATEWAY_PUBLIC_KEY=your-payment-public-key
PAYMENT_GATEWAY_SECRET_KEY=your-payment-secret-key
PAYMENT_GATEWAY_WEBHOOK_SECRET=your-webhook-secret

# 📁 FILE UPLOAD CONFIGURATION
UPLOAD_MAX_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,zip,rar

# 🛡️ SECURITY SETTINGS
BCRYPT_SALT_ROUNDS=12
JWT_REFRESH_SECRET=menezestech-jwt-refresh-secret-2024

# 📊 ANALYTICS & MONITORING
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SENTRY_DSN=your-sentry-dsn-here

# 🔧 DEVELOPMENT SETTINGS
NODE_ENV=development
DEBUG=false

# 🏢 COMPANY INFORMATION
COMPANY_NAME=MenezesTech
COMPANY_EMAIL=contato@menezestech.com.br
COMPANY_PHONE=(11) 99999-9999
COMPANY_ADDRESS=Rua Exemplo, 123 - São Paulo, SP
`;

// Função principal
async function setupEnv() {
  const envPath = path.join(__dirname, '.env.local');
  
  console.log('🚀 Configurando arquivo .env.local para o projeto MenezesTech...\n');
  
  // Verificar se já existe
  if (fs.existsSync(envPath)) {
    console.log('⚠️  Arquivo .env.local já existe!');
    console.log('❓ Deseja sobrescrever? (s/N)');
    
    // Em um ambiente real, você usaria readline para input do usuário
    // Por enquanto, vamos apenas mostrar a mensagem
    console.log('💡 Para continuar manualmente, execute:');
    console.log('   rm .env.local && node setup-env.js');
    return;
  }
  
  try {
    // Criar o arquivo .env.local
    fs.writeFileSync(envPath, envTemplate, 'utf8');
    
    console.log('✅ Arquivo .env.local criado com sucesso!');
    console.log('📁 Localização:', envPath);
    console.log('\n🔧 Configurações aplicadas:');
    console.log('   ✅ Supabase URL e chave configuradas');
    console.log('   ✅ NextAuth configurado');
    console.log('   ✅ Configurações de email prontas');
    console.log('   ✅ Variáveis de segurança definidas');
    console.log('   ✅ Informações da empresa configuradas');
    
    console.log('\n📝 Próximos passos:');
    console.log('   1. Revisar as configurações em .env.local');
    console.log('   2. Configurar SMTP para envio de emails');
    console.log('   3. Configurar integração WhatsApp (opcional)');
    console.log('   4. Configurar gateway de pagamento (opcional)');
    console.log('   5. Executar: npm run dev');
    
    console.log('\n🎉 Sistema pronto para uso!');
    console.log('📖 Consulte CONFIGURACAO_SUPABASE.md para mais detalhes.');
    
  } catch (error) {
    console.error('❌ Erro ao criar arquivo .env.local:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupEnv();
}

module.exports = { setupEnv, envTemplate }; 