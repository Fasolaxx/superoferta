import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SuperOferta — Ahorrá en el super",
  description: "Ofertas de Coto, Jumbo y Carrefour. Recetas con lo que está en oferta.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-emerald-600 tracking-tight">
              SuperOferta
            </Link>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/ofertas" className="hover:text-emerald-600 transition-colors">Ofertas</Link>
              <Link href="/recetas" className="hover:text-emerald-600 transition-colors">Recetas</Link>
              <Link href="/comparador" className="hover:text-emerald-600 transition-colors">Comparador</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}