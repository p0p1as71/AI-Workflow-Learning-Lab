/**
 * state/stateModel.js
 *
 * Explicit, queryable state machine.
 * Makes the constitutional state model available as an API.
 *
 * Does not enforce — that is the validator's job.
 * Only describes the formal state space.
 */

const STATES = {
  submitted:  { terminal: false, phase: 'intake' },
  reviewed:   { terminal: false, phase: 'governance' },
  approved:   { terminal: false, phase: 'governance' },
  validated:  { terminal: false, phase: 'validation' },
  executed:   { terminal: true,  phase: 'execution' },
  rejected:   { terminal: true,  phase: 'governance|validation' },
  correction: { terminal: true,  phase: 'any' },
};

const VALID_TRANSITIONS = {
  submitted:  ['reviewed', 'correction'],
  reviewed:   ['approved', 'rejected', 'correction'],
  approved:   ['validated'],
  validated:  ['executed', 'rejected', 'correction'],
  rejected:   ['correction'],
  executed:   ['correction'],
  correction: [],
};

function getAllStates() {
  return Object.keys(STATES);
}

function getStateMetadata(state) {
  return STATES[state] || null;
}

function isTerminalState(state) {
  const meta = STATES[state];
  return meta ? meta.terminal : false;
}

function getValidTransitionsFrom(state) {
  return VALID_TRANSITIONS[state] || [];
}

function isValidTransition(from, to) {
  const allowed = VALID_TRANSITIONS[from];
  return Array.isArray(allowed) && allowed.includes(to);
}

function getPhase(state) {
  const meta = STATES[state];
  return meta ? meta.phase : null;
}

module.exports = {
  getAllStates,
  getStateMetadata,
  isTerminalState,
  getValidTransitionsFrom,
  isValidTransition,
  getPhase,
  VALID_TRANSITIONS,
};