#!/bin/bash

python3 <<'PY'
from pathlib import Path

p = Path("tests/governance.test.js")
txt = p.read_text()

# =========================================
# HAPPY PATH COMMENT
# =========================================

txt = txt.replace(
"// 1. Happy path: submitted → reviewed → validated → executed",
"// 1. Happy path: submitted → reviewed → approved → validated → executed"
)

# =========================================
# INSERT EXPLICIT APPROVED VALIDATION
# =========================================

old = """history.push({ role: 'governor', action: 'reviewed' });
  history.push({ role: 'governor', action: 'approved' });

  result = validateTransition({ role: 'validator', action: 'validated' }, history);"""

new = """history.push({ role: 'governor', action: 'reviewed' });

  result = validateTransition({ role: 'governor', action: 'approved' }, history);
  assert.strictEqual(result.valid, true);

  history.push({ role: 'governor', action: 'approved' });

  result = validateTransition({ role: 'validator', action: 'validated' }, history);"""

txt = txt.replace(old, new)

# =========================================
# UPDATE TRANSITION EXPECTATION
# =========================================

txt = txt.replace(
"assert.ok(transitions.includes('approved'));",
"assert.ok(transitions.includes('approved'));\n  assert.ok(!transitions.includes('validated'));"
)

p.write_text(txt)

print("governance tests upgraded")
PY

echo ""
echo "===== RUN TESTS ====="

node tests/governance.test.js

