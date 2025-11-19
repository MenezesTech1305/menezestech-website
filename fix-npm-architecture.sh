#!/bin/bash

echo "🔧 CORRIGINDO ARQUITETURA - REMOVENDO NGINX LOCAL"
echo "=================================================="
echo ""
echo "⚠️  Sua arquitetura usa Nginx Proxy Manager (NPM) na VM .33"
echo "⚠️  O Nginx local na VM .36 está causando conflito!"
echo ""

# Para e remove o nginx local
echo "1️⃣ Removendo Nginx local..."
systemctl stop nginx
systemctl disable nginx
apt remove -y nginx nginx-common
apt autoremove -y

echo ""
echo "2️⃣ Verificando PM2..."
pm2 status

echo ""
echo "3️⃣ Garantindo que o Next.js está na porta 3001..."

# Verifica se está rodando na porta correta
if pm2 list | grep -q "menezestech-site"; then
    echo "✅ PM2 está rodando"
    
    # Verifica a porta
    if netstat -tlnp 2>/dev/null | grep -q ":3001" || ss -tlnp 2>/dev/null | grep -q ":3001"; then
        echo "✅ Porta 3001 está aberta"
    else
        echo "⚠️  Porta 3001 não está aberta. Reiniciando PM2..."
        pm2 restart menezestech-site
        sleep 3
    fi
else
    echo "⚠️  PM2 não está rodando. Iniciando..."
    cd /opt/menezestech-website
    pm2 start npm --name "menezestech-site" -- start
    pm2 save
    sleep 3
fi

echo ""
echo "4️⃣ Testando conexão na porta 3001..."
curl -I http://localhost:3001 2>&1 | head -5

echo ""
echo "5️⃣ Verificando portas abertas..."
ss -tlnp | grep -E ":(3001|80|443)" || netstat -tlnp | grep -E ":(3001|80|443)"

echo ""
echo "=================================================="
echo "✅ CORREÇÃO CONCLUÍDA!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Acesse o Nginx Proxy Manager (NPM) em: http://10.25.25.33:81"
echo ""
echo "2. Verifique/Crie o Proxy Host com estas configurações:"
echo "   - Domain Names: menezestech.com.br, www.menezestech.com.br"
echo "   - Scheme: http"
echo "   - Forward Hostname/IP: 10.25.25.36"
echo "   - Forward Port: 3001"
echo "   - Cache Assets: ✓"
echo "   - Block Common Exploits: ✓"
echo "   - Websockets Support: ✓"
echo ""
echo "3. Na aba SSL:"
echo "   - SSL Certificate: Request a new SSL Certificate"
echo "   - Force SSL: ✓"
echo "   - HTTP/2 Support: ✓"
echo ""
echo "4. Teste: http://menezestech.com.br"
echo ""
