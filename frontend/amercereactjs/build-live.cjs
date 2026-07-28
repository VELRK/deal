/**
 * Production build for superfinelabels.in/deal
 * Temporarily ignores .env.production.local (XAMPP /deal1 override).
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = __dirname;
const localEnv = path.join(root, ".env.production.local");
const bak = path.join(root, ".env.production.local.__bak");

let moved = false;
if (fs.existsSync(localEnv)) {
  fs.renameSync(localEnv, bak);
  moved = true;
  console.log("Paused .env.production.local (using .env.production → /deal/)");
}

try {
  const r = spawnSync("npm", ["run", "build"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  process.exit(r.status ?? 1);
} finally {
  if (moved && fs.existsSync(bak)) {
    fs.renameSync(bak, localEnv);
    console.log("Restored .env.production.local");
  }
}
