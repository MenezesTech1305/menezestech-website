#!/bin/bash

echo "🔍 Verificando o arquivo atual..."
echo "Linha 105-110 do arquivo:"
sed -n '105,110p' src/app/dashboard/admin/blog/novo/page.tsx

echo ""
echo "🔧 Aplicando correção com sed..."

# Usa sed para corrigir a sintaxe do Input
sed -i '105,110s/<Input>/<Input/' src/app/dashboard/admin/blog/novo/page.tsx
sed -i '106s/^[[:space:]]*id="title"/                id="title"/' src/app/dashboard/admin/blog/novo/page.tsx

echo ""
echo "✅ Verificando após correção:"
sed -n '105,110p' src/app/dashboard/admin/blog/novo/page.tsx

echo ""
echo "🔨 Tentando build..."
rm -rf .next
npm run build
