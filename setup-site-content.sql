-- Script para criar e popular tabela site_content
-- Execute este script no Supabase SQL Editor

-- Criar tabela se não existir
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section, key)
);

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(key);

-- Popular com dados iniciais (apenas se não existirem)
INSERT INTO site_content (section, key, value, type, description) VALUES
  -- Seção Contact
  ('contact', 'email', 'contato@menezestech.com.br', 'email', 'Email de contato principal'),
  ('contact', 'phone', '(28) 99967-7802', 'phone', 'Telefone de contato'),
  ('contact', 'address', 'São Paulo, SP - Brasil', 'text', 'Endereço da empresa'),
  ('contact', 'whatsapp', '5528999677802', 'phone', 'WhatsApp para contato'),
  
  -- Seção Hero
  ('hero', 'title', 'Soluções em Tecnologia da Informação', 'text', 'Título principal do hero'),
  ('hero', 'subtitle', 'Especialistas em infraestrutura, segurança e LGPD', 'text', 'Subtítulo do hero'),
  ('hero', 'cta_text', 'Fale Conosco', 'text', 'Texto do botão CTA'),
  
  -- Seção About
  ('about', 'title', 'Sobre a MenezesTech', 'text', 'Título da seção sobre'),
  ('about', 'description', 'Mais de 10 anos de experiência em tecnologia da informação', 'html', 'Descrição da empresa'),
  
  -- Seção Services
  ('services', 'title', 'Nossos Serviços', 'text', 'Título da seção de serviços'),
  ('services', 'subtitle', 'Soluções completas em TI para sua empresa', 'text', 'Subtítulo de serviços'),
  
  -- Seção Social
  ('social', 'facebook', 'https://facebook.com/menezestech', 'url', 'Link do Facebook'),
  ('social', 'instagram', 'https://instagram.com/menezestech', 'url', 'Link do Instagram'),
  ('social', 'linkedin', 'https://linkedin.com/company/menezestech', 'url', 'Link do LinkedIn'),
  ('social', 'twitter', 'https://twitter.com/menezestech', 'url', 'Link do Twitter')
ON CONFLICT (section, key) DO NOTHING;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Policy para leitura pública
CREATE POLICY "Permitir leitura pública de site_content"
  ON site_content FOR SELECT
  USING (true);

-- Policy para admin/superadmin editar
CREATE POLICY "Permitir admin editar site_content"
  ON site_content FOR ALL
  USING (
    auth.jwt() ->> 'role' IN ('superadmin', 'admin')
  );

-- Comentários na tabela
COMMENT ON TABLE site_content IS 'Conteúdo editável do site através do CMS';
COMMENT ON COLUMN site_content.section IS 'Seção do site (contact, hero, about, etc)';
COMMENT ON COLUMN site_content.key IS 'Chave única dentro da seção';
COMMENT ON COLUMN site_content.value IS 'Valor do conteúdo';
COMMENT ON COLUMN site_content.type IS 'Tipo do conteúdo (text, email, phone, url, html)';
