# Frontend — NN Auth System

> Guía pedagógica paso a paso: cómo se construyó el frontend del sistema de autenticación.
>
> **Para quién:** Aprendices SENA que leen este repositorio como complemento al video.
> **Objetivo:** Entender **cada decisión** de arquitectura, no solo copiar el código.

---

## Tabla de Contenidos

1. [Prerrequisitos](#1-prerrequisitos)
2. [Estructura del Frontend](#2-estructura-del-frontend)
3. [Instalación con pnpm](#3-instalación-con-pnpm)
4. [Variables de Entorno](#4-variables-de-entorno)
5. [Configuración Base](#5-configuración-base)
6. [Estilos Globales – TailwindCSS + Tema](#6-estilos-globales--tailwindcss--tema)
7. [Punto de Entrada – `main.tsx`](#7-punto-de-entrada--maintsx)
8. [Enrutamiento – `App.tsx`](#8-enrutamiento--apptsx)
9. [Tipos TypeScript – `types/auth.ts`](#9-tipos-typescript--typesauthts)
10. [Capa API – Axios + Funciones de Auth](#10-capa-api--axios--funciones-de-auth)
11. [Contexto de Autenticación](#11-contexto-de-autenticación)
12. [Hook `useAuth`](#12-hook-useauth)
13. [Componentes UI Base](#13-componentes-ui-base)
14. [Componente DataTable](#14-componente-datatable)
15. [Layouts y Rutas Protegidas](#15-layouts-y-rutas-protegidas)
16. [Páginas](#16-páginas)
17. [Tests – Vitest + Testing Library](#17-tests--vitest--testing-library)
18. [Comandos del Día a Día](#18-comandos-del-día-a-día)
19. [Glosario Rápido](#19-glosario-rápido)

---

## 1. Prerrequisitos

Antes de tocar código, asegúrate de tener instalado:

| Herramienta | Versión mínima | Verificar con    |
| ----------- | -------------- | ---------------- |
| Node.js     | 20 LTS         | `node --version` |
| pnpm        | 9+             | `pnpm --version` |

### ¿Por qué pnpm y no npm?

`pnpm` (Performant NPM) instala paquetes de forma eficiente:

- A diferencia de `npm`, los paquetes se guardan en un almacén central y se **enlazan** al proyecto.
- Esto reduce el espacio en disco y acelera las instalaciones.
- En este proyecto usamos `pnpm` **siempre**. Si ves instrucciones con `npm install`, tradúcelas a `pnpm install`.

```bash
# Si no tienes pnpm, instalarlo con npm (única excepción permitida):
npm install -g pnpm

# Verificar instalación:
pnpm --version
```

> **Regla del proyecto:** Nunca usar `npm install`, `npm run`, `yarn`, ni `npx` directamente.
> Usar siempre el equivalente `pnpm`:
>
> | Comando npm     | Equivalente pnpm     |
> | --------------- | -------------------- |
> | `npm install`   | `pnpm install`       |
> | `npm run dev`   | `pnpm dev`           |
> | `npm test`      | `pnpm test`          |
> | `npx some-tool` | `pnpm dlx some-tool` |

---

## 2. Estructura del Frontend

```
fe/
├── index.html                  ← HTML base que carga Vite
├── package.json                ← Dependencias y scripts
├── pnpm-lock.yaml              ← Lockfile determinístico
├── vite.config.ts              ← Vite + plugins + Vitest
├── tsconfig.json               ← TypeScript base
├── tsconfig.app.json           ← TypeScript para el código de la app
├── tsconfig.node.json          ← TypeScript para vite.config.ts
├── eslint.config.js            ← Linter (ESLint 9 flat config)
└── src/
    ├── main.tsx                ← Punto de entrada: monta React en el DOM
    ├── App.tsx                 ← Componente raíz: rutas + providers
    ├── index.css               ← Estilos globales + TailwindCSS
    ├── vite-env.d.ts           ← Tipos de Vite (import.meta.env)
    │
    ├── types/
    │   └── auth.ts             ← Interfaces TypeScript de toda la app
    │
    ├── api/
    │   ├── axios.ts            ← Instancia Axios + interceptores
    │   └── auth.ts             ← Funciones HTTP por endpoint
    │
    ├── context/
    │   ├── authContextDef.ts   ← Crea el Context (separado del Provider)
    │   └── AuthContext.tsx     ← Provider: estado + acciones de auth
    │
    ├── hooks/
    │   └── useAuth.ts          ← Hook público para consumir el contexto
    │
    ├── components/
    │   ├── ProtectedRoute.tsx  ← Guarda rutas privadas
    │   ├── ui/                 ← Componentes reutilizables atómicos
    │   │   ├── Button.tsx
    │   │   ├── InputField.tsx
    │   │   ├── Alert.tsx
    │   │   ├── ThemeToggle.tsx
    │   │   └── DataTable.tsx
    │   └── layout/             ← Estructuras de página completa
    │       ├── AuthLayout.tsx  ← Layout para páginas sin sesión
    │       ├── AppLayout.tsx   ← Layout para páginas con sesión
    │       └── Navbar.tsx      ← Barra de navegación superior
    │
    ├── pages/                  ← Una página por ruta
    │   ├── LoginPage.tsx
    │   ├── RegisterPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── ChangePasswordPage.tsx
    │   ├── ForgotPasswordPage.tsx
    │   ├── ResetPasswordPage.tsx
    │   └── DataTableDemoPage.tsx
    │
    └── __tests__/              ← Tests ordenados por tipo
        ├── setup.ts            ← Configuración global de Vitest
        ├── helpers.tsx         ← Utilidades y mocks compartidos
        ├── hooks/
        ├── components/
        └── pages/
```

### ¿Por qué esta estructura?

Cada carpeta tiene una única responsabilidad:

- **`types/`** — Los contratos de datos. Definen qué forma tienen los objetos. Nada más.
- **`api/`** — La comunicación HTTP. Sabe de la API, ignora la UI.
- **`context/` + `hooks/`** — El estado global. Sabe de los datos, ignora cómo se renderizan.
- **`components/`** — Los bloques visuales. Saben de la UI, reciben datos como props.
- **`pages/`** — La orquestación. Combina hooks + componentes para cada pantalla.

Esto se conoce como **Separation of Concerns** (separación de responsabilidades): cada módulo tiene un solo motivo para cambiar.

---

## 3. Instalación con pnpm

### Paso 1 — Posicionarse en la carpeta del frontend

```bash
cd proyecto-be-fe/fe
```

### Paso 2 — Instalar dependencias

```bash
pnpm install
```

Esto lee `package.json` e instala todo en `node_modules/`, usando `pnpm-lock.yaml` para versiones exactas.

### Paso 3 — Arrancar el servidor de desarrollo

```bash
pnpm dev
```

Vite arrancará en `http://localhost:5173`.

> **¿Qué es Vite?** Es el bundler (empaquetador) del proyecto. En desarrollo sirve los archivos
> de forma ultrarrápida aprovechando ES Modules nativos del navegador. En producción genera
> archivos optimizados (minificados, tree-shaken) listos para un hosting.

---

## 4. Variables de Entorno

### ¿Por qué variables de entorno?

En este proyecto el frontend necesita saber la URL del backend. Esa URL cambia entre
desarrollo (`http://localhost:8000`) y producción (`https://api.mi-empresa.com`).
Si la URL estuviera hardcodeada en el código, habría que modificar el código fuente
para cada entorno. Las variables de entorno resuelven eso.

### Prefijo `VITE_`

Vite expone al código frontend **solo** las variables que empiezan con `VITE_`.
Otras variables del archivo `.env` quedan invisibles al navegador (por seguridad).

```bash
# ¿Cómo se usa en el código?
import.meta.env.VITE_API_URL
```

### Crear el archivo `.env`

```bash
# fe/.env  (NO versionar este archivo en git)
VITE_API_URL=http://localhost:8000
```

El proyecto ya tiene un `.env.example` como plantilla:

```bash
# fe/.env.example
VITE_API_URL=http://localhost:8000
```

> **Regla de seguridad:** El archivo `.env` está en `.gitignore` y **nunca** se sube al
> repositorio. `.env.example` sí se versiona — sirve para que cualquier colaborador sepa
> qué variables configurar sin ver los valores reales.

---

## 5. Configuración Base

### `vite.config.ts` — Bundler y tests

```typescript
/**
 * Archivo: vite.config.ts
 * Descripción: Configuración de Vite — plugins, alias de paths y configuración de Vitest.
 * ¿Para qué? Decirle a Vite cómo procesar el proyecto y cómo ejecutar los tests.
 * ¿Impacto? Sin esta configuración Vite no sabría transformar JSX, TypeScript ni TailwindCSS.
 */
/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(), // Transforma JSX/TSX y activa Fast Refresh (recarga sin perder estado)
    tailwindcss(), // Integra TailwindCSS v4 directamente como plugin de Vite
  ],
  resolve: {
    alias: {
      // Alias @/ apunta a src/ — evita imports relativos como ../../../components/Button
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: false, // No abrir el navegador automáticamente
  },
  test: {
    globals: true, // it/describe/expect sin importar
    environment: "jsdom", // Simula el DOM del navegador
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/__tests__/setup.ts", "src/main.tsx", "src/vite-env.d.ts", "src/types/**"],
    },
  },
});
```

**Puntos clave:**

1. **`/// <reference types="vitest" />`** — Esta directiva le dice a TypeScript que incluya los
   tipos de Vitest (`describe`, `it`, `expect`, etc.) sin necesidad de importarlos en cada test.

2. **Alias `@/`** — En lugar de escribir `"../../../components/ui/Button"`, se escribe
   `"@/components/ui/Button"`. Más legible y resistente a reorganizaciones de carpetas.

3. **`environment: "jsdom"`** — Los tests de React necesitan simular un navegador.
   `jsdom` es una implementación de las APIs del navegador en Node.js (donde corren los tests).

### `tsconfig.app.json` — TypeScript estricto

```json
{
  "compilerOptions": {
    "strict": true, // Activa 8 reglas de seguridad (noImplicitAny, strictNullChecks, etc.)
    "noUncheckedIndexedAccess": true, // arr[n] puede ser undefined — TypeScript lo advierte
    "paths": {
      "@/*": ["./src/*"] // Mismo alias que en vite.config.ts
    }
  }
}
```

> **¿Por qué `"strict": true`?** En modo estricto, TypeScript se convierte en un aliado que
> detecta errores antes de que lleguen al navegador. Por ejemplo, no permitirá usar una variable
> que podría ser `null` sin verificarla antes. Al principio parece molesto, a largo plazo evita
> bugs de producción.

---

## 6. Estilos Globales – TailwindCSS + Tema

### `src/index.css`

```css
/**
 * Archivo: index.css
 * Descripción: Estilos globales de la aplicación.
 * ¿Para qué? Cargar TailwindCSS y definir variables del tema personalizado.
 * ¿Impacto? Sin este archivo, ninguna clase utilitaria de Tailwind funcionaría.
 */

@import "tailwindcss";

@theme {
  /* Fuente principal: Inter (sans-serif). Regla del proyecto: nunca fuentes serif */
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
}

@layer base {
  /* Borde por defecto en modo claro */
  *,
  *::before,
  *::after {
    border-color: theme(--color-gray-200);
  }

  html {
    font-family: theme(--font-sans);
    -webkit-font-smoothing: antialiased; /* Mejora legibilidad en macOS */
    -moz-osx-font-smoothing: grayscale;
  }

  /* Color de fondo y texto según tema (claro / oscuro) */
  body {
    @apply bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100;
    @apply min-h-screen antialiased;
    @apply transition-colors duration-200; /* Transición suave al cambiar tema */
    margin: 0;
  }

  /* Bordes más oscuros en modo oscuro */
  .dark *,
  .dark *::before,
  .dark *::after {
    border-color: theme(--color-gray-700);
  }
}
```

### TailwindCSS v4 — diferencias clave respecto a v3

TailwindCSS v4 cambió la forma de integrarse con bundlers:

| Característica     | v3                                                           | v4                               |
| ------------------ | ------------------------------------------------------------ | -------------------------------- |
| Importación        | `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";`         |
| Configuración tema | `tailwind.config.js`                                         | `@theme` en el CSS               |
| Plugin de Vite     | Postcss separado                                             | `@tailwindcss/vite` (automático) |
| Archivo config     | Obligatorio                                                  | Opcional (todo en CSS)           |

> En v4 ya **no existe** `tailwind.config.js`. Toda la personalización del tema va en el
> bloque `@theme` dentro del archivo CSS.

### Fuente Inter — carga desde Google Fonts

La fuente se declara en el CSS pero debe **cargarse** desde Google Fonts. En `index.html`:

```html
<!-- Preconexa con los servidores de Google (reduce latencia DNS) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Carga Inter en 4 grosores (Regular, Medium, SemiBold, Bold) -->
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

> **`display=swap`** hace que el texto sea visible inmediatamente con una fuente del sistema
> mientras Inter carga en segundo plano. Sin esto, habría un "flash" de texto invisible.

### Dark Mode

El tema oscuro funciona con la clase CSS `dark` en el elemento `<html>`:

```html
<html class="dark">
  <!-- Tema oscuro activo -->
  <html>
    <!-- Tema claro (sin clase) -->
  </html>
</html>
```

TailwindCSS genera variantes `dark:` que aplican cuando esa clase está presente.
El componente `ThemeToggle` gestiona esta clase (ver sección 13).

---

## 7. Punto de Entrada – `main.tsx`

```typescript
/**
 * Archivo: main.tsx
 * Descripción: Punto de entrada de la aplicación React.
 * ¿Para qué? Monta el árbol de componentes React en el elemento #root del DOM.
 * ¿Impacto? Sin este archivo, React no se inicializaría y la pantalla quedaría en blanco.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";   // Carga TailwindCSS y estilos globales
import App from "./App";

// ¿Qué? Obtiene el div#root de index.html y crea la raíz React.
// ¿Para qué? createRoot() es la API moderna (React 18+) para renderizar.
// ¿Impacto? La exclamación (!) le dice a TypeScript "confío en que este elemento existe".
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### El `index.html` que referencia `main.tsx`

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Carga de fuente Inter desde Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <title>NN Auth System</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- Vite transforma este script en tiempo de desarrollo -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

> **¿Por qué un solo `<div id="root">`?** React toma control completo de ese elemento.
> Todo lo que el usuario ve es generado por el árbol de componentes React, no por HTML estático.

### `StrictMode` — ¿para qué sirve?

`StrictMode` es una herramienta de desarrollo (no afecta producción) que:

- Renderiza los componentes **dos veces** para detectar efectos secundarios inesperados.
- Advierte sobre el uso de APIs obsoletas de React.
- Ayuda a preparar el código para futuras versiones de React.

> Si en desarrollo ves que `useEffect` se ejecuta dos veces, es `StrictMode` en acción — es
> intencional y señal de que tu código funciona correctamente.

---

## 8. Enrutamiento – `App.tsx`

```typescript
/**
 * Archivo: App.tsx
 * Descripción: Componente raíz — define el enrutamiento y los providers globales.
 * ¿Para qué? Centralizar la estructura de rutas y envolver la app con los contextos necesarios.
 * ¿Impacto? Sin App.tsx, no habría navegación ni acceso al estado de autenticación global.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
// ... imports de páginas ...

function App() {
  return (
    <BrowserRouter>           {/* Habilita la navegación basada en la URL del navegador */}
      <AuthProvider>          {/* Provee el estado de auth a toda la app */}
        <Routes>
          {/* ─── RUTAS PÚBLICAS (sin sesión requerida) ─── */}
          <Route path="/login"            element={<LoginPage />} />
          <Route path="/register"         element={<RegisterPage />} />
          <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
          <Route path="/reset-password"   element={<ResetPasswordPage />} />
          <Route path="/demo/datatable"   element={<DataTableDemoPage />} />

          {/* ─── RUTAS PROTEGIDAS (requieren sesión) ─── */}
          {/*
            La clave: ProtectedRoute envuelve AppLayout.
            Si el usuario no está autenticado, ProtectedRoute redirige a /login.
            Si está autenticado, AppLayout renderiza Navbar + <Outlet />.
            <Outlet /> es donde React Router inserta la ruta hija activa.
          */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard"        element={<DashboardPage />} />
            <Route path="/change-password"  element={<ChangePasswordPage />} />
          </Route>

          {/* Redirigen / y cualquier ruta desconocida a /login */}
          <Route path="/"  element={<Navigate to="/login" replace />} />
          <Route path="*"  element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### El patrón Layout Route

La estructura de rutas protegidas usa un patrón de React Router v7 llamado **Layout Route**:

```
Route (element=<ProtectedRoute><AppLayout /></ProtectedRoute>)
├── Route path="/dashboard"       element=<DashboardPage />
└── Route path="/change-password" element=<ChangePasswordPage />
```

Cuando el usuario navega a `/dashboard`:

1. React Router evalúa la ruta padre → `ProtectedRoute` verifica si hay sesión.
2. Si hay sesión → renderiza `AppLayout` (que incluye `Navbar`).
3. `AppLayout` tiene un `<Outlet />` → React Router inserta `DashboardPage` ahí.

> **Beneficio:** El `Navbar` se renderiza una sola vez en el padre y persiste al navegar
> entre `/dashboard` y `/change-password`, sin re-montarse en cada cambio de ruta.

### `replace` en `<Navigate>`

```typescript
<Navigate to="/login" replace />
```

El prop `replace` evita que la redirección quede en el historial de navegación. Sin él,
al presionar "Atrás" el usuario volvería a la ruta que causó la redirección (comportamiento
confuso). Con `replace`, la redirección reemplaza la entrada actual en el historial.

---

## 9. Tipos TypeScript – `types/auth.ts`

```typescript
/**
 * Archivo: types/auth.ts
 * Descripción: Tipos e interfaces TypeScript para el sistema de autenticación.
 * ¿Para qué? Definir los contratos de datos entre el frontend y el backend.
 * ¿Impacto? Sin estos tipos, TypeScript no puede verificar que los datos tienen
 * la forma correcta en tiempo de compilación — los errores se descubrirían en runtime.
 */

// ── Tipos de REQUEST (lo que el frontend envía al backend) ────────────────

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

// ── Tipos de RESPONSE (lo que el backend responde) ────────────────────────

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface MessageResponse {
  message: string;
}

// ── Tipos internos del frontend ───────────────────────────────────────────

export interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}
```

### Convenciones de nombrado

- **Sufijo `Request`** — Objetos que el frontend envía al backend.
- **Sufijo `Response`** — Objetos que el backend devuelve al frontend.
- `interface` para objetos con estructura fija, `type` para uniones/intersecciones.
- Los campos siguen el `snake_case` del backend (`full_name`, `created_at`) para que
  la desestructuración de la respuesta HTTP sea directa sin transformación.

> **¿Por qué `string | null`?** En el estado inicial de la app el usuario no está
> autenticado, así que no hay usuario ni tokens. `null` representa "ausencia de valor"
> de forma explícita — más claro que usar `undefined` o cadenas vacías.

---

## 10. Capa API – Axios + Funciones de Auth

La capa API está dividida en dos archivos con responsabilidades distintas:

- **`axios.ts`** — Configura el cliente HTTP (URL, headers, interceptores).
- **`auth.ts`** — Define las funciones para cada endpoint específico.

### `api/axios.ts` — Instancia configurada con interceptores

```typescript
/**
 * Archivo: api/axios.ts
 * Descripción: Instancia de Axios con configuración base e interceptores.
 * ¿Para qué? Centralizar la configuración HTTP — URL base, headers, manejo de errores.
 * ¿Impacto? Sin este archivo, cada llamada HTTP definiría su propia configuración,
 * resultando en inconsistencias y código duplicado.
 */

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 segundos máx — evita esperas eternas
});

// ── Interceptor de REQUEST: inyecta el JWT automáticamente ───────────────
// ¿Qué? Antes de enviar CADA petición, lee el token del sessionStorage.
// ¿Para qué? Evitar que cada función en auth.ts tenga que agregar el header manualmente.
// ¿Impacto? Si se omite, los endpoints protegidos recibirán 401 Unauthorized.
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Interceptor de RESPONSE: normaliza los mensajes de error ─────────────
// ¿Qué? Transforma los errores de FastAPI en mensajes legibles para el usuario.
// ¿Para qué? FastAPI/Pydantic devuelve errores en formato { detail: "..." } o
// { detail: [{ msg: "..." }, ...] } en validaciones. El interceptor los convierte
// en strings simples que pueden mostrarse en un <Alert>.
// ¿Impacto? Sin esto, las páginas mostrarían "[object Object]" como mensaje de error.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const data = error.response.data;
      if (error.response.status === 422 && Array.isArray(data.detail)) {
        // Error de validación Pydantic: array de objetos con msg
        const messages = data.detail.map((err: { msg: string }) => err.msg);
        error.message = messages.join(". ");
      } else if (typeof data.detail === "string") {
        error.message = data.detail;
      }
    } else if (error.request) {
      error.message = "No se pudo conectar con el servidor";
    }
    return Promise.reject(error);
  },
);

export default api;
```

> **¿Por qué `sessionStorage` y no `localStorage`?**
>
> - `sessionStorage`: vive mientras la pestaña está abierta (más seguro).
> - `localStorage`: persiste días/semanas, mayor superficie de ataque.
> - Para tokens cortos (15 min), `sessionStorage` es el balance adecuado.
> - En producción con alta seguridad: usar cookies `HttpOnly` (no accesibles desde JS).

### `api/auth.ts` — Una función por endpoint

```typescript
/**
 * Archivo: api/auth.ts
 * Descripción: Funciones cliente HTTP para cada endpoint del backend.
 * ¿Para qué? Encapsular las llamadas HTTP con nombres descriptivos.
 * ¿Impacto? Las páginas no necesitan conocer las URLs ni los métodos HTTP.
 */

const AUTH_PREFIX = "/api/v1/auth";
const USERS_PREFIX = "/api/v1/users";

export async function registerUser(data: RegisterRequest): Promise<UserResponse> {
  const response = await api.post<UserResponse>(`${AUTH_PREFIX}/register`, data);
  return response.data;
}

export async function loginUser(data: LoginRequest): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>(`${AUTH_PREFIX}/login`, data);
  return response.data;
}

export async function changePassword(data: ChangePasswordRequest): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(`${AUTH_PREFIX}/change-password`, data);
  return response.data;
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(`${AUTH_PREFIX}/forgot-password`, data);
  return response.data;
}

export async function resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(`${AUTH_PREFIX}/reset-password`, data);
  return response.data;
}

export async function getMe(): Promise<UserResponse> {
  const response = await api.get<UserResponse>(`${USERS_PREFIX}/me`);
  return response.data;
}
```

> El tipo genérico `api.post<UserResponse>(...)` le dice a TypeScript qué forma tiene
> `response.data`. Sin ese tipo genérico, TypeScript inferiría `any`, perdiendo la
> seguridad de tipos en todo el código que consume estas funciones.

---

## 11. Contexto de Autenticación

El estado de sesión (usuario, tokens, cargando) necesita ser compartido por toda la
aplicación. React Context API es la solución nativa de React para este patrón.

### ¿Por qué dos archivos?

```
context/
├── authContextDef.ts   ← Solo crea el Context con createContext()
└── AuthContext.tsx     ← Provider con estado, efectos y acciones
```

**Razón técnica:** React Fast Refresh (el HMR de Vite) exige que los archivos que exportan
componentes no exporten otras cosas al mismo nivel. Como `AuthProvider` es un componente y
`AuthContext` no lo es, se separan para evitar advertencias durante el desarrollo.

### `context/authContextDef.ts`

```typescript
import { createContext } from "react";
import type { AuthContextType } from "@/types/auth";

// El default es undefined — obliga a consumirlo dentro de <AuthProvider>.
// Si alguien usa useAuth() fuera del Provider, el valor será undefined
// y el hook puede detectarlo y lanzar un error descriptivo.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

### `context/AuthContext.tsx` — El Provider (resumen estructural)

```typescript
export function AuthProvider({ children }: AuthProviderProps) {
  // Estado: usuario, tokens, indicador de carga
  const [user, setUser] = useState<UserResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    () => sessionStorage.getItem("access_token"),  // Inicializar desde sessionStorage
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = !!user && !!accessToken;

  // useCallback: memoiza para evitar re-renders innecesarios en hijos
  const saveTokens = useCallback((access: string, refresh: string) => {
    sessionStorage.setItem("access_token", access);
    sessionStorage.setItem("refresh_token", refresh);
    setAccessToken(access);
  }, []);

  const clearAuth = useCallback(() => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    setUser(null);
    setAccessToken(null);
  }, []);

  // Al montar: verificar si el token guardado sigue siendo válido
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = sessionStorage.getItem("access_token");
      if (!storedToken) { setIsLoading(false); return; }
      try {
        const userData = await authApi.getMe();  // GET /me con el token guardado
        setUser(userData);
      } catch {
        clearAuth();  // Token expirado — limpiar silenciosamente
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, [clearAuth]);

  const login = useCallback(async (data: LoginRequest) => {
    const tokens = await authApi.loginUser(data);
    saveTokens(tokens.access_token, tokens.refresh_token);
    const userData = await authApi.getMe();
    setUser(userData);
  }, [saveTokens]);

  // Registro + auto-login: mejor UX (el usuario queda autenticado de inmediato)
  const register = useCallback(async (data: RegisterRequest) => {
    await authApi.registerUser(data);
    await login({ email: data.email, password: data.password });
  }, [login]);

  // useMemo: evita recrear el objeto value (y sus referencias) en cada render
  const value = useMemo<AuthContextType>(() => ({
    user, accessToken, refreshToken, isAuthenticated, isLoading,
    login, register, logout: clearAuth,
    changePassword: async (d) => { await authApi.changePassword(d); },
    forgotPassword: async (d) => { await authApi.forgotPassword(d); },
    resetPassword:  async (d) => { await authApi.resetPassword(d);  },
  }), [user, accessToken, refreshToken, isAuthenticated, isLoading,
       login, register, clearAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### Flujo de inicialización al cargar la app

```
AuthProvider monta
  ↓ isLoading = true          → ProtectedRoute muestra spinner
  ↓ Lee sessionStorage
  ↓ Si hay token → GET /me
      → 200 OK  → setUser(data)    → sesión restaurada
      → 401/err → clearAuth()      → sesión expirada, volver al login
  ↓ isLoading = false         → ProtectedRoute decide redirigir o mostrar la ruta
```

Sin este flujo, recargar la página causaría un redireccionamiento innecesario al login,
incluso con una sesión válida.

---

## 12. Hook `useAuth`

```typescript
/**
 * Archivo: hooks/useAuth.ts
 * Descripción: Hook público que abstrae el consumo del contexto de auth.
 * ¿Para qué? Proveer una interfaz limpia y validada al contexto de autenticación.
 * ¿Impacto? Sin este hook, cada componente tendría que importar AuthContext
 * y gestionar el caso undefined manualmente.
 */

import { useContext } from "react";
import { AuthContext } from "@/context/authContextDef";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  // Validación defensiva: si se usa fuera de AuthProvider, el error es descriptivo
  if (context === undefined) {
    throw new Error(
      "useAuth debe usarse dentro de un AuthProvider. " +
        "Verifica que <AuthProvider> envuelve el componente que llama useAuth().",
    );
  }

  return context;
}
```

### Uso en cualquier componente

```typescript
// Dentro del árbol de <AuthProvider>:
function DashboardPage() {
  const { user, logout } = useAuth();
  return <h1>Hola, {user?.full_name}</h1>;
}
```

> Este es el patrón **Custom Hook** de React. La ventaja es que los componentes no
> saben que debajo hay un Context — solo llaman al hook. Si en el futuro se cambia
> la implementación (p.ej. usar Zustand), solo cambia `useAuth.ts`, no los consumidores.

---

## 13. Componentes UI Base

Los componentes en `components/ui/` son **atómicos**: pequeños, reutilizables y
sin lógica de negocio. Solo reciben props y renderizan UI.

### `Button.tsx` — Variantes y estado de carga

```typescript
interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
```

Puntos de implementación:

- **Tres variantes** con colores distintos para indicar intención (acción principal,
  acción secundaria, acción destructiva).
- **`isLoading`:** Muestra un spinner SVG animado (`animate-spin`) y deshabilita el botón.
- **`aria-busy={isLoading}`:** Comunica el estado a lectores de pantalla (WCAG 4.1.3).
- **Regla de diseño:** Los botones de acción van siempre a la derecha:
  ```typescript
  <div className="flex justify-end gap-3">
    <Button variant="secondary">Cancelar</Button>
    <Button type="submit" isLoading={loading}>Guardar</Button>
  </div>
  ```

### `InputField.tsx` — Input accesible con toggle de contraseña

```typescript
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  error?: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  icon?: ReactNode; // Ícono a la izquierda (ej: <Mail />)
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

Puntos de accesibilidad:

- `<label htmlFor={name}>` vinculado a `<input id={name}>` (WCAG 1.3.1 — Info y relaciones).
- `aria-invalid={!!error}` comunica el estado de error al lector de pantalla.
- `aria-describedby={name + "-error"}` vincula el mensaje de error al campo.
- Para `type="password"`: botón de toggle con `aria-label` dinámico ("Mostrar/Ocultar contraseña").
- Ícono decorativo con `aria-hidden="true"` — no aporta información, no debe leerse.

### `Alert.tsx` — Feedback al usuario

```typescript
interface AlertProps {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
}
```

- `role="alert"` — Los lectores de pantalla anuncian el contenido automáticamente.
- Tres variantes: verde (éxito), rojo (error), azul (información).
- Si se provee `onClose`, aparece un botón `×` con `aria-label="Cerrar alerta"`.
- Íconos SVG con `aria-hidden="true"` — puramente decorativos.

### `ThemeToggle.tsx` — Alternancia de tema

Implementado con un custom hook interno `useTheme`:

```typescript
function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark"; // Preferencia guardada del usuario
    return window.matchMedia("(prefers-color-scheme: dark)").matches; // Fallback del OS
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark"); // Activa variantes dark: de Tailwind
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((prev) => !prev) };
}
```

> **`prefers-color-scheme`** es una media query que lee la preferencia del sistema operativo.
> Se usa como valor inicial — si el usuario cambia el tema manualmente, `localStorage`
> tiene prioridad en la próxima carga. Así se respeta tanto la preferencia del OS como
> la elección explícita del usuario.

---

## 14. Componente DataTable

`DataTable.tsx` es el componente más complejo del proyecto (~1220 líneas). Implementa
una tabla de datos completa con búsqueda, ordenación, paginación, menú de acciones y
exportación a CSV/PDF.

### Interfaces públicas

```typescript
// Definición de columna — qué campo mostrar y cómo renderizarlo
export interface ColumnDef<T> {
  key: string; // Soporta dot-notation para campos anidados: "address.city"
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T, rowIndex: number) => ReactNode; // Renderizador custom
}

// Acción en el menú de cada fila
export interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  variant?: "default" | "danger";
  disabled?: (row: T) => boolean; // Función para deshabilitar condicionalmente
}

export interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  actions?: RowAction<T>[];
  pageSize?: number; // Default: 10
  pageSizeOptions?: number[]; // Default: [5, 10, 25, 50]
  searchable?: boolean; // Default: true
  emptyMessage?: string;
  isLoading?: boolean; // Muestra skeleton (filas grises animadas)
  caption?: string; // <caption> para accesibilidad
  exportable?: boolean; // Habilita botones CSV / PDF
  exportFilename?: string;
}
```

### Funcionalidades implementadas

| Funcionalidad    | Implementación                                                           |
| ---------------- | ------------------------------------------------------------------------ |
| Búsqueda global  | Filtra todos los campos (incluye valores anidados via dot-notation)      |
| Ordenación       | Click en encabezado: asc → desc → asc. `useMemo` para eficiencia         |
| Paginación       | Selector de tamaño + navegación con puntos suspensivos (`…`)             |
| Menú de acciones | `MoreVertical` button + menú `role="menu"`, cierra con `useClickOutside` |
| Loading skeleton | Filas de gris animado cuando `isLoading=true`                            |
| Exportar CSV     | `Blob` nativo → `<a href download>` — no requiere librería               |
| Exportar PDF     | `jsPDF` + `jspdf-autotable`                                              |

### Accesibilidad de la tabla

- `aria-sort="ascending|descending|none"` en columnas ordenables (WCAG 1.3.1).
- `role="searchbox"` + `aria-label` en el campo de búsqueda.
- `role="navigation"` + `aria-label="Paginación"` en controles de paginación.
- `<caption>` opcional para describir la tabla a lectores de pantalla.
- `role="menu"` + `role="menuitem"` en el menú de acciones.

### Uso básico

```typescript
const columns: ColumnDef<User>[] = [
  { key: "full_name", header: "Nombre", sortable: true },
  { key: "email",     header: "Email",  sortable: true },
  {
    key: "is_active",
    header: "Estado",
    render: (value) => (
      <span className={value ? "text-green-600" : "text-red-600"}>
        {value ? "Activo" : "Inactivo"}
      </span>
    ),
  },
];

<DataTable
  data={users}
  columns={columns}
  caption="Lista de usuarios registrados"
  exportable
  exportFilename="usuarios"
  isLoading={isLoading}
/>
```

---

## 15. Layouts y Rutas Protegidas

### `components/layout/AuthLayout.tsx`

Layout para páginas que no requieren sesión (login, registro, recuperación).

```typescript
/**
 * ¿Qué? Layout centrado para formularios de autenticación.
 * ¿Para qué? Proveer diseño consistente sin duplicar el centrado en cada página.
 * ¿Impacto? Sin este layout, LoginPage y RegisterPage tendrían CSS duplicado.
 */
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string; // Título dentro de la tarjeta
  subtitle?: string; // Descripción opcional debajo del título
}
```

Estructura visual:

```
┌─────────────────────────────────┐
│ [ThemeToggle]          (esquina) │
│                                  │
│         NN Auth                  │  ← Logo/nombre
│                                  │
│  ┌─────────────────────────┐    │
│  │  {title}                │    │  ← Tarjeta blanca
│  │  {subtitle}             │    │
│  │                         │    │
│  │  {children}             │    │  ← Formulario
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

- `<main>` con landmark semántico (WCAG 2.4.1 — Bypass Blocks).
- `w-full max-w-md` — ancho máximo en desktop, 100% en mobile (mobile-first).

### `components/layout/AppLayout.tsx`

Layout para páginas autenticadas con Navbar.

```typescript
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      {/* <Outlet /> inserta la página hija activa (Dashboard, ChangePassword, etc.) */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
```

### `components/layout/Navbar.tsx`

```typescript
/**
 * ¿Qué? Barra de navegación superior con logo, nombre del usuario y botón de logout.
 * ¿Para qué? Navegación consistente en todas las páginas autenticadas.
 * ¿Impacto? aria-label en <nav> es necesario — hay múltiples <nav> posibles (WCAG 2.4.1).
 */
export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();              // Limpia sessionStorage y el estado de auth
    navigate("/login");    // Redirige al login
  };

  return (
    <nav aria-label="Navegación principal"
      className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Logo — navega a dashboard si autenticado, login si no */}
      <Link to={isAuthenticated ? "/dashboard" : "/login"}>NN Auth</Link>

      {/* Nombre del usuario (oculto en mobile) + ThemeToggle + botón de salida */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {isAuthenticated && user && (
          <>
            <span className="hidden sm:block">{user.full_name}</span>
            <button onClick={handleLogout}>
              <LogOut aria-hidden="true" /> Salir
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
```

### `components/ProtectedRoute.tsx`

```typescript
/**
 * ¿Qué? Componente de ruta que redirige al login si no hay sesión.
 * ¿Para qué? Centralizar la lógica de protección en un solo lugar.
 * ¿Impacto? Sin este componente, cualquier usuario podría acceder al dashboard.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Mientras el AuthProvider verifica el token guardado: mostrar spinner
  // role="status" + aria-live="polite" — WCAG 4.1.3
  if (isLoading) {
    return (
      <div role="status" aria-live="polite" aria-label="Verificando sesión, por favor espera">
        {/* Spinner SVG animado */}
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no está autenticado: redirigir sin dejar rastro en el historial
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

---

## 16. Páginas

Cada página en `pages/` sigue el mismo patrón:

1. Obtiene acciones del contexto con `useAuth()`.
2. Gestiona estado local: `formData`, `error`, `isLoading`.
3. Valida inputs en el cliente antes de llamar a la API.
4. Muestra `<Alert>` para éxito o error.
5. Navega con `useNavigate()` en caso de éxito cuando corresponde.

### `LoginPage.tsx`

```typescript
// Campos: email + password
// En éxito: navigate("/dashboard", { replace: true })
// Error: se muestra en <Alert type="error"> y se limpia al escribir

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  setError(null); // Limpiar error al escribir — mejor UX
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    await login(formData);
    navigate("/dashboard", { replace: true });
  } catch (err) {
    setError(err instanceof Error ? err.message : "Error al iniciar sesión");
  } finally {
    setIsLoading(false);
  }
};
```

### `RegisterPage.tsx`

```typescript
// Campos: nombre completo, email, contraseña, confirmar contraseña
// Validación cliente (función validate()):
//   - nombre: mínimo 2 caracteres
//   - password: ≥8 chars, ≥1 mayús, ≥1 minús, ≥1 número
//   - confirmPassword: debe coincidir con password
// En éxito: register() llama auto-login → navigate("/dashboard")
// Los errores se muestran bajo cada campo (InputField.error prop)
```

### `DashboardPage.tsx`

```typescript
// Muestra tarjeta de perfil del usuario autenticado:
//   - Nombre completo
//   - Email
//   - Estado: badge verde "Activo" / rojo "Inactivo" según is_active
//   - Fecha de registro: toLocaleDateString("es-CO", { año/mes/día largo })
//
// Botón "Cambiar contraseña" → Link to="/change-password"
// Alineado a la derecha (justify-end) — regla del proyecto
```

### `ChangePasswordPage.tsx`

```typescript
// Campos: contraseña actual, nueva contraseña, confirmar nueva contraseña
// Mismas reglas de validación que el registro para la nueva contraseña
// En éxito:
//   - Muestra Alert success
//   - Resetea el formulario (todos los campos vacíos)
// Botones: Cancelar (Link to="/dashboard") + Guardar (submit) — derecha

// Patrón de éxito — sin redirección automática (el usuario puede seguir viendo el mensaje)
const [success, setSuccess] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setIsLoading(true);
  try {
    await changePassword({ current_password, new_password });
    setSuccess(true);
    setFormData({ current_password: "", new_password: "", confirmPassword: "" });
  } catch (err) {
    setError(err instanceof Error ? err.message : "Error al cambiar contraseña");
  } finally {
    setIsLoading(false);
  }
};
```

### `ForgotPasswordPage.tsx`

```typescript
// Campo: solo email
// Siempre muestra mensaje de éxito genérico:
//   "Si el correo está registrado, recibirás un enlace en los próximos minutos."
// ¿Por qué genérico? Seguridad: evita revelar si un email está registrado o no.
// Este es un principio OWASP: mensajes de error no deben filtrar información de usuarios.

// Si forgotPassword() lanza error (p.ej. rate limit): se muestra en Alert error.
// Si tiene éxito: se muestra Alert success y se oculta el formulario.
```

### `ResetPasswordPage.tsx`

```typescript
// Lee el token del query string: const [searchParams] = useSearchParams()
// const token = searchParams.get("token")
//
// Caso 1 — Sin token en la URL:
//   Muestra Alert error: "Enlace inválido o expirado"
//   Link a /forgot-password para solicitar un nuevo enlace
//
// Caso 2 — Con token:
//   Campos: nueva contraseña + confirmar contraseña
//   En éxito:
//     - Oculta formulario
//     - Muestra Alert success
//     - Muestra botón "Ir al inicio de sesión"
```

---

## 17. Tests – Vitest + Testing Library

### Configuración global — `__tests__/setup.ts`

```typescript
// Se ejecuta antes de CADA archivo de tests

import "@testing-library/jest-dom/vitest"; // Matchers: toBeInTheDocument, toHaveValue, etc.
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Limpia el DOM después de cada test (evita contaminación entre tests)
afterEach(() => {
  cleanup();
});

// Mock de window.matchMedia — jsdom no lo implementa, ThemeToggle lo usa
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Limpiar storage después de cada test — aislamiento
afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});
```

> **¿Por qué mockear `window.matchMedia`?** jsdom (el entorno simulado de tests) no
> implementa todas las APIs del navegador real. `ThemeToggle` usa `window.matchMedia`
> para leer la preferencia del sistema — sin el mock, los tests lanzarían un error.

### Utilidades compartidas — `__tests__/helpers.tsx`

```typescript
// mockUser: datos de usuario de prueba consistentes
export const mockUser: UserResponse = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "test@nn-company.com",
  full_name: "Test User",
  is_active: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

// defaultAuthContext: todas las funciones como vi.fn() (espías de Vitest)
export const defaultAuthContext: AuthContextType = {
  user: null, accessToken: null, refreshToken: null,
  isAuthenticated: false, isLoading: false,
  login: vi.fn(), register: vi.fn(), logout: vi.fn(),
  changePassword: vi.fn(), forgotPassword: vi.fn(), resetPassword: vi.fn(),
};

// renderWithProviders: envuelve con MemoryRouter + AuthContext.Provider
// Evita repetir esta configuración en cada test
export function renderWithProviders(
  ui: ReactNode,
  { authContext = {}, initialRoute = "/" } = {},
) {
  const value = { ...defaultAuthContext, ...authContext };
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[initialRoute]}>
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      </MemoryRouter>
    );
  }
  return render(ui, { wrapper: Wrapper });
}
```

> **`MemoryRouter`** (en lugar de `BrowserRouter`) se usa en tests porque no depende
> de las APIs del navegador (`history`, `location`). Permite especificar la ruta inicial
> con `initialEntries`.

### Estructura de tests

```
__tests__/
├── hooks/
│   └── useAuth.test.tsx          — Error si se usa fuera de Provider; retorna contexto completo
├── components/
│   ├── Alert.test.tsx            — 5 tests: tipos, role=alert, cierre
│   ├── Button.test.tsx           — 8 tests: variantes, loading, disabled, w-full
│   ├── InputField.test.tsx       — 11 tests: label, error, aria, toggle password
│   ├── ThemeToggle.test.tsx      — 4 tests: render, toggle clase dark, localStorage
│   ├── ProtectedRoute.test.tsx   — 4 tests: spinner, redirige, renderiza, no muestra durante carga
│   └── DataTable.test.tsx        — ~60 tests: búsqueda, ordenación, paginación, acciones, export
└── pages/
    ├── LoginPage.test.tsx        — 7 tests
    ├── RegisterPage.test.tsx     — 6 tests
    ├── DashboardPage.test.tsx    — 6 tests
    ├── ChangePasswordPage.test.tsx — 7 tests
    ├── ForgotPasswordPage.test.tsx — 6 tests
    └── ResetPasswordPage.test.tsx  — 7 tests
```

**Total: 80 tests** — todos pasan.

### Ejemplo de test de página

```typescript
// LoginPage.test.tsx — patrón estándar
describe("LoginPage", () => {
  it("renderiza el formulario de login", () => {
    renderWithProviders(<LoginPage />, { initialRoute: "/login" });
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it("llama a login() con los datos del formulario", async () => {
    const mockLogin = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(<LoginPage />, { authContext: { login: mockLogin } });

    await userEvent.type(screen.getByLabelText(/correo/i), "test@test.com");
    await userEvent.type(screen.getByLabelText(/contraseña/i), "Password1");
    await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "Password1",
    });
  });

  it("muestra error cuando el login falla", async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error("Credenciales inválidas"));
    renderWithProviders(<LoginPage />, { authContext: { login: mockLogin } });

    await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Credenciales inválidas");
  });
});
```

### Comandos de testing

```bash
# Ejecutar todos los tests (modo ci, sin watch)
pnpm test

# Modo interactivo — re-ejecuta al guardar archivos
pnpm test:watch

# Con reporte de cobertura
pnpm test:coverage

# Un test específico
pnpm test -- --reporter=verbose LoginPage
```

---

## 18. Comandos del Día a Día

```bash
# ── Desarrollo ────────────────────────────────────────────────────────────
pnpm dev                # Arranca servidor de desarrollo en http://localhost:5173

# ── Tests ─────────────────────────────────────────────────────────────────
pnpm test               # Ejecuta todos los tests (sin watch)
pnpm test:watch         # Modo interactivo — ideal durante desarrollo
pnpm test:coverage      # Tests + reporte de cobertura

# ── Calidad de código ─────────────────────────────────────────────────────
pnpm lint               # ESLint — detecta problemas
pnpm format             # Prettier — formatea src/**/*.{ts,tsx,css,json}
pnpm format:check       # Prettier — verifica sin cambiar (útil en CI)

# ── Build de producción ───────────────────────────────────────────────────
pnpm build              # tsc -b && vite build → genera dist/
pnpm preview            # Sirve el build de dist/ localmente (preview local)
```

### Flujo completo de desarrollo

```bash
# 1. Asegurarse de estar en la carpeta fe/
cd proyecto-be-fe/fe

# 2. Instalar dependencias (solo la primera vez o al agregar paquetes)
pnpm install

# 3. Crear .env si no existe
cp .env.example .env

# 4. Arrancar backend en otra terminal (necesario para la API)
# cd ../be && source .venv/bin/activate && uvicorn app.main:app --reload

# 5. Arrancar frontend
pnpm dev

# 6. Durante el desarrollo: tests en modo interactivo
pnpm test:watch

# 7. Antes de hacer commit — verificar calidad
pnpm lint && pnpm format:check && pnpm test
```

### Verificación del sistema completo

Para probar el flujo de autenticación de principio a fin:

```bash
# Terminal 1 — Base de datos
docker compose up -d

# Terminal 2 — Backend
cd be && source .venv/bin/activate && uvicorn app.main:app --reload

# Terminal 3 — Frontend
cd fe && pnpm dev

# Flujo manual a probar en http://localhost:5173:
# 1. /register      → Crear cuenta nueva
# 2. /dashboard     → Ver perfil (auto-login después del registro)
# 3. /change-password → Cambiar contraseña
# 4. Logout         → Botón "Salir" en el navbar
# 5. /login         → Iniciar sesión con credenciales originales
# 6. /forgot-password → Solicitar recuperación (ver consola del backend por el token)
# 7. /reset-password?token=xxx → Restablecer contraseña
```

---

## 19. Glosario Rápido

| Término                   | Significado                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| **SPA**                   | Single Page Application — la app carga una vez y navega sin recargar la página                 |
| **Vite**                  | Bundler moderno que usa ES Modules nativos — más rápido que Webpack                            |
| **TSX**                   | TypeScript + JSX — archivos TypeScript que contienen sintaxis de React                         |
| **Context API**           | Sistema nativo de React para compartir estado entre componentes sin pasar props                |
| **Hook**                  | Función que empieza con `use` — permite usar estado y ciclo de vida en componentes funcionales |
| **Custom Hook**           | Hook creado por el programador que encapsula lógica reutilizable                               |
| **Interceptor**           | Función en Axios que se ejecuta antes/después de cada petición HTTP                            |
| **Layout Route**          | Ruta de React Router que envuelve rutas hijas con UI compartida (Navbar, Layout)               |
| **`<Outlet />`**          | Componente de React Router donde se renderiza la ruta hija activa                              |
| **sessionStorage**        | Almacenamiento del navegador que vive solo mientras la pestaña está abierta                    |
| **`useMemo`**             | Hook que memoiza un valor — lo recalcula solo si sus dependencias cambian                      |
| **`useCallback`**         | Hook que memoiza una función — evita recrearla en cada render                                  |
| **`vi.fn()`**             | Función espía de Vitest — permite verificar si fue llamada y con qué argumentos                |
| **`renderWithProviders`** | Utilidad de tests que envuelve componentes con los providers necesarios                        |
| **jsdom**                 | Implementación JavaScript del DOM del navegador — usada en los tests                           |
| **MemoryRouter**          | Router de React Router para tests — no depende del navegador real                              |
| **Tree-shaking**          | Eliminación automática de código no usado durante el build de producción                       |
| **`aria-*`**              | Atributos HTML para accesibilidad — comunican semántica a lectores de pantalla                 |
| **WCAG**                  | Web Content Accessibility Guidelines — estándar internacional de accesibilidad web             |
| **dot-notation**          | Acceso a propiedades anidadas con punto: `"address.city"` → `obj.address.city`                 |
