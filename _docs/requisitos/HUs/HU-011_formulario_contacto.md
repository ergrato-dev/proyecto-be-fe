# HU-011 — Formulario de Contacto

<!--
  ¿Qué? Historia de usuario que describe el formulario de contacto público del sistema.
  ¿Para qué? Proveer un canal formal de atención conforme a Ley 1581/2012 Arts. 14–15,
             que exige al responsable del tratamiento informar cómo los titulares pueden
             presentar consultas y reclamos sobre sus datos personales.
  ¿Impacto? Sin este canal, el sistema incumpliría la obligación de atención al titular
             y no podría responder solicitudes de derechos Habeas Data en los plazos legales.
-->

---

## Identificación

| Campo           | Valor                                                |
| --------------- | ---------------------------------------------------- |
| **ID**          | HU-011                                               |
| **Nombre**      | Formulario de Contacto                               |
| **Módulo**      | Información pública — Atención al titular            |
| **Prioridad**   | Media                                                |
| **Estimación**  | 3 puntos de historia                                 |
| **Sprint**      | 4                                                    |
| **Estado**      | ✅ Implementada                                      |
| **Marco legal** | Ley 1581/2012 Arts. 14–15, Decreto 1377/2013 Art. 13 |

---

## Historia de Usuario

> **Como** visitante o usuario registrado de NN Auth System,
> **quiero** enviar un mensaje a través de un formulario de contacto público,
> **para** realizar consultas, reportar problemas o ejercer mis derechos sobre
> mis datos personales (Ley 1581 de 2012).

---

## Contexto y Motivación

La Ley 1581 de 2012 (Habeas Data) establece que el responsable del tratamiento debe
disponer de mecanismos accesibles para que los titulares de datos puedan:

- **Presentar consultas** (Art. 14): respuesta en máximo **10 días hábiles**.
- **Presentar reclamos** (Art. 15): respuesta en máximo **15 días hábiles**.

El formulario de contacto cumple esta exigencia y también sirve como canal para
soporte técnico general y consultas sobre el sistema.

> **AVISO EDUCATIVO — PROYECTO SENA:**
> El formulario es **demostrativo**. No envía datos a ningún servidor real.
> Los correos de contacto son **ficticios** (la empresa NN S.A.S. no existe).
> En producción, la acción de envío llamaría a `POST /api/v1/contact` en el backend.

---

## Criterios de Aceptación

### CA-011.1 — Acceso público a la ruta `/contacto`

**Dado que** soy cualquier visitante (autenticado o no),
**cuando** navego a `http://localhost:5173/contacto`,
**entonces** la página carga completamente sin requerir inicio de sesión.

---

### CA-011.2 — Campos del formulario

**Dado que** estoy en la página `/contacto`,
**entonces** el formulario presenta los siguientes campos:

| Campo              | Tipo       | Requerido | Restricción                          |
| ------------------ | ---------- | --------- | ------------------------------------ |
| Nombre completo    | `text`     | ✅ Sí     | Mínimo 3 caracteres                  |
| Correo electrónico | `email`    | ✅ Sí     | Formato válido (usuario@dominio.tld) |
| Asunto             | `select`   | ✅ Sí     | Selección de lista predefinida       |
| Mensaje            | `textarea` | ✅ Sí     | Mínimo 20 caracteres                 |
| Acepto política    | `checkbox` | ✅ Sí     | Debe estar marcado para enviar       |

Opciones del selector de asunto:

- Consulta general
- Soporte técnico
- Ejercer derechos (Ley 1581/2012 — Habeas Data)
- Sistema de autenticación
- Reporte de bugs o errores
- Otro

---

### CA-011.3 — Validación del formulario

**Dado que** intento enviar el formulario con campos inválidos,
**cuando** hago clic en "Enviar mensaje",
**entonces**:

- Se muestran mensajes de error descriptivos en español junto a cada campo inválido.
- El formulario NO se envía (prevención de envíos incompletos).
- El foco del teclado se mueve al primer campo con error (WCAG 3.3.1).
- Campos que se validan:
  - Nombre: si tiene menos de 3 caracteres → `"El nombre debe tener al menos 3 caracteres."`
  - Email: si el formato es inválido → `"Ingresa una dirección de correo electrónico válida."`
  - Asunto: si no se seleccionó → `"Selecciona un asunto para tu mensaje."`
  - Mensaje: si tiene menos de 20 caracteres → `"El mensaje debe tener al menos 20 caracteres."`
  - Checkbox privacidad: si no está marcado → `"Debes aceptar la Política de Privacidad para continuar."`

