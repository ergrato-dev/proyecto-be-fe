# HU-009 — Landing page pública del sistema

<!--
  ¿Qué? Historia de usuario que describe la página de presentación pública del sistema.
  ¿Para qué? Formalizar la necesidad de tener una experiencia de bienvenida antes
             de que el usuario se registre o inicie sesión.
  ¿Impacto? Sin landing page, la URL raíz "/" no tiene propósito ni presentación del producto,
            reduciendo la percepción de calidad del sistema.
-->

---

## Identificación

| Campo            | Valor                                |
| ---------------- | ------------------------------------ |
| **ID**           | HU-009                               |
| **Título**       | Landing page pública del sistema     |
| **Módulo**       | Interfaz de usuario / Acceso público |
| **Prioridad**    | Baja                                 |
| **Estado**       | Implementada                         |
| **RF asociados** | RF-011                               |

---

## Historia

**Como** visitante del sistema (usuario autenticado o no),
**quiero** ver una página de presentación en la URL raíz (`/`),
**para** entender qué hace el sistema, sus características y encontrar accesos directos
al registro e inicio de sesión.

---

## Criterios de aceptación

### CA-009.1 — Acceso público desde la raíz

- **Dado que** soy cualquier visitante (con o sin sesión activa),
- **cuando** accedo a la URL raíz (`/`),
- **entonces** debo ver la landing page con información del sistema, sin ser redirigido automáticamente.

### CA-009.2 — Header con navegación

- **Dado que** estoy en la landing page,
- **cuando** miro la parte superior de la pantalla,
- **entonces** debo encontrar: el logo y nombre del sistema, un enlace "Iniciar sesión" y un botón "Registrarse".

### CA-009.3 — Sección hero con propuesta de valor

- **Dado que** estoy en la landing page,
- **cuando** llega la página,
- **entonces** debo ver un hero con el logo grande, un titular claro que explique qué hace el sistema y al menos dos botones de llamada a la acción (CTA): "Comenzar ahora" y "Iniciar sesión".

### CA-009.4 — Sección de características

- **Dado que** estoy en la landing page,
- **cuando** reviso las características del sistema,
- **entonces** debo ver al menos seis características con ícono, título y descripción (registro seguro, JWT, verificación de email, cambio y recuperación de contraseña, seguridad OWASP).

### CA-009.5 — Sección "¿Cómo funciona?"

- **Dado que** estoy en la landing page,
- **cuando** reviso la sección de flujo,
- **entonces** debo ver los pasos numerados que describen el recorrido de uso del sistema.

### CA-009.6 — Sección de stack tecnológico

- **Dado que** estoy en la landing page,
- **cuando** reviso la sección técnica,
- **entonces** debo ver las tecnologías del proyecto presentadas como badges o etiquetas.

### CA-009.7 — CTA final de conversión

- **Dado que** llegué al final de la landing page,
- **cuando** termino de leerla,
- **entonces** debo encontrar un bloque de cierre con un llamado a la acción "Crear cuenta gratis".

### CA-009.8 — Footer con identidad del proyecto

- **Dado que** estoy en la landing page,
- **cuando** llego al pie de página,
- **entonces** debo ver el logo, nombre del sistema y el crédito educativo (SENA, ficha, año).

### CA-009.9 — Diseño dark, sin serifas, sin degradados

- **Dado que** estoy en la landing page en cualquier dispositivo,
- **cuando** observo el diseño visual,
- **entonces** debe usar fondo oscuro (`bg-gray-950`), tipografía sans-serif y colores sólidos sin degradados.

### CA-009.10 — Accesibilidad con elementos semánticos

- **Dado que** uso un lector de pantalla o navego por teclado,
- **cuando** recorro la landing page,
- **entonces** debo encontrar elementos semánticos (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, listas `<ul>`, `<ol>`) y atributos de accesibilidad (`aria-labelledby`, `aria-label`, `focus-visible`).

### CA-009.11 — Logo SVG embebido

- **Dado que** accedo a la landing page,
- **cuando** veo el logo del sistema,
- **entonces** el logo debe ser un SVG embebido (no una imagen externa) que represente las iniciales "NN" dentro de un badge, y debe aparecer en el header, el hero y el footer.

### CA-009.12 — Responsividad mobile-first

- **Dado que** accedo desde un dispositivo móvil,
- **cuando** veo la landing page,
- **entonces** la sección de features debe colapsar a una columna, los pasos y el header deben ser legibles en pantallas pequeñas.

---

## Notas técnicas

- Implementado en `fe/src/pages/LandingPage.tsx`.
- La ruta `/` en `App.tsx` apunta a `<LandingPage />` (no realiza redirect).
- El logo (`NNAuthLogo`) es un componente SVG propio, sin dependencias externas.
- No requiere autenticación — accesible para todos los visitantes.
- Secciones: `Header` (sticky) → Hero → Features → How it works → Tech Stack → CTA final → Footer.
