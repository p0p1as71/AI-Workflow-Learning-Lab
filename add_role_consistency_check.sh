#!/bin/bash

python3 <<'PY'
from pathlib import Path

p = Path("src/validator/checkConstitution.js")
txt = p.read_text()

insertion = '''

const { ROLE_ACTIONS } = require('./rules');

'''

txt = txt.replace(
"const { VALID_TRANSITIONS, ACTION_PREREQUISITES } = require('./rules');",
"const { VALID_TRANSITIONS, ACTION_PREREQUISITES, ROLE_ACTIONS } = require('./rules');"
)

anchor = '''
  // ----------------------------------------
  // every runtime state must have transitions
  // ----------------------------------------
'''

extra = '''
  // ----------------------------------------
  // every action must belong to a role
  // ----------------------------------------

  const ownedActions = new Set();

  for (const role of Object.keys(ROLE_ACTIONS)) {
    for (const action of ROLE_ACTIONS[role]) {
      ownedActions.add(action);
    }
  }

  for (const action of transitionStates) {
    if (!ownedActions.has(action)) {
      problems.push(`Action without owner role: ${action}`);
    }
  }

'''

txt = txt.replace(anchor, extra + anchor)

p.write_text(txt)

print("role consistency check added")
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

