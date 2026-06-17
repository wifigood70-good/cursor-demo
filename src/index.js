import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { getValidEmails, uniqueValidEmails } from './email.js';
import { login } from './auth.js';
import { createAppServer } from './server.js';

export { getValidEmails, uniqueValidEmails, login, createAppServer };

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  createAppServer();
  console.log(`로그인 API 서버가 http://localhost:${process.env.PORT ?? 3000} 에서 실행 중입니다.`);
}
