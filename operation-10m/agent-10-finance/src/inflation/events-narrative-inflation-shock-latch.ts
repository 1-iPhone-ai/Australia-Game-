import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type EventsNarrativeInflationShockLatchBand = 'muted' | 'building' | 'latched' | 'shock_crisis';

export interface EventsNarrativeInflationShockLatchAssessment {
  latchBand: EventsNarrativeInflationShockLatchBand;
  shockIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Events narrative inflation shock latch (Agent 05, round 45). */
export function assessEventsNarrativeInflationShockLatch(input: {
  inflationShockEventActive: boolean;
  supplyDisruptionSeverity: 'none' | 'localized' | 'national';
  wave45EventShockLatch: boolean;
  narrativeShockEntrenchBand: 'none' | 'building' | 'entrenched';
  inflationBand: InflationConditionsBand;
  turn: number;
}): EventsNarrativeInflationShockLatchAssessment {
  let pressure = 0;
  if (input.inflationShockEventActive) pressure += 0.2;
  if (input.supplyDisruptionSeverity === 'national') pressure += 0.18;
  else if (input.supplyDisruptionSeverity === 'localized') pressure += 0.09;
  if (input.wave45EventShockLatch) pressure += 0.14;
  if (input.narrativeShockEntrenchBand === 'entrenched') pressure += 0.22;
  else if (input.narrativeShockEntrenchBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const shockIndex = finRound(100 + pressure * 16, 1);

  let latchBand: EventsNarrativeInflationShockLatchBand = 'muted';
  if (pressure >= 0.58) latchBand = 'shock_crisis';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'shock_crisis'
      ? 0.093
      : latchBand === 'latched'
        ? 0.059
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'shock_crisis' || latchBand === 'latched'
      ? 'Events narrative shock latch elevating CPI metadata persistence.'
      : latchBand === 'building'
        ? 'Staged shock latch building under supply disruption.'
        : 'Events narrative shock latch muted versus headline CPI.';

  return { latchBand, shockIndex, inflationScoreNudge, narrative };
}

export function eventsNarrativeInflationShockLatchScoreAdjustment(
  band: EventsNarrativeInflationShockLatchBand,
): number {
  if (band === 'shock_crisis') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}
