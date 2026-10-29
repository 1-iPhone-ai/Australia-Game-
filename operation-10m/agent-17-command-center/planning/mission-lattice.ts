import type {
  Agent17CadenceLatticeSnapshot,
  Agent17CampaignIndexSnapshot,
  Agent17MissionLatticeSnapshot,
  Agent17TheaterCommitmentSnapshot,
} from '../types/command-center-types.ts';
import { cadenceLatticeBlocksRun } from './cadence-lattice.ts';
import { campaignIndexBlocksLattice } from './campaign-index.ts';
import { theaterCommitmentBlocksTheater } from './theater-commitment.ts';

export interface Agent17MissionLatticeInputs {
  campaignIndex: Agent17CampaignIndexSnapshot;
  theaterCommitment: Agent17TheaterCommitmentSnapshot;
  cadenceLattice: Agent17CadenceLatticeSnapshot;
}

export function buildAgent17MissionLattice(
  inputs: Agent17MissionLatticeInputs
): Agent17MissionLatticeSnapshot {
  const rungs: Agent17MissionLatticeSnapshot['rungs'] = [];

  rungs.push({
    id: 'campaign_active',
    label: 'Campaign index campaign-ready',
    seated:
      inputs.campaignIndex.campaignReady && !campaignIndexBlocksLattice(inputs.campaignIndex),
    weight: 30,
  });

  rungs.push({
    id: 'campaign_band',
    label: 'Campaign active or forming',
    seated:
      inputs.campaignIndex.band === 'active' || inputs.campaignIndex.band === 'forming',
    weight: 25,
  });

  rungs.push({
    id: 'cadence_run',
    label: 'Cadence lattice allows run',
    seated: !cadenceLatticeBlocksRun(inputs.cadenceLattice),
    weight: 20,
  });

  rungs.push({
    id: 'theater_clear',
    label: 'Theater commitment not blocking',
    seated: !theaterCommitmentBlocksTheater(inputs.theaterCommitment),
    weight: 15,
  });

  rungs.push({
    id: 'cadence_score',
    label: 'Cadence lattice score headroom',
    seated: inputs.cadenceLattice.cadenceIndex >= 36,
    weight: 10,
  });

  const weighted = rungs.reduce(
    (n, r) => n + (r.seated ? 100 : 10) * (r.weight / 100),
    0
  );
  const totalWeight = rungs.reduce((n, r) => n + r.weight, 0);
  const latticeScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const collapsedSignals =
    campaignIndexBlocksLattice(inputs.campaignIndex) ||
    theaterCommitmentBlocksTheater(inputs.theaterCommitment) ||
    cadenceLatticeBlocksRun(inputs.cadenceLattice);

  const band: Agent17MissionLatticeSnapshot['band'] = collapsedSignals
    ? 'collapsed'
    : latticeScore >= 68 &&
        inputs.campaignIndex.band === 'active' &&
        !campaignIndexBlocksLattice(inputs.campaignIndex)
      ? 'locked'
      : 'flexible';

  const missionLocked =
    band === 'locked' &&
    inputs.campaignIndex.campaignReady &&
    !cadenceLatticeBlocksRun(inputs.cadenceLattice);

  return {
    latticeScore,
    band,
    rungs,
    campaignBand: inputs.campaignIndex.band,
    cadenceBand: inputs.cadenceLattice.band,
    missionLocked,
    headline: `Lattice ${band} (${latticeScore}/100) · ${rungs.filter(r => r.seated).length}/${rungs.length} rungs`,
  };
}

export function missionLatticeBlocksCampaign(snapshot: Agent17MissionLatticeSnapshot): boolean {
  return snapshot.band === 'collapsed' || !snapshot.missionLocked;
}
