#!/bin/bash

# This script applies the A02 refactoring by copying needed sections from original
# and inserting new clean versions of Example, Lab1, Lab2, Lab3

echo "Applying A02 refactoring..."
cp server.js server.js.backup
echo "✓ Backup created"
