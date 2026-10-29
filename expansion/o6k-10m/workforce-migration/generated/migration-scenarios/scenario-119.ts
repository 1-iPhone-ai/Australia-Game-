import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 119 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_119_META = {
  id: 'mig_119',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 117958,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_119_COEF = {
  k0: 56.3000,
  k1: 87.5000,
  k2: 19.0000,
  k3: 50.2000,
  k4: 81.4000,
  k5: 12.9000,
  k6: 44.1000,
  k7: 75.3000,
  k8: 6.8000,
  k9: 38.0000,
  k10: 69.2000,
  k11: 0.7000,
  k12: 31.9000,
  k13: 63.1000,
  k14: 94.3000,
  k15: 25.8000,
  k16: 57.0000,
  k17: 88.2000,
  k18: 19.7000,
  k19: 50.9000,
  k20: 82.1000,
  k21: 13.6000,
  k22: 44.8000,
  k23: 76.0000,
  k24: 7.5000,
  k25: 38.7000,
  k26: 69.9000,
  k27: 1.4000,
  k28: 32.6000,
  k29: 63.8000,
  k30: 95.0000,
  k31: 26.5000,
  k32: 57.7000,
  k33: 88.9000,
  k34: 20.4000,
  k35: 51.6000,
  k36: 82.8000,
  k37: 14.3000,
  k38: 45.5000,
  k39: 76.7000,
  k40: 8.2000,
  k41: 39.4000,
  k42: 70.6000,
  k43: 2.1000,
  k44: 33.3000,
  k45: 64.5000,
  k46: 95.7000,
  k47: 27.2000,
  k48: 58.4000,
  k49: 89.6000,
  k50: 21.1000,
  k51: 52.3000,
  k52: 83.5000,
  k53: 15.0000,
  k54: 46.2000,
  k55: 77.4000,
  k56: 8.9000,
  k57: 40.1000,
  k58: 71.3000,
  k59: 2.8000,
  k60: 34.0000,
  k61: 65.2000,
  k62: 96.4000,
  k63: 27.9000,
  k64: 59.1000,
  k65: 90.3000,
  k66: 21.8000,
  k67: 53.0000,
  k68: 84.2000,
  k69: 15.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_119_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_119_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_119_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_119_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_119_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_119_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_119_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_119_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_119_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_119_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_119_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
