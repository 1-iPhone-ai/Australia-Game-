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
  'operation-10m/agent-21-forecasting/forecast-ensemble-projection.ts',
  'operation-10m/agent-21-forecasting/forecast-calibration-drift.ts',
  'operation-10m/agent-21-forecasting/forecast-trajectory-fusion.ts',
  'operation-10m/agent-21-forecasting/forecast-residual-backtest.ts',
  'operation-10m/agent-21-forecasting/forecast-policy-regret.ts',
  'operation-10m/agent-21-forecasting/forecast-reliability-gates.ts',
  'operation-10m/agent-21-forecasting/forecast-horizon-volatility.ts',
  'operation-10m/agent-21-forecasting/forecast-lever-attribution.ts',
  'operation-10m/agent-21-forecasting/forecast-surfacing-scorecard.ts',
  'operation-10m/agent-21-forecasting/forecast-ensemble-convergence.ts',
  'operation-10m/agent-21-forecasting/forecast-player-brief.ts',
  'operation-10m/agent-21-forecasting/forecast-lab-playbook.ts',
  'operation-10m/agent-21-forecasting/scenario-comparison-ui.tsx',
  'operation-10m/agent-21-forecasting/forecast-depth-panel.tsx',
  'operation-10m/agent-21-forecasting/forecast-round2-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-round3-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-round4-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-round5-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-round6-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-surface-decision.ts',
  'operation-10m/agent-21-forecasting/forecast-lab-telemetry.ts',
  'operation-10m/agent-21-forecasting/forecast-crosslink-packet.ts',
  'operation-10m/agent-21-forecasting/forecast-round7-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-packet-validation.ts',
  'operation-10m/agent-21-forecasting/forecast-operator-escalation.ts',
  'operation-10m/agent-21-forecasting/forecast-lab-replay-seed.ts',
  'operation-10m/agent-21-forecasting/forecast-round8-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-replay-coherence.ts',
  'operation-10m/agent-21-forecasting/forecast-escalation-runbook.ts',
  'operation-10m/agent-21-forecasting/forecast-lab-integration-handoff.ts',
  'operation-10m/agent-21-forecasting/forecast-round9-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-handoff-readiness.ts',
  'operation-10m/agent-21-forecasting/forecast-operator-signoff.ts',
  'operation-10m/agent-21-forecasting/forecast-lab-staging-packet.ts',
  'operation-10m/agent-21-forecasting/forecast-round10-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-staging-verification.ts',
  'operation-10m/agent-21-forecasting/forecast-export-clearance.ts',
  'operation-10m/agent-21-forecasting/forecast-lab-cycle-closeout.ts',
  'operation-10m/agent-21-forecasting/forecast-round11-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-closeout-attestation.ts',
  'operation-10m/agent-21-forecasting/forecast-export-manifest.ts',
  'operation-10m/agent-21-forecasting/forecast-lab-archive-seal.ts',
  'operation-10m/agent-21-forecasting/forecast-round12-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-manifest-confirmation.ts',
  'operation-10m/agent-21-forecasting/forecast-archive-audit-trail.ts',
  'operation-10m/agent-21-forecasting/forecast-lab-retention-policy.ts',
  'operation-10m/agent-21-forecasting/forecast-round13-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-retention-compliance.ts',
  'operation-10m/agent-21-forecasting/forecast-archive-audit-rollup.ts',
  'operation-10m/agent-21-forecasting/forecast-lab-governance-checkpoint.ts',
  'operation-10m/agent-21-forecasting/forecast-round14-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-governance-remediation-plan.ts',
  'operation-10m/agent-21-forecasting/forecast-origin-gate-attestation.ts',
  'operation-10m/agent-21-forecasting/forecast-lab-continuity-verdict.ts',
  'operation-10m/agent-21-forecasting/forecast-round15-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-full-chunks-dry-run-readiness.ts',
  'operation-10m/agent-21-forecasting/forecast-wave16-projection-sync.ts',
  'operation-10m/agent-21-forecasting/forecast-integration-dry-run-attestation.ts',
  'operation-10m/agent-21-forecasting/forecast-round16-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-full-chunks-dry-run-execution.ts',
  'operation-10m/agent-21-forecasting/forecast-wave17-projection-sync.ts',
  'operation-10m/agent-21-forecasting/forecast-integration-dry-run-closure.ts',
  'operation-10m/agent-21-forecasting/forecast-round17-console.tsx'
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
  for (const row of runAg21EnsembleProjectionSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21CalibrationDriftSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21TrajectoryFusionSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ResidualBacktestSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21PolicyRegretSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ReliabilityGatesSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21HorizonVolatilitySelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LeverAttributionSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21SurfacingScorecardSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21EnsembleConvergenceSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21PlayerBriefSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabPlaybookSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21SurfaceDecisionSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabTelemetrySelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21CrosslinkPacketSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21PacketValidationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21OperatorEscalationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabReplaySeedSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ReplayCoherenceSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21EscalationRunbookSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabIntegrationHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21HandoffReadinessSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21OperatorSignoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabStagingPacketSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21StagingVerificationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ExportClearanceSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabCycleCloseoutSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21CloseoutAttestationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ExportManifestSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabArchiveSealSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ManifestConfirmationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ArchiveAuditTrailSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabRetentionPolicySelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21RetentionComplianceSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ArchiveAuditRollupSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabGovernanceCheckpointSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21GovernanceRemediationPlanSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21OriginGateAttestationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabContinuityVerdictSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21FullChunksDryRunReadinessSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave16ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationDryRunAttestationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21FullChunksDryRunExecutionSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave17ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationDryRunClosureSelfChecks()) {
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
