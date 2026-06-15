#!/bin/bash

BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/gs_tools_$TIMESTAMP.dump"

echo "Taking backup from PostgreSQL..."
#docker exec gs_db pg_dump -U postgres -d gstools6 -Fc -Z 5 -f /tmp/backup.dump
docker exec gs_db pg_dump -U postgres -d gstools6 -Fc -Z 5 -f /tmp/backup.dump

echo "Copying backup file..."
docker cp gs_db:/tmp/backup.dump $BACKUP_FILE

docker exec gs_db rm /tmp/backup.dump

echo "Backup completed: $BACKUP_FILE"