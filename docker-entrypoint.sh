#!/bin/sh
set -e

# Apply any pending migrations to the SQLite database on the mounted volume.
node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma

exec "$@"
