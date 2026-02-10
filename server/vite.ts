import type { Express } from "express";
import type { Server } from "http";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(httpServer: Server, app: Express) {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: { server: httpServer },
    },
    appType: "spa",
    root: path.resolve(__dirname, "../client"),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../client/src"),
      },
    },
  });

  app.use(vite.middlewares);
}
