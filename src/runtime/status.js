/**
 * runtime/status.js
 *
 * Runtime observability.
 * Returns the observable state of the system at any point in time.
 *
 * Does not mutate. Does not validate. Does not write.
 * Only reads and reports.
 */

const { getAllRequestIds, getHistory } = require('../ledger/store');
const { getState } = require('../ledger/query');
const { isTerminalState } = require('../state/stateModel');

function getSystemStatus() {
  const ids = getAllRequestIds();
  const requests = ids.map(id => {
    const stateData = getState(id);
    const history = getHistory(id);
    const lastEvent = history[history.length - 1] || null;

    return {
      requestId:     id,
      currentState:  stateData.currentAction,
      phase:         lastEvent ? lastEvent.phase : null,
      lastActor:     lastEvent ? lastEvent.actor : null,
      lastRole:      lastEvent ? lastEvent.role : null,
      lastTimestamp: lastEvent ? lastEvent.timestamp : null,
      chain:         stateData.chain,
      eventCount:    history.length,
      terminal:      isTerminalState(stateData.currentAction),
    };
  });

  const completed = requests.filter(r => r.terminal && r.currentState === 'executed').length;
  const rejected  = requests.filter(r => r.terminal && r.currentState === 'rejected').length;
  const pending   = requests.filter(r => !r.terminal).length;
  const total     = requests.length;

  return {
    summary: { total, completed, rejected, pending },
    requests,
  };
}

function printSystemStatus() {
  const status = getSystemStatus();
  console.log('\n' + '='.repeat(60));
  console.log('  Runtime Status');
  console.log('='.repeat(60));
  console.log(`\n  Total requests : ${status.summary.total}`);
  console.log(`  Completed      : ${status.summary.completed}`);
  console.log(`  Rejected       : ${status.summary.rejected}`);
  console.log(`  Pending        : ${status.summary.pending}`);
  console.log('\n  Per-request state:');
  status.requests.forEach(r => {
    const terminal = r.terminal ? '■' : '○';
    console.log(`\n  ${terminal} ${r.requestId}`);
    console.log(`    state       : ${r.currentState}`);
    console.log(`    chain       : ${r.chain.join(' → ')}`);
    console.log(`    last actor  : ${r.lastActor || '-'} (${r.lastRole || '-'})`);
    console.log(`    events      : ${r.eventCount}`);
  });
}

module.exports = { getSystemStatus, printSystemStatus };