#!/bin/bash

echo "🔧 Corrigindo build na VM..."

# 1. Limpar cache do Next.js
echo "1️⃣ Limpando cache do Next.js..."
rm -rf .next
rm -rf node_modules/.cache

# 2. Limpar cache do TypeScript
echo "2️⃣ Limpando cache do TypeScript..."
rm -rf .tsbuildinfo
find . -name "*.tsbuildinfo" -delete

# 3. Reinstalar dependências (força reinstalação)
echo "3️⃣ Reinstalando dependências..."
rm -rf node_modules package-lock.json
npm install

# 4. Build
echo "4️⃣ Fazendo build..."
NODE_ENV=production npm run build

# 5. Verificar resultado
if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    echo ""
    echo "Próximo passo:"
    echo "  pm2 restart menezestech"
else
    echo "❌ Build falhou!"
    echo ""
    echo "Verifique os erros acima."
    exit 1
fi
