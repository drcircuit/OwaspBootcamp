#!/usr/bin/env bash
set -euo pipefail

echo "======================================"
echo "OWASP Bootcamp - Ubuntu Setup"
echo "======================================"
echo ""
echo "This script configures Ubuntu for proper Docker networking"
echo ""

# Check if running on Linux
if [[ "$(uname -s)" != "Linux" ]]; then
  echo "⚠️  This script is for Linux/Ubuntu only"
  exit 1
fi

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
   echo "⚠️  This script requires root privileges"
   echo "Please run with: sudo ./ubuntu-setup.sh"
   exit 1
fi

echo "✅ Running on Linux with root privileges"
echo ""

# 1. Enable IP forwarding
echo "📡 Enabling IP forwarding..."
if sysctl net.ipv4.ip_forward | grep -q "= 1"; then
  echo "✅ IP forwarding is already enabled"
else
  sysctl -w net.ipv4.ip_forward=1
  # Make it persistent across reboots
  if ! grep -q "^net.ipv4.ip_forward=1" /etc/sysctl.conf; then
    echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
  fi
  echo "✅ IP forwarding enabled and persisted"
fi
echo ""

# 2. Restart Docker to reset iptables rules
echo "🔄 Restarting Docker service..."
systemctl restart docker
echo "✅ Docker service restarted"
echo ""

# 3. Check iptables rules
echo "🔍 Checking Docker iptables rules..."
if iptables -t nat -L -n | grep -q "DOCKER"; then
  echo "✅ Docker iptables rules are present"
else
  echo "⚠️  Docker iptables rules not found - this might cause connectivity issues"
  echo "    Try restarting Docker or checking your firewall configuration"
fi
echo ""

# 4. Allow Docker ports through UFW if it's active
if command -v ufw &> /dev/null; then
  if ufw status | grep -q "Status: active"; then
    echo "🔥 UFW firewall is active - adding Docker port rules..."
    
    # Allow ports 3000-3100 (OWASP Bootcamp services)
    for port in {3000..3010} 3100; do
      ufw allow $port/tcp > /dev/null 2>&1 || true
    done
    
    # Allow Docker bridge network
    ufw allow from 172.25.0.0/16 > /dev/null 2>&1 || true
    
    echo "✅ UFW rules added for OWASP Bootcamp ports (3000-3010, 3100)"
  else
    echo "ℹ️  UFW firewall is installed but not active"
  fi
else
  echo "ℹ️  UFW firewall not installed"
fi
echo ""

echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Start the workshop: docker compose up -d"
echo "  2. Access portal at: http://localhost:3100"
echo "  3. If you still have issues, check:"
echo "     - Docker logs: docker compose logs"
echo "     - Container status: docker compose ps"
echo "     - Port bindings: docker compose port portal 3100"
echo ""
