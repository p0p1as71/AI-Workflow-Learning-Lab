const { VALID_TRANSITIONS, ACTION_PREREQUISITES, ROLE_ACTIONS } = require('./rules');
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
  // every action must belong to a role
  // ----------------------------------------

  const ownedActions = new Set();

  for (const role of Object.keys(ROLE_ACTIONS)) {
    for (const action of ROLE_ACTIONS[role]) {
      ownedActions.add(action);
    }
  }

  for (const action of transitionStates) {
    if (!ownedActions.has(action)) {
      problems.push(`Action without owner role: ${action}`);
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


  // ----------------------------------------
  // detect cycles
  // ----------------------------------------

  const visiting = new Set();
  const visited = new Set();

  function detectCycle(state) {
    if (visiting.has(state)) {
      problems.push(`Cycle detected involving state: ${state}`);
      return;
    }

    if (visited.has(state)) {
      return;
    }

    visiting.add(state);

    const next = VALID_TRANSITIONS[state] || [];

    for (const target of next) {
      detectCycle(target);
    }

    visiting.delete(state);
    visited.add(state);
  }

  detectCycle("submitted");


  // ----------------------------------------
  // detect unreachable states
  // ----------------------------------------

  const reachable = new Set(["submitted"]);

  function walk(state) {
    const next = VALID_TRANSITIONS[state] || [];

    for (const target of next) {
      if (!reachable.has(target)) {
        reachable.add(target);
        walk(target);
      }
    }
  }

  walk("submitted");

  for (const state of runtimeStates) {
    if (!reachable.has(state)) {
      problems.push(`Unreachable state: ${state}`);
    }
  }


  return {
    valid: problems.length === 0,
    problems,
  };
}

module.exports = { validateConstitution };
