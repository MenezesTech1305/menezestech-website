"use client"

import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Carlos Mendes",
      company: "Cartório 1º Tabelião",
      role: "Responsável pela TI",
      content: "A MenezesTech transformou nossa infraestrutura de TI. Agora temos segurança total dos dados e conformidade completa com a LGPD. O atendimento personalizado faz toda a diferença.",
      rating: 5
    },
    {
      name: "Mariana Silva",
      company: "Empresa Logística SP",
      role: "Diretora Executiva", 
      content: "Há 5 anos trabalhamos com a MenezesTech. Nunca tivemos problemas de infraestrutura ou segurança. A equipe é extremamente competente e sempre disponível para nos atender.",
      rating: 5
    },
    {
      name: "Roberto Santos",
      company: "Grupo Comercial Santos",
      role: "Gerente de TI",
      content: "O que mais impressiona na MenezesTech é o relacionamento duradouro. Eles não são apenas fornecedores, são parceiros que entendem nosso negócio e crescem conosco.",
      rating: 5
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header da seção */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              O que nossos <span className="menezes-text-gradient">clientes dizem</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Mais de 10 anos construindo relacionamentos duradouros e oferecendo 
              soluções que realmente transformam a infraestrutura de TI das empresas.
            </p>
          </div>

          {/* Grid de depoimentos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift border-0 shadow-lg h-full relative overflow-hidden">
                {/* Ícone de aspas */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="h-12 w-12 text-blue-600" />
                </div>
                
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Avaliação */}
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Conteúdo do depoimento */}
                  <div className="flex-1">
                    <blockquote className="text-gray-600 mb-6 leading-relaxed italic text-center">
                      "{testimonial.content}"
                    </blockquote>
                  </div>

                  {/* Informações do cliente */}
                  <div className="border-t pt-4 mt-auto">
                    <div className="flex flex-col items-center space-y-3 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <p className="text-sm text-blue-600 font-medium">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 lg:p-12 text-white">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Junte-se aos nossos clientes satisfeitos
              </h3>
              <p className="text-lg lg:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Descubra como a MenezesTech pode transformar a infraestrutura de TI 
                da sua empresa com soluções personalizadas e atendimento de excelência.
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-6 py-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-300 fill-current" />
                  ))}
                </div>
                <span className="text-white font-semibold ml-3">
                  5.0 • Mais de 100 clientes satisfeitos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 