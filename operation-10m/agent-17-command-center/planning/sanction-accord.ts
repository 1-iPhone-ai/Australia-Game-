import type {
  Agent17CanonIndexSnapshot,
  Agent17CharterIndexSnapshot,
  Agent17LegitimacyAccordSnapshot,
  Agent17SanctionAccordSnapshot,
} from '../types/command-center-types.ts';
import { canonIndexBlocksLegitimacy } from './canon-index.ts';
import { charterIndexBlocksSanction } from './charter-index.ts';
import { legitimacyAccordBlocksCharter } from './legitimacy-accord.ts';

export interface Agent17SanctionAccordInputs {
  charterIndex: Agent17CharterIndexSnapshot;
  legitimacyAccord: Agent17LegitimacyAccordSnapshot;
  canonIndex: Agent17CanonIndexSnapshot;
}

export function buildAgent17SanctionAccord(
  inputs: Agent17SanctionAccordInputs
): Agent17SanctionAccordSnapshot {
  const measures: Agent17SanctionAccordSnapshot['measures'] = [];

  measures.push({
    id: 'charter_enacted',
    label: 'Charter index charter-enacted',
    binding:
      inputs.charterIndex.charterEnacted && !charterIndexBlocksSanction(inputs.charterIndex),
    weight: 30,
  });

  measures.push({
    id: 'charter_band',
    label: 'Charter enacted or pending',
    binding:
      inputs.charterIndex.band === 'enacted' || inputs.charterIndex.band === 'pending',
    weight: 25,
  });

  measures.push({
    id: 'legitimacy_settled',
    label: 'Legitimacy accord settled-ready',
    binding:
      inputs.legitimacyAccord.legitimacySettled &&
      !legitimacyAccordBlocksCharter(inputs.legitimacyAccord),
    weight: 20,
  });

  measures.push({
    id: 'canon_clear',
    label: 'Canon index not blocking legitimacy',
    binding: !canonIndexBlocksLegitimacy(inputs.canonIndex),
    weight: 15,
  });

  measures.push({
    id: 'charter_score',
    label: 'Charter score headroom',
    binding: inputs.charterIndex.charterScore >= 35,
    weight: 10,
  });

  const weighted = measures.reduce(
    (n, m) => n + (m.binding ? 100 : 5) * (m.weight / 100),
    0
  );
  const totalWeight = measures.reduce((n, m) => n + m.weight, 0);
  const sanctionScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const liftedSignals =
    charterIndexBlocksSanction(inputs.charterIndex) ||
    legitimacyAccordBlocksCharter(inputs.legitimacyAccord) ||
    canonIndexBlocksLegitimacy(inputs.canonIndex);

  const band: Agent17SanctionAccordSnapshot['band'] = liftedSignals
    ? 'lifted'
    : sanctionScore >= 57 &&
        inputs.charterIndex.band === 'enacted' &&
        inputs.legitimacyAccord.band === 'settled'
      ? 'binding'
      : 'suspended';

  const sanctionBinding =
    band === 'binding' &&
    inputs.charterIndex.charterEnacted &&
    !canonIndexBlocksLegitimacy(inputs.canonIndex);

  return {
    sanctionScore,
    band,
    measures,
    charterBand: inputs.charterIndex.band,
    legitimacyBand: inputs.legitimacyAccord.band,
    sanctionBinding,
    headline: `Sanction ${band} (${sanctionScore}/100) · ${measures.filter(m => m.binding).length}/${measures.length} measures`,
  };
}

export function sanctionAccordBlocksCharter(snapshot: Agent17SanctionAccordSnapshot): boolean {
  return snapshot.band === 'lifted' || !snapshot.sanctionBinding;
}

export function sanctionAccordBlocksStatute(snapshot: Agent17SanctionAccordSnapshot): boolean {
  return snapshot.band === 'lifted' || !snapshot.sanctionBinding;
}
