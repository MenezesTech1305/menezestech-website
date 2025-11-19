#!/bin/bash

echo "🔍 Mostrando o problema atual (linhas 104-112):"
sed -n '104,112p' src/app/dashboard/admin/blog/novo/page.tsx

echo ""
echo "🔧 Aplicando correção FORÇADA..."

# Backup
cp src/app/dashboard/admin/blog/novo/page.tsx src/app/dashboard/admin/blog/novo/page.tsx.bak

# Substitui o bloco problemático usando perl (mais poderoso que sed)
perl -i -pe 's/<Input>\s+id="title"\s+value=\{formData\.title\}\s+onChange=\{.*?\}\s+placeholder="Digite o título do post"\s+required\s+\/>/<Input id="title" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Digite o título do post" required \/>/gs' src/app/dashboard/admin/blog/novo/page.tsx

echo ""
echo "✅ Verificando após correção (linhas 104-112):"
sed -n '104,112p' src/app/dashboard/admin/blog/novo/page.tsx

echo ""
echo "🔨 Limpando cache e fazendo build..."
rm -rf .next
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build OK! Reiniciando..."
  pm2 restart menezestech-site
  pm2 save
else
  echo "❌ Build falhou! Restaurando backup..."
  cp src/app/dashboard/admin/blog/novo/page.tsx.bak src/app/dashboard/admin/blog/novo/page.tsx
fi
