// Leonida Trophy Guide — production entrypoint.
// Serves the offline app from ./app on Bun. No external requests are made.
import { join } from "node:path";

const APP_DIR = join(import.meta.dir, "app");
const PORT = Number(process.env.PORT ?? 8080);

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
    const url = new URL(req.url);
    let rel = decodeURIComponent(url.pathname);
    if (rel === "/") rel = "/index.html";
    // Never let a request escape the app directory.
    const filePath = join(APP_DIR, rel);
    if (!filePath.startsWith(APP_DIR)) return new Response("Not found", { status: 404 });
    const file = Bun.file(filePath);
    if (!(await file.exists())) return new Response("Not found", { status: 404 });
    return new Response(file, {
      headers: {
        "content-type": contentType(filePath),
        "cache-control": "no-cache",
      },
    });
  },
});

console.log(`Leonida Trophy Guide running at http://localhost:${PORT}/`);
