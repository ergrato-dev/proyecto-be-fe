#!/usr/bin/env bash
# ¿Qué? Script de arranque completo del sistema NN Auth.
# ¿Para qué? Levantar todos los servicios (db, be, fe, mailpit) con construcción de
#            imágenes, esperar sus healthchecks y reportar el estado final.
# ¿Impacto? Un único comando inicializa todo el entorno de desarrollo sin pasos manuales.
#
# Uso:
#   ./scripts/start.sh            # arranque normal
#   ./scripts/start.sh --no-build # omite --build (más rápido si no hay cambios en el código)

set -euo pipefail

# ─── Colores ────────────────────────────────────────────────────────────────
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
BOLD="\033[1m"
RESET="\033[0m"

# ─── Helpers ────────────────────────────────────────────────────────────────
info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*" >&2; }
header()  { echo -e "\n${BOLD}${CYAN}$*${RESET}"; }

# ─── Directorio raíz del proyecto ───────────────────────────────────────────
# ¿Qué? Resuelve la ruta absoluta del directorio raíz sin importar desde dónde
#       se ejecute el script.
# ¿Para qué? docker compose necesita encontrar el docker-compose.yml.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${PROJECT_ROOT}"

# ─── Flags ──────────────────────────────────────────────────────────────────
BUILD_FLAG="--build"
if [[ "${1:-}" == "--no-build" ]]; then
  BUILD_FLAG=""
  warn "Modo --no-build: se usarán las imágenes existentes sin reconstruir."
fi

# ─── Verificar dependencias ──────────────────────────────────────────────────
header "Verificando dependencias..."
for cmd in docker; do
  if ! command -v "${cmd}" &>/dev/null; then
    error "Comando '${cmd}' no encontrado. Instálalo antes de continuar."
    exit 1
  fi
done

if ! docker info &>/dev/null; then
  error "Docker no está corriendo. Inicia Docker Desktop o el daemon y vuelve a intentarlo."
  exit 1
fi

success "Docker disponible."

# ─── Verificar / crear be/.env ───────────────────────────────────────────────
# ¿Qué? Si be/.env no existe, lo crea automáticamente copiando be/.env.example.
# ¿Para qué? docker-compose.yml usa env_file: ./be/.env — sin ese archivo el
#            comando falla antes de levantar cualquier contenedor.
# ¿Impacto? Los valores del .env.example son seguros para desarrollo local con
#           Docker. Las variables críticas (DATABASE_URL, SECRET_KEY, etc.) son
#           sobreescritas por el bloque environment: del docker-compose.yml,
#           por lo que el sistema arranca correctamente sin edición manual.
header "Verificando archivos de entorno..."
if [[ ! -f "${PROJECT_ROOT}/be/.env" ]]; then
  if [[ -f "${PROJECT_ROOT}/be/.env.example" ]]; then
    cp "${PROJECT_ROOT}/be/.env.example" "${PROJECT_ROOT}/be/.env"
    warn "be/.env no existía — creado automáticamente desde be/.env.example."
    warn "Revisa be/.env y ajusta las variables según tu entorno si es necesario."
  else
    error "No se encontró be/.env ni be/.env.example. Crea be/.env manualmente."
    exit 1
  fi
else
  success "be/.env encontrado."
fi

# ─── Levantar servicios ──────────────────────────────────────────────────────
header "Levantando servicios..."
info "Ejecutando: docker compose up ${BUILD_FLAG} -d"
# shellcheck disable=SC2086
docker compose up ${BUILD_FLAG} -d

# ─── Esperar healthcheck de PostgreSQL ──────────────────────────────────────
header "Esperando PostgreSQL (db)..."
# ¿Qué? Consulta el estado del healthcheck del contenedor nn_auth_db hasta que sea
#       "healthy" o se agote el tiempo de espera.
# ¿Para qué? PostgreSQL necesita unos segundos para inicializar antes de aceptar conexiones.
# ¿Impacto? Sin esta espera, el backend podría fallar al intentar migrar la BD.
MAX_RETRIES=30
RETRY_INTERVAL=2
attempt=0

