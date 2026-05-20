/**
 * store.js
 *
 * Internal ledger storage. Separated to avoid circular dependencies
 * between ledger.js and query.js.
 *
 * In production this would be a file, database, or event stream.
 * Here it is a Map keyed by request_id.
 */

const _store = new Map();

function _reset() {
  _store.clear();
}

function getHistory(requestId) {
  return _store.get(requestId) || [];
}

function appendToStore(requestId, event) {
  if (!_store.has(requestId)) {
    _store.set(requestId, []);
  }
  _store.get(requestId).push(event);
}

function getAllRequestIds() {
  return Array.from(_store.keys());
}

module.exports = { _reset, getHistory, appendToStore, getAllRequestIds };