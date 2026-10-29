/**
 * Bundles module `src/` into assembly-ready `chunk.tsx` with OP10M markers.
 * See operation-10m/agent-02-turns-time/INTEGRATION.md — no npm/local imports in output.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleRoot = resolve(__dirname, '..');
const moduleId = 'agent-02-turns-time';

/** Stable concat order: dependencies before dependents. */
const SOURCE_FILES = [
  'src/types.ts',
  'src/turn-sequence.ts',
  'src/scheduled-obligations.ts',
  'src/event-scheduling-queue.ts',
  'src/multi-turn-construction.ts',
  'src/defer-schedule.ts',
  'src/delayed-consequences.ts',
  'src/construction-pause-slip.ts',
  'src/cancel-cascade.ts',
  'src/turn-horizon.ts',
  'src/replay-compare.ts',
  'src/pipeline-stages.ts',
  'src/plan-actual-reconcile.ts',
  'src/advance-budget.ts',
  'src/external-day-plan.ts',
  'src/external-day-plan-window.ts',
  'src/pipeline-stage-coverage.ts',
  'src/turn-pipeline-report.ts',
  'src/diagnostics.ts',
  'src/turn-audit.ts',
  'src/pause-resume.ts',
  'src/engine.ts',
  'src/batch-advance.ts',
  'src/batch-pipeline-report.ts',
  'src/fast-forward.ts',
] as const;

