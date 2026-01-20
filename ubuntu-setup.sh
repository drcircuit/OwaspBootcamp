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

# 3. Check and fix iptables rules
echo "🔍 Checking Docker iptables rules..."

# Check NAT rules
if iptables -t nat -L -n | grep -q "DOCKER"; then
  echo "✅ Docker NAT rules are present"
else
  echo "⚠️  Docker NAT rules not found"
fi

# Check FORWARD chain rules (critical for inter-container communication)
if iptables -L FORWARD -n | grep -q "DOCKER"; then
  echo "✅ Docker FORWARD chain rules are present"
else
  echo "❌ Docker FORWARD chain rules MISSING - this blocks inter-container traffic!"
  echo "   Resetting iptables..."
  
  # Flush and reset iptables rules
  iptables -F
  iptables -t nat -F
  iptables -t mangle -F
  iptables -X
  
  # Ensure FORWARD chain default policy allows traffic
  iptables -P FORWARD ACCEPT
  
  # Restart Docker to recreate rules
  systemctl restart docker
  sleep 3
  
  if iptables -L FORWARD -n | grep -q "DOCKER"; then
    echo "✅ Docker FORWARD chain rules restored"
  else
    echo "⚠️  Docker FORWARD chain rules still missing!"
    echo "   Checking if Docker iptables is disabled..."
  fi
fi

# Check FORWARD chain default policy
FORWARD_POLICY=$(iptables -L FORWARD -n | head -1 | awk '{print $4}' | tr -d ')')
if [[ "$FORWARD_POLICY" == "DROP" ]]; then
  echo "⚠️  FORWARD chain policy is DROP - this blocks inter-container traffic!"
  echo "   Setting FORWARD policy to ACCEPT..."
  iptables -P FORWARD ACCEPT
  echo "✅ FORWARD policy set to ACCEPT"
elif [[ "$FORWARD_POLICY" == "ACCEPT" ]]; then
  echo "✅ FORWARD chain policy is ACCEPT"
fi
echo ""

# 3.5. Check that Docker is actually managing iptables
echo "🔍 Checking Docker daemon configuration..."
DOCKER_DAEMON_FILE="/etc/docker/daemon.json"
if [ -f "$DOCKER_DAEMON_FILE" ]; then
  if grep -q '"iptables".*false' "$DOCKER_DAEMON_FILE"; then
    echo "⚠️  Docker iptables management is DISABLED in daemon.json"
    echo "    This will prevent port forwarding from working!"
    echo "    To fix, edit $DOCKER_DAEMON_FILE and set \"iptables\": true"
  else
    echo "✅ Docker daemon configuration looks good"
  fi
else
  echo "ℹ️  No custom Docker daemon configuration found (using defaults)"
fi
echo ""

# 4. Handle UFW firewall conflicts with Docker
if command -v ufw &> /dev/null; then
  if ufw status | grep -q "Status: active"; then
    echo "🔥 UFW firewall is active"
    echo ""
    echo "⚠️  WARNING: UFW can block Docker inter-container communication!"
    echo "   UFW sets FORWARD chain to DROP by default, breaking Docker networking."
    echo ""
    
    # Add UFW rules for Docker
    echo "   Adding UFW rules for Docker..."
    
    # Allow ports 3000-3100 (OWASP Bootcamp services)
    for port in {3000..3010} 3100; do
      ufw allow $port/tcp > /dev/null 2>&1 || true
    done
    
    # Allow Docker bridge network
    ufw allow from 172.25.0.0/16 > /dev/null 2>&1 || true
    ufw allow to 172.25.0.0/16 > /dev/null 2>&1 || true
    
    echo "   ✅ UFW rules added for OWASP Bootcamp ports (3000-3010, 3100)"
    echo ""
    echo "   🔧 Configuring UFW to work with Docker..."
    
    # Check if UFW default forward policy needs to be changed
    UFW_BEFORE_RULES="/etc/ufw/before.rules"
    if [ -f "$UFW_BEFORE_RULES" ]; then
      if ! grep -q "# BEGIN DOCKER RULES" "$UFW_BEFORE_RULES"; then
        echo "   Adding Docker-specific rules to UFW before.rules..."
        
        # Backup original file
        cp "$UFW_BEFORE_RULES" "$UFW_BEFORE_RULES.backup-$(date +%s)"
        
        # Add Docker rules at the end, before the COMMIT line
        sed -i '/^COMMIT$/i \
# BEGIN DOCKER RULES\n\
# Allow forwarding for Docker bridge network\n\
-A ufw-before-forward -i docker0 -j ACCEPT\n\
-A ufw-before-forward -o docker0 -j ACCEPT\n\
-A ufw-before-forward -i br-+ -j ACCEPT\n\
-A ufw-before-forward -o br-+ -j ACCEPT\n\
# END DOCKER RULES\n' "$UFW_BEFORE_RULES"
        
        echo "   ✅ Added Docker forwarding rules to UFW"
        
        # Reload UFW to apply changes
        ufw reload > /dev/null 2>&1
        echo "   ✅ Reloaded UFW firewall"
      else
        echo "   ℹ️  Docker rules already present in UFW configuration"
      fi
    fi
    
    # Ensure FORWARD chain accepts Docker traffic even with UFW
    iptables -I FORWARD -i docker0 -j ACCEPT 2>/dev/null || true
    iptables -I FORWARD -o docker0 -j ACCEPT 2>/dev/null || true
    iptables -I FORWARD -i br-+ -j ACCEPT 2>/dev/null || true
    iptables -I FORWARD -o br-+ -j ACCEPT 2>/dev/null || true
    
    echo "   ✅ Added runtime iptables rules for Docker forwarding"
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
