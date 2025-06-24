import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormularioOrden } from "@/components/formulario-orden"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Procesar Nuevas Órdenes</CardTitle>
        </CardHeader>
        <CardContent>
          <FormularioOrden />
        </CardContent>
      </Card>
    </main>
  )
}
