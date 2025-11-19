#!/bin/bash

# Script de Rebuild Otimizado para Produção
# Execute este script na VM após fazer pull das alterações

echo "🚀 Iniciando rebuild otimizado..."

# 1. Parar o serviço Next.js
echo "⏸️  Parando serviço Next.js..."
pm2 stop menezestech || true

# 2. Limpar cache e builds antigos
echo "🧹 Limpando cache..."
rm -rf .next
rm -rf node_modules/.cache

# 3. Instalar dependências (se necessário)
echo "📦 Verificando dependências..."
npm ci --production=false

# 4. Build otimizado
echo "🔨 Fazendo build otimizado..."
NODE_ENV=production npm run build

# 5. Reiniciar serviço
echo "▶️  Reiniciando serviço..."
pm2 restart menezestech || pm2 start npm --name "menezestech" -- start

# 6. Recarregar nginx
echo "🔄 Recarregando nginx..."
sudo nginx -t && sudo systemctl reload nginx

# 7. Verificar status
echo "✅ Verificando status..."
pm2 status
pm2 logs menezestech --lines 20

echo "✨ Deploy concluído!"
echo "📊 Acesse: http://seu-dominio.com"
