"use client"

import { Users, HandHeart, Clock, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  const values = [
    {
      icon: HandHeart,
      title: "Relacionamento Duradouro",
      description: "Acreditamos muito no relacionamento com cada cliente, buscando sempre a formação e manutenção de uma parceria duradoura."
    },
    {
      icon: Users,
      title: "Atendimento Personalizado",
      description: "Nossos colaboradores possuem um número limitado de clientes em sua carteira, proporcionando atendimento mais rápido, direto e personalizado."
    },
    {
      icon: Clock,
      title: "Agilidade e Eficiência",
      description: "Possuímos excelente relacionamento com distribuidores e fabricantes, garantindo agilidade na entrega e preços acessíveis."
    },
    {
      icon: Star,
      title: "Experiência Consolidada",
      description: "Mais de 10 anos de experiência e atuação no mercado corporativo, atendendo empresas de pequeno, médio e grande porte."
    }
  ]

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header da seção */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Sobre a <span className="menezes-text-gradient">MenezesTech</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A MenezesTech conta hoje com uma experiência consolidada de seus colaboradores, 
              que possuem mais de 10 anos de experiência e atuação no mercado corporativo.
            </p>
          </div>

          {/* Conteúdo principal */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nossa Missão
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Atendemos a uma carteira de clientes de pequeno, médio e grande porte de empresas, 
                incluindo vários cartórios extrajudiciais. Acreditamos muito no relacionamento com 
                cada cliente, buscando sempre a formação e a manutenção de uma parceria duradoura.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Por isso, nossos colaboradores possuem um número limitado de clientes em sua carteira, 
                o que proporciona um atendimento mais rápido, direto e personalizado a cada empresa, 
                inclusive com visitas e acompanhamento de projetos.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nossos Diferenciais
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Possuímos um excelente relacionamento com distribuidores e fabricantes, o que nos 
                privilegia na obtenção de produtos de qualidade, com preços acessíveis, facilidades 
                de pagamento e agilidade na entrega das mercadorias.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Ao solicitar uma cotação ou projeto, o cliente tem à sua disposição uma equipe técnica 
                especializada em analisar, comparar e oferecer os melhores produtos e soluções para 
                cada necessidade.
              </p>
            </div>
          </div>

          {/* Valores da empresa */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover-lift border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Compromisso */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 lg:p-12">
            <div className="text-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Nosso Compromisso
              </h3>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                A junção de todas essas facilidades e recursos visa proporcionar a você, nosso cliente, 
                toda tranquilidade e conforto. Ao fechar um serviço conosco, oferecemos atendimento 
                diferenciado com o cumprimento dos prazos e condições comerciais negociados, para que 
                você não tenha que se preocupar com mais nada até a execução do seu serviço.
              </p>
              <div className="mt-8">
                <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-gray-900">
                    Suporte direto do fabricante e mínima burocracia
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 