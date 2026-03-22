# RF-013 — Formulario de Contacto

<!--
  ¿Qué? Requisito funcional del formulario de contacto público del NN Auth System.
  ¿Para qué? Especificar las reglas de negocio, validaciones, comportamiento técnico
             y flujos aceptados/rechazados del canal de atención al titular.
  ¿Impacto? Define el contrato entre el frontend y el backend (en producción) para el
             flujo de envío de mensajes. Referencia: HU-011.
-->

---

## Identificación

| Campo           | Valor                                                               |
| --------------- | ------------------------------------------------------------------- |
| **ID**          | RF-013                                                              |
| **Nombre**      | Formulario de Contacto Público                                      |
| **Módulo**      | Información pública — Atención al titular                           |
| **Prioridad**   | Media                                                               |
| **Historia**    | HU-011 — Formulario de Contacto                                     |
| **Estado**      | ✅ Implementado (cliente) — Sin endpoint backend (demo educativo)   |
| **Marco legal** | Ley 1581/2012 Arts. 14–15, Decreto 1377/2013 Art. 13, Ley 1480/2011 |

---

## Descripción General

El sistema debe proveer un formulario de contacto público accesible en la ruta `/contacto`
sin requerir autenticación. El formulario permite a cualquier visitante enviar un mensaje
al responsable del tratamiento de datos.

**En el contexto educativo SENA:** el envío es simulado (sin backend real). En producción,
el formulario enviaría los datos a `POST /api/v1/contact` y el backend los procesaría con
un servicio de correo (`fastapi-mail`).

> ⚠️ **REGLA ABSOLUTA**: NUNCA colocar correos reales de personas físicas en el código
> fuente, archivos de configuración o documentación. Los correos mostrados son ficticios.

---

## Ruta y Acceso

### RN-055 — Ruta pública `/contacto`

- La ruta `/contacto` es **pública** (no protegida por `ProtectedRoute`).
- Debe ser accesible desde cualquier estado de autenticación (autenticado, no autenticado).
- Se registra en `App.tsx` junto a las demás rutas públicas.
- El enlace a `/contacto` se añade al nav `aria-label="Aviso legal"` en el footer
  de `LandingPage.tsx`.

---

## Campos del Formulario

### RN-056 — Campos requeridos

El formulario tiene los siguientes campos, todos **obligatorios**:

| Campo            | Elemento HTML | Tipo       | Restricciones de validación            |
| ---------------- | ------------- | ---------- | -------------------------------------- |
| `name`           | `<input>`     | `text`     | Min. 3 caracteres (trim)               |
| `email`          | `<input>`     | `email`    | Formato RFC 5322 simplificado: `a@b.c` |
| `subject`        | `<select>`    | —          | No vacío; valor de lista predefinida   |
| `message`        | `<textarea>`  | —          | Min. 20 caracteres (trim)              |
| `acceptsPrivacy` | `<input>`     | `checkbox` | Debe estar `checked = true`            |

### RN-057 — Opciones de asunto predefinidas

```
consulta-general       → Consulta general
soporte-tecnico        → Soporte técnico
derechos-datos         → Ejercer derechos (Ley 1581/2012 — Habeas Data)
sistema-autenticacion  → Sistema de autenticación
bugs-errores           → Reporte de bugs o errores
otro                   → Otro
```

---

## Validación del Lado del Cliente

### RN-058 — Validación en el submit (no en blur)

- La validación se ejecuta al hacer clic en "Enviar mensaje" (`onSubmit`).
- Si hay errores, el formulario **no se envía** y se muestran todos los errores simultáneamente.
- El foco se mueve al primer campo inválido (`aria-invalid="true"`).

### RN-059 — Mensajes de error por campo

| Campo            | Condición de error               | Mensaje mostrado                                          |
| ---------------- | -------------------------------- | --------------------------------------------------------- |
| `name`           | Menos de 3 caracteres (trim)     | "El nombre debe tener al menos 3 caracteres."             |
| `email`          | Formato inválido                 | "Ingresa una dirección de correo electrónico válida."     |
| `subject`        | Sin selección (valor vacío `""`) | "Selecciona un asunto para tu mensaje."                   |
| `message`        | Menos de 20 caracteres (trim)    | "El mensaje debe tener al menos 20 caracteres."           |
| `acceptsPrivacy` | `checked = false`                | "Debes aceptar la Política de Privacidad para continuar." |

### RN-060 — Limpiar error al editar campo

