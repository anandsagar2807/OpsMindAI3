# OpsMind AI - Deployment Guide

## 🚀 Production Deployment

Complete guide for deploying OpsMind AI to production environments.

---

## Prerequisites

- Node.js 18+ on server
- MongoDB Atlas production cluster
- Domain name with SSL certificate
- Gemini/OpenAI API key
- Git installed

---

## Option 1: VPS Deployment (DigitalOcean, AWS EC2, etc.)

### Step 1: Server Setup (Ubuntu 22.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Deploy Backend

```bash
# Create app directory
sudo mkdir -p /var/www/opsmind-ai
sudo chown $USER:$USER /var/www/opsmind-ai

# Clone repository
cd /var/www/opsmind-ai
git clone YOUR_REPO_URL .

# Install backend dependencies
cd backend
npm install --production

# Create production .env
nano .env
```

**Production .env:**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/opsmind-prod
JWT_SECRET=your-64-char-random-secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-production-key
EMBEDDING_PROVIDER=gemini
MAX_FILE_SIZE=20971520
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=https://opsmind.yourdomain.com
```

```bash
# Start with PM2
pm2 start src/server.js --name opsmind-backend
pm2 save
pm2 startup
```

### Step 3: Deploy Frontend

```bash
cd /var/www/opsmind-ai/frontend

# Install dependencies
npm install

# Create production .env
echo "VITE_API_URL=https://api.opsmind.yourdomain.com/api" > .env

# Build
npm run build

# Copy to Nginx directory
sudo mkdir -p /var/www/opsmind-frontend
sudo cp -r dist/* /var/www/opsmind-frontend/
```

### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/opsmind
```

```nginx
# Frontend
server {
    listen 80;
    server_name opsmind.yourdomain.com;

    root /var/www/opsmind-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}

# Backend API
server {
    listen 80;
    server_name api.opsmind.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    client_max_body_size 20M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/opsmind /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup SSL

```bash
sudo certbot --nginx -d opsmind.yourdomain.com -d api.opsmind.yourdomain.com
```

---

## Option 2: Docker Deployment

### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./backend/uploads:/app/uploads
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

```bash
docker-compose up -d
```

---

## MongoDB Atlas Production Setup

1. Create M10+ cluster for production
2. Configure IP whitelist (add server IP)
3. Create strong database user password
4. Enable automated backups
5. Set up monitoring alerts

---

## Security Checklist

- [ ] Strong JWT secret (64+ characters)
- [ ] HTTPS enabled with valid SSL
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] MongoDB IP whitelist configured
- [ ] Environment variables secured
- [ ] File upload validation active
- [ ] Firewall rules configured

---

## Monitoring

```bash
# View PM2 logs
pm2 logs opsmind-backend

# Monitor resources
pm2 monit

# Check status
pm2 status
```

---

## Backup Strategy

1. MongoDB Atlas automated backups (daily)
2. File uploads backup (weekly)
3. Git repository for code

---

## Post-Deployment Testing

```bash
# Test backend health
curl https://api.opsmind.yourdomain.com/health

# Test frontend
curl https://opsmind.yourdomain.com

# Test registration
curl -X POST https://api.opsmind.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

---

## Estimated Monthly Costs

| Service | Cost |
|---------|------|
| VPS (2GB) | $12 |
| MongoDB Atlas M10 | $57 |
| Domain + SSL | $12 |
| Gemini API | $5-20 |
| **Total** | **$86-106/mo** |

---

**Deployment Complete!** 🎉

Your OpsMind AI is now live and ready for production use.