---

### CA-011.4 — Spinner de carga durante el envío

**Dado que** envío el formulario con todos los campos válidos,
**cuando** el sistema procesa la solicitud,
**entonces**:

- El botón "Enviar mensaje" muestra un spinner y el texto "Enviando...".
- El botón queda deshabilitado (no se puede hacer doble clic).
- Los campos del formulario quedan deshabilitados para edición.
- El estado de carga dura aproximadamente 1.5 segundos (simulación).

---

### CA-011.5 — Mensaje de éxito tras el envío

**Dado que** el envío simulado completa con éxito,
**entonces**:

- El formulario es **reemplazado** por un panel de confirmación verde.
- El panel muestra un ícono de check, el texto "Mensaje enviado correctamente" y una
  aclaración de que es una simulación educativa.
- El panel incluye los plazos de respuesta legales (10 / 15 días hábiles).
- El panel muestra un botón "Enviar otro mensaje" que reinicia el formulario en blanco.

---

### CA-011.6 — Aviso educativo prominente

**Dado que** navego a `/contacto`,
**entonces** veo un recuadro de fondo ámbar/ocre que indica claramente:

- Que el formulario es **demostrativo** (proyecto educativo SENA).
- Que los mensajes **no se envían** a ningún servidor real.
- Que los datos **no se almacenan**.
- Los correos de contacto son **ficticios**.

---

### CA-011.7 — Información de contacto ficticia en columna lateral

**Dado que** estoy en la página `/contacto`,
**entonces** la columna de información de contacto muestra:

| Elemento                    | Valor (ficticio)                |
| --------------------------- | ------------------------------- |
| Correo general              | `contacto@nn-company.co`        |
| Correo datos personales     | `datospersonales@nn-company.co` |
| Correo soporte              | `soporte@nn-company.co`         |
| Teléfono                    | `(+57) 601 000 0000`            |
| Horario de atención         | Lunes a viernes, 8am – 5pm      |
| Plazos Ley 1581 (consultas) | 10 días hábiles                 |
| Plazos Ley 1581 (reclamos)  | 15 días hábiles                 |

> La columna incluye un aviso explícito de que los correos son **ficticios**.

---

### CA-011.8 — Enlace desde el footer de la Landing Page

**Dado que** estoy en la página de inicio (`/`),
**cuando** miro el footer de la landing page,
**entonces** el nav `aria-label="Aviso legal"` incluye un enlace "Contacto" → `/contacto`,
alineado con los demás enlaces legales (Términos de uso, Política de privacidad, Cookies).

---

### CA-011.9 — Checkbox de autorización Ley 1581/2012

**Dado que** el formulario recolecta nombre y correo (datos personales),
**entonces** el checkbox de aceptación de privacidad:

- Es **obligatorio** (bloquea el envío si no está marcado).
- Contiene un enlace a `/privacidad` que abre en nueva pestaña (`target="_blank"`).
- Menciona explícitamente la Ley 1581 de 2012.
- Está marcado como `aria-required="true"` y `aria-invalid` cuando hay error.

---

### CA-011.10 — Contador de caracteres en el mensaje

**Dado que** estoy escribiendo en el campo de mensaje,
**entonces** debajo del textarea veo un contador tipo `"N / 20 caracteres mínimos"` que:

- Cambia a color ámbar cuando se han escrito entre 1 y 19 caracteres (mínimo no alcanzado).
- Vuelve al color gris cuando el mínimo se supera.
- Se anuncia con `aria-live="polite"` para lectores de pantalla.

---

### CA-011.11 — Accesibilidad del formulario

**Dado que** navego con teclado o lector de pantalla,
**entonces**:

- Todos los campos tienen `<label>` asociado con `htmlFor`.
- Campos requeridos tienen `aria-required="true"`.
- Campos con error tienen `aria-invalid="true"` y `aria-describedby` apuntando al mensaje de error.
- El spinner tiene `aria-busy="true"` y `aria-label` descriptivo.
- El mensaje de éxito tiene `role="status"` y `aria-live="polite"`.
- Los mensajes de error de validación tienen `role="alert"`.

