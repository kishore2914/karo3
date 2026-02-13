#!/bin/bash
 
echo "Starting deployment..."
 
git pull origin main
 
echo "Installing dependencies..."
npm install --production
 
echo "Building project..."
npm run build || echo "No build step"
 
echo "Reloading PM2..."
pm2 reload backend || pm2 start server.js --name backend
 
echo "Reloading Nginx..."
sudo systemctl reload nginx
 
echo "Health check..."
sleep 5
curl -f http://localhost || exit 1
 
echo "Deployment successful!"
