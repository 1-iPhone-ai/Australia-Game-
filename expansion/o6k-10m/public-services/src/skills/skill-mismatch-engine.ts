import { V1014_PUBSVC_SKILL_DOMAIN_FOR_PILLAR } from '../core/constants.ts';
import { V1014_PUBSVC_clamp, V1014_PUBSVC_weightedMean } from '../core/math.ts';
import { V1014_PUBSVC_CORE_REGIONS } from '../core/types.ts';
import type {
  V1014PubsSvcAdapter20AC,
  V1014PubsSvcPillar,
  V1014PubsSvcRegionId,
  V1014PubsSvcSkillGapBand,
  V1014PubsSvcSkillMismatchSlice,
} from '../core/types.ts';

const GAP_BANDS: V1014PubsSvcSkillGapBand[] = [
  'aligned',
  'mild_gap',
  'moderate_gap',
  'severe_gap',
  'crisis_gap',
];

export function V1014_PUBSVC_skillGapBand(gapScore: number): V1014PubsSvcSkillGapBand {
  if (gapScore >= 72) return 'crisis_gap';
  if (gapScore >= 52) return 'severe_gap';
  if (gapScore >= 34) return 'moderate_gap';
  if (gapScore >= 16) return 'mild_gap';
  return 'aligned';
}

export interface V1014PubsSvcSkillMismatchInput {
  regionId: V1014PubsSvcRegionId;
  pillar: V1014PubsSvcPillar;
  ac: V1014PubsSvcAdapter20AC;
  serviceDemandIndex: number;
}

export function V1014_PUBSVC_computeSkillMismatchSlice(
  input: V1014PubsSvcSkillMismatchInput,
): V1014PubsSvcSkillMismatchSlice {
  const supply = input.ac.regionalSkillSupply[input.regionId] ?? input.ac.nationalReadiness;
  const domains = V1014_PUBSVC_SKILL_DOMAIN_FOR_PILLAR[input.pillar];
  const domainBoost = domains.length * 2.4;
  const requiredSkillIndex = V1014_PUBSVC_clamp(
    input.serviceDemandIndex * 0.82 + domainBoost + input.ac.specialistGap * 0.15,
    0,
    100,
  );
  const availableSkillIndex = V1014_PUBSVC_clamp(supply - input.ac.specialistGap * 0.22, 0, 100);
  const gapScore = V1014_PUBSVC_clamp(requiredSkillIndex - availableSkillIndex, 0, 100);
  const pipelineTurns = Math.round(4 + gapScore / 8 + (100 - input.ac.nationalReadiness) / 25);

  return {
    regionId: input.regionId,
    pillar: input.pillar,
    requiredSkillIndex,
    availableSkillIndex,
    gapScore,
    band: V1014_PUBSVC_skillGapBand(gapScore),
    workforcePipelineTurns: pipelineTurns,
  };
}

export function V1014_PUBSVC_nationalSkillMismatch(slices: V1014PubsSvcSkillMismatchSlice[]): number {
  if (!slices.length) return 0;
  return V1014_PUBSVC_clamp(
    V1014_PUBSVC_weightedMean(slices.map((s) => ({ weight: 1, value: s.gapScore }))),
    0,
    100,
  );
}

export function V1014_PUBSVC_buildSkillMismatchGrid(
  ac: V1014PubsSvcAdapter20AC,
  demandByRegionPillar: Partial<
    Record<V1014PubsSvcRegionId, Partial<Record<V1014PubsSvcPillar, number>>>
  >,
): V1014PubsSvcSkillMismatchSlice[] {
  const pillars: V1014PubsSvcPillar[] = ['housing', 'healthcare', 'education'];
  const out: V1014PubsSvcSkillMismatchSlice[] = [];
  for (const regionId of V1014_PUBSVC_CORE_REGIONS) {
    for (const pillar of pillars) {
      out.push(
        V1014_PUBSVC_computeSkillMismatchSlice({
          regionId,
          pillar,
          ac,
          serviceDemandIndex: demandByRegionPillar[regionId]?.[pillar] ?? 45,
        }),
      );
    }
  }
  return out;
}

export { GAP_BANDS as V1014_PUBSVC_SKILL_GAP_BANDS };
