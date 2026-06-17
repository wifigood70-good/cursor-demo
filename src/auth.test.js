import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { login } from './auth.js';
import { createAppServer, getServerPort, waitForServer } from './server.js';

describe('login', () => {
  it('returns token for valid credentials', () => {
    const result = login('demo@example.com', 'demo-password');

    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.userId, '1');
      assert.match(result.token, /^[0-9a-f]{64}$/);
    }
  });

  it('rejects invalid email format', () => {
    const result = login('not-an-email', 'demo-password');

    assert.deepEqual(result, { ok: false, error: 'INVALID_CREDENTIALS' });
  });

  it('rejects wrong password', () => {
    const result = login('demo@example.com', 'wrong-password');

    assert.deepEqual(result, { ok: false, error: 'INVALID_CREDENTIALS' });
  });

  it('rejects unknown user', () => {
    const result = login('unknown@example.com', 'demo-password');

    assert.deepEqual(result, { ok: false, error: 'INVALID_CREDENTIALS' });
  });
});

describe('POST /api/login', () => {
  const server = createAppServer({ port: 0, listen: true });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it('returns token for valid login request', async () => {
    await waitForServer(server);
    const port = getServerPort(server);

    const response = await fetch(`http://127.0.0.1:${port}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'demo@example.com',
        password: 'demo-password',
      }),
    });

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.userId, '1');
    assert.match(body.token, /^[0-9a-f]{64}$/);
  });

  it('returns 401 for invalid credentials', async () => {
    await waitForServer(server);
    const port = getServerPort(server);

    const response = await fetch(`http://127.0.0.1:${port}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'demo@example.com',
        password: 'wrong-password',
      }),
    });

    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: 'INVALID_CREDENTIALS' });
  });

  it('returns 400 for invalid JSON body', async () => {
    await waitForServer(server);
    const port = getServerPort(server);

    const response = await fetch(`http://127.0.0.1:${port}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{',
    });

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: 'INVALID_JSON' });
  });
});
