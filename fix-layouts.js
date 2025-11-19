const fs = require('fs');
const path = require('path');

const files = [
  'src/app/dashboard/os/page.tsx',
  'src/app/dashboard/os/[id]/page.tsx',
  'src/app/dashboard/funcionario/page.tsx',
  'src/app/dashboard/financeiro/page.tsx',
  'src/app/dashboard/financeiro/fluxo-caixa/page.tsx',
  'src/app/dashboard/financeiro/contas-receber/page.tsx',
  'src/app/dashboard/financeiro/contas-pagar/page.tsx',
  'src/app/dashboard/cliente/page.tsx',
];

console.log('🔧 Removendo tags DashboardLayout...\n');

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remover <DashboardLayout title="...">
    content = content.replace(/<DashboardLayout title=\{[^}]+\}>\s*/g, '');
    content = content.replace(/<DashboardLayout title="[^"]*">\s*/g, '');
    content = content.replace(/<DashboardLayout title='[^']*'>\s*/g, '');
    
    // Remover </DashboardLayout>
    content = content.replace(/\s*<\/DashboardLayout>/g, '');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ ${file}`);
  } catch (error) {
    console.log(`❌ ${file}: ${error.message}`);
  }
});

console.log('\n✨ Concluído!');
