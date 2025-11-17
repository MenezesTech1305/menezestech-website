"use client"

import { Mail, Phone, MapPin, Zap } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const services = [
    "Consultoria em Infraestrutura",
    "Implantação de Servidores",
    "Gerenciamento de Redes",
    "Backup e Recuperação",
    "Segurança da Informação",
    "Implementação LGPD"
  ]

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">MenezesTech</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Especialistas em soluções de tecnologia da informação com mais de 10 anos 
              de experiência no mercado corporativo. Oferecemos atendimento personalizado 
              e relacionamento duradouro com nossos clientes.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <a href="mailto:contato@menezestech.com.br" className="text-gray-300 hover:text-white transition-colors">
                  contato@menezestech.com.br
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a href="tel:+5511999999999" className="text-gray-300 hover:text-white transition-colors">
                  (11) 99999-9999
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Nossos Serviços</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection("#services")}
                    className="text-gray-300 hover:text-white transition-colors text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("#home")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#about")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#services")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#contact")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} MenezesTech. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">
                Desenvolvido com tecnologia de ponta
              </span>
            </div>
          </div>
        </div>

        {/* Selo de qualidade */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-full px-6 py-3 border border-blue-500/30">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">
              ✓ Empresa certificada em segurança da informação e conformidade LGPD
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
} 