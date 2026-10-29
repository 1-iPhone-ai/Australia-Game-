import type {
  Agent17ContinuityBridgeSnapshot,
  Agent17FluxIndexSnapshot,
  Agent17GovernanceAuditSnapshot,
  Agent17PulseIndexSnapshot,
} from '../types/command-center-types.ts';
import { pulseIndexBlocksContinuity } from './pulse-index.ts';
import { governanceAuditBlocksAutomation } from './governance-audit.ts';

export interface Agent17FluxIndexInputs {
  continuityBridge: Agent17ContinuityBridgeSnapshot;
  pulseIndex: Agent17PulseIndexSnapshot;
  governanceAudit: Agent17GovernanceAuditSnapshot;
}

export function buildAgent17FluxIndex(inputs: Agent17FluxIndexInputs): Agent17FluxIndexSnapshot {
  const factors: Agent17FluxIndexSnapshot['factors'] = [];

  factors.push({
    id: 'bridge_score',
    label: 'Continuity bridge score',
    score: inputs.continuityBridge.bridgeScore,
    weight: 35,
  });

  factors.push({
    id: 'pulse_index',
    label: 'Operational pulse index',
    score: inputs.pulseIndex.pulseIndex,
    weight: 30,
  });

  const auditScore = Math.max(0, 100 - inputs.governanceAudit.openCriticalCount * 22);
  factors.push({
    id: 'governance_audit',
    label: 'Governance audit headroom',
    score: auditScore,
    weight: 20,
  });

  const bridgeLinkRatio = Math.round(
    (inputs.continuityBridge.links.filter(l => l.connected).length /
      Math.max(1, inputs.continuityBridge.links.length)) *
      100
  );
  factors.push({
    id: 'bridge_links',
    label: 'Bridge link ratio',
    score: bridgeLinkRatio,
    weight: 15,
  });

  const weighted = factors.reduce((n, f) => n + f.score * (f.weight / 100), 0);
  const totalWeight = factors.reduce((n, f) => n + f.weight, 0);
  const fluxIndex = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const disruptedSignals =
    inputs.continuityBridge.band === 'broken' ||
    inputs.pulseIndex.band === 'flat' ||
    inputs.governanceAudit.band === 'breach' ||
    pulseIndexBlocksContinuity(inputs.pulseIndex) ||
    governanceAuditBlocksAutomation(inputs.governanceAudit);

  const band: Agent17FluxIndexSnapshot['band'] = disruptedSignals
    ? 'disrupted'
    : fluxIndex >= 62 &&
        inputs.continuityBridge.band !== 'broken' &&
        inputs.pulseIndex.band !== 'flat'
      ? 'coherent'
      : 'noisy';

  return {
    fluxIndex,
    band,
    factors,
    bridgeBand: inputs.continuityBridge.band,
    governanceBand: inputs.governanceAudit.band,
    headline: `Flux ${band} (${fluxIndex}/100) · bridge ${inputs.continuityBridge.band}`,
  };
}

export function fluxIndexBlocksSeal(snapshot: Agent17FluxIndexSnapshot): boolean {
  return snapshot.band === 'disrupted' || snapshot.fluxIndex < 33;
}
