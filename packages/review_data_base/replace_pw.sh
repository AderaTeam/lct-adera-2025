#!/bin/bash

# Чтение переменных из .env
set -a
source .env
set +a

# Замена переменных в SQL файле
envsubst < init-scripts/01-init.sql > init-scripts/01-init-temp.sql
mv init-scripts/01-init-temp.sql init-scripts/01-init.sql

echo "Пароли заменены в SQL файле"