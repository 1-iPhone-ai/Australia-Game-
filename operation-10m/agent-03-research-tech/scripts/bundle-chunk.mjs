#!/usr/bin/env node
/**
 * Bundle agent-03-research-tech src/ into operation-10m/modules/agent-03-research-tech/chunk.tsx
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");
const MODULE_ID = "agent-03-research-tech";

const SOURCE_FILES = [
  "operation-10m/agent-03-research-tech/src/internal-constants.ts",
  "operation-10m/agent-03-research-tech/src/v94-ids.ts",
  "operation-10m/agent-03-research-tech/src/types.ts",
  "operation-10m/agent-03-research-tech/src/branches.ts",
  "operation-10m/agent-03-research-tech/src/institutions.ts",
  "operation-10m/agent-03-research-tech/src/prerequisites.ts",
  "operation-10m/agent-03-research-tech/src/institution-upgrades.ts",
  "operation-10m/agent-03-research-tech/src/late-game-diffusion.ts",
  "operation-10m/agent-03-research-tech/src/diffusion.ts",
  "operation-10m/agent-03-research-tech/src/strategy-hooks.ts",
  "operation-10m/agent-03-research-tech/src/scale-wave.ts",
  "operation-10m/agent-03-research-tech/src/commercialization-bridge.ts",
  "operation-10m/agent-03-research-tech/src/unlock-event-log.ts",
  "operation-10m/agent-03-research-tech/src/portfolio-advisor.ts",
  "operation-10m/agent-03-research-tech/src/diffusion-forecast.ts",
  "operation-10m/agent-03-research-tech/src/emphasis-change-log.ts",
  "operation-10m/agent-03-research-tech/src/institution-tier-snapshot.ts",
  "operation-10m/agent-03-research-tech/src/synergy-outlook.ts",
  "operation-10m/agent-03-research-tech/src/readiness-milestone-log.ts",
  "operation-10m/agent-03-research-tech/src/readiness-branch-snapshot.ts",
  "operation-10m/agent-03-research-tech/src/integration-risk-outlook.ts",
  "operation-10m/agent-03-research-tech/src/integration-risk-log.ts",
  "operation-10m/agent-03-research-tech/src/integration-risk-snapshot.ts",
  "operation-10m/agent-03-research-tech/src/scale-wave-snapshot.ts",
  "operation-10m/agent-03-research-tech/src/adoption-horizon-outlook.ts",
  "operation-10m/agent-03-research-tech/src/synergy-threshold-log.ts",
  "operation-10m/agent-03-research-tech/src/synergy-snapshot.ts",
  "operation-10m/agent-03-research-tech/src/portfolio-stabilization-outlook.ts",
  "operation-10m/agent-03-research-tech/src/commercialization-milestone-log.ts",
  "operation-10m/agent-03-research-tech/src/commercialization-snapshot.ts",
  "operation-10m/agent-03-research-tech/src/export-continuity-outlook.ts",
  "operation-10m/agent-03-research-tech/src/diffusion-integration-log.ts",
  "operation-10m/agent-03-research-tech/src/diffusion-integration-snapshot.ts",
  "operation-10m/agent-03-research-tech/src/national-coherence-outlook.ts",
  "operation-10m/agent-03-research-tech/src/portfolio-balance-log.ts",
  "operation-10m/agent-03-research-tech/src/portfolio-balance-snapshot.ts",
  "operation-10m/agent-03-research-tech/src/strategic-alignment-outlook.ts",
  "operation-10m/agent-03-research-tech/src/diffusion-forecast-band-log.ts",
  "operation-10m/agent-03-research-tech/src/diffusion-forecast-snapshot.ts",
  "operation-10m/agent-03-research-tech/src/horizon-convergence-outlook.ts",
  "operation-10m/agent-03-research-tech/src/horizon-convergence-band-log.ts",
  "operation-10m/agent-03-research-tech/src/horizon-convergence-snapshot.ts",
  "operation-10m/agent-03-research-tech/src/research-execution-outlook.ts",
  "operation-10m/agent-03-research-tech/src/save-migration.ts",
  "operation-10m/agent-03-research-tech/src/save-lifecycle.ts",
  "operation-10m/agent-03-research-tech/src/regression-harness.ts",
  "operation-10m/agent-03-research-tech/src/compute.ts",
];

function stripModuleImports(src) {
  const out = [];
  let skip = false;
  for (const line of src.split("\n")) {
    const st = line.trim();
    if (st.startsWith("export *")) continue;
    if (st.startsWith("import ") || st.startsWith("import type")) {
      skip = !st.includes(" from ") || !st.endsWith(";");
      continue;
    }
    if (skip) {
      if (line.includes(";")) skip = false;
      continue;
    }
    if (/ from ['"]\.\//.test(line)) continue;
    out.push(line);
  }
  return out.join("\n").trim();
}

const ASSEMBLY_SELF_TESTS = `
/** Agent 25 — smoke self-tests (subset of npm run test:agent-03). */
export function runAgent03ResearchTechSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; passed: boolean; detail?: string }> = [];
  const push = (id: string, passed: boolean, detail?: string) => results.push({ id, passed, detail });

  push('agent03_chunk_01', detectPrerequisiteCycle() === null, detectPrerequisiteCycle() ?? undefined);
  push('agent03_chunk_02', RESEARCH_BRANCH_NODES.length === 30, String(RESEARCH_BRANCH_NODES.length));
  push('agent03_chunk_03', STRATEGY_HOOKS.length === 30, String(STRATEGY_HOOKS.length));

  const inputs: ResearchProgressInputs = {
    turn: 10,
    regions: [{ code: 'ACT', sectors: { research: 40, technology: 35 } }],
    capabilities: {},
    projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    completedContracts: [],
    megaprojects: {},
    factionStanding: { csiro_ai_directorate: 45 },
  };
  const state = computeResearchProgress(inputs, createEmptyResearchProgressState());
  push('agent03_chunk_04', state.unlockedNodes.some(u => u.nodeId === 'df_t1_campus_foundation'));
  push('agent03_chunk_05', (state.institutionUpgrades?.length ?? 0) >= 6, String(state.institutionUpgrades?.length));
  push('agent03_chunk_06', OP10M_AGENT03_MODULE_META.schemaVersion === 'op10m-agent03-v14');
  const saved = prepareResearchProgressForSave(state);
  push('agent03_chunk_07', validatePersistedCoreForWrite(saved).length === 0);

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

