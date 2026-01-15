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
