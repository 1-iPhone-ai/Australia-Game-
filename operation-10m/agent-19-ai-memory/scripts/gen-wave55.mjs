import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '..');
const WAVE54_SHA = '5bd043ad';
const WAVE55_SHA = 'c4bbec67';

function writeConvergenceBundle() {
  let c = fs.readFileSync(path.join(src, 'match-explainability-synthesis-bundle.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-harmony-gate.ts', 'match-explainability-lattice-gate.ts')
    .replaceAll('auditMatchExplainabilityHarmonyGate', 'auditMatchExplainabilityLatticeGate')
    .replaceAll('matchExplainabilityHarmonyAllowed', 'matchExplainabilityLatticeAllowed')
    .replaceAll('buildMatchExplainabilitySynthesisBundle', 'buildMatchExplainabilityConvergenceBundle')
    .replaceAll('matchExplainabilitySynthesisReady', 'matchExplainabilityConvergenceReady')
    .replaceAll('buildSessionSynthesisExportBundle', 'buildSessionConvergenceExportBundle')
    .replaceAll('sessionSynthesisExportShipped', 'sessionConvergenceExportShipped')
    .replaceAll('Synthesis', 'Convergence')
    .replaceAll('synthesis', 'convergence')
    .replaceAll('O10-240', 'O10-247')
    .replaceAll(WAVE54_SHA, WAVE55_SHA);
  fs.writeFileSync(path.join(src, 'match-explainability-convergence-bundle.ts'), c);
}

function writeLatticeGate() {
  let c = fs.readFileSync(path.join(src, 'match-explainability-harmony-gate.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-synthesis-bundle.ts', 'match-explainability-convergence-bundle.ts')
    .replaceAll('buildMatchExplainabilitySynthesisBundle', 'buildMatchExplainabilityConvergenceBundle')
    .replaceAll('matchExplainabilitySynthesisReady', 'matchExplainabilityConvergenceReady')
    .replaceAll('session-synthesis-export-bundle.ts', 'session-convergence-export-bundle.ts')
    .replaceAll('buildSessionSynthesisExportBundle', 'buildSessionConvergenceExportBundle')
    .replaceAll('sessionSynthesisExportShipped', 'sessionConvergenceExportShipped')
    .replaceAll('resonance-synthesis-bridge.ts', 'nexus-convergence-bridge.ts')
    .replaceAll('auditResonanceSynthesisBridge', 'auditNexusConvergenceBridge')
    .replaceAll('resonanceSynthesisBridgeHealthy', 'nexusConvergenceBridgeHealthy')
    .replaceAll('Harmony', 'Lattice')
    .replaceAll('harmony', 'lattice')
    .replaceAll('Synthesis', 'Convergence')
    .replaceAll('synthesis', 'convergence')
    .replaceAll('resonanceSynthesis', 'nexusConvergence')
    .replaceAll('O10-240', 'O10-247');
  fs.writeFileSync(path.join(src, 'match-explainability-lattice-gate.ts'), c);
}

function writeSessionConvergenceExport() {
  let c = fs.readFileSync(path.join(src, 'session-synthesis-export-bundle.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-synthesis-bundle.ts', 'match-explainability-convergence-bundle.ts')
    .replaceAll('buildMatchExplainabilitySynthesisBundle', 'buildMatchExplainabilityConvergenceBundle')
    .replaceAll('matchExplainabilitySynthesisReady', 'matchExplainabilityConvergenceReady')
    .replaceAll('Synthesis', 'Convergence')
    .replaceAll('synthesis', 'convergence')
    .replaceAll('agent19.synthesis.v1', 'agent19.convergence.v1')
    .replaceAll('O10-240', 'O10-247');
  fs.writeFileSync(path.join(src, 'session-convergence-export-bundle.ts'), c);
}

function writeNexusConvergenceBridge() {
  let c = fs.readFileSync(path.join(src, 'resonance-synthesis-bridge.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-synthesis-bundle.ts', 'match-explainability-convergence-bundle.ts')
    .replaceAll('buildMatchExplainabilitySynthesisBundle', 'buildMatchExplainabilityConvergenceBundle')
    .replaceAll('matchExplainabilitySynthesisReady', 'matchExplainabilityConvergenceReady')
    .replaceAll('ResonanceSynthesis', 'NexusConvergence')
    .replaceAll('resonanceSynthesis', 'nexusConvergence')
    .replaceAll('Resonance/synthesis', 'Nexus/convergence')
    .replaceAll('synthesis', 'convergence')
    .replaceAll('Synthesis', 'Convergence')
    .replaceAll('O10-240', 'O10-247');
  fs.writeFileSync(path.join(src, 'nexus-convergence-bridge.ts'), c);
}

function writeConvergenceRecovery() {
  let c = fs.readFileSync(path.join(src, 'synthesis-recovery-orchestrator.ts'), 'utf8');
  c = c
    .replaceAll('match-explainability-harmony-gate.ts', 'match-explainability-lattice-gate.ts')
    .replaceAll('auditMatchExplainabilityHarmonyGate', 'auditMatchExplainabilityLatticeGate')
    .replaceAll('matchExplainabilityHarmonyAllowed', 'matchExplainabilityLatticeAllowed')
    .replaceAll('synthesis-recovery-orchestrator.ts', 'convergence-recovery-orchestrator.ts')
    .replaceAll('buildSynthesisRecoveryOrchestrator', 'buildConvergenceRecoveryOrchestrator')
    .replaceAll('match-explainability-synthesis-bundle.ts', 'match-explainability-convergence-bundle.ts')
    .replaceAll('Synthesis', 'Convergence')
    .replaceAll('synthesis', 'convergence')
    .replaceAll('harmony rollout', 'lattice rollout')
    .replaceAll('AGENT19_SYNTHESIS_RECOVERY_CAP', 'AGENT19_CONVERGENCE_RECOVERY_CAP')
    .replaceAll('O10-240', 'O10-247');
  fs.writeFileSync(path.join(src, 'convergence-recovery-orchestrator.ts'), c);
}

function patchIndexAndChunk() {
  const indexPath = path.join(src, 'index.ts');
  const chunkPath = path.join(src, 'scripts/build-chunk.mjs');
  const exportsBlock = `
export * from './match-explainability-convergence-bundle.ts';
export * from './session-convergence-export-bundle.ts';
export * from './nexus-convergence-bridge.ts';
export * from './match-explainability-lattice-gate.ts';
export * from './convergence-recovery-orchestrator.ts';
`;
  let index = fs.readFileSync(indexPath, 'utf8');
  if (!index.includes('convergence-recovery-orchestrator')) {
    index = index.replace(
      "export * from './synthesis-recovery-orchestrator.ts';",
      "export * from './synthesis-recovery-orchestrator.ts';" + exportsBlock,
    );
    fs.writeFileSync(indexPath, index);
  }
  const filesBlock = `  'match-explainability-convergence-bundle.ts',
  'session-convergence-export-bundle.ts',
  'nexus-convergence-bridge.ts',
  'match-explainability-lattice-gate.ts',
  'convergence-recovery-orchestrator.ts',
`;
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  if (!chunk.includes('convergence-recovery-orchestrator.ts')) {
    chunk = chunk.replace(
      "  'synthesis-recovery-orchestrator.ts',",
      "  'synthesis-recovery-orchestrator.ts'," + filesBlock,
    );
    fs.writeFileSync(chunkPath, chunk);
  }
}

writeConvergenceBundle();
writeLatticeGate();
writeSessionConvergenceExport();
writeNexusConvergenceBridge();
writeConvergenceRecovery();
patchIndexAndChunk();
console.log('gen-wave55 agent-19 ok');
