import { Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Truck className="h-6 w-6 text-primary" />
          <span className="font-bold">Envios DosRuedas</span>
        </Link>
        <nav className="flex items-center space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/">Procesar</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/historial">Historial</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
