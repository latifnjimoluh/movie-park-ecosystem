#!/bin/bash
# vps-scripts/05-master-deploy.sh
# Configuration Nginx + Déploiement PM2 complet

DOMAIN="movie-in-the-park.com"
APP_DOMAIN="app.movie-in-the-park.com"
ADMIN_DOMAIN="dashboard-admin.movie-in-the-park.com"
API_DOMAIN="api.movie-in-the-park.com"

NGINX_CONF="/etc/nginx/sites-available/movie-park"
PROJECT_ROOT="/var/www/movie-park"

echo "🔄 Nettoyage de PM2..."
pm2 delete all || true
pm2 flush

echo "🌐 Configuration de Nginx (Reverse Proxy)..."
sudo bash -c "cat > $NGINX_CONF" <<EOF
# SITE USER (Public) - Port 3000
server {
    listen 80;
    server_name $DOMAIN $APP_DOMAIN;
    charset utf-8;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Gestion des polices et icônes
    location ~* \.(eot|otf|ttf|woff|woff2)$ {
        add_header Access-Control-Allow-Origin *;
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
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

# API BACKEND - Port 5000
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
        
        # Autoriser l'accès aux uploads sans charset corrompu
        location /uploads {
            alias $PROJECT_ROOT/backend/uploads;
            add_header Access-Control-Allow-Origin *;
            autoindex off;
        }
    }
}
EOF

echo "🔗 Activation de la configuration Nginx..."
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

echo "🔒 Installation/Renouvellement SSL (HTTPS)..."
sudo certbot --nginx -d $DOMAIN -d $APP_DOMAIN -d $ADMIN_DOMAIN -d $API_DOMAIN --non-interactive --agree-tos -m contact@$DOMAIN

echo "🚀 Lancement des services avec PM2..."

# 1. Backend (Port 5000 par défaut dans le code)
cd $PROJECT_ROOT/backend
npm install --production
pm2 start src/index.js --name "mip-api"

# 2. Frontend User (Port 3000 via package.json)
cd $PROJECT_ROOT/frontend-user
npm install
npm run build
pm2 start npm --name "mip-user" -- start

# 3. Frontend Admin (Port 3001 via package.json)
cd $PROJECT_ROOT/frontend-admin
npm install
npm run build
pm2 start npm --name "mip-admin" -- start

pm2 save
echo "✅ TOUT EST EN LIGNE ET SÉCURISÉ !"
pm2 status
