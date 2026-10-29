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

/** Stable concat order: dependencies before dependents. */
const SOURCE_FILES = [
  'src/contracts/economy.ts',
  'src/contracts/government.ts',
  'src/contracts/population.ts',
  'src/contracts/tech.ts',
  'src/contracts/ui.ts',
  'src/types/national-priority.ts',
  'src/types/strategic-action.ts',
  'src/engine/validation.ts',
  'src/engine/delayed-effects.ts',
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
    `export const AGENT_01_MODULE_VERSION = '1.0.0';`,
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
    `    passed: listStrategicActions().length >= 3,`,
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
