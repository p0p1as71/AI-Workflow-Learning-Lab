'use strict';
const assert = require('assert');
const { validateTransition } = require('../src/validator/validateTransition');

function runTests() {
  // 1. Happy path: submitted → reviewed → validated → executed
  let history = [];
  let result;

  result = validateTransition({ role: 'intaker', action: 'submitted' }, history);
  assert.strictEqual(result.valid, true, 'submitted should be accepted as first event');
  history.push({ role: 'intaker', action: 'submitted' });

  result = validateTransition({ role: 'governor', action: 'reviewed' }, history);
  assert.strictEqual(result.valid, true, 'reviewed should be accepted after submitted');
  history.push({ role: 'governor', action: 'reviewed' });

  result = validateTransition({ role: 'validator', action: 'validated' }, history);
  assert.strictEqual(result.valid, true, 'validated should be accepted after reviewed');
  history.push({ role: 'validator', action: 'validated' });

  result = validateTransition({ role: 'executor', action: 'executed' }, history);
  assert.strictEqual(result.valid, true, 'executed should be accepted after validated');

  // 2. Bypass: submitted → executed rejected with INVALID_TRANSITION
  history = [{ role: 'intaker', action: 'submitted' }];
  result = validateTransition({ role: 'executor', action: 'executed' }, history);
  assert.strictEqual(result.valid, false, 'executed should be rejected after submitted');
  assert.strictEqual(result.errors[0].ruleId, 'INVALID_TRANSITION');

  // 3. Rejected → validated rejected with INVALID_TRANSITION
  history = [{ role: 'intaker', action: 'rejected' }];
  result = validateTransition({ role: 'validator', action: 'validated' }, history);
  assert.strictEqual(result.valid, false, 'validated should be rejected after rejected');
  assert.strictEqual(result.errors[0].ruleId, 'INVALID_TRANSITION');

  // 4. Unauthorized role rejected with ROLE_ACTION_MISMATCH
  history = [{ role: 'intaker', action: 'submitted' }];
  result = validateTransition({ role: 'executor', action: 'submitted' }, history);
  assert.strictEqual(result.valid, false, 'executor cannot emit submitted');
  assert.strictEqual(result.errors[0].ruleId, 'ROLE_ACTION_MISMATCH');

  console.log('All governance transition validation tests passed.');
}

runTests();