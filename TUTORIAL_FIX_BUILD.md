# Tutorial: Corrigir Build na Produção

## 🎯 Problema
O build está falhando com erro de tipo no componente Input do blog.

## ✅ Solução Completa

Execute os comandos abaixo na VM de produção:

```bash
# 1. Vai para a pasta do projeto
cd /opt/menezestech-website

# 2. Puxa as últimas alterações do GitHub
git pull origin main

# 3. Dá permissão de execução ao script
chmod +x fix-build-final.sh

# 4. Executa o script de correção
./fix-build-final.sh
```

## 📋 O que o script faz:

1. **Para o PM2** - Remove o processo antigo
2. **Limpa cache** - Remove `.next` e cache do node_modules
3. **Reinstala dependências** - Garante que tudo está atualizado
4. **Build limpo** - Compila o projeto do zero
5. **Inicia PM2** - Sobe o site novamente
6. **Salva configuração** - Persiste o PM2 para reiniciar automaticamente

## 🔍 Verificar se funcionou:

```bash
# Ver status do PM2
pm2 status

# Ver logs em tempo real
pm2 logs menezestech-site

# Testar o site
curl http://localhost:3000
```

## 🚨 Se ainda der erro:

Execute este comando para ver o erro completo:

```bash
cd /opt/menezestech-website
npm run build
```

E me envie a saída completa do erro.