export function runAgent03ResearchSaveFormatSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; passed: boolean; detail?: string }> = [];
  const push = (id: string, passed: boolean, detail?: string) => results.push({ id, passed, detail });
  const v2 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v2', turn: 1, revision: 0, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [] });
  push('savefmt_v2_to_v13', v2?.schemaVersion === 'op10m-agent03-v14');
  const v3 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v3', turn: 2, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], coreFingerprint: 'x' });
  push('savefmt_v3_to_v13', v3?.schemaVersion === 'op10m-agent03-v14' && (v3?.persistRevision ?? 0) === 0);
  const v4 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v4', turn: 3, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 2, saveKind: 'manual', updatedAtTurn: 3, sessionId: 'x' });
  push('savefmt_v4_to_v13', v4?.schemaVersion === 'op10m-agent03-v14' && Array.isArray(v4?.unlockEventLog));
  const v5 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v5', turn: 4, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 1, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 4, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 4 });
  push('savefmt_v5_to_v13', v5?.schemaVersion === 'op10m-agent03-v14' && Array.isArray(v5?.emphasisChangeLog));
  const v6 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v6', turn: 5, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 5, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 5, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 5, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 } });
  push('savefmt_v6_to_v13', v6?.schemaVersion === 'op10m-agent03-v14' && Array.isArray(v6?.readinessMilestoneLog));
  const v7 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v7', turn: 6, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 6, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 6, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 6, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null });
  push('savefmt_v7_to_v13', v7?.schemaVersion === 'op10m-agent03-v14' && Array.isArray(v7?.integrationRiskLog));
  const v8 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v8', turn: 7, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 7, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 7, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 7, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null, integrationRiskLog: [], integrationRiskSnapshot: null, scaleWaveSnapshot: null });
  push('savefmt_v8_to_v13', v8?.schemaVersion === 'op10m-agent03-v14' && Array.isArray(v8?.synergyThresholdLog));
  const v9 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v9', turn: 8, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 8, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 8, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 8, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null, integrationRiskLog: [], integrationRiskSnapshot: null, scaleWaveSnapshot: null, synergyThresholdLog: [], synergySnapshot: null });
  push('savefmt_v9_to_v13', v9?.schemaVersion === 'op10m-agent03-v14' && Array.isArray(v9?.commercializationMilestoneLog));
  const v10 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v10', turn: 9, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 9, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 9, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 9, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null, integrationRiskLog: [], integrationRiskSnapshot: null, scaleWaveSnapshot: null, synergyThresholdLog: [], synergySnapshot: null, commercializationMilestoneLog: [], commercializationSnapshot: null });
  push('savefmt_v10_to_v13', v10?.schemaVersion === 'op10m-agent03-v14' && Array.isArray(v10?.diffusionIntegrationLog));
  const v11 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v11', turn: 10, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 10, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 10, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 10, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null, integrationRiskLog: [], integrationRiskSnapshot: null, scaleWaveSnapshot: null, synergyThresholdLog: [], synergySnapshot: null, commercializationMilestoneLog: [], commercializationSnapshot: null, diffusionIntegrationLog: [], diffusionIntegrationSnapshot: null });
  push('savefmt_v11_to_v13', v11?.schemaVersion === 'op10m-agent03-v14' && Array.isArray(v11?.portfolioBalanceLog));
  const v12 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v12', turn: 11, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 11, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 11, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 11, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null, integrationRiskLog: [], integrationRiskSnapshot: null, scaleWaveSnapshot: null, synergyThresholdLog: [], synergySnapshot: null, commercializationMilestoneLog: [], commercializationSnapshot: null, diffusionIntegrationLog: [], diffusionIntegrationSnapshot: null, portfolioBalanceLog: [], portfolioBalanceSnapshot: null });
  push('savefmt_v12_to_v13', v12?.schemaVersion === 'op10m-agent03-v14' && Array.isArray(v12?.diffusionForecastBandLog));
  push('savefmt_foreign', detectForeignSaveFields({ diffusion: [] }).includes('diffusion'));
  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

