import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 022 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_022_META = {
  id: 'mig_022',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 21831,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_022_COEF = {
  k0: 48.2000,
  k1: 37.9000,
  k2: 27.6000,
  k3: 17.3000,
  k4: 7.0000,
  k5: 96.4000,
  k6: 86.1000,
  k7: 75.8000,
  k8: 65.5000,
  k9: 55.2000,
  k10: 44.9000,
  k11: 34.6000,
  k12: 24.3000,
  k13: 14.0000,
  k14: 3.7000,
  k15: 93.1000,
  k16: 82.8000,
  k17: 72.5000,
  k18: 62.2000,
  k19: 51.9000,
  k20: 41.6000,
  k21: 31.3000,
  k22: 21.0000,
  k23: 10.7000,
  k24: 0.4000,
  k25: 89.8000,
  k26: 79.5000,
  k27: 69.2000,
  k28: 58.9000,
  k29: 48.6000,
  k30: 38.3000,
  k31: 28.0000,
  k32: 17.7000,
  k33: 7.4000,
  k34: 96.8000,
  k35: 86.5000,
  k36: 76.2000,
  k37: 65.9000,
  k38: 55.6000,
  k39: 45.3000,
  k40: 35.0000,
  k41: 24.7000,
  k42: 14.4000,
  k43: 4.1000,
  k44: 93.5000,
  k45: 83.2000,
  k46: 72.9000,
  k47: 62.6000,
  k48: 52.3000,
  k49: 42.0000,
  k50: 31.7000,
  k51: 21.4000,
  k52: 11.1000,
  k53: 0.8000,
  k54: 90.2000,
  k55: 79.9000,
  k56: 69.6000,
  k57: 59.3000,
  k58: 49.0000,
  k59: 38.7000,
  k60: 28.4000,
  k61: 18.1000,
  k62: 7.8000,
  k63: 97.2000,
  k64: 86.9000,
  k65: 76.6000,
  k66: 66.3000,
  k67: 56.0000,
  k68: 45.7000,
  k69: 35.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_022_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_022_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_022_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_022_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_022_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_022_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_022_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_022_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_022_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_022_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_022_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
