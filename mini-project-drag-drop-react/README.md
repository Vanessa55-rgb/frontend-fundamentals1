# TaskFlow React - Gestor de Tareas Drag & Drop

TaskFlow React es una aplicación web moderna y minimalista diseñada para la gestión eficiente de tareas diarias. Este proyecto es una migración a **React** de los conceptos de **Frontend Fundamentals**.

## Conceptos Implementados

Este proyecto integra los conceptos de desarrollo con React:

### ⚛️ React & Arquitectura
- **Componentes**: Arquitectura modular reutilizable (`Column`, `Task`, `TaskInput`).
- **Hooks**: Gestión de estado con `useState` y efectos secundarios con `useEffect`.
- **JSX**: Sintaxis declarativa para la estructura del UI.
- **Estado Inmutable**: Actualizaciones de estado seguras al manipular arrays de tareas.

### 📚 Fundamentos Modernos
- **Event Handling**: Manejo de eventos sintéticos de React para Drag & Drop nativo.
- **LocalStorage**: Persistencia de datos sincronizada con el estado de la aplicación.
- **Vite**: Entorno de desarrollo ultrarrápido y optimización de recursos.

## Características Principales

- **Interfaz Drag & Drop**: Organiza tus tareas moviéndolas dinámicamente entre columnas.
- **Diseño Premium**: Estética moderna con efectos de Glassmorphism (desenfoque de cristal) y animaciones fluidas, migrada fielmente del diseño original.
- **Persistencia Local**: Las tareas se guardan automáticamente usando `LocalStorage`.
- **Diseño Adaptativo**: Totalmente optimizado para dispositivos móviles y escritorio.

## Cómo Ejecutar el Proyecto

Este proyecto utiliza Vite como herramienta de construcción. Sigue estos pasos:

1.  Navega a la carpeta del proyecto:
    ```bash
    cd mini-project-drag-drop-react
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

    Deberías ver una salida similar a esta:
    ```
    > mini-project-drag-drop-react@0.0.0 dev
    > vite

      VITE v7.3.1  ready in 138 ms

      ➜  Local:   http://localhost:5173/
      ➜  Network: use --host to expose
      ➜  press h + enter to show help
    ```

4.  Abre tu navegador en `http://localhost:5173/`.

## Uso

1.  Escribe una tarea en el campo superior y presiona "Añadir Tarea".
2.  Arrastra las tareas entre las columnas para cambiar su estado (Pendientes -> En Proceso -> Terminado).
3.  El contador superior de cada columna se actualizará automáticamente.
4.  Elimina tareas haciendo clic en la "×" que aparece al pasar el cursor sobre ellas.

---
© 2026 TaskFlow | Proyecto práctico de Frontend Fundamentals con React.
