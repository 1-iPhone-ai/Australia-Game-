import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type EventsStagedInflationShockPersistenceBand =
  | 'muted'
  | 'building'
  | 'entrenched'
  | 'narrative_cascade';

export interface EventsStagedInflationShockPersistenceAssessment {
  persistenceBand: EventsStagedInflationShockPersistenceBand;
  shockIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Staged dynamic events inflation shock persistence (Agent 05). */
export function assessEventsStagedInflationShockPersistence(input: {
  inflationShockEventActive: boolean;
  supplyDisruptionSeverity: 'none' | 'localized' | 'national';
  confidenceShockBand: 'calm' | 'uneasy' | 'severe';
  wave37EventInflationLatch: boolean;
  stagedShockPersistenceBand: 'none' | 'building' | 'entrenched';
  inflationBand: InflationConditionsBand;
  turn: number;
}): EventsStagedInflationShockPersistenceAssessment {
  let pressure = 0;
  if (input.inflationShockEventActive) pressure += 0.2;
  if (input.supplyDisruptionSeverity === 'national') pressure += 0.18;
  else if (input.supplyDisruptionSeverity === 'localized') pressure += 0.09;
  if (input.confidenceShockBand === 'severe') pressure += 0.16;
  else if (input.confidenceShockBand === 'uneasy') pressure += 0.08;
  if (input.wave37EventInflationLatch) pressure += 0.12;
  if (input.stagedShockPersistenceBand === 'entrenched') pressure += 0.22;
  else if (input.stagedShockPersistenceBand === 'building') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const shockIndex = finRound(100 + pressure * 17, 1);

  let persistenceBand: EventsStagedInflationShockPersistenceBand = 'muted';
  if (pressure >= 0.58) persistenceBand = 'narrative_cascade';
  else if (pressure >= 0.38) persistenceBand = 'entrenched';
  else if (pressure >= 0.17) persistenceBand = 'building';

  const inflationScoreNudge =
    persistenceBand === 'narrative_cascade'
      ? 0.092
      : persistenceBand === 'entrenched'
        ? 0.058
        : persistenceBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    persistenceBand === 'narrative_cascade' || persistenceBand === 'entrenched'
      ? 'Staged event shock persistence feeding CPI narrative metadata.'
      : persistenceBand === 'building'
        ? 'Dynamic event inflation latch building under supply disruption.'
        : 'Events shock persistence muted versus headline CPI.';

  return { persistenceBand, shockIndex, inflationScoreNudge, narrative };
}

export function eventsStagedInflationShockPersistenceScoreAdjustment(
  band: EventsStagedInflationShockPersistenceBand,
): number {
  if (band === 'narrative_cascade') return 4;
  if (band === 'entrenched') return 3;
  if (band === 'building') return 2;
  return 0;
}
