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
- index.php          ← only CodeIgniter front controller
- .htaccess          ← removes index.php from URLs
- application/
- system/
- frontend/
- assets/

Do **not** keep extra `admin/index.php` or `shopkart-api/index.php` folders — they break clean URLs.

## After checkout
1. Create `application/config/database.php` from `database.php.server`
2. Import MySQL dump
3. Upload media `assets/uploads/` from old server
4. chmod uploads / cache / logs
5. SSL for 2deal.my

## Test (no index.php in browser)
- https://2deal.my/
- https://2deal.my/admin/login
- https://2deal.my/admin/vendor/login
- https://2deal.my/shopkart-api/site-settings

`index_page` is blank; `.htaccess` rewrites `/admin/...` and `/shopkart-api/...` into the single root `index.php`.
