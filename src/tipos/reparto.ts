import type { Orden } from "./orden";
import type { Repartidor } from "./repartidor";

export interface Reparto {
  id: string;
  fecha: Date;
  repartidorId: number;
  repartidor?: Repartidor;
  ordenes?: Orden[];
}
