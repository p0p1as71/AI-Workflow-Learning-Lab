#!/bin/bash

cat > src/validator/checkConstitution.js <<'CHECK'
const { VALID_TRANSITIONS, ACTION_PREREQUISITES } = require('./rules');
const { STATES } = require('../state/stateModel');

function validateConstitution() {
  const transitionStates = Object.keys(VALID_TRANSITIONS);
  const prerequisiteStates = Object.keys(ACTION_PREREQUISITES);
  const runtimeStates = Object.keys(STATES);

  const problems = [];

  // ----------------------------------------
  // every transition state must exist in STATES
  // ----------------------------------------

  for (const state of transitionStates) {
    if (!runtimeStates.includes(state)) {
      problems.push(`Missing runtime state: ${state}`);
    }
  }

  // ----------------------------------------
  // every prerequisite state must exist
  // ----------------------------------------

  for (const state of prerequisiteStates) {
    if (!runtimeStates.includes(state)) {
      problems.push(`Missing prerequisite runtime state: ${state}`);
    }
  }

  // ----------------------------------------
  // every runtime state must have transitions
  // ----------------------------------------

  for (const state of runtimeStates) {
    if (!transitionStates.includes(state)) {
      problems.push(`Runtime state without transitions: ${state}`);
    }
  }

  return {
    valid: problems.length === 0,
    problems,
  };
}

module.exports = { validateConstitution };
CHECK

echo ""
echo "===== CONSTITUTION CHECK ====="

node - <<'NODE'
const { validateConstitution } = require('./src/validator/checkConstitution');

const result = validateConstitution();

if (result.valid) {
  console.log("✅ Constitutional model consistent");
} else {
  console.log("❌ Constitutional inconsistencies detected");
  console.log(result.problems);
}
NODE

echo ""
echo "===== TEST ====="

node tests/governance.test.js

