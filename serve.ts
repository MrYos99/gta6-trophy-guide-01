// Leonida Trophy Guide — dev server.
// Same static app as main.ts, on port 3000 by default, with a request log.
// Run: bun serve.ts
import { join } from "node:path";

const APP_DIR = join(import.meta.dir, "app");
const PORT = Number(process.env.PORT ?? 3000);

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function contentType(path: string): string {
  const dot = path.lastIndexOf(".");
  const ext = dot === -1 ? "" : path.slice(dot);
  return MIME[ext] ?? "application/octet-stream";
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const started = Date.now();
    const url = new URL(req.url);
    let rel = decodeURIComponent(url.pathname);
    if (rel === "/") rel = "/index.html";
    const filePath = join(APP_DIR, rel);
    let status = 200;
    let body: BodyInit;
    if (!filePath.startsWith(APP_DIR)) {
      status = 404;
      body = "Not found";
    } else {
      const file = Bun.file(filePath);
      if (!(await file.exists())) {
        status = 404;
        body = "Not found";
      } else {
        body = file;
      }
    }
    console.log(`${req.method} ${url.pathname} -> ${status} (${Date.now() - started}ms)`);
    return new Response(body, {
      status,
      headers: {
        "content-type": contentType(filePath),
        "cache-control": "no-cache",
      },
    });
  },
});

console.log(`Leonida Trophy Guide (dev) running at http://localhost:${PORT}/`);
