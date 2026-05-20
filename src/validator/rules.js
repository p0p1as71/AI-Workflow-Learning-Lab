/**
 * rules.js
 *
 * Formal definition of transition rules.
 * Representation of the operational constitution of the system.
 *
 * Each entry in VALID_TRANSITIONS defines:
 *   current state → [allowed next states]
 *
 * Each rule has a semantic identifier so errors are observable and explainable.
 */

const VALID_TRANSITIONS = {
  submitted:  ["reviewed", "correction"],
  reviewed:   ["validated", "rejected", "correction"],
  validated:  ["executed", "rejected", "correction"],
  rejected:   ["correction"],
  executed:   ["correction"],
  correction: [],
};

const ROLE_ACTIONS = {
  intaker:   ["submitted", "correction"],
  governor:  ["reviewed", "rejected", "correction"],
  validator: ["validated", "rejected", "correction"],
  executor:  ["executed", "correction"],
};

const ACTION_PREREQUISITES = {
  submitted: { requiresChain: [], requiresEvent: {}, requiresFields: {} },
  reviewed:  { requiresChain: [{ action: "submitted" }], requiresEvent: { submitted: {} }, requiresFields: {} },
  validated: {
    requiresChain: [
      { action: "submitted" },
      { action: "reviewed", field: "payload.decision", expected: "approved" },
    ],
    requiresEvent: { reviewed: { "payload.decision": "approved" } },
    requiresFields: {},
  },
  rejected:  { requiresChain: [], requiresEvent: {}, requiresFields: {} },
  executed:  {
    requiresChain: [
      { action: "submitted" },
      { action: "reviewed", field: "payload.decision", expected: "approved" },
      { action: "validated", field: "payload.result", expected: "valid" },
    ],
    requiresEvent: {
      reviewed:  { "payload.decision": "approved" },
      validated: { "payload.result": "valid" },
    },
    requiresFields: {},
  },
  correction: { requiresChain: [], requiresEvent: {}, requiresFields: { reason: "string" } },
};

function actionsForRole(role) {
  return ROLE_ACTIONS[role] || [];
}

module.exports = { VALID_TRANSITIONS, ROLE_ACTIONS, ACTION_PREREQUISITES, actionsForRole };