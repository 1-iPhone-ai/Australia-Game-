import type {
  V1014PubsSvcAdapter20AC,
  V1014PubsSvcAdapter20AF,
  V1014PubsSvcAdapter20AJ,
  V1014PubsSvcAdapter20AP,
  V1014PubsSvcCrosswalkInputs,
  V1014PubsSvcPillar,
  V1014PubsSvcRegionId,
} from '../core/types.ts';
import { V1014_PUBSVC_CORE_REGIONS } from '../core/types.ts';
import { V1014_PUBSVC_clamp } from '../core/math.ts';

export function V1014_PUBSVC_normalizeAdapter20AP(raw: Partial<V1014PubsSvcAdapter20AP>): V1014PubsSvcAdapter20AP {
  return {
    turn: raw.turn ?? 0,
    nationalOutcomeIndex: raw.nationalOutcomeIndex ?? 55,
    regionalOutcome: raw.regionalOutcome ?? {},
  };
}

export function V1014_PUBSVC_normalizeAdapter20AC(raw: Partial<V1014PubsSvcAdapter20AC>): V1014PubsSvcAdapter20AC {
  return {
    turn: raw.turn ?? 0,
    nationalReadiness: raw.nationalReadiness ?? 58,
    specialistGap: raw.specialistGap ?? 28,
    regionalSkillSupply: raw.regionalSkillSupply ?? {},
  };
}

export function V1014_PUBSVC_normalizeAdapter20AJ(raw: Partial<V1014PubsSvcAdapter20AJ>): V1014PubsSvcAdapter20AJ {
  return {
    turn: raw.turn ?? 0,
    migrationFlowBand: raw.migrationFlowBand ?? 'balanced',
    regionalAttractiveness: raw.regionalAttractiveness ?? {},
    wagePressureIndex: raw.wagePressureIndex ?? 48,
  };
}

export function V1014_PUBSVC_normalizeAdapter20AF(raw: Partial<V1014PubsSvcAdapter20AF>): V1014PubsSvcAdapter20AF {
  return {
    turn: raw.turn ?? 0,
    affordabilityStress: raw.affordabilityStress ?? 42,
    regionalLivingStandard: raw.regionalLivingStandard ?? {},
    domesticDemandPull: raw.domesticDemandPull ?? 50,
  };
}

export function V1014_PUBSVC_mergeCrosswalkInputs(
  partial: Partial<V1014PubsSvcCrosswalkInputs>,
): V1014PubsSvcCrosswalkInputs {
  return {
    turn: partial.turn ?? 1,
    ap20: V1014_PUBSVC_normalizeAdapter20AP(partial.ap20 ?? {}),
    ac20: V1014_PUBSVC_normalizeAdapter20AC(partial.ac20 ?? {}),
    aj20: V1014_PUBSVC_normalizeAdapter20AJ(partial.aj20 ?? {}),
    af20: V1014_PUBSVC_normalizeAdapter20AF(partial.af20 ?? {}),
    policyFocus: partial.policyFocus ?? { housing: 50, healthcare: 52, education: 54 },
    fiscalHeadroom: partial.fiscalHeadroom ?? 55,
  };
}

const PILLARS: V1014PubsSvcPillar[] = ['housing', 'healthcare', 'education'];

export function V1014_PUBSVC_extractDemandFrom20AP(
  ap: V1014PubsSvcAdapter20AP,
): Partial<Record<V1014PubsSvcRegionId, Partial<Record<V1014PubsSvcPillar, number>>>> {
  const out: Partial<Record<V1014PubsSvcRegionId, Partial<Record<V1014PubsSvcPillar, number>>>> = {};
  for (const regionId of V1014_PUBSVC_CORE_REGIONS) {
    const row = ap.regionalOutcome[regionId];
    if (!row) continue;
    out[regionId] = {};
    for (const pillar of PILLARS) {
      const cell = row[pillar];
      if (!cell) continue;
      out[regionId]![pillar] = V1014_PUBSVC_clamp(
        (100 - cell.accessScore) * 0.45 + cell.backlogPressure * 0.55,
        0,
        100,
      );
    }
  }
  return out;
}

export function V1014_PUBSVC_extractQueueBaselinesFrom20AP(
  ap: V1014PubsSvcAdapter20AP,
): Partial<Record<V1014PubsSvcRegionId, Partial<Record<V1014PubsSvcPillar, number>>>> {
  const out: Partial<Record<V1014PubsSvcRegionId, Partial<Record<V1014PubsSvcPillar, number>>>> = {};
  for (const regionId of V1014_PUBSVC_CORE_REGIONS) {
    out[regionId] = {};
    for (const pillar of PILLARS) {
      const cell = ap.regionalOutcome[regionId]?.[pillar];
      const base = cell ? cell.accessScore * 0.65 + cell.backlogPressure * 0.35 : ap.nationalOutcomeIndex;
      out[regionId]![pillar] = V1014_PUBSVC_clamp(base, 10, 95);
    }
  }
  return out;
}

export function V1014_PUBSVC_apply20AFStressToFiscal(
  fiscalHeadroom: number,
  af: V1014PubsSvcAdapter20AF,
): number {
  return V1014_PUBSVC_clamp(fiscalHeadroom - af.affordabilityStress * 0.12 + af.domesticDemandPull * 0.04, 0, 100);
}

export function V1014_PUBSVC_apply20AJToPolicyFocus(
  policyFocus: Partial<Record<V1014PubsSvcPillar, number>>,
  aj: V1014PubsSvcAdapter20AJ,
): Partial<Record<V1014PubsSvcPillar, number>> {
  const wageShift = aj.wagePressureIndex * 0.08;
  return {
    housing: V1014_PUBSVC_clamp((policyFocus.housing ?? 50) + wageShift * 0.4, 0, 100),
    healthcare: V1014_PUBSVC_clamp((policyFocus.healthcare ?? 50) + wageShift * 0.35, 0, 100),
    education: V1014_PUBSVC_clamp((policyFocus.education ?? 50) + wageShift * 0.25, 0, 100),
  };
}
