#!/bin/bash

cat > src/state/stateModel.js <<'STATE'
const { VALID_TRANSITIONS } = require('../validator/rules');

const STATES = {
  submitted:  { terminal: false, phase: 'intake' },
  reviewed:   { terminal: false, phase: 'governance' },
  approved:   { terminal: false, phase: 'governance' },
  validated:  { terminal: false, phase: 'validation' },
  rejected:   { terminal: true,  phase: 'governance' },
  executed:   { terminal: true,  phase: 'execution' },
  correction: { terminal: false, phase: 'correction' },
};

function isValidTransition(from, to) {
  return (VALID_TRANSITIONS[from] || []).includes(to);
}

function getValidTransitionsFrom(state) {
  return VALID_TRANSITIONS[state] || [];
}

function getStateInfo(state) {
  return STATES[state] || null;
}

function isTerminalState(state) {
  return STATES[state]?.terminal || false;
}

function getStatePhase(state) {
  return STATES[state]?.phase || null;
}

module.exports = {
  STATES,
  isValidTransition,
  getValidTransitionsFrom,
  getStateInfo,
  isTerminalState,
  getStatePhase,
};
STATE

echo ""
echo "===== TEST ====="

node tests/governance.test.js

echo ""
echo "===== RUNTIME ====="

node src/index.js

