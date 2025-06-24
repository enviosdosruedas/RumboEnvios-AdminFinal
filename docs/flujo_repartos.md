# Gestión de Repartos - Flujo Técnico

## 1. Cambios en el Esquema de la Base de Datos (`schema.prisma`)

Para soportar la nueva funcionalidad de repartos, se ha modificado el esquema de la base de datos para incluir dos nuevos modelos y actualizar el modelo existente `Orden`.

### Nuevo Modelo: `Repartidor`
Representa a la persona encargada de realizar las entregas.

-   **`id`**: `Int` - Identificador único autoincremental.
-   **`nombre`**: `String` - Nombre completo del repartidor.
-   **Relación**: Se establece una relación uno-a-muchos con el modelo `Reparto` (`repartos Reparto[]`), indicando que un repartidor puede estar asociado a múltiples hojas de ruta o repartos.

### Nuevo Modelo: `Reparto`
Representa la hoja de ruta o el conjunto de entregas para un día y repartidor específicos.

-   **`id`**: `String` - Identificador único universal (`cuid`).
-   **`fecha`**: `DateTime` - La fecha en que se realizará el reparto.
-   **Relación (Repartidor)**: Se establece una relación muchos-a-uno con `Repartidor` a través del campo `repartidorId` y la relación `repartidor`. Cada reparto pertenece a un único repartidor.
-   **Relación (Órdenes)**: Se establece una relación uno-a-muchos con el modelo `Orden` (`ordenes Orden[]`), permitiendo que un reparto agrupe múltiples órdenes.

### Modificación del Modelo: `Orden`
Para vincular las órdenes a un reparto específico, se ha añadido un nuevo campo.

-   **`repartoId`**: `String?` - Un campo opcional que almacena el `id` del `Reparto` al que pertenece la orden. Es opcional (`?`) porque una orden puede no estar asignada a ningún reparto todavía.
-   **Relación**: Se define la relación `reparto` con el modelo `Reparto`, completando la asociación muchos-a-uno.

## 2. Nuevas Acciones del Servidor (`src/app/acciones.ts`)

La lógica de negocio del lado del servidor se encapsula en dos nuevas `Server Actions`.

### `crearReparto(datos)`
Esta acción es responsable de inicializar una nueva hoja de ruta.

-   **Entrada**: Recibe un objeto con `repartidorId` (el ID del repartidor seleccionado) y `fecha` (la fecha seleccionada para el reparto).
-   **Lógica**:
    1.  Valida que los datos de entrada no estén vacíos.
    2.  Utiliza `prisma.reparto.create()` para crear un nuevo registro en la tabla `Reparto` con la información proporcionada.
-   **Salida**: Retorna una `Promise` que se resuelve en un objeto. En caso de éxito, devuelve `{ exito: true, reparto: nuevoReparto }`, donde `nuevoReparto` es el objeto del reparto recién creado. En caso de error, devuelve `{ exito: false, error: "mensaje" }`.

### `asignarOrdenesAReparto(repartoId, ordenesIds)`
Esta acción finaliza el proceso, vinculando las órdenes seleccionadas a la hoja de ruta creada.

-   **Entrada**: Recibe el `repartoId` del reparto activo y un array `ordenesIds` con los identificadores de las órdenes seleccionadas por el usuario.
-   **Lógica**:
    1.  Valida que se hayan proporcionado tanto el `repartoId` como al menos un `ordenId`.
    2.  Ejecuta `prisma.orden.updateMany()` para actualizar múltiples órdenes de una sola vez.
    3.  El `where` de la consulta se asegura de que solo se actualicen las órdenes cuyos `numeroOrden` estén en el array `ordenesIds`.
    4.  El `data` de la consulta establece el `repartoId` al valor recibido y cambia el `estado` de las órdenes a `'EN_CAMINO'`.
-   **Salida**: Devuelve una `Promise` que se resuelve en un objeto con el resultado. En caso de éxito, `{ exito: true, count: numeroDeOrdenesActualizadas }`. En caso de fallo, `{ exito: false, error: "mensaje" }`.

## 3. Arquitectura del Frontend (Página y Componentes)

La interfaz de usuario se construye con una arquitectura de componentes clara y desacoplada.

### `src/app/repartos/page.tsx`
Actúa como el punto de entrada principal y el orquestador de la funcionalidad.

-   **Rol**: Es un **React Server Component (RSC)**.
-   **Responsabilidades**:
    1.  **Carga de Datos Inicial**: Al ser un componente de servidor, realiza la carga de datos asíncrona directamente. Llama a Prisma para obtener la lista completa de `repartidores` y la lista de `ordenesPendientes` (`estado: 'PENDIENTE'`, `repartoId: null`).
    2.  **Orquestación**: Renderiza el componente de cliente `GestionRepartos` y le pasa los datos cargados (`repartidores` y `ordenesPendientes`) como props.

