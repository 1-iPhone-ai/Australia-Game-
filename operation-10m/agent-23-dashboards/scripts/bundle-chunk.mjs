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
  'operation-10m/agent-23-dashboards/core/bottleneck-concentration.ts',
  'operation-10m/agent-23-dashboards/core/dependency-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/owned-momentum-skew.ts',
  'operation-10m/agent-23-dashboards/core/util-alignment-drift.ts',
  'operation-10m/agent-23-dashboards/core/trend-acceleration.ts',
  'operation-10m/agent-23-dashboards/core/hub-corridor-load.ts',
  'operation-10m/agent-23-dashboards/core/open-needs-concentration.ts',
  'operation-10m/agent-23-dashboards/core/critical-cell-density.ts',
  'operation-10m/agent-23-dashboards/core/economy-momentum-drift.ts',
  'operation-10m/agent-23-dashboards/core/momentum-history-volatility.ts',
  'operation-10m/agent-23-dashboards/core/dependency-inbound-concentration.ts',
  'operation-10m/agent-23-dashboards/core/peripheral-corridor-gap.ts',
  'operation-10m/agent-23-dashboards/core/risk-exposure-concentration.ts',
  'operation-10m/agent-23-dashboards/core/high-risk-region-density.ts',
  'operation-10m/agent-23-dashboards/core/dependency-outbound-concentration.ts',
  'operation-10m/agent-23-dashboards/core/national-network-util-spread.ts',
  'operation-10m/agent-23-dashboards/core/resilience-utilization-gap.ts',
  'operation-10m/agent-23-dashboards/core/link-stress-dispersion.ts',
  'operation-10m/agent-23-dashboards/core/momentum-delta-spread.ts',
  'operation-10m/agent-23-dashboards/core/constraint-concentration.ts',
  'operation-10m/agent-23-dashboards/core/bottleneck-network-span.ts',
  'operation-10m/agent-23-dashboards/core/dependency-importance-spread.ts',
  'operation-10m/agent-23-dashboards/core/map-pulse-concentration.ts',
  'operation-10m/agent-23-dashboards/core/economy-resilience-drift.ts',
  'operation-10m/agent-23-dashboards/core/owned-risk-exposure-share.ts',
  'operation-10m/agent-23-dashboards/core/corridor-stress-concentration.ts',
  'operation-10m/agent-23-dashboards/core/development-tier-diversity.ts',
  'operation-10m/agent-23-dashboards/core/regional-headroom-spread.ts',
  'operation-10m/agent-23-dashboards/core/national-needs-pressure.ts',
  'operation-10m/agent-23-dashboards/core/dependency-consumer-load.ts',
  'operation-10m/agent-23-dashboards/core/activity-weight-spread.ts',
  'operation-10m/agent-23-dashboards/core/parity-gap-spread.ts',
  'operation-10m/agent-23-dashboards/core/heat-strained-density.ts',
  'operation-10m/agent-23-dashboards/core/network-util-concentration.ts',
  'operation-10m/agent-23-dashboards/core/dependency-provider-load.ts',
  'operation-10m/agent-23-dashboards/core/owned-resilience-share.ts',
  'operation-10m/agent-23-dashboards/core/momentum-band-diversity.ts',
  'operation-10m/agent-23-dashboards/core/economy-band-diversity.ts',
  'operation-10m/agent-23-dashboards/core/map-hub-concentration.ts',
  'operation-10m/agent-23-dashboards/core/chokepoint-score-spread.ts',
  'operation-10m/agent-23-dashboards/core/owned-open-needs-share.ts',
  'operation-10m/agent-23-dashboards/core/national-strained-bar-count.ts',
  'operation-10m/agent-23-dashboards/core/history-snippet-load.ts',
  'operation-10m/agent-23-dashboards/core/network-stress-concentration.ts',
  'operation-10m/agent-23-dashboards/core/network-coupling-spread.ts',
  'operation-10m/agent-23-dashboards/core/resilience-band-diversity.ts',
  'operation-10m/agent-23-dashboards/core/bottleneck-severity-load.ts',
  'operation-10m/agent-23-dashboards/core/rival-risk-exposure-share.ts',
  'operation-10m/agent-23-dashboards/core/heat-row-strain-concentration.ts',
  'operation-10m/agent-23-dashboards/core/high-risk-concentration.ts',
  'operation-10m/agent-23-dashboards/core/dependency-network-span.ts',
  'operation-10m/agent-23-dashboards/core/national-bottleneck-density.ts',
  'operation-10m/agent-23-dashboards/core/neutral-risk-exposure-share.ts',
  'operation-10m/agent-23-dashboards/core/util-headroom-divergence.ts',
  'operation-10m/agent-23-dashboards/core/border-stress-concentration.ts',
  'operation-10m/agent-23-dashboards/core/constraint-profile-spread.ts',
  'operation-10m/agent-23-dashboards/core/bottleneck-network-share.ts',
  'operation-10m/agent-23-dashboards/core/dependency-critical-share.ts',
  'operation-10m/agent-23-dashboards/core/momentum-leader-gap.ts',
  'operation-10m/agent-23-dashboards/core/derived-event-load.ts',
  'operation-10m/agent-23-dashboards/core/owner-concentration-index.ts',
  'operation-10m/agent-23-dashboards/core/open-needs-spread.ts',
  'operation-10m/agent-23-dashboards/core/critical-needs-share.ts',
  'operation-10m/agent-23-dashboards/core/national-resilience-gap.ts',
  'operation-10m/agent-23-dashboards/core/dependency-high-share.ts',
  'operation-10m/agent-23-dashboards/core/bottleneck-region-span.ts',
  'operation-10m/agent-23-dashboards/core/momentum-history-span.ts',
  'operation-10m/agent-23-dashboards/core/high-risk-spread.ts',
  'operation-10m/agent-23-dashboards/core/high-needs-share.ts',
  'operation-10m/agent-23-dashboards/core/national-utilization-gap.ts',
  'operation-10m/agent-23-dashboards/core/dependency-moderate-share.ts',
  'operation-10m/agent-23-dashboards/core/bottleneck-severity-span.ts',
  'operation-10m/agent-23-dashboards/core/development-tier-span.ts',
  'operation-10m/agent-23-dashboards/core/low-needs-share.ts',
  'operation-10m/agent-23-dashboards/core/critical-risk-share.ts',
  'operation-10m/agent-23-dashboards/core/national-condition-gap.ts',
  'operation-10m/agent-23-dashboards/core/dependency-low-share.ts',
  'operation-10m/agent-23-dashboards/core/bottleneck-network-severity-load-spread.ts',
  'operation-10m/agent-23-dashboards/core/momentum-band-span.ts',
  'operation-10m/agent-23-dashboards/core/economy-band-span.ts',
  'operation-10m/agent-23-dashboards/core/resilience-band-span.ts',
  'operation-10m/agent-23-dashboards/core/moderate-risk-share.ts',
  'operation-10m/agent-23-dashboards/core/national-bottleneck-gap.ts',
  'operation-10m/agent-23-dashboards/core/dependency-consumer-span.ts',
  'operation-10m/agent-23-dashboards/core/map-pulse-span.ts',
  'operation-10m/agent-23-dashboards/core/low-risk-share.ts',
  'operation-10m/agent-23-dashboards/core/national-dependency-gap.ts',
  'operation-10m/agent-23-dashboards/core/dependency-provider-span.ts',
  'operation-10m/agent-23-dashboards/core/economy-resilience-span.ts',
  'operation-10m/agent-23-dashboards/core/corridor-pulse-spread.ts',
  'operation-10m/agent-23-dashboards/core/history-turn-span.ts',
  'operation-10m/agent-23-dashboards/core/moderate-needs-spread.ts',
  'operation-10m/agent-23-dashboards/core/national-history-gap.ts',
  'operation-10m/agent-23-dashboards/core/link-pulse-span.ts',
  'operation-10m/agent-23-dashboards/core/owner-portfolio-span.ts',
  'operation-10m/agent-23-dashboards/core/constraint-band-span.ts',
  'operation-10m/agent-23-dashboards/core/derived-event-turn-span.ts',
  'operation-10m/agent-23-dashboards/core/critical-needs-spread.ts',
  'operation-10m/agent-23-dashboards/core/national-snippet-gap.ts',
  'operation-10m/agent-23-dashboards/core/hub-pulse-span.ts',
  'operation-10m/agent-23-dashboards/core/rival-portfolio-span.ts',
  'operation-10m/agent-23-dashboards/core/network-condition-span.ts',
  'operation-10m/agent-23-dashboards/core/ns-history-turn-span.ts',
  'operation-10m/agent-23-dashboards/core/lr-history-turn-span.ts',
  'operation-10m/agent-23-dashboards/core/open-needs-tier-spread.ts',
  'operation-10m/agent-23-dashboards/core/snippet-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/pulse-asymmetry-gap.ts',
  'operation-10m/agent-23-dashboards/core/regional-owner-skew.ts',
  'operation-10m/agent-23-dashboards/core/combined-derived-history-gap.ts',
  'operation-10m/agent-23-dashboards/core/meaningful-derived-turn-span.ts',
  'operation-10m/agent-23-dashboards/core/national-snippet-saturation-gap.ts',
  'operation-10m/agent-23-dashboards/core/corridor-pulse-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/neutral-owner-portfolio-skew.ts',
  'operation-10m/agent-23-dashboards/core/multi-tier-needs-concentration.ts',
  'operation-10m/agent-23-dashboards/core/lr-ns-history-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/unknown-owner-portfolio-skew.ts',
  'operation-10m/agent-23-dashboards/core/high-tier-needs-concentration.ts',
  'operation-10m/agent-23-dashboards/core/link-pulse-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/ns-only-snippet-headroom.ts',
  'operation-10m/agent-23-dashboards/core/derived-major-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/corridor-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/rival-owner-portfolio-skew.ts',
  'operation-10m/agent-23-dashboards/core/critical-tier-needs-concentration.ts',
  'operation-10m/agent-23-dashboards/core/hub-pulse-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/lr-only-snippet-headroom.ts',
  'operation-10m/agent-23-dashboards/core/meaningful-derived-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/link-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/you-owner-momentum-gap.ts',
  'operation-10m/agent-23-dashboards/core/moderate-tier-needs-concentration.ts',
  'operation-10m/agent-23-dashboards/core/map-pulse-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/merged-snippet-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/dependency-pulse-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/border-corridor-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/rival-owner-momentum-gap.ts',
  'operation-10m/agent-23-dashboards/core/low-tier-needs-concentration.ts',
  'operation-10m/agent-23-dashboards/core/adjacency-pulse-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/snippet-turn-span.ts',
  'operation-10m/agent-23-dashboards/core/hub-corridor-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/national-derived-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/neutral-owner-momentum-gap.ts',
  'operation-10m/agent-23-dashboards/core/open-needs-severity-span.ts',
  'operation-10m/agent-23-dashboards/core/peripheral-pulse-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/history-snippet-turn-gap.ts',
  'operation-10m/agent-23-dashboards/core/dependency-corridor-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/lr-major-snippet-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/unknown-owner-momentum-gap.ts',
  'operation-10m/agent-23-dashboards/core/regional-needs-severity-concentration.ts',
  'operation-10m/agent-23-dashboards/core/hub-peripheral-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/snippet-source-turn-gap.ts',
  'operation-10m/agent-23-dashboards/core/adjacency-corridor-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/ns-history-snippet-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/owned-open-needs-momentum-skew-gap.ts',
  'operation-10m/agent-23-dashboards/core/national-severity-tier-spread.ts',
  'operation-10m/agent-23-dashboards/core/chokepoint-pulse-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/lr-derived-snippet-turn-gap.ts',
  'operation-10m/agent-23-dashboards/core/merged-corridor-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/major-history-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/rival-open-needs-skew-gap.ts',
  'operation-10m/agent-23-dashboards/core/peak-severity-concentration.ts',
  'operation-10m/agent-23-dashboards/core/border-pulse-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/ns-snippet-source-gap.ts',
  'operation-10m/agent-23-dashboards/core/hub-link-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/meaningful-history-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/you-open-needs-skew-gap.ts',
  'operation-10m/agent-23-dashboards/core/national-peak-tier-spread.ts',
  'operation-10m/agent-23-dashboards/core/chokepoint-corridor-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/lr-derived-snippet-source-gap.ts',
  'operation-10m/agent-23-dashboards/core/peripheral-link-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/ns-major-history-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/neutral-open-needs-skew-gap.ts',
  'operation-10m/agent-23-dashboards/core/national-open-needs-peak-spread.ts',
  'operation-10m/agent-23-dashboards/core/dependency-link-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/ns-derived-snippet-source-gap.ts',
  'operation-10m/agent-23-dashboards/core/rim-corridor-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/critical-history-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/unknown-open-needs-skew-gap.ts',
  'operation-10m/agent-23-dashboards/core/regional-peak-severity-spread.ts',
  'operation-10m/agent-23-dashboards/core/adjacency-link-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/combined-snippet-source-gap.ts',
  'operation-10m/agent-23-dashboards/core/hub-rim-pulse-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/major-derived-history-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/rival-open-needs-peak-spread.ts',
  'operation-10m/agent-23-dashboards/core/national-severity-peak-concentration.ts',
  'operation-10m/agent-23-dashboards/core/border-link-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/lr-major-snippet-source-gap.ts',
  'operation-10m/agent-23-dashboards/core/merged-rim-pulse-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/meaningful-derived-history-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/you-open-needs-peak-spread.ts',
  'operation-10m/agent-23-dashboards/core/regional-severity-peak-concentration.ts',
  'operation-10m/agent-23-dashboards/core/chokepoint-link-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/ns-major-snippet-source-gap.ts',
  'operation-10m/agent-23-dashboards/core/hub-border-pulse-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/critical-derived-history-overlap-gap.ts',
  'operation-10m/agent-23-dashboards/core/neutral-open-needs-peak-spread.ts',
  'operation-10m/agent-23-dashboards/core/national-open-needs-severity-concentration.ts',
  'operation-10m/agent-23-dashboards/core/merged-border-link-saturation-share.ts',
  'operation-10m/agent-23-dashboards/core/combined-major-snippet-source-gap.ts',
  'operation-10m/agent-23-dashboards/core/peripheral-border-pulse-asymmetry.ts',
  'operation-10m/agent-23-dashboards/core/major-meaningful-history-overlap-gap.ts',
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
  'operation-10m/agent-23-dashboards/ui/owned-momentum-skew-card.tsx',
  'operation-10m/agent-23-dashboards/ui/dependency-asymmetry-strip.tsx',
  'operation-10m/agent-23-dashboards/ui/util-alignment-strip.tsx',
  'operation-10m/agent-23-dashboards/ui/open-needs-concentration-card.tsx',
  'operation-10m/agent-23-dashboards/ui/risk-exposure-concentration-card.tsx',
  'operation-10m/agent-23-dashboards/ui/economy-momentum-drift-strip.tsx',
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
