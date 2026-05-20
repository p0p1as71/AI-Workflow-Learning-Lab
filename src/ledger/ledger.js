/**
 * ledger.js
 *
 * Append-only ledger. Runtime state authority.
 *
 * Single responsibility:
 *   if validator approves  → append to ledger
 *   if not                 → reject
 *
 * System state is derived from event history.
 * No mutable "current state" exists outside the ledger.
 */

const { validateTransition } = require("../validator/validateTransition");
const { getHistory, appendToStore, _reset } = require("./store");

function appendEvent(event) {
  const requestId = event.request_id;
  if (!requestId) {
    return { ok: false, errors: ["MISSING_REQUEST_ID: event must have a request_id"] };
  }

  const history = getHistory(requestId);
  const validation = validateTransition(event, history);

  if (!validation.valid) {
    return { ok: false, errors: validation.errors };
  }

  appendToStore(requestId, event);
  return { ok: true, event };
}

module.exports = { appendEvent, _reset };