export type Orden = {
  empresa: string;
  direccionRetiro: string;
  horarioEntrega: string;
  direccionEntrega: string;
  montoACobrar?: number;
  costoEnvio: number;
  notas?: string;
};
