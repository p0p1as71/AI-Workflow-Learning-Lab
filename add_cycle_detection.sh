#!/bin/bash

python3 <<'PY'
from pathlib import Path

p = Path("src/validator/checkConstitution.js")
txt = p.read_text()

anchor = '''
  // ----------------------------------------
  // detect unreachable states
  // ----------------------------------------
'''

extra = '''
  // ----------------------------------------
  // detect cycles
  // ----------------------------------------

  const visiting = new Set();
  const visited = new Set();

  function detectCycle(state) {
    if (visiting.has(state)) {
      problems.push(`Cycle detected involving state: ${state}`);
      return;
    }

    if (visited.has(state)) {
      return;
    }

    visiting.add(state);

    const next = VALID_TRANSITIONS[state] || [];

    for (const target of next) {
      detectCycle(target);
    }

    visiting.delete(state);
    visited.add(state);
  }

  detectCycle("submitted");

'''

txt = txt.replace(anchor, extra + anchor)

p.write_text(txt)

print("cycle detection added")
PY

echo ""
echo "===== CONSTITUTION CHECK ====="

node - <<'NODE'
const { validateConstitution } = require('./src/validator/checkConstitution');

const result = validateConstitution();

if (result.valid) {
  console.log("✅ Constitutional model consistent");
} else {
  console.log("❌ Constitutional inconsistencies detected");
  console.log(result.problems);
}
NODE

echo ""
echo "===== TEST ====="

node tests/governance.test.js

