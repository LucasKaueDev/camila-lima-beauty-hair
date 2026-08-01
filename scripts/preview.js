const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const root = process.cwd();
const port = Number(process.env.PORT || process.argv[2] || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

function sendFile(response, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "content-type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    response.end(content);
  });
}

http.createServer((request, response) => {
  const urlPath = decodeURI((request.url || "/").split("?")[0]);
  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.normalize(path.join(root, requestedPath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    sendFile(response, filePath);
    return;
  }

  sendFile(response, path.join(root, "index.html"));
}).listen(port, "127.0.0.1", () => {
  console.log(`Preview disponível em http://127.0.0.1:${port}`);
});
