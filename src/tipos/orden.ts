export type Orden = {
  fecha: Date;
  empresa: string;
  direccionRetiro: string;
  horarioEntrega: string;
  direccionEntrega: string;
  montoACobrar?: number;
  costoEnvio: number;
  notas?: string;
};
