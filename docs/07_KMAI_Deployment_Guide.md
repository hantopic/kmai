# KMAI Deployment Guide

Document ID: KMAI-DEPLOY-001  
Version: 0.1.0  
Status: Draft  
Platform: KMAI Medical Image Reading Platform  
Last Updated: July 2026

---

## 1. Purpose

This document defines the deployment and server-operation procedures for the KMAI platform.

The deployment target is:

```text
https://ai.hantopic.kr
```

The production environment consists of:

- Ubuntu Linux VPS
- Nginx reverse proxy
- Next.js frontend
- FastAPI backend
- PostgreSQL database
- Docker containers
- HTTPS certificate
- GitHub source repository

---

## 2. Production Architecture

```text
User Browser
      ↓
https://ai.hantopic.kr
      ↓
Nginx Reverse Proxy
      │
      ├── /                    → Next.js Frontend
      ├── /api/v1/*            → FastAPI Backend
      ├── /docs                → FastAPI Swagger
      ├── /openapi.json        → FastAPI OpenAPI
      └── /uploads/*           → Uploaded Medical Images
                                  or protected backend route
      ↓
Docker Network: kmai-net
      │
      ├── kmai-frontend
      ├── kmai-backend
      └── kmai-db
```

---

## 3. Current Server Paths

Project root:

```text
/opt/kmai
```

Backend:

```text
/opt/kmai/backend
```

Frontend:

```text
/opt/kmai/frontend
```

Uploaded images:

```text
/opt/kmai/backend/uploads
```

Nginx configuration:

```text
/etc/nginx/sites-available/
```

Enabled Nginx sites:

```text
/etc/nginx/sites-enabled/
```

---

## 4. Domain Configuration

Production domain:

```text
ai.hantopic.kr
```

The DNS A record should point to the public IP address of the KMAI server.

Example:

```text
Type: A
Host: ai
Value: 114.207.245.126
```

Verify DNS resolution:

```bash
nslookup ai.hantopic.kr
```

or:

```bash
dig ai.hantopic.kr
```

---

## 5. Docker Network

Create a dedicated Docker network if it does not already exist.

```bash
docker network create kmai-net
```

Verify:

```bash
docker network ls
```

Expected network:

```text
kmai-net
```

---

## 6. PostgreSQL Deployment

Recommended container name:

```text
kmai-db
```

Recommended image:

```text
postgres:15
```

Example:

```bash
docker run -d \
  --name kmai-db \
  --network kmai-net \
  --restart always \
  -e POSTGRES_USER=kmai_user \
  -e POSTGRES_PASSWORD=CHANGE_THIS_PASSWORD \
  -e POSTGRES_DB=kmai_db \
  -v /opt/kmai/postgres-data:/var/lib/postgresql/data \
  -p 127.0.0.1:5433:5432 \
  postgres:15
```

Security requirements:

- Do not expose PostgreSQL directly to the public Internet.
- Bind the host port to `127.0.0.1`.
- Use a strong password.
- Store credentials in an environment file.
- Back up the database regularly.

Verify:

```bash
docker ps
```

Database test:

```bash
docker exec -it kmai-db \
  psql -U kmai_user -d kmai_db
```

Exit PostgreSQL:

```sql
\q
```

---

## 7. Environment Variables

Create a protected environment file.

Example location:

```text
/opt/kmai/.env.production
```

Example content:

```env
POSTGRES_USER=kmai_user
POSTGRES_PASSWORD=CHANGE_THIS_PASSWORD
POSTGRES_DB=kmai_db

DATABASE_URL=postgresql://kmai_user:CHANGE_THIS_PASSWORD@kmai-db:5432/kmai_db

JWT_SECRET_KEY=CHANGE_TO_A_LONG_RANDOM_SECRET
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

NEXT_PUBLIC_API_BASE_URL=
```

Restrict permissions:

```bash
chmod 600 /opt/kmai/.env.production
```

The environment file must not be committed to GitHub.

Add to `.gitignore`:

```text
.env
.env.*
!.env.example
```

---

