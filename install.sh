#!/usr/bin/env bash
# CloudDory — Open Source Cloud Operations Platform
# One-liner: curl -fsSL https://clouddory.com/install.sh | bash
#
# This script:
# 1. Checks prerequisites (Node.js, npm, Docker)
# 2. Clones the CloudDory repo
# 3. Sets up the database
# 4. Builds and starts the dashboard
#
# Built by Alan Vo — alanvo@gmail.com
# https://github.com/ALANDVO/clouddory

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
BOLD='\033[1m'

echo ""
echo -e "${CYAN}${BOLD}"
echo "   ██████╗██╗      ██████╗ ██╗   ██╗██████╗     ██████╗  ██████╗ ██████╗ ██╗   ██╗"
echo "  ██╔════╝██║     ██╔═══██╗██║   ██║██╔══██╗    ██╔══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝"
echo "  ██║     ██║     ██║   ██║██║   ██║██║  ██║    ██║  ██║██║   ██║██████╔╝ ╚████╔╝ "
echo "  ██║     ██║     ██║   ██║██║   ██║██║  ██║    ██║  ██║██║   ██║██╔══██╗  ╚██╔╝  "
echo "  ╚██████╗███████╗╚██████╔╝╚██████╔╝██████╔╝    ██████╔╝╚██████╔╝██║  ██║   ██║   "
echo "   ╚═════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝     ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   "
echo -e "${NC}"
echo -e "${BOLD}  The open-source cloud operations platform${NC}"
echo -e "  FinOps • Security • Threat Intel • SOAR • AI"
echo ""
echo -e "  ${CYAN}https://github.com/ALANDVO/clouddory${NC}"
echo -e "  Built by Alan Vo — alanvo@gmail.com"
echo ""

# ─── Detect OS ───────────────────────────────────────────────
OS="$(uname -s)"
case "$OS" in
  Linux*)   PLATFORM="linux";;
  Darwin*)  PLATFORM="macos";;
  MINGW*|MSYS*|CYGWIN*) PLATFORM="windows";;
  *)        PLATFORM="unknown";;
esac
echo -e "${CYAN}→${NC} Detected platform: ${BOLD}$PLATFORM${NC}"

# ─── Check prerequisites ────────────────────────────────────
check_cmd() {
  if command -v "$1" &>/dev/null; then
    echo -e "  ${GREEN}✓${NC} $1 found: $(command -v $1)"
    return 0
  else
    echo -e "  ${RED}✗${NC} $1 not found"
    return 1
  fi
}

echo ""
echo -e "${CYAN}→${NC} Checking prerequisites..."

HAS_DOCKER=false
HAS_NODE=false

if check_cmd docker && check_cmd docker-compose; then
  HAS_DOCKER=true
fi

if check_cmd node && check_cmd npm; then
  NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_VERSION" -ge 18 ]; then
    HAS_NODE=true
  else
    echo -e "  ${YELLOW}!${NC} Node.js $NODE_VERSION found, but 18+ is required"
  fi
fi

if [ "$HAS_DOCKER" = false ] && [ "$HAS_NODE" = false ]; then
  echo ""
  echo -e "${RED}Error: Either Docker or Node.js 18+ is required.${NC}"
  echo ""
  echo "Install one of:"
  echo "  • Docker: https://docs.docker.com/get-docker/"
  echo "  • Node.js: https://nodejs.org/ (v18+)"
  exit 1
fi

# ─── Choose install method ───────────────────────────────────
echo ""
if [ "$HAS_DOCKER" = true ]; then
  echo -e "${CYAN}→${NC} Docker detected — using Docker Compose (recommended)"
  INSTALL_METHOD="docker"
else
  echo -e "${CYAN}→${NC} Using Node.js installation"
  INSTALL_METHOD="node"
fi

# ─── Clone repo ──────────────────────────────────────────────
INSTALL_DIR="${CLOUDDORY_DIR:-$HOME/clouddory}"

if [ -d "$INSTALL_DIR" ]; then
  echo ""
  echo -e "${YELLOW}→${NC} Directory $INSTALL_DIR already exists"
  echo -n "  Overwrite? (y/N): "
  read -r REPLY
  if [ "$REPLY" != "y" ] && [ "$REPLY" != "Y" ]; then
    echo "  Aborted."
    exit 0
  fi
  rm -rf "$INSTALL_DIR"
fi

echo ""
echo -e "${CYAN}→${NC} Cloning CloudDory..."
git clone --depth 1 https://github.com/ALANDVO/clouddory.git "$INSTALL_DIR" 2>/dev/null
cd "$INSTALL_DIR"
echo -e "  ${GREEN}✓${NC} Cloned to $INSTALL_DIR"

# ─── Generate secrets ────────────────────────────────────────
echo ""
echo -e "${CYAN}→${NC} Generating secrets..."
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
DB_PASSWORD=$(openssl rand -base64 16 2>/dev/null || head -c 16 /dev/urandom | base64 | tr -dc 'A-Za-z0-9')

# ─── Install ─────────────────────────────────────────────────
if [ "$INSTALL_METHOD" = "docker" ]; then
  echo -e "${CYAN}→${NC} Starting with Docker Compose..."

  # Create .env for docker
  cat > .env << EOF
