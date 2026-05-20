#!/bin/bash

python3 <<'PY'
from pathlib import Path
import re

p = Path("src/validator/rules.js")
txt = p.read_text()

old = '''correction: { requiresChain: [], requiresEvent: {}, requiresFields: { reason: "string" } },'''

new = '''correction: {
    requiresChain: [
      { action: "submitted" }
    ],
    requiresEvent: {
      submitted: {}
    },
    requiresFields: {
      reason: "string"
    }
  },'''

txt = txt.replace(old, new)

p.write_text(txt)

print("correction hardened")
PY

echo ""
echo "===== VERIFY ====="

grep -A 12 "correction:" src/validator/rules.js

echo ""
echo "===== TEST ====="

node tests/governance.test.js

echo ""
echo "===== CONSTITUTION ====="

./scripts/check_governance.sh

