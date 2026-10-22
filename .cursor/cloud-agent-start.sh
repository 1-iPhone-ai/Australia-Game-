#!/usr/bin/env bash
# Boot the Aussie Adventure dev server. Safe to run again if port 5173 is up.
set -euo pipefail
cd /workspace

if [ ! -f package.json ]; then
  echo "Dev harness missing. Run .cursor/cloud-agent-install.sh first." >&2
  exit 1
fi

if curl -fsS -o /dev/null --max-time 2 http://127.0.0.1:5173/; then
  echo "Vite already listening on port 5173"
  exit 0
fi

exec npm run dev -- --host 0.0.0.0 --port 5173
