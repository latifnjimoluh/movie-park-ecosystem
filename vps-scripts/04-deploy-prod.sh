#!/bin/bash
# vps-scripts/04-deploy-prod.sh
# Script de build et lancement PM2

PROJECT_ROOT="/var/www/movie-park"

cd $PROJECT_ROOT

echo "🔄 Mise à jour du code..."
git pull origin main

# BACKEND
echo "⚙️  Préparation du Backend..."
cd backend
npm install --production
npx sequelize-cli db:migrate
pm2 delete mip-api || true
pm2 start src/index.js --name "mip-api"

# FRONTEND USER
echo "🌐 Build du Frontend User..."
cd ../frontend-user
npm install
npm run build
pm2 delete mip-user || true
pm2 start "npm start" --name "mip-user" -- -p 3000

# FRONTEND ADMIN
echo "🔐 Build du Frontend Admin..."
cd ../frontend-admin
npm install
npm run build
pm2 delete mip-admin || true
pm2 start "npm start" --name "mip-admin" -- -p 3001

pm2 save
echo "🚀 TOUT EST EN LIGNE !"
pm2 status
