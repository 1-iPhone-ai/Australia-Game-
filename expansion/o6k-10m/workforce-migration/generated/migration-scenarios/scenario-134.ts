import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 134 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_134_META = {
  id: 'mig_134',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 132823,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_134_COEF = {
  k0: 11.3000,
  k1: 33.5000,
  k2: 55.7000,
  k3: 77.9000,
  k4: 0.4000,
  k5: 22.6000,
  k6: 44.8000,
  k7: 67.0000,
  k8: 89.2000,
  k9: 11.7000,
  k10: 33.9000,
  k11: 56.1000,
  k12: 78.3000,
  k13: 0.8000,
  k14: 23.0000,
  k15: 45.2000,
  k16: 67.4000,
  k17: 89.6000,
  k18: 12.1000,
  k19: 34.3000,
  k20: 56.5000,
  k21: 78.7000,
  k22: 1.2000,
  k23: 23.4000,
  k24: 45.6000,
  k25: 67.8000,
  k26: 90.0000,
  k27: 12.5000,
  k28: 34.7000,
  k29: 56.9000,
  k30: 79.1000,
  k31: 1.6000,
  k32: 23.8000,
  k33: 46.0000,
  k34: 68.2000,
  k35: 90.4000,
  k36: 12.9000,
  k37: 35.1000,
  k38: 57.3000,
  k39: 79.5000,
  k40: 2.0000,
  k41: 24.2000,
  k42: 46.4000,
  k43: 68.6000,
  k44: 90.8000,
  k45: 13.3000,
  k46: 35.5000,
  k47: 57.7000,
  k48: 79.9000,
  k49: 2.4000,
  k50: 24.6000,
  k51: 46.8000,
  k52: 69.0000,
  k53: 91.2000,
  k54: 13.7000,
  k55: 35.9000,
  k56: 58.1000,
  k57: 80.3000,
  k58: 2.8000,
  k59: 25.0000,
  k60: 47.2000,
  k61: 69.4000,
  k62: 91.6000,
  k63: 14.1000,
  k64: 36.3000,
  k65: 58.5000,
  k66: 80.7000,
  k67: 3.2000,
  k68: 25.4000,
  k69: 47.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_134_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_134_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_134_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_134_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_134_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_134_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_134_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_134_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_134_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_134_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_134_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
