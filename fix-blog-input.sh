#!/bin/bash

echo "🔧 Corrigindo arquivo blog/novo/page.tsx..."

# Faz backup
cp src/app/dashboard/admin/blog/novo/page.tsx src/app/dashboard/admin/blog/novo/page.tsx.bak

# Aplica correção usando sed
sed -i '105,111s/<Input>/<Input/' src/app/dashboard/admin/blog/novo/page.tsx
sed -i '106,111s/^[[:space:]]*id="title"/                id="title"/' src/app/dashboard/admin/blog/novo/page.tsx
sed -i '107,111s/^[[:space:]]*value=/                value=/' src/app/dashboard/admin/blog/novo/page.tsx
sed -i '108,111s/^[[:space:]]*onChange=/                onChange=/' src/app/dashboard/admin/blog/novo/page.tsx
sed -i '109,111s/^[[:space:]]*placeholder=/                placeholder=/' src/app/dashboard/admin/blog/novo/page.tsx
sed -i '110,111s/^[[:space:]]*required/                required/' src/app/dashboard/admin/blog/novo/page.tsx

echo "✅ Arquivo corrigido!"
echo "🔨 Fazendo build..."

npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build OK!"
    pm2 restart menezestech-site
else
    echo "❌ Build falhou! Restaurando backup..."
    cp src/app/dashboard/admin/blog/novo/page.tsx.bak src/app/dashboard/admin/blog/novo/page.tsx
fi
