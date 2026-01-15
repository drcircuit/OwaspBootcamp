#!/bin/bash
# Cleanup script for OWASP Bootcamp Docker environment
# This script stops all running containers and cleans up volumes

echo "🧹 Cleaning up OWASP Bootcamp environment..."
echo ""

# Check if docker compose is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not in PATH"
    exit 1
fi

# Stop all containers
echo "📦 Stopping all containers..."
docker compose down

echo ""
echo "🗑️  Removing volumes (use -v flag)..."
docker compose down -v

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "To start fresh, run:"
echo "  docker compose up -d"
