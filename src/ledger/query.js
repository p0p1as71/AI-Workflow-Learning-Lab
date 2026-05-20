/**
 * query.js
 *
 * Ledger queries.
 *
 * State emerges from the sequence of valid events.
 * No mutable "current state" exists outside history.
 */

const { getHistory, getAllRequestIds } = require("./store");

function getHistoryEvents(requestId) {
  return getHistory(requestId);
}

function getState(requestId) {
  const history = getHistory(requestId);
  if (history.length === 0) {
    return { exists: false, currentAction: null, lastEvent: null, chain: [] };
  }
  const lastEvent = history[history.length - 1];
  return {
    exists: true,
    currentAction: lastEvent.action,
    lastEvent,
    chain: history.map((e) => e.action),
  };
}

function listAllRequestIds() {
  return getAllRequestIds();
}

module.exports = { getHistory: getHistoryEvents, getState, getAllRequestIds: listAllRequestIds };