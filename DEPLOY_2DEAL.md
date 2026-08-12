# Deploy 2deal.my (public_html root)

## Why you saw 404
`main` frontend was built for `/deal/...` paths. On https://2deal.my/ (document root)
those assets 404, and missing Home controller made CodeIgniter show "Page Not Found".

## Branch
Use: **server-2deal**

```bash
cd ~/public_html   # or your domain document root
# If you already cloned main:
git fetch origin
git checkout server-2deal
git pull origin server-2deal
```

## Required layout in public_html
These must sit DIRECTLY in public_html (not inside a nested "deal" folder):

- index.php
- .htaccess
- application/
- system/
- frontend/index.html
- frontend/assets/
- assets/

## After checkout
1. Create `application/config/database.php` from `database.php.server` / example — set cPanel DB user/pass/name
2. Import MySQL dump in phpMyAdmin
3. chmod 755 (or 775) on: uploads/, application/cache/, application/logs/
4. Enable SSL for 2deal.my

## Test URLs
- Store: https://2deal.my/
- Admin: https://2deal.my/admin
- API:  https://2deal.my/shopkart-api/site-settings
- API fallback (if rewrite fails): https://2deal.my/index.php?/shopkart-api/site-settings

If `/shopkart-api/*` returns 404, pull latest `server-2deal` (`.htaccess` uses `index.php?/…` for cPanel).

## Local rebuild tip
```bash
cd frontend/amercereactjs
# .env.production already has VITE_BASE=/frontend/ for root domain
npm run build
```
