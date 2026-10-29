import type {
  Agent17CanonIndexSnapshot,
  Agent17CharterIndexSnapshot,
  Agent17LegitimacyAccordSnapshot,
  Agent17SuccessionAccordSnapshot,
} from '../types/command-center-types.ts';
import { canonIndexBlocksLegitimacy } from './canon-index.ts';
import { legitimacyAccordBlocksCharter } from './legitimacy-accord.ts';
import { successionAccordBlocksCanon } from './succession-accord.ts';

export interface Agent17CharterIndexInputs {
  legitimacyAccord: Agent17LegitimacyAccordSnapshot;
  canonIndex: Agent17CanonIndexSnapshot;
  successionAccord: Agent17SuccessionAccordSnapshot;
}

export function buildAgent17CharterIndex(
  inputs: Agent17CharterIndexInputs
): Agent17CharterIndexSnapshot {
  const articles: Agent17CharterIndexSnapshot['articles'] = [];

  articles.push({
    id: 'legitimacy_settled',
    label: 'Legitimacy accord settled',
    enacted:
      inputs.legitimacyAccord.legitimacySettled &&
      !legitimacyAccordBlocksCharter(inputs.legitimacyAccord),
    weight: 30,
  });

  articles.push({
    id: 'legitimacy_band',
    label: 'Legitimacy settled or disputed',
    enacted:
      inputs.legitimacyAccord.band === 'settled' ||
      inputs.legitimacyAccord.band === 'disputed',
    weight: 25,
  });

  articles.push({
    id: 'canon_ratified',
    label: 'Canon index canon-ratified',
    enacted:
      inputs.canonIndex.canonRatified && !canonIndexBlocksLegitimacy(inputs.canonIndex),
    weight: 20,
  });

  articles.push({
    id: 'succession_clear',
    label: 'Succession accord not blocking canon',
    enacted: !successionAccordBlocksCanon(inputs.successionAccord),
    weight: 15,
  });

  articles.push({
    id: 'legitimacy_score',
    label: 'Legitimacy score headroom',
    enacted: inputs.legitimacyAccord.legitimacyScore >= 36,
    weight: 10,
  });

  const weighted = articles.reduce(
    (n, a) => n + (a.enacted ? 100 : 6) * (a.weight / 100),
    0
  );
  const totalWeight = articles.reduce((n, a) => n + a.weight, 0);
  const charterScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const repealedSignals =
    legitimacyAccordBlocksCharter(inputs.legitimacyAccord) ||
    canonIndexBlocksLegitimacy(inputs.canonIndex) ||
    successionAccordBlocksCanon(inputs.successionAccord);

  const band: Agent17CharterIndexSnapshot['band'] = repealedSignals
    ? 'repealed'
    : charterScore >= 60 &&
        inputs.legitimacyAccord.band === 'settled' &&
        inputs.canonIndex.band === 'ratified'
      ? 'enacted'
      : 'pending';

  const charterEnacted =
    band === 'enacted' &&
    inputs.legitimacyAccord.legitimacySettled &&
    !legitimacyAccordBlocksCharter(inputs.legitimacyAccord);

  return {
    charterScore,
    band,
    articles,
    legitimacyBand: inputs.legitimacyAccord.band,
    canonBand: inputs.canonIndex.band,
    charterEnacted,
    headline: `Charter ${band} (${charterScore}/100) · ${articles.filter(a => a.enacted).length}/${articles.length} articles`,
  };
}

export function charterIndexBlocksSanction(snapshot: Agent17CharterIndexSnapshot): boolean {
  return snapshot.band === 'repealed' || !snapshot.charterEnacted;
}
