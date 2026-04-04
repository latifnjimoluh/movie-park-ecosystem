#!/bin/bash
# vps-scripts/05-master-deploy.sh
# Version Optimisée "Render-Like" pour support total UTF-8 et Emojis

DOMAIN="movie-in-the-park.com"
APP_DOMAIN="app.movie-in-the-park.com"
ADMIN_DOMAIN="dashboard-admin.movie-in-the-park.com"
API_DOMAIN="api.movie-in-the-park.com"

NGINX_CONF="/etc/nginx/sites-available/movie-park"
PROJECT_ROOT="/var/www/movie-park"

echo "🌍 Configuration du système en UTF-8..."
export LANG=C.UTF-8
export LC_ALL=C.UTF-8

echo "🔄 Nettoyage de PM2..."
pm2 delete all || true
pm2 flush

echo "🌐 Configuration de Nginx (Optimisation Statique & Charset)..."
sudo bash -c "cat > $NGINX_CONF" <<EOF
# --- CONFIGURATION COMMUNE ---
map \$http_upgrade \$connection_upgrade {
    default upgrade;
    ''      close;
}

# SITE USER (Public)
server {
    listen 80;
    server_name $DOMAIN $APP_DOMAIN;
    
    # Forçage UTF-8 au niveau global
    charset utf-8;
    override_charset on;
    source_charset utf-8;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        
        # En-têtes pour assurer la bonne interprétation du contenu
        add_header Content-Type "text/html; charset=utf-8";
    }

    # Optimisation des assets Next.js (_next/static)
    location /_next/static {
        alias $PROJECT_ROOT/frontend-user/.next/static;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin *;
        types {
            text/css css;
            application/javascript js;
            font/woff2 woff2;
            font/woff woff;
            font/ttf ttf;
            image/svg+xml svg;
        }
    }

    # Support des polices et icônes
    location ~* \.(eot|otf|ttf|woff|woff2|svg)$ {
        add_header Access-Control-Allow-Origin *;
        expires 365d;
    }
}

# SITE ADMIN - Port 3001
server {
    listen 80;
    server_name $ADMIN_DOMAIN;
    charset utf-8;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
        proxy_set_header Host \$host;

        add_header Content-Type "text/html; charset=utf-8";
    }

    # Optimisation des assets Next.js pour l'Admin
    location /_next/static {
        alias $PROJECT_ROOT/frontend-admin/.next/static;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin *;
    }
}

# API BACKEND
server {
    listen 80;
    server_name $API_DOMAIN;
    charset utf-8;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        location /uploads {
            alias $PROJECT_ROOT/backend/uploads;
            add_header Access-Control-Allow-Origin *;
            autoindex off;
            # Très important pour les images des films
            expires 30d;
            add_header Cache-Control "public, no-transform";
        }
    }
}
EOF

echo "🔗 Activation de Nginx..."
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

echo "🔒 Sécurisation SSL..."
sudo certbot --nginx -d $DOMAIN -d $APP_DOMAIN -d $ADMIN_DOMAIN -d $API_DOMAIN --non-interactive --agree-tos -m contact@$DOMAIN

echo "🚀 Lancement des services avec PM2..."

# 1. Backend
cd $PROJECT_ROOT/backend
npm install --production
pm2 start src/index.js --name "mip-api"

# 2. Frontend User
cd $PROJECT_ROOT/frontend-user
npm install
npm run build
pm2 start npm --name "mip-user" -- start

# 3. Frontend Admin
cd $PROJECT_ROOT/frontend-admin
npm install
npm run build
pm2 start npm --name "mip-admin" -- start

pm2 save
echo "✅ TOUT EST EN LIGNE (OPTIMISÉ UTF-8) !"
pm2 status
