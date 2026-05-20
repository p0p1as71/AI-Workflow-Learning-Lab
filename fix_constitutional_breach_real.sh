#!/bin/bash

python3 <<'PY'
from pathlib import Path

# =====================================================
# PATCH src/index.js
# =====================================================

p = Path("src/index.js")
txt = p.read_text()

old = '''  if (!result.valid) {
    console.log(`  ❌ REJECTED  ${event.action} (${event.role})`);

    for (const error of result.errors) {
      console.log(`       └─ ${error.message}`);
    }

    return;
  }'''

new = '''  if (!result.valid) {
    console.log(`  ❌ REJECTED  ${event.action} (${event.role})`);

    ledger.append({
      event_id: nextEventId(),
      type: "constitutional_breach",
      request_id: event.request_id,
      role: event.role,
      attempted_action: event.action,
      errors: result.errors,
    });

    for (const error of result.errors) {
      console.log(`       └─ ${error.message}`);
    }

    return;
  }'''

txt = txt.replace(old, new)

p.write_text(txt)

# =====================================================
# PATCH src/runtime/status.js
# =====================================================

p = Path("src/runtime/status.js")
txt = p.read_text()

txt = txt.replace(
'const events = getAllEvents();',
'''const events = getAllEvents()
  .filter(e => e.type !== "constitutional_breach");'''
)

p.write_text(txt)

# =====================================================
# PATCH src/ledger/replay.js
# =====================================================

p = Path("src/ledger/replay.js")
txt = p.read_text()

txt = txt.replace(
'for (const event of events) {',
'''for (const event of events) {

    if (event.type === "constitutional_breach") {
      continue;
    }'''
)

p.write_text(txt)

print("constitutional breach fully integrated")
PY

echo ""
echo "===== TEST ====="

node tests/governance.test.js

echo ""
echo "===== RUNTIME ====="

node src/index.js

