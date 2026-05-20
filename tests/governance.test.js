'use strict';
const assert = require('assert');
const { validateTransition } = require('../src/validator/validateTransition');
const {
  canExecute, canReview, canValidate, canSubmit,
  isAuthorized, getScope
} = require('../src/authority/index');
const {
  isTerminalState, isValidTransition, getValidTransitionsFrom
} = require('../src/state/stateModel');

function runTests() {
  // 1. Happy path: submitted → reviewed → validated → executed
  let history = [];
  let result;

  result = validateTransition({ role: 'intaker', action: 'submitted' }, history);
  assert.strictEqual(result.valid, true);
  history.push({ role: 'intaker', action: 'submitted' });

  result = validateTransition({ role: 'governor', action: 'reviewed' }, history);
  assert.strictEqual(result.valid, true);
  history.push({ role: 'governor', action: 'reviewed' });

  result = validateTransition({ role: 'validator', action: 'validated' }, history);
  assert.strictEqual(result.valid, true);
  history.push({ role: 'validator', action: 'validated' });

  result = validateTransition({ role: 'executor', action: 'executed' }, history);
  assert.strictEqual(result.valid, true);

  // 2. Bypass: submitted → executed
  history = [{ role: 'intaker', action: 'submitted' }];
  result = validateTransition({ role: 'executor', action: 'executed' }, history);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors[0].ruleId, 'INVALID_TRANSITION');

  // 3. Rejected → validated
  history = [{ role: 'intaker', action: 'rejected' }];
  result = validateTransition({ role: 'validator', action: 'validated' }, history);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors[0].ruleId, 'INVALID_TRANSITION');

  // 4. Unauthorized role
  history = [{ role: 'intaker', action: 'submitted' }];
  result = validateTransition({ role: 'executor', action: 'submitted' }, history);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors[0].ruleId, 'ROLE_NOT_AUTHORIZED');

  // 5. Authority model tests
  assert.strictEqual(canExecute('executor'), true);
  assert.strictEqual(canExecute('intaker'), false);
  assert.strictEqual(canReview('governor'), true);
  assert.strictEqual(canReview('executor'), false);
  assert.strictEqual(canValidate('validator'), true);
  assert.strictEqual(canSubmit('intaker'), true);
  assert.strictEqual(getScope('executor'), 'execution');
  assert.strictEqual(isAuthorized('governor', 'reviewed'), true);
  assert.strictEqual(isAuthorized('intaker', 'executed'), false);

  // 6. State model tests
  assert.strictEqual(isTerminalState('executed'), true);
  assert.strictEqual(isTerminalState('rejected'), true);
  assert.strictEqual(isTerminalState('submitted'), false);
  assert.strictEqual(isValidTransition('submitted', 'reviewed'), true);
  assert.strictEqual(isValidTransition('submitted', 'executed'), false);
  const transitions = getValidTransitionsFrom('reviewed');
  assert.ok(transitions.includes('validated'));
  assert.ok(transitions.includes('rejected'));

  console.log('All tests passed.');
}

runTests();