#!/usr/bin/env bash
set -euo pipefail
REPO=/home/ubuntu/australia-game-gate
cd "$REPO"
BASE=7f862be03eba92ecc85d27e54e20c72cd3d2d9cd
FEAT_MSG='feat(op10m): O10-267 · wave 61 · round 61'
MERGE_MSG='merge(op10m): integrate O10-266 baseline 7f862be0 for wave 61'
FETCH="git fetch origin 'refs/heads/op10m/*:refs/remotes/origin/op10m/*'"

push_one() {
  local num="$1" branch="$2" test_cmd="$3"
  local work="work/w61-agent-${num}"
  local COORD=/home/ubuntu/australia-game-gate/.coord-wave61-batch-13-18
  echo "======== Agent ${num} (${branch}) ========"
  $FETCH
  git checkout -B "$work" "origin/${branch}"
  mkdir -p scripts
  cp "$COORD/op10m-wave61-batch-13-18.mjs" scripts/op10m-wave61-batch-13-18.mjs
  git merge "$BASE" -m "$MERGE_MSG" || true
  node scripts/op10m-wave61-batch-13-18.mjs "$num"
  eval "$test_cmd"
  git add -A
  if git diff --cached --quiet; then
    echo "Nothing to commit agent ${num}"
    return 1
  fi
  git commit -m "$FEAT_MSG"
  $FETCH
  git push origin "${work}:${branch}"
}

case "${1:-all}" in
  13)
    push_one 13 op10m/agent-13-energy-environment "npm run test:agent-13 && npm run test:agent-13-supplements"
    ;;
  14)
    push_one 14 op10m/agent-14-housing-wellbeing "npm run test:agent-14-housing"
    ;;
  15)
    push_one 15 op10m/agent-15-trade "npm run test:agent15"
    ;;
  16)
    push_one 16 op10m/agent-16-guardian "npm run test:agent16"
    ;;
  17)
    push_one 17 op10m/agent-17-command-center "npm run test:agent17"
    ;;
  18)
    push_one 18 op10m/agent-18-team-ai "npm run test:agent18"
    ;;
  all)
    bash "$0" 13
    bash "$0" 14
    bash "$0" 15
    bash "$0" 16
    bash "$0" 17
    bash "$0" 18
    ;;
  *)
    echo "Usage: $0 <13|14|15|16|17|18|all>"
    exit 1
    ;;
esac
