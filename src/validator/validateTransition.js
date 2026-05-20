/**
 * validateTransition.js
 *
 * Constitutional enforcement.
 * Does not decide business logic. Does not interpret intent. Does not improvise.
 * Only protects structural integrity.
 *
 * Role authority is now resolved via src/authority/index.js.
 * State transitions are defined in src/state/stateModel.js.
 */

const { isAuthorized, getAuthorizedActions } = require('../authority/index');
const { isValidTransition, getValidTransitionsFrom } = require('../state/stateModel');
const { ACTION_PREREQUISITES } = require('./rules');

function validateTransition(event, history) {
  const errors = [];

  // 1. Action must be known
  const knownActions = Object.keys(ACTION_PREREQUISITES);
  if (!knownActions.includes(event.action)) {
    errors.push({
      ruleId:   'UNKNOWN_ACTION',
      expected: `a valid action: [${knownActions.join(', ')}]`,
      received: event.action,
      message:  `"${event.action}" is not a valid action`,
    });
    return { valid: false, errors };
  }

  // 2. Role must be authorized to emit this action (via authority module)
  if (!isAuthorized(event.role, event.action)) {
    const allowed = getAuthorizedActions(event.role);
    errors.push({
      ruleId:   'ROLE_NOT_AUTHORIZED',
      expected: `role "${event.role}" is authorized for: [${allowed.join(', ')}]`,
      received: `${event.role} attempted "${event.action}"`,
      message:  `role "${event.role}" is not authorized to emit "${event.action}"`,
    });
  }

  // 3. Transition must be valid from current state (via state model)
  const lastEvent  = history.length > 0 ? history[history.length - 1] : null;
  const lastAction = lastEvent ? lastEvent.action : null;

  if (lastAction) {
    if (!isValidTransition(lastAction, event.action)) {
      const allowed = getValidTransitionsFrom(lastAction);
      errors.push({
        ruleId:   'INVALID_TRANSITION',
        expected: `from "${lastAction}" allowed: [${allowed.join(', ')}]`,
        received: `"${lastAction}" → "${event.action}"`,
        message:  `"${lastAction}" → "${event.action}" is not a valid transition`,
      });
    }
  } else {
    if (event.action !== 'submitted') {
      errors.push({
        ruleId:   'INVALID_TRANSITION',
        expected: '"submitted" as first event',
        received: event.action,
        message:  `Without prior events, the only valid action is "submitted", not "${event.action}"`,
      });
    }
  }

  // 4. Prerequisites (chain, event conditions, required fields)
  const prereqs = ACTION_PREREQUISITES[event.action];

  if (prereqs && prereqs.requiresChain && prereqs.requiresChain.length > 0) {
    const actionsInHistory = history.map(e => e.action);
    for (let i = 0; i < prereqs.requiresChain.length; i++) {
      const req = prereqs.requiresChain[i];
      if (actionsInHistory[i] !== req.action) {
        errors.push({
          ruleId:   'CHAIN_REQUIREMENT',
          expected: `"${req.action}" at position ${i}`,
          received: `"${actionsInHistory[i] || '(none)'}" at position ${i}"`,
          message:  `"${req.action}" is required at position ${i}"`,
        });
        break;
      }
    }
  }

  if (prereqs && prereqs.requiresEvent) {
    for (const [action, conditions] of Object.entries(prereqs.requiresEvent)) {
      const match = history.find(e => e.action === action);
      if (!match && Object.keys(conditions).length > 0) {
        errors.push({
          ruleId:   'PREREQUISITE_EVENT_MISSING',
          expected: `prior event "${action}"`,
          received: `no "${action}" in history for ${event.request_id}"`,
          message:  `A prior "${action}" event is required"`,
        });
        continue;
      }
      for (const [fieldPath, expectedValue] of Object.entries(conditions)) {
        if (match) {
          const actualValue = getNestedValue(match, fieldPath);
          if (actualValue !== expectedValue) {
            errors.push({
              ruleId:   'PREREQUISITE_FIELD_MISMATCH',
              expected: `${fieldPath} = "${expectedValue}"`,
              received: `${fieldPath} = "${actualValue}"`,
              message:  `In event "${action}" expected ${fieldPath} === "${expectedValue}", found "${actualValue}"`,
            });
          }
        }
      }
    }
  }

  if (prereqs && prereqs.requiresFields) {
    for (const [field, expectedType] of Object.entries(prereqs.requiresFields)) {
      const value = event[field];
      if (value === undefined || value === null) {
        errors.push({
          ruleId:   'REQUIRED_FIELD_MISSING',
          expected: `field "${field}" of type "${expectedType}"`,
          received: `"${field}" not present"`,
          message:  `Field "${field}" is required for "${event.action}"`,
        });
      } else if (typeof value !== expectedType) {
        errors.push({
          ruleId:   'REQUIRED_FIELD_TYPE',
          expected: `"${field}" of type "${expectedType}"`,
          received: `"${field}" is type "${typeof value}"`,
          message:  `Field "${field}" must be "${expectedType}", found "${typeof value}"`,
        });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

module.exports = { validateTransition };