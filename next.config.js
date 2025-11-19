/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações para produção
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuração de imagens
  images: {
    domains: ['adyugmeyhmidncqhehiv.supabase.co'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: process.env.NODE_ENV === 'production', // Evita problemas em produção
  },
  
  // Otimização de build
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Output standalone para VM
  output: 'standalone',
  
  // Configuração de páginas estáticas
  experimental: {
    optimizeCss: true,
  },
  
  // Configuração para servidor customizado
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 