- Cuando el usuario modifica un campo que tenía error, ese error se limpia en `onChange`
  para dar feedback positivo inmediato.

---

## Flujo de Envío

### RN-061 — Estado de carga (`isSubmitting`)

Al confirmar un formulario válido:

1. `isSubmitting = true` → botón se deshabilita y muestra spinner + "Enviando...".
2. Todos los campos quedan deshabilitados durante la carga.
3. Se ejecuta la operación de envío (simulada o real).
4. `isSubmitting = false`.

### RN-062 — Envío simulado (contexto educativo)

**En el contexto educativo** (sin backend real):

- El envío se simula con `setTimeout(1500ms)`.
- No se hace ninguna petición HTTP real.
- No se almacena ningún dato.
- El resultado siempre es `success`.

**En producción**, la implementación sería:

```typescript
const response = await axios.post("/api/v1/contact", formData);
// Endpoint: POST /api/v1/contact
// Body: { name, email, subject, message }
// Response 200: { message: "Mensaje recibido correctamente" }
// Response 422: { detail: [...] }  ← validación Pydantic
// Response 429: Rate limit excedido  ← anti-spam
```

### RN-063 — Estado de éxito

Tras un envío exitoso:

- El formulario se **reemplaza** por un panel de confirmación verde.
- El panel muestra el ícono `CheckCircle`, el texto de confirmación y los plazos legales.
- El formulario se **resetea** al estado inicial (todos los campos vacíos/desmarcados).
- El panel incluye botón "Enviar otro mensaje" que restaura el formulario.

### RN-064 — Estado de error en el envío

Si el envío falla (red, servidor):

- Se muestra un `div role="alert"` de fondo rojo con mensaje de error genérico.
- El formulario permanece visible y editable para reintentar.
- El estado de error NO revela detalles técnicos al usuario.

---

## Correos de Contacto Ficticios

### RN-065 — Usar exclusivamente correos del dominio `nn-company.co`

Los correos mostrados en la columna de información de contacto son **ficticios** y
pertenecen al dominio educativo `nn-company.co`:

| Propósito        | Correo ficticio                 |
| ---------------- | ------------------------------- |
| Contacto general | `contacto@nn-company.co`        |
| Datos personales | `datospersonales@nn-company.co` |
| Soporte técnico  | `soporte@nn-company.co`         |

Estos correos son **consistentes** con los mencionados en:

- `PoliticaPrivacidadPage.tsx`
- `TerminosDeUsoPage.tsx`
- `PoliticaCookiesPage.tsx`

### RN-066 — NUNCA usar correos reales

- **PROHIBIDO** colocar correos reales de instructores, aprendices o terceros en el código.
- Si el proyecto se desplegara en producción, los correos de destino deben configurarse
  en variables de entorno del backend (`CONTACT_EMAIL`), nunca en el frontend.

---

## Aviso Educativo

### RN-067 — Aviso prominente obligatorio

La página `/contacto` **siempre** muestra un recuadro de aviso:

- Estilo: fondo ámbar/ocre (`bg-amber-950/40`), borde `border-amber-800`.
- Posición: sobre el formulario, visible sin scroll.
- Rol semántico: `role="note"` con `aria-label="Aviso educativo"`.
- Contenido obligatorio:
  - Identificación como proyecto educativo (SENA).
  - Declaración explícita de que el formulario es demostrativo.
  - Declaración de que los mensajes no se envían ni almacenan.
  - Declaración de que los correos son ficticios.

---

## Autorización de Tratamiento de Datos — Ley 1581/2012

### RN-068 — Checkbox de aceptación de política de privacidad obligatorio

El formulario recolecta el nombre y correo del remitente (dato personal — Ley 1581/2012,
Art. 3.c). Por tanto, se requiere **autorización previa, expresa e informada** (Art. 9):

- El checkbox `acceptsPrivacy` es **requerido** (`aria-required="true"`).
- El label incluye enlace a la Política de Privacidad (`/privacidad`).
- El label menciona explícitamente la Ley 1581 de 2012.
- El formulario **no puede enviarse** si el checkbox no está marcado.

---

## Contadores y Retroalimentación Visual

### RN-069 — Contador de caracteres del mensaje

- El textarea de mensaje muestra: `"N / 20 caracteres mínimos"`.
- El indicador cambia a color ámbar si `0 < caracteres.trim() < 20`.
- Implementado con `aria-live="polite"` para lectores de pantalla.
- El contador desaparece (vuelve al gris) cuando se supera el mínimo.

