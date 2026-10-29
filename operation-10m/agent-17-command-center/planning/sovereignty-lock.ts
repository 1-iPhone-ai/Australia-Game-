import type {
  Agent17GovernanceAuditSnapshot,
  Agent17MandateWeaveSnapshot,
  Agent17SovereigntyLockSnapshot,
  Agent17StabilizationIndexSnapshot,
} from '../types/command-center-types.ts';
import { mandateWeaveBlocksSovereignty } from './mandate-weave.ts';

export interface Agent17SovereigntyLockInputs {
  mandateWeave: Agent17MandateWeaveSnapshot;
  governanceAudit: Agent17GovernanceAuditSnapshot;
  stabilizationIndex: Agent17StabilizationIndexSnapshot;
}

export function buildAgent17SovereigntyLock(
  inputs: Agent17SovereigntyLockInputs
): Agent17SovereigntyLockSnapshot {
  const pins: Agent17SovereigntyLockSnapshot['pins'] = [];

  pins.push({
    id: 'weave_aligned',
    label: 'Mandate weave aligned',
    engaged: inputs.mandateWeave.band === 'aligned' || inputs.mandateWeave.band === 'tensioned',
    weight: 30,
  });

  pins.push({
    id: 'governance_compliant',
    label: 'Governance audit compliant',
    engaged:
      inputs.governanceAudit.band === 'compliant' ||
      inputs.governanceAudit.band === 'review',
    weight: 25,
  });

  pins.push({
    id: 'stabilization_stable',
    label: 'Stabilization lane stable',
    engaged:
      inputs.stabilizationIndex.band === 'stable' ||
      inputs.stabilizationIndex.band === 'adjusting',
    weight: 25,
  });

  pins.push({
    id: 'audit_score',
    label: 'Governance audit score',
    engaged: inputs.governanceAudit.auditScore >= 50,
    weight: 10,
  });

  pins.push({
    id: 'stabilization_index',
    label: 'Stabilization index headroom',
    engaged: inputs.stabilizationIndex.stabilizationIndex >= 45,
    weight: 10,
  });

  const weighted = pins.reduce(
    (n, p) => n + (p.engaged ? 100 : 14) * (p.weight / 100),
    0
  );
  const totalWeight = pins.reduce((n, p) => n + p.weight, 0);
  const lockScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const releasedSignals =
    mandateWeaveBlocksSovereignty(inputs.mandateWeave) ||
    inputs.governanceAudit.band === 'breach' ||
    inputs.stabilizationIndex.band === 'volatile';

  const band: Agent17SovereigntyLockSnapshot['band'] = releasedSignals
    ? 'released'
    : lockScore >= 70 &&
        inputs.mandateWeave.band === 'aligned' &&
        !mandateWeaveBlocksSovereignty(inputs.mandateWeave)
      ? 'secured'
      : 'conditional';

  const commandSovereignty =
    band === 'secured' &&
    !mandateWeaveBlocksSovereignty(inputs.mandateWeave) &&
    inputs.governanceAudit.band !== 'breach';

  return {
    lockScore,
    band,
    pins,
    weaveBand: inputs.mandateWeave.band,
    commandSovereignty,
    headline: `Sovereignty ${band} (${lockScore}/100) · ${pins.filter(p => p.engaged).length}/${pins.length} pins`,
  };
}

export function sovereigntyLockBlocksCommand(snapshot: Agent17SovereigntyLockSnapshot): boolean {
  return snapshot.band === 'released' || !snapshot.commandSovereignty;
}
