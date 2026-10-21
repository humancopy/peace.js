// A tiny static server for the repo root, so pages load peace.js over http
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const types = {'.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html'};

function start() {
  const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    fs.readFile(file, (error, body) => {
      if (error) res.writeHead(404).end();
      else res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'}).end(body);
    });
  });
  // Port 0 picks a free port, so parallel runs never clash
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve({
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise(done => server.close(done)),
  })));
}

module.exports = {start};
