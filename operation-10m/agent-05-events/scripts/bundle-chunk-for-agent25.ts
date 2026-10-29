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
  'src/cross-system-orchestrator.ts',
  'src/national-escalation-orchestrator.ts',
  'src/deferred-queue.ts',
  'src/compute-turn-orchestrator.ts',
  'src/compute-turn-reconcile.ts',
  'src/compute-turn-drift-settle.ts',
  'src/pending-response-orchestrator.ts',
  'src/pending-response-expiry-coordinator.ts',
  'src/pending-response-stabilization-coordinator.ts',
  'src/compute-turn-hooks.ts',
  'src/trigger-engine.ts',
  'src/regional-hook-engine.ts',
  'src/narrative-runtime.ts',
  'generated/chain-catalog.ts',
  'generated/chain-catalog-tranche2.ts',
  'generated/chain-catalog-tranche3.ts',
  'generated/chain-catalog-tranche4.ts',
  'generated/chain-catalog-tranche5.ts',
  'generated/chain-catalog-tranche6.ts',
  'generated/chain-catalog-tranche7.ts',
  'generated/chain-catalog-tranche8.ts',
  'generated/chain-catalog-tranche9.ts',
  'src/chain-catalog-aggregate.ts',
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
    `    name: '3080 chain descriptors (600+240+360+320+280+320+320+320+320)',`,
    `    passed: OP10M_AGENT05_CHAIN_CATALOG.length === 3080,`,
    `  });`,
    `  results.push({`,
    `    id: 'agent05_tranche4_lattice',`,
    `    name: 'tranche4 national lattice chains present',`,
    `    passed:`,
    `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE4.length === 320 &&`,
    `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t4_')),`,
    `  });`,
    `  results.push({`,
    `    id: 'agent05_tranche3_cross_system',`,
    `    name: 'tranche3 synergy chains present',`,
    `    passed:`,
    `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE3.length === 360 &&`,
    `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t3_')),`,
    `  });`,
    `  results.push({`,
    `    id: 'agent05_tranche9_stabilization_lattice',`,
    `    name: 'tranche9 stabilization-lattice chains present',`,
    `    passed:`,
    `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE9.length === 320 &&`,
    `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t9_')),`,
    `  });`,
    `  results.push({`,
    `    id: 'agent05_tranche8_pending_lattice',`,
    `    name: 'tranche8 pending-lattice chains present',`,
    `    passed:`,
    `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE8.length === 320 &&`,
    `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t8_')),`,
    `  });`,
    `  results.push({`,
    `    id: 'agent05_tranche7_drift_settle',`,
    `    name: 'tranche7 drift-settle chains present',`,
    `    passed:`,
    `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE7.length === 320 &&`,
    `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t7_')),`,
    `  });`,
    `  results.push({`,
    `    id: 'agent05_tranche6_reconcile',`,
    `    name: 'tranche6 compute-reconcile chains present',`,
    `    passed:`,
    `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE6.length === 320 &&`,
    `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t6_')),`,
    `  });`,
    `  results.push({`,
    `    id: 'agent05_tranche5_compute_turn',`,
    `    name: 'tranche5 compute-turn chains present',`,
    `    passed:`,
    `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE5.length === 280 &&`,
    `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t5_')),`,
    `  });`,
    `  const hookSim = createDefaultOp10mSimulationSlice({ day: 40, sectorActivity: { mining: 30 } });`,
    `  const hookResult = executeOp10mNarrativeComputeTurnHook({`,
    `    turn: 5,`,
    `    day: 40,`,
    `    simulation: hookSim,`,
    `    narrative: createDefaultOp10mNarrativeEngineState(),`,
    `    catalog: OP10M_AGENT05_CHAIN_CATALOG.slice(0, 8),`,
    `  });`,
    `  results.push({`,
    `    id: 'agent05_compute_turn_hook',`,
    `    name: 'compute turn hook runs four stages',`,
    `    passed:`,
    `      hookResult.ok &&`,
    `      hookResult.stagesRun.length === 4 &&`,
    `      hookResult.narrative.telemetry.computeTurnPasses >= 1,`,
    `  });`,
    `  let pendingAsm = createDefaultOp10mNarrativeEngineState();`,
    `  for (let i = 0; i < 4; i++) {`,
    `    pendingAsm.pendingResponses.push({`,
    `      id: 'asm_pr_' + i,`,
    `      chainId: 'c' + i,`,
    `      stagePhase: 'pressure',`,
    `      regionId: 'NSW',`,
    `      choiceIds: ['commit'],`,
    `      openedDay: 10,`,
    `      expiresDay: 20,`,
    `      snapshot: { day: 10, money: 1000, nationalStability: 70, activeCrisisCount: 1 },`,
    `    });`,
    `  }`,
    `  const pendingAsmPass = evaluatePendingResponseOrchestration(`,
    `    createDefaultOp10mSimulationSlice({ day: 12 }),`,
    `    pendingAsm,`,
    `    12,`,
    `  );`,
    `  results.push({`,
    `    id: 'agent05_pending_orchestrator',`,
    `    name: 'pending backlog orchestration sets flags',`,
    `    passed: !!pendingAsmPass.simulation.flags.op10m_pending_response_backlog,`,
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
const contentSha256 = createHash('sha256').update(body).digest('hex');
const manifestPath = resolve(moduleRoot, 'module.manifest.json');
const manifest = {
  moduleId,
  slot: 'post-crisis-chains',
  touchesSaveFormat: true,
  proposedGameStateField: 'agent05NarrativeState',
  contentSha256,
  contentSha256Prefix: contentSha256.slice(0, 16),
  chunkPath: `operation-10m/${moduleId}/chunk.tsx`,
  chunkLineCount: lineCount,
  chainCount: 3080,
  regenerate: 'npm run bundle:agent05',
};
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath} (${lineCount} lines, sha256~${contentSha256.slice(0, 16)})`);
console.log(`Wrote ${manifestPath}`);
