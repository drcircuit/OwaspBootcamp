#!/bin/bash

echo "======================================"
echo "OWASP Bootcamp Workshop"
echo "======================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Function to check if a port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -an | grep ":$port " | grep LISTEN >/dev/null 2>&1; then
        return 1
    else
        return 0
    fi
}

# Check if ports are available
echo "Checking ports..."
ports_in_use=""
for port in {3000..3010}; do
    if ! check_port $port; then
        ports_in_use="$ports_in_use $port"
    fi
done

if [ ! -z "$ports_in_use" ]; then
    echo "⚠️  Warning: The following ports are already in use:$ports_in_use"
    echo "You may need to stop other applications using these ports."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Ports available"
echo ""

# Build and start containers
echo "Building and starting containers..."
echo "This may take a few minutes on first run..."
echo ""

docker compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "✅ Workshop is ready!"
    echo "======================================"
    echo ""
    echo "Access the labs at:"
    echo "  Citadel (Main App):  http://localhost:3000"
    echo "  Lab A01:             http://localhost:3001"
    echo "  Lab A02:             http://localhost:3002"
    echo "  Lab A03:             http://localhost:3003"
    echo "  Lab A04:             http://localhost:3004"
    echo "  Lab A05:             http://localhost:3005"
    echo "  Lab A06:             http://localhost:3006"
    echo "  Lab A07:             http://localhost:3007"
    echo "  Lab A08:             http://localhost:3008"
    echo "  Lab A09:             http://localhost:3009"
    echo "  Lab A10:             http://localhost:3010"
    echo ""
    echo "To stop the workshop, run: ./stop.sh"
    echo "Or: docker compose down"
    echo ""
    echo "View logs: docker compose logs -f"
    echo ""
else
    echo "❌ Failed to start containers"
    echo "Check the error messages above"
    exit 1
fi
