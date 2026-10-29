#!/usr/bin/env bash
set -euo pipefail
REPO=/home/ubuntu/australia-game-gate
cd "$REPO"
BASE=feb7e524
FEAT_MSG='feat(op10m): O10-260 · wave 58 · round 58'
MERGE_MSG='merge(op10m): integrate O10-258 baseline feb7e524 for wave 58'
FETCH="git fetch origin 'refs/heads/op10m/*:refs/remotes/origin/op10m/*'"

replace58() {
  sed -e 's/wave57/wave58/g' -e 's/Wave57/Wave58/g' -e 's/WAVE_57/WAVE_58/g' \
    -e 's/wave-57/wave-58/g' -e 's/Wave 57/Wave 58/g' -e 's/round 57/round 58/g' \
    -e 's/O10-257/O10-260/g' -e 's/O10m257/O10m260/g' -e 's/o10-257/o10-260/g' \
    -e 's/O10m254/O10m257/g' -e 's/O10-254/O10-257/g' \
    -e 's/3_112_667/3_139_519/g' -e 's/93c42b3d/feb7e524/g' \
    -e 's/10.14.57-scale-wave-57/10.14.58-scale-wave-58/g'
}

push_agent() {
  local num="$1" branch="$2" work="$3" test_cmd="$4"
  echo "======== Agent $num ========"
  git checkout -B "$work" "origin/$branch"
  git merge "$BASE" -m "$MERGE_MSG" || true
  node scripts/op10m-wave58-batch-13-18.mjs "$num"
  eval "$test_cmd"
  git add -A
  git diff --cached --quiet && { echo "Nothing to commit agent $num"; return; }
  git commit -m "$FEAT_MSG"
  $FETCH
  git push origin "$work:$branch"
}

# Agent 14 extra wiring
wire_agent14() {
  local d=operation-10m/agent-14-housing
  grep -q wave58-gate-trajectory "$d/index.ts" || sed -i "/wave57-gate-trajectory.ts/a export * from './agent25-wave58-projection-handoff-brief.ts';\nexport * from './wave58-integration-monitor.ts';\nexport * from './wave58-gate-trajectory.ts';" "$d/index.ts"
  grep -q wave57-gate-trajectory.ts "$d/scripts/build-chunk.mjs" && grep -q wave58-gate-trajectory "$d/scripts/build-chunk.mjs" || sed -i "/agent25-wave57-projection-handoff-brief.ts/a\  'wave58-gate-trajectory.ts',\n  'wave58-integration-monitor.ts',\n  'agent25-wave58-projection-handoff-brief.ts'," "$d/scripts/build-chunk.mjs"
  if ! grep -q Wave58GateBand "$d/types.ts"; then
    replace58 < <(sed -n '/^export type Wave57GateBand/,/^}$/p' "$d/types.ts" | head -n 40) >> "$d/types.ts" || true
  fi
  if ! grep -q wave57_projection_composer "$d/self-tests.ts" | grep -q wave58; then
    python3 <<'PY'
import re
p='operation-10m/agent-14-housing/self-tests.ts'
t=open(p).read()
if 'wave58_projection_composer' in t:
    raise SystemExit(0)
block=re.search(r"\n  \{\n    const raw57 = sanitizeWave57.*?\n  \}\n", t, re.S)
if not block:
    raise SystemExit('no wave57 block')
b=block.group(0)
b58=b.replace('57','58').replace('56','57').replace('O10m254','O10m257').replace('O10-254','O10-257').replace('wave56Brief','wave57Brief').replace('Wave56','Wave57').replace('wave56','wave57')
# fix double replacements in wave577
b58=b58.replace('wave577','wave57').replace('Wave577','Wave57')
imports='''import {
  advanceWave58GateTrajectory,
  createInitialWave58GateTrajectory,
  sanitizeWave58GateTrajectory,
} from './wave58-gate-trajectory.ts';
import { buildWave58IntegrationMonitor } from './wave58-integration-monitor.ts';
import { composeAgent25Wave58ProjectionHandoffBrief } from './agent25-wave58-projection-handoff-brief.ts';
'''
if 'advanceWave58GateTrajectory' not in t:
    t=t.replace("import { composeAgent25Wave57ProjectionHandoffBrief } from './agent25-wave57-projection-handoff-brief.ts';", "import { composeAgent25Wave57ProjectionHandoffBrief } from './agent25-wave57-projection-handoff-brief.ts';\n"+imports)
t=t.replace(block.group(0), block.group(0)+b58)
open(p,'w').write(t)
PY
  fi
}

