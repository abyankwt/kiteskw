# KITES Backend — Setup & Deployment

## Local Development

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secrets
```

### 3. Create database (PostgreSQL)
```bash
createdb kites_db
```

### 4. Run migrations
```bash
npm run build
node -e "require('./dist/db/migrate.js')"
```

Or run SQL files manually in order:
```bash
psql -U kites_user -d kites_db -f src/db/migrations/001_create_users.sql
psql -U kites_user -d kites_db -f src/db/migrations/002_create_courses.sql
psql -U kites_user -d kites_db -f src/db/migrations/003_create_enrollments.sql
psql -U kites_user -d kites_db -f src/db/migrations/004_create_payments.sql
psql -U kites_user -d kites_db -f src/db/migrations/005_create_course_views.sql
psql -U kites_user -d kites_db -f src/db/migrations/006_seed_courses.sql
```

### 5. Create first Super Admin user
```bash
# Connect to your DB and run:
# (replace values as needed)
INSERT INTO users (email, password_hash, full_name, role)
VALUES (
  'admin@kites-kw.com',
  '$2a$12$...', -- generate with: node -e "const b=require('bcryptjs'); b.hash('YourPassword123',12).then(console.log)"
  'Admin User',
  'SUPER_ADMIN'
);
```

Or use the API after setting up a temporary open registration:
```bash
# Start dev server first, then:
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kites-kw.com","password":"YourPassword123"}'
```

### 6. Start dev server
```bash
npm run dev
```

Backend runs on http://localhost:3001

---

## Production Deployment (Plesk)

### Frontend
1. Build: `cd .. && bun run build`
2. Upload `dist/` contents to Plesk `httpdocs/`
3. The `public/.htaccess` handles SPA routing (copied to `dist/` by Vite)

### Backend
1. Upload `backend/` folder to server (e.g. `/var/www/vhosts/kites-kw.com/backend/`)
2. In Plesk → Node.js Application → set startup file: `dist/index.js`
3. Set `NODE_ENV=production` and all other env vars in Plesk's env settings
4. Run `npm install --production` then `npm run build`
5. Run migrations against production DB

### Nginx Proxy (Plesk Additional nginx directives)
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_cache_bypass $http_upgrade;
}

location /uploads/ {
    proxy_pass http://127.0.0.1:3001;
}
```

### Hesabe Setup
1. Register your server's outbound IP in the Hesabe merchant portal
2. Set all `HESABE_*` env vars with your merchant credentials
3. Set `API_BASE_URL=https://kites-kw.com` for webhook callbacks

---

## API Quick Reference

Base URL: `/api/v1`

| Endpoint | Description |
|----------|-------------|
| `POST /auth/login` | Login (returns accessToken + sets cookie) |
| `POST /auth/refresh` | Refresh session |
| `GET /courses` | List published courses |
| `POST /admin/courses` | Create course (admin) |
| `GET /admin/analytics/overview` | Dashboard KPIs |
| `POST /enrollments/checkout` | Start Hesabe payment |
| `POST /payments/webhook` | Hesabe callback |
