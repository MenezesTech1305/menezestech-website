# ⚡ COMANDOS RÁPIDOS - COLA DE COMANDOS

## 🚀 DEPLOY COMPLETO (Copie e Cole)

\`\`\`bash
# 1. Conectar na VM e ir para o projeto
cd /caminho/do/projeto

# 2. Fazer pull das correções
git pull origin main

# 3. Executar rebuild
chmod +x rebuild-production.sh diagnostico-producao.sh
./rebuild-production.sh

# 4. Atualizar nginx
sudo cp nginx-production.conf /etc/nginx/sites-available/menezestech
sudo nginx -t && sudo systemctl reload nginx

# 5. Verificar status
pm2 status
pm2 logs menezestech --lines 20
\`\`\`

## 🔍 DIAGNÓSTICO RÁPIDO

\`\`\`bash
# Executar diagnóstico completo
./diagnostico-producao.sh

# Ver status do PM2
pm2 status

# Ver logs em tempo real
pm2 logs menezestech

# Testar rota localmente
curl http://localhost:3000/dashboard/admin/cms

# Ver últimos erros do nginx
sudo tail -f /var/log/nginx/menezestech-error.log
\`\`\`

## 🔧 CORREÇÕES RÁPIDAS

### Next.js não está rodando
\`\`\`bash
pm2 restart menezestech
# ou
pm2 start npm --name "menezestech" -- start
\`\`\`

### Build com erro
\`\`\`bash
rm -rf .next node_modules/.cache
npm ci
NODE_ENV=production npm run build
pm2 restart menezestech
\`\`\`

### Nginx com erro
\`\`\`bash
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### Sistema lento
\`\`\`bash
pm2 delete menezestech
pm2 start npm --name "menezestech" --max-memory-restart 1G -- start
pm2 save
\`\`\`

### Limpar tudo e recomeçar
\`\`\`bash
pm2 stop menezestech
rm -rf .next node_modules
npm install
NODE_ENV=production npm run build
pm2 restart menezestech
sudo systemctl restart nginx
\`\`\`

## 📊 MONITORAMENTO

\`\`\`bash
# Ver uso de recursos
pm2 monit

# Ver logs específicos
pm2 logs menezestech --lines 100

# Ver apenas erros
pm2 logs menezestech --err

# Limpar logs
pm2 flush

# Ver informações do processo
pm2 info menezestech
\`\`\`

## 🧪 TESTES

\`\`\`bash
# Testar home
curl http://localhost:3000/

# Testar dashboard
curl http://localhost:3000/dashboard

# Testar CMS
curl http://localhost:3000/dashboard/admin/cms

# Testar configurações
curl http://localhost:3000/dashboard/configuracoes

# Testar com headers
curl -I http://localhost:3000/

# Testar tempo de resposta
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/
\`\`\`

## 🔐 VARIÁVEIS DE AMBIENTE

\`\`\`bash
# Ver .env.local
cat .env.local

# Editar .env.local
nano .env.local

# Verificar se variáveis estão corretas
grep SUPABASE .env.local
\`\`\`

## 📦 NPM/NODE

\`\`\`bash
# Ver versão do Node
node -v

# Ver versão do NPM
npm -v

# Limpar cache do NPM
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
\`\`\`

## 🗄️ BANCO DE DADOS

\`\`\`bash
# Testar conexão com Supabase
node test-connection.js

# Ver tabelas (se tiver psql)
psql -h seu-host -U postgres -d postgres -c "\\dt"
\`\`\`

## 🔄 GIT

\`\`\`bash
# Ver status
git status

# Ver último commit
git log -1

# Forçar pull
git fetch origin
git reset --hard origin/main

# Fazer stash e pull
git stash
git pull origin main
git stash pop
\`\`\`

## 🌐 NGINX

\`\`\`bash
# Testar configuração
sudo nginx -t

# Recarregar (sem downtime)
sudo systemctl reload nginx

# Reiniciar (com downtime)
sudo systemctl restart nginx

# Ver status
sudo systemctl status nginx

# Ver logs de acesso
sudo tail -f /var/log/nginx/menezestech-access.log

# Ver logs de erro
sudo tail -f /var/log/nginx/menezestech-error.log

# Ver configuração ativa
sudo nginx -T | grep menezestech
\`\`\`

## 💾 SISTEMA

\`\`\`bash
# Ver uso de disco
df -h

# Ver uso de memória
free -h

# Ver processos
top

# Ver portas abertas
netstat -tulpn | grep LISTEN

# Ver porta 3000 especificamente
netstat -tulpn | grep 3000

# Ver uso de CPU/RAM por processo
ps aux | grep node
\`\`\`

## 🔥 EMERGÊNCIA (Sistema Travado)

\`\`\`bash
# Matar todos os processos Node
pkill -9 node

# Reiniciar PM2
pm2 kill
pm2 start npm --name "menezestech" -- start

# Reiniciar Nginx
sudo systemctl restart nginx

# Reiniciar servidor (último recurso)
sudo reboot
\`\`\`

## ✅ VERIFICAÇÃO PÓS-DEPLOY

\`\`\`bash
# Checklist rápido
pm2 status | grep menezestech
netstat -tulpn | grep 3000
sudo systemctl status nginx | grep Active
curl -I http://localhost:3000/
pm2 logs menezestech --lines 10 --nostream
\`\`\`

## 📝 ALIASES ÚTEIS (Opcional)

Adicione ao `~/.bashrc`:

\`\`\`bash
# Aliases para MenezesTech
alias mt-status='pm2 status && sudo systemctl status nginx'
alias mt-logs='pm2 logs menezestech'
alias mt-restart='pm2 restart menezestech && sudo systemctl reload nginx'
alias mt-rebuild='cd /caminho/do/projeto && ./rebuild-production.sh'
alias mt-diag='cd /caminho/do/projeto && ./diagnostico-producao.sh'
\`\`\`

Depois execute: `source ~/.bashrc`

## 🎯 COMANDOS MAIS USADOS

\`\`\`bash
# Top 5 comandos que você vai usar:
pm2 logs menezestech              # Ver logs
pm2 restart menezestech           # Reiniciar
./diagnostico-producao.sh         # Diagnosticar
sudo systemctl reload nginx       # Recarregar nginx
curl http://localhost:3000/       # Testar
\`\`\`

## 📞 QUANDO PEDIR AJUDA

Envie estes outputs:

\`\`\`bash
# Coletar informações para suporte
echo "=== DIAGNÓSTICO ===" > debug.txt
./diagnostico-producao.sh >> debug.txt
echo "=== PM2 LOGS ===" >> debug.txt
pm2 logs menezestech --lines 50 --nostream >> debug.txt
echo "=== NGINX ERRORS ===" >> debug.txt
sudo tail -n 50 /var/log/nginx/menezestech-error.log >> debug.txt
echo "=== SYSTEM INFO ===" >> debug.txt
df -h >> debug.txt
free -h >> debug.txt
cat debug.txt
\`\`\`
