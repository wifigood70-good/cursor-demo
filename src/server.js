import http from 'node:http';
import { login } from './auth.js';

const DEFAULT_PORT = 3000;

/**
 * JSON 응답을 전송한다.
 * @param {import('node:http').ServerResponse} res - HTTP 응답 객체
 * @param {number} statusCode - HTTP 상태 코드
 * @param {Record<string, unknown>} body - 응답 본문
 */
function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

/**
 * 요청 본문을 JSON으로 파싱한다.
 * @param {import('node:http').IncomingMessage} req - HTTP 요청 객체
 * @returns {Promise<Record<string, unknown>>} 파싱된 JSON 객체
 */
async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const text = Buffer.concat(chunks).toString('utf8');
  if (!text) {
    return {};
  }

  return JSON.parse(text);
}

/**
 * HTTP 서버를 생성하고 리스닝을 시작한다.
 * @param {{ port?: number, listen?: boolean }} [options] - 서버 옵션
 * @returns {import('node:http').Server}
 */
export function createAppServer(options = {}) {
  const port = options.port ?? (Number(process.env.PORT) || DEFAULT_PORT);
  const shouldListen = options.listen ?? true;

  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === 'POST' && req.url === '/api/login') {
        let body;
        try {
          body = await readJsonBody(req);
        } catch {
          sendJson(res, 400, { error: 'INVALID_JSON' });
          return;
        }

        const email = typeof body.email === 'string' ? body.email : '';
        const password = typeof body.password === 'string' ? body.password : '';
        const result = login(email, password);

        if (!result.ok) {
          sendJson(res, 401, { error: result.error });
          return;
        }

        sendJson(res, 200, { token: result.token, userId: result.userId });
        return;
      }

      sendJson(res, 404, { error: 'NOT_FOUND' });
    } catch {
      sendJson(res, 500, { error: 'INTERNAL_ERROR' });
    }
  });

  if (shouldListen) {
    server.listen(port);
  }

  return server;
}

/**
 * 서버가 리스닝을 시작할 때까지 대기한다.
 * @param {import('node:http').Server} server - HTTP 서버
 * @returns {Promise<void>}
 */
export function waitForServer(server) {
  return new Promise((resolve) => {
    if (server.listening) {
      resolve();
      return;
    }

    server.once('listening', resolve);
  });
}

/**
 * 서버의 실제 리스닝 포트를 반환한다.
 * @param {import('node:http').Server} server - HTTP 서버
 * @returns {number} 포트 번호
 */
export function getServerPort(server) {
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('서버 주소를 확인할 수 없습니다.');
  }

  return address.port;
}