### `src/components/gestion-repartos.tsx`
Es el componente "inteligente" o contenedor que centraliza toda la lógica de estado y la interacción del lado del cliente.

-   **Rol**: Es un **Client Component (`"use client"`)**.
-   **Responsabilidades**:
    1.  **Gestión de Estado**: Utiliza `useState` para manejar el estado clave: `repartoActivo` (almacena el objeto del reparto una vez creado) y `ordenesSeleccionadas` (almacena el array de órdenes seleccionadas en la tabla).
    2.  **Comunicación entre Componentes**: Recibe los datos de sus hijos a través de callbacks (`onRepartoCreado`, `onSelectionChange`).
    3.  **Lógica de Asignación**: Contiene la función `handleAsignarOrdenes` que invoca la `Server Action` `asignarOrdenesAReparto`.
    4.  **Renderizado Condicional**: Muestra y habilita los elementos de la UI (como el botón final de "Asignar") de forma condicional, basándose en el estado (`repartoActivo` y `ordenesSeleccionadas`).
    5.  **Feedback al Usuario**: Usa `useTransition` para gestionar los estados de carga y `useToast` para mostrar notificaciones.

### `src/components/formulario-crear-reparto.tsx`
Componente de UI enfocado únicamente en la creación del reparto.

-   **Rol**: **Client Component**.
-   **Responsabilidades**:
    1.  Renderiza un `Select` para los repartidores y un `DatePicker` para la fecha.
    2.  Gestiona el estado local de los campos del formulario.
    3.  Al hacer clic en "Crear Reparto", llama a la `Server Action` `crearReparto`.
    4.  Una vez que la acción es exitosa, comunica el reparto recién creado a su componente padre (`GestionRepartos`) a través de la prop `onRepartoCreado`.

### `src/components/tabla-ordenes-seleccionables.tsx`
Componente de UI especializado para mostrar y seleccionar órdenes.

-   **Rol**: **Client Component**.
-   **Responsabilidades**:
    1.  Utiliza `@tanstack/react-table` para renderizar una tabla de datos.
    2.  Implementa la funcionalidad de `rowSelection` para habilitar una columna de `Checkbox`.
    3.  Gestiona el estado interno de las filas seleccionadas.
    4.  Utiliza `useEffect` para detectar cambios en la selección y notificar al componente padre (`GestionRepartos`) a través de la prop `onSelectionChange`, pasándole el array completo de los objetos de orden seleccionados.

## 4. Flujo de Datos y Experiencia de Usuario Detallada

1.  **Navegación**: El usuario hace clic en el enlace "Repartos" en el `Header` y navega a `/repartos`.
2.  **Carga de Datos (Servidor)**: El componente de página `page.tsx` se ejecuta en el servidor. Obtiene la lista de repartidores y órdenes pendientes de la base de datos.
3.  **Renderizado Inicial (Cliente)**: La página renderiza el componente `GestionRepartos`, que a su vez renderiza `FormularioCrearReparto` (con la lista de repartidores) y `TablaOrdenesSeleccionables` (con las órdenes pendientes).
4.  **Paso 1: Crear Reparto**:
    -   El usuario selecciona un repartidor del `Select` y una fecha del `DatePicker`.
    -   El botón "Crear Reparto" se habilita. Al hacer clic, se llama a la `Server Action` `crearReparto`.
    -   El estado de la UI se actualiza para mostrar un estado de "cargando".
    -   Una vez que el servidor responde con éxito, el `formulario` invoca `onRepartoCreado`. `GestionRepartos` actualiza su estado `repartoActivo` con los datos del nuevo reparto. La UI se bloquea para evitar la creación de un segundo reparto.
5.  **Paso 2: Seleccionar Órdenes**:
    -   El usuario interactúa con la `TablaOrdenesSeleccionables`, marcando los `checkboxes` de las órdenes que desea incluir en la hoja de ruta.
    -   Cada vez que la selección cambia, la tabla invoca `onSelectionChange`. `GestionRepartos` actualiza su estado `ordenesSeleccionadas`.
6.  **Paso 3: Asignar Órdenes**:
    -   Una vez que `repartoActivo` no es nulo y `ordenesSeleccionadas` contiene al menos un elemento, el botón "Asignar X Órdenes" se habilita.
    -   Al presionar este botón, se invoca la `Server Action` `asignarOrdenesAReparto` con los IDs correspondientes.
7.  **Finalización y Feedback**:
    -   El servidor actualiza las órdenes en la base de datos.
    -   Al recibir una respuesta exitosa, `GestionRepartos` muestra un `toast` de éxito.
    -   Se invoca `router.refresh()` para volver a solicitar los datos del servidor para la página. Esto hace que la lista de "órdenes pendientes" se actualice automáticamente, eliminando las que acaban de ser asignadas.
    -   El estado local (`repartoActivo`, `ordenesSeleccionadas`) se resetea, preparando la interfaz para la creación de un nuevo reparto.
