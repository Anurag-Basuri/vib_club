# VPS Deployment Guide for Vib Club

## Prerequisites
- VPS with Ubuntu 20.04+ or similar
- Domain (optional - can add later)
- MongoDB Atlas account
- Cashfree production credentials
- Email account for notifications

## Step 1: Initial VPS Setup

```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 and Git
npm install -g pm2
apt install git nginx -y

# Clone repository
git clone https://github.com/Anurag-Basuri/vib_club.git
cd vib_club
```

## Step 2: Backend Configuration

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.production.template .env

# Edit environment file
nano .env
```

Update `.env` with your VPS details:
```bash
# Replace YOUR_VPS_IP with actual VPS IP
PORT=8000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
ACCESS_TOKEN_SECRET=generate_strong_secret_32_chars_min
REFRESH_TOKEN_SECRET=generate_different_strong_secret_32_chars_min
FRONTEND_URL=http://YOUR_VPS_IP:3000
CASHFREE_RETURN_URL=http://YOUR_VPS_IP:3000/payment-success
CASHFREE_NOTIFY_URL=http://YOUR_VPS_IP:8000/api/cashfree/webhook
CORS_ORIGINS=http://YOUR_VPS_IP:3000
# ... other variables
```

## Step 3: Frontend Configuration

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment template
cp .env.production.template .env.production

# Edit environment file
nano .env.production
```

Update `.env.production`:
```bash
VITE_BACKEND_URL=http://YOUR_VPS_IP:8000/api
VITE_FRONTEND_URL=http://YOUR_VPS_IP:3000
VITE_NODE_ENV=production
VITE_CASHFREE_MODE=production
```

## Step 4: Build and Deploy

```bash
# Build frontend
npm run build

# Start backend with PM2
cd ../backend
pm2 start src/server.js --name "vib-club-backend"

# Serve frontend (choose one option)

# Option A: Using PM2 with serve
npm install -g serve
cd ../frontend
pm2 start "serve -s dist -l 3000" --name "vib-club-frontend"

# Option B: Using Nginx (recommended)
# See Nginx configuration below
```

## Step 5: Nginx Configuration (Recommended)

Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/vib-club
```

Add configuration:
```nginx
# Frontend server
server {
    listen 3000;
    server_name YOUR_VPS_IP;
    
    location / {
        root /root/vib_club/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}

# Backend proxy
server {
    listen 80;
    server_name YOUR_VPS_IP;
    
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/vib-club /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: Firewall Configuration

```bash
# Allow necessary ports
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 3000
sudo ufw allow 8000
sudo ufw enable
```

## Step 7: Save PM2 Configuration

```bash
pm2 save
pm2 startup
# Follow the command output to set up auto-restart
```

## Step 8: Test Your Application

1. **Frontend**: `http://YOUR_VPS_IP:3000` or `http://YOUR_VPS_IP` (with Nginx)
2. **Backend API**: `http://YOUR_VPS_IP:8000/api/health` or `http://YOUR_VPS_IP/api/health`
3. **Payment Flow**: Test ticket purchase end-to-end

## Adding Domain Later

When you get a domain:

1. **Update DNS**: Point your domain to VPS IP
2. **Update Environment Files**: Replace IP with domain
3. **Restart Services**: `pm2 restart all`
4. **Add SSL**: Use Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

## Monitoring

```bash
# Check application status
pm2 status
pm2 logs

# Monitor system resources
htop
df -h
```

## Troubleshooting

- **Payment Callback Issues**: Ensure Cashfree webhook URL is accessible
- **CORS Errors**: Check CORS_ORIGINS in backend .env
- **Build Failures**: Ensure all environment variables are set correctly
- **Database Connection**: Verify MongoDB Atlas IP whitelist includes VPS IP
