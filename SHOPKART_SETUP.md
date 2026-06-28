# ShopKart - Setup Guide

## Prerequisites
- XAMPP (PHP 7.4+, MySQL 5.7+, Apache)
- Node.js 18+
- Composer (optional, for PHP packages)

---

## Step 1: Database Setup

1. Start XAMPP (Apache + MySQL)
2. Open phpMyAdmin → `http://localhost/phpmyadmin`
3. Import the SQL file:
   ```
   database/shopkart.sql
   ```
4. This creates the `shopkart` database with all tables and seed data.

**Default Admin Login:**
- Email: `admin@shopkart.com`
- Password: `password`

---

## Step 2: CodeIgniter 3 Configuration

### Database
`application/config/database.php` is already configured for `shopkart` DB with:
- hostname: `localhost`
- username: `root`
- password: `` (empty — change if you have a MySQL password)

### Base URL
Edit `application/config/config.php`:
```php
$config['base_url'] = 'http://localhost/deal/';
```

### JWT Secret
In `application/config/config.php`:
```php
$config['jwt_secret'] = 'ShopKart_JWT_S3cr3t_2024!';  // Change in production!
```

### Sessions Table
Run this SQL to enable database sessions:
```sql
USE shopkart;
CREATE TABLE IF NOT EXISTS `ci_sessions` (
  `id`         varchar(128) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `timestamp`  int(10) unsigned DEFAULT 0 NOT NULL,
  `data`       blob NOT NULL,
  KEY `ci_sessions_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### .htaccess (Apache mod_rewrite)
Create `deal/.htaccess`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php/$1 [L]
```

Also ensure `application/config/config.php` has:
```php
$config['index_page'] = '';
```

---

## Step 3: Upload Directory

Create and set permissions:
```
deal/assets/uploads/
deal/assets/uploads/products/
deal/assets/uploads/categories/
deal/assets/uploads/settings/
```

On Windows (XAMPP), the folder is writable by default.

---

## Step 4: React Frontend Setup

```bash
cd c:/xampp/htdocs/deal/react-frontend

# Copy env file
copy src\.env.example .env

# Edit .env
# VITE_API_URL=http://localhost/deal/shopkart-api

# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev
```

### Production Build
```bash
npm run build
# Output goes to: deal/frontend/shopkart/
```

---

## Step 5: Razorpay Setup

1. Sign up at https://razorpay.com
2. Go to **Settings → API Keys**
3. Generate Test API Keys
4. Login to Admin Panel → Settings → Payment
5. Enter your **Key ID** and **Key Secret**

**Test Card for Razorpay:**
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: `1234`

---

## Step 6: Access URLs

| Resource         | URL                                          |
|-----------------|----------------------------------------------|
| Admin Panel     | `http://localhost/deal/admin`               |
| Admin Login     | `http://localhost/deal/admin/login`         |
| ShopKart Alias  | `http://localhost/deal/shopkart`            |
| React Dev       | `http://localhost:3000`                      |
| API Base        | `http://localhost/deal/shopkart-api`        |

---

## API Endpoints Reference

### Authentication
```
POST /shopkart-api/register       → Register user
POST /shopkart-api/login          → Login user
POST /shopkart-api/forgot-password → Forgot password
```

### Products
```
GET  /shopkart-api/products              → List products
GET  /shopkart-api/products?q=phone      → Search
GET  /shopkart-api/products?category_id=1
GET  /shopkart-api/products?sort=price_asc
GET  /shopkart-api/product/{id}          → Single product
GET  /shopkart-api/categories            → All categories
```

### Cart (auth optional, uses session for guests)
```
GET  /shopkart-api/cart
POST /shopkart-api/cart/add     → { product_id, quantity }
POST /shopkart-api/cart/update  → { product_id, quantity }
POST /shopkart-api/cart/remove  → { product_id }
```

### Orders (JWT required)
```
POST /shopkart-api/checkout         → Place order
GET  /shopkart-api/orders           → My orders
GET  /shopkart-api/order/{id}       → Order detail
```

### Payment (JWT required)
```
POST /shopkart-api/payment/create-order  → { order_id }
POST /shopkart-api/payment/verify        → { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id }
```

### Promo
```
POST /shopkart-api/apply-coupon  → { code, order_amount }
```

### User (JWT required)
```
GET  /shopkart-api/user/profile
PUT  /shopkart-api/user/profile
GET  /shopkart-api/user/addresses
POST /shopkart-api/user/addresses
GET  /shopkart-api/wishlist
POST /shopkart-api/wishlist/toggle  → { product_id }
POST /shopkart-api/newsletter       → { email }
```

