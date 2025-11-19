#!/bin/bash

# Script para remover tags DashboardLayout de todas as páginas

echo "🔧 Removendo tags DashboardLayout duplicadas..."

# Lista de arquivos
files=(
  "src/app/dashboard/os/page.tsx"
  "src/app/dashboard/os/nova/page.tsx"
  "src/app/dashboard/os/[id]/page.tsx"
  "src/app/dashboard/funcionario/page.tsx"
  "src/app/dashboard/financeiro/page.tsx"
  "src/app/dashboard/financeiro/fluxo-caixa/page.tsx"
  "src/app/dashboard/financeiro/contas-receber/page.tsx"
  "src/app/dashboard/financeiro/contas-pagar/page.tsx"
  "src/app/dashboard/cliente/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processando: $file"
    
    # Remover <DashboardLayout title="...">
    sed -i 's/<DashboardLayout title="[^"]*">//g' "$file"
    
    # Remover </DashboardLayout>
    sed -i 's/<\/DashboardLayout>//g' "$file"
    
    echo "✅ $file corrigido"
  else
    echo "❌ $file não encontrado"
  fi
done

echo ""
echo "✨ Concluído!"
