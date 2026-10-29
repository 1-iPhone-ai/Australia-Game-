import type {
  Agent17FluxIndexSnapshot,
  Agent17IntegritySealSnapshot,
  Agent17RollbackAssuranceSnapshot,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';
import { fluxIndexBlocksSeal } from './flux-index.ts';
import { rollbackAssuranceNeedsRestore } from './rollback-assurance.ts';

export interface Agent17IntegritySealInputs {
  fluxIndex: Agent17FluxIndexSnapshot;
  rollbackAssurance: Agent17RollbackAssuranceSnapshot;
  verificationPolicy: Agent17VerificationPolicySnapshot;
}

export function buildAgent17IntegritySeal(
  inputs: Agent17IntegritySealInputs
): Agent17IntegritySealSnapshot {
  const facets: Agent17IntegritySealSnapshot['facets'] = [];

  facets.push({
    id: 'flux_coherent',
    label: 'Flux coherence lane',
    intact: inputs.fluxIndex.band === 'coherent' || inputs.fluxIndex.band === 'noisy',
    weight: 30,
  });

  facets.push({
    id: 'assurance_score',
    label: 'Rollback assurance score',
    intact: inputs.rollbackAssurance.assuranceScore >= 45,
    weight: 25,
  });

  facets.push({
    id: 'verify_open',
    label: 'Verification policy open',
    intact: inputs.verificationPolicy.allowVerification,
    weight: 20,
  });

  facets.push({
    id: 'restore_clear',
    label: 'Restore signal clear',
    intact: !inputs.rollbackAssurance.restoreRecommended,
    weight: 15,
  });

  facets.push({
    id: 'policy_rules',
    label: 'Policy rules satisfied',
    intact: inputs.verificationPolicy.rules.filter(r => r.satisfied).length >= 2,
    weight: 10,
  });

  const weighted = facets.reduce(
    (n, f) => n + (f.intact ? 100 : 18) * (f.weight / 100),
    0
  );
  const totalWeight = facets.reduce((n, f) => n + f.weight, 0);
  const sealScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const breachedSignals =
    fluxIndexBlocksSeal(inputs.fluxIndex) ||
    inputs.rollbackAssurance.band === 'exposed' ||
    rollbackAssuranceNeedsRestore(inputs.rollbackAssurance);

  const band: Agent17IntegritySealSnapshot['band'] = breachedSignals
    ? 'breached'
    : sealScore >= 72 &&
        inputs.fluxIndex.band === 'coherent' &&
        !fluxIndexBlocksSeal(inputs.fluxIndex)
      ? 'trusted'
      : 'conditional';

  const commitAllowed =
    band === 'trusted' &&
    inputs.verificationPolicy.allowVerification &&
    !fluxIndexBlocksSeal(inputs.fluxIndex);

  return {
    sealScore,
    band,
    facets,
    fluxBand: inputs.fluxIndex.band,
    commitAllowed,
    headline: `Seal ${band} (${sealScore}/100) · ${facets.filter(f => f.intact).length}/${facets.length} facets`,
  };
}

export function integritySealBlocksCommit(snapshot: Agent17IntegritySealSnapshot): boolean {
  return snapshot.band === 'breached' || !snapshot.commitAllowed;
}
