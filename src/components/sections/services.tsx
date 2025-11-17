"use client"

import { Server, Network, Shield, Database, FileCheck, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ServicesSection() {
  const services = [
    {
      icon: Settings,
      title: "Consultoria em Infraestrutura de TI",
      description: "Serviços de consultoria para ajudar as organizações a projetarem, implementar e gerenciar sua infraestrutura de TI.",
      features: ["Análise de necessidades", "Projeto de infraestrutura", "Dimensionamento adequado", "Otimização de recursos"]
    },
    {
      icon: Server,
      title: "Implantação e Configuração de Servidores",
      description: "Auxílio na instalação e configuração de servidores físicos ou virtuais, garantindo dimensionamento adequado.",
      features: ["Servidores físicos e virtuais", "Configuração otimizada", "Dimensionamento adequado", "Suporte completo"]
    },
    {
      icon: Network,
      title: "Gerenciamento de Redes",
      description: "Configuração e monitoramento de switches, roteadores e firewalls para garantir uma rede segura e eficiente.",
      features: ["Configuração de equipamentos", "Monitoramento 24/7", "Segurança de rede", "Otimização de performance"]
    },
    {
      icon: Database,
      title: "Backup e Recuperação de Dados",
      description: "Soluções para realizar backups regulares e implementar estratégias eficientes de recuperação de dados.",
      features: ["Backup automatizado", "Estratégias de recuperação", "Testes regulares", "Armazenamento seguro"]
    },
    {
      icon: Shield,
      title: "Segurança da Informação",
      description: "Análise de vulnerabilidades, implementação de políticas de segurança e monitoramento contínuo.",
      features: ["Análise de vulnerabilidades", "Políticas de segurança", "Treinamento de usuários", "Monitoramento contínuo"]
    },
    {
      icon: FileCheck,
      title: "Implementação da LGPD",
      description: "Auxílio na adequação das organizações à Lei Geral de Proteção de Dados (LGPD).",
      features: ["Mapeamento de dados", "Políticas de conformidade", "Treinamento de equipes", "Auditoria contínua"]
    }
  ]

  const scrollToContact = () => {
    const element = document.querySelector("#contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header da seção */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Nossos <span className="menezes-text-gradient">Serviços</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Oferecemos uma gama completa de serviços especializados em tecnologia da informação, 
              com foco em infraestrutura, segurança e conformidade regulatória.
            </p>
          </div>

          {/* Grid de serviços */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="hover-lift border-0 shadow-lg h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mx-auto mb-4">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">Principais características:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 lg:p-12 text-center text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Precisa de uma Solução Personalizada?
            </h3>
            <p className="text-lg lg:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Nossa equipe técnica especializada está pronta para analisar, comparar e oferecer 
              os melhores produtos e soluções para cada necessidade específica da sua empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={scrollToContact}
                size="lg"
                variant="outline"
                className="bg-white text-blue-600 border-white hover:bg-gray-50 text-lg px-8"
              >
                Solicitar Consultoria Gratuita
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 