import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type EventsNarrativeInflationPersistenceBand = 'muted' | 'building' | 'active' | 'entrenched';

export interface EventsNarrativeInflationPersistenceAssessment {
  persistenceBand: EventsNarrativeInflationPersistenceBand;
  eventsIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Dynamic events and supply shock inflation persistence (Agent 05). */
export function assessEventsNarrativeInflationPersistence(input: {
  inflationShockEventActive: boolean;
  supplyDisruptionSeverity: 'none' | 'localized' | 'national';
  confidenceShockBand: 'calm' | 'uneasy' | 'severe';
  dynamicEventInflationLatch: boolean;
  supplyShockPersistenceBand: 'none' | 'building' | 'entrenched';
  inflationBand: InflationConditionsBand;
  turn: number;
}): EventsNarrativeInflationPersistenceAssessment {
  let pressure = 0;
  if (input.inflationShockEventActive) {
    pressure += 0.2;
  }
  if (input.supplyDisruptionSeverity === 'national') {
    pressure += 0.18;
  } else if (input.supplyDisruptionSeverity === 'localized') {
    pressure += 0.09;
  }
  if (input.confidenceShockBand === 'severe') {
    pressure += 0.16;
  } else if (input.confidenceShockBand === 'uneasy') {
    pressure += 0.08;
  }
  if (input.dynamicEventInflationLatch) {
    pressure += 0.14;
  }
  if (input.supplyShockPersistenceBand === 'entrenched') {
    pressure += 0.22;
  } else if (input.supplyShockPersistenceBand === 'building') {
    pressure += 0.11;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const eventsIndex = finRound(100 + pressure * 16, 1);

  let persistenceBand: EventsNarrativeInflationPersistenceBand = 'muted';
  if (pressure >= 0.55) persistenceBand = 'entrenched';
  else if (pressure >= 0.35) persistenceBand = 'active';
  else if (pressure >= 0.16) persistenceBand = 'building';

  const inflationScoreNudge =
    persistenceBand === 'entrenched'
      ? 0.09
      : persistenceBand === 'active'
        ? 0.056
        : persistenceBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    persistenceBand === 'entrenched' || persistenceBand === 'active'
      ? 'Event narrative supply shocks persisting into CPI metadata.'
      : persistenceBand === 'building'
        ? 'Dynamic event inflation latch building across turns.'
        : 'Events inflation persistence muted versus headline CPI.';

  return { persistenceBand, eventsIndex, inflationScoreNudge, narrative };
}

export function eventsNarrativeInflationPersistenceScoreAdjustment(
  band: EventsNarrativeInflationPersistenceBand,
): number {
  if (band === 'entrenched') return 4;
  if (band === 'active') return 3;
  if (band === 'building') return 2;
  return 0;
}
