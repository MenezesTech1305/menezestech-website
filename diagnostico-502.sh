#!/bin/bash

echo "🔍 DIAGNÓSTICO DO ERRO 502"
echo "=========================="
echo ""

echo "1️⃣ Status do PM2:"
pm2 status
echo ""

echo "2️⃣ Logs do PM2 (últimas 30 linhas):"
pm2 logs menezestech-site --lines 30 --nostream
echo ""

echo "3️⃣ Verificando se o build existe:"
if [ -d ".next" ]; then
  echo "✅ Pasta .next existe"
  ls -lh .next/
else
  echo "❌ Pasta .next NÃO existe - precisa fazer build!"
fi
echo ""

echo "4️⃣ Verificando porta 3000:"
netstat -tlnp | grep 3000 || echo "❌ Nada rodando na porta 3000"
echo ""

echo "5️⃣ Verificando variáveis de ambiente:"
if [ -f ".env.local" ]; then
  echo "✅ .env.local existe"
else
  echo "❌ .env.local NÃO existe"
fi
echo ""

echo "6️⃣ Testando conexão local:"
curl -I http://localhost:3000 2>&1 | head -5
echo ""

echo "=========================="
echo "📋 RECOMENDAÇÕES:"
echo ""

if [ ! -d ".next" ]; then
  echo "⚠️  Falta fazer o build! Execute:"
  echo "   npm run build"
fi

echo ""
echo "🔧 Para corrigir, execute:"
echo "   ./fix-502-error.sh"
