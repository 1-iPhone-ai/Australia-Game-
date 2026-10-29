import type {
  Agent17BeneficiaryAccordSnapshot,
  Agent17EndowmentIndexSnapshot,
  Agent17InheritanceAccordSnapshot,
  Agent17StewardshipIndexSnapshot,
} from '../types/command-center-types.ts';
import { beneficiaryAccordBlocksStewardship } from './beneficiary-accord.ts';
import { endowmentIndexBlocksBeneficiary } from './endowment-index.ts';
import { inheritanceAccordBlocksEndowment } from './inheritance-accord.ts';

export interface Agent17StewardshipIndexInputs {
  beneficiaryAccord: Agent17BeneficiaryAccordSnapshot;
  endowmentIndex: Agent17EndowmentIndexSnapshot;
  inheritanceAccord: Agent17InheritanceAccordSnapshot;
}

export function buildAgent17StewardshipIndex(
  inputs: Agent17StewardshipIndexInputs
): Agent17StewardshipIndexSnapshot {
  const mandates: Agent17StewardshipIndexSnapshot['mandates'] = [];

  mandates.push({
    id: 'beneficiary_designated',
    label: 'Beneficiary accord beneficiary-designated',
    entrusted:
      inputs.beneficiaryAccord.beneficiaryDesignated &&
      !beneficiaryAccordBlocksStewardship(inputs.beneficiaryAccord),
    weight: 30,
  });

  mandates.push({
    id: 'beneficiary_band',
    label: 'Beneficiary designated or nominal',
    entrusted:
      inputs.beneficiaryAccord.band === 'designated' ||
      inputs.beneficiaryAccord.band === 'nominal',
    weight: 25,
  });

  mandates.push({
    id: 'endowment_funded',
    label: 'Endowment index endowment-funded',
    entrusted:
      inputs.endowmentIndex.endowmentFunded &&
      !endowmentIndexBlocksBeneficiary(inputs.endowmentIndex),
    weight: 20,
  });

  mandates.push({
    id: 'inheritance_clear',
    label: 'Inheritance accord not blocking endowment',
    entrusted: !inheritanceAccordBlocksEndowment(inputs.inheritanceAccord),
    weight: 15,
  });

  mandates.push({
    id: 'beneficiary_score',
    label: 'Beneficiary score headroom',
    entrusted: inputs.beneficiaryAccord.beneficiaryScore >= 4,
    weight: 10,
  });

  const weighted = mandates.reduce(
    (n, m) => n + (m.entrusted ? 100 : 1) * (m.weight / 100),
    0
  );
  const totalWeight = mandates.reduce((n, m) => n + m.weight, 0);
  const stewardshipScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const abdicatedSignals =
    beneficiaryAccordBlocksStewardship(inputs.beneficiaryAccord) ||
    endowmentIndexBlocksBeneficiary(inputs.endowmentIndex) ||
    inheritanceAccordBlocksEndowment(inputs.inheritanceAccord);

  const band: Agent17StewardshipIndexSnapshot['band'] = abdicatedSignals
    ? 'abdicated'
    : stewardshipScore >= 44 &&
        inputs.beneficiaryAccord.band === 'designated' &&
        inputs.endowmentIndex.band === 'funded'
      ? 'entrusted'
      : 'pending';

  const stewardshipEntrusted =
    band === 'entrusted' &&
    inputs.beneficiaryAccord.beneficiaryDesignated &&
    !beneficiaryAccordBlocksStewardship(inputs.beneficiaryAccord);

  return {
    stewardshipScore,
    band,
    mandates,
    beneficiaryBand: inputs.beneficiaryAccord.band,
    endowmentBand: inputs.endowmentIndex.band,
    stewardshipEntrusted,
    headline: `Stewardship ${band} (${stewardshipScore}/100) · ${mandates.filter(m => m.entrusted).length}/${mandates.length} mandates`,
  };
}

export function stewardshipIndexBlocksSteward(
  snapshot: Agent17StewardshipIndexSnapshot
): boolean {
  return snapshot.band === 'abdicated' || !snapshot.stewardshipEntrusted;
}