---

## Plazos de Respuesta (Ley 1581/2012)

### RN-070 — Información de plazos visible en la columna lateral

La columna de información de contacto debe mostrar los plazos legales:

| Tipo de solicitud | Plazo           | Artículo de referencia |
| ----------------- | --------------- | ---------------------- |
| Consulta          | 10 días hábiles | Art. 14, Ley 1581/2012 |
| Reclamo           | 15 días hábiles | Art. 15, Ley 1581/2012 |

Estos plazos también se muestran en el panel de confirmación de envío exitoso.

---

## Reglas de Diseño

### RN-071 — Restricciones visuales del formulario de contacto

| Regla            | Especificación                                                  |
| ---------------- | --------------------------------------------------------------- |
| Fondo de página  | `bg-gray-950` (dark exclusivo)                                  |
| Degradados       | **PROHIBIDOS** — sin `gradient` en ningún elemento              |
| Tipografía       | Sans-serif exclusivamente (`font-sans`)                         |
| Grid en desktop  | `lg:grid-cols-3` (formulario 2/3, info 1/3)                     |
| Grid en móvil    | Columna única (mobile-first)                                    |
| Botón de acción  | Alineado a la derecha (`flex justify-end`)                      |
| Header de página | Logo NNAuthLogo + botón "Volver al inicio" con `ArrowLeft`      |
| Footer de página | Crédito educativo con año dinámico (`new Date().getFullYear()`) |

---

## Accesibilidad (WCAG AA)

### RN-072 — Requisitos de accesibilidad del formulario

| Criterio WCAG                  | Implementación                                                   |
| ------------------------------ | ---------------------------------------------------------------- |
| 1.3.1 — Info and relationships | `<label htmlFor>` asociado a cada campo                          |
| 2.1.1 — Keyboard               | Todos los controles accesibles con Tab / Enter / Space           |
| 2.4.7 — Focus Visible          | `focus-visible:ring-2 focus-visible:ring-blue-500`               |
| 3.3.1 — Error Identification   | Mensajes de error junto a campo inválido con `role="alert"`      |
| 3.3.2 — Labels or Instructions | Labels con íconos + asterisco rojo para obligatorios             |
| 4.1.2 — Name, Role, Value      | `aria-required`, `aria-invalid`, `aria-describedby`, `aria-busy` |

---

## Archivos del Sistema

| Archivo                                              | Cambio       | Descripción                                         |
| ---------------------------------------------------- | ------------ | --------------------------------------------------- |
| `fe/src/pages/ContactPage.tsx`                       | Nuevo        | Página completa del formulario de contacto          |
| `fe/src/App.tsx`                                     | Modificado   | Import + `<Route path="/contacto">`                 |
| `fe/src/pages/LandingPage.tsx`                       | Modificado   | Enlace "Contacto" en nav `aria-label="Aviso legal"` |
| `_docs/requisitos/HUs/HU-011_formulario_contacto.md` | Nuevo        | Historia de usuario del formulario                  |
| `_docs/requisitos/RFs/RF-013_formulario_contacto.md` | Este archivo | Requisitos funcionales                              |

---

## Casos de Prueba (referencia para Testing)

| ID     | Escenario                                | Resultado esperado                                          |
| ------ | ---------------------------------------- | ----------------------------------------------------------- |
| TC-001 | Envío con todos los campos válidos       | Spinner → panel de éxito verde → formulario en blanco       |
| TC-002 | Envío sin nombre                         | Error "El nombre debe tener al menos 3 caracteres."         |
| TC-003 | Envío con email inválido (`"abc"`)       | Error "Ingresa una dirección de correo electrónico válida." |
| TC-004 | Envío sin seleccionar asunto             | Error "Selecciona un asunto para tu mensaje."               |
| TC-005 | Mensaje con 10 caracteres (< 20)         | Error "El mensaje debe tener al menos 20 caracteres."       |
| TC-006 | Envío sin marcar checkbox privacidad     | Error "Debes aceptar la Política de Privacidad..."          |
| TC-007 | Navegar a `/contacto` sin login          | Página carga sin redirect a `/login`                        |
| TC-008 | Clic en "Enviar otro mensaje" tras éxito | Formulario vacío aparece de nuevo                           |
| TC-009 | Contador con 15 caracteres en el mensaje | Contador en color ámbar                                     |
| TC-010 | Contador con 21 caracteres en el mensaje | Contador en color gris                                      |
