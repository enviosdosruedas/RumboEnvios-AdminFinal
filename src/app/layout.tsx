import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: 'Procesador de Órdenes',
  description: 'Procesa nuevas órdenes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
