# RF-012 — Páginas de información legal

<!--
  ¿Qué? Requisito funcional que define las tres páginas de contenido legal del sistema:
        Términos de Uso, Política de Privacidad y Política de Cookies.
  ¿Para qué? Especificar formalmente el comportamiento, contenido mínimo y reglas de negocio
             que cada página debe cumplir conforme al marco normativo colombiano.
  ¿Impacto? Sin este RF, las páginas legales carecen de especificación formal, lo que puede
            generar incumplimiento de la Ley 1581/2012 y exponer al operador a sanciones
            administrativas de la SIC (hasta 2.000 SMMLV, Art. 23 Ley 1581/2012).
-->

---

## Identificación

| Campo         | Valor                                |
| ------------- | ------------------------------------ |
| **ID**        | RF-012                               |
| **Nombre**    | Páginas de información legal         |
| **Módulo**    | Interfaz de usuario / Acceso público |
| **Prioridad** | Media                                |
| **Estado**    | Implementado                         |
| **Fecha**     | Febrero 2026                         |

---

## Descripción

El sistema debe proveer tres páginas de contenido legal accesibles públicamente, sin
requerir autenticación, cumpliendo con el marco normativo colombiano aplicable a servicios
digitales que recolecten y traten datos personales.

Las páginas deben estar enlazadas desde el footer de la landing page y ser accesibles
directamente mediante sus rutas respectivas.

---

## Marco normativo

| Norma                             | Obligación                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------- |
| **Ley 1581 de 2012**              | Obliga al responsable a tener y publicar Política de Privacidad (Art. 13 y 15). |
| **Decreto 1377 de 2013**          | Define contenido mínimo del aviso de privacidad y la autorización del titular.  |
| **Decreto 886 de 2014**           | RNBD — inscripción de bases de datos con datos personales ante la SIC.          |
| **Decreto 1074 de 2015**          | Decreto Único Reglamentario del Sector Comercio (consolida normas anteriores).  |
| **Circular Externa 002/2015 SIC** | Instrucciones sobre mecanismos de autorización del titular.                     |
| **Ley 527 de 1999**               | Validez de contratos y mensajes de datos en el comercio electrónico.            |
| **Ley 1480 de 2011**              | Estatuto del Consumidor: deber de información en servicios digitales (Art. 23). |
| **Ley 23 de 1982**                | Derechos de autor sobre el código fuente y contenidos del sistema.              |
| **RFC 6265 / OWASP**              | Estándar técnico de cookies y mejores prácticas de seguridad.                   |

---

## Páginas y Rutas

| Página                 | Ruta               | Componente               |
| ---------------------- | ------------------ | ------------------------ |
| Términos de Uso        | `/terminos-de-uso` | `TerminosDeUsoPage`      |
| Política de Privacidad | `/privacidad`      | `PoliticaPrivacidadPage` |
| Política de Cookies    | `/cookies`         | `PoliticaCookiesPage`    |

---

## Proceso

1. El usuario busca información legal sobre el servicio.
2. Hace clic en el enlace correspondiente en el footer de la landing page, o accede
   directamente a la URL.
3. React Router renderiza la página solicitada sin verificar autenticación.
4. El usuario lee el documento y puede navegar de regreso a la landing mediante el
   botón "Volver al inicio" del header de la página.

---

## Contenido mínimo por página

### Términos de Uso (`/terminos-de-uso`)

| Sección               | Referencia legal                |
| --------------------- | ------------------------------- |
| Objeto del servicio   | Ley 527/1999 Arts. 10, 14       |
| Registro y cuenta     | Ley 1480/2011 Art. 45           |
| Uso aceptable         | Ley 1480/2011                   |
| Propiedad intelectual | Ley 23/1982, Decisión CAN 351   |
| Datos personales      | Ley 1581/2012 (remite a PP)     |
| Limitación de resp.   | Ley 1480/2011                   |
| Modificaciones        | Ley 1480/2011 Art. 54 (15 días) |
| Ley aplicable         | Ley 527/1999, Ley 1480/2011     |
| Contacto              | Información del responsable     |

### Política de Privacidad (`/privacidad`)

| Sección                     | Referencia legal                    |
| --------------------------- | ----------------------------------- |
| Responsable del tratamiento | Decreto 1377/2013 Art. 13.1         |
| Datos recolectados          | Ley 1581/2012 Arts. 4.b, 4.d        |
| Finalidades del tratamiento | Decreto 1377/2013 Art. 13.2         |
| Autorización del titular    | Ley 1581/2012 Art. 9; D.1377 Art. 7 |
| Derechos del titular (6)    | Ley 1581/2012 Art. 8                |
| Tiempo de conservación      | Ley 1581/2012 Art. 4.e              |
| Transferencias y transmis.  | Ley 1581/2012 Art. 26               |
| Medidas de seguridad        | Ley 1581/2012 Art. 4.g              |
| RNBD                        | Decreto 886/2014; Decreto 090/2018  |
| Autoridad de control (SIC)  | Ley 1581/2012 Art. 19               |
| Vigencia y modificaciones   | Circular Externa 002/2015 SIC       |

