#!/bin/bash

python3 <<'PY'
from pathlib import Path

p = Path("src/validator/checkConstitution.js")
txt = p.read_text()

anchor = '''
  return {
    valid: problems.length === 0,
    problems,
  };
}
'''

extra = '''

  // ----------------------------------------
  // detect unreachable states
  // ----------------------------------------

  const reachable = new Set(["submitted"]);

  function walk(state) {
    const next = VALID_TRANSITIONS[state] || [];

    for (const target of next) {
      if (!reachable.has(target)) {
        reachable.add(target);
        walk(target);
      }
    }
  }

  walk("submitted");

  for (const state of runtimeStates) {
    if (!reachable.has(state)) {
      problems.push(`Unreachable state: ${state}`);
    }
  }

'''

txt = txt.replace(anchor, extra + anchor)

p.write_text(txt)

print("dead state detection added")
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

