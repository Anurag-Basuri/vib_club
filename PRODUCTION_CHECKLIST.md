# Production Deployment Checklist

## 🚨 CRITICAL: Before Deploying to VPS

### 1. **Get Live Cashfree API Keys**
- Login to [Cashfree Merchant Dashboard](https://merchant.cashfree.com/)
- Go to Developers → API Keys
- Generate LIVE (Production) API Keys
- ⚠️ **NEVER commit these to GitHub**

### 2. **Environment Variables for Production**
Create `.env` file on your VPS with LIVE credentials:

```env
# PRODUCTION ENVIRONMENT
NODE_ENV=production
PORT=8000

# DATABASE (Your production MongoDB)
MONGODB_URI=your_production_mongodb_uri

# JWT CONFIG
ACCESS_TOKEN_SECRET=your_super_secure_access_token_secret
REFRESH_TOKEN_SECRET=your_super_secure_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# PRODUCTION FRONTEND URL
FRONTEND_URL=https://yourdomain.com

# CASHFREE PRODUCTION SETTINGS
CASHFREE_APP_ID=your_live_app_id_from_cashfree
CASHFREE_SECRET_KEY=your_live_secret_key_from_cashfree
CASHFREE_BASE_URL=https://api.cashfree.com/pg
CASHFREE_RETURN_URL=https://yourdomain.com/payment-success
CASHFREE_NOTIFY_URL=https://yourdomain.com/api/cashfree/webhook
CASHFREE_ENVIRONMENT=production
CASHFREE_BUSINESS_NAME=Vibranta Student Organization
CASHFREE_BUSINESS_DESCRIPTION=Official Student Organization - LPU

# EMAIL CONFIG
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_email_password

# CLOUDINARY
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# SECURITY
ADMIN_SECRET=your_super_secure_admin_secret
```

### 3. **Code Changes for Production**

#### A. Frontend Environment Setup
```bash
# Copy frontend environment template
cp frontend/.env.production.template frontend/.env.production

# Edit frontend environment variables
nano frontend/.env.production
```

**Critical frontend variables to update:**
```env
VITE_BACKEND_URL=https://yourdomain.com/api
VITE_FRONTEND_URL=https://yourdomain.com
VITE_CASHFREE_MODE=production
VITE_DEBUG=false
```

#### B. Build Frontend for Production
```bash
cd frontend

# Validate environment before building
npm run check-env

# Build for production
npm run build

# The dist/ folder will contain the built files
```

### 4. **VPS Server Setup Requirements**

#### A. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y
```

#### B. Deploy Application
```bash
# Clone your repository
git clone https://github.com/Anurag-Basuri/vib_club.git
cd vib_club

# Backend setup
cd backend
npm install
# Copy your production .env file here

# Frontend setup
cd ../frontend
npm install
npm run build
```

#### C. Configure PM2 (Process Manager)
```bash
# Start backend with PM2
cd backend
pm2 start src/server.js --name "vib-club-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### D. Configure Nginx
```nginx
# /etc/nginx/sites-available/vib-club
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend (React build files)
    location / {
        root /path/to/vib_club/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
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
}
```

### 5. **SSL Certificate (HTTPS)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. **Cashfree Merchant Account Setup**

#### A. Business Verification
- Complete KYC verification
- Upload business documents
- Bank account verification

#### B. Webhook Configuration
- Set webhook URL: `https://yourdomain.com/api/cashfree/webhook`
- Configure payment success/failure notifications

#### C. Payment Methods
- Enable UPI, Cards, Net Banking, Wallets
- Set transaction limits
- Configure settlement schedule

### 7. **Database Backup Strategy**
```bash
# MongoDB backup script
#!/bin/bash
mongodump --uri="your_production_mongodb_uri" --out="/backup/$(date +%Y-%m-%d)"
```

### 8. **Monitoring & Logging**
```bash
# View application logs
pm2 logs vib-club-backend

# Monitor server resources
pm2 monit

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 9. **Security Checklist**
- [ ] Use HTTPS (SSL certificate)
- [ ] Strong environment variables
- [ ] Database authentication enabled
- [ ] Firewall configured (only ports 80, 443, 22)
- [ ] Regular security updates
- [ ] API rate limiting enabled
- [ ] CORS configured properly

### 10. **Testing Before Go-Live**
- [ ] Test payment flow with small amount
- [ ] Verify email notifications
- [ ] Check database transactions
- [ ] Test payment failure scenarios
- [ ] Verify mobile responsiveness
- [ ] Test all payment methods (UPI, Cards)

### 11. **Go-Live Steps**
1. Switch Cashfree to production mode
2. Update DNS to point to your VPS
3. Test end-to-end payment flow
4. Monitor logs for any errors
5. Have rollback plan ready

## 🔥 Critical Production Issues to Avoid

1. **Never use test API keys in production**
2. **Always use HTTPS for payment pages**
3. **Backup database before deployment**
4. **Test payment flow thoroughly**
5. **Monitor transaction logs**
6. **Have customer support ready**

## 📞 Emergency Contacts
- Cashfree Support: [support link]
- Your hosting provider support
- Database administrator contact
