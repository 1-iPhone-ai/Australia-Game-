#!/usr/bin/env node
/**
 * Bundle agent-23-dashboards into operation-10m/modules/agent-23-dashboards/chunk.tsx
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');
const MODULE_ID = 'agent-23-dashboards';

const SOURCE_FILES = [
  'operation-10m/agent-23-dashboards/types.ts',
  'operation-10m/agent-23-dashboards/core/constants.ts',
  'operation-10m/agent-23-dashboards/core/util.ts',
  'operation-10m/agent-23-dashboards/core/auth-snapshot.ts',
  'operation-10m/agent-23-dashboards/core/heat-matrix.ts',
  'operation-10m/agent-23-dashboards/core/region-map-model.ts',
  'operation-10m/agent-23-dashboards/core/adjacency.ts',
  'operation-10m/agent-23-dashboards/core/analytics.ts',
  'operation-10m/agent-23-dashboards/core/map-links.ts',
  'operation-10m/agent-23-dashboards/core/bottleneck-rollup.ts',
  'operation-10m/agent-23-dashboards/core/condition-catalog.ts',
  'operation-10m/agent-23-dashboards/core/momentum-divergence.ts',
  'operation-10m/agent-23-dashboards/core/map-focus.ts',
  'operation-10m/agent-23-dashboards/core/trend-delta.ts',
  'operation-10m/agent-23-dashboards/core/constraint-profile.ts',
  'operation-10m/agent-23-dashboards/core/resilience-spread.ts',
  'operation-10m/agent-23-dashboards/core/dependency-profile.ts',
  'operation-10m/agent-23-dashboards/core/heat-summary.ts',
  'operation-10m/agent-23-dashboards/core/parity-gap.ts',
  'operation-10m/agent-23-dashboards/core/corridor-stress.ts',
  'operation-10m/agent-23-dashboards/core/network-coupling.ts',
  'operation-10m/agent-23-dashboards/core/dependency-chokepoint.ts',
  'operation-10m/agent-23-dashboards/core/needs-imbalance.ts',
  'operation-10m/agent-23-dashboards/core/map-pulse.ts',
  'operation-10m/agent-23-dashboards/core/risk-exposure.ts',
  'operation-10m/agent-23-dashboards/core/utilization-skew.ts',
  'operation-10m/agent-23-dashboards/core/momentum-resilience-tension.ts',
  'operation-10m/agent-23-dashboards/core/map-hub-index.ts',
  'operation-10m/agent-23-dashboards/core/link-stress.ts',
  'operation-10m/agent-23-dashboards/core/capacity-headroom.ts',
  'operation-10m/agent-23-dashboards/core/strain-diversity.ts',
  'operation-10m/agent-23-dashboards/core/owner-stress-gap.ts',
  'operation-10m/agent-23-dashboards/core/peripheral-isolation.ts',
  'operation-10m/agent-23-dashboards/core/trend-coherence.ts',
  'operation-10m/agent-23-dashboards/core/border-stress.ts',
  'operation-10m/agent-23-dashboards/tests/fixtures.ts',
  'operation-10m/agent-23-dashboards/ui/charts.tsx',
  'operation-10m/agent-23-dashboards/ui/compare-insights.tsx',
  'operation-10m/agent-23-dashboards/ui/map-legend.tsx',
  'operation-10m/agent-23-dashboards/ui/network-depth-panel.tsx',
  'operation-10m/agent-23-dashboards/ui/regions-depth-strip.tsx',
  'operation-10m/agent-23-dashboards/ui/corridor-stress-strip.tsx',
  'operation-10m/agent-23-dashboards/ui/needs-imbalance-card.tsx',
  'operation-10m/agent-23-dashboards/ui/risk-exposure-card.tsx',
  'operation-10m/agent-23-dashboards/ui/utilization-skew-strip.tsx',
  'operation-10m/agent-23-dashboards/ui/map-hub-strip.tsx',
  'operation-10m/agent-23-dashboards/ui/capacity-headroom-strip.tsx',
  'operation-10m/agent-23-dashboards/ui/owner-stress-gap-card.tsx',
  'operation-10m/agent-23-dashboards/ui/peripheral-isolation-strip.tsx',
  'operation-10m/agent-23-dashboards/ui/border-stress-strip.tsx',
  'operation-10m/agent-23-dashboards/ui/region-position-map.tsx',
  'operation-10m/agent-23-dashboards/ui/dashboard-modal.tsx',
  'operation-10m/agent-23-dashboards/tests/agent23-self-tests.ts',
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

const ASSEMBLY_META = `
export const OP10M_AGENT23_MODULE_META = {
  moduleId: '${MODULE_ID}',
  schemaVersion: 'op10m-agent23-v1',
  integrationDoc: 'operation-10m/agent-23-dashboards/merge/INTEGRATION.md',
  slot: 'post-living-regions-national-systems',
  readOnly: true,
} as const;
`.trim();

const bundled = SOURCE_FILES.map(rel => {
  const abs = resolve(repoRoot, rel);
  const label = rel.replace('operation-10m/agent-23-dashboards/', '');
  return `// --- bundled from ${label} ---\n${stripModuleImports(readFileSync(abs, 'utf8'))}`;
}).join('\n\n');

const header = `// OP10M_MODULE_BEGIN ${MODULE_ID}
// Operation 10M — Agent 23 dashboards / maps / data viz (bundled for Agent 25 assembly).
// Source tree: operation-10m/agent-23-dashboards/ — regenerate via npm run bundle:agent-23-chunk
`;

const footer = `
${ASSEMBLY_META}
// OP10M_MODULE_END ${MODULE_ID}
`;

const chunk = `${header}${bundled}\n\n${footer}\n`;
const outDir = resolve(repoRoot, 'operation-10m/modules/agent-23-dashboards');
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
  slot: 'post-living-regions-national-systems',
  touchesSaveFormat: false,
  readOnly: true,
  contentSha256: hash,
  chunkPath: 'operation-10m/modules/agent-23-dashboards/chunk.tsx',
};

writeFileSync(resolve(outDir, 'module.manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${outPath} (${chunk.split('\n').length} lines, sha256=${hash})`);
