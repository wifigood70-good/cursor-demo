import { isValidEmail } from './validator.js';

function extractEmails(users) {
  if (!Array.isArray(users)) {
    return [];
  }
  return users.map((user) => user.email);
}

function getValidEmails(users) {
  return extractEmails(users).filter(isValidEmail);
}

/**
 * 사용자 목록에서 유효한 이메일만 추출하고 중복을 제거한다.
 * @param {Array<{ email?: string }>} users - email 필드를 가진 사용자 객체 배열
 * @returns {string[]} 중복이 제거된 유효 이메일 목록
 */
function uniqueValidEmails(users) {
  return [...new Set(getValidEmails(users))];
}

export { isValidEmail, extractEmails, getValidEmails, uniqueValidEmails };
