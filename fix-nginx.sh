#!/bin/bash

echo "🔧 CORRIGINDO CONFIGURAÇÃO DO NGINX"
echo "===================================="
echo ""

# Verifica se nginx está instalado
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx não está instalado!"
    echo "Instalando nginx..."
    apt update
    apt install -y nginx
fi

# Verifica status do nginx
echo "1️⃣ Status do Nginx:"
systemctl status nginx --no-pager | head -10
echo ""

# Cria configuração do nginx
echo "2️⃣ Criando configuração do Nginx..."
cat > /etc/nginx/sites-available/menezestech << 'EOF'
server {
    listen 80;
    server_name menezestech.com.br www.menezestech.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
EOF

# Remove configuração padrão e ativa a nova
echo "3️⃣ Ativando configuração..."
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/menezestech /etc/nginx/sites-enabled/

# Testa configuração
echo "4️⃣ Testando configuração do Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo ""
    echo "5️⃣ Reiniciando Nginx..."
    systemctl restart nginx
    systemctl enable nginx
    
    echo ""
    echo "✅ Nginx configurado e reiniciado!"
    echo ""
    echo "6️⃣ Status final:"
    systemctl status nginx --no-pager | head -5
    
    echo ""
    echo "7️⃣ Testando conexão externa:"
    curl -I http://localhost 2>&1 | head -5
    
    echo ""
    echo "===================================="
    echo "✅ CONFIGURAÇÃO CONCLUÍDA!"
    echo ""
    echo "🌐 Acesse: http://menezestech.com.br"
else
    echo ""
    echo "❌ Erro na configuração do Nginx!"
    echo "Verifique os logs: journalctl -xe"
fi
