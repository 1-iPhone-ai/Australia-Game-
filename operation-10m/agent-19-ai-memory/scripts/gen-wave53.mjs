import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '..');
const WAVE52_SHA = 'ba97bdce';
const WAVE53_SHA = '51039c5e';

function writeProjectionBundle() {
  let c = fs.readFileSync(path.join(src, 'match-explainability-convergence-bundle.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-convergence-gate.ts', 'match-explainability-lattice-gate.ts')
    .replaceAll('auditMatchExplainabilityConvergenceGate', 'auditMatchExplainabilityLatticeGate')
    .replaceAll('matchExplainabilityConvergenceAllowed', 'matchExplainabilityLatticeAllowed')
    .replaceAll('buildMatchExplainabilityNexusBundle', 'buildMatchExplainabilityConvergenceBundle')
    .replaceAll('matchExplainabilityNexusReady', 'matchExplainabilityConvergenceReady')
    .replaceAll('buildSessionNexusExportBundle', 'buildSessionConvergenceExportBundle')
    .replaceAll('sessionNexusExportShipped', 'sessionConvergenceExportShipped')
    .replaceAll('Convergence', 'Projection')
    .replaceAll('convergence', 'projection')
    .replaceAll('nexus', 'convergence')
    .replaceAll('Nexus', 'Convergence')
    .replaceAll('AGENT19_PROJECTION_NARRATIVE_CAP', 'AGENT19_PROJECTION_NARRATIVE_CAP')
    .replaceAll('O10-235', 'O10-237')
    .replaceAll(WAVE52_SHA, WAVE53_SHA);
  fs.writeFileSync(path.join(src, 'match-explainability-projection-bundle.ts'), c);
}

function writeResonanceGate() {
  let c = fs.readFileSync(path.join(src, 'match-explainability-lattice-gate.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-convergence-bundle.ts', 'match-explainability-projection-bundle.ts')
    .replaceAll('buildMatchExplainabilityConvergenceBundle', 'buildMatchExplainabilityProjectionBundle')
    .replaceAll('matchExplainabilityConvergenceReady', 'matchExplainabilityProjectionReady')
    .replaceAll('session-convergence-export-bundle.ts', 'session-projection-export-bundle.ts')
    .replaceAll('buildSessionConvergenceExportBundle', 'buildSessionProjectionExportBundle')
    .replaceAll('sessionConvergenceExportShipped', 'sessionProjectionExportShipped')
    .replaceAll('nexus-convergence-bridge.ts', 'lattice-projection-bridge.ts')
    .replaceAll('auditNexusConvergenceBridge', 'auditLatticeProjectionBridge')
    .replaceAll('nexusConvergenceBridgeHealthy', 'latticeProjectionBridgeHealthy')
    .replaceAll('Lattice', 'Resonance')
    .replaceAll('lattice', 'resonance')
    .replaceAll('Convergence', 'Projection')
    .replaceAll('convergence', 'projection')
    .replaceAll('nexusConvergence', 'latticeProjection')
    .replaceAll('O10-235', 'O10-237');
  fs.writeFileSync(path.join(src, 'match-explainability-resonance-gate.ts'), c);
}

function writeSessionProjectionExport() {
  let c = fs.readFileSync(path.join(src, 'session-convergence-export-bundle.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-convergence-bundle.ts', 'match-explainability-projection-bundle.ts')
    .replaceAll('buildMatchExplainabilityConvergenceBundle', 'buildMatchExplainabilityProjectionBundle')
    .replaceAll('matchExplainabilityConvergenceReady', 'matchExplainabilityProjectionReady')
    .replaceAll('Convergence', 'Projection')
    .replaceAll('convergence', 'projection')
    .replaceAll('agent19.convergence.v1', 'agent19.projection.v1')
    .replaceAll('O10-235', 'O10-237');
  fs.writeFileSync(path.join(src, 'session-projection-export-bundle.ts'), c);
}

function writeLatticeProjectionBridge() {
  let c = fs.readFileSync(path.join(src, 'nexus-convergence-bridge.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-convergence-bundle.ts', 'match-explainability-projection-bundle.ts')
    .replaceAll('buildMatchExplainabilityConvergenceBundle', 'buildMatchExplainabilityProjectionBundle')
    .replaceAll('matchExplainabilityConvergenceReady', 'matchExplainabilityProjectionReady')
    .replaceAll('match-explainability-nexus-bundle.ts', 'match-explainability-convergence-bundle.ts')
    .replaceAll('buildMatchExplainabilityNexusBundle', 'buildMatchExplainabilityConvergenceBundle')
    .replaceAll('matchExplainabilityNexusReady', 'matchExplainabilityConvergenceReady')
    .replaceAll('NexusConvergence', 'LatticeProjection')
    .replaceAll('nexusConvergence', 'latticeProjection')
    .replaceAll('Nexus/convergence', 'Lattice/projection')
    .replaceAll('convergence', 'projection')
    .replaceAll('nexus', 'convergence')
    .replaceAll('Nexus', 'Convergence')
    .replaceAll('O10-235', 'O10-237');
  fs.writeFileSync(path.join(src, 'lattice-projection-bridge.ts'), c);
}

function writeProjectionRecovery() {
  let c = fs.readFileSync(path.join(src, 'convergence-recovery-orchestrator.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-convergence-gate.ts', 'match-explainability-resonance-gate.ts')
    .replaceAll('auditMatchExplainabilityConvergenceGate', 'auditMatchExplainabilityResonanceGate')
    .replaceAll('matchExplainabilityConvergenceAllowed', 'matchExplainabilityResonanceAllowed')
    .replaceAll('nexus-recovery-orchestrator.ts', 'convergence-recovery-orchestrator.ts')
    .replaceAll('buildNexusRecoveryOrchestrator', 'buildConvergenceRecoveryOrchestrator')
    .replaceAll('match-explainability-nexus-bundle.ts', 'match-explainability-lattice-gate.ts')
    .replaceAll('buildMatchExplainabilityNexusBundle', 'auditMatchExplainabilityLatticeGate')
    .replaceAll('Convergence', 'Projection')
    .replaceAll('convergence', 'projection')
    .replaceAll('nexus', 'lattice')
    .replaceAll('Nexus', 'Lattice')
    .replaceAll('lattice rollout', 'resonance rollout')
    .replaceAll('AGENT19_CONVERGENCE_RECOVERY_CAP', 'AGENT19_PROJECTION_RECOVERY_CAP')
    .replaceAll('O10-235', 'O10-237');
  fs.writeFileSync(path.join(src, 'projection-recovery-orchestrator.ts'), c);
}

function patchIndexAndChunk() {
  const indexPath = path.join(src, 'index.ts');
  const chunkPath = path.join(src, 'scripts/build-chunk.mjs');
  const exportsBlock = `
export * from './match-explainability-projection-bundle.ts';
export * from './session-projection-export-bundle.ts';
export * from './lattice-projection-bridge.ts';
export * from './match-explainability-resonance-gate.ts';
export * from './projection-recovery-orchestrator.ts';
`;
  let index = fs.readFileSync(indexPath, 'utf8');
  if (!index.includes('projection-recovery-orchestrator')) {
    index = index.replace(
      "export * from './convergence-recovery-orchestrator.ts';",
      "export * from './convergence-recovery-orchestrator.ts';" + exportsBlock,
    );
    fs.writeFileSync(indexPath, index);
  }
  const filesBlock = `  'match-explainability-projection-bundle.ts',
  'session-projection-export-bundle.ts',
  'lattice-projection-bridge.ts',
  'match-explainability-resonance-gate.ts',
  'projection-recovery-orchestrator.ts',
`;
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  if (!chunk.includes('projection-recovery-orchestrator.ts')) {
    chunk = chunk.replace(
      "  'convergence-recovery-orchestrator.ts',",
      "  'convergence-recovery-orchestrator.ts'," + filesBlock,
    );
    fs.writeFileSync(chunkPath, chunk);
  }
}

writeProjectionBundle();
writeResonanceGate();
writeSessionProjectionExport();
writeLatticeProjectionBridge();
writeProjectionRecovery();
patchIndexAndChunk();
console.log('gen-wave53 agent-19 ok');
