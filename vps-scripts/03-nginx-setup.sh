#!/bin/bash
# vps-scripts/03-nginx-setup.sh
# Configuration de Nginx alignée sur les ports du projet

DOMAIN="movie-in-the-park.com"
APP_DOMAIN="app.movie-in-the-park.com"
ADMIN_DOMAIN="dashboard-admin.movie-in-the-park.com"
API_DOMAIN="api.movie-in-the-park.com"

NGINX_CONF="/etc/nginx/sites-available/movie-park"

echo "🌐 Génération de la configuration Nginx..."

sudo bash -c "cat > $NGINX_CONF" <<EOF
# SITE USER (Public) - Port 3000
server {
    listen 80;
    server_name $DOMAIN $APP_DOMAIN;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

# SITE ADMIN - Port 3001
server {
    listen 80;
    server_name $ADMIN_DOMAIN;
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
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

echo "🔗 Activation et redémarrage Nginx..."
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

echo "🔒 Installation/Renouvellement SSL..."
sudo certbot --nginx -d $DOMAIN -d $APP_DOMAIN -d $ADMIN_DOMAIN -d $API_DOMAIN --non-interactive --agree-tos -m contact@$DOMAIN

echo "✅ Configuration Terminée !"
