import type {
  Agent17CovenantGateSnapshot,
  Agent17DoctrineAccordSnapshot,
  Agent17MissionLatticeSnapshot,
  Agent17StrategicIndexSnapshot,
} from '../types/command-center-types.ts';
import { covenantGateBlocksOps } from './covenant-gate.ts';
import { missionLatticeBlocksCampaign } from './mission-lattice.ts';
import { strategicIndexBlocksDoctrine } from './strategic-index.ts';

export interface Agent17DoctrineAccordInputs {
  strategicIndex: Agent17StrategicIndexSnapshot;
  missionLattice: Agent17MissionLatticeSnapshot;
  covenantGate: Agent17CovenantGateSnapshot;
}

export function buildAgent17DoctrineAccord(
  inputs: Agent17DoctrineAccordInputs
): Agent17DoctrineAccordSnapshot {
  const articles: Agent17DoctrineAccordSnapshot['articles'] = [];

  articles.push({
    id: 'strategic_coherent',
    label: 'Strategic index coherent',
    ratified:
      inputs.strategicIndex.strategicReady && !strategicIndexBlocksDoctrine(inputs.strategicIndex),
    weight: 30,
  });

  articles.push({
    id: 'strategic_band',
    label: 'Strategic coherent or forming',
    ratified:
      inputs.strategicIndex.band === 'coherent' || inputs.strategicIndex.band === 'forming',
    weight: 25,
  });

  articles.push({
    id: 'covenant_upheld',
    label: 'Covenant gate allows ops',
    ratified: inputs.covenantGate.opsAllowed && !covenantGateBlocksOps(inputs.covenantGate),
    weight: 20,
  });

  articles.push({
    id: 'lattice_mission',
    label: 'Mission lattice not blocking campaign',
    ratified: !missionLatticeBlocksCampaign(inputs.missionLattice),
    weight: 15,
  });

  articles.push({
    id: 'covenant_score',
    label: 'Covenant score headroom',
    ratified: inputs.covenantGate.covenantScore >= 35,
    weight: 10,
  });

  const weighted = articles.reduce(
    (n, a) => n + (a.ratified ? 100 : 10) * (a.weight / 100),
    0
  );
  const totalWeight = articles.reduce((n, a) => n + a.weight, 0);
  const doctrineScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const voidSignals =
    strategicIndexBlocksDoctrine(inputs.strategicIndex) ||
    covenantGateBlocksOps(inputs.covenantGate) ||
    missionLatticeBlocksCampaign(inputs.missionLattice);

  const band: Agent17DoctrineAccordSnapshot['band'] = voidSignals
    ? 'void'
    : doctrineScore >= 67 &&
        inputs.strategicIndex.band === 'coherent' &&
        inputs.covenantGate.band === 'upheld'
      ? 'ratified'
      : 'provisional';

  const doctrineRatified =
    band === 'ratified' &&
    inputs.strategicIndex.strategicReady &&
    !covenantGateBlocksOps(inputs.covenantGate);

  return {
    doctrineScore,
    band,
    articles,
    strategicBand: inputs.strategicIndex.band,
    covenantBand: inputs.covenantGate.band,
    doctrineRatified,
    headline: `Doctrine ${band} (${doctrineScore}/100) · ${articles.filter(a => a.ratified).length}/${articles.length} articles`,
  };
}

export function doctrineAccordBlocksCommand(snapshot: Agent17DoctrineAccordSnapshot): boolean {
  return snapshot.band === 'void' || !snapshot.doctrineRatified;
}
