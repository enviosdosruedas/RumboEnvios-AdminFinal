-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('PENDIENTE', 'ASIGNADO', 'RETIRADO', 'EN_CAMINO', 'COMPLETADO', 'FALLIDO');

-- CreateTable
CREATE TABLE "Orden" (
    "numeroOrden" TEXT NOT NULL,
    "nombreClienteEntrega" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaHasta" TEXT NOT NULL,
    "nombreClienteRetiro" TEXT NOT NULL,
    "direccionRetiro" TEXT NOT NULL,
    "horaDesde" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "montoEnvio" DOUBLE PRECISION NOT NULL,
    "aclaraciones" TEXT NOT NULL,
    "estado" "EstadoOrden" NOT NULL DEFAULT 'PENDIENTE',
    "repartoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orden_pkey" PRIMARY KEY ("numeroOrden")
);

-- CreateTable
CREATE TABLE "Repartidor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repartidor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reparto" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "repartidorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reparto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_repartoId_fkey" FOREIGN KEY ("repartoId") REFERENCES "Reparto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reparto" ADD CONSTRAINT "Reparto_repartidorId_fkey" FOREIGN KEY ("repartidorId") REFERENCES "Repartidor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
