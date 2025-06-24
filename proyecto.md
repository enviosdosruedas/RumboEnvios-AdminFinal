# Documentación Maestra del Proyecto: Envios DosRuedas

## 1. Resumen del Proyecto

**Propósito:** "Envios DosRuedas" es una aplicación web interna diseñada para ser el centro de operaciones logísticas de una empresa de repartos. Su objetivo principal es agilizar y automatizar el flujo de trabajo diario, desde la recepción de nuevas órdenes de envío hasta su asignación final a un repartidor.

**Problema Resuelto:** La aplicación ataca directamente la ineficiencia y el riesgo de error asociados con el procesamiento manual de órdenes. Anteriormente, los operadores debían copiar y pegar información desde texto plano a hojas de cálculo o sistemas manuales. Esta herramienta automatiza la extracción de datos, la geocodificación de direcciones y la creación de hojas de ruta.

**Usuarios Finales:** El sistema está dirigido a los operadores de logística y administradores de la empresa, quienes son responsables de gestionar las órdenes entrantes y coordinar a los repartidores.

## 2. Arquitectura General y Stack Tecnológico

La aplicación está construida sobre una pila tecnológica moderna, optimizada para el rendimiento, la escalabilidad y una excelente experiencia de desarrollador.

**Stack Tecnológico:**
*   **Framework:** Next.js 15 (con App Router)
*   **Lenguaje:** TypeScript
*   **Runtime:** Bun
*   **Base de Datos:** PostgreSQL
*   **ORM:** Prisma con Accelerate (para conexiones eficientes y escalables)
*   **Estilos:** Tailwind CSS
*   **Componentes UI:** Shadcn/UI
*   **APIs Externas:** Google Maps (Geocoding API)

**Arquitectura General:**
El proyecto sigue el paradigma del **App Router de Next.js**, que favorece los **React Server Components (RSC)** por defecto. Esta arquitectura permite que la carga de datos, el acceso a la base de datos y la lógica de negocio sensible se ejecuten exclusivamente en el servidor, mejorando la seguridad y el rendimiento.

La interactividad del lado del cliente (manejo de estado, eventos de usuario) se delega a **Componentes de Cliente**, identificados con la directiva `"use client"`. La comunicación entre el cliente y el servidor se realiza principalmente a través de **Server Actions**, que permiten llamar a funciones seguras del lado del servidor directamente desde los componentes del cliente, eliminando la necesidad de crear endpoints de API tradicionales para las operaciones CRUD.

## 3. Flujo de Datos y Lógica de Negocio

La aplicación se centra en dos flujos de trabajo críticos:

### Flujo 1: Procesamiento y Guardado de Órdenes
1.  **Entrada de Datos:** Un operador pega un bloque de texto con múltiples órdenes en un `Textarea` en la página principal (`/`).
2.  **Procesamiento (Server Action):** Al hacer clic en "Procesar", se invoca la Server Action `procesarOrdenesDesdeTexto`.
    *   La acción parsea el texto crudo usando lógica de división de cadenas y expresiones regulares para extraer detalles como direcciones, horarios, montos, etc.
    *   Para cada orden, se llama a la función `geocodeAddress`, que utiliza la API de Geocoding de Google Maps en el servidor para convertir la dirección de entrega en coordenadas (`lat`, `lng`).
    *   La acción retorna un array de objetos `Orden` estructurados al cliente para su previsualización.
3.  **Guardado en BD:** Tras revisar los datos, el operador hace clic en "Guardar". Esto invoca la Server Action `guardarOrdenes`.
    *   La acción realiza un `prisma.orden.createMany()` para guardar todas las órdenes en la base de datos de forma eficiente.
    *   Cada orden se guarda con el estado por defecto `'PENDIENTE'` y sin `repartoId`, indicando que está lista para ser asignada.

### Flujo 2: Gestión y Asignación de Repartos
1.  **Creación de Hoja de Ruta (Reparto):** En la página `/repartos`, el operador inicia el proceso.
    *   **Paso 1:** Selecciona un `Repartidor` y una `fecha` en el componente `FormularioCrearReparto`.
    *   Al confirmar, se llama a la Server Action `crearReparto`, que crea un nuevo registro en la tabla `Reparto` de la base de datos.
