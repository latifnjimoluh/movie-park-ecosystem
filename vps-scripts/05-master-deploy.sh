#!/bin/bash
set -euo pipefail
# vps-scripts/05-master-deploy.sh
# Déploiement complet : Git pull → Nginx → SSL → Migrations → PM2

# ─── Variables ────────────────────────────────────────────────────────────────
DOMAIN="movie-in-the-park.com"
APP_DOMAIN="app.movie-in-the-park.com"
ADMIN_DOMAIN="dashboard-admin.movie-in-the-park.com"
API_DOMAIN="api.movie-in-the-park.com"

NGINX_CONF="/etc/nginx/sites-available/movie-park"
PROJECT_ROOT="/var/www/movie-park"

# ─── Mise à jour du code ──────────────────────────────────────────────────────
echo "📥 Pull du code source..."
cd "$PROJECT_ROOT"
git pull origin main

# ─── Répertoires d'uploads (multer plante s'ils n'existent pas) ───────────────
echo "📁 Création des répertoires uploads..."
mkdir -p "$PROJECT_ROOT/backend/uploads/payments"
mkdir -p "$PROJECT_ROOT/backend/uploads/films"
mkdir -p "$PROJECT_ROOT/backend/uploads/testimonials"
mkdir -p "$PROJECT_ROOT/backend/uploads/tickets"

# ─── Configuration Nginx ──────────────────────────────────────────────────────
echo "🌐 Écriture de la configuration Nginx..."
sudo tee "$NGINX_CONF" > /dev/null <<'NGINXEOF'

# ── SITE PUBLIC (frontend-user) – Port 3000 ───────────────────────────────────
server {
    listen 80;
    server_name movie-in-the-park.com app.movie-in-the-park.com;

    # Force UTF-8 sur les réponses HTML (résout l'affichage corrompu des accents)
    charset utf-8;
    charset_types text/html text/plain text/css application/javascript application/json;

    # Nécessaire pour les uploads de preuves de paiement / affiches
    client_max_body_size 20M;

    location / {
        proxy_pass          http://localhost:3000;
        proxy_http_version  1.1;
        proxy_set_header    Upgrade $http_upgrade;
        proxy_set_header    Connection 'upgrade';
        proxy_set_header    Host $host;
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto $scheme;
        proxy_cache_bypass  $http_upgrade;
        proxy_read_timeout  120s;
        proxy_connect_timeout 10s;
    }

    # Polices / icônes → CORS + cache navigateur long
    location ~* \.(eot|otf|ttf|woff|woff2|svg)$ {
        proxy_pass         http://localhost:3000;
        proxy_set_header   Host $host;
        add_header         Access-Control-Allow-Origin "*";
        add_header         Cache-Control "public, max-age=31536000, immutable";
    }
}

# ── SITE ADMIN (frontend-admin) – Port 3001 ───────────────────────────────────
server {
    listen 80;
    server_name dashboard-admin.movie-in-the-park.com;

    charset utf-8;
    charset_types text/html text/plain text/css application/javascript application/json;

    client_max_body_size 20M;

    location / {
        proxy_pass          http://localhost:3001;
        proxy_http_version  1.1;
        proxy_set_header    Upgrade $http_upgrade;
        proxy_set_header    Connection 'upgrade';
        proxy_set_header    Host $host;
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto $scheme;
        proxy_cache_bypass  $http_upgrade;
        proxy_read_timeout  120s;
        proxy_connect_timeout 10s;
    }

    location ~* \.(eot|otf|ttf|woff|woff2|svg)$ {
        proxy_pass         http://localhost:3001;
        proxy_set_header   Host $host;
        add_header         Access-Control-Allow-Origin "*";
        add_header         Cache-Control "public, max-age=31536000, immutable";
    }
}

# ── API BACKEND – Port 5000 ────────────────────────────────────────────────────
server {
    listen 80;
    server_name api.movie-in-the-park.com;

    charset utf-8;

    # Taille max pour les uploads (affiches films, preuves de dons, photos témoignages)
    client_max_body_size 20M;

    # Fichiers statiques uploadés : servis directement par Nginx (sans passer par Node.js)
    # IMPORTANT : ce bloc doit être AVANT location / pour avoir priorité
    location /uploads/ {
        alias   /var/www/movie-park/backend/uploads/;
        add_header Access-Control-Allow-Origin "*";
        add_header Cache-Control "public, max-age=86400";
        autoindex off;
        try_files $uri =404;
    }

    location / {
        proxy_pass            http://localhost:5000;
        proxy_http_version    1.1;
        proxy_set_header      Host $host;
        proxy_set_header      X-Real-IP $remote_addr;
        proxy_set_header      X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header      X-Forwarded-Proto $scheme;
        proxy_read_timeout    60s;
        proxy_connect_timeout 10s;
    }
}

NGINXEOF

echo "🔗 Activation de la config Nginx..."
sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/movie-park

echo "🧪 Test de la config Nginx..."
sudo nginx -t

echo "🔄 Rechargement de Nginx (sans coupure)..."
sudo systemctl reload nginx

# ─── SSL ──────────────────────────────────────────────────────────────────────
echo "🔒 Obtention / Renouvellement des certificats SSL..."
sudo certbot --nginx \
    -d "$DOMAIN" -d "$APP_DOMAIN" \
    -d "$ADMIN_DOMAIN" \
    -d "$API_DOMAIN" \
    --non-interactive --agree-tos \
    -m "contact@${DOMAIN}"

# ─── PM2 — arrêt propre ───────────────────────────────────────────────────────
echo "🛑 Arrêt des services PM2 existants..."
pm2 delete all 2>/dev/null || true
pm2 flush

# ─── Backend (Port 5000) ──────────────────────────────────────────────────────
echo "⚙️  Installation et lancement du backend..."
cd "$PROJECT_ROOT/backend"
npm install --omit=dev

echo "🗃️  Exécution des migrations Sequelize..."
npm run migrate

echo "🚀 Démarrage du backend PM2..."
PORT=5000 NODE_ENV=production pm2 start src/index.js \
    --name "mip-api" \
    --time \
    --max-memory-restart 512M

# ─── Frontend public – frontend-user (Port 3000) ─────────────────────────────
echo "🌐 Build du site public (frontend-user)..."
cd "$PROJECT_ROOT/frontend-user"
npm install --omit=dev
npm run build

echo "🚀 Démarrage du site public PM2..."
PORT=3000 pm2 start npm \
    --name "mip-user" \
    --time \
    --max-memory-restart 512M \
    -- start

# ─── Frontend admin – frontend-admin (Port 3001) ─────────────────────────────
echo "🔐 Build du site admin (frontend-admin)..."
cd "$PROJECT_ROOT/frontend-admin"
npm install --omit=dev
npm run build

echo "🚀 Démarrage du site admin PM2..."
PORT=3001 pm2 start npm \
    --name "mip-admin" \
    --time \
    --max-memory-restart 512M \
    -- start

# ─── Sauvegarde PM2 ───────────────────────────────────────────────────────────
pm2 save

echo ""
echo "✅ Déploiement terminé avec succès !"
echo ""
pm2 status
echo ""
echo "🌐  Site public  → https://${APP_DOMAIN}"
echo "🔐  Admin        → https://${ADMIN_DOMAIN}"
echo "⚙️   API          → https://${API_DOMAIN}"