---

## Diseño y UX

- **Layout**: Pantalla completa con fondo `bg-gray-950` (dark exclusivo).
- **Grid**: Dos columnas en desktop (`lg:grid-cols-3`): formulario (2 col) + info (1 col). Una columna en móvil.
- **Header**: Logo NN Auth + botón "Volver al inicio" con flecha ←.
- **Colores**: Sin degradados. Botón primario azul sólido (`bg-blue-600`). Aviso ámbar (`bg-amber-950/40`). Éxito verde (`bg-green-950/40`). Error rojo (`bg-red-950/40`).
- **Botones**: Alineados a la derecha (`flex justify-end`).
- **Tipografía**: Sans-serif (`font-sans` / sistema, no serif).
- **Sin modal**: La confirmación de éxito reemplaza el formulario en el mismo espacio.

---

## Mapa de Componentes

```
ContactPage
├── <header> — NNAuthLogo + Link "Volver al inicio"
├── <main>
│   ├── <h1> — título de la página
│   ├── <div role="note"> — aviso educativo (amber)
│   └── <div grid>
│       ├── <section> — formulario de contacto
│       │   ├── <form>
│       │   │   ├── input[name]
│       │   │   ├── input[email]
│       │   │   ├── select[subject]
│       │   │   ├── textarea[message]
│       │   │   ├── input[checkbox acceptsPrivacy]
│       │   │   └── <button type="submit"> (→ justify-end)
│       │   └── panel de éxito (condicional)
│       └── <aside> — información de contacto
│           ├── ContactInfoCard × 3 (correos ficticios)
│           ├── <dl> — teléfono, dirección, horario
│           └── plazos Ley 1581
└── <footer> — crédito educativo
```

---

## Archivos Involucrados

| Archivo                        | Tipo       | Descripción                                  |
| ------------------------------ | ---------- | -------------------------------------------- |
| `fe/src/pages/ContactPage.tsx` | Nuevo      | Página de formulario de contacto             |
| `fe/src/App.tsx`               | Modificado | Agrega import + ruta `/contacto`             |
| `fe/src/pages/LandingPage.tsx` | Modificado | Agrega enlace "Contacto" en footer legal nav |

---

## Notas de Implementación

### Por qué no se usa `LegalLayout`

`LegalLayout` está diseñado para páginas de texto legal con metadatos de fecha de
actualización y versión. El formulario de contacto requiere una estructura diferente
(grid de dos columnas, columna de información contextual, panel de éxito) por lo que
se optó por un layout independiente (`ContactPage.tsx`).

### Por qué no se usa un `<Route>` protegido

El formulario de contacto **debe ser accesible sin autenticación** porque su propósito
principal es que personas que tienen problemas para autenticarse (contraseña olvidada,
cuenta bloqueada) puedan comunicarse con el equipo.

### Por qué el envío es un mock

En el contexto educativo SENA:

- No hay un servidor de correo real configurado.
- Colocar correos reales en el código fuente expone datos personales (OWASP A02).
- El objetivo pedagógico es demostrar el **patrón** de formulario async con loading/success/error.

En producción, `handleSubmit` llamaría a `POST /api/v1/contact` con el body:

```json
{
  "name": "Ana García",
  "email": "ana@ejemplo.com",
  "subject": "consulta-general",
  "message": "Tengo una pregunta sobre..."
}
```

Y en el backend, `auth_service.py` o un servicio dedicado `contact_service.py` usaría
`fastapi-mail` para enviar el mensaje al correo del equipo (configurado en variables de entorno).

---

## Criterios de Rechazo (DoD — Definition of Done)

- ❌ Se colocan correos reales de personas en el código fuente.
- ❌ El formulario se envía sin que el checkbox de privacidad esté marcado.
- ❌ Los mensajes de error no son descriptivos (ej. solo "Error").
- ❌ El botón de envío está alineado a la izquierda o al centro.
- ❌ El formulario usa degradados de color (`gradient`).
- ❌ La ruta `/contacto` requiere autenticación.
- ❌ No hay aviso educativo visible sobre la naturaleza ficticia del formulario.
