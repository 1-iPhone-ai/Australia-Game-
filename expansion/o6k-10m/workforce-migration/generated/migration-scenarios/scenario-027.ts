import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 027 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_027_META = {
  id: 'mig_027',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 26786,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_027_COEF = {
  k0: 33.2000,
  k1: 19.9000,
  k2: 6.6000,
  k3: 93.0000,
  k4: 79.7000,
  k5: 66.4000,
  k6: 53.1000,
  k7: 39.8000,
  k8: 26.5000,
  k9: 13.2000,
  k10: 99.6000,
  k11: 86.3000,
  k12: 73.0000,
  k13: 59.7000,
  k14: 46.4000,
  k15: 33.1000,
  k16: 19.8000,
  k17: 6.5000,
  k18: 92.9000,
  k19: 79.6000,
  k20: 66.3000,
  k21: 53.0000,
  k22: 39.7000,
  k23: 26.4000,
  k24: 13.1000,
  k25: 99.5000,
  k26: 86.2000,
  k27: 72.9000,
  k28: 59.6000,
  k29: 46.3000,
  k30: 33.0000,
  k31: 19.7000,
  k32: 6.4000,
  k33: 92.8000,
  k34: 79.5000,
  k35: 66.2000,
  k36: 52.9000,
  k37: 39.6000,
  k38: 26.3000,
  k39: 13.0000,
  k40: 99.4000,
  k41: 86.1000,
  k42: 72.8000,
  k43: 59.5000,
  k44: 46.2000,
  k45: 32.9000,
  k46: 19.6000,
  k47: 6.3000,
  k48: 92.7000,
  k49: 79.4000,
  k50: 66.1000,
  k51: 52.8000,
  k52: 39.5000,
  k53: 26.2000,
  k54: 12.9000,
  k55: 99.3000,
  k56: 86.0000,
  k57: 72.7000,
  k58: 59.4000,
  k59: 46.1000,
  k60: 32.8000,
  k61: 19.5000,
  k62: 6.2000,
  k63: 92.6000,
  k64: 79.3000,
  k65: 66.0000,
  k66: 52.7000,
  k67: 39.4000,
  k68: 26.1000,
  k69: 12.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_027_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_027_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_027_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_027_COEF[keys[j]] * ((turn + j) % 11);
  }
  const netInflow = V1014_WORKFORCE_clamp(-12 + (acc % 48) + turn * 0.04, -40, 55);
  const skillMismatchIndex = V1014_WORKFORCE_clamp(
    28 + (acc % 52) + Math.abs(netInflow) * 0.35,
    0,
    100,
  );
  const stable = V1014_WORKFORCE_readinessFromScore(100 - skillMismatchIndex) !== 'blocking';
  return { netInflow, skillMismatchIndex, stable };
}

export function V1014_WORKFORCE_MIG_SCENARIO_027_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_027_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_027_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_027_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_027_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_027_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_027_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
