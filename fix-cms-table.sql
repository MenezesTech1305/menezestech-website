-- =====================================================
-- FIX: Tabela site_content e políticas RLS
-- =====================================================

-- 1. Remove a tabela se existir (para começar do zero)
DROP TABLE IF EXISTS site_content CASCADE;

-- 2. Cria a tabela site_content
CREATE TABLE site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- 3. Habilita RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- 4. Remove políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura pública de conteúdo" ON site_content;
DROP POLICY IF EXISTS "Permitir admins editarem conteúdo" ON site_content;
DROP POLICY IF EXISTS "Permitir admins inserirem conteúdo" ON site_content;
DROP POLICY IF EXISTS "Permitir admins deletarem conteúdo" ON site_content;

-- 5. Cria políticas SIMPLES (sem recursão)

-- Qualquer pessoa pode LER o conteúdo
CREATE POLICY "site_content_select_public"
ON site_content FOR SELECT
TO public
USING (true);

-- Apenas usuários autenticados podem INSERIR
CREATE POLICY "site_content_insert_authenticated"
ON site_content FOR INSERT
TO authenticated
WITH CHECK (true);

-- Apenas usuários autenticados podem ATUALIZAR
CREATE POLICY "site_content_update_authenticated"
ON site_content FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Apenas usuários autenticados podem DELETAR
CREATE POLICY "site_content_delete_authenticated"
ON site_content FOR DELETE
TO authenticated
USING (true);

-- 6. Cria índices para performance
CREATE INDEX idx_site_content_section ON site_content(section);
CREATE INDEX idx_site_content_key ON site_content(key);

-- 7. Insere conteúdo inicial
INSERT INTO site_content (section, key, value, type, description) VALUES
-- Hero Section
('hero', 'title', 'Transforme Seu Negócio com Tecnologia', 'text', 'Título principal da página inicial'),
('hero', 'subtitle', 'Soluções completas em desenvolvimento de software, gestão de TI e consultoria tecnológica', 'text', 'Subtítulo da página inicial'),
('hero', 'cta_text', 'Fale Conosco', 'text', 'Texto do botão principal'),
('hero', 'background_image', '/images/hero-bg.jpg', 'image', 'Imagem de fundo do hero'),

-- About Section
('about', 'title', 'Sobre a MenezesTech', 'text', 'Título da seção sobre'),
('about', 'description', 'Somos uma empresa especializada em soluções tecnológicas inovadoras, com foco em desenvolvimento de software personalizado, gestão de infraestrutura de TI e consultoria estratégica.', 'html', 'Descrição da empresa'),
('about', 'mission', 'Transformar negócios através da tecnologia, oferecendo soluções eficientes e inovadoras.', 'text', 'Missão da empresa'),
('about', 'vision', 'Ser referência em soluções tecnológicas no mercado brasileiro.', 'text', 'Visão da empresa'),

-- Services Section
('services', 'title', 'Nossos Serviços', 'text', 'Título da seção de serviços'),
('services', 'subtitle', 'Soluções completas para o seu negócio', 'text', 'Subtítulo da seção de serviços'),

-- Contact Section
('contact', 'title', 'Entre em Contato', 'text', 'Título da seção de contato'),
('contact', 'phone', '(11) 99999-9999', 'phone', 'Telefone de contato'),
('contact', 'email', 'contato@menezestech.com.br', 'email', 'Email de contato'),
('contact', 'address', 'São Paulo, SP - Brasil', 'text', 'Endereço da empresa'),

-- Footer Section
('footer', 'copyright', '© 2024 MenezesTech. Todos os direitos reservados.', 'text', 'Texto de copyright'),
('footer', 'social_facebook', 'https://facebook.com/menezestech', 'url', 'Link do Facebook'),
('footer', 'social_instagram', 'https://instagram.com/menezestech', 'url', 'Link do Instagram'),
('footer', 'social_linkedin', 'https://linkedin.com/company/menezestech', 'url', 'Link do LinkedIn');

-- 8. Verifica o resultado
SELECT 
  section,
  COUNT(*) as total_items
FROM site_content
GROUP BY section
ORDER BY section;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Tabela site_content criada com sucesso!';
  RAISE NOTICE '✅ Políticas RLS configuradas!';
  RAISE NOTICE '✅ Conteúdo inicial inserido!';
END $$;
