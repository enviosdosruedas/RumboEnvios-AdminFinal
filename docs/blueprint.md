
# Envios DosRuedas - Blueprint de Arquitectura Técnica

## 1. Resumen del Proyecto

**Envios DosRuedas** es una herramienta administrativa interna diseñada para agilizar el proceso de logística. La aplicación permite a los operadores pegar un bloque de texto no estructurado que contiene múltiples órdenes de envío, procesar dicho texto para extraer información relevante y visualizar los datos de forma estructurada en una tabla dinámica. El objetivo principal es reducir el tiempo de entrada manual de datos y minimizar errores.

## 2. Arquitectura General y Stack Tecnológico

La aplicación está construida sobre un stack moderno de JavaScript, aprovechando las últimas características de **Next.js 15** con el **App Router**.

-   **Framework Principal**: Next.js 15
-   **Lenguaje**: TypeScript
-   **UI Components**: Shadcn/UI
-   **Estilos**: Tailwind CSS
-   **Lógica de Backend**: Next.js Server Actions
-   **Gestión de Estado (Cliente)**: Hooks de React (`useState`, `useTransition`)

La arquitectura se centra en el uso de **React Server Components (RSC)** por defecto, delegando la interactividad a **Client Components (`"use client"`)** solo cuando es estrictamente necesario. Las mutaciones de datos y la lógica de negocio se manejan a través de **Server Actions**, eliminando la necesidad de crear endpoints de API tradicionales para esta funcionalidad.

## 3. Flujo de Datos y Lógica de Negocio

El flujo de trabajo principal de la aplicación se puede descomponer en los siguientes pasos:

1.  **Entrada de Usuario (Cliente)**:
    -   El usuario accede a la página principal (`src/app/page.tsx`), que renderiza el componente cliente `src/components/formulario-orden.tsx`.
    -   El usuario pega el texto de las órdenes en el componente `<Textarea>`. El contenido es capturado y almacenado en un estado de React (`textoOrdenes`) a través del evento `onChange`.

2.  **Disparo de la Acción (Cliente)**:
    -   Al hacer clic en el botón "Procesar Órdenes", se invoca la función `procesarOrdenes`.
    -   Esta función utiliza el hook `useTransition` de React para encapsular la llamada a la Server Action. Esto proporciona un estado booleano (`isPending`) que se utiliza para dar feedback visual inmediato al usuario (deshabilitar el botón y el área de texto, y cambiar el texto del botón a "Procesando...").

3.  **Ejecución en el Servidor (Server Action)**:
    -   La función del cliente llama a la Server Action `procesarOrdenesDesdeTexto` (definida en `src/app/acciones.ts`), pasándole el estado `textoOrdenes`.
    -   **Manejo de Errores**: La lógica completa en el servidor está envuelta en un bloque `try...catch`.
    -   **Lógica de Negocio**:
        -   Se obtiene la `fechaActual` con `new Date()`.
        -   El `textoCrudo` se divide en bloques por empresa y luego en líneas por envío.
        -   Se utiliza una expresión regular optimizada para extraer los campos `horarioEntrega`, `direccionEntrega`, `montoACobrar`, `costoEnvio` y `notas` de cada línea. Esta regex es insensible a mayúsculas/minúsculas y maneja variaciones en el texto.
        -   Los datos extraídos se limpian, y los valores numéricos se convierten explícitamente a tipo `Number`.
        -   Para cada envío válido, se construye un objeto `Orden` (según el tipo definido en `src/tipos/orden.ts`), incluyendo la `fechaActual`.
    -   **Respuesta Estructurada**: La Server Action siempre devuelve una `Promise` que se resuelve en un objeto con una estructura predecible:
        -   En caso de éxito: `{ exito: true, datos: Orden[] }`.
        -   En caso de fallo (capturado por el `catch`): `{ exito: false, error: "Mensaje de error" }`.

4.  **Actualización y Feedback en la UI (Cliente)**:
    -   El componente `formulario-orden.tsx` recibe la respuesta de la Server Action.
    -   **Gestión de la Respuesta**:
        -   Si `respuesta.exito` es `false`, se limpia el estado de las órdenes y se muestra una notificación de error (`toast`) con el mensaje devuelto por el servidor.
        -   Si `respuesta.exito` es `true`:
            -   El estado `ordenes` se actualiza con `respuesta.datos`.
            -   React vuelve a renderizar el componente. El componente `<TablaOrdenes>` ahora recibe los nuevos datos y los muestra.
            -   Se muestra un `toast` de éxito o un `toast` informativo si no se encontraron órdenes.
    -   Una vez que la `Promise` de la Server Action se resuelve, `isPending` vuelve a `false`, y la UI se restaura a su estado normal.

## 4. Estructura de Componentes y Archivos Clave

-   `src/app/page.tsx`: Página principal (Server Component). Actúa como contenedor y punto de entrada visual.
-   `src/app/acciones.ts`: Archivo exclusivo del servidor (`'use server'`). Centraliza la lógica de negocio pesada, el procesamiento de datos y la interacción con la "base de datos" (en este caso, el texto crudo).
-   `src/components/formulario-orden.tsx`: Componente de cliente (`"use client"`) principal. Maneja toda la interactividad, el estado del lado del cliente y la comunicación con la Server Action.
-   `src/components/tabla-ordenes.tsx`: Componente de cliente para la visualización de datos. Utiliza `@tanstack/react-table` para renderizar una tabla dinámica y reutilizable.
-   `src/tipos/orden.ts`: Define la estructura de datos `Orden` con TypeScript, garantizando la consistencia y seguridad de tipos en todo el flujo de datos.
-   `src/hooks/use-toast.ts`: Hook personalizado que abstrae la lógica de notificaciones, haciéndola fácil de usar en cualquier componente.

## 5. Principios de Diseño y Buenas Prácticas

-   **Separación de incumbencias**: La lógica de la interfaz de usuario vive en los componentes de React, mientras que la lógica de negocio reside completamente en el servidor a través de Server Actions.
-   **Experiencia de Usuario (UX) Mejorada**: El uso de `useTransition` proporciona feedback inmediato y evita interacciones no deseadas durante las operaciones asíncronas. Las notificaciones `toast` comunican claramente el resultado de las acciones.
-   **Robustez y Resiliencia**: El manejo de errores centralizado en el servidor y la comunicación de estos errores al cliente hacen que la aplicación sea más robusta.
-   **Seguridad de Tipos**: TypeScript se utiliza en todo el proyecto para evitar errores comunes en tiempo de ejecución y mejorar la mantenibilidad del código.
-   **Reutilización de Componentes**: La tabla de resultados está encapsulada en su propio componente (`TablaOrdenes`), lo que permite que sea reutilizada o modificada fácilmente en el futuro.
