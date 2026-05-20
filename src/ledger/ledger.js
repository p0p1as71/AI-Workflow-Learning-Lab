const { validateTransition } = require("../validator/validateTransition");
const { getHistory, appendToStore, _reset } = require("./store");

function appendEvent(event) {
  const requestId = event.request_id;
  if (!requestId) {
    return { ok: false, errors: [{ ruleId: "MISSING_REQUEST_ID", message: "event must have a request_id" }] };
  }

  const history = getHistory(requestId);
  const validation = validateTransition(event, history);

  if (!validation.valid) {
    appendToStore(requestId, {
      event_id:         `BREACH-${Date.now()}`,
      request_id:       requestId,
      action:           "constitutional_breach",
      attempted_action: event.action,
      role:             event.role || "unknown",
      actor:            event.actor || "unknown",
      timestamp:        new Date().toISOString(),
      violations:       validation.errors.map(e => e.ruleId),
      errors:           validation.errors,
    });
    return { ok: false, errors: validation.errors };
  }

  appendToStore(requestId, event);
  return { ok: true, event };
}

module.exports = { appendEvent, _reset };
