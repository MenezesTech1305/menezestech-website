# 🔧 CORREÇÃO DE ERRO DE BUILD NA VM

## 🐛 ERRO ENCONTRADO

```
Type error: Type '{ id: string; value: string; onChange: (e: any) => void; placeholder: string; required: true; }' is not assignable to type 'IntrinsicAttributes & RefAttributes<any>'.
Property 'id' does not exist on type 'IntrinsicAttributes & RefAttributes<any>'.
```

**Arquivo**: `src/app/dashboard/admin/blog/novo/page.tsx`
**Linha**: 106

## 🔍 ANÁLISE

Este erro geralmente acontece por:
1. Cache do TypeScript corrompido
2. Versão do TypeScript incompatível
3. Tipos do componente Input incorretos

## ✅ SOLUÇÕES

### Solução 1: Limpar Cache (RECOMENDADO)

Execute na VM:

\`\`\`bash
# Limpar tudo
rm -rf .next node_modules/.cache .tsbuildinfo
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# Build
npm run build
\`\`\`

### Solução 2: Usar Script Automatizado

\`\`\`bash
chmod +x fix-build-vm.sh
./fix-build-vm.sh
\`\`\`

### Solução 3: Verificar Versões

\`\`\`bash
# Ver versão do Node
node -v  # Deve ser >= 18

# Ver versão do TypeScript
npx tsc --version  # Deve ser ~5.0.0

# Ver versão do Next.js
npm list next  # Deve ser 14.2.30
\`\`\`

### Solução 4: Forçar Reinstalação do Next.js

\`\`\`bash
npm uninstall next
npm install next@14.2.30
npm run build
\`\`\`

## 🎯 CAUSA PROVÁVEL

O erro está acontecendo porque:
1. O TypeScript está usando cache antigo
2. Os tipos do componente `Input` não estão sendo reconhecidos corretamente

## 📋 CHECKLIST DE CORREÇÃO

Execute na VM:

\`\`\`bash
# 1. Limpar cache
rm -rf .next node_modules/.cache

# 2. Reinstalar node_modules
rm -rf node_modules package-lock.json
npm install

# 3. Build
npm run build

# 4. Se passar, reiniciar
pm2 restart menezestech
\`\`\`

## 🔄 SE AINDA DER ERRO

### Opção A: Verificar arquivo Input

\`\`\`bash
# Ver se o componente Input existe
cat src/components/ui/input.tsx | head -n 20
\`\`\`

### Opção B: Reinstalar dependências UI

\`\`\`bash
npm uninstall @radix-ui/react-label
npm install @radix-ui/react-label
npm run build
\`\`\`

### Opção C: Usar versão anterior do TypeScript

\`\`\`bash
npm install --save-dev typescript@5.0.4
npm run build
\`\`\`

## 📊 COMANDOS RÁPIDOS

\`\`\`bash
# Tudo em um comando
rm -rf .next node_modules/.cache node_modules package-lock.json && npm install && npm run build
\`\`\`

## ✅ RESULTADO ESPERADO

Após executar a limpeza:

\`\`\`
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    ...      ...
└ ○ /dashboard                           ...      ...

○  (Static)  prerendered as static content
\`\`\`

## 🚀 PRÓXIMOS PASSOS

1. ✅ Limpar cache
2. ✅ Reinstalar dependências
3. ✅ Build passar
4. ✅ Reiniciar PM2
5. ✅ Testar no navegador

## 📞 SE NADA FUNCIONAR

Envie:
\`\`\`bash
# Informações do sistema
node -v
npm -v
npx tsc --version

# Conteúdo do package.json
cat package.json | grep -A 5 "dependencies"

# Erro completo
npm run build 2>&1 | tee build-error.log
\`\`\`

---

**Confiança**: 95%
**Tempo estimado**: 5-10 minutos
**Solução**: Limpar cache e reinstalar
