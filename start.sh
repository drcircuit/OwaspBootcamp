#!/usr/bin/env bash
set -euo pipefail

OK="✅"
NO="❌"

is_wsl() {
  grep -qi microsoft /proc/version 2>/dev/null
}

platform() {
  case "$(uname -s)" in
    Darwin) echo "macos" ;;
    Linux)
      if is_wsl; then echo "wsl"; else echo "linux"; fi
      ;;
    *) echo "other" ;;
  esac
}

PLAT="$(platform)"

echo "======================================"
echo "OWASP Bootcamp Workshop"
echo "======================================"
echo ""

# Docker connectivity check
docker_err="$(docker info >/dev/null 2>&1 || docker info 2>&1 || true)"

if ! docker info >/dev/null 2>&1; then
  if echo "$docker_err" | grep -qi "permission denied.*docker.sock"; then
    echo "${NO} Docker is running, but you don't have permission to use it."
    echo ""
    echo "Fix (Linux/WSL):"
    echo "  sudo usermod -aG docker \"$USER\""
    echo "  newgrp docker"
    echo ""
    echo "Or log out and back in."
    exit 1
  fi

  if echo "$docker_err" | grep -qiE "Cannot connect to the Docker daemon|is the docker daemon running|connection refused|no such file|dial unix"; then
    echo "${NO} Docker is not available."
    echo ""
    case "$PLAT" in
      macos)
        echo "Start Docker Desktop (Applications → Docker) and wait for it to say 'Running'."
        ;;
      wsl)
        echo "If using Docker Desktop integration: start Docker Desktop on Windows."
        echo "If running dockerd inside WSL: start it with:"
        echo "  sudo service docker start   (or)   sudo dockerd"
        ;;
      linux)
        echo "Start it with:"
        echo "  sudo systemctl enable --now docker"
        echo "  sudo systemctl enable --now containerd"
        ;;
      *)
        echo "Start your Docker engine and try again."
        ;;
    esac
    exit 1
  fi

  echo "${NO} Docker check failed:"
  echo "$docker_err"
  exit 1
fi

echo "${OK} Docker is available"
echo ""

# Ubuntu/Linux networking fixes
if [[ "$PLAT" == "linux" ]]; then
  echo "======================================"
  echo "Ubuntu/Linux Networking Configuration"
  echo "======================================"
  echo ""
  
  NEEDS_FIX=false
  
  # Check if running as root (needed for network fixes)
  if [[ $EUID -ne 0 ]]; then
    echo "⚠️  Network configuration requires root privileges"
    echo ""
    
    # Check if fixes are needed
    echo "Checking network configuration..."
    
    # Check IP forwarding
    if ! sysctl net.ipv4.ip_forward 2>/dev/null | grep -q "= 1"; then
      echo "${NO} IP forwarding is disabled"
      NEEDS_FIX=true
    fi
    
    # Check FORWARD chain policy
    FORWARD_POLICY=$(sudo iptables -L FORWARD -n 2>/dev/null | head -1 | awk '{print $4}' | tr -d ')' || echo "unknown")
    if [[ "$FORWARD_POLICY" == "DROP" ]]; then
      echo "${NO} iptables FORWARD policy is DROP (blocks inter-container traffic)"
      NEEDS_FIX=true
    fi
    
    # Check Docker FORWARD rules
    if ! sudo iptables -L FORWARD -n 2>/dev/null | grep -q "DOCKER"; then
      echo "${NO} Docker iptables FORWARD rules are missing"
      NEEDS_FIX=true
    fi
    
    if [ "$NEEDS_FIX" = true ]; then
      echo ""
      echo "⚠️  Network configuration issues detected!"
      echo "   These will cause connection timeouts and database errors."
      echo ""
      echo "Running network fixes with sudo..."
      echo ""
      
      if sudo ./ubuntu-setup.sh; then
        echo ""
        echo "${OK} Network configuration fixed"
      else
        echo ""
        echo "${NO} Failed to fix network configuration"
        echo "   You may need to run: sudo ./ubuntu-setup.sh manually"
        exit 1
      fi
    else
      echo "${OK} Network configuration looks good"
    fi
    echo ""
  else
    # Running as root, run fixes directly
    echo "Running network configuration fixes..."
    echo ""
    
    # Enable IP forwarding
    if ! sysctl net.ipv4.ip_forward 2>/dev/null | grep -q "= 1"; then
      echo "Enabling IP forwarding..."
      sysctl -w net.ipv4.ip_forward=1 >/dev/null
      if ! grep -q "^net.ipv4.ip_forward=1" /etc/sysctl.conf 2>/dev/null; then
        echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
      fi
    fi
    
    # Set FORWARD policy to ACCEPT
    FORWARD_POLICY=$(iptables -L FORWARD -n 2>/dev/null | head -1 | awk '{print $4}' | tr -d ')' || echo "unknown")
    if [[ "$FORWARD_POLICY" == "DROP" ]]; then
      echo "Setting iptables FORWARD policy to ACCEPT..."
      iptables -P FORWARD ACCEPT
    fi
    
    # Restart Docker to reset iptables
    echo "Restarting Docker service..."
    systemctl restart docker
    
    echo "${OK} Network configuration completed"
    echo ""
  fi
