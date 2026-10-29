import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TeamIntelligenceConsensusBand = 'anchored' | 'drifting' | 'reacceleration' | 'consensus_shock';

export interface TeamIntelligenceConsensusInflationAssessment {
  consensusBand: TeamIntelligenceConsensusBand;
  briefingIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Team intelligence consensus and briefing salience in CPI metadata (Agent 18). */
export function assessTeamIntelligenceConsensusInflation(input: {
  consensusInflationOutlook: 'disinflation' | 'stable' | 'reacceleration' | 'upside_risk';
  briefingUrgencyBand: 'routine' | 'elevated' | 'critical';
  crossDomainStressScore: number;
  teamForecastDeanchoringFlag: boolean;
  briefingInflationSalienceBand: 'muted' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TeamIntelligenceConsensusInflationAssessment {
  let pressure = 0;
  if (input.consensusInflationOutlook === 'upside_risk') {
    pressure += 0.28;
  } else if (input.consensusInflationOutlook === 'reacceleration') {
    pressure += 0.16;
  }
  if (input.briefingUrgencyBand === 'critical') {
    pressure += 0.2;
  } else if (input.briefingUrgencyBand === 'elevated') {
    pressure += 0.1;
  }
  pressure += finClamp(input.crossDomainStressScore, 0, 1) * 0.2;
  if (input.teamForecastDeanchoringFlag) {
    pressure += 0.14;
  }
  if (input.briefingInflationSalienceBand === 'critical') {
    pressure += 0.18;
  } else if (input.briefingInflationSalienceBand === 'elevated') {
    pressure += 0.09;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0039, 0, 1.05);
  const briefingIndex = finRound(100 + pressure * 15, 1);

  let consensusBand: TeamIntelligenceConsensusBand = 'anchored';
  if (pressure >= 0.56) consensusBand = 'consensus_shock';
  else if (pressure >= 0.36) consensusBand = 'reacceleration';
  else if (pressure >= 0.18) consensusBand = 'drifting';

  const inflationScoreNudge =
    consensusBand === 'consensus_shock'
      ? 0.088
      : consensusBand === 'reacceleration'
        ? 0.056
        : consensusBand === 'drifting'
          ? 0.026
          : 0;

  const narrative =
    consensusBand === 'consensus_shock' || consensusBand === 'reacceleration'
      ? 'Team intelligence consensus is lifting inflation outlook salience across briefings.'
      : consensusBand === 'drifting'
        ? 'Cross-domain stress drifting team inflation consensus upward.'
        : 'Team consensus inflation outlook anchored versus headline.';

  return { consensusBand, briefingIndex, inflationScoreNudge, narrative };
}

export function teamIntelligenceConsensusInflationScoreAdjustment(band: TeamIntelligenceConsensusBand): number {
  if (band === 'consensus_shock') return 4;
  if (band === 'reacceleration') return 3;
  if (band === 'drifting') return 2;
  return 0;
}
