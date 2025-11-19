#!/bin/bash

echo "🔄 FORÇANDO ATUALIZAÇÃO COMPLETA NA VM"
echo "======================================"
echo ""

# Para o PM2
echo "1️⃣ Parando PM2..."
pm2 delete menezestech-site 2>/dev/null || true

# Limpa qualquer mudança local
echo "2️⃣ Limpando mudanças locais..."
git reset --hard HEAD
git clean -fd

# Puxa do GitHub
echo "3️⃣ Puxando do GitHub..."
git fetch origin
git reset --hard origin/main

# Verifica se o arquivo foi atualizado
echo "4️⃣ Verificando arquivo dashboard-layout.tsx..."
if grep -q "Editor de Conteúdo" src/components/layout/dashboard-layout.tsx; then
    echo "✅ Arquivo atualizado corretamente!"
else
    echo "❌ Arquivo NÃO foi atualizado!"
    exit 1
fi

# Limpa cache do Next.js
echo "5️⃣ Limpando cache..."
rm -rf .next/cache

# Inicia PM2
echo "6️⃣ Iniciando PM2..."
pm2 start npm --name "menezestech-site" -- start
pm2 save

echo ""
echo "======================================"
echo "✅ ATUALIZAÇÃO CONCLUÍDA!"
echo ""
echo "Aguarde 10 segundos e recarregue o navegador com Ctrl+Shift+R"
