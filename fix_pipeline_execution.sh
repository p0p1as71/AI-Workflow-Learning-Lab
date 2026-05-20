#!/bin/bash

python3 <<'PY'
from pathlib import Path

p = Path("scripts/check_governance.sh")
txt = p.read_text()

# eliminar exits prematuros
txt = txt.replace("exit 0", "")

# evitar doble inserción
if "Running constitutional consistency checks..." not in txt:

    txt += '''

echo "Running constitutional consistency checks..."

node - <<'NODE'
const { validateConstitution } = require('./src/validator/checkConstitution');

const result = validateConstitution();

if (!result.valid) {
  console.error("❌ Constitutional inconsistencies detected");
  console.error(result.problems);
  process.exit(1);
}

console.log("✅ Constitutional model consistent");
NODE

'''

p.write_text(txt)

print("pipeline execution fixed")
PY

echo ""
echo "===== GOVERNANCE CHECK ====="

./scripts/check_governance.sh

echo ""
echo "===== TEST ====="

node tests/governance.test.js

