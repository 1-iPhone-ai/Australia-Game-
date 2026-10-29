import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '..');
const WAVE55_SHA = 'c4bbec67';
const WAVE63_SHA = '2ccfd849';

function writeFusionBundle() {
  let c = fs.readFileSync(path.join(src, 'match-explainability-convergence-bundle.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-lattice-gate.ts', 'match-explainability-matrix-gate.ts')
    .replaceAll('auditMatchExplainabilityLatticeGate', 'auditMatchExplainabilityMatrixGate')
    .replaceAll('matchExplainabilityLatticeAllowed', 'matchExplainabilityMatrixAllowed')
    .replaceAll('buildMatchExplainabilityConvergenceBundle', 'buildMatchExplainabilityFusionBundle')
    .replaceAll('matchExplainabilityConvergenceReady', 'matchExplainabilityFusionReady')
    .replaceAll('buildSessionConvergenceExportBundle', 'buildSessionFusionExportBundle')
    .replaceAll('sessionConvergenceExportShipped', 'sessionFusionExportShipped')
    .replaceAll('Convergence', 'Fusion')
    .replaceAll('convergence', 'fusion')
    .replaceAll('O10-247', 'O10-273')
    .replaceAll(WAVE55_SHA, WAVE63_SHA);
  fs.writeFileSync(path.join(src, 'match-explainability-fusion-bundle.ts'), c);
}

function writeMatrixGate() {
  let c = fs.readFileSync(path.join(src, 'match-explainability-lattice-gate.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-convergence-bundle.ts', 'match-explainability-fusion-bundle.ts')
    .replaceAll('buildMatchExplainabilityConvergenceBundle', 'buildMatchExplainabilityFusionBundle')
    .replaceAll('matchExplainabilityConvergenceReady', 'matchExplainabilityFusionReady')
    .replaceAll('session-convergence-export-bundle.ts', 'session-fusion-export-bundle.ts')
    .replaceAll('buildSessionConvergenceExportBundle', 'buildSessionFusionExportBundle')
    .replaceAll('sessionConvergenceExportShipped', 'sessionFusionExportShipped')
    .replaceAll('nexus-convergence-bridge.ts', 'apex-fusion-bridge.ts')
    .replaceAll('auditNexusConvergenceBridge', 'auditApexFusionBridge')
    .replaceAll('nexusConvergenceBridgeHealthy', 'apexFusionBridgeHealthy')
    .replaceAll('Lattice', 'Matrix')
    .replaceAll('lattice', 'matrix')
    .replaceAll('Convergence', 'Fusion')
    .replaceAll('convergence', 'fusion')
    .replaceAll('nexusConvergence', 'apexFusion')
    .replaceAll('O10-247', 'O10-273');
  fs.writeFileSync(path.join(src, 'match-explainability-matrix-gate.ts'), c);
}

function writeSessionFusionExport() {
  let c = fs.readFileSync(path.join(src, 'session-convergence-export-bundle.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-convergence-bundle.ts', 'match-explainability-fusion-bundle.ts')
    .replaceAll('buildMatchExplainabilityConvergenceBundle', 'buildMatchExplainabilityFusionBundle')
    .replaceAll('matchExplainabilityConvergenceReady', 'matchExplainabilityFusionReady')
    .replaceAll('Convergence', 'Fusion')
    .replaceAll('convergence', 'fusion')
    .replaceAll('agent19.convergence.v1', 'agent19.fusion.v1')
    .replaceAll('O10-247', 'O10-273');
  fs.writeFileSync(path.join(src, 'session-fusion-export-bundle.ts'), c);
}

function writeApexFusionBridge() {
  let c = fs.readFileSync(path.join(src, 'nexus-convergence-bridge.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-convergence-bundle.ts', 'match-explainability-fusion-bundle.ts')
    .replaceAll('buildMatchExplainabilityConvergenceBundle', 'buildMatchExplainabilityFusionBundle')
    .replaceAll('matchExplainabilityConvergenceReady', 'matchExplainabilityFusionReady')
    .replaceAll('NexusConvergence', 'ApexFusion')
    .replaceAll('nexusConvergence', 'apexFusion')
    .replaceAll('Nexus/convergence', 'Apex/fusion')
    .replaceAll('convergence', 'fusion')
    .replaceAll('Convergence', 'Fusion')
    .replaceAll('O10-247', 'O10-273');
  fs.writeFileSync(path.join(src, 'apex-fusion-bridge.ts'), c);
}

function writeFusionRecovery() {
  let c = fs.readFileSync(path.join(src, 'convergence-recovery-orchestrator.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-lattice-gate.ts', 'match-explainability-matrix-gate.ts')
    .replaceAll('auditMatchExplainabilityLatticeGate', 'auditMatchExplainabilityMatrixGate')
    .replaceAll('matchExplainabilityLatticeAllowed', 'matchExplainabilityMatrixAllowed')
    .replaceAll('convergence-recovery-orchestrator.ts', 'fusion-recovery-orchestrator.ts')
    .replaceAll('buildConvergenceRecoveryOrchestrator', 'buildFusionRecoveryOrchestrator')
    .replaceAll('match-explainability-convergence-bundle.ts', 'match-explainability-fusion-bundle.ts')
    .replaceAll('Convergence', 'Fusion')
    .replaceAll('convergence', 'fusion')
    .replaceAll('lattice rollout', 'matrix rollout')
    .replaceAll('AGENT19_CONVERGENCE_RECOVERY_CAP', 'AGENT19_FUSION_RECOVERY_CAP')
    .replaceAll('O10-247', 'O10-273');
  fs.writeFileSync(path.join(src, 'fusion-recovery-orchestrator.ts'), c);
}

function patchIndexAndChunk() {
  const indexPath = path.join(src, 'index.ts');
  const chunkPath = path.join(src, 'scripts/build-chunk.mjs');
  const exportsBlock = `
export * from './match-explainability-fusion-bundle.ts';
export * from './session-fusion-export-bundle.ts';
export * from './apex-fusion-bridge.ts';
export * from './match-explainability-matrix-gate.ts';
export * from './fusion-recovery-orchestrator.ts';
`;
  let index = fs.readFileSync(indexPath, 'utf8');
  if (!index.includes('fusion-recovery-orchestrator')) {
    index = index.replace(
      "export * from './convergence-recovery-orchestrator.ts';",
      "export * from './convergence-recovery-orchestrator.ts';" + exportsBlock,
    );
    fs.writeFileSync(indexPath, index);
  }
  const filesBlock = `  'match-explainability-fusion-bundle.ts',
  'session-fusion-export-bundle.ts',
  'apex-fusion-bridge.ts',
  'match-explainability-matrix-gate.ts',
  'fusion-recovery-orchestrator.ts',
`;
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  if (!chunk.includes('fusion-recovery-orchestrator.ts')) {
    chunk = chunk.replace(
      "  'convergence-recovery-orchestrator.ts',",
      "  'convergence-recovery-orchestrator.ts'," + filesBlock,
    );
    fs.writeFileSync(chunkPath, chunk);
  }
}

writeFusionBundle();
writeMatrixGate();
writeSessionFusionExport();
writeApexFusionBridge();
writeFusionRecovery();
patchIndexAndChunk();
console.log('gen-wave63 agent-19 ok');
