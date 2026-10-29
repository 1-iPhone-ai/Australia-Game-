import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type DynamicEventsInflationSpilloverBand = 'muted' | 'building' | 'active' | 'cascade';

export interface DynamicEventsInflationSpilloverAssessment {
  spilloverBand: DynamicEventsInflationSpilloverBand;
  eventIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Dynamic narrative events spilling into macro CPI metadata (Agent 05). */
export function assessDynamicEventsInflationSpillover(input: {
  inflationShockEventActive: boolean;
  supplyDisruptionSeverity: 'none' | 'localized' | 'national';
  confidenceShockBand: 'calm' | 'uneasy' | 'severe';
  stagedEventCostShockBand: 'none' | 'emerging' | 'active' | 'cascade';
  inflationBand: InflationConditionsBand;
  turn: number;
}): DynamicEventsInflationSpilloverAssessment {
  let pressure = 0;
  if (input.inflationShockEventActive) {
    pressure += 0.26;
  }
  if (input.supplyDisruptionSeverity === 'national') {
    pressure += 0.24;
  } else if (input.supplyDisruptionSeverity === 'localized') {
    pressure += 0.11;
  }
  if (input.confidenceShockBand === 'severe') {
    pressure += 0.2;
  } else if (input.confidenceShockBand === 'uneasy') {
    pressure += 0.09;
  }
  if (input.stagedEventCostShockBand === 'cascade') {
    pressure += 0.22;
  } else if (input.stagedEventCostShockBand === 'active') {
    pressure += 0.14;
  } else if (input.stagedEventCostShockBand === 'emerging') {
    pressure += 0.07;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const eventIndex = finRound(100 + pressure * 19, 1);

  let spilloverBand: DynamicEventsInflationSpilloverBand = 'muted';
  if (pressure >= 0.58) spilloverBand = 'cascade';
  else if (pressure >= 0.38) spilloverBand = 'active';
  else if (pressure >= 0.19) spilloverBand = 'building';

  const inflationScoreNudge =
    spilloverBand === 'cascade'
      ? 0.09
      : spilloverBand === 'active'
        ? 0.06
        : spilloverBand === 'building'
          ? 0.03
          : 0;

  const narrative =
    spilloverBand === 'cascade' || spilloverBand === 'active'
      ? 'Dynamic events are spilling into CPI through staged cost shocks and supply disruption.'
      : spilloverBand === 'building'
        ? 'Event-driven inflation spillover building as confidence and supply flags tighten.'
        : 'Dynamic events inflation spillover muted versus headline.';

  return { spilloverBand, eventIndex, inflationScoreNudge, narrative };
}

export function dynamicEventsInflationSpilloverScoreAdjustment(band: DynamicEventsInflationSpilloverBand): number {
  if (band === 'cascade') return 4;
  if (band === 'active') return 3;
  if (band === 'building') return 2;
  return 0;
}
