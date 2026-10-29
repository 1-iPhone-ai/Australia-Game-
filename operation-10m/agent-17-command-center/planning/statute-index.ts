import type {
  Agent17CharterIndexSnapshot,
  Agent17LegitimacyAccordSnapshot,
  Agent17SanctionAccordSnapshot,
  Agent17StatuteIndexSnapshot,
} from '../types/command-center-types.ts';
import { charterIndexBlocksSanction } from './charter-index.ts';
import { legitimacyAccordBlocksCharter } from './legitimacy-accord.ts';
import { sanctionAccordBlocksStatute } from './sanction-accord.ts';

export interface Agent17StatuteIndexInputs {
  sanctionAccord: Agent17SanctionAccordSnapshot;
  charterIndex: Agent17CharterIndexSnapshot;
  legitimacyAccord: Agent17LegitimacyAccordSnapshot;
}

export function buildAgent17StatuteIndex(
  inputs: Agent17StatuteIndexInputs
): Agent17StatuteIndexSnapshot {
  const sections: Agent17StatuteIndexSnapshot['sections'] = [];

  sections.push({
    id: 'sanction_binding',
    label: 'Sanction accord binding',
    codified:
      inputs.sanctionAccord.sanctionBinding &&
      !sanctionAccordBlocksStatute(inputs.sanctionAccord),
    weight: 30,
  });

  sections.push({
    id: 'sanction_band',
    label: 'Sanction binding or suspended',
    codified:
      inputs.sanctionAccord.band === 'binding' ||
      inputs.sanctionAccord.band === 'suspended',
    weight: 25,
  });

  sections.push({
    id: 'charter_enacted',
    label: 'Charter index charter-enacted',
    codified:
      inputs.charterIndex.charterEnacted && !charterIndexBlocksSanction(inputs.charterIndex),
    weight: 20,
  });

  sections.push({
    id: 'legitimacy_clear',
    label: 'Legitimacy accord not blocking charter',
    codified: !legitimacyAccordBlocksCharter(inputs.legitimacyAccord),
    weight: 15,
  });

  sections.push({
    id: 'sanction_score',
    label: 'Sanction score headroom',
    codified: inputs.sanctionAccord.sanctionScore >= 34,
    weight: 10,
  });

  const weighted = sections.reduce(
    (n, s) => n + (s.codified ? 100 : 6) * (s.weight / 100),
    0
  );
  const totalWeight = sections.reduce((n, s) => n + s.weight, 0);
  const statuteScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const struckSignals =
    sanctionAccordBlocksStatute(inputs.sanctionAccord) ||
    charterIndexBlocksSanction(inputs.charterIndex) ||
    legitimacyAccordBlocksCharter(inputs.legitimacyAccord);

  const band: Agent17StatuteIndexSnapshot['band'] = struckSignals
    ? 'struck'
    : statuteScore >= 59 &&
        inputs.sanctionAccord.band === 'binding' &&
        inputs.charterIndex.band === 'enacted'
      ? 'codified'
      : 'drafting';

  const statuteCodified =
    band === 'codified' &&
    inputs.sanctionAccord.sanctionBinding &&
    !sanctionAccordBlocksStatute(inputs.sanctionAccord);

  return {
    statuteScore,
    band,
    sections,
    sanctionBand: inputs.sanctionAccord.band,
    charterBand: inputs.charterIndex.band,
    statuteCodified,
    headline: `Statute ${band} (${statuteScore}/100) · ${sections.filter(s => s.codified).length}/${sections.length} sections`,
  };
}

export function statuteIndexBlocksCompliance(snapshot: Agent17StatuteIndexSnapshot): boolean {
  return snapshot.band === 'struck' || !snapshot.statuteCodified;
}
