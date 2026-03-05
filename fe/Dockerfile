# ========================
# NN Auth System — Dockerfile del Frontend
# ========================
# ¿Qué? Imagen Docker multi-stage para el frontend React + Vite.
# ¿Para qué? Stage 1 compila la app con pnpm; Stage 2 sirve los archivos
#            estáticos con Nginx (imagen mínima, sin Node.js en producción).
# ¿Impacto? El Stage 2 pesa ~30MB vs ~1GB+ del Stage 1 con Node y dependencias.
#           Además, Nginx es mucho más eficiente que Vite para servir archivos estáticos.

# ────────────────────────────
# Stage 1: builder
# ¿Qué? Instala dependencias con pnpm y compila la app de React en archivos estáticos.
# ¿Para qué? Generar el directorio dist/ con el HTML/JS/CSS optimizado y minificado.
# ¿Impacto? Sin este stage, no habría archivos estáticos para servir en producción.
# ────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# ¿Qué? Activa pnpm usando Corepack (incluido en Node.js 20).
# ¿Para qué? El proyecto usa pnpm exclusivamente — nunca npm ni yarn.
# ¿Impacto? Sin corepack enable, el comando `pnpm` no estará disponible en la imagen.
RUN corepack enable && corepack prepare pnpm@latest --activate

# ¿Qué? ARG para la URL de la API del backend, con valor por defecto para desarrollo.
# ¿Para qué? Vite embebe esta variable en el bundle en tiempo de build (BUILD-TIME variable).
#            Permite sobreescribir la URL desde docker-compose con `build.args`.
# ¿Impacto? Sin este ARG, la app intentaría conectarse a http://localhost:8000 desde
#            el navegador del usuario — correcto en desarrollo local, configurable en
#            otros entornos.
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# ¿Qué? Copia PRIMERO los manifiestos de dependencias antes que el código fuente.
# ¿Para qué? Optimización del caché de Docker — si el código cambia pero package.json
#            y pnpm-lock.yaml no, la capa de `pnpm install` se reutiliza del caché.
# ¿Impacto? Build hasta 5x más rápido en iteraciones sin cambios de dependencias.
COPY package.json pnpm-lock.yaml ./

# ¿Qué? Instala dependencias con --frozen-lockfile para builds reproducibles.
# ¿Para qué? Garantizar que se usen exactamente las versiones del pnpm-lock.yaml.
#            Si hay discrepancias, el comando falla (lo cual es correcto en CI/Docker).
# ¿Impacto? Sin --frozen-lockfile, pnpm podría resolver versiones distintas al lockfile,
#           causando comportamientos inesperados.
RUN pnpm install --frozen-lockfile

# ¿Qué? Copia el resto del código fuente (después de instalar dependencias).
# ¿Para qué? Separar este COPY del anterior para aprovechar el caché de dependencias.
# ¿Impacto? Los archivos en .dockerignore (node_modules, dist, .env) NO se copian.
COPY . .

# ¿Qué? Compila la aplicación React para producción.
# ¿Para qué? Genera el directorio dist/ con assets optimizados, minificados y con hash
#            de contenido para cache-busting.
# ¿Impacto? Sin esta compilación, no hay archivos estáticos para servir con Nginx.
RUN pnpm build


# ────────────────────────────
# Stage 2: runtime
# ¿Qué? Imagen final basada en Nginx Alpine para servir los archivos estáticos.
# ¿Para qué? Nginx es un servidor web de alto rendimiento — ideal para archivos estáticos.
#            Alpine lo hace extremadamente liviano (~30MB).
# ¿Impacto? Node.js, pnpm y el código fuente NO están en esta imagen final.
# ────────────────────────────
FROM nginx:alpine AS runtime

# ¿Qué? Copia la configuración de Nginx personalizada para una SPA (Single Page App).
# ¿Para qué? La configuración por defecto de Nginx no soporta React Router —
#            devolverá 404 en rutas como /dashboard o /login al recargar la página.
# ¿Impacto? Sin esta config, el enrutamiento del lado del cliente no funcionará.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ¿Qué? Copia los archivos compilados del Stage 1 al directorio de Nginx.
# ¿Para qué? Nginx servirá estos archivos estáticos cuando un navegador haga peticiones.
# ¿Impacto? Este es el contenido real de la aplicación que verán los usuarios.
COPY --from=builder /app/dist /usr/share/nginx/html

# ¿Qué? Documenta que el contenedor escucha en el puerto 80 (HTTP estándar).
# ¿Para qué? Convención Docker — el mapeo real se define en docker-compose.yml.
# ¿Impacto? Indica a los operadores qué puerto exponer o mapear.
EXPOSE 80

# Nginx se inicia automáticamente con la imagen base; CMD hereda nginx -g "daemon off;"
