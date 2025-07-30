#!/bin/bash

# VPS Deployment Script for Vib Club
# Run this script on your VPS after cloning the repository

echo "🚀 Starting Vib Club Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get VPS IP
VPS_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || hostname -I | awk '{print $1}')
echo -e "${GREEN}📍 Detected VPS IP: $VPS_IP${NC}"

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo -e "${YELLOW}📦 Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 and serve
echo -e "${YELLOW}📦 Installing PM2 and serve...${NC}"
sudo npm install -g pm2 serve

# Install Nginx
echo -e "${YELLOW}📦 Installing Nginx...${NC}"
sudo apt install nginx -y

# Install dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install

echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd ../frontend
npm install

# Configure environment files
echo -e "${YELLOW}⚙️ Setting up environment files...${NC}"

# Backend environment
cd ../backend
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating backend .env from template...${NC}"
    cp .env.production.template .env
    
    # Update IP addresses in .env
    sed -i "s/YOUR_VPS_IP/$VPS_IP/g" .env
    
    echo -e "${RED}❗ IMPORTANT: Edit backend/.env file with your actual production values:${NC}"
    echo -e "${RED}   - MONGODB_URI${NC}"
    echo -e "${RED}   - ACCESS_TOKEN_SECRET${NC}"
    echo -e "${RED}   - REFRESH_TOKEN_SECRET${NC}"
    echo -e "${RED}   - EMAIL_USER and EMAIL_PASS${NC}"
    echo -e "${RED}   - CASHFREE credentials${NC}"
    echo -e "${RED}   - CLOUDINARY credentials${NC}"
    echo ""
    read -p "Press Enter after updating backend/.env file..."
fi

# Frontend environment
cd ../frontend
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}📝 Creating frontend .env.production from template...${NC}"
    cp .env.production.template .env.production
    
    # Update IP addresses in .env.production
    sed -i "s/YOUR_VPS_IP/$VPS_IP/g" .env.production
fi

# Build frontend
echo -e "${YELLOW}🏗️ Building frontend...${NC}"
npm run build

# Start application with PM2
echo -e "${YELLOW}🚀 Starting application...${NC}"
cd ../backend
pm2 start src/server.js --name "vib-club-backend"

cd ../frontend
pm2 start "serve -s dist -l 3000" --name "vib-club-frontend"

pm2 save
pm2 startup

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/vib-club > /dev/null <<EOF
server {
    listen 80;
    server_name yourdomain.com;  # Replace with your actual domain

    # Frontend (React build files)
    location / {
        root $(pwd)/../frontend/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/vib-club /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL certificate
echo "🔒 Installing SSL certificate..."
sudo apt install certbot python3-certbot-nginx -y
echo "Run: sudo certbot --nginx -d yourdomain.com"

echo "✅ Deployment completed!"
echo ""
echo "🔧 Next steps:"
echo "1. Update domain name in Nginx config: /etc/nginx/sites-available/vib-club"
echo "2. Create .env file from .env.production.template"
echo "3. Get production Cashfree API keys from merchant dashboard"
echo "4. Run: sudo certbot --nginx -d yourdomain.com"
echo "5. Test payment flow with small amount"
echo ""
echo "📊 Monitor application:"
echo "- pm2 logs vib-club-backend"
echo "- pm2 monit"
echo "- sudo tail -f /var/log/nginx/error.log"
