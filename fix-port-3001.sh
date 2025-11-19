#!/bin/bash

echo "🔍 DIAGNÓSTICO: Por que a porta 3001 não está aberta?"
echo "====================================================="
echo ""

echo "1️⃣ Verificando logs do PM2..."
pm2 logs menezestech-site --lines 50 --nostream

echo ""
echo "2️⃣ Verificando package.json..."
cat package.json | grep -A 5 '"scripts"'

echo ""
echo "3️⃣ Verificando se o build existe..."
if [ -d ".next" ]; then
    echo "✅ Build existe"
    ls -lh .next/ | head -10
else
    echo "❌ Build NÃO existe!"
fi

echo ""
echo "4️⃣ Verificando variáveis de ambiente..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local existe"
    echo "Conteúdo (sem valores sensíveis):"
    grep -v "KEY\|SECRET\|PASSWORD" .env.local | head -5
else
    echo "❌ .env.local NÃO existe!"
fi

echo ""
echo "====================================================="
echo "🔧 APLICANDO CORREÇÃO..."
echo ""

# Para o PM2
echo "5️⃣ Parando PM2..."
pm2 delete menezestech-site 2>/dev/null || true
sleep 2

# Verifica se precisa fazer build
if [ ! -d ".next" ] || [ ! -f ".next/BUILD_ID" ]; then
    echo "6️⃣ Fazendo build..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build falhou! Verifique os erros acima."
        exit 1
    fi
else
    echo "6️⃣ Build já existe, pulando..."
fi

# Configura a porta no package.json se necessário
echo "7️⃣ Garantindo porta 3001 no start script..."
if ! grep -q "next start -p 3001" package.json; then
    echo "⚠️  Atualizando package.json para usar porta 3001..."
    sed -i 's/"start": "next start"/"start": "next start -p 3001"/' package.json
fi

# Inicia o PM2 com configuração explícita
echo "8️⃣ Iniciando PM2 com porta 3001..."
PORT=3001 pm2 start npm --name "menezestech-site" -- start
pm2 save

echo ""
echo "9️⃣ Aguardando 5 segundos..."
sleep 5

echo ""
echo "🔟 Verificando status..."
pm2 status

echo ""
echo "1️⃣1️⃣ Verificando porta 3001..."
ss -tlnp 2>/dev/null | grep 3001 || echo "⚠️  Porta 3001 ainda não está aberta"

echo ""
echo "1️⃣2️⃣ Testando conexão..."
curl -I http://localhost:3001 2>&1 | head -10

echo ""
echo "1️⃣3️⃣ Últimos logs do PM2..."
pm2 logs menezestech-site --lines 20 --nostream

echo ""
echo "====================================================="
echo "📋 RESULTADO:"
echo ""

if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ SUCESSO! Porta 3001 está respondendo!"
    echo ""
    echo "Agora configure o NPM:"
    echo "1. Acesse: http://10.25.25.33:81"
    echo "2. Forward para: 10.25.25.36:3001"
else
    echo "❌ FALHOU! Veja os logs acima para identificar o erro."
    echo ""
    echo "Comandos úteis:"
    echo "  pm2 logs menezestech-site --lines 100"
    echo "  pm2 restart menezestech-site"
fi
