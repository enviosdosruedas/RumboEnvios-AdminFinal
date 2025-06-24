import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Procesar Nuevas Órdenes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* El contenido para procesar órdenes irá aquí */}
        </CardContent>
      </Card>
    </main>
  )
}
