# HU-012 — Cambio de Idioma de la Interfaz

<!--
  ¿Qué? Historia de usuario para la internacionalización (i18n) del sistema.
  ¿Para qué? Permitir que usuarios elijan el idioma de la interfaz (español o inglés),
             aplicando las buenas prácticas de i18n en proyectos web modernos.
  ¿Impacto? Enseña a los aprendices cómo implementar i18n con react-i18next,
             cómo persistir preferencias de usuario y cómo sincronizar frontend y backend.
-->

---

## Datos Generales

| Campo            | Valor                             |
| ---------------- | --------------------------------- |
| **ID**           | HU-012                            |
| **Título**       | Cambio de idioma de la interfaz   |
| **Módulo**       | Internacionalización (i18n)       |
| **Prioridad**    | Media                             |
| **Estimación**   | 5 puntos de historia              |
| **Fase**         | Fase 9 — Internacionalización     |
| **Dependencias** | HU-001 (Registro), HU-002 (Login) |

---

## Narrativa

**Como** usuario del sistema NN Auth,
**quiero** poder cambiar el idioma de la interfaz entre español e inglés,
**para** utilizar la aplicación en el idioma que me resulte más cómodo y natural.

---

## 📚 Contexto Pedagógico

> Esta historia de usuario introduce el concepto de **internacionalización (i18n)** en el
> contexto de un proyecto real. Los aprendices aprenderán:
>
> - **¿Qué es i18n?** Proceso de diseñar software para que soporte múltiples idiomas
>   sin cambios en el código fuente. La "18" representa las 18 letras entre la "i" y la "n"
>   de "internationalization".
> - **¿Qué es l10n?** Localización — adaptar el contenido a un idioma/región específico.
>   i18n prepara el sistema; l10n añade los textos y formatos de cada idioma.
> - **¿Qué es un locale?** Identificador de idioma/región: `es` (español), `en` (inglés),
>   `es-CO` (español Colombia), `en-US` (inglés EE.UU.).
> - **¿Por qué guardar en BD?** Permite que la preferencia se restaure al iniciar sesión
>   desde cualquier dispositivo, no solo en el navegador actual.

---

## Criterios de Aceptación

### CA-012.1 — Selector de idioma visible en la interfaz

**Dado que** el usuario está en cualquier página de la app (pública o autenticada),
**cuando** accede al selector de idioma en la barra de navegación,
**entonces** este muestra las opciones disponibles: "Español" y "English".

### CA-012.2 — Cambio inmediato de idioma

**Dado que** el usuario selecciona un idioma diferente al actual,
**cuando** hace clic en la opción deseada,
**entonces** todos los textos de la interfaz cambian al nuevo idioma de forma inmediata,
sin necesidad de recargar la página.

### CA-012.3 — Persistencia en localStorage (usuario anónimo y autenticado)

**Dado que** el usuario ha cambiado el idioma,
**cuando** cierra y vuelve a abrir el navegador (o recarga la página),
**entonces** la app recuerda y aplica el idioma seleccionado anteriormente,
leyendo la preferencia guardada en `localStorage` (clave `i18nextLng`).

### CA-012.4 — Sincronización con el backend (usuario autenticado)

**Dado que** el usuario está autenticado y cambia el idioma,
**cuando** se realiza el cambio,
**entonces** el frontend envía `PATCH /api/v1/users/me/locale` con `{"locale": "es"}` o `{"locale": "en"}`,
y la preferencia queda almacenada en la columna `locale` de la tabla `users`.

### CA-012.5 — Restauración del idioma al iniciar sesión

**Dado que** el usuario tiene una preferencia de idioma guardada en la BD (`locale`),
**cuando** inicia sesión exitosamente,
**entonces** el frontend aplica el idioma almacenado en `user.locale` (recibido en el response),
actualizando `localStorage` e i18next para que la interfaz se muestre en ese idioma.

### CA-012.6 — Idioma por defecto

