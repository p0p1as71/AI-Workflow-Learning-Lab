/**
 * validateTransition.js
 *
 * Constitutional enforcement.
 * Does not decide business logic, does not interpret intent, does not improvise.
 * Only protects structural integrity.
 */

const { VALID_TRANSITIONS, ACTION_PREREQUISITES, actionsForRole } = require("./rules");

function validateTransition(event, history) {
  const errors = [];

  if (!VALID_TRANSITIONS[event.action]) {
    errors.push({
      ruleId: "UNKNOWN_ACTION",
      expected: `a valid action: [${Object.keys(VALID_TRANSITIONS).join(", ")}]`,
      received: event.action,
      message: `"${event.action}" is not a valid action`,
    });
    return { valid: false, errors };
  }

  const allowedActions = actionsForRole(event.role);
  if (!allowedActions.includes(event.action)) {
    errors.push({
      ruleId: "ROLE_ACTION_MISMATCH",
      expected: `role "${event.role}" can emit: [${allowedActions.join(", ")}]`,
      received: `${event.role} emitted "${event.action}"`,
      message: `role "${event.role}" cannot emit "${event.action}"`,
    });
  }

  const lastEvent = history.length > 0 ? history[history.length - 1] : null;
  const lastAction = lastEvent ? lastEvent.action : null;

  if (lastAction) {
    const allowedNext = VALID_TRANSITIONS[lastAction];
    if (!allowedNext || !allowedNext.includes(event.action)) {
      errors.push({
        ruleId: "INVALID_TRANSITION",
        expected: `from "${lastAction}" allowed: [${(allowedNext || []).join(", ")}]`,
        received: `"${lastAction}" → "${event.action}"`,
        message: `"${lastAction}" → "${event.action}" is not a valid transition`,
      });
    }
  } else {
    if (event.action !== "submitted") {
      errors.push({
        ruleId: "INVALID_TRANSITION",
        expected: '"submitted" as first event',
        received: event.action,
        message: `Without prior events, the only valid action is "submitted", not "${event.action}"`,
      });
    }
  }

  const prereqs = ACTION_PREREQUISITES[event.action];

  if (prereqs && prereqs.requiresChain && prereqs.requiresChain.length > 0) {
    const actionsInHistory = history.map((e) => e.action);
    for (let i = 0; i < prereqs.requiresChain.length; i++) {
      const requirement = prereqs.requiresChain[i];
      const expectedAction = requirement.action;
      if (actionsInHistory[i] !== expectedAction) {
        errors.push({
          ruleId: "CHAIN_REQUIREMENT",
          expected: `"${expectedAction}" at position ${i}`,
          received: `"${actionsInHistory[i] || "(none)"}" at position ${i}`,
          message: `"${expectedAction}" is required at position ${i}`,
        });
        break;
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateTransition };