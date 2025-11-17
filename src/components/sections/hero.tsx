"use client"

import { ArrowRight, Shield, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import AnimatedGradientText from "@/components/ui/animated-gradient-text"
import NumberTicker from "@/components/ui/number-ticker"

export function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28">
      {/* Background com efeito tech */}
      <div className="absolute inset-0 tech-pattern opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50"></div>
      
      {/* Conteúdo principal */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge de experiência */}
          <AnimatedGradientText className="mb-8">
            <Award className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Mais de 10 anos de experiência no mercado
            </span>
          </AnimatedGradientText>

          {/* Título principal */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Soluções em</span>
            <br />
            <span className="menezes-text-gradient">Tecnologia da Informação</span>
          </h1>

          {/* Descrição */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Especialistas em <strong>infraestrutura</strong>, <strong>segurança</strong> e <strong>LGPD</strong>. 
            Oferecemos atendimento personalizado com foco em relacionamento duradouro para empresas de todos os portes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 max-w-lg mx-auto sm:max-w-none">
            <ShimmerButton
              onClick={() => scrollToSection("#contact")}
              background="linear-gradient(135deg, #4F46E5, #06B6D4)"
              className="text-lg px-8 py-6 w-full sm:w-auto min-w-[250px]"
            >
              <span>Solicitar Consultoria</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </ShimmerButton>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("#services")}
              className="text-lg px-8 py-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white smooth-transition w-full sm:w-auto min-w-[250px]"
            >
              Conhecer Serviços
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border hover-lift">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                <NumberTicker value={100} className="text-2xl font-bold text-gray-900" />+
              </h3>
              <p className="text-gray-600">Clientes Atendidos</p>
              <p className="text-sm text-gray-500 mt-2">Incluindo cartórios e empresas de grande porte</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border hover-lift">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                <NumberTicker value={100} className="text-2xl font-bold text-gray-900" delay={0.5} />%
              </h3>
              <p className="text-gray-600">Conformidade LGPD</p>
              <p className="text-sm text-gray-500 mt-2">Implementação completa e auditoria contínua</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border hover-lift">
              <div className="flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mx-auto mb-4">
                <Award className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                <NumberTicker value={24} className="text-2xl font-bold text-gray-900" delay={1} />/7
              </h3>
              <p className="text-gray-600">Suporte Técnico</p>
              <p className="text-sm text-gray-500 mt-2">Atendimento personalizado e resolução rápida</p>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
} 