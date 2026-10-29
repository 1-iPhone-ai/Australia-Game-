import type {
  Agent17BeneficiaryAccordSnapshot,
  Agent17FiduciaryIndexSnapshot,
  Agent17StewardAccordSnapshot,
  Agent17StewardshipIndexSnapshot,
} from '../types/command-center-types.ts';
import { beneficiaryAccordBlocksStewardship } from './beneficiary-accord.ts';
import { stewardAccordBlocksFiduciary } from './steward-accord.ts';
import { stewardshipIndexBlocksSteward } from './stewardship-index.ts';

export interface Agent17FiduciaryIndexInputs {
  stewardAccord: Agent17StewardAccordSnapshot;
  stewardshipIndex: Agent17StewardshipIndexSnapshot;
  beneficiaryAccord: Agent17BeneficiaryAccordSnapshot;
}

export function buildAgent17FiduciaryIndex(
  inputs: Agent17FiduciaryIndexInputs
): Agent17FiduciaryIndexSnapshot {
  const duties: Agent17FiduciaryIndexSnapshot['duties'] = [];

  duties.push({
    id: 'steward_commissioned',
    label: 'Steward accord steward-commissioned',
    bound:
      inputs.stewardAccord.stewardCommissioned &&
      !stewardAccordBlocksFiduciary(inputs.stewardAccord),
    weight: 30,
  });

  duties.push({
    id: 'steward_band',
    label: 'Steward commissioned or interim',
    bound:
      inputs.stewardAccord.band === 'commissioned' || inputs.stewardAccord.band === 'interim',
    weight: 25,
  });

  duties.push({
    id: 'stewardship_entrusted',
    label: 'Stewardship index stewardship-entrusted',
    bound:
      inputs.stewardshipIndex.stewardshipEntrusted &&
      !stewardshipIndexBlocksSteward(inputs.stewardshipIndex),
    weight: 20,
  });

  duties.push({
    id: 'beneficiary_clear',
    label: 'Beneficiary accord not blocking stewardship',
    bound: !beneficiaryAccordBlocksStewardship(inputs.beneficiaryAccord),
    weight: 15,
  });

  duties.push({
    id: 'steward_score',
    label: 'Steward score headroom',
    bound: inputs.stewardAccord.stewardScore >= 2,
    weight: 10,
  });

  const weighted = duties.reduce((n, d) => n + (d.bound ? 100 : 1) * (d.weight / 100), 0);
  const totalWeight = duties.reduce((n, d) => n + d.weight, 0);
  const fiduciaryScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const breachedSignals =
    stewardAccordBlocksFiduciary(inputs.stewardAccord) ||
    stewardshipIndexBlocksSteward(inputs.stewardshipIndex) ||
    beneficiaryAccordBlocksStewardship(inputs.beneficiaryAccord);

  const band: Agent17FiduciaryIndexSnapshot['band'] = breachedSignals
    ? 'breached'
    : fiduciaryScore >= 43 &&
        inputs.stewardAccord.band === 'commissioned' &&
        inputs.stewardshipIndex.band === 'entrusted'
      ? 'bound'
      : 'pending';

  const fiduciaryBound =
    band === 'bound' &&
    inputs.stewardAccord.stewardCommissioned &&
    !stewardAccordBlocksFiduciary(inputs.stewardAccord);

  return {
    fiduciaryScore,
    band,
    duties,
    stewardBand: inputs.stewardAccord.band,
    stewardshipBand: inputs.stewardshipIndex.band,
    fiduciaryBound,
    headline: `Fiduciary ${band} (${fiduciaryScore}/100) · ${duties.filter(d => d.bound).length}/${duties.length} duties`,
  };
}

export function fiduciaryIndexBlocksTrustee(snapshot: Agent17FiduciaryIndexSnapshot): boolean {
  return snapshot.band === 'breached' || !snapshot.fiduciaryBound;
}
