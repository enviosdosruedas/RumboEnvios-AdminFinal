'use client';

import { ApiProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Orden } from '@/tipos/orden';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface MapaRepartoProps {
  ordenes: Orden[];
}

const API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY;

// Default center for Mar del Plata, Argentina
const defaultCenter = { lat: -38.0055, lng: -57.5426 };

export function MapaReparto({ ordenes }: MapaRepartoProps) {
  if (!API_KEY) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Visualización de Mapa</CardTitle>
          <CardDescription>Mapa interactivo del reparto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed shadow-sm bg-muted p-4">
            <div className="text-center">
              <p className="mt-2 text-base text-muted-foreground">
                La clave de API de Google Maps para el cliente no está configurada.
              </p>
              <p className="text-sm text-muted-foreground">
                Por favor, añade NEXT_PUBLIC_MAPS_API_KEY a tu archivo .env para ver el mapa.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const markers = ordenes.filter(orden => orden.lat != null && orden.lng != null);

  const center = markers.length > 0 && markers[0].lat && markers[0].lng
    ? { lat: markers[0].lat, lng: markers[0].lng }
    : defaultCenter;

  return (
    <div className="h-[500px] w-full mt-8 rounded-lg overflow-hidden border shadow-sm">
      <ApiProvider apiKey={API_KEY}>
        <Map
          mapId="e093a38411136241" // A generic mapId for basic styling
          defaultCenter={center}
          defaultZoom={12}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {markers.map((orden) => (
            <AdvancedMarker
              key={orden.numeroOrden}
              position={{ lat: orden.lat!, lng: orden.lng! }}
              title={`Orden #${orden.numeroOrden.substring(0,7)} - ${orden.destino.split(',')[0]}`}
            />
          ))}
        </Map>
      </ApiProvider>
    </div>
  );
}