2.  **Selección de Órdenes:** El componente `TablaOrdenesSeleccionables` muestra todas las órdenes con estado `'PENDIENTE'` y `repartoId: null`. El operador utiliza checkboxes para seleccionar las que desea incluir en la hoja de ruta recién creada.
3.  **Asignación Final:** Con un reparto activo y órdenes seleccionadas, el operador presiona "Asignar Órdenes".
    *   Se invoca la Server Action `asignarOrdenesAReparto`.
    *   Esta acción recibe el `repartoId` y un array de `ordenIds`.
    *   Ejecuta `prisma.orden.updateMany()` para actualizar todas las órdenes seleccionadas de una sola vez: establece su `repartoId` al del reparto activo y cambia su `estado` a `'ASIGNADO'`.
4.  **Visualización:** El sistema permite ver el detalle de cada reparto (`/repartos/[id]`), incluyendo un mapa con la ubicación de todas las órdenes asignadas.

## 4. Estructura de Componentes y Archivos Clave

*   **`prisma/schema.prisma`:** Es la única fuente de verdad para el esquema de la base de datos. Define los modelos `Orden`, `Repartidor`, `Reparto` y el enum `EstadoOrden`, así como las relaciones entre ellos.
*   **`src/app/acciones.ts`:** El corazón de la lógica de negocio. Centraliza todas las Server Actions, manteniendo una clara separación entre el frontend y el backend. Aquí residen funciones críticas como `procesarOrdenesDesdeTexto`, `crearReparto`, `asignarOrdenesAReparto` y `geocodeAddress`.
*   **`src/app/` (y subdirectorios):** Implementa el enrutamiento basado en archivos del App Router.
    *   `/`: Página principal para procesar órdenes.
    *   `/repartos`: Gestión y creación de repartos.
    *   `/repartos/[id]`: Vista de detalle de un reparto específico, con mapa.
    *   `/ordenes/[id]`: Vista de detalle de una orden individual.
    *   `/repartidores`: Gestión de repartidores.
    *   `/historial`: Historial completo de todas las órdenes.
*   **`src/components/`:** Alberga componentes de React reutilizables.
    *   `tabla-ordenes.tsx`: Componente versátil para mostrar listas de órdenes en diferentes contextos (historial, detalle de reparto). Incluye lógica de búsqueda y vista adaptable para móviles.
    *   `mapa-reparto.tsx`: Componente de cliente que encapsula la lógica de Google Maps para visualizar las órdenes de un reparto.
    *   `gestion-repartos.tsx`: Componente cliente orquestador que maneja el estado del flujo de creación de repartos.
    *   `formulario-orden.tsx`: Formulario de entrada de texto para las órdenes.
*   **`src/tipos/`:** Contiene las definiciones de interfaces de TypeScript (`Orden`, `Repartidor`, `Reparto`), garantizando la seguridad de tipos en todo el proyecto y un desarrollo más robusto.

## 5. Principios de Diseño y Buenas Prácticas

*   **Separación de Incumbencias:** Se mantiene una estricta separación entre la lógica de la interfaz de usuario (en componentes de cliente) y la lógica de negocio y acceso a datos (en componentes de servidor y Server Actions).
*   **Experiencia de Usuario (UX) Mejorada:** Se utiliza `useTransition` para las mutaciones de datos, evitando que la UI se bloquee y proporcionando feedback de carga (ej. "Guardando..."). Las notificaciones (`toast`) informan al usuario sobre el resultado de sus acciones.
*   **Robustez y Resiliencia:** Todas las Server Actions y operaciones de base de datos están envueltas en bloques `try...catch` para manejar errores de forma controlada y devolver mensajes claros al usuario.
*   **Seguridad de Tipos (Type Safety):** El uso extensivo de TypeScript, junto con los tipos generados por Prisma y las interfaces personalizadas en `src/tipos/`, reduce errores en tiempo de ejecución y mejora la predictibilidad del código.
*   **Reutilización de Componentes:** Componentes como `TablaOrdenes` y los componentes de UI de Shadcn se reutilizan en múltiples páginas, promoviendo la consistencia y reduciendo la duplicación de código.
*   **Optimización de Costos y Rendimiento:** La geocodificación de direcciones se realiza una única vez en el servidor al momento de crear la orden. Las coordenadas se almacenan en la base de datos, evitando llamadas repetidas y costosas a la API de Google Maps cada vez que se visualiza un mapa.
