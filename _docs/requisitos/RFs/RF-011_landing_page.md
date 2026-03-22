# RF-011 — Landing page pública

<!--
  ¿Qué? Requisito funcional que define la página de presentación pública del sistema.
  ¿Para qué? Documentar las reglas y comportamiento de la URL raíz "/" del frontend.
  ¿Impacto? Sin este RF, la ruta raíz carecería de especificación formal y podría
            redirigir o mostrar contenido inconsistente con la experiencia esperada.
-->

---

## Identificación

| Campo         | Valor                                |
| ------------- | ------------------------------------ |
| **ID**        | RF-011                               |
| **Nombre**    | Landing page pública                 |
| **Módulo**    | Interfaz de usuario / Acceso público |
| **Prioridad** | Baja                                 |
| **Estado**    | Implementado                         |
| **Fecha**     | Marzo 2026                           |

---

## Descripción

El sistema debe mostrar una página de presentación pública en la URL raíz (`/`).
Esta página es accesible para cualquier visitante —autenticado o no— y tiene el
propósito de presentar el sistema, sus características técnicas y guiar al usuario
hacia el registro o el inicio de sesión.

La landing page **no requiere autenticación** y **no realiza redirecciones automáticas**.

---

## Proceso

1. El usuario accede a `/` en el navegador.
2. El router de React renderiza `<LandingPage />` directamente.
3. La página se muestra completa sin verificar el estado de autenticación.
4. Desde cualquier CTA el usuario puede navegar a `/register` o `/login`.

---

## Estructura de la página

| Sección      | Componente semántico | Contenido                                                     |
| ------------ | -------------------- | ------------------------------------------------------------- |
| Header       | `<header>`           | Logo SVG + wordmark + nav con links a /login y /register      |
| Hero         | `<section>`          | Logo grande, titular, subtítulo y dos CTAs principales        |
| Features     | `<section>` + `<ul>` | 6 tarjetas de características con ícono, título y descripción |
| How it works | `<section>` + `<ol>` | 3 pasos numerados del flujo principal del sistema             |
| Tech Stack   | `<section>` + `<ul>` | Badges de las 15 tecnologías del stack                        |
| CTA final    | `<section>`          | Bloque de conversión con botón "Crear cuenta gratis"          |
| Footer       | `<footer>`           | Logo + nombre + crédito educativo (SENA, ficha, año)          |

---

## Reglas de negocio

- **RN-038**: La ruta `/` renderiza `<LandingPage />` sin redirecciones.
- **RN-039**: La landing page es pública — no verifica ni requiere autenticación.
- **RN-040**: El logo del sistema es un SVG embebido (`NNAuthLogo`) sin imágenes externas.
- **RN-041**: El diseño usa tema dark (`bg-gray-950`), fuente sans-serif y colores sólidos sin degradados.
- **RN-042**: La página usa elementos semánticos HTML (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<ul>`, `<ol>`) y atributos ARIA donde corresponde.
- **RN-043**: Todos los botones y enlaces de la landing dirigen a rutas de la aplicación (`/register`, `/login`) sin abrir URLs externas.
- **RN-044**: La página es completamente responsiva — funcional desde 320px de ancho.

---

## Salidas

| Escenario                        | Resultado                                        |
| -------------------------------- | ------------------------------------------------ |
| Visitante anónimo accede a `/`   | Muestra `LandingPage` completa                   |
| Usuario autenticado accede a `/` | Muestra `LandingPage` completa (sin redirección) |
| Clic en "Comenzar ahora"         | Navega a `/register`                             |
| Clic en "Iniciar sesión" (nav)   | Navega a `/login`                                |

---

## Implementación

| Artefacto                      | Descripción                                        |
| ------------------------------ | -------------------------------------------------- |
| `fe/src/pages/LandingPage.tsx` | Componente principal de la landing page            |
| `fe/src/App.tsx` (ruta `/`)    | `<Route path="/" element={<LandingPage />} />`     |
| Componente `NNAuthLogo`        | SVG embebido, definido dentro de `LandingPage.tsx` |

---

## Relación con otros requisitos

| RF/HU           | Relación                                                          |
| --------------- | ----------------------------------------------------------------- |
| HU-009          | Historia de usuario correspondiente a este RF                     |
| RF-009          | La ruta `/` ya no realiza redirect — rompe RN-032 anterior        |
| HU-008 CA-008.3 | El criterio de ruta raíz fue actualizado para reflejar la landing |
