/** Mirrors V9.4 NationalPriorityId vocabulary for assembly alignment. */

export type NationalPriorityId =
  | 'water_security'
  | 'energy_resilience'
  | 'freight_modernization'
  | 'supply_chain_security'
  | 'economic_diversification'
  | 'technology_competitiveness';

export type NationalPriorityUrgency = 'watch' | 'important' | 'urgent' | 'critical';

export type NationalPriorityAlignmentBand =
  | 'strong'
  | 'moderate'
  | 'weak'
  | 'none'
  | 'conflict';

export interface NationalPrioritySnapshot {
  id: NationalPriorityId;
  title: string;
  urgency: NationalPriorityUrgency;
  progress: number;
  isPrimary: boolean;
}

export interface NationalPriorityAlignment {
  score: number;
  band: NationalPriorityAlignmentBand;
  reason: string;
  priorityId: NationalPriorityId;
}

export interface NationalPriorityRankingContext {
  day: number;
  priorities: NationalPrioritySnapshot[];
  playerFocusId: NationalPriorityId | null;
}