function stripModuleImports(source: string): string {
  const lines = source.split('\n');
  const out: string[] = [];
  let skippingImport = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (skippingImport) {
      if (trimmed.includes(';') || trimmed.startsWith('from ')) {
        skippingImport = false;
      }
      continue;
    }

    if (/^import\s/.test(trimmed)) {
      if (!trimmed.includes(';') && !/from\s+['"]/.test(trimmed)) {
        skippingImport = true;
      }
      continue;
    }

    if (/^export\s+\{[^}]*\}\s+from\s+['"]/.test(trimmed)) continue;
    if (/^export\s+\*\s+from\s+['"]/.test(trimmed)) continue;

    out.push(line);
  }

  return out.join('\n').trim();
}

function bundleSources(): string {
  const parts: string[] = [
    `// Operation 10M — Agent 02 Turns, Time, and Delayed Consequences`,
    `// Bundled for Agent 25 assembly (no external imports).`,
    `// Host wiring: INTEGRATION.md in operation-10m/agent-02-turns-time/`,
  ];

  for (const rel of SOURCE_FILES) {
    const abs = resolve(moduleRoot, rel);
    const raw = readFileSync(abs, 'utf8');
    parts.push(`// --- ${rel} ---`, stripModuleImports(raw));
  }

  parts.push(
    `export const AGENT_02_MODULE_ID = 'operation-10m/${moduleId}';`,
    `export const AGENT_02_MODULE_VERSION = '1.6.0';`,
    '',
    `export function runOp10mAgent02TurnsTimeSelfTests(): {`,
    `  passed: number;`,
    `  failed: number;`,
    `  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;`,
    `} {`,
    `  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];`,
    `  const engine = new TurnTimeEngine();`,
    `  engine.registerObligation({ id: 'self_ob', dueTurn: 1, kind: 'self_test' });`,
    `  const step = engine.stepFullTurn();`,
    `  results.push({`,
    `    id: 'agent02_obligation_once',`,
    `    name: 'obligation fires once on turn 1',`,
    `    passed:`,
    `      step.firedObligationIds.length === 1 &&`,
    `      step.firedObligationIds[0] === 'self_ob' &&`,
    `      engine.snapshot().obligations[0]?.status === 'fired',`,
    `  });`,
    `  const paused = new TurnTimeEngine();`,
    `  paused.scheduleEvent({ id: 'self_ev', dueTurn: 1, kind: 'tick' });`,
    `  paused.setPaused('self_test');`,
    `  const blocked = paused.stepFullTurn();`,
    `  results.push({`,
    `    id: 'agent02_pause_blocks',`,
    `    name: 'pause blocks turn advance',`,
    `    passed:`,
    `      blocked.blockedByPause === true &&`,
    `      blocked.clockBefore.turnIndex === blocked.clockAfter.turnIndex,`,
    `  });`,
    `  paused.clearPaused();`,
    `  paused.stepFullTurn();`,
    `  results.push({`,
    `    id: 'agent02_integrity',`,
    `    name: 'validate() ok after resume step',`,
    `    passed: paused.validate().ok,`,
    `  });`,
    `  const chain = new TurnTimeEngine();`,
    `  chain.registerObligation({ id: 'parent', dueTurn: 1, kind: 'seed' });`,
    `  chain.registerFollowUp({`,
    `    id: 'fu1',`,
    `    triggerRefId: 'parent',`,
    `    trigger: 'obligation_fired',`,
    `    dueTurnOffset: 1,`,
    `    spawnKind: 'obligation',`,
    `    spawnId: 'child',`,
    `    spawnKindLabel: 'ripple',`,
    `  });`,
    `  chain.stepFullTurn();`,
    `  chain.stepFullTurn();`,
    `  results.push({`,
    `    id: 'agent02_follow_up',`,
    `    name: 'follow-up obligation fires on schedule',`,
    `    passed: chain.snapshot().obligations.find((o) => o.id === 'child')?.status === 'fired',`,
    `  });`,
    `  const horizon = new TurnTimeEngine();`,
    `  horizon.registerObligation({ id: 'h1', dueTurn: 2, kind: 'h' });`,
    `  results.push({`,
    `    id: 'agent02_horizon',`,
    `    name: 'turn horizon lists pending obligation',`,
    `    passed: horizon.planThroughTurn(2).some((p) => p.id === 'h1'),`,
    `  });`,
    `  const pipeline = new TurnTimeEngine();`,
    `  pipeline.registerObligation({ id: 'pipe', dueTurn: 1, kind: 'pipe' });`,
    `  const pipeBefore = pipeline.snapshot();`,
    `  pipeline.stepFullTurn();`,
    `  results.push({`,
    `    id: 'agent02_pipeline',`,
    `    name: 'pipeline stages recorded for full turn',`,
    `    passed:`,
    `      pipeline.listRegisteredPipelineStageIds().length === 9 &&`,
    `      pipeline.getPipelineStageHits().some((h) => h.stageId === 'ag02:phase.end') &&`,
    `      pipeline.reconcileLastStepHorizon(pipeBefore).ok,`,
    `  });`,
    `  const dayPlan = new TurnTimeEngine();`,
    `  dayPlan.scheduleEvent({ id: 'xs_ev', dueTurn: 1, kind: 'xs' });`,
    `  results.push({`,
    `    id: 'agent02_day_plan',`,
    `    name: 'external day plan merge ok when aligned',`,
    `    passed: dayPlan.mergeExternalDayPlan(1, ['xs_ev']).ok,`,
    `  });`,
    `  const windowPlan = new TurnTimeEngine();`,
    `  windowPlan.scheduleEvent({ id: 'w1', dueTurn: 1, kind: 'w' });`,
    `  windowPlan.scheduleEvent({ id: 'w2', dueTurn: 2, kind: 'w' });`,
    `  results.push({`,
    `    id: 'agent02_day_plan_window',`,
    `    name: 'external day plan window merge ok when aligned',`,
    `    passed: windowPlan.mergeExternalDayPlanWindow(1, 2, { 1: ['w1'], 2: ['w2'] }).ok,`,
    `  });`,
    `  const failed = results.filter((r) => !r.passed).length;`,
    `  return { passed: results.length - failed, failed, results };`,
    `}`,
  );

  return parts.join('\n\n');
}

function wrapChunk(body: string): string {
  const begin = `// OP10M_MODULE_BEGIN ${moduleId}`;
  const end = `// OP10M_MODULE_END ${moduleId}`;
  const hash = createHash('sha256').update(body).digest('hex').slice(0, 16);
  return `${begin}\n// @ts-nocheck\n// content-sha256-prefix: ${hash}\n${body}\n${end}\n`;
}

const body = bundleSources();
const chunk = wrapChunk(body);
const outPath = resolve(moduleRoot, 'chunk.tsx');
writeFileSync(outPath, chunk, 'utf8');
console.log(`Wrote ${outPath} (${chunk.split('\n').length} lines, sha256~${createHash('sha256').update(body).digest('hex').slice(0, 16)})`);
