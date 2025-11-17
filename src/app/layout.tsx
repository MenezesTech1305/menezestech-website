import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MenezesTech - Soluções em Tecnologia da Informação",
  description: "Especialistas em infraestrutura, segurança e LGPD. Oferecemos atendimento personalizado com foco em relacionamento duradouro para empresas de todos os portes.",
  keywords: "TI, infraestrutura, LGPD, segurança, servidores, backup, consultoria",
  authors: [{ name: "MenezesTech" }],
  openGraph: {
    title: "MenezesTech - Soluções em TI",
    description: "Mais de 10 anos de experiência em tecnologia da informação",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
} 