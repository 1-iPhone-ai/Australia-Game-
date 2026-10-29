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
  push('agent03_chunk_02', RESEARCH_BRANCH_NODES.length === 24, String(RESEARCH_BRANCH_NODES.length));
  push('agent03_chunk_03', STRATEGY_HOOKS.length === 24, String(STRATEGY_HOOKS.length));

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

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

export const OP10M_AGENT03_MODULE_META = {
  moduleId: '${MODULE_ID}',
  schemaVersion: 'op10m-agent03-v1',
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
  chunkPath: "operation-10m/modules/agent-03-research-tech/chunk.tsx",
};

writeFileSync(resolve(outDir, "module.manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${outPath} (${chunk.split("\n").length} lines, sha256=${hash})`);
