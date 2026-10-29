/**
 * Bundles Agent 05 `src/` + generated catalogs into assembly-ready `chunk.tsx` with OP10M markers.
 * Output has no local imports (Agent 25 inline assembly).
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleRoot = resolve(__dirname, '..');
const moduleId = 'agent-05-events';

/** Stable concat order: dependencies before dependents. */
const SOURCE_FILES = [
  'src/types.ts',
  'src/regional-graph.ts',
  'src/consequence-applier.ts',
  'src/deep-chain-orchestrator.ts',
  'src/trigger-engine.ts',
  'src/regional-hook-engine.ts',
  'src/narrative-runtime.ts',
  'generated/chain-catalog.ts',
  'generated/regional-hook-catalog.ts',
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
    `// Operation 10M — Agent 05 Dynamic Events & Narrative`,
    `// Bundled for Agent 25 assembly (no external imports).`,
    `// Source: operation-10m/${moduleId}/`,
  ];

  for (const rel of SOURCE_FILES) {
    const abs = resolve(moduleRoot, rel);
    const raw = readFileSync(abs, 'utf8');
    parts.push(`// --- ${rel} ---`, stripModuleImports(raw));
  }

  parts.push(
    `export const OP10M_AGENT05_ASSEMBLY_MODULE_ID = 'operation-10m/${moduleId}';`,
    '',
    `export function runOp10mAgent05EventsAssemblySelfTests(): {`,
    `  passed: number;`,
    `  failed: number;`,
    `  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;`,
    `} {`,
    `  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];`,
    `  const catalogReport = runOp10mNarrativeSelfTests(OP10M_AGENT05_CHAIN_CATALOG);`,
    `  results.push({`,
    `    id: 'agent05_catalog_integrity',`,
    `    name: 'chain catalog self-test harness',`,
    `    passed: catalogReport.failures.length === 0,`,
    `    detail: catalogReport.failures.join('; ') || undefined,`,
    `  });`,
    `  results.push({`,
    `    id: 'agent05_chain_count',`,
    `    name: '600 chain descriptors',`,
    `    passed: OP10M_AGENT05_CHAIN_CATALOG.length === 600,`,
    `  });`,
    `  results.push({`,
    `    id: 'agent05_regional_hooks',`,
    `    name: '120 regional narrative hooks',`,
    `    passed:`,
    `      OP10M_AGENT05_REGIONAL_HOOK_CATALOG.length === 120 &&`,
    `      OP10M_AGENT05_REGIONAL_HOOK_STATS.hookCount === 120,`,
    `  });`,
    `  const sim = createDefaultOp10mSimulationSlice({ day: 25, season: 'Winter', sectorActivity: { mining: 40 } });`,
    `  let narrative = createDefaultOp10mNarrativeEngineState();`,
    `  const chain = OP10M_AGENT05_CHAIN_CATALOG[0];`,
    `  narrative.activeChains[chain.chainId] = {`,
    `    chainId: chain.chainId,`,
    `    phase: 'rupture',`,
    `    startedDay: 20,`,
    `    lastAdvancedDay: 24,`,
    `    stageCooldownUntilDay: 0,`,
    `  };`,
    `  const hook = OP10M_AGENT05_REGIONAL_HOOK_CATALOG.find(`,
    `    (h) => h.sourceRegion === chain.region && h.theme === chain.theme,`,
    `  );`,
    `  const regionalOk = !!hook &&`,
    `    evaluateRegionalNarrativeHooks(sim, narrative, OP10M_AGENT05_CHAIN_CATALOG, [hook!]).log.length > 0;`,
    `  results.push({`,
    `    id: 'agent05_regional_tick',`,
    `    name: 'regional hook fires at rupture',`,
    `    passed: regionalOk,`,
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
const lineCount = chunk.split('\n').length;
const hash = createHash('sha256').update(body).digest('hex').slice(0, 16);
console.log(`Wrote ${outPath} (${lineCount} lines, sha256~${hash})`);
