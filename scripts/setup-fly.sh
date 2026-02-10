#!/usr/bin/env bash
set -euo pipefail

# Setup Fly.io app, secrets, volume, and GitHub Actions deploy token.
# Reads RESEND_API_KEY and EMAIL_FROM from .env (SESSION_SECRET is generated fresh).

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$ROOT_DIR/.env"

# Parse fly.toml for app name and region
APP_NAME=$(grep '^app' "$ROOT_DIR/fly.toml" | head -1 | sed 's/app = "//;s/"//')
REGION=$(grep 'primary_region' "$ROOT_DIR/fly.toml" | head -1 | sed 's/primary_region = "//;s/"//')

# Load .env
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found at $ENV_FILE"
  exit 1
fi
source <(grep -E '^[A-Z_]+=.' "$ENV_FILE" | sed 's/^/export /')

echo "==> Creating Fly app: $APP_NAME (region: $REGION)"
fly apps create "$APP_NAME" 2>/dev/null || echo "    App already exists, skipping."

echo "==> Creating volume: data (1GB in $REGION)"
fly volumes create data --region "$REGION" --size 1 --app "$APP_NAME" --yes 2>/dev/null || echo "    Volume already exists, skipping."

echo "==> Setting Fly secrets"
fly secrets set \
  SESSION_SECRET="$(openssl rand -hex 32)" \
  RESEND_API_KEY="${RESEND_API_KEY}" \
  EMAIL_FROM="${EMAIL_FROM}" \
  --app "$APP_NAME"

echo "==> Deploying to Fly"
fly deploy --remote-only --app "$APP_NAME"

echo "==> Verifying healthcheck"
curl -sf "https://${APP_NAME}.fly.dev/healthcheck" && echo " OK" || echo " FAILED"

REPO=$(cd "$ROOT_DIR" && gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [ -n "$REPO" ]; then
  echo "==> Setting FLY_API_TOKEN GitHub secret for $REPO"
  fly tokens create deploy -x 999999h --app "$APP_NAME" | gh secret set FLY_API_TOKEN -R "$REPO"
  echo "    Done. CI will auto-deploy on push to main."
else
  echo "==> No GitHub repo detected. Set FLY_API_TOKEN manually:"
  echo "    fly tokens create deploy -x 999999h | gh secret set FLY_API_TOKEN -R <owner/repo>"
fi

echo ""
echo "==> Setup complete! App live at https://${APP_NAME}.fly.dev"
