#!/bin/bash

echo "======================================"
echo "Stopping OWASP Bootcamp Workshop"
echo "======================================"
echo ""

docker compose down

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All containers stopped"
    echo ""
    echo "To remove all data as well, run:"
    echo "  docker compose down -v"
    echo ""
    echo "To restart the workshop, run:"
    echo "  ./start.sh"
    echo ""
else
    echo "❌ Failed to stop containers"
    echo "Try: docker compose down"
    exit 1
fi
