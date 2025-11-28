#!/bin/bash

# This script runs the schema.sql migration.
# It requires the following environment variables to be set:
# PGHOST - The database host
# PGPORT - The database port
# PGDATABASE - The database name
# PGUSER - The database user
# PGPASSWORD - The database password

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# The root of the project, to find the schema.sql file.
PROJECT_ROOT="$(dirname "$0")/.."
SCHEMA_FILE="$PROJECT_ROOT/schema.sql"

# --- Pre-flight checks ---
if [ -z "$PGHOST" ] || [ -z "$PGPORT" ] || [ -z "$PGDATABASE" ] || [ -z "$PGUSER" ] || [ -z "$PGPASSWORD" ]; then
  echo "Error: Please set all required PostgreSQL environment variables."
  echo "Required: PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD"
  exit 1
fi

if [ ! -f "$SCHEMA_FILE" ]; then
    echo "Error: Schema file not found at $SCHEMA_FILE"
    exit 1
fi

# --- Run Migration ---
echo "Connecting to database '$PGDATABASE' on $PGHOST:$PGPORT..."
echo "Applying migration from $SCHEMA_FILE..."
psql -f "$SCHEMA_FILE"
echo "Migration completed successfully."