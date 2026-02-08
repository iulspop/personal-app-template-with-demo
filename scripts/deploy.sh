#!/usr/bin/env bash
set -euo pipefail

# Idempotent Fly.io deploy script.
# Reads app name and region from fly.toml, creates app/volume if missing,
# stages secrets from env vars, then deploys.
#
# Usage:
#   SESSION_SECRET=xxx RESEND_API_KEY=re_xxx EMAIL_FROM=noreply@example.com ./scripts/deploy.sh

# --- Prerequisites -----------------------------------------------------------

if ! command -v flyctl &>/dev/null; then
  echo "Error: flyctl is not installed. Install it from https://fly.io/docs/flyctl/install/"
  exit 1
fi

if ! flyctl auth whoami &>/dev/null; then
  echo "Error: not authenticated with Fly.io. Run 'flyctl auth login' first."
  exit 1
fi

# --- Read config from fly.toml -----------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
FLY_TOML="$PROJECT_DIR/fly.toml"

if [[ ! -f "$FLY_TOML" ]]; then
  echo "Error: fly.toml not found at $FLY_TOML"
  exit 1
fi

APP_NAME=$(grep '^app' "$FLY_TOML" | head -1 | sed 's/.*= *"\(.*\)"/\1/')
REGION=$(grep '^primary_region' "$FLY_TOML" | head -1 | sed 's/.*= *"\(.*\)"/\1/')

echo "App:    $APP_NAME"
echo "Region: $REGION"

# --- Create app if it doesn't exist ------------------------------------------

if flyctl apps list --json | grep -q "\"$APP_NAME\""; then
  echo "App '$APP_NAME' already exists."
else
  echo "Creating app '$APP_NAME'..."
  flyctl apps create "$APP_NAME" --org personal
fi

# --- Create volume if it doesn't exist ---------------------------------------

if flyctl volumes list --app "$APP_NAME" --json | grep -q '"name":"data"'; then
  echo "Volume 'data' already exists."
else
  echo "Creating volume 'data' (1GB) in $REGION..."
  flyctl volumes create data --app "$APP_NAME" --region "$REGION" --size 1 --yes
fi

# --- Stage secrets ------------------------------------------------------------

SECRETS_TO_SET=""

if [[ -n "${SESSION_SECRET:-}" ]]; then
  SECRETS_TO_SET+="SESSION_SECRET=$SESSION_SECRET "
else
  echo "Warning: SESSION_SECRET not set in environment, skipping (assumes already configured)."
fi

if [[ -n "${RESEND_API_KEY:-}" ]]; then
  SECRETS_TO_SET+="RESEND_API_KEY=$RESEND_API_KEY "
else
  echo "Warning: RESEND_API_KEY not set in environment, skipping (assumes already configured)."
fi

if [[ -n "${EMAIL_FROM:-}" ]]; then
  SECRETS_TO_SET+="EMAIL_FROM=$EMAIL_FROM "
else
  echo "Warning: EMAIL_FROM not set in environment, skipping (assumes already configured)."
fi

if [[ -n "$SECRETS_TO_SET" ]]; then
  echo "Staging secrets..."
  flyctl secrets set $SECRETS_TO_SET --app "$APP_NAME" --stage
fi

# --- Deploy -------------------------------------------------------------------

echo "Deploying..."
flyctl deploy --app "$APP_NAME" --config "$FLY_TOML"

echo ""
echo "Deploy complete!"
echo ""
echo "Next steps (first deploy only):"
echo "  1. Generate a deploy token:  flyctl tokens create deploy --app $APP_NAME"
echo "  2. Add FLY_API_TOKEN to your GitHub repo secrets"