## 8. Backend Syntax Check

Before every backend deployment:

```bash
cd /opt/kmai
python3 -m compileall backend/app
```

Deployment must stop if any of the following appear:

```text
SyntaxError
IndentationError
ImportError
```

---

## 9. Backend Docker Build

Build the backend image:

```bash
cd /opt/kmai

docker build \
  -t kmai-backend:latest \
  ./backend
```

Successful output:

```text
Successfully built ...
Successfully tagged kmai-backend:latest
```

---

## 10. Backend Container Deployment

Stop and remove an existing container:

```bash
docker stop kmai-backend 2>/dev/null || true
docker rm kmai-backend 2>/dev/null || true
```

Run the backend:

```bash
docker run -d \
  --name kmai-backend \
  --network kmai-net \
  --restart always \
  --env-file /opt/kmai/.env.production \
  -v /opt/kmai/backend/uploads:/app/uploads \
  -p 127.0.0.1:8010:8000 \
  kmai-backend:latest
```

Current port mapping:

```text
127.0.0.1:8010 → container:8000
```

The backend should not be exposed directly on a public host port.

---

## 11. Backend Health Check

Container status:

```bash
docker ps
```

Logs:

```bash
docker logs --tail 100 kmai-backend
```

Expected output:

```text
Application startup complete.
Uvicorn running on http://0.0.0.0:8000
```

Local health check:

```bash
curl http://127.0.0.1:8010/api/v1/health
```

Expected response:

```json
{
  "status": "ok"
}
```

Swagger test:

```bash
curl -I http://127.0.0.1:8010/docs
```

---

## 12. Frontend Pre-Deployment Test

Before production deployment:

```bash
cd /opt/kmai/frontend
npm install
npm run lint
npm run build
```

Required result:

```text
0 errors
```

Performance warnings may be reviewed separately, but build errors must be fixed before deployment.

---

## 13. Next.js Production Execution

Development mode:

```bash
npm run dev -- --hostname 0.0.0.0
```

Development mode is not recommended for permanent production operation.

Production mode:

```bash
cd /opt/kmai/frontend
npm run build
npm run start -- --hostname 0.0.0.0 --port 3000
```

Production service address:

```text
127.0.0.1:3000
```

---

## 14. Frontend systemd Service

A systemd service can keep the Next.js frontend running continuously.

Create:

```text
/etc/systemd/system/kmai-frontend.service
```

Example:

```ini
[Unit]
Description=KMAI Next.js Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/kmai/frontend
Environment=NODE_ENV=production
EnvironmentFile=/opt/kmai/.env.production
ExecStart=/usr/bin/npm run start -- --hostname 127.0.0.1 --port 3000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Reload systemd:

```bash
sudo systemctl daemon-reload
```

Enable automatic startup:

```bash
sudo systemctl enable kmai-frontend
```

Start service:

```bash
sudo systemctl start kmai-frontend
```

Status:

```bash
sudo systemctl status kmai-frontend
```

Logs:

```bash
journalctl -u kmai-frontend -n 100 --no-pager
```

Restart:

```bash
sudo systemctl restart kmai-frontend
```

---

## 15. Frontend Docker Deployment

An alternative is to run the frontend in Docker.

Recommended production Dockerfile:

```dockerfile
FROM node:20-alpine AS dependencies

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]
```

Build:

```bash
cd /opt/kmai

docker build \
  -t kmai-frontend:latest \
  ./frontend
```

Run:

```bash
docker stop kmai-frontend 2>/dev/null || true
docker rm kmai-frontend 2>/dev/null || true

docker run -d \
  --name kmai-frontend \
  --network kmai-net \
  --restart always \
  --env-file /opt/kmai/.env.production \
  -p 127.0.0.1:3000:3000 \
  kmai-frontend:latest
