#!/usr/bin/env bash
set -euo pipefail

echo "======================================"
echo "OWASP Bootcamp - Network Diagnostics"
echo "======================================"
echo ""
echo "Running diagnostics to identify localhost connectivity issues..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

pass() {
  echo -e "${GREEN}✅ PASS${NC}: $1"
}

fail() {
  echo -e "${RED}❌ FAIL${NC}: $1"
}

warn() {
  echo -e "${YELLOW}⚠️  WARN${NC}: $1"
}

info() {
  echo -e "ℹ️  INFO: $1"
}

echo "=== 1. SYSTEM CHECKS ==="
echo ""

# Check OS
info "Operating System: $(uname -s)"
if [[ "$(uname -s)" == "Linux" ]]; then
  if grep -qi microsoft /proc/version 2>/dev/null; then
    info "Environment: WSL (Windows Subsystem for Linux)"
  else
    info "Environment: Native Linux"
  fi
fi
echo ""

# Check Docker
echo "=== 2. DOCKER CHECKS ==="
echo ""
if command -v docker &> /dev/null; then
  pass "Docker is installed"
  info "Docker version: $(docker --version)"
  
  if docker info &> /dev/null; then
    pass "Docker daemon is running"
  else
    fail "Docker daemon is not running or not accessible"
    echo "   Fix: sudo systemctl start docker"
    exit 1
  fi
else
  fail "Docker is not installed"
  exit 1
fi
echo ""

# Check IP forwarding
echo "=== 3. NETWORK CONFIGURATION ==="
echo ""
if sysctl net.ipv4.ip_forward | grep -q "= 1"; then
  pass "IP forwarding is enabled"
else
  fail "IP forwarding is DISABLED"
  echo "   Fix: sudo sysctl -w net.ipv4.ip_forward=1"
fi

# Check iptables
if iptables -t nat -L -n 2>/dev/null | grep -q "DOCKER"; then
  pass "Docker iptables NAT rules are present"
else
  fail "Docker iptables NAT rules are MISSING"
  echo "   Fix: sudo systemctl restart docker"
fi

# Check FORWARD chain
if iptables -L FORWARD -n 2>/dev/null | grep -q "DOCKER"; then
  pass "Docker iptables FORWARD rules are present"
else
  fail "Docker iptables FORWARD rules are MISSING"
  echo "   This blocks inter-container communication!"
  echo "   Fix: sudo systemctl restart docker"
fi

# Check FORWARD chain policy
FORWARD_POLICY=$(iptables -L FORWARD -n 2>/dev/null | head -1 | awk '{print $4}' | tr -d ')' || echo "unknown")
if [[ "$FORWARD_POLICY" == "ACCEPT" ]]; then
  pass "iptables FORWARD policy is ACCEPT"
elif [[ "$FORWARD_POLICY" == "DROP" ]]; then
  fail "iptables FORWARD policy is DROP"
  echo "   This BLOCKS all inter-container traffic!"
  echo "   Fix: sudo iptables -P FORWARD ACCEPT"
else
  warn "Could not determine FORWARD policy"
fi
echo ""

# Check Docker daemon iptables setting
echo "=== 4. DOCKER DAEMON CONFIG ==="
echo ""
DOCKER_DAEMON_FILE="/etc/docker/daemon.json"
if [ -f "$DOCKER_DAEMON_FILE" ]; then
  info "Found $DOCKER_DAEMON_FILE"
  if grep -q '"iptables".*false' "$DOCKER_DAEMON_FILE" 2>/dev/null; then
    fail "Docker iptables management is DISABLED in daemon.json"
    echo "   This prevents port forwarding! Remove or set to true."
  else
    pass "Docker daemon configuration looks good"
  fi
else
  info "No custom daemon.json (using Docker defaults)"
  pass "Default configuration should work"
fi
echo ""

# Check if containers are running
echo "=== 5. CONTAINER STATUS ==="
echo ""
if docker compose ps 2>/dev/null | grep -q "Up"; then
  pass "Some containers are running"
  echo ""
  info "Running containers:"
  docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || true
else
  warn "No containers are running"
  echo "   Start containers with: docker compose up -d"
fi
echo ""

