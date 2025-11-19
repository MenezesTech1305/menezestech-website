const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const cmsContent = [
  // Hero Section
  {
    section: 'hero',
    key: 'title',
    value: 'Transforme Seu Negócio com Tecnologia',
    type: 'text',
    description: 'Título principal da página inicial'
  },
  {
    section: 'hero',
    key: 'subtitle',
    value: 'Soluções completas em desenvolvimento de software, gestão de TI e consultoria tecnológica',
    type: 'text',
    description: 'Subtítulo da página inicial'
  },
  {
    section: 'hero',
    key: 'cta_text',
    value: 'Fale Conosco',
    type: 'text',
    description: 'Texto do botão principal'
  },
  {
    section: 'hero',
    key: 'background_image',
    value: '/images/hero-bg.jpg',
    type: 'image',
    description: 'Imagem de fundo do hero'
  },

  // About Section
  {
    section: 'about',
    key: 'title',
    value: 'Sobre a MenezesTech',
    type: 'text',
    description: 'Título da seção sobre'
  },
  {
    section: 'about',
    key: 'description',
    value: 'Somos uma empresa especializada em soluções tecnológicas inovadoras, com foco em desenvolvimento de software personalizado, gestão de infraestrutura de TI e consultoria estratégica.',
    type: 'html',
    description: 'Descrição da empresa'
  },
  {
    section: 'about',
    key: 'mission',
    value: 'Transformar negócios através da tecnologia, oferecendo soluções eficientes e inovadoras.',
    type: 'text',
    description: 'Missão da empresa'
  },
  {
    section: 'about',
    key: 'vision',
    value: 'Ser referência em soluções tecnológicas no mercado brasileiro.',
    type: 'text',
    description: 'Visão da empresa'
  },

  // Services Section
  {
    section: 'services',
    key: 'title',
    value: 'Nossos Serviços',
    type: 'text',
    description: 'Título da seção de serviços'
  },
  {
    section: 'services',
    key: 'subtitle',
    value: 'Soluções completas para o seu negócio',
    type: 'text',
    description: 'Subtítulo da seção de serviços'
  },

  // Contact Section
  {
    section: 'contact',
    key: 'title',
    value: 'Entre em Contato',
    type: 'text',
    description: 'Título da seção de contato'
  },
  {
    section: 'contact',
    key: 'phone',
    value: '(11) 99999-9999',
    type: 'phone',
    description: 'Telefone de contato'
  },
  {
    section: 'contact',
    key: 'email',
    value: 'contato@menezestech.com.br',
    type: 'email',
    description: 'Email de contato'
  },
  {
    section: 'contact',
    key: 'address',
    value: 'São Paulo, SP - Brasil',
    type: 'text',
    description: 'Endereço da empresa'
  },

  // Footer Section
  {
    section: 'footer',
    key: 'copyright',
    value: '© 2024 MenezesTech. Todos os direitos reservados.',
    type: 'text',
    description: 'Texto de copyright'
  },
  {
    section: 'footer',
    key: 'social_facebook',
    value: 'https://facebook.com/menezestech',
    type: 'url',
    description: 'Link do Facebook'
  },
  {
    section: 'footer',
    key: 'social_instagram',
    value: 'https://instagram.com/menezestech',
    type: 'url',
    description: 'Link do Instagram'
  },
  {
    section: 'footer',
    key: 'social_linkedin',
    value: 'https://linkedin.com/company/menezestech',
    type: 'url',
    description: 'Link do LinkedIn'
  }
]

async function populateCMS() {
  console.log('🚀 Populando CMS com conteúdo inicial...\n')

  try {
    // Verifica se a tabela existe e tem dados
    const { data: existing, error: checkError } = await supabase
      .from('site_content')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('❌ Erro ao verificar tabela:', checkError.message)
      console.log('\n⚠️  A tabela site_content pode não existir.')
      console.log('Execute o SQL de criação da tabela primeiro!')
      return
    }

    if (existing && existing.length > 0) {
      console.log('⚠️  A tabela já contém dados.')
      console.log('Deseja limpar e repopular? (Ctrl+C para cancelar)\n')
      
      // Aguarda 3 segundos
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Limpa dados existentes
      const { error: deleteError } = await supabase
        .from('site_content')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Deleta tudo

      if (deleteError) {
        console.error('❌ Erro ao limpar dados:', deleteError.message)
        return
      }
      
      console.log('✅ Dados antigos removidos\n')
    }

    // Insere novos dados
    console.log('📝 Inserindo conteúdo...\n')
    
    for (const item of cmsContent) {
      const { error } = await supabase
        .from('site_content')
        .insert([item])

      if (error) {
        console.error(`❌ Erro ao inserir ${item.section}.${item.key}:`, error.message)
      } else {
        console.log(`✅ ${item.section}.${item.key}`)
      }
    }

    console.log('\n🎉 CMS populado com sucesso!')
    console.log(`\n📊 Total de itens inseridos: ${cmsContent.length}`)
    
    // Verifica o resultado
    const { data: final, error: finalError } = await supabase
      .from('site_content')
      .select('section, key')

    if (!finalError && final) {
      console.log('\n📋 Conteúdo no banco:')
      const grouped = final.reduce((acc, item) => {
        acc[item.section] = (acc[item.section] || 0) + 1
        return acc
      }, {})
      
      Object.entries(grouped).forEach(([section, count]) => {
        console.log(`   ${section}: ${count} itens`)
      })
    }

  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

populateCMS()
