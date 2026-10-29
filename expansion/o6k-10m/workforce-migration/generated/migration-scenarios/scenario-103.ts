import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 103 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_103_META = {
  id: 'mig_103',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 102102,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_103_COEF = {
  k0: 4.6000,
  k1: 45.4000,
  k2: 86.2000,
  k3: 27.3000,
  k4: 68.1000,
  k5: 9.2000,
  k6: 50.0000,
  k7: 90.8000,
  k8: 31.9000,
  k9: 72.7000,
  k10: 13.8000,
  k11: 54.6000,
  k12: 95.4000,
  k13: 36.5000,
  k14: 77.3000,
  k15: 18.4000,
  k16: 59.2000,
  k17: 0.3000,
  k18: 41.1000,
  k19: 81.9000,
  k20: 23.0000,
  k21: 63.8000,
  k22: 4.9000,
  k23: 45.7000,
  k24: 86.5000,
  k25: 27.6000,
  k26: 68.4000,
  k27: 9.5000,
  k28: 50.3000,
  k29: 91.1000,
  k30: 32.2000,
  k31: 73.0000,
  k32: 14.1000,
  k33: 54.9000,
  k34: 95.7000,
  k35: 36.8000,
  k36: 77.6000,
  k37: 18.7000,
  k38: 59.5000,
  k39: 0.6000,
  k40: 41.4000,
  k41: 82.2000,
  k42: 23.3000,
  k43: 64.1000,
  k44: 5.2000,
  k45: 46.0000,
  k46: 86.8000,
  k47: 27.9000,
  k48: 68.7000,
  k49: 9.8000,
  k50: 50.6000,
  k51: 91.4000,
  k52: 32.5000,
  k53: 73.3000,
  k54: 14.4000,
  k55: 55.2000,
  k56: 96.0000,
  k57: 37.1000,
  k58: 77.9000,
  k59: 19.0000,
  k60: 59.8000,
  k61: 0.9000,
  k62: 41.7000,
  k63: 82.5000,
  k64: 23.6000,
  k65: 64.4000,
  k66: 5.5000,
  k67: 46.3000,
  k68: 87.1000,
  k69: 28.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_103_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_103_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_103_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_103_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_103_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_103_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_103_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_103_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_103_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_103_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_103_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