DATABASE_URL="mysql://root:${DB_PASSWORD}@db:3306/clouddory"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
ADMIN_EMAILS=""
EOF

  # Update docker-compose with the password
  sed -i.bak "s/MYSQL_ROOT_PASSWORD: clouddory/MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}/" docker-compose.yml 2>/dev/null || true

  docker-compose up -d --build 2>&1

  echo ""
  echo -e "${GREEN}${BOLD}✓ CloudDory is running!${NC}"
  echo ""
  echo -e "  Dashboard:  ${CYAN}http://localhost:3000${NC}"
  echo -e "  Database:   localhost:3306"
  echo ""
  echo -e "  ${YELLOW}First user to register becomes admin.${NC}"

else
  # Node.js installation
  cd apps/dashboard

  # Symlink prisma schema from repo root
  ln -sf ../../prisma prisma

  echo -e "${CYAN}→${NC} Installing dependencies..."
  npm install 2>&1 | tail -3

  # Create .env
  echo ""
  echo -e "${CYAN}→${NC} Configuring environment..."

  # Check for MySQL — try multiple auth methods
  DB_URL=""
  if check_cmd mysql; then
    echo ""
    echo -e "  ${GREEN}✓${NC} MySQL found"

    # Try: root with no password, then sudo mysql, then prompt
    if mysql -u root -e "SELECT 1" &>/dev/null; then
      mysql -u root -e "CREATE DATABASE IF NOT EXISTS clouddory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
      mysql -u root -e "CREATE USER IF NOT EXISTS 'clouddory'@'localhost' IDENTIFIED BY '${DB_PASSWORD}'; GRANT ALL ON clouddory.* TO 'clouddory'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null
      DB_URL="mysql://clouddory:${DB_PASSWORD}@localhost:3306/clouddory"
      echo -e "  ${GREEN}✓${NC} Database and user created"
    elif sudo mysql -e "SELECT 1" &>/dev/null; then
      sudo mysql -e "CREATE DATABASE IF NOT EXISTS clouddory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
      sudo mysql -e "CREATE USER IF NOT EXISTS 'clouddory'@'localhost' IDENTIFIED BY '${DB_PASSWORD}'; GRANT ALL ON clouddory.* TO 'clouddory'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null
      DB_URL="mysql://clouddory:${DB_PASSWORD}@localhost:3306/clouddory"
      echo -e "  ${GREEN}✓${NC} Database and user created (via sudo)"
    else
      echo -e "  ${YELLOW}!${NC} Could not auto-create database. Edit DATABASE_URL in .env manually."
      DB_URL="mysql://user:password@localhost:3306/clouddory"
    fi
  else
    echo ""
    echo -e "  ${YELLOW}!${NC} MySQL not found. You'll need to:"
    echo "    1. Install MySQL/MariaDB"
    echo "    2. Create a database called 'clouddory'"
    echo "    3. Update DATABASE_URL in .env"
    DB_URL="mysql://user:password@localhost:3306/clouddory"
  fi

  cat > .env << EOF
DATABASE_URL="${DB_URL}"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
ADMIN_EMAILS=""
GEMINI_API_KEY=""
EOF

  echo -e "  ${GREEN}✓${NC} Created .env"

  # Set up database
  echo ""
  echo -e "${CYAN}→${NC} Setting up database schema..."
  npx prisma db push --skip-generate 2>&1 | tail -3
  npx prisma generate 2>&1 | tail -3
  echo -e "  ${GREEN}✓${NC} Database ready"

  # Build (needs ~1.5GB RAM — add swap if low memory)
  FREE_MEM=$(free -m 2>/dev/null | awk '/^Mem:/{print $7}' || echo "2048")
  if [ "${FREE_MEM:-2048}" -lt 1500 ] && [ ! -f /swapfile ]; then
    echo -e "  ${YELLOW}!${NC} Low memory detected (${FREE_MEM}MB). Adding swap..."
    sudo dd if=/dev/zero of=/swapfile bs=1M count=2048 2>/dev/null
    sudo chmod 600 /swapfile && sudo mkswap /swapfile &>/dev/null && sudo swapon /swapfile &>/dev/null
    echo -e "  ${GREEN}✓${NC} 2GB swap added"
  fi

  echo ""
  echo -e "${CYAN}→${NC} Building CloudDory (this may take a few minutes)..."
  npm run build 2>&1 | tail -5

  # Start
  echo ""
  echo -e "${CYAN}→${NC} Starting CloudDory..."
  npm start &
  DASHBOARD_PID=$!

  sleep 3

  echo ""
  echo -e "${GREEN}${BOLD}✓ CloudDory is running!${NC}"
  echo ""
  echo -e "  Dashboard:  ${CYAN}http://localhost:3000${NC}"
  echo -e "  PID:        $DASHBOARD_PID"
  echo ""
  echo -e "  ${YELLOW}First user to register becomes admin.${NC}"
fi

echo ""
echo -e "${BOLD}Next steps:${NC}"
echo "  1. Open http://localhost:3000 and create your account"
echo "  2. Go to Settings → AI Config to add Gemini/OpenAI/Anthropic keys"
echo "  3. Go to Settings → Cloud Accounts to connect AWS/GCP/Azure"
echo ""
echo -e "  Docs:    ${CYAN}https://clouddory.com/resources/docs/${NC}"
echo -e "  GitHub:  ${CYAN}https://github.com/ALANDVO/clouddory${NC}"
echo -e "  Support: ${CYAN}alanvo@gmail.com${NC}"
echo ""
