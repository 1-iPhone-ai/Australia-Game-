import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TeamConsensusInflationBriefingDriftBand = 'anchored' | 'drifting' | 'deanchored' | 'consensus_shock';

export interface TeamConsensusInflationBriefingDriftAssessment {
  driftBand: TeamConsensusInflationBriefingDriftBand;
  briefingIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Team consensus and briefing inflation drift (Agent 18). */
export function assessTeamConsensusInflationBriefingDrift(input: {
  consensusInflationOutlook: 'disinflation' | 'stable' | 'reacceleration' | 'upside_risk';
  briefingUrgencyBand: 'routine' | 'elevated' | 'critical';
  crossDomainStressScore: number;
  teamBriefingInflationLatch: boolean;
  consensusDriftBand: 'anchored' | 'drifting' | 'unmoored';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TeamConsensusInflationBriefingDriftAssessment {
  let pressure = 0;
  if (input.consensusInflationOutlook === 'upside_risk') pressure += 0.22;
  else if (input.consensusInflationOutlook === 'reacceleration') pressure += 0.12;
  if (input.briefingUrgencyBand === 'critical') pressure += 0.18;
  else if (input.briefingUrgencyBand === 'elevated') pressure += 0.09;
  pressure += finClamp(input.crossDomainStressScore, 0, 1) * 0.2;
  if (input.teamBriefingInflationLatch) pressure += 0.13;
  if (input.consensusDriftBand === 'unmoored') pressure += 0.21;
  else if (input.consensusDriftBand === 'drifting') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const briefingIndex = finRound(100 + pressure * 16, 1);

  let driftBand: TeamConsensusInflationBriefingDriftBand = 'anchored';
  if (pressure >= 0.56) driftBand = 'consensus_shock';
  else if (pressure >= 0.36) driftBand = 'deanchored';
  else if (pressure >= 0.16) driftBand = 'drifting';

  const inflationScoreNudge =
    driftBand === 'consensus_shock'
      ? 0.091
      : driftBand === 'deanchored'
        ? 0.058
        : driftBand === 'drifting'
          ? 0.027
          : 0;

  const narrative =
    driftBand === 'consensus_shock' || driftBand === 'deanchored'
      ? 'Team briefing consensus drifting higher in CPI metadata.'
      : driftBand === 'drifting'
        ? 'Briefing inflation latch building under cross-domain stress.'
        : 'Team consensus inflation briefing anchored versus headline.';

  return { driftBand, briefingIndex, inflationScoreNudge, narrative };
}

export function teamConsensusInflationBriefingDriftScoreAdjustment(
  band: TeamConsensusInflationBriefingDriftBand,
): number {
  if (band === 'consensus_shock') return 4;
  if (band === 'deanchored') return 3;
  if (band === 'drifting') return 2;
  return 0;
}
