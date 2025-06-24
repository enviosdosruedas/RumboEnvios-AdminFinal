# Informe de Flujo de Trabajo y Estructura del Proyecto

## Descripción General

Esta aplicación es una herramienta construida con Next.js y Shadcn/UI para procesar texto de órdenes de envío, extraer la información relevante y mostrarla de forma estructurada. Utiliza Server Actions de Next.js para manejar la lógica de negocio en el lado del servidor de manera segura y eficiente.

## Estructura del Directorio `src`

La organización del código fuente sigue las convenciones modernas de Next.js, separando las responsabilidades en directorios específicos:

-   **`src/app/`**: Contiene la lógica central de la aplicación web.
    -   `layout.tsx`: El layout raíz que envuelve todas las páginas. Define la estructura HTML base y los estilos globales.
    -   `page.tsx`: La página principal de la aplicación, que actúa como el punto de entrada para el usuario.
    -   `acciones.ts`: Define las Server Actions. Aquí reside la lógica de negocio que se ejecuta en el servidor, como el procesamiento del texto de las órdenes.
    -   `globals.css`: Archivo de estilos globales y configuración de variables de tema para Tailwind CSS.

-   **`src/components/`**: Alberga los componentes de React.
    -   `formulario-orden.tsx`: Un componente de cliente (`"use client"`) que contiene la interfaz de usuario interactiva (Textarea y Botón) y maneja el estado del lado del cliente.
    -   `ui/`: Componentes de UI preconstruidos de la librería Shadcn/UI.

-   **`src/tipos/`**: Almacena las definiciones de tipos de TypeScript.
    -   `orden.ts`: Define el tipo `Orden`, asegurando la consistencia de los datos en toda la aplicación.

-   **`src/lib/`**: Directorio para funciones de utilidad.
    -   `utils.ts`: Contiene helpers, como la función `cn` para fusionar clases de Tailwind.

-   **`src/hooks/`**: Contiene hooks personalizados de React.
    -   `use-toast.ts`: Hook para gestionar notificaciones (toasts).
    -   `use-mobile.ts`: Hook para detectar si el dispositivo es móvil.
    
-   **`src/ai/`**: Configuración relacionada con Genkit para futuras integraciones de IA.
    -   `genkit.ts`: Inicialización del cliente de Genkit.
    -   `dev.ts`: Archivo para el entorno de desarrollo de Genkit.

## Flujo de Trabajo del Procesamiento de Órdenes

1.  **Inicio**: El usuario accede a la página principal (`src/app/page.tsx`).
2.  **Renderizado Inicial**: La página muestra un `Card` que contiene el componente `FormularioOrden` (`src/components/formulario-orden.tsx`).
3.  **Entrada de Datos**: El usuario pega el texto con la información de las órdenes en el `Textarea` del formulario. El estado `textoOrdenes` del componente se actualiza en tiempo real.
4.  **Acción del Usuario**: El usuario hace clic en el botón "Procesar Órdenes".
5.  **Llamada a la Server Action**: El evento `onClick` del botón ejecuta la función `procesarOrdenes` dentro del componente, la cual invoca a la Server Action `procesarOrdenesDesdeTexto` (definida en `src/app/acciones.ts`), pasándole el contenido del `Textarea`.
6.  **Procesamiento en el Servidor**:
    -   La Server Action recibe el texto (`textoCrudo`).
    -   Utiliza lógica de división de cadenas y expresiones regulares para parsear el texto y extraer los detalles de cada orden (empresa, direcciones, montos, etc.).
    -   Añade información adicional, como el sufijo de la ciudad, a las direcciones.
    -   Construye un array de objetos que cumplen con el tipo `Orden` (definido en `src/tipos/orden.ts`).
7.  **Respuesta del Servidor**: La Server Action retorna una `Promise` que se resuelve con el array de órdenes procesadas.
8.  **Actualización de la UI**:
    -   El componente `FormularioOrden` recibe el array de órdenes.
    -   Actualiza su estado `ordenes` con los datos recibidos.
    -   React detecta el cambio de estado y vuelve a renderizar el componente.
9.  **Visualización de Resultados**: La UI ahora muestra una lista de `Card`, donde cada tarjeta representa una orden procesada y muestra sus detalles de forma organizada.
