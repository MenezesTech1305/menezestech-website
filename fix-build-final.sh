#!/bin/bash

echo "🧹 Limpando cache e reconstruindo..."

# Para o PM2
pm2 delete menezestech-site 2>/dev/null || true

# Remove cache do Next.js
rm -rf .next
rm -rf node_modules/.cache

# Reinstala dependências
npm install

# Build limpo
npm run build

# Inicia o PM2
pm2 start npm --name "menezestech-site" -- start
pm2 save

echo "✅ Build finalizado!"
