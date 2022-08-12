// simple_webserver based on https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework

const http = require("http");
const fs = require("fs");
const path = require("path");

const port = "12345";
const root = "www/";
const pageError = (num, error) =>
    `<!doctype html>
<html lang="en">
    <head>
        <title>${num} error</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
    </head>
    <body>
    <h1>${num} Error</h1>${
        error
            ? `
    <pre>${JSON.stringify(error, null, 2)}</pre>`
            : ""
    }
    </body>
</html>`;
const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm",
};

function getFilePath(request) {
    let filePath = `.${request.url}`;
    console.log(filePath);
    if (filePath === "./") {
        filePath = `./${root}index.html`;
    } else if (filePath.length > 2 && filePath[2] != "w") {
        filePath = root + filePath.substring(2, filePath.length);
    }
    return filePath;
}

function getContentType(filePath) {
    const extname = String(path.extname(filePath)).toLowerCase();
    return mimeTypes[extname] ?? "application/octet-stream";
}

function handleError(error, response) {
    if (error.code === "ENOENT") {
        response.writeHead(404);
        response.end(pageError("404", error), "utf-8");
    } else {
        response.writeHead(500);
        response.end(pageError("500", error), "utf-8");
    }
}

function injectRootIntoHtmlUrls(content, contentType) {
    return contentType == "text/html"
        ? content
              .toString("utf-8")
              .replace(/"\/(?=.+")/g, `"/${root}`)
              .replace(/'\/(?=.+')/g, `'/${root}`)
        : content;
}

function handleFile(filePath, response, error, content) {
    const contentType = getContentType(filePath);
    if (error) {
        handleError(error, response);
    } else {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(injectRootIntoHtmlUrls(content, contentType), "utf-8");
    }
}

http.createServer((request, response) => {
    console.log(`request ${request.url}`);
    const filePath = getFilePath(request);
    fs.readFile(filePath, (error, content) => handleFile(filePath, response, error, content));
}).listen(port);

console.log(`Server running at http://127.0.0.1:${port}/\r\n`);
