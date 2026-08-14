import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/** Rewrite hardcoded "/frontend/..." strings when app is served from a subfolder. */
function rewriteFrontendPaths(base: string): Plugin {
  if (base === "/frontend/") {
    return { name: "rewrite-frontend-paths-noop" };
  }
  return {
    name: "rewrite-frontend-paths",
    transform(code, id) {
      if (id.includes("node_modules") || !/\.(tsx?|jsx?)$/.test(id)) return;
      if (!code.includes("/frontend/")) return;
      return {
        code: code
          .replace(/"\/frontend\//g, `"${base}`)
          .replace(/'\/frontend\//g, `'${base}`),
        map: null,
      };
    },
  };
}

/** Dev: http://localhost:3000/ → /frontend/ (app base path). */
function rootRedirect(): Plugin {
  return {
    name: "root-redirect",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        if (url === "/" || url === "") {
          const q = req.url?.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
          res.writeHead(302, { Location: `/frontend/${q}` });
          res.end();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const appBase = (env.VITE_BASE ?? "/frontend/").replace(/\/?$/, "/");

  return {
    base: appBase,
    plugins: [react(), rewriteFrontendPaths(appBase), rootRedirect()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 3000,
      open: "/frontend/",
      proxy: {
        "/shopkart-api": {
          target: "https://superfinelabels.in/deal",
          changeOrigin: true,
        },
        "/uploads": {
          target: "https://superfinelabels.in/deal",
          changeOrigin: true,
        },
        "/deal": {
          target: "https://superfinelabels.in",
          changeOrigin: true,
        },
        "/assets": {
          target: "https://superfinelabels.in/deal",
          changeOrigin: true,
        },
        "/frontend/assets": {
          target: "https://superfinelabels.in/deal",
          changeOrigin: true,
        },
      },
    },
    build: {
      // Stay on Vite 7 / Rollup. Vite 8 (Rolldown) produced invalid ESM
      // exports (e.g. `export { Ar as s }` where Ar is nested-scoped).
      outDir: process.env.CI ? "dist" : "../",
      emptyOutDir: false,
    },
  };
});
