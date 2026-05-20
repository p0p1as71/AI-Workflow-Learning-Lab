/**
 * index.js
 *
 * End-to-end governance runtime demo.
 *
 * Run: node src/index.js
 */

const { appendEvent } = require("./ledger/ledger");
const { getState, getAllRequestIds } = require("./ledger/query");
const { replayAll } = require("./ledger/replay");

let _seq = 0;
function nextEventId() {
  _seq++;
  return `EVT-${String(_seq).padStart(4, "0")}`;
}

function appendAndShow(event) {
  const result = appendEvent(event);
  const status = result.ok ? "✅ ACCEPTED" : "❌ REJECTED";
  console.log(`  ${status}  ${event.action} (${event.role})`);
  if (!result.ok) {
    result.errors.forEach((err) => {
      console.log(`       └─ ${err.message}`);
    });
  }
  return result;
}

console.log("Governance Runtime Demo");

// REQ-1001 Happy path
appendAndShow({ event_id: nextEventId(), request_id: "REQ-1001", role: "intaker", action: "submitted" });
appendAndShow({ event_id: nextEventId(), request_id: "REQ-1001", role: "governor", action: "reviewed" });
appendAndShow({ event_id: nextEventId(), request_id: "REQ-1001", role: "validator", action: "validated" });
appendAndShow({ event_id: nextEventId(), request_id: "REQ-1001", role: "executor", action: "executed" });

console.log("\nLedger state:");
getAllRequestIds().forEach((id) => {
  const state = getState(id);
  console.log(`${id}: ${state.chain.join(" → ")}`);
});

console.log("\nReplay check:");
const replay = replayAll();
console.log(replay.valid ? "✅ Ledger intact" : "❌ Ledger corrupted");