# Agent 15 types persist
wire_agent15() {
  local d=operation-10m/agent-15-trade/src
  grep -q wave58Sovereign "$d/types.ts" || sed -i '/wave57SovereignHandoffDepthStackingSmoothing/a\  wave58SovereignHandoffDepthStackingSmoothing?: number;' "$d/types.ts"
  grep -q o10-260-wave58 "$d/trade-turn.ts" || sed -i "/o10-257-wave57/a import { computeWave58SovereignHandoffDepthStackingSnapshot, wave58SovereignHandoffDepthStackingExportScale } from './o10-260-wave58-sovereign-handoff-depth-stacking.ts';" "$d/trade-turn.ts" || true
  grep -q wave58Sovereign "$d/self-tests.ts" || python3 <<'PY'
p='operation-10m/agent-15-trade/src/self-tests.ts'
t=open(p).read()
if 'wave58_stacking' in t: raise SystemExit(0)
ins="""  {
    const w57 = { score: 0.82, band: 'tiered' as const, summary: 'w57' };
    const r = computeWave58SovereignHandoffDepthStackingSnapshot({ wave57Stacking: w57, persisted: {} as GTELPersisted });
    ok(r.snapshot.score > 0.5, 'wave58_stacking');
  }
"""
if 'computeWave58' not in t:
    t=t.replace("from './o10-257-wave57-sovereign-handoff-depth-stacking.ts';", "from './o10-257-wave57-sovereign-handoff-depth-stacking.ts';\nimport { computeWave58SovereignHandoffDepthStackingSnapshot } from './o10-260-wave58-sovereign-handoff-depth-stacking.ts';")
t=t.replace('export function runAgent15SelfTests', ins+'\nexport function runAgent15SelfTests')
open(p,'w').write(t)
PY
}

case "${1:-}" in
  14)
    git checkout -B work/agent-14 origin/op10m/agent-14-housing-wellbeing
    git merge "$BASE" -m "$MERGE_MSG"
    for f in wave57-gate-trajectory.ts wave57-integration-monitor.ts agent25-wave57-projection-handoff-brief.ts; do
      out=${f/wave57/wave58}
      replace58 < "operation-10m/agent-14-housing/$f" > "operation-10m/agent-14-housing/$out"
    done
    wire_agent14
    npm run test:agent-14-housing
    git add -A && git commit -m "$FEAT_MSG"
    $FETCH && git push origin work/agent-14:op10m/agent-14-housing-wellbeing
    ;;
  15)
    git checkout -B work/agent-15 origin/op10m/agent-15-trade
    git merge "$BASE" -m "$MERGE_MSG"
    replace58 < operation-10m/agent-15-trade/src/o10-257-wave57-sovereign-handoff-depth-stacking.ts | \
      sed -e 's/o10-257-wave57/o10-260-wave58/g' -e 's/GTELWave57/GTELWave58/g' -e 's/wave57Sovereign/wave58Sovereign/g' \
          -e 's/wave56Stacking/wave57Stacking/g' -e 's/GTELWave56/GTELWave57/g' -e 's/wave56Stacking/wave57Stacking/g' \
      > operation-10m/agent-15-trade/src/o10-260-wave58-sovereign-handoff-depth-stacking.ts
    wire_agent15
    npm run test:agent15
    git add -A && git commit -m "$FEAT_MSG"
    $FETCH && git push origin work/agent-15:op10m/agent-15-trade
    ;;
  16)
    git checkout -B work/agent-16 origin/op10m/agent-16-guardian
    git merge "$BASE" -m "$MERGE_MSG"
    node scripts/op10m-wave58-batch-13-18.mjs 16
    npm run test:agent16
    git add -A && git commit -m "$FEAT_MSG"
    $FETCH && git push origin work/agent-16:op10m/agent-16-guardian
    ;;
  17)
    git checkout -B work/agent-17 origin/op10m/agent-17-command-center
    git merge "$BASE" -m "$MERGE_MSG"
    node scripts/op10m-wave58-batch-13-18.mjs 17
    npm run test:agent17
    git add -A && git commit -m "$FEAT_MSG"
    $FETCH && git push origin work/agent-17:op10m/agent-17-command-center
    ;;
  18)
    git checkout -B work/agent-18 origin/op10m/agent-18-team-ai
    git merge "$BASE" -m "$MERGE_MSG"
    node scripts/op10m-wave58-batch-13-18.mjs 18
    npm run test:agent18
    git add -A && git commit -m "$FEAT_MSG"
    $FETCH && git push origin work/agent-18:op10m/agent-18-team-ai
    ;;
  *)
    echo "Usage: $0 <14|15|16|17|18>"
    exit 1
    ;;
esac
