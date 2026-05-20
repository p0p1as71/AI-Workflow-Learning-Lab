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
  reviewed:   ["approved", "rejected", "correction"],
  approved:   ["validated"],
  validated:  ["executed", "rejected", "correction"],
  rejected:   ["correction"],
  executed:   ["correction"],
  correction: [],
};

const ROLE_ACTIONS = {
  intaker:   ["submitted", "correction"],
  governor:  ["reviewed", "approved", "rejected", "correction"],
  validator: ["validated", "rejected", "correction"],
  executor:  ["executed", "correction"],
};

const ACTION_PREREQUISITES = {
  submitted: { requiresChain: [], requiresEvent: {}, requiresFields: {} },
  
reviewed:  { requiresChain: [{ action: "submitted" }], requiresEvent: { submitted: {} }, requiresFields: {} },

  approved:  {
    requiresChain: [{ action: "submitted" }, { action: "reviewed" }],
    requiresEvent: { reviewed: {} },
    requiresFields: {}
  },
  validated: {
    requiresChain: [
      { action: "submitted" },
      { action: "reviewed" },
      { action: "approved" },
    ],
    requiresFields: {},
  },
  rejected:  { requiresChain: [], requiresEvent: {}, requiresFields: {} },
  executed:  {
    requiresChain: [
      { action: "submitted" },
      { action: "reviewed" },
      { action: "approved" },
      { action: "validated" }
    ],
    requiresEvent: {
      submitted: {},
      reviewed: {},
      approved: {},
      validated: {}
    },
    requiresFields: {},
  },
  correction: {
    requiresChain: [
      { action: "submitted" }
    ],
    requiresEvent: {
      submitted: {}
    },
    requiresFields: {
      reason: "string"
    }
  },
};

function actionsForRole(role) {
  return ROLE_ACTIONS[role] || [];
}

module.exports = { VALID_TRANSITIONS, ROLE_ACTIONS, ACTION_PREREQUISITES, actionsForRole };