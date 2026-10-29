import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TeamBriefingConsensusInflationUnmooringBand = 'stable' | 'drifting' | 'unmoored' | 'consensus_rupture';

export interface TeamBriefingConsensusInflationUnmooringAssessment {
  unmooringBand: TeamBriefingConsensusInflationUnmooringBand;
  consensusIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Team briefing consensus inflation unmooring (Agent 18, round 41). */
export function assessTeamBriefingConsensusInflationUnmooring(input: {
  consensusInflationOutlook: 'disinflation' | 'stable' | 'reacceleration' | 'upside_risk';
  briefingUrgencyBand: 'routine' | 'elevated' | 'critical';
  wave41TeamConsensusLatch: boolean;
  briefingConsensusUnmoorBand: 'anchored' | 'drifting' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TeamBriefingConsensusInflationUnmooringAssessment {
  let pressure = 0;
  if (input.consensusInflationOutlook === 'upside_risk') pressure += 0.21;
  else if (input.consensusInflationOutlook === 'reacceleration') pressure += 0.11;
  if (input.briefingUrgencyBand === 'critical') pressure += 0.17;
  else if (input.briefingUrgencyBand === 'elevated') pressure += 0.08;
  if (input.wave41TeamConsensusLatch) pressure += 0.13;
  if (input.briefingConsensusUnmoorBand === 'ruptured') pressure += 0.22;
  else if (input.briefingConsensusUnmoorBand === 'drifting') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const consensusIndex = finRound(100 + pressure * 15, 1);

  let unmooringBand: TeamBriefingConsensusInflationUnmooringBand = 'stable';
  if (pressure >= 0.57) unmooringBand = 'consensus_rupture';
  else if (pressure >= 0.37) unmooringBand = 'unmoored';
  else if (pressure >= 0.16) unmooringBand = 'drifting';

  const inflationScoreNudge =
    unmooringBand === 'consensus_rupture'
      ? 0.09
      : unmooringBand === 'unmoored'
        ? 0.057
        : unmooringBand === 'drifting'
          ? 0.026
          : 0;

  const narrative =
    unmooringBand === 'consensus_rupture' || unmooringBand === 'unmoored'
      ? 'Team briefing consensus unmooring feeding CPI metadata drift.'
      : unmooringBand === 'drifting'
        ? 'Briefing consensus latch building under urgency stress.'
        : 'Team briefing consensus stable versus headline CPI.';

  return { unmooringBand, consensusIndex, inflationScoreNudge, narrative };
}

export function teamBriefingConsensusInflationUnmooringScoreAdjustment(
  band: TeamBriefingConsensusInflationUnmooringBand,
): number {
  if (band === 'consensus_rupture') return 4;
  if (band === 'unmoored') return 3;
  if (band === 'drifting') return 2;
  return 0;
}
