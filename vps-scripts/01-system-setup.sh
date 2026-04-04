#!/bin/bash
# vps-scripts/01-system-setup.sh
# Installation des dépendances système sur Ubuntu 24.04

echo "🚀 Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

echo "📦 Installation de Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "🗄️ Installation de PostgreSQL et Nginx..."
sudo apt install -y git postgresql postgresql-contrib nginx certbot python3-certbot-nginx

echo "⚙️ Installation de PM2 globalement..."
sudo npm install -g pm2

echo "✅ Système prêt !"
