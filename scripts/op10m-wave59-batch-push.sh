#!/usr/bin/env bash
set -euo pipefail
REPO=/home/ubuntu/australia-game-gate
cd "$REPO"
BASE=4182618c60ef4f19fc7d6911ee33123124fa6a23
FEAT_MSG='feat(op10m): O10-263 · wave 59 · round 59'
MERGE_MSG='merge(op10m): integrate O10-261 baseline 4182618c for wave 59'
FETCH="git fetch origin 'refs/heads/op10m/*:refs/remotes/origin/op10m/*'"

replace59() {
  sed -e 's/wave58/wave59/g' -e 's/Wave58/Wave59/g' -e 's/WAVE_58/WAVE_59/g' \
    -e 's/wave-58/wave-59/g' -e 's/Wave 58/Wave 59/g' -e 's/round 58/round 59/g' \
    -e 's/O10-260/O10-263/g' -e 's/O10m260/O10m263/g' -e 's/o10-260/o10-263/g' \
    -e 's/O10-257/O10-260/g' -e 's/O10m257/O10m260/g' \
    -e 's/3_139_519/3_166_371/g' -e 's/feb7e524/4182618c/g' \
    -e 's/10.14.58-scale-wave-58/10.14.59-scale-wave-59/g'
}

push_one() {
  local num="$1" branch="$2" test_cmd="$3"
  local work="work/w59-agent-${num}"
  echo "======== Agent ${num} (${branch}) ========"
  $FETCH
  git checkout -B "$work" "origin/${branch}"
  git merge "$BASE" -m "$MERGE_MSG" || true
  node scripts/op10m-wave59-batch-13-18.mjs "$num"
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
