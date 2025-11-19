#!/usr/bin/env python3
"""
Script para remover DashboardLayout duplicado de todas as páginas do dashboard
"""

import re
import os

# Lista de arquivos para corrigir
files_to_fix = [
    'src/app/dashboard/os/page.tsx',
    'src/app/dashboard/os/nova/page.tsx',
    'src/app/dashboard/os/[id]/page.tsx',
    'src/app/dashboard/funcionario/page.tsx',
    'src/app/dashboard/financeiro/page.tsx',
    'src/app/dashboard/financeiro/fluxo-caixa/page.tsx',
    'src/app/dashboard/financeiro/contas-receber/page.tsx',
    'src/app/dashboard/financeiro/contas-pagar/page.tsx',
    'src/app/dashboard/cliente/page.tsx',
]

def remove_dashboard_layout(filepath):
    """Remove DashboardLayout import e tags de um arquivo"""
    
    if not os.path.exists(filepath):
        print(f"❌ Arquivo não encontrado: {filepath}")
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Remover import do DashboardLayout
    content = re.sub(
        r'import\s+{\s*DashboardLayout\s*}\s+from\s+["\']@/components/layout/dashboard-layout["\']\s*\n',
        '',
        content
    )
    
    # Remover <DashboardLayout title="...">
    content = re.sub(
        r'<DashboardLayout\s+title=["\'][^"\']*["\']>\s*\n',
        '',
        content
    )
    
    # Remover </DashboardLayout>
    content = re.sub(
        r'\s*</DashboardLayout>\s*\n',
        '\n',
        content
    )
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Corrigido: {filepath}")
        return True
    else:
        print(f"⏭️  Sem alterações: {filepath}")
        return False

def main():
    print("🔧 Removendo DashboardLayout duplicado...\n")
    
    fixed_count = 0
    for filepath in files_to_fix:
        if remove_dashboard_layout(filepath):
            fixed_count += 1
    
    print(f"\n✨ Concluído! {fixed_count} arquivo(s) corrigido(s)")

if __name__ == '__main__':
    main()
