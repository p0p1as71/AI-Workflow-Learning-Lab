#!/bin/bash

echo "Validating project structure..."

REQUIRED_FOLDERS=("runtime" "docs" "scripts" "governance" "experiments" "papers" "assets")

for folder in "${REQUIRED_FOLDERS[@]}"; do
  if [ -d "$folder" ]; then
    echo "✔ $folder exists"
  else
    echo "✘ $folder is missing"
    exit 1
  fi
done

echo "Structure validation passed"
exit 0