fi

# Clean and rebuild option
echo "======================================"
echo "Starting OWASP Bootcamp Cluster"
echo "======================================"
echo ""

# Check if containers are already running
if docker compose ps 2>/dev/null | grep -q "Up"; then
  echo "⚠️  Containers are already running"
  echo ""
  read -p "Do you want to rebuild and restart? (y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Stopping and removing existing containers..."
    docker compose down
    
    read -p "Remove volumes (fresh database)? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo "Removing volumes..."
      docker compose down -v
    fi
    
    echo ""
    echo "Rebuilding containers..."
    docker compose build --no-cache
  else
    echo ""
    echo "${OK} Using existing containers"
    echo ""
    echo "Access the workshop at:"
    echo "  🎭 Portal (Start here):  http://localhost:3100"
    echo "  🏰 Citadel:              http://localhost:3000"
    echo "  📚 Labs:                 http://localhost:3001-3010"
    echo ""
    exit 0
  fi
else
  # No containers running, ask about clean build
  read -p "Do you want a clean build? (Y/n): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo ""
    echo "Building containers..."
    docker compose build --no-cache
  fi
fi

echo ""
echo "Starting containers..."
docker compose up -d

echo ""
echo "Waiting for services to be ready..."
sleep 5

# Check if portal is accessible
echo ""
echo "Checking portal connectivity..."
MAX_RETRIES=12
RETRY=0
PORTAL_OK=false

while [ $RETRY -lt $MAX_RETRIES ]; do
  # Try curl first (more portable), fallback to bash /dev/tcp
  if command -v curl &> /dev/null; then
    if timeout 2 curl -s -o /dev/null http://127.0.0.1:3100 2>/dev/null; then
      PORTAL_OK=true
      break
    fi
  elif timeout 2 bash -c "echo > /dev/tcp/127.0.0.1/3100" 2>/dev/null; then
    PORTAL_OK=true
    break
  fi
  RETRY=$((RETRY+1))
  if [ $RETRY -lt $MAX_RETRIES ]; then
    echo "  Waiting for portal to start... ($RETRY/$MAX_RETRIES)"
    sleep 3
  fi
done

echo ""
if [ "$PORTAL_OK" = true ]; then
  echo "${OK} Portal is accessible!"
else
  echo "${NO} Portal is not responding on localhost:3100"
  echo ""
  echo "Checking container logs for issues..."
  echo ""
  docker compose logs --tail=20 portal
  echo ""
  echo "Troubleshooting:"
  echo "  1. Check container status: docker compose ps"
  echo "  2. Check portal logs: docker compose logs portal"
  echo "  3. Run diagnostics: ./diagnose-ubuntu.sh"
  echo "  4. Try manual fix: sudo ./ubuntu-setup.sh"
  echo ""
  exit 1
fi

echo ""
echo "======================================"
echo "✅ OWASP Bootcamp is Ready!"
echo "======================================"
echo ""
echo "Access the workshop at:"
echo "  🎭 Portal (Start here):  http://localhost:3100"
echo "  🏰 Citadel:              http://localhost:3000"
echo "  📚 Labs:                 http://localhost:3001-3010"
echo ""
echo "To stop:"
echo "  docker compose down"
echo ""
echo "To view logs:"
echo "  docker compose logs -f"
echo ""
