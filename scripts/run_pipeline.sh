#!/bin/bash

echo "=== AI Workflow Pipeline ==="

echo "[1] Structure validation..."
./scripts/validate_structure.sh || exit 1

echo "[2] Governance validation..."
./scripts/check_governance.sh || exit 1

echo "[3] Experiments validation..."
./scripts/validate_experiments.sh || exit 1

echo "[4] Runtime status..."
git status || exit 1

echo "Pipeline execution completed successfully."
exit 0
