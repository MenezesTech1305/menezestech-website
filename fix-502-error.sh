#!/bin/bash

echo "🔧 CORRIGINDO ERRO 502 BAD GATEWAY"
echo "==================================="
echo ""

# Para tudo
echo "1️⃣ Parando processos..."
pm2 delete all 2>/dev/null || true
pkill -f "next" 2>/dev/null || true
sleep 2

# Verifica se tem build
if [ ! -d ".next" ]; then
  echo "2️⃣ Build não existe. Criando..."
  npm run build
  
  if [ $? -ne 0 ]; then
    echo "❌ Build falhou!"
    exit 1
  fi
else
  echo "2️⃣ Build já existe"
fi

# Verifica .env.local
if [ ! -f ".env.local" ]; then
  echo "⚠️  .env.local não encontrado!"
  echo "Criando .env.local básico..."
  cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
fi

# Inicia o servidor
echo "3️⃣ Iniciando servidor Next.js..."
pm2 start npm --name "menezestech-site" -- start
pm2 save

echo ""
echo "4️⃣ Aguardando 5 segundos..."
sleep 5

echo ""
echo "5️⃣ Verificando status..."
pm2 status

echo ""
echo "6️⃣ Testando conexão..."
curl -I http://localhost:3000 2>&1 | head -5

echo ""
echo "7️⃣ Logs recentes:"
pm2 logs menezestech-site --lines 20 --nostream

echo ""
echo "==================================="
echo "✅ Processo concluído!"
echo ""
echo "🌐 Teste no navegador: http://menezestech.com.br"
echo ""
echo "📊 Para ver logs em tempo real:"
echo "   pm2 logs menezestech-site"