**Dado que** el usuario accede por primera vez (sin preferencia guardada),
**cuando** la app carga,
**entonces** se detecta automáticamente el idioma del navegador (`navigator.language`).
Si el idioma detectado no es soportado, se usa "español (`es`)" como fallback.

### CA-012.7 — Idiomas soportados

**Dado que** el sistema soporta exactamente dos idiomas,
**cuando** el usuario selecciona una opción,
**entonces** solo puede elegir `es` (Español) o `en` (English). No se aceptan otros valores.

### CA-012.8 — Textos del selector de idioma

**Dado que** el selector de idioma está en la barra de navegación,
**cuando** se muestra en español, la opción activa debe leer "Español" (no "ES") y la alternativa "English",
**y cuando** se muestra en inglés, la opción activa debe leer "English" y la alternativa "Español".

---

## Reglas de Negocio

| ID     | Regla                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------- |
| RN-073 | El idioma por defecto del sistema es `es` (español).                                              |
| RN-074 | Solo se soportan dos idiomas: `es` y `en`.                                                        |
| RN-075 | La preferencia de idioma se guarda en `localStorage` siempre.                                     |
| RN-076 | La preferencia de idioma se sincroniza con el backend solo cuando el usuario está autenticado.    |
| RN-077 | Al restaurar sesión (token válido en storage), se aplica el idioma de `user.locale`.              |
| RN-078 | El idioma del selector de idioma siempre se muestra en su idioma propio (no en el idioma activo). |
| RN-079 | El cambio de idioma es inmediato — no requiere recarga de página.                                 |
| RN-080 | El valor del locale en BD debe ser `es` o `en` — cualquier otro valor es rechazado con 422.       |

---

## Notas Técnicas

### Backend

- Agregar columna `locale VARCHAR(10) DEFAULT 'es' NOT NULL` en tabla `users`.
- Crear migración Alembic: `e5f7a9b1c3d5_add_locale_to_users`.
- Agregar campo `locale` en `UserResponse` (Pydantic).
- Crear schema `UpdateLocaleRequest` con validación de valores permitidos (`es`, `en`).
- Agregar endpoint `PATCH /api/v1/users/me/locale` — requiere autenticación.
- Agregar función `update_user_locale(db, user, locale)` en `auth_service.py`.

### Frontend

- Instalar: `react-i18next`, `i18next`, `i18next-browser-languagedetector`.
- Crear `src/locales/es/translation.json` y `src/locales/en/translation.json`.
- Crear `src/i18n.ts` — configurar i18next con detector de idioma y recursos.
- Importar `src/i18n.ts` en `main.tsx` (efecto de inicialización).
- Crear `LanguageSwitcher` component — integrado en `Navbar`.
- Adaptar todas las páginas y componentes para usar `useTranslation()`.
- Agregar lógica de sincronización en `AuthContext` cuando el usuario se autentica.
- Agregar función `updateUserLocale(locale)` en `src/api/auth.ts`.

---

## Casos de Prueba

| ID     | Escenario                                           | Resultado esperado                             |
| ------ | --------------------------------------------------- | ---------------------------------------------- |
| CP-080 | Cambiar idioma a inglés                             | Todos los textos aparecen en inglés            |
| CP-081 | Recargar página después de cambiar idioma           | Se mantiene el idioma seleccionado             |
| CP-082 | Login con usuario que tiene `locale="en"` en BD     | Interfaz se muestra en inglés post-login       |
| CP-083 | PATCH /locale con `{"locale": "fr"}` (no soportado) | 422 Unprocessable Entity                       |
| CP-084 | PATCH /locale sin autenticación                     | 401 Unauthorized                               |
| CP-085 | Cambiar idioma sin autenticación (usuario anónimo)  | Cambia en UI y localStorage, sin llamada a API |
| CP-086 | LanguageSwitcher muestra idioma activo resaltado    | El idioma seleccionado tiene indicador visual  |
