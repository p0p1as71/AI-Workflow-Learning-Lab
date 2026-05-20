#!/bin/bash

echo "Checking governance consistency..."

REQUIRED_FILES=(
  "governance/rules.md"
  "governance/runtime-policy.md"
  "governance/validation.md"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✔ $file exists"
  else
    echo "✘ $file is missing"
    exit 1
  fi
done

echo "Governance files present"

grep -q "What the agent cannot do" governance/runtime-policy.md
if [ $? -ne 0 ]; then
  echo "✘ runtime-policy.md missing authority limits section"
  exit 1
fi

echo "✔ Authority limits section present"

echo "Governance validation passed"
exit 0