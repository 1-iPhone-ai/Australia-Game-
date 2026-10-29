import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '..');
const WAVE53_SHA = '51039c5e';
const WAVE54_SHA = '5bd043ad';

function writeSynthesisBundle() {
  let c = fs.readFileSync(path.join(src, 'match-explainability-projection-bundle.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-resonance-gate.ts', 'match-explainability-harmony-gate.ts')
    .replaceAll('auditMatchExplainabilityResonanceGate', 'auditMatchExplainabilityHarmonyGate')
    .replaceAll('matchExplainabilityResonanceAllowed', 'matchExplainabilityHarmonyAllowed')
    .replaceAll('buildMatchExplainabilityConvergenceBundle', 'buildMatchExplainabilityProjectionBundle')
    .replaceAll('matchExplainabilityConvergenceReady', 'matchExplainabilityProjectionReady')
    .replaceAll('buildSessionConvergenceExportBundle', 'buildSessionProjectionExportBundle')
    .replaceAll('sessionConvergenceExportShipped', 'sessionProjectionExportShipped')
    .replaceAll('Projection', 'Synthesis')
    .replaceAll('projection', 'synthesis')
    .replaceAll('convergence', 'projection')
    .replaceAll('Convergence', 'Projection')
    .replaceAll('O10-237', 'O10-240')
    .replaceAll(WAVE53_SHA, WAVE54_SHA);
  fs.writeFileSync(path.join(src, 'match-explainability-synthesis-bundle.ts'), c);
}

function writeHarmonyGate() {
  let c = fs.readFileSync(path.join(src, 'match-explainability-resonance-gate.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-projection-bundle.ts', 'match-explainability-synthesis-bundle.ts')
    .replaceAll('buildMatchExplainabilityProjectionBundle', 'buildMatchExplainabilitySynthesisBundle')
    .replaceAll('matchExplainabilityProjectionReady', 'matchExplainabilitySynthesisReady')
    .replaceAll('session-projection-export-bundle.ts', 'session-synthesis-export-bundle.ts')
    .replaceAll('buildSessionProjectionExportBundle', 'buildSessionSynthesisExportBundle')
    .replaceAll('sessionProjectionExportShipped', 'sessionSynthesisExportShipped')
    .replaceAll('lattice-projection-bridge.ts', 'resonance-synthesis-bridge.ts')
    .replaceAll('auditLatticeProjectionBridge', 'auditResonanceSynthesisBridge')
    .replaceAll('latticeProjectionBridgeHealthy', 'resonanceSynthesisBridgeHealthy')
    .replaceAll('Resonance', 'Harmony')
    .replaceAll('resonance', 'harmony')
    .replaceAll('Projection', 'Synthesis')
    .replaceAll('projection', 'synthesis')
    .replaceAll('latticeProjection', 'resonanceSynthesis')
    .replaceAll('O10-237', 'O10-240');
  fs.writeFileSync(path.join(src, 'match-explainability-harmony-gate.ts'), c);
}

function writeSessionSynthesisExport() {
  let c = fs.readFileSync(path.join(src, 'session-projection-export-bundle.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-projection-bundle.ts', 'match-explainability-synthesis-bundle.ts')
    .replaceAll('buildMatchExplainabilityProjectionBundle', 'buildMatchExplainabilitySynthesisBundle')
    .replaceAll('matchExplainabilityProjectionReady', 'matchExplainabilitySynthesisReady')
    .replaceAll('Projection', 'Synthesis')
    .replaceAll('projection', 'synthesis')
    .replaceAll('agent19.projection.v1', 'agent19.synthesis.v1')
    .replaceAll('O10-237', 'O10-240');
  fs.writeFileSync(path.join(src, 'session-synthesis-export-bundle.ts'), c);
}

function writeResonanceSynthesisBridge() {
  let c = fs.readFileSync(path.join(src, 'lattice-projection-bridge.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-projection-bundle.ts', 'match-explainability-synthesis-bundle.ts')
    .replaceAll('buildMatchExplainabilityProjectionBundle', 'buildMatchExplainabilitySynthesisBundle')
    .replaceAll('matchExplainabilityProjectionReady', 'matchExplainabilitySynthesisReady')
    .replaceAll('match-explainability-convergence-bundle.ts', 'match-explainability-projection-bundle.ts')
    .replaceAll('buildMatchExplainabilityConvergenceBundle', 'buildMatchExplainabilityProjectionBundle')
    .replaceAll('matchExplainabilityConvergenceReady', 'matchExplainabilityProjectionReady')
    .replaceAll('LatticeProjection', 'ResonanceSynthesis')
    .replaceAll('latticeProjection', 'resonanceSynthesis')
    .replaceAll('Lattice/projection', 'Resonance/synthesis')
    .replaceAll('projection', 'synthesis')
    .replaceAll('convergence', 'projection')
    .replaceAll('Convergence', 'Projection')
    .replaceAll('O10-237', 'O10-240');
  fs.writeFileSync(path.join(src, 'resonance-synthesis-bridge.ts'), c);
}

function writeSynthesisRecovery() {
  let c = fs.readFileSync(path.join(src, 'projection-recovery-orchestrator.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-resonance-gate.ts', 'match-explainability-harmony-gate.ts')
    .replaceAll('auditMatchExplainabilityResonanceGate', 'auditMatchExplainabilityHarmonyGate')
    .replaceAll('matchExplainabilityResonanceAllowed', 'matchExplainabilityHarmonyAllowed')
    .replaceAll('convergence-recovery-orchestrator.ts', 'projection-recovery-orchestrator.ts')
    .replaceAll('buildConvergenceRecoveryOrchestrator', 'buildProjectionRecoveryOrchestrator')
    .replaceAll('match-explainability-lattice-gate.ts', 'match-explainability-resonance-gate.ts')
    .replaceAll('auditMatchExplainabilityLatticeGate', 'auditMatchExplainabilityResonanceGate')
    .replaceAll('Projection', 'Synthesis')
    .replaceAll('projection', 'synthesis')
    .replaceAll('lattice', 'resonance')
    .replaceAll('Lattice', 'Resonance')
    .replaceAll('resonance rollout', 'harmony rollout')
    .replaceAll('AGENT19_PROJECTION_RECOVERY_CAP', 'AGENT19_SYNTHESIS_RECOVERY_CAP')
    .replaceAll('O10-237', 'O10-240');
  fs.writeFileSync(path.join(src, 'synthesis-recovery-orchestrator.ts'), c);
}

function patchIndexAndChunk() {
  const indexPath = path.join(src, 'index.ts');
  const chunkPath = path.join(src, 'scripts/build-chunk.mjs');
  const exportsBlock = `
export * from './match-explainability-synthesis-bundle.ts';
export * from './session-synthesis-export-bundle.ts';
export * from './resonance-synthesis-bridge.ts';
export * from './match-explainability-harmony-gate.ts';
export * from './synthesis-recovery-orchestrator.ts';
`;
  let index = fs.readFileSync(indexPath, 'utf8');
  if (!index.includes('synthesis-recovery-orchestrator')) {
    index = index.replace(
      "export * from './projection-recovery-orchestrator.ts';",
      "export * from './projection-recovery-orchestrator.ts';" + exportsBlock,
    );
    fs.writeFileSync(indexPath, index);
  }
  const filesBlock = `  'match-explainability-synthesis-bundle.ts',
  'session-synthesis-export-bundle.ts',
  'resonance-synthesis-bridge.ts',
  'match-explainability-harmony-gate.ts',
  'synthesis-recovery-orchestrator.ts',
`;
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  if (!chunk.includes('synthesis-recovery-orchestrator.ts')) {
    chunk = chunk.replace(
      "  'projection-recovery-orchestrator.ts',",
      "  'projection-recovery-orchestrator.ts'," + filesBlock,
    );
    fs.writeFileSync(chunkPath, chunk);
  }
}

writeSynthesisBundle();
writeHarmonyGate();
writeSessionSynthesisExport();
writeResonanceSynthesisBridge();
writeSynthesisRecovery();
patchIndexAndChunk();
console.log('gen-wave54 agent-19 ok');
