#!/bin/bash

python3 <<'PY'
from pathlib import Path
import re

p = Path("src/validator/rules.js")
txt = p.read_text()

# =========================================
# REPLACE VALIDATED BLOCK
# =========================================

validated_pattern = r'''validated:\s*\{
\s*requiresChain:\s*\[
\s*\{ action: "submitted" \},
.*?
\s*\],
\s*requiresEvent:\s*\{
.*?
\s*\},
\s*requiresFields:\s*\{
.*?
\s*\}
\s*\},'''

validated_replacement = '''validated: {
    requiresChain: [
      { action: "submitted" },
      { action: "reviewed" },
      { action: "approved" }
    ],
    requiresEvent: {
      submitted: {},
      reviewed: {},
      approved: {}
    },
    requiresFields: {}
  },'''

txt = re.sub(
    validated_pattern,
    validated_replacement,
    txt,
    flags=re.DOTALL
)

# =========================================
# REPLACE EXECUTED BLOCK
# =========================================

executed_pattern = r'''executed:\s*\{
\s*requiresChain:\s*\[
.*?
\s*\],
\s*requiresEvent:\s*\{
.*?
\s*\},
\s*requiresFields:\s*\{
.*?
\s*\}
\s*\}'''

executed_replacement = '''executed: {
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
    requiresFields: {}
  }'''

txt = re.sub(
    executed_pattern,
    executed_replacement,
    txt,
    flags=re.DOTALL
)

p.write_text(txt)

print("constitutional prerequisites hardened")
PY

echo ""
echo "===== VERIFY ====="

grep -A 30 "validated:" src/validator/rules.js

echo ""
echo "===== TEST ====="

node tests/governance.test.js

echo ""
echo "===== RUNTIME ====="

node src/index.js

