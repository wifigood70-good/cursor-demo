import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidEmail,
  extractEmails,
  getValidEmails,
  uniqueValidEmails,
} from './email.js';

describe('isValidEmail', () => {
  it('returns true for valid emails', () => {
    assert.equal(isValidEmail('alice@example.com'), true);
    assert.equal(isValidEmail('bob@test.org'), true);
  });

  it('returns false for invalid emails', () => {
    assert.equal(isValidEmail('invalid'), false);
    assert.equal(isValidEmail('missing@domain'), false);
    assert.equal(isValidEmail(null), false);
    assert.equal(isValidEmail(123), false);
  });
});

describe('extractEmails', () => {
  it('extracts email fields from users', () => {
    const users = [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'invalid' },
    ];
    assert.deepEqual(extractEmails(users), ['alice@example.com', 'invalid']);
  });

  it('returns empty array for non-array input', () => {
    assert.deepEqual(extractEmails(null), []);
    assert.deepEqual(extractEmails(undefined), []);
  });
});

describe('getValidEmails', () => {
  it('returns only valid emails from users', () => {
    const users = [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'invalid' },
      { name: 'Carol', email: 'carol@test.org' },
    ];
    assert.deepEqual(getValidEmails(users), [
      'alice@example.com',
      'carol@test.org',
    ]);
  });

  it('returns empty array for non-array input', () => {
    assert.deepEqual(getValidEmails(null), []);
  });
});

describe('uniqueValidEmails', () => {
  it('returns unique valid emails only', () => {
    const users = [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'alice@example.com' },
      { name: 'Carol', email: 'invalid' },
      { name: 'Dave', email: 'carol@test.org' },
      { name: 'Eve', email: 'carol@test.org' },
    ];
    assert.deepEqual(uniqueValidEmails(users), [
      'alice@example.com',
      'carol@test.org',
    ]);
  });

  it('returns empty array for non-array input', () => {
    assert.deepEqual(uniqueValidEmails(null), []);
  });
});