### Política de Cookies (`/cookies`)

| Sección                     | Referencia legal / técnica |
| --------------------------- | -------------------------- |
| Definición de cookies       | RFC 6265                   |
| Tipos (funcionales/prefs.)  | Ley 1581/2012 (si hay DP)  |
| Tabla detallada de cookies  | Decreto 1377/2013 Art. 13  |
| Atributos de seguridad      | OWASP Top 10, RFC 6265bis  |
| Gestión por navegador       | Deber de información       |
| Sin rastreo/terceros        | Ley 1581/2012 Art. 4.b     |
| Relación con Política Priv. | Ley 1581/2012              |

---

## Reglas de negocio

- **RN-045**: Las tres páginas legales son públicas — no requieren autenticación y no realizan redirecciones involuntarias.
- **RN-046**: El footer de la landing page (`LandingPage.tsx`) incluye enlaces visibles a las tres páginas legales.
- **RN-047**: Cada página legal presenta al inicio: título (h1), fecha de última actualización con `<time>` y versión del documento.
- **RN-048**: La Política de Privacidad identifica explícitamente al Responsable del Tratamiento con razón social, NIT, domicilio y canal de contacto para ejercer derechos, conforme al Decreto 1377/2013 Art. 13.
- **RN-049**: La Política de Privacidad enumera los 6 derechos del titular del Art. 8 de la Ley 1581/2012, con los plazos de respuesta aplicables (10 días hábiles para consultas; 15 días hábiles para reclamos).
- **RN-050**: La Política de Privacidad menciona la SIC como autoridad de control con su portal web (www.sic.gov.co).
- **RN-051**: La Política de Cookies incluye una tabla con nombre, finalidad, duración y tipo de cada cookie, así como los atributos de seguridad (HttpOnly, Secure, SameSite) de las cookies de autenticación.
- **RN-052**: Las páginas legales usan el componente `LegalLayout` (shared layout) con secciones numeradas mediante `LegalSection`.
- **RN-053**: El diseño de las páginas legales es coherente con el sistema: fondo `bg-gray-950`, fuente sans-serif, sin degradados, tema oscuro con soporte de variantes dark de Tailwind.
- **RN-054**: Las páginas legales son responsivas y accesibles (WCAG AA): encabezados semánticos (h1/h2), enlaces descriptivos, navegación por teclado funcional, contraste suficiente.

---

## Salidas

| Escenario                           | Resultado                              |
| ----------------------------------- | -------------------------------------- |
| Clic en "Términos de uso" (footer)  | Navega a `/terminos-de-uso`            |
| Clic en "Política de privacidad"    | Navega a `/privacidad`                 |
| Clic en "Política de cookies"       | Navega a `/cookies`                    |
| Clic en "Volver al inicio" (header) | Navega a `/` (landing page)            |
| URL directa `/terminos-de-uso`      | Renderiza `<TerminosDeUsoPage />`      |
| URL directa `/privacidad`           | Renderiza `<PoliticaPrivacidadPage />` |
| URL directa `/cookies`              | Renderiza `<PoliticaCookiesPage />`    |

---

## Implementación

| Artefacto                                         | Descripción                                       |
| ------------------------------------------------- | ------------------------------------------------- |
| `fe/src/components/layout/LegalLayout.tsx`        | Layout compartido: `LegalLayout` + `LegalSection` |
| `fe/src/pages/TerminosDeUsoPage.tsx`              | Página de Términos de Uso                         |
| `fe/src/pages/PoliticaPrivacidadPage.tsx`         | Página de Política de Privacidad                  |
| `fe/src/pages/PoliticaCookiesPage.tsx`            | Página de Política de Cookies                     |
| `fe/src/App.tsx` (rutas `/terminos-de-uso`, etc.) | 3 `<Route>` en el bloque de rutas públicas        |
| `fe/src/pages/LandingPage.tsx` (footer)           | Nav `aria-label="Aviso legal"` con 3 enlaces      |
| `NNAuthLogo` (export en `LandingPage.tsx`)        | Exportado para reutilizar en `LegalLayout`        |

---

## Relación con otros requisitos

| RF/HU  | Relación                                                                 |
| ------ | ------------------------------------------------------------------------ |
| HU-010 | Historia de usuario correspondiente a este RF                            |
| RF-011 | Landing page — su footer ahora incluye los 3 enlaces legales             |
| HU-009 | CA-009 actualizado implícitamente: el footer de la landing tiene legales |
