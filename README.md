# 🚀 MenezesTech - Sistema Corporativo

Sistema web moderno e escalável para a MenezesTech, empresa especializada em soluções de tecnologia da informação com mais de 10 anos de experiência no mercado corporativo.

## 📋 Sobre o Projeto

Este é um sistema híbrido que combina:
- **Site Corporativo Público**: Vitrine da empresa com informações, serviços e contato
- **Portal do Cliente**: Área para clientes acompanharem seus projetos e ordens de serviço  
- **Sistema Interno**: Gestão completa para a equipe da MenezesTech

## 🏢 Sobre a MenezesTech

A MenezesTech conta com uma experiência consolidada de colaboradores com mais de 10 anos de atuação no mercado corporativo, atendendo empresas de pequeno, médio e grande porte, incluindo cartórios extrajudiciais.

### Diferenciais:
- ✅ **Atendimento Personalizado**: Carteira limitada de clientes por colaborador
- ✅ **Relacionamento Duradouro**: Foco em parcerias de longo prazo
- ✅ **Parcerias Estratégicas**: Relacionamento privilegiado com distribuidores e fabricantes
- ✅ **Suporte Técnico Direto**: Canais diretos com fabricantes
- ✅ **Mínima Burocracia**: Soluções rápidas e simples

### Serviços Oferecidos:
- 🖥️ **Consultoria em Infraestrutura de TI**
- 🔧 **Implantação e Configuração de Servidores**
- 🌐 **Gerenciamento de Redes**
- 💾 **Backup e Recuperação de Dados**
- 🔒 **Segurança da Informação**
- 📋 **Implementação da LGPD**

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Framework CSS utilitário
- **Framer Motion** - Animações suaves
- **Lucide React** - Ícones modernos

### Componentes UI
- **Magic UI Components** - Componentes avançados e animações
- **Radix UI** - Componentes acessíveis
- **Class Variance Authority** - Gerenciamento de variantes

### Desenvolvimento
- **ESLint** - Linting de código
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório (ou use o código atual)
# cd menezes-tech-system

# Instale as dependências
npm install --legacy-peer-deps

# Execute o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificação de código
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Button, Card, etc.)
│   ├── layout/           # Componentes de layout (Header, Footer)
│   └── sections/         # Seções da página (Hero, About, Services, Contact)
└── lib/                  # Utilitários e helpers
    └── utils.ts          # Funções auxiliares
```

## 🎨 Design System

### Cores Principais
- **Azul Primário**: `#4F46E5` (Indigo 600)
- **Azul Secundário**: `#06B6D4` (Cyan 500)  
- **Verde**: `#10B981` (Emerald 500)
- **Amarelo**: `#F59E0B` (Amber 500)
- **Vermelho**: `#EF4444` (Red 500)

### Tipografia
- **Fonte Principal**: Inter (Google Fonts)
- **Pesos**: 400, 500, 600, 700, 800, 900

### Componentes Customizados
- `.menezes-gradient` - Gradiente da marca
- `.menezes-text-gradient` - Texto com gradiente
- `.tech-pattern` - Padrão tecnológico de fundo
- `.hover-lift` - Efeito de elevação no hover

## 📱 Funcionalidades Implementadas

### Site Corporativo
- ✅ Header responsivo com navegação suave
- ✅ Hero section com animações e estatísticas
- ✅ Seção sobre a empresa baseada nas informações reais
- ✅ Seção de serviços com cards interativos
- ✅ Formulário de contato funcional
- ✅ Footer completo com informações da empresa
- ✅ Design totalmente responsivo
- ✅ Animações suaves e modernas
- ✅ SEO otimizado

### Recursos Técnicos
- ✅ Lazy loading de componentes
- ✅ Navegação por âncoras suave
- ✅ Formulários com validação
- ✅ Estados de loading
- ✅ Utilitários para formatação brasileira (CPF, CNPJ, telefone)
- ✅ Sistema de cores e temas consistente

## 🔮 Próximas Funcionalidades Sugeridas

### Portal do Cliente
- 📋 Dashboard personalizado por tipo de cliente
- 📊 Acompanhamento de projetos em tempo real
- 💬 Comunicação direta com técnico responsável
- 📁 Centro de downloads (relatórios, certificados)
- ✅ Área para aprovação de cotações

### Sistema Interno
- 👥 Gestão de usuários (SuperAdmin, Admin, Padrão)
- 📋 Sistema de ordens de serviço completo
- ⏰ Controle de ponto eletrônico com geolocalização
- 👨‍💼 Gestão de carteira por colaborador
- 🤝 Módulo de parceiros e fornecedores
- 📈 Relatórios gerenciais avançados
- 🔧 Dashboard executivo e operacional

### Recursos Avançados
- 🤖 Sistema de cotação inteligente
- 📱 PWA (Progressive Web App)
- 🔔 Notificações push
- 📱 Integração WhatsApp Business
- 🔍 Sistema de auditoria e logs
- 🔐 Módulo LGPD automatizado
- 📊 Analytics e métricas

### Integrações
- 💳 Gateway de pagamento
- 📧 Sistema de e-mail marketing
- 📋 CRM integrado
- 🗃️ Sistema de backup automatizado
- 🔌 API para integrações futuras

## 🚀 Deploy

### Opções de Hosting
1. **Vercel** (Recomendado para Next.js)
2. **Servidor Ubuntu 20.04** (Conforme mencionado pelo cliente)
3. **AWS/Digital Ocean**
4. **Railway/Netlify**

### Configuração para Servidor Ubuntu
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone e configure o projeto
git clone <repository>
cd menezes-tech-system
npm install --legacy-peer-deps
npm run build

# Configurar PM2 para produção
npm install -g pm2
pm2 start npm --name "menezes-tech" -- start
pm2 startup
pm2 save
```

## 🔧 Configurações de Produção

### Variáveis de Ambiente
Criar arquivo `.env.local`:
```
NEXT_PUBLIC_SITE_URL=https://menezestech.com.br
NEXT_PUBLIC_API_URL=https://api.menezestech.com.br
```

### Otimizações
- ✅ Lazy loading de imagens
- ✅ Compressão de assets
- ✅ Cache otimizado
- ✅ Bundle splitting automático

## 📞 Contato

**MenezesTech - Soluções em Tecnologia da Informação**
- 📧 Email: contato@menezestech.com.br
- 📱 Telefone: (11) 99999-9999
- 📍 Localização: São Paulo, SP - Brasil

---

*Desenvolvido com ❤️ utilizando as melhores práticas de desenvolvimento web moderno.*

