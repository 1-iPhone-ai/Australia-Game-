/**
 * Bundles module `src/` into assembly-ready `chunk.tsx` with OP10M markers.
 * See operation-10m/INTEGRATION.md (integration branch) — no npm/local imports in output.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleRoot = resolve(__dirname, '..');
const moduleId = 'agent-01-strategic-gameplay';
const moduleVersion = '5.12.0';

/** Stable concat order: dependencies before dependents. */
const SOURCE_FILES = [
  'src/contracts/economy.ts',
  'src/contracts/government.ts',
  'src/contracts/population.ts',
  'src/contracts/tech.ts',
  'src/contracts/ui.ts',
  'src/types/national-priority.ts',
  'src/types/coalition-mandate.ts',
  'src/types/strategic-action.ts',
  'src/engine/commitment-journal.ts',
  'src/engine/action-prerequisites.ts',
  'src/engine/priority-momentum.ts',
  'src/engine/consequence-forecast.ts',
  'src/engine/strategic-synergies.ts',
  'src/engine/strategic-mandate.ts',
  'src/engine/stakeholder-coalition.ts',
  'src/engine/coalition-balance.ts',
  'src/engine/mandate-idle-drift.ts',
  'src/engine/coalition-crisis.ts',
  'src/engine/coalition-crisis-pressure.ts',
  'src/engine/coalition-recovery-pressure.ts',
  'src/engine/coalition-crisis-gates.ts',
  'src/engine/coalition-recovery.ts',
  'src/engine/coalition-volatility.ts',
  'src/engine/coalition-volatility-pressure.ts',
  'src/engine/coalition-volatility-gates.ts',
  'src/engine/coalition-stabilization.ts',
  'src/engine/coalition-stabilization-gates.ts',
  'src/engine/coalition-lock-in.ts',
  'src/engine/coalition-lock-in-gates.ts',
  'src/engine/cross-module-sync-gates.ts',
  'src/integrations/strategic-cross-module-hooks.ts',
  'src/integrations/external-coalition-turn-signals.ts',
  'src/engine/coalition-integrated-maturity.ts',
  'src/engine/coalition-integrated-maturity-gates.ts',
  'src/engine/coalition-stewardship.ts',
  'src/engine/coalition-stewardship-gates.ts',
  'src/engine/coalition-anchored-governance.ts',
  'src/engine/coalition-anchored-governance-gates.ts',
  'src/engine/coalition-institutional-permanence.ts',
  'src/engine/coalition-institutional-permanence-gates.ts',
  'src/engine/coalition-generational-continuity.ts',
  'src/engine/coalition-generational-continuity-gates.ts',
  'src/engine/coalition-civilizational-endurance.ts',
  'src/engine/coalition-civilizational-endurance-gates.ts',
  'src/engine/coalition-transcendent-legacy.ts',
  'src/engine/coalition-transcendent-legacy-gates.ts',
  'src/engine/coalition-sovereign-continuum.ts',
  'src/engine/coalition-sovereign-continuum-gates.ts',
  'src/engine/coalition-eternal-ascendance.ts',
  'src/engine/coalition-eternal-ascendance-gates.ts',
  'src/engine/coalition-infinite-persistence.ts',
  'src/engine/coalition-infinite-persistence-gates.ts',
  'src/engine/coalition-primordial-continuity.ts',
  'src/engine/coalition-primordial-continuity-gates.ts',
  'src/engine/coalition-absolute-sanctity.ts',
  'src/engine/coalition-absolute-sanctity-gates.ts',
  'src/engine/coalition-universal-immortality.ts',
  'src/engine/coalition-universal-immortality-gates.ts',
  'src/engine/coalition-cosmic-perpetuity.ts',
  'src/engine/coalition-cosmic-perpetuity-gates.ts',
  'src/engine/coalition-galactic-infinity.ts',
  'src/engine/coalition-galactic-infinity-gates.ts',
  'src/engine/coalition-stellar-transcendence.ts',
  'src/engine/coalition-stellar-transcendence-gates.ts',
  'src/engine/coalition-quantum-omnipresence.ts',
  'src/engine/coalition-quantum-omnipresence-gates.ts',
  'src/engine/coalition-multiversal-persistence.ts',
  'src/engine/coalition-multiversal-persistence-gates.ts',
  'src/engine/coalition-metaversal-continuity.ts',
  'src/engine/coalition-metaversal-continuity-gates.ts',
  'src/engine/coalition-omniversal-synthesis.ts',
  'src/engine/coalition-omniversal-synthesis-gates.ts',
  'src/engine/coalition-hyperversal-harmonization.ts',
  'src/engine/coalition-hyperversal-harmonization-gates.ts',
  'src/engine/coalition-transcendent-omnium.ts',
  'src/engine/coalition-transcendent-omnium-gates.ts',
  'src/engine/coalition-supreme-convergence.ts',
  'src/engine/coalition-supreme-convergence-gates.ts',
  'src/engine/coalition-apex-transcendence.ts',
  'src/engine/coalition-apex-transcendence-gates.ts',
  'src/engine/coalition-zenith-perpetuity.ts',
  'src/engine/coalition-zenith-perpetuity-gates.ts',
  'src/engine/coalition-paragon-infinity.ts',
  'src/engine/coalition-paragon-infinity-gates.ts',
  'src/engine/coalition-paramount-ascendancy.ts',
  'src/engine/coalition-paramount-ascendancy-gates.ts',
  'src/engine/coalition-imperial-perpetuity.ts',
  'src/engine/coalition-imperial-perpetuity-gates.ts',
  'src/engine/coalition-custodial-eternity.ts',
  'src/engine/coalition-custodial-eternity-gates.ts',
  'src/engine/coalition-vanguard-synthesis.ts',
  'src/engine/coalition-vanguard-synthesis-gates.ts',
  'src/engine/coalition-sentinel-ascendancy.ts',
  'src/engine/coalition-sentinel-ascendancy-gates.ts',
  'src/engine/coalition-oracle-perpetuity.ts',
  'src/engine/coalition-oracle-perpetuity-gates.ts',
  'src/engine/coalition-archon-eternity.ts',
  'src/engine/coalition-archon-eternity-gates.ts',
  'src/engine/coalition-exarch-ascendancy.ts',
  'src/engine/coalition-exarch-ascendancy-gates.ts',
  'src/engine/coalition-primarch-perpetuity.ts',
  'src/engine/coalition-primarch-perpetuity-gates.ts',
  'src/engine/coalition-patriarch-eternity.ts',
  'src/engine/coalition-patriarch-eternity-gates.ts',
  'src/engine/coalition-matriarch-ascendancy.ts',
  'src/engine/coalition-matriarch-ascendancy-gates.ts',
  'src/engine/coalition-matriarch-perpetuity.ts',
  'src/engine/coalition-matriarch-perpetuity-gates.ts',
  'src/engine/coalition-matriarch-eternity.ts',
  'src/engine/coalition-matriarch-eternity-gates.ts',
  'src/engine/coalition-matriarch-infinity.ts',
  'src/engine/coalition-matriarch-infinity-gates.ts',
  'src/engine/coalition-matriarch-transcendence.ts',
  'src/engine/coalition-matriarch-transcendence-gates.ts',
  'src/engine/coalition-matriarch-apotheosis.ts',
  'src/engine/coalition-matriarch-apotheosis-gates.ts',
  'src/engine/coalition-matriarch-deification.ts',
  'src/engine/coalition-matriarch-deification-gates.ts',
  'src/engine/coalition-matriarch-omnipotence.ts',
  'src/engine/coalition-matriarch-omnipotence-gates.ts',
  'src/engine/coalition-matriarch-sovereignty.ts',
  'src/engine/coalition-matriarch-sovereignty-gates.ts',
  'src/engine/coalition-gates.ts',
  'src/engine/mandate-gates.ts',
  'src/engine/strategic-save.ts',
  'src/engine/tradeoff-mitigation.ts',
  'src/engine/validation.ts',
  'src/engine/strategic-recommendations.ts',
  'src/engine/turn-briefing.ts',
  'src/engine/delayed-effects.ts',
  'src/engine/strategic-calendar.ts',
  'src/engine/strategic-gameplay-engine.ts',
  'src/catalog/strategic-action-catalog.ts',
  'src/adapters/memory-contracts.ts',
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
    `// Operation 10M — Agent 01 Strategic Gameplay`,
    `// Bundled for Agent 25 assembly (no external imports).`,
  ];

  for (const rel of SOURCE_FILES) {
    const abs = resolve(moduleRoot, rel);
    const raw = readFileSync(abs, 'utf8');
    parts.push(`// --- ${rel} ---`, stripModuleImports(raw));
  }

  parts.push(
    `export const AGENT_01_MODULE_ID = 'operation-10m/${moduleId}';`,
    `export const AGENT_01_MODULE_VERSION = '${moduleVersion}';`,
    '',
    `export function runOp10mAgent01StrategicGameplaySelfTests(): {`,
    `  passed: number;`,
    `  failed: number;`,
    `  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;`,
    `} {`,
    `  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];`,
    `  results.push({`,
    `    id: 'agent01_catalog',`,
    `    name: 'strategic action catalog non-empty',`,
    `    passed: listStrategicActions().length >= 36,`,
    `  });`,
    `  const contracts = createMemoryStrategicContracts();`,
    `  const action = getStrategicAction('sga_supply_chain_buffer');`,
    `  results.push({`,
    `    id: 'agent01_validate',`,
    `    name: 'default validate supply chain action',`,
    `    passed:`,
    `      !!action &&`,
    `      validateAction(action, contracts, { actionsUsedThisTurn: 0, actionsPerTurn: 3 }).length === 0,`,
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
  return `${begin}\n// content-sha256-prefix: ${hash}\n${body}\n${end}\n`;
}

const body = bundleSources();
const chunk = wrapChunk(body);
const outPath = resolve(moduleRoot, 'chunk.tsx');
writeFileSync(outPath, chunk, 'utf8');
console.log(`Wrote ${outPath} (${chunk.split('\n').length} lines, sha256~${createHash('sha256').update(body).digest('hex').slice(0, 16)})`);
