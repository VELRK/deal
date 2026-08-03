# Fix: GitHub Actions deploy SSH timeout (`dial tcp …:65002: i/o timeout`)

## What happened

GitHub Actions could not open SSH to Hostinger:

```text
dial tcp 195.35.53.55:65002: i/o timeout
```

Your PC can often reach port `65002`, but **GitHub’s cloud IPs are blocked / timed out** by Hostinger. That is a network/firewall issue, not a bad `git pull` script.

## Fix (recommended): HTTPS webhook deploy

The server pulls `main` itself (outbound HTTPS to GitHub). GitHub Actions only calls a small PHP URL.

### 1) Create a long random token

Example: `openssl rand -hex 32`

### 2) On the server (once)

Create file:

`application/config/deploy_webhook_secret.php`

```php
<?php
return 'PASTE_THE_SAME_TOKEN_HERE';
```

(Use `deploy_webhook_secret.php.example` as a template.)

Make sure `deploy-webhook.php` exists in the site root (`…/public_html/deal/deploy-webhook.php`).

If the site does not have git yet:

```bash
cd /home/USER/domains/superfinelabels.in/public_html/deal
git init
git remote add origin https://github.com/VELRK/deal.git
git fetch origin main
git reset --hard origin/main
```

### 3) GitHub → Settings → Secrets and variables → Actions

| Secret | Value |
|--------|--------|
| `DEPLOY_WEBHOOK_TOKEN` | same token as the PHP file |
| `DEPLOY_WEBHOOK_URL` | `https://superfinelabels.in/deal/deploy-webhook.php` (optional; this is the default) |

Keep existing `HOST`, `USERNAME`, `SSH_KEY_ILF`, `DEPLOY_PATH` for SSH fallback.

### 4) Re-run the workflow

Actions → **Auto Deploy Hostinger** → **Run workflow**

Or push a new commit to `main`.

---

## Fallback: SSH

Workflow still tries SSH if the webhook fails, with longer timeout + TCP check.

If SSH keeps timing out from GitHub:

1. hPanel → **Advanced → SSH Access** → enable SSH  
2. Confirm `HOST` is the **SSH IP from hPanel** (not a Cloudflare-only hostname)  
3. Port is **65002** (or set secret `SSH_PORT`)  
4. Prefer the webhook above — it does not need inbound SSH from GitHub

---

## Test webhook manually

```bash
curl -X POST "https://superfinelabels.in/deal/deploy-webhook.php" \
  -H "X-Deploy-Token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"ref\":\"main\"}"
```

Success looks like:

```text
Deploy OK.
$ git fetch origin main
...
```
