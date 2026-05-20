/**
 * replay.js
 *
 * Replay: deterministic state reconstruction from history.
 *
 * Concept: "the ledger IS the machine"
 *
 * Not a log. Not secondary auditing.
 * It is memory, causality, state, legitimacy, traceability.
 *
 * Replay does NOT mutate, does NOT write, does NOT interpret.
 * It only reproduces historical causality.
 */

const { getHistory } = require("./store");

function replayRequest(requestId) {
  const history = getHistory(requestId);
  const errors = [];

  if (history.length === 0) {
    return {
      valid: false,
      requestId,
      chain: [],
      events: 0,
      errors: ["NO_EVENTS: no events found for this request_id"],
    };
  }

  const { validateTransition } = require("../validator/validateTransition");

  for (let i = 0; i < history.length; i++) {
    const event = history[i];
    const precedingEvents = history.slice(0, i);
    const result = validateTransition(event, precedingEvents);

    if (!result.valid) {
      errors.push({
        index: i,
        event_id: event.event_id || "(no id)",
        action: event.action,
        role: event.role,
        errors: result.errors,
      });
    }
  }

  const chain = history.map((e) => `${e.role || "?"}:${e.action}`);

  return {
    valid: errors.length === 0,
    requestId,
    chain,
    events: history.length,
    errors,
  };
}

function replayAll() {
  const { getAllRequestIds } = require("./store");
  const ids = getAllRequestIds();
  let totalEvents = 0;
  const allErrors = [];

  const requests = ids.map((id) => {
    const result = replayRequest(id);
    totalEvents += result.events;
    if (!result.valid) allErrors.push({ requestId: id, errors: result.errors });
    return result;
  });

  return { valid: allErrors.length === 0, totalEvents, requests, errors: allErrors };
}

module.exports = { replayRequest, replayAll };