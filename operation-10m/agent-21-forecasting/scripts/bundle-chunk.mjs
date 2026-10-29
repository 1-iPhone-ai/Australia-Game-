#!/usr/bin/env node
/**
 * Bundle agent-21-forecasting sources into operation-10m/modules/agent-21-forecasting/chunk.tsx
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');
const MODULE_ID = 'agent-21-forecasting';

const SOURCE_FILES = [
  'operation-10m/agent-21-forecasting/isolation-core.ts',
  'operation-10m/agent-21-forecasting/counterfactual-experiments.ts',
  'operation-10m/agent-21-forecasting/forecast-evaluation-metrics.ts',
  'operation-10m/agent-21-forecasting/scenario-catalog.ts',
  'operation-10m/agent-21-forecasting/strategic-forecast-policy-lab.tsx',
  'operation-10m/agent-21-forecasting/forecast-lab-depth.ts',
  'operation-10m/agent-21-forecasting/forecast-policy-sensitivity.ts',
  'operation-10m/agent-21-forecasting/forecast-domain-matrix.ts',
  'operation-10m/agent-21-forecasting/forecast-audit-ledger.ts',
  'operation-10m/agent-21-forecasting/scenario-comparison-ui.tsx',
  'operation-10m/agent-21-forecasting/forecast-depth-panel.tsx',
  'operation-10m/agent-21-forecasting/forecast-round2-console.tsx'
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
/** Agent 25 — modular self-tests (subset of npm run test:ag21). */
export function runAgent21ForecastingChunkSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; passed: boolean; detail?: string }> = [];
  for (const row of runAg21CounterfactualSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ForecastEvaluationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ForecastLabDepthSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21PolicySensitivitySelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21DomainStressMatrixSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ForecastAuditSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  results.push({
    id: 'agent21_chunk_catalog',
    passed: AG21_FORECAST_SCENARIO_CATALOG.length >= 100,
    detail: String(AG21_FORECAST_SCENARIO_CATALOG.length)
  });
  const passed = results.filter(r => r.passed).length;
  return { passed, failed: results.length - passed, results };
}
`;

const bundled = SOURCE_FILES.map(rel => {
  const abs = resolve(repoRoot, rel);
  const label = rel.replace('operation-10m/agent-21-forecasting/', '');
  return `// --- bundled from ${label} ---\n${stripModuleImports(readFileSync(abs, 'utf8'))}`;
}).join('\n\n');

const header = `// OP10M_MODULE_BEGIN ${MODULE_ID}
// Operation 10M — Agent 21 forecasting / policy laboratory (bundled for Agent 25 assembly).
// O10M_AGENT21_INTEGRATION_ANCHOR — replaces inline SECTION 20AQ on merge.
// Regenerate: npm run bundle:agent-21-chunk
`;

const footer = `
${ASSEMBLY_SELF_TESTS}
// OP10M_MODULE_END ${MODULE_ID}
`;

const chunk = header + bundled + '\n\n' + footer;
const outDir = resolve(repoRoot, 'operation-10m/modules/agent-21-forecasting');
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
  slot: 'O10M_AGENT21_INTEGRATION_ANCHOR',
  touchesSaveFormat: false,
  authoritative: false,
  contentSha256: hash,
  chunkPath: 'operation-10m/modules/agent-21-forecasting/chunk.tsx',
  sourceRoot: 'operation-10m/agent-21-forecasting',
  regenerate: 'npm run bundle:agent-21-chunk'
};

writeFileSync(resolve(outDir, 'module.manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${outPath} (${chunk.split('\n').length} lines, sha256=${hash})`);
