import type {
  Agent17ContinuityBridgeSnapshot,
  Agent17PulseIndexSnapshot,
  Agent17ResilienceScorecard,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';
import { pulseIndexBlocksContinuity } from './pulse-index.ts';

export interface Agent17ContinuityBridgeInputs {
  pulseIndex: Agent17PulseIndexSnapshot;
  resilienceScorecard: Agent17ResilienceScorecard;
  verificationPolicy: Agent17VerificationPolicySnapshot;
}

export function buildAgent17ContinuityBridge(
  inputs: Agent17ContinuityBridgeInputs
): Agent17ContinuityBridgeSnapshot {
  const links: Agent17ContinuityBridgeSnapshot['links'] = [];

  links.push({
    id: 'pulse_resilience',
    label: 'Pulse to resilience mesh',
    connected:
      inputs.pulseIndex.pulseIndex >= 50 &&
      inputs.resilienceScorecard.compositeIndex >= 45,
    weight: 30,
  });

  links.push({
    id: 'verify_pulse',
    label: 'Verification to pulse lane',
    connected:
      inputs.verificationPolicy.allowVerification &&
      inputs.pulseIndex.band !== 'flat',
    weight: 25,
  });

  links.push({
    id: 'resilience_verify',
    label: 'Resilience to verify policy',
    connected:
      inputs.resilienceScorecard.band !== 'fragile' ||
      inputs.verificationPolicy.allowVerification,
    weight: 20,
  });

  links.push({
    id: 'mitigation_pulse',
    label: 'Mitigation hints to pulse',
    connected: inputs.resilienceScorecard.mitigationHints.length >= 1,
    weight: 15,
  });

  links.push({
    id: 'policy_rules',
    label: 'Policy rules satisfied',
    connected: inputs.verificationPolicy.rules.filter(r => r.satisfied).length >= 2,
    weight: 10,
  });

  const weighted = links.reduce(
    (n, link) => n + (link.connected ? 100 : 20) * (link.weight / 100),
    0
  );
  const totalWeight = links.reduce((n, link) => n + link.weight, 0);
  const bridgeScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const brokenSignals =
    pulseIndexBlocksContinuity(inputs.pulseIndex) ||
    (inputs.resilienceScorecard.band === 'fragile' &&
      !inputs.verificationPolicy.allowVerification);

  const band: Agent17ContinuityBridgeSnapshot['band'] = brokenSignals
    ? 'broken'
    : bridgeScore >= 70 && inputs.pulseIndex.band !== 'flat'
      ? 'linked'
      : 'partial';

  const continuityClearance =
    band === 'linked' &&
    !pulseIndexBlocksContinuity(inputs.pulseIndex) &&
    inputs.verificationPolicy.allowVerification;

  return {
    bridgeScore,
    band,
    links,
    pulseBand: inputs.pulseIndex.band,
    continuityClearance,
    headline: `Bridge ${band} (${bridgeScore}/100) · ${links.filter(l => l.connected).length}/${links.length} links`,
  };
}

export function continuityBridgeBlocksHandoff(
  snapshot: Agent17ContinuityBridgeSnapshot
): boolean {
  return snapshot.band === 'broken' || !snapshot.continuityClearance;
}