---

## Admin Panel Features

| Section     | URL                                     |
|------------|------------------------------------------|
| Dashboard  | `/shopkart/dashboard`                    |
| Products   | `/shopkart/products`                     |
| Add Product| `/shopkart/products/add`                 |
| Categories | `/shopkart/categories`                   |
| Orders     | `/shopkart/orders`                       |
| Customers  | `/shopkart/customers`                    |
| Promo Codes| `/shopkart/promo`                        |
| Reports    | `/shopkart/reports`                      |
| Settings   | `/shopkart/settings`                     |

---

## Project Structure

```
deal/
├── application/
│   ├── config/
│   │   ├── config.php         ← Base config + JWT settings
│   │   ├── database.php       ← DB config (shopkart)
│   │   └── routes.php         ← All ShopKart routes
│   ├── controllers/
│   │   ├── admin/             ← Admin panel controllers
│   │   │   ├── Sk_Base.php
│   │   │   ├── Login.php
│   │   │   ├── Dashboard.php
│   │   │   ├── Products.php
│   │   │   ├── Categories.php
│   │   │   ├── Orders.php
│   │   │   ├── Customers.php
│   │   │   ├── Promo.php
│   │   │   ├── Reports.php
│   │   │   └── Settings.php
│   │   └── api/               ← REST API controllers
│   │       ├── Sk_Base_Api.php
│   │       ├── Sk_Auth.php
│   │       ├── Sk_Product.php
│   │       ├── Sk_Category.php
│   │       ├── Sk_Cart.php
│   │       ├── Sk_Order.php
│   │       ├── Sk_Payment.php
│   │       ├── Sk_Promo.php
│   │       └── Sk_User.php
│   ├── models/
│   │   ├── Sk_Admin_model.php
│   │   ├── Sk_Product_model.php
│   │   ├── Sk_Order_model.php
│   │   ├── Sk_User_model.php
│   │   └── Sk_Promo_model.php
│   ├── views/admin/
│   │   ├── layout/
│   │   │   ├── header.php
│   │   │   ├── sidebar.php
│   │   │   └── footer.php
│   │   ├── login.php
│   │   ├── dashboard.php
│   │   ├── products/ (list, add, edit)
│   │   ├── categories/ (list)
│   │   ├── orders/ (list, view, invoice)
│   │   ├── customers/ (list, view)
│   │   ├── promo/ (list)
│   │   ├── reports/ (index)
│   │   └── settings/ (index)
│   └── libraries/
│       └── Sk_JWT.php
├── assets/
│   ├── admin/
│   │   ├── css/admin.css
│   │   └── js/admin.js
│   └── uploads/               ← Product/category images (create this)
├── database/
│   └── shopkart.sql           ← Full database schema
├── react-frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── pages/             ← All React pages
│   │   ├── components/        ← Reusable components
│   │   ├── services/api.js    ← Axios API layer
│   │   └── store/             ← Redux Toolkit store
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── SHOPKART_SETUP.md          ← This file
```

---

## Security Checklist (Production)

- [ ] Change `jwt_secret` in config.php
- [ ] Change default admin password
- [ ] Set `ENVIRONMENT` to `production` in `index.php`
- [ ] Use HTTPS (SSL certificate)
- [ ] Set `$config['sess_cookie_name']` to something unique
- [ ] Store Razorpay keys in environment variables
- [ ] Enable CSRF for admin forms
- [ ] Set proper file upload permissions
- [ ] Configure proper CORS origins in `Sk_Base_Api.php`

---

## Email Configuration

For email notifications (order confirmation etc.), configure SMTP in:
**Admin → Settings → Email tab**

Or directly in `application/config/email.php`:
```php
$config['protocol'] = 'smtp';
$config['smtp_host'] = 'smtp.gmail.com';
$config['smtp_port'] = 587;
$config['smtp_user'] = 'your@gmail.com';
$config['smtp_pass'] = 'app_password';
```

---

## Troubleshooting

**404 on API routes?**
→ Check `.htaccess` is in project root and `AllowOverride All` in Apache config.

**Database connection failed?**
→ Verify MySQL is running and `database.php` credentials are correct.

**Razorpay popup not opening?**
→ Ensure Key ID is correct and you're on HTTPS (or localhost for dev).

**React CORS errors?**
→ The vite proxy in `vite.config.js` handles this in dev. For production, set the correct CORS origin in `Sk_Base_Api.php`.

**Session not working?**
→ Create the `ci_sessions` table (see Step 2) or switch to `file` sessions in `config.php`.
