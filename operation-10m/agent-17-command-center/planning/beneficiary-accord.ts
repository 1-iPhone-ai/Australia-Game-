import type {
  Agent17BeneficiaryAccordSnapshot,
  Agent17EndowmentIndexSnapshot,
  Agent17InheritanceAccordSnapshot,
  Agent17PatrimonyIndexSnapshot,
} from '../types/command-center-types.ts';
import { endowmentIndexBlocksBeneficiary } from './endowment-index.ts';
import { inheritanceAccordBlocksEndowment } from './inheritance-accord.ts';
import { patrimonyIndexBlocksInheritance } from './patrimony-index.ts';

export interface Agent17BeneficiaryAccordInputs {
  endowmentIndex: Agent17EndowmentIndexSnapshot;
  inheritanceAccord: Agent17InheritanceAccordSnapshot;
  patrimonyIndex: Agent17PatrimonyIndexSnapshot;
}

export function buildAgent17BeneficiaryAccord(
  inputs: Agent17BeneficiaryAccordInputs
): Agent17BeneficiaryAccordSnapshot {
  const designations: Agent17BeneficiaryAccordSnapshot['designations'] = [];

  designations.push({
    id: 'endowment_funded',
    label: 'Endowment index endowment-funded',
    designated:
      inputs.endowmentIndex.endowmentFunded &&
      !endowmentIndexBlocksBeneficiary(inputs.endowmentIndex),
    weight: 30,
  });

  designations.push({
    id: 'endowment_band',
    label: 'Endowment funded or pending',
    designated:
      inputs.endowmentIndex.band === 'funded' || inputs.endowmentIndex.band === 'pending',
    weight: 25,
  });

  designations.push({
    id: 'inheritance_transmitted',
    label: 'Inheritance accord inheritance-ready',
    designated:
      inputs.inheritanceAccord.inheritanceTransmitted &&
      !inheritanceAccordBlocksEndowment(inputs.inheritanceAccord),
    weight: 20,
  });

  designations.push({
    id: 'patrimony_clear',
    label: 'Patrimony index not blocking inheritance',
    designated: !patrimonyIndexBlocksInheritance(inputs.patrimonyIndex),
    weight: 15,
  });

  designations.push({
    id: 'endowment_score',
    label: 'Endowment score headroom',
    designated: inputs.endowmentIndex.endowmentScore >= 5,
    weight: 10,
  });

  const weighted = designations.reduce(
    (n, d) => n + (d.designated ? 100 : 1) * (d.weight / 100),
    0
  );
  const totalWeight = designations.reduce((n, d) => n + d.weight, 0);
  const beneficiaryScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const vacatedSignals =
    endowmentIndexBlocksBeneficiary(inputs.endowmentIndex) ||
    inheritanceAccordBlocksEndowment(inputs.inheritanceAccord) ||
    patrimonyIndexBlocksInheritance(inputs.patrimonyIndex);

  const band: Agent17BeneficiaryAccordSnapshot['band'] = vacatedSignals
    ? 'vacated'
    : beneficiaryScore >= 42 &&
        inputs.endowmentIndex.band === 'funded' &&
        inputs.inheritanceAccord.band === 'transmitted'
      ? 'designated'
      : 'nominal';

  const beneficiaryDesignated =
    band === 'designated' &&
    inputs.endowmentIndex.endowmentFunded &&
    !patrimonyIndexBlocksInheritance(inputs.patrimonyIndex);

  return {
    beneficiaryScore,
    band,
    designations,
    endowmentBand: inputs.endowmentIndex.band,
    inheritanceBand: inputs.inheritanceAccord.band,
    beneficiaryDesignated,
    headline: `Beneficiary ${band} (${beneficiaryScore}/100) · ${designations.filter(d => d.designated).length}/${designations.length} designations`,
  };
}

export function beneficiaryAccordBlocksEndowment(
  snapshot: Agent17BeneficiaryAccordSnapshot
): boolean {
  return snapshot.band === 'vacated' || !snapshot.beneficiaryDesignated;
}
