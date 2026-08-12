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
- Admin: https://2deal.my/index.php/admin
- API:  https://2deal.my/index.php/shopkart-api/site-settings

**Why `/shopkart-api` 404s:** this host does not apply `.htaccess` rewrites for those paths.
The storefront is built with `VITE_API_BASE_URL=/index.php/shopkart-api` so the browser
hits PHP directly (verified working). Admin uses `index_page=index.php` on 2deal.my.

## Local rebuild tip
```bash
cd frontend/amercereactjs
# .env.production: VITE_BASE=/frontend/ and VITE_API_BASE_URL=/index.php/shopkart-api
npm run build
```
