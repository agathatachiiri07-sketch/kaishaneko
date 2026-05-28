const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT_DIR = process.cwd();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function resolveRequestPath(urlPathname) {
  const safePathname = decodeURIComponent(urlPathname).replace(/^\/+/, "");
  const candidatePath = safePathname === "" ? "index.html" : safePathname;
  const fullPath = path.normalize(path.join(ROOT_DIR, candidatePath));

  // Prevent reading files outside of project root.
  if (!fullPath.startsWith(ROOT_DIR)) {
    return null;
  }

  return fullPath;
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const filePath = resolveRequestPath(requestUrl.pathname);

  if (!filePath) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const finalPath = stats.isDirectory()
      ? path.join(filePath, "index.html")
      : filePath;
    const ext = path.extname(finalPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(finalPath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`Local site running on http://${HOST}:${PORT}\n`);
});
