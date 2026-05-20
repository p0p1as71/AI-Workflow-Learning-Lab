#!/bin/bash

python3 <<'PY'
from pathlib import Path

p = Path("src/validator/rules.js")
txt = p.read_text()

old = '''executed:  {
    requiresChain: [
      { action: "submitted" },
    ],
    requiresEvent: {
    },
    requiresFields: {},
  },'''

new = '''executed:  {
    requiresChain: [
      { action: "submitted" },
      { action: "reviewed" },
      { action: "approved" },
      { action: "validated" }
    ],
    requiresEvent: {
      submitted: {},
      reviewed: {},
      approved: {},
      validated: {}
    },
    requiresFields: {},
  },'''

txt = txt.replace(old, new)

p.write_text(txt)

print("executed chain hardened")
PY

echo ""
echo "===== VERIFY EXECUTED ====="

grep -A 20 "executed:" src/validator/rules.js

echo ""
echo "===== TEST ====="

node tests/governance.test.js

echo ""
echo "===== RUNTIME ====="

node src/index.js