```

Use either systemd or Docker for the frontend, not both at the same time.

---

## 16. Nginx Configuration

Recommended configuration file:

```text
/etc/nginx/sites-available/ai.hantopic.kr
```

Example:

```nginx
server {
    server_name ai.hantopic.kr;

    client_max_body_size 100M;

    location /api/v1/ {
        proxy_pass http://127.0.0.1:8010/api/v1/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 300;
        proxy_connect_timeout 60;
        proxy_send_timeout 300;
    }

    location = /docs {
        proxy_pass http://127.0.0.1:8010/docs;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /docs/ {
        proxy_pass http://127.0.0.1:8010/docs/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /openapi.json {
        proxy_pass http://127.0.0.1:8010/openapi.json;

        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        alias /opt/kmai/backend/uploads/;

        autoindex off;
        add_header X-Content-Type-Options nosniff;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 300;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/ai.hantopic.kr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ai.hantopic.kr/privkey.pem;
}

server {
    listen 80;
    listen [::]:80;

    server_name ai.hantopic.kr;

    return 301 https://$host$request_uri;
}
```

Important:

Direct public access to `/uploads/` may not be appropriate for a future clinical deployment.

A protected backend download endpoint should eventually replace the public static upload route.

---

## 17. Enable Nginx Site

Create the symbolic link:

```bash
sudo ln -s \
  /etc/nginx/sites-available/ai.hantopic.kr \
  /etc/nginx/sites-enabled/ai.hantopic.kr
```

If the link already exists, do not recreate it.

Test configuration:

```bash
sudo nginx -t
```

Expected result:

```text
syntax is ok
test is successful
```

Reload Nginx:

```bash
sudo systemctl reload nginx
```

---

## 18. HTTPS Certificate

Install Certbot if required:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

Issue certificate:

```bash
sudo certbot --nginx -d ai.hantopic.kr
```

Test automatic renewal:

```bash
sudo certbot renew --dry-run
```

Certificate paths:

```text
/etc/letsencrypt/live/ai.hantopic.kr/fullchain.pem
/etc/letsencrypt/live/ai.hantopic.kr/privkey.pem
```

---

## 19. Production URLs

Frontend:

```text
https://ai.hantopic.kr
```

Swagger:

```text
https://ai.hantopic.kr/docs
```

OpenAPI:

```text
https://ai.hantopic.kr/openapi.json
```

Health endpoint:

```text
https://ai.hantopic.kr/api/v1/health
```

Image Repository:

```text
https://ai.hantopic.kr/images
```

Projects:

```text
https://ai.hantopic.kr/projects
```

---

## 20. Deployment Procedure

Recommended deployment sequence:

```text
1. Confirm current Git branch
2. Pull source code
3. Back up database
4. Back up uploaded files
5. Run backend syntax test
6. Run frontend lint
7. Run frontend production build
8. Apply database migration
9. Build backend image
10. Restart backend
11. Restart frontend
12. Test Nginx
13. Reload Nginx
14. Run API health check
15. Test login
16. Test image upload
17. Test Annotation CRUD
18. Test downloads
19. Update CHANGELOG
20. Create Git release tag
```

---

## 21. Git Deployment Workflow

Check branch:

```bash
cd /opt/kmai
git branch --show-current
```

Check status:

```bash
git status -sb
```

Fetch updates:

```bash
git fetch origin
```

Pull current branch:

```bash
git pull
```

Recommended release workflow:

```text
feature/*
      ↓
develop
      ↓
release/*
      ↓
main
```

Production deployment should normally use a tested release branch or tagged version.

---

## 22. Safe Deployment Script

Recommended file:

```text
/opt/kmai/scripts/deploy.sh
```

Example:

```bash
#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="/opt/kmai"

cd "$PROJECT_ROOT"

echo "1. Checking Git status"
git status -sb

echo "2. Checking backend syntax"
python3 -m compileall backend/app

echo "3. Checking frontend"
cd "$PROJECT_ROOT/frontend"
npm run lint
npm run build

echo "4. Building backend"
cd "$PROJECT_ROOT"
docker build -t kmai-backend:latest ./backend

echo "5. Restarting backend"
docker stop kmai-backend 2>/dev/null || true
docker rm kmai-backend 2>/dev/null || true

docker run -d \
  --name kmai-backend \
  --network kmai-net \
  --restart always \
  --env-file "$PROJECT_ROOT/.env.production" \
  -v "$PROJECT_ROOT/backend/uploads:/app/uploads" \
  -p 127.0.0.1:8010:8000 \
  kmai-backend:latest

echo "6. Restarting frontend"
systemctl restart kmai-frontend

echo "7. Testing Nginx"
nginx -t

echo "8. Reloading Nginx"
systemctl reload nginx

echo "9. Health check"
curl --fail https://ai.hantopic.kr/api/v1/health

echo "Deployment completed"
```

Make executable:

```bash
chmod +x /opt/kmai/scripts/deploy.sh
```

Do not use the deployment script until each command has been manually verified.

---

## 23. Database Migration

`Base.metadata.create_all()` does not modify existing tables.

Database schema changes require an explicit migration.

Recommended long-term tool:

```text
Alembic
```

Before migration:

```bash
docker exec kmai-db \
  pg_dump -U kmai_user -d kmai_db \
  > /opt/kmai/backups/kmai_db_before_migration.sql
```

After migration:

- Verify the new columns.
- Test old records.
- Test create, read, update, and delete operations.
- Retain the pre-migration backup.

---

## 24. Database Backup

Create backup directory:

```bash
mkdir -p /opt/kmai/backups/database
```

Manual backup:

```bash
docker exec kmai-db \
  pg_dump -U kmai_user -d kmai_db \
  > /opt/kmai/backups/database/kmai_db_$(date +%Y%m%d_%H%M%S).sql
```

Restore example:

```bash
cat backup.sql | \
docker exec -i kmai-db \
psql -U kmai_user -d kmai_db
```

Backups must be tested periodically.

---

## 25. Uploaded-File Backup

Create backup directory:

```bash
mkdir -p /opt/kmai/backups/uploads
```

Backup:

```bash
tar -czf \
  /opt/kmai/backups/uploads/kmai_uploads_$(date +%Y%m%d_%H%M%S).tar.gz \
  -C /opt/kmai/backend \
  uploads
```

Recommended backup targets:

- Secondary server disk
- Encrypted external storage
- Institution-approved object storage

---

## 26. Automated Backup

Example cron configuration:

```bash
crontab -e
```

Daily database backup at 03:00:

```cron
0 3 * * * docker exec kmai-db pg_dump -U kmai_user -d kmai_db > /opt/kmai/backups/database/kmai_db_$(date +\%Y\%m\%d).sql
```

Daily upload backup at 03:30:

```cron
30 3 * * * tar -czf /opt/kmai/backups/uploads/kmai_uploads_$(date +\%Y\%m\%d).tar.gz -C /opt/kmai/backend uploads
```

A retention policy should delete old backups safely.

---

## 27. Log Monitoring

Backend logs:

```bash
docker logs --tail 100 kmai-backend
```

Live backend logs:

```bash
docker logs -f kmai-backend
```

Frontend logs with systemd:

```bash
journalctl -u kmai-frontend -f
```

Nginx access log:

```bash
tail -f /var/log/nginx/access.log
```

Nginx error log:

```bash
tail -f /var/log/nginx/error.log
```

Database logs:

```bash
docker logs --tail 100 kmai-db
```

---

## 28. Service Monitoring

Docker status:

```bash
docker ps
```

Frontend status:

```bash
systemctl status kmai-frontend
```

Nginx status:

```bash
systemctl status nginx
```

Disk usage:

```bash
df -h
```

Upload directory size:

```bash
du -sh /opt/kmai/backend/uploads
```

Docker disk usage:

```bash
docker system df
```

Memory:

```bash
free -h
```

---

## 29. Troubleshooting

### Frontend connection refused

Check:

```bash
systemctl status kmai-frontend
```

or:

```bash
ss -lntp | grep 3000
```

Restart:

```bash
systemctl restart kmai-frontend
```

### Backend unavailable

Check:

```bash
docker ps
docker logs --tail 100 kmai-backend
```

Test:

```bash
curl http://127.0.0.1:8010/api/v1/health
```

### Swagger Not Found

Check Nginx routing:

```bash
sudo nginx -T | grep -n "server_name ai.hantopic.kr" -A 40
```

Verify local backend:

```bash
curl -I http://127.0.0.1:8010/docs
```

### Invalid JWT token

- Log in again.
- Remove an expired browser token.
- Verify the JWT secret has not changed unexpectedly.
- Verify frontend token-storage key.
- Check system time.

### Images not visible

Check:

```bash
ls -la /opt/kmai/backend/uploads
```

Check Nginx upload mapping:

```bash
sudo nginx -T | grep -n "location /uploads" -A 10
```

### Database unavailable

Check:

```bash
docker ps
docker logs --tail 100 kmai-db
```

Verify network:

```bash
docker network inspect kmai-net
```

---

## 30. Rollback Procedure

Before deployment, retain the previous working Docker image.

Example:

```bash
docker tag \
  kmai-backend:latest \
  kmai-backend:previous
```

If deployment fails:

```bash
docker stop kmai-backend
docker rm kmai-backend
```

Run previous image:

```bash
docker run -d \
  --name kmai-backend \
  --network kmai-net \
  --restart always \
  --env-file /opt/kmai/.env.production \
  -v /opt/kmai/backend/uploads:/app/uploads \
  -p 127.0.0.1:8010:8000 \
  kmai-backend:previous
```

Database changes may require restoring the pre-migration backup.

---

## 31. Security Hardening

Recommended production controls:

- HTTPS only
- Strong administrator password
- Short-lived access tokens
- Role-based authorization
- Firewall rules
- Fail2ban
- Rate limiting
- Protected upload routes
- Protected download routes
- File-size limits
- MIME and content validation
- Encrypted backups
- Audit logs
- Operating-system security updates
- Restricted SSH access
- SSH keys instead of password login
- No public PostgreSQL port
- Secrets outside the Git repository

---

## 32. Firewall

Example using UFW:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Verify:

```bash
sudo ufw status
```

Ports 3000, 8010, 5432, and 5433 should not be publicly opened for normal production access.

---

## 33. File Permissions

Recommended ownership should be reviewed for the actual service user.

Example:

```bash
chown -R root:root /opt/kmai
```

Upload directory must be writable by the backend container.

Do not use unrestricted permissions such as:

```text
chmod 777
```

Environment files should use:

```bash
chmod 600 /opt/kmai/.env.production
```

---

## 34. Production Validation Checklist

After deployment, test:

```text
□ HTTPS loads without certificate error
□ Login succeeds
□ Dashboard loads
□ Projects load
□ Image Repository loads
□ Image upload succeeds
□ Thumbnail appears
□ Image Viewer opens
□ Zoom and pan work
□ Annotation can be created
□ Annotation can be updated
□ Existing annotation can be deleted
□ Annotate-mode zoom works
□ Original image downloads
□ Annotated PNG downloads
□ Annotation JSON downloads
□ Swagger loads
□ Health endpoint returns success
□ Mobile browser loads
□ Browser refresh preserves routing
□ No direct patient identifier field is present
```

---

## 35. Clinical Deployment Limitations

The current KMAI version is a research and development platform.

Before professionally supervised clinical use, the following are required:

- Formal security assessment
- Privacy review
- DICOM de-identification validation
- Clinical workflow validation
- Performance validation
- User-access policy
- Audit logging
- Backup and disaster-recovery testing
- Regulatory review where applicable
- Institutional approval

The system must not be presented as autonomous diagnostic software without appropriate validation and authorization.

---

## 36. Current Deployment Status

Implemented:

- Ubuntu VPS
- Docker backend
- PostgreSQL container
- Nginx reverse proxy
- HTTPS domain
- FastAPI Swagger
- Next.js development frontend
- Local backend binding
- Persistent image-upload volume

To complete:

- Next.js production service
- Frontend automatic restart
- Consolidated Nginx frontend/backend configuration
- Protected image-download route
- Alembic migration framework
- Automated encrypted backup
- Audit logging
- Deployment script testing
- Release tagging