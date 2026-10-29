import type {
  Agent17BeneficiaryAccordSnapshot,
  Agent17EndowmentIndexSnapshot,
  Agent17StewardAccordSnapshot,
  Agent17StewardshipIndexSnapshot,
} from '../types/command-center-types.ts';
import { beneficiaryAccordBlocksStewardship } from './beneficiary-accord.ts';
import { endowmentIndexBlocksBeneficiary } from './endowment-index.ts';
import { stewardshipIndexBlocksSteward } from './stewardship-index.ts';

export interface Agent17StewardAccordInputs {
  stewardshipIndex: Agent17StewardshipIndexSnapshot;
  beneficiaryAccord: Agent17BeneficiaryAccordSnapshot;
  endowmentIndex: Agent17EndowmentIndexSnapshot;
}

export function buildAgent17StewardAccord(
  inputs: Agent17StewardAccordInputs
): Agent17StewardAccordSnapshot {
  const commissions: Agent17StewardAccordSnapshot['commissions'] = [];

  commissions.push({
    id: 'stewardship_entrusted',
    label: 'Stewardship index stewardship-entrusted',
    commissioned:
      inputs.stewardshipIndex.stewardshipEntrusted &&
      !stewardshipIndexBlocksSteward(inputs.stewardshipIndex),
    weight: 30,
  });

  commissions.push({
    id: 'stewardship_band',
    label: 'Stewardship entrusted or pending',
    commissioned:
      inputs.stewardshipIndex.band === 'entrusted' ||
      inputs.stewardshipIndex.band === 'pending',
    weight: 25,
  });

  commissions.push({
    id: 'beneficiary_designated',
    label: 'Beneficiary accord beneficiary-ready',
    commissioned:
      inputs.beneficiaryAccord.beneficiaryDesignated &&
      !beneficiaryAccordBlocksStewardship(inputs.beneficiaryAccord),
    weight: 20,
  });

  commissions.push({
    id: 'endowment_clear',
    label: 'Endowment index not blocking beneficiary',
    commissioned: !endowmentIndexBlocksBeneficiary(inputs.endowmentIndex),
    weight: 15,
  });

  commissions.push({
    id: 'stewardship_score',
    label: 'Stewardship score headroom',
    commissioned: inputs.stewardshipIndex.stewardshipScore >= 3,
    weight: 10,
  });

  const weighted = commissions.reduce(
    (n, c) => n + (c.commissioned ? 100 : 1) * (c.weight / 100),
    0
  );
  const totalWeight = commissions.reduce((n, c) => n + c.weight, 0);
  const stewardScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const recalledSignals =
    stewardshipIndexBlocksSteward(inputs.stewardshipIndex) ||
    beneficiaryAccordBlocksStewardship(inputs.beneficiaryAccord) ||
    endowmentIndexBlocksBeneficiary(inputs.endowmentIndex);

  const band: Agent17StewardAccordSnapshot['band'] = recalledSignals
    ? 'recalled'
    : stewardScore >= 41 &&
        inputs.stewardshipIndex.band === 'entrusted' &&
        inputs.beneficiaryAccord.band === 'designated'
      ? 'commissioned'
      : 'interim';

  const stewardCommissioned =
    band === 'commissioned' &&
    inputs.stewardshipIndex.stewardshipEntrusted &&
    !endowmentIndexBlocksBeneficiary(inputs.endowmentIndex);

  return {
    stewardScore,
    band,
    commissions,
    stewardshipBand: inputs.stewardshipIndex.band,
    beneficiaryBand: inputs.beneficiaryAccord.band,
    stewardCommissioned,
    headline: `Steward ${band} (${stewardScore}/100) · ${commissions.filter(c => c.commissioned).length}/${commissions.length} commissions`,
  };
}

export function stewardAccordBlocksStewardship(snapshot: Agent17StewardAccordSnapshot): boolean {
  return snapshot.band === 'recalled' || !snapshot.stewardCommissioned;
}

export function stewardAccordBlocksFiduciary(snapshot: Agent17StewardAccordSnapshot): boolean {
  return stewardAccordBlocksStewardship(snapshot);
}
