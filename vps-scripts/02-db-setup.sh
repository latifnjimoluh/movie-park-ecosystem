#!/bin/bash
# vps-scripts/02-db-setup.sh
# Configuration de la base de données PostgreSQL avec vos identifiants fixes

DB_NAME="movie"
DB_USER="postgres"
DB_PASS="Nexus2023."

echo "🗄️ Configuration de PostgreSQL..."

# On s'assure que l'utilisateur postgres a le bon mot de passe
sudo -i -u postgres psql <<EOF
ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

echo "✅ Base de données '$DB_NAME' créée et mot de passe mis à jour pour '$DB_USER' !"
