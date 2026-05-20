#!/bin/bash

echo "Validating experiments structure..."

for file in experiments/experiment-*.md; do
  if [ ! -f "$file" ]; then
    echo "No experiment files found."
    exit 1
  fi

  grep -q "## Plan" "$file" || { echo "Missing Plan in $file"; exit 1; }
  grep -q "## Implementation" "$file" || { echo "Missing Implementation in $file"; exit 1; }
  grep -q "## Validation" "$file" || { echo "Missing Validation in $file"; exit 1; }
  grep -q "## Testing" "$file" || { echo "Missing Testing in $file"; exit 1; }

  echo "✔ $file structure valid"
done

echo "All experiments validated successfully."
exit 0