until [[ "$(docker inspect --format='{{.State.Health.Status}}' nn_auth_db 2>/dev/null)" == "healthy" ]]; do
  attempt=$(( attempt + 1 ))
  if (( attempt > MAX_RETRIES )); then
    error "PostgreSQL no alcanzó estado 'healthy' después de $(( MAX_RETRIES * RETRY_INTERVAL ))s."
    error "Revisa los logs: docker compose logs db"
    exit 1
  fi
  info "Esperando que db sea healthy... (intento ${attempt}/${MAX_RETRIES})"
  sleep "${RETRY_INTERVAL}"
done
success "PostgreSQL está healthy."

# ─── Esperar que el backend responda ────────────────────────────────────────
header "Esperando Backend FastAPI (be)..."
# ¿Qué? Hace polling al endpoint /health del backend hasta recibir HTTP 200.
# ¿Para qué? Confirmar que FastAPI arrancó correctamente y las migraciones se aplicaron.
# ¿Impacto? Si falla, muestra los logs para facilitar el diagnóstico.
BE_URL="http://localhost:8000/health"
attempt=0

until curl -sf "${BE_URL}" &>/dev/null; do
  attempt=$(( attempt + 1 ))
  if (( attempt > MAX_RETRIES )); then
    error "El backend no respondió en ${BE_URL} después de $(( MAX_RETRIES * RETRY_INTERVAL ))s."
    error "Revisa los logs: docker compose logs be"
    exit 1
  fi
  info "Esperando que be responda en ${BE_URL}... (intento ${attempt}/${MAX_RETRIES})"
  sleep "${RETRY_INTERVAL}"
done
success "Backend respondiendo en ${BE_URL}."

# ─── Esperar que el frontend responda ───────────────────────────────────────
header "Esperando Frontend React/Nginx (fe)..."
FE_URL="http://localhost:3000"
attempt=0

until curl -sf "${FE_URL}" &>/dev/null; do
  attempt=$(( attempt + 1 ))
  if (( attempt > MAX_RETRIES )); then
    error "El frontend no respondió en ${FE_URL} después de $(( MAX_RETRIES * RETRY_INTERVAL ))s."
    error "Revisa los logs: docker compose logs fe"
    exit 1
  fi
  info "Esperando que fe responda en ${FE_URL}... (intento ${attempt}/${MAX_RETRIES})"
  sleep "${RETRY_INTERVAL}"
done
success "Frontend respondiendo en ${FE_URL}."

# ─── Verificar Mailpit ───────────────────────────────────────────────────────
header "Verificando Mailpit..."
MAILPIT_URL="http://localhost:8025"
attempt=0

until curl -sf "${MAILPIT_URL}" &>/dev/null; do
  attempt=$(( attempt + 1 ))
  if (( attempt > 10 )); then
    warn "Mailpit no respondió en ${MAILPIT_URL} (no crítico — los demás servicios están OK)."
    break
  fi
  sleep "${RETRY_INTERVAL}"
done

if curl -sf "${MAILPIT_URL}" &>/dev/null; then
  success "Mailpit disponible en ${MAILPIT_URL}."
fi

# ─── Resumen final ──────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${GREEN}║        NN Auth System — TODOS LOS SERVICIOS OK       ║${RESET}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "  ${CYAN}Frontend${RESET}         →  http://localhost:3000"
echo -e "  ${CYAN}Backend API${RESET}      →  http://localhost:8000"
echo -e "  ${CYAN}Swagger UI${RESET}       →  http://localhost:8000/docs"
echo -e "  ${CYAN}Mailpit (emails)${RESET} →  http://localhost:8025"
echo -e "  ${CYAN}PostgreSQL${RESET}       →  localhost:5432  (nn_user / nn_auth_db)"
echo ""
echo -e "  Para detener todo: ${BOLD}./scripts/stop.sh${RESET}"
echo ""
