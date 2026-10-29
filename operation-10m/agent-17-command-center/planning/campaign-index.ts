import type {
  Agent17ContinuityBridgeSnapshot,
  Agent17CampaignIndexSnapshot,
  Agent17PulseIndexSnapshot,
  Agent17TheaterCommitmentSnapshot,
} from '../types/command-center-types.ts';
import { pulseIndexBlocksContinuity } from './pulse-index.ts';
import { theaterCommitmentBlocksTheater } from './theater-commitment.ts';

export interface Agent17CampaignIndexInputs {
  theaterCommitment: Agent17TheaterCommitmentSnapshot;
  pulseIndex: Agent17PulseIndexSnapshot;
  continuityBridge: Agent17ContinuityBridgeSnapshot;
}

export function buildAgent17CampaignIndex(
  inputs: Agent17CampaignIndexInputs
): Agent17CampaignIndexSnapshot {
  const vectors: Agent17CampaignIndexSnapshot['vectors'] = [];

  vectors.push({
    id: 'theater_bound',
    label: 'Theater commitment bound',
    engaged:
      inputs.theaterCommitment.theaterBound &&
      !theaterCommitmentBlocksTheater(inputs.theaterCommitment),
    weight: 30,
  });

  vectors.push({
    id: 'theater_band',
    label: 'Theater bound or provisional',
    pledged:
      inputs.theaterCommitment.band === 'bound' ||
      inputs.theaterCommitment.band === 'provisional',
    weight: 25,
  });

  vectors.push({
    id: 'pulse_steady',
    label: 'Pulse index not flat',
    engaged: inputs.pulseIndex.band !== 'flat' && !pulseIndexBlocksContinuity(inputs.pulseIndex),
    weight: 20,
  });

  vectors.push({
    id: 'continuity_linked',
    label: 'Continuity bridge connected',
    engaged:
      inputs.continuityBridge.band !== 'broken' &&
      inputs.continuityBridge.links.filter(l => l.connected).length >= 3,
    weight: 15,
  });

  vectors.push({
    id: 'pulse_score',
    label: 'Pulse score headroom',
    engaged: inputs.pulseIndex.pulseIndex >= 40,
    weight: 10,
  });

  const weighted = vectors.reduce(
    (n, v) => n + (v.engaged ? 100 : 12) * (v.weight / 100),
    0
  );
  const totalWeight = vectors.reduce((n, v) => n + v.weight, 0);
  const campaignScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const stalledSignals =
    theaterCommitmentBlocksTheater(inputs.theaterCommitment) ||
    inputs.theaterCommitment.band === 'withdrawn' ||
    pulseIndexBlocksContinuity(inputs.pulseIndex);

  const band: Agent17CampaignIndexSnapshot['band'] = stalledSignals
    ? 'stalled'
    : campaignScore >= 70 &&
        inputs.theaterCommitment.band === 'bound' &&
        !theaterCommitmentBlocksTheater(inputs.theaterCommitment)
      ? 'active'
      : 'forming';

  const campaignReady =
    band === 'active' &&
    inputs.theaterCommitment.theaterBound &&
    !theaterCommitmentBlocksTheater(inputs.theaterCommitment);

  return {
    campaignScore,
    band,
    vectors,
    theaterBand: inputs.theaterCommitment.band,
    pulseBand: inputs.pulseIndex.band,
    campaignReady,
    headline: `Campaign ${band} (${campaignScore}/100) · ${vectors.filter(v => v.engaged).length}/${vectors.length} vectors`,
  };
}

export function campaignIndexBlocksLattice(snapshot: Agent17CampaignIndexSnapshot): boolean {
  return snapshot.band === 'stalled' || !snapshot.campaignReady;
}
