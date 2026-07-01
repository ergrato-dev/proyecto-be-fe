#!/bin/sh
# ¿Qué? Entrypoint del backend — corre migraciones, valida el esquema y arranca Uvicorn.
# ¿Para qué? `alembic upgrade head` puede terminar sin errores aunque el volumen de
#            Postgres tenga un alembic_version huérfano (apuntando a head sin que las
#            tablas existan realmente) — Alembic simplemente no ve nada pendiente que aplicar.
# ¿Impacto? Sin esta validación, el contenedor arranca "sano" pero cada request revienta
#           con 500 (UndefinedTable) en producción. Con ella, el contenedor falla al arrancar
#           con un mensaje claro y el comando exacto para recuperarse.
set -e

alembic upgrade head

python -c "
from sqlalchemy import create_engine, inspect
import os, sys

engine = create_engine(os.environ['DATABASE_URL'])
tables = inspect(engine).get_table_names()
if 'users' not in tables:
    sys.stderr.write(
        'FATAL: alembic upgrade head no reporto errores pero falta la tabla \"users\".\n'
        'El volumen de Postgres quedo con alembic_version apuntando a head sin que\n'
        'las migraciones se hayan aplicado realmente (stamp huerfano). Para recuperar:\n'
        '  docker exec <container_be> alembic stamp base\n'
        '  docker exec <container_be> alembic upgrade head\n'
    )
    sys.exit(1)
"

exec uvicorn app.main:app --host 0.0.0.0 --port 8000
