/////////// Start server.js and use alternative server method to serve frontend

const { createServer } = require('http');

const methods = Object.create(null);

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  handler(request)
    .catch(error => {
      if (error.status != null) return error;
      return { body: String(error), status: 500 };
    })
    .then(({ body, status = 200, type = 'text/plain' }) => {
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, DELETE');
      response.writeHead(status, { 'Content-Type': type });
      if (body && body.pipe) body.pipe(response);
      else response.end(body);
    });
}).listen(8000);

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed.`
  };
}

const { parse } = require('url');
const { resolve, sep } = require('path');

const baseDirectory = process.cwd();

function urlPath(url) {
  let { pathname } = parse(url);
  let path = resolve(decodeURIComponent(pathname).slice(1));
  if (path != baseDirectory && !path.startsWith(baseDirectory + sep)) {
    throw { status: 403, body: 'Forbidden' };
  }
  return path;
}

const { createReadStream } = require('fs');
const { stat, readdir } = require('fs').promises;
const mime = require('mime');

methods.GET = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != 'ENOENT') throw error;
    else return { status: 404, body: 'File not found' };
  }
  if (stats.isDirectory()) {
    return { body: (await readdir(path)).join('\n') };
  } else {
    return { body: createReadStream(path), type: mime.getType(path) };
  }
};

const { rmdir, unlink } = require('fs').promises;

methods.DELETE = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != 'ENOENT') throw error;
    else return { status: 204 };
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return { status: 204 };
};

const { createWriteStream } = require('fs');

function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on('error', reject);
    to.on('error', reject);
    to.on('finish', resolve);
    from.pipe(to);
  });
}

methods.PUT = async function(request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return { status: 204 };
};

const { mkdir } = require('fs').promises;
const { existsSync } = require('fs');

methods.MKCOL = async function(request) {
  let path = urlPath(request.url);
  if (existsSync(path)) return { status: 409, body: `${path} already exists.` };

  try {
    await mkdir(path);
    return { status: 204 };
  } catch (error) {
    throw error;
  }
};

methods.OPTIONS = async function(request) {
  return { status: 204 };
};
