"use client"

import { Building2, Handshake } from "lucide-react"

export function PartnersSection() {
  const partners = [
    {
      name: "Microsoft",
      category: "Licenciamento e Cloud",
      logo: "🏢" // Emoji como placeholder
    },
    {
      name: "Dell Technologies",
      category: "Servidores e Hardware",
      logo: "💻"
    },
    {
      name: "VMware",
      category: "Virtualização",
      logo: "☁️"
    },
    {
      name: "Cisco",
      category: "Redes e Segurança",
      logo: "🌐"
    },
    {
      name: "HP Enterprise",
      category: "Infraestrutura",
      logo: "🖥️"
    },
    {
      name: "Fortinet",
      category: "Cibersegurança",
      logo: "🔒"
    }
  ]

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header da seção */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2 mb-4">
              <Handshake className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Parceiros Estratégicos
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Trabalhamos com as <span className="menezes-text-gradient">melhores marcas</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Possuímos um excelente relacionamento com distribuidores e fabricantes, 
              o que nos privilegia na obtenção de produtos de qualidade com preços acessíveis.
            </p>
          </div>

          {/* Grid de parceiros */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className="text-3xl mb-3">{partner.logo}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{partner.name}</h4>
                <p className="text-xs text-gray-500">{partner.category}</p>
              </div>
            ))}
          </div>

          {/* Benefícios da parceria */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Vantagens das Nossas Parcerias
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">💰</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Preços Competitivos</h4>
                  <p className="text-sm text-gray-600">
                    Preços especiais através de parcerias diretas com fabricantes
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">⚡</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Entrega Rápida</h4>
                  <p className="text-sm text-gray-600">
                    Agilidade na entrega através de canais preferenciais
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">🛠️</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Suporte Direto</h4>
                  <p className="text-sm text-gray-600">
                    Suporte técnico e comercial direto do fabricante
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 