# Check portal container specifically
echo "=== 6. INTER-CONTAINER CONNECTIVITY ==="
echo ""
if docker compose ps portal-db 2>/dev/null | grep -q "Up"; then
  pass "Portal database container is running"
  
  # Test if portal can reach database
  info "Testing portal -> database connectivity..."
  if docker compose ps portal 2>/dev/null | grep -q "Up"; then
    # Get database IP
    DB_IP=$(docker inspect notso-anonymous-portal-db 2>/dev/null | grep -m1 '"IPAddress"' | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
    info "Database IP: $DB_IP"
    
    # Try to connect from portal to database
    if timeout 5 docker compose exec -T portal nc -zv "$DB_IP" 5432 2>&1 | grep -q "open\|succeeded"; then
      pass "Portal CAN connect to database (inter-container traffic works)"
    else
      fail "Portal CANNOT connect to database"
      echo "   This is the root cause of 'ETIMEDOUT' errors!"
      echo "   Inter-container traffic is BLOCKED by iptables FORWARD chain"
      echo "   Fix: Run sudo ./ubuntu-setup.sh"
    fi
  else
    warn "Portal container not running, cannot test database connectivity"
  fi
else
  warn "Portal database container is not running"
fi
echo ""

# Check portal container specifically  
echo "=== 7. PORTAL CONNECTIVITY TESTS ==="
echo ""
if docker compose ps portal 2>/dev/null | grep -q "Up"; then
  pass "Portal container is running"
  
  # Test from inside container
  info "Testing connection from inside container..."
  if docker compose exec -T portal curl -s -o /dev/null -w "%{http_code}" http://localhost:3100 2>/dev/null | grep -q "200\|302"; then
    pass "Portal responds INSIDE container (http://localhost:3100)"
  else
    fail "Portal does NOT respond inside container"
    echo "   The application may not be starting properly"
    echo "   Check logs: docker compose logs portal"
  fi
  
  # Test from host using 127.0.0.1
  info "Testing connection from host to 127.0.0.1:3100..."
  if timeout 3 bash -c "echo > /dev/tcp/127.0.0.1/3100" 2>/dev/null; then
    pass "Port 3100 is accessible on 127.0.0.1"
  else
    fail "Port 3100 is NOT accessible on 127.0.0.1"
    echo "   This is the main issue - Docker port forwarding is broken"
  fi
  
  # Test from host using 0.0.0.0
  info "Testing connection from host to 0.0.0.0:3100..."
  if timeout 3 bash -c "echo > /dev/tcp/0.0.0.0/3100" 2>/dev/null; then
    pass "Port 3100 is accessible on 0.0.0.0"
  else
    fail "Port 3100 is NOT accessible on 0.0.0.0"
  fi
  
  # Check actual port binding
  info "Checking Docker port binding..."
  PORT_BIND=$(docker compose port portal 3100 2>/dev/null || echo "not found")
  if [[ "$PORT_BIND" == *"0.0.0.0:3100"* ]] || [[ "$PORT_BIND" == *":3100"* ]]; then
    pass "Port binding: $PORT_BIND"
  else
    fail "Port binding issue: $PORT_BIND"
  fi
  
else
  warn "Portal container is not running"
  echo "   Start it with: docker compose up -d portal"
fi
echo ""

# Check firewall
echo "=== 7. FIREWALL CHECKS ==="
echo ""
if command -v ufw &> /dev/null; then
  if ufw status 2>/dev/null | grep -q "Status: active"; then
    warn "UFW firewall is active"
    if ufw status 2>/dev/null | grep -q "3100"; then
      pass "Port 3100 is allowed in UFW"
    else
      fail "Port 3100 is NOT allowed in UFW"
      echo "   Fix: sudo ufw allow 3100/tcp"
    fi
  else
    info "UFW firewall is not active"
  fi
else
  info "UFW firewall is not installed"
fi
echo ""

echo "======================================"
echo "DIAGNOSTIC SUMMARY"
echo "======================================"
echo ""
echo "If you see failures above, run the setup script:"
echo "  sudo ./ubuntu-setup.sh"
echo ""
echo "Then restart containers:"
echo "  docker compose down"
echo "  docker compose up -d"
echo ""
echo "If issues persist, check the logs:"
echo "  docker compose logs portal"
echo "  docker compose logs citadel"
echo ""