export const OP10M_AGENT03_MODULE_META = {
  moduleId: '${MODULE_ID}',
  schemaVersion: 'op10m-agent03-v14',
  saveFormatVersion: 14,
  touchesSaveFormat: true,
  proposedGameStateField: 'researchProgress',
  integrationDoc: 'operation-10m/agent-03-research-tech/INTEGRATION.md',
  slot: 'post-v10z',
} as const;
`.trim();

const bundled = SOURCE_FILES.map(rel => {
  const abs = resolve(repoRoot, rel);
  return `// --- bundled from ${rel.replace("operation-10m/agent-03-research-tech/", "")} ---\n${stripModuleImports(readFileSync(abs, "utf8"))}`;
}).join("\n\n");

const header = `// OP10M_MODULE_BEGIN ${MODULE_ID}
// Operation 10M — Agent 03 research / technology / progression (bundled for Agent 25 assembly).
// Source tree: operation-10m/agent-03-research-tech/src/ — regenerate via npm run bundle:agent-03-chunk
`;

const footer = `
${ASSEMBLY_SELF_TESTS}
// OP10M_MODULE_END ${MODULE_ID}
`;

const chunk = header + bundled + "\n\n" + footer;
const outDir = resolve(repoRoot, "operation-10m/modules/agent-03-research-tech");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "chunk.tsx");
writeFileSync(outPath, chunk);

const begin = `// OP10M_MODULE_BEGIN ${MODULE_ID}`;
const end = `// OP10M_MODULE_END ${MODULE_ID}`;
const bi = chunk.indexOf(begin);
const ei = chunk.indexOf(end);
const body = chunk.slice(bi + begin.length, ei).trim();
const hash = createHash("sha256").update(body, "utf8").digest("hex");

const manifest = {
  moduleId: MODULE_ID,
  slot: "post-v10z",
  touchesSaveFormat: true,
  proposedGameStateField: "researchProgress",
  contentSha256: hash,
  saveFormatVersion: 14,
  schemaVersion: "op10m-agent03-v14",
  chunkPath: "operation-10m/modules/agent-03-research-tech/chunk.tsx",
};

writeFileSync(resolve(outDir, "module.manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${outPath} (${chunk.split("\n").length} lines, sha256=${hash})`);
