# 🚀 GUIA RÁPIDO DE CORREÇÃO - PRODUÇÃO

## ⚡ CORREÇÃO RÁPIDA (5 minutos)

### 1. Conectar na VM
\`\`\`bash
ssh usuario@seu-servidor
cd /caminho/do/projeto
\`\`\`

### 2. Fazer Pull das Correções
\`\`\`bash
git pull origin main
\`\`\`

### 3. Executar Diagnóstico
\`\`\`bash
chmod +x diagnostico-producao.sh
./diagnostico-producao.sh
\`\`\`

### 4. Executar Rebuild
\`\`\`bash
chmod +x rebuild-production.sh
./rebuild-production.sh
\`\`\`

### 5. Atualizar Nginx
\`\`\`bash
sudo cp nginx-production.conf /etc/nginx/sites-available/menezestech
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

### 6. Testar
\`\`\`bash
# Testar localmente
curl http://localhost:3000/

# Testar via navegador
# Abra: http://seu-dominio.com
\`\`\`

## 🔥 SE DER ERRO NO PASSO 2 (Git Pull)

### Opção A: Forçar Pull
\`\`\`bash
git fetch origin
git reset --hard origin/main
\`\`\`

### Opção B: Fazer Stash
\`\`\`bash
git stash
git pull origin main
\`\`\`

## 🔥 SE DER ERRO NO PASSO 4 (Build)

### Limpar tudo e rebuildar
\`\`\`bash
# Parar serviço
pm2 stop menezestech

# Limpar
rm -rf .next node_modules/.cache

# Reinstalar
npm ci

# Build
NODE_ENV=production npm run build

# Iniciar
pm2 restart menezestech
\`\`\`

## 🔥 SE AINDA DER 404

### Verificar se Next.js está rodando
\`\`\`bash
pm2 status
pm2 logs menezestech --lines 50
\`\`\`

### Verificar porta 3000
\`\`\`bash
netstat -tulpn | grep 3000
\`\`\`

### Testar diretamente
\`\`\`bash
curl http://localhost:3000/dashboard/admin/cms
\`\`\`

Se funcionar localmente mas não pelo domínio, o problema é no Nginx.

## 🔥 SE NGINX DER ERRO

### Verificar configuração
\`\`\`bash
sudo nginx -t
\`\`\`

### Ver logs de erro
\`\`\`bash
sudo tail -f /var/log/nginx/menezestech-error.log
\`\`\`

### Reiniciar Nginx
\`\`\`bash
sudo systemctl restart nginx
\`\`\`

## 🔥 SE FICAR LENTO

### Verificar recursos
\`\`\`bash
pm2 monit
\`\`\`

### Aumentar memória do PM2
\`\`\`bash
pm2 delete menezestech
pm2 start npm --name "menezestech" --max-memory-restart 1G -- start
pm2 save
\`\`\`

## 🔥 SE DER ERRO DE AUTENTICAÇÃO

### Verificar .env.local
\`\`\`bash
cat .env.local
\`\`\`

Deve ter:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
\`\`\`

### Testar conexão com Supabase
\`\`\`bash
node test-connection.js
\`\`\`

## 📊 CHECKLIST FINAL

Após aplicar as correções, verificar:

- [ ] `pm2 status` mostra "online"
- [ ] `curl http://localhost:3000` retorna HTML
- [ ] Navegador abre a home sem erro
- [ ] Login funciona
- [ ] Dashboard abre
- [ ] CMS abre (sem 404)
- [ ] Configurações abre (sem ficar rodando)
- [ ] Botão voltar funciona
- [ ] F5 (reload) funciona
- [ ] Navegação pela sidebar funciona
- [ ] Console do navegador sem erros críticos

## 🆘 ÚLTIMO RECURSO

Se nada funcionar:

\`\`\`bash
# Backup do .env.local
cp .env.local .env.local.backup

# Limpar TUDO
pm2 delete menezestech
rm -rf .next node_modules

# Reinstalar do zero
npm install
NODE_ENV=production npm run build

# Iniciar
pm2 start npm --name "menezestech" -- start
pm2 save

# Recarregar Nginx
sudo systemctl restart nginx
\`\`\`

## 📞 SUPORTE

Se ainda houver problemas, envie:

1. Output do `./diagnostico-producao.sh`
2. Últimos 50 linhas de `pm2 logs menezestech`
3. Screenshot do erro no navegador (F12 > Console)
4. URL que está dando problema

## ⏱️ TEMPO ESTIMADO

- Correção normal: 5-10 minutos
- Com problemas: 15-30 minutos
- Último recurso: 30-45 minutos
