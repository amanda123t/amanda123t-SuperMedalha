import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Validador de Regras de Processo IA",
  description: "Analise regras de processos de negócio com inteligência artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Barra de navegação global */}
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 h-12 flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Validador IA
            </Link>
            <Link
              href="/projects"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Projetos
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
