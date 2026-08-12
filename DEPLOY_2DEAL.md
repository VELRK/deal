# Deploy 2deal.my (public_html root)

## Branch
Use: **server-2deal**

```bash
cd ~/public_html
git fetch origin
git checkout server-2deal
git pull origin server-2deal
```

## Required layout in public_html
These must sit DIRECTLY in public_html (not inside a nested "deal" folder):

- index.php
- .htaccess
- admin/.htaccess          ← clean /admin URLs
- shopkart-api/.htaccess   ← clean /shopkart-api URLs
- application/
- system/
- frontend/index.html
- frontend/assets/
- assets/

## After checkout
1. Create `application/config/database.php` from `database.php.server` — set DB user/pass/name
2. Import MySQL dump in phpMyAdmin
3. **Upload media** `assets/uploads/` from old server (product photos often missing from git)
4. chmod 755/775: assets/uploads/, uploads/, application/cache/, application/logs/
5. Enable SSL for 2deal.my

## Test URLs (no index.php)
- Store: https://2deal.my/
- Vendor: https://2deal.my/admin/vendor/login
- Admin: https://2deal.my/admin/login
- API: https://2deal.my/shopkart-api/site-settings

Clean URLs come from root `.htaccess` + `FallbackResource` + the `admin/` and `shopkart-api/` directory bridges.

## Product images
DB paths like `assets/uploads/products/….jpg` need the real files under `public_html/assets/uploads/`.
