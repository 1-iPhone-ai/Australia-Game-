import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 035 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_035_META = {
  id: 'mig_035',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 34714,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_035_COEF = {
  k0: 9.2000,
  k1: 90.8000,
  k2: 72.7000,
  k3: 54.6000,
  k4: 36.5000,
  k5: 18.4000,
  k6: 0.3000,
  k7: 81.9000,
  k8: 63.8000,
  k9: 45.7000,
  k10: 27.6000,
  k11: 9.5000,
  k12: 91.1000,
  k13: 73.0000,
  k14: 54.9000,
  k15: 36.8000,
  k16: 18.7000,
  k17: 0.6000,
  k18: 82.2000,
  k19: 64.1000,
  k20: 46.0000,
  k21: 27.9000,
  k22: 9.8000,
  k23: 91.4000,
  k24: 73.3000,
  k25: 55.2000,
  k26: 37.1000,
  k27: 19.0000,
  k28: 0.9000,
  k29: 82.5000,
  k30: 64.4000,
  k31: 46.3000,
  k32: 28.2000,
  k33: 10.1000,
  k34: 91.7000,
  k35: 73.6000,
  k36: 55.5000,
  k37: 37.4000,
  k38: 19.3000,
  k39: 1.2000,
  k40: 82.8000,
  k41: 64.7000,
  k42: 46.6000,
  k43: 28.5000,
  k44: 10.4000,
  k45: 92.0000,
  k46: 73.9000,
  k47: 55.8000,
  k48: 37.7000,
  k49: 19.6000,
  k50: 1.5000,
  k51: 83.1000,
  k52: 65.0000,
  k53: 46.9000,
  k54: 28.8000,
  k55: 10.7000,
  k56: 92.3000,
  k57: 74.2000,
  k58: 56.1000,
  k59: 38.0000,
  k60: 19.9000,
  k61: 1.8000,
  k62: 83.4000,
  k63: 65.3000,
  k64: 47.2000,
  k65: 29.1000,
  k66: 11.0000,
  k67: 92.6000,
  k68: 74.5000,
  k69: 56.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_035_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_035_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_035_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_035_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_035_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_035_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_035_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_035_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_035_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_035_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_035_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
