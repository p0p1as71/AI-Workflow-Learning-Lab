/**
 * authority/index.js
 *
 * Formal authority model.
 * Answers one question: is this actor authorized to perform this action?
 *
 * Decoupled from transition rules and validator.
 * Single responsibility: authority resolution.
 */

const AUTHORITY_SCOPES = {
  intaker:   { scope: 'intake',      actions: ['submitted', 'correction'] },
  governor:  { scope: 'governance',  actions: ['reviewed', 'approved', 'rejected', 'correction'] },
  validator: { scope: 'validation',  actions: ['validated', 'rejected', 'correction'] },
  executor:  { scope: 'execution',   actions: ['executed', 'correction'] },
};

function isAuthorized(role, action) {
  const entry = AUTHORITY_SCOPES[role];
  if (!entry) return false;
  return entry.actions.includes(action);
}

function getScope(role) {
  const entry = AUTHORITY_SCOPES[role];
  return entry ? entry.scope : null;
}

function getAuthorizedActions(role) {
  const entry = AUTHORITY_SCOPES[role];
  return entry ? entry.actions : [];
}

function getAllRoles() {
  return Object.keys(AUTHORITY_SCOPES);
}

function canSubmit(role)   { return isAuthorized(role, 'submitted'); }
function canReview(role)   { return isAuthorized(role, 'reviewed'); }
function canValidate(role) { return isAuthorized(role, 'validated'); }
function canExecute(role)  { return isAuthorized(role, 'executed'); }
function canReject(role)   { return isAuthorized(role, 'rejected'); }
function canCorrect(role)  { return isAuthorized(role, 'correction'); }

module.exports = {
  AUTHORITY_SCOPES,
  isAuthorized,
  getScope,
  getAuthorizedActions,
  getAllRoles,
  canSubmit,
  canReview,
  canValidate,
  canExecute,
  canReject,
  canCorrect,
};