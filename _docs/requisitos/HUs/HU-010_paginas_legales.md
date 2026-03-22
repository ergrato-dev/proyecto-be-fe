# HU-010 — Páginas de información legal

<!--
  ¿Qué? Historia de usuario que describe las páginas de Términos de Uso,
        Política de Privacidad y Política de Cookies del sistema.
  ¿Para qué? Formalizar la necesidad de cumplir con el marco normativo colombiano
             para la operación de un servicio digital (Ley 1581/2012, Ley 527/1999,
             Ley 1480/2011), protegiendo tanto al usuario como al operador.
  ¿Impacto? Sin estas páginas, el servicio opera en incumplimiento de la Ley 1581 de 2012
            (Habeas Data), lo que puede generar sanciones de la SIC y erosionar la confianza
            del usuario.
-->

---

## Identificación

| Campo            | Valor                                     |
| ---------------- | ----------------------------------------- |
| **ID**           | HU-010                                    |
| **Título**       | Páginas de información legal del servicio |
| **Módulo**       | Interfaz de usuario / Acceso público      |
| **Prioridad**    | Media                                     |
| **Estado**       | Implementada                              |
| **RF asociados** | RF-012                                    |

---

## Historia

**Como** visitante o usuario registrado del sistema,
**quiero** acceder a las páginas de Términos de Uso, Política de Privacidad y
Política de Cookies del servicio,
**para** conocer mis derechos, las condiciones de uso y cómo se tratan mis datos
personales, en cumplimiento del régimen colombiano de protección de datos (Ley 1581 de 2012).

---

## Criterios de aceptación

### CA-010.1 — Acceso público desde la landing page

- **Dado que** soy cualquier visitante (con o sin sesión activa),
- **cuando** estoy en la landing page y miro el pie de página (footer),
- **entonces** debo encontrar tres enlaces: "Términos de uso", "Política de privacidad" y
  "Política de cookies", cada uno navegable sin autenticación.

### CA-010.2 — Página de Términos de Uso

- **Dado que** hago clic en "Términos de uso" (o accedo directamente a `/terminos-de-uso`),
- **cuando** se carga la página,
- **entonces** debo ver el documento completo con al menos los siguientes apartados:
  objeto del servicio, registro y cuenta, uso aceptable, propiedad intelectual,
  tratamiento de datos, limitación de responsabilidad, modificaciones,
  ley aplicable y contacto.

### CA-010.3 — Contenido legal mínimo de Términos

- **Dado que** estoy leyendo los Términos de Uso,
- **cuando** reviso el documento,
- **entonces** debo encontrar referencias explícitas a la **Ley 527 de 1999**
  (comercio electrónico) y la **Ley 1480 de 2011** (Estatuto del Consumidor)
  como leyes aplicables al servicio.

### CA-010.4 — Página de Política de Privacidad

- **Dado que** hago clic en "Política de privacidad" (o accedo directamente a `/privacidad`),
- **cuando** se carga la página,
- **entonces** debo ver el documento con los elementos exigidos por la
  **Ley 1581 de 2012** y el **Decreto 1377 de 2013**:
  identificación del responsable del tratamiento, datos recolectados,
  finalidad del tratamiento, derechos del titular (Art. 8 Ley 1581/2012),
  autorización del titular, tiempo de conservación, transferencias,
  medidas de seguridad, RNBD, autoridad de control (SIC) y vigencia.

### CA-010.5 — Derechos del titular en Política de Privacidad

- **Dado que** estoy leyendo la Política de Privacidad,
- **cuando** reviso la sección de derechos,
- **entonces** debo encontrar los **6 derechos del titular** del Art. 8 de la Ley 1581/2012:
  conocer, actualizar/rectificar, suprimir, revocar autorización, acceder gratuitamente
  y presentar quejas ante la SIC, junto con el canal y los plazos de respuesta del responsable
  (10 días hábiles para consultas; 15 días hábiles para reclamos).

### CA-010.6 — Página de Política de Cookies

- **Dado que** hago clic en "Política de cookies" (o accedo a `/cookies`),
- **cuando** se carga la página,
- **entonces** debo ver: definición de cookies, tipos usados (funcionales y preferencias),
  tabla con nombre, finalidad, duración y tipo de cada cookie, atributos de seguridad
  (HttpOnly, Secure, SameSite), instrucciones para gestión por navegador y confirmación
  de que NO se usan cookies de terceros ni rastreo publicitario.

### CA-010.7 — Navegación de retorno

- **Dado que** estoy en cualquier página legal,
- **cuando** veo el header de la página,
- **entonces** debo encontrar un enlace "Volver al inicio" (con ícono de flecha izquierda)
  que me lleva de regreso a la landing page (`/`), sin recargar la aplicación.

### CA-010.8 — Diseño coherente con el sistema

- **Dado que** estoy en cualquier página legal,
- **cuando** reviso el diseño,
- **entonces** debo ver: fondo oscuro (`bg-gray-950`), fuente sans-serif, sin degradados,
  secciones numeradas con badge azul, encabezado con logo del sistema y enlace de retorno,
  pie de página con crédito del proyecto. El diseño debe ser coherente con el resto del
  sistema.

### CA-010.9 — Accesibilidad mínima

- **Dado que** navegó a una página legal con un lector de pantalla o teclado,
- **cuando** recorro la página,
- **entonces** debo poder navegar por las secciones con Tab/Enter, los encabezados deben
  ser descriptivos (h1 para el título del documento, h2 para cada sección), los enlaces
  deben tener texto descriptivo y la navegación de retorno debe tener un `aria-label`
  adecuado.

### CA-010.10 — Fecha de última actualización visible

- **Dado que** estoy en cualquier página legal,
- **cuando** cargo la página,
- **entonces** debo ver claramente la fecha de última actualización y la versión del
  documento, en formato legible para el usuario y con etiqueta `<time>` para máquinas.

---

## Notas de implementación

### Marco normativo aplicado

| Norma                | Documento que la aplica                 |
| -------------------- | --------------------------------------- |
| Ley 1581 de 2012     | Política de Privacidad (secciones 2–10) |
| Decreto 1377 de 2013 | Política de Privacidad (secciones 3–5)  |
| Decreto 886 de 2014  | Política de Privacidad (sección 9)      |
| Ley 527 de 1999      | Términos de Uso (sección 1, 8)          |
| Ley 1480 de 2011     | Términos de Uso (secciones 6, 7)        |
| Ley 23 de 1982       | Términos de Uso (sección 4)             |
| RFC 6265 / OWASP     | Política de Cookies (secciones 1, 4)    |

### Empresa responsable (ficticia — proyecto educativo)

- **Razón social:** Empresa NN S.A.S. — NIT 900.000.000-0
- **Domicilio:** Bogotá D.C., Colombia
- **Email legal:** legal@nn-company.co
- **Email datos personales:** datospersonales@nn-company.co

### Rutas

| Página                 | Ruta               | Componente                     |
| ---------------------- | ------------------ | ------------------------------ |
| Términos de Uso        | `/terminos-de-uso` | `TerminosDeUsoPage`            |
| Política de Privacidad | `/privacidad`      | `PoliticaPrivacidadPage`       |
| Política de Cookies    | `/cookies`         | `PoliticaCookiesPage`          |
| Layout compartido      | —                  | `LegalLayout` + `LegalSection` |
