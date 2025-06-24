import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

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
    <html lang="es">
      <body className="bg-muted/40 antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
