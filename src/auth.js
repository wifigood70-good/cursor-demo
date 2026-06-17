import crypto from 'node:crypto';
import { isValidEmail } from './validator.js';

const SCRYPT_KEYLEN = 64;
const DEMO_SALT = 'cursor-demo-salt';

/**
 * 비밀번호를 scrypt로 해시한다.
 * @param {string} password - 평문 비밀번호
 * @param {string} salt - salt 문자열
 * @returns {string} hex 해시
 */
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
}

/**
 * 평문 비밀번호와 저장된 해시를 비교한다.
 * @param {string} password - 평문 비밀번호
 * @param {string} stored - salt:hash 형식 저장 값
 * @returns {boolean} 일치하면 true
 */
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) {
    return false;
  }

  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  const expected = Buffer.from(hash, 'hex');
  if (derived.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(derived, expected);
}

/** @type {Array<{ id: string, email: string, passwordHash: string }>} */
const DEMO_USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    passwordHash: `${DEMO_SALT}:${hashPassword('demo-password', DEMO_SALT)}`,
  },
];

/**
 * 이메일과 비밀번호로 사용자를 인증한다.
 * @param {string} email - 로그인 이메일
 * @param {string} password - 평문 비밀번호
 * @returns {{ ok: true, userId: string, token: string } | { ok: false, error: string }}
 */
export function login(email, password) {
  if (!isValidEmail(email)) {
    return { ok: false, error: 'INVALID_CREDENTIALS' };
  }

  if (typeof password !== 'string' || password.length === 0) {
    return { ok: false, error: 'INVALID_CREDENTIALS' };
  }

  const normalizedEmail = email.toLowerCase();
  const user = DEMO_USERS.find((entry) => entry.email === normalizedEmail);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, error: 'INVALID_CREDENTIALS' };
  }

  const token = crypto.randomBytes(32).toString('hex');
  return { ok: true, userId: user.id, token };
}
