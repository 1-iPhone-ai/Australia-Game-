#!/usr/bin/env node
/**
 * Bundle agent-04-modes-scenarios src/ into operation-10m/modules/agent-04-modes-scenarios/chunk.tsx
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');
const MODULE_ID = 'agent-04-modes-scenarios';

const SOURCE_FILES = [
  'operation-10m/agent-04-modes-scenarios/src/types.ts',
  'operation-10m/agent-04-modes-scenarios/src/canonical-modes.ts',
  'operation-10m/agent-04-modes-scenarios/src/objective-evaluator.ts',
  'operation-10m/agent-04-modes-scenarios/src/scenarios/o10m-presets.ts',
  'operation-10m/agent-04-modes-scenarios/src/challenge-modes.ts',
  'operation-10m/agent-04-modes-scenarios/src/mission-milestones.ts',
  'operation-10m/agent-04-modes-scenarios/src/alt-victory.ts',
  'operation-10m/agent-04-modes-scenarios/src/catalog.ts',
  'operation-10m/agent-04-modes-scenarios/src/scenario-chains.ts',
  'operation-10m/agent-04-modes-scenarios/src/sandbox-knobs.ts',
  'operation-10m/agent-04-modes-scenarios/src/mode-interactions.ts',
];

function stripModuleImports(src) {
  const out = [];
  let skip = false;
  for (const line of src.split('\n')) {
    const st = line.trim();
    if (st.startsWith('export *')) continue;
    if (st.startsWith('import ') || st.startsWith('import type')) {
      skip = !st.includes(' from ') || !st.endsWith(';');
      continue;
    }
    if (skip) {
      if (line.includes(';')) skip = false;
      continue;
    }
    if (/ from ['"]\.\//.test(line)) continue;
    out.push(line);
  }
  return out.join('\n').trim();
}

const ASSEMBLY_SELF_TESTS = `
/** Agent 25 — smoke self-tests (subset of agent-04 npm test). */
export function runAgent04ModesScenariosSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; passed: boolean; detail?: string }> = [];
  const push = (id: string, passed: boolean, detail?: string) => results.push({ id, passed, detail });

  push('agent04_chunk_01', CANONICAL_GAME_MODE_SELECTIONS.length === 6, String(CANONICAL_GAME_MODE_SELECTIONS.length));
  push('agent04_chunk_02', O10M_OPERATION_SCENARIOS.length >= 8, String(O10M_OPERATION_SCENARIOS.length));
  push('agent04_chunk_03', O10M_SCENARIO_CHAINS.length === 3, String(O10M_SCENARIO_CHAINS.length));
  push('agent04_chunk_04', O10M_SANDBOX_KNOB_PROFILES.length >= 4, String(O10M_SANDBOX_KNOB_PROFILES.length));

  const modeOk = resolveModeInteraction({
    baseMode: 'scenario',
    scenarioId: 'o10m_silent_diplomat',
    challengeModeIds: ['o10m_ironman'],
    scenarioModeEnabled: true,
  });
  push('agent04_chunk_05', modeOk.ok, modeOk.errors.join('; ') || undefined);

  const chainProgress = initializeChainProgress('o10m_chain_northern_corridor');
  push('agent04_chunk_06', chainProgress !== null && chainProgress.activeStepIndex === 0);

  const merged = mergePlayableScenarioCatalog([{ id: 'outback_siege' } as ScenarioDefinition]);
  push('agent04_chunk_07', merged.collisionIds.length === 0 && merged.o10mIds.length === O10M_OPERATION_SCENARIOS.length);

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

export const OP10M_AGENT04_MODULE_META = {
  moduleId: '${MODULE_ID}',
  schemaVersion: 'op10m-agent04-v1',
  integrationDoc: 'operation-10m/agent-04-modes-scenarios/INTEGRATION.md',
  slot: 'scenario-engine-extension',
} as const;
`.trim();

const bundled = SOURCE_FILES.map(rel => {
  const abs = resolve(repoRoot, rel);
  const label = rel.replace('operation-10m/agent-04-modes-scenarios/', '');
  return `// --- bundled from ${label} ---\n${stripModuleImports(readFileSync(abs, 'utf8'))}`;
}).join('\n\n');

const header = `// OP10M_MODULE_BEGIN ${MODULE_ID}
// Operation 10M — Agent 04 modes / missions / scenarios (bundled for Agent 25 assembly).
// Source tree: operation-10m/agent-04-modes-scenarios/src/ — regenerate via npm run bundle:agent-04-chunk
`;

const footer = `
${ASSEMBLY_SELF_TESTS}
// OP10M_MODULE_END ${MODULE_ID}
`;

const chunk = header + bundled + '\n\n' + footer;
const outDir = resolve(repoRoot, 'operation-10m/modules/agent-04-modes-scenarios');
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, 'chunk.tsx');
writeFileSync(outPath, chunk);

const begin = `// OP10M_MODULE_BEGIN ${MODULE_ID}`;
const end = `// OP10M_MODULE_END ${MODULE_ID}`;
const bi = chunk.indexOf(begin);
const ei = chunk.indexOf(end);
const body = chunk.slice(bi + begin.length, ei).trim();
const hash = createHash('sha256').update(body, 'utf8').digest('hex');

const manifest = {
  moduleId: MODULE_ID,
  slot: 'scenario-engine-extension',
  touchesSaveFormat: true,
  proposedGameStateFields: ['o10mChainProgress', 'o10mMissionMilestones', 'o10mSandboxProfileId'],
  contentSha256: hash,
  chunkPath: 'operation-10m/modules/agent-04-modes-scenarios/chunk.tsx',
  regenerate: 'cd operation-10m/agent-04-modes-scenarios && npm run bundle:agent-04-chunk',
};

writeFileSync(resolve(outDir, 'module.manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${outPath} (${chunk.split('\n').length} lines, sha256=${hash})`);
