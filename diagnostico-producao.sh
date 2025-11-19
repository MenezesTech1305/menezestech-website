#!/bin/bash

# Script de Diagnóstico de Produção
# Execute na VM para identificar problemas

echo "🔍 DIAGNÓSTICO DO SISTEMA EM PRODUÇÃO"
echo "======================================"
echo ""

# 1. Verificar serviço Next.js
echo "1️⃣  Status do Next.js (PM2):"
pm2 status | grep menezestech
echo ""

# 2. Verificar porta 3000
echo "2️⃣  Porta 3000 (Next.js):"
netstat -tulpn | grep 3000 || echo "❌ Porta 3000 não está em uso!"
echo ""

# 3. Verificar Nginx
echo "3️⃣  Status do Nginx:"
sudo systemctl status nginx | grep Active
echo ""

# 4. Verificar configuração do Nginx
echo "4️⃣  Teste de configuração do Nginx:"
sudo nginx -t
echo ""

# 5. Verificar logs recentes do Next.js
echo "5️⃣  Últimos logs do Next.js:"
pm2 logs menezestech --lines 10 --nostream
echo ""

# 6. Verificar logs de erro do Nginx
echo "6️⃣  Últimos erros do Nginx:"
sudo tail -n 10 /var/log/nginx/menezestech-error.log 2>/dev/null || echo "Nenhum erro recente"
echo ""

# 7. Verificar variáveis de ambiente
echo "7️⃣  Variáveis de ambiente (.env.local):"
if [ -f .env.local ]; then
    echo "✅ Arquivo .env.local existe"
    grep -c "NEXT_PUBLIC_SUPABASE_URL" .env.local > /dev/null && echo "✅ SUPABASE_URL configurado" || echo "❌ SUPABASE_URL não encontrado"
    grep -c "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local > /dev/null && echo "✅ SUPABASE_ANON_KEY configurado" || echo "❌ SUPABASE_ANON_KEY não encontrado"
else
    echo "❌ Arquivo .env.local não encontrado!"
fi
echo ""

# 8. Verificar build do Next.js
echo "8️⃣  Build do Next.js:"
if [ -d .next ]; then
    echo "✅ Pasta .next existe"
    ls -lh .next/standalone 2>/dev/null && echo "✅ Build standalone OK" || echo "⚠️  Build standalone não encontrado"
else
    echo "❌ Pasta .next não existe! Execute: npm run build"
fi
echo ""

# 9. Verificar uso de recursos
echo "9️⃣  Uso de recursos:"
echo "CPU e Memória:"
pm2 monit --no-daemon 2>/dev/null | head -n 5 || top -bn1 | grep "Cpu\|Mem" | head -n 2
echo ""

# 10. Verificar conectividade
echo "🔟 Teste de conectividade:"
curl -s -o /dev/null -w "Status HTTP: %{http_code}\n" http://localhost:3000 || echo "❌ Não foi possível conectar ao Next.js"
echo ""

# 11. Verificar espaço em disco
echo "1️⃣1️⃣  Espaço em disco:"
df -h | grep -E "Filesystem|/$"
echo ""

# 12. Resumo
echo "======================================"
echo "📊 RESUMO DO DIAGNÓSTICO"
echo "======================================"

# Verificações críticas
CRITICAL_ISSUES=0

# Next.js rodando?
pm2 status | grep -q "menezestech.*online" || { echo "❌ Next.js NÃO está rodando"; CRITICAL_ISSUES=$((CRITICAL_ISSUES+1)); }

# Porta 3000 aberta?
netstat -tulpn | grep -q 3000 || { echo "❌ Porta 3000 NÃO está aberta"; CRITICAL_ISSUES=$((CRITICAL_ISSUES+1)); }

# Nginx rodando?
sudo systemctl is-active --quiet nginx || { echo "❌ Nginx NÃO está rodando"; CRITICAL_ISSUES=$((CRITICAL_ISSUES+1)); }

# .env.local existe?
[ -f .env.local ] || { echo "❌ .env.local NÃO existe"; CRITICAL_ISSUES=$((CRITICAL_ISSUES+1)); }

# Build existe?
[ -d .next ] || { echo "❌ Build do Next.js NÃO existe"; CRITICAL_ISSUES=$((CRITICAL_ISSUES+1)); }

echo ""
if [ $CRITICAL_ISSUES -eq 0 ]; then
    echo "✅ Nenhum problema crítico encontrado!"
    echo "Se ainda houver problemas, verifique os logs acima."
else
    echo "⚠️  $CRITICAL_ISSUES problema(s) crítico(s) encontrado(s)!"
    echo "Execute as correções necessárias."
fi
echo ""

# Comandos úteis
echo "======================================"
echo "🛠️  COMANDOS ÚTEIS"
echo "======================================"
echo "Ver logs em tempo real:"
echo "  pm2 logs menezestech"
echo ""
echo "Reiniciar Next.js:"
echo "  pm2 restart menezestech"
echo ""
echo "Rebuild completo:"
echo "  ./rebuild-production.sh"
echo ""
echo "Testar rota:"
echo "  curl http://localhost:3000/dashboard"
echo ""
