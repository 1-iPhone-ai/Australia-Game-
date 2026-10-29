import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 101 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_101_META = {
  id: 'pipeline_101',
  regionId: 'TAS' as V1020RpipeRegionId,
  primarySystem: 'energy' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 88618,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_101_COEF = {
  k0: 95.1000,
  k1: 37.9000,
  k2: 79.8000,
  k3: 22.6000,
  k4: 64.5000,
  k5: 7.3000,
  k6: 49.2000,
  k7: 91.1000,
  k8: 33.9000,
  k9: 75.8000,
  k10: 18.6000,
  k11: 60.5000,
  k12: 3.3000,
  k13: 45.2000,
  k14: 87.1000,
  k15: 29.9000,
  k16: 71.8000,
  k17: 14.6000,
  k18: 56.5000,
  k19: 98.4000,
  k20: 41.2000,
  k21: 83.1000,
  k22: 25.9000,
  k23: 67.8000,
  k24: 10.6000,
  k25: 52.5000,
  k26: 94.4000,
  k27: 37.2000,
  k28: 79.1000,
  k29: 21.9000,
  k30: 63.8000,
  k31: 6.6000,
  k32: 48.5000,
  k33: 90.4000,
  k34: 33.2000,
  k35: 75.1000,
  k36: 17.9000,
  k37: 59.8000,
  k38: 2.6000,
  k39: 44.5000,
  k40: 86.4000,
  k41: 29.2000,
  k42: 71.1000,
  k43: 13.9000,
  k44: 55.8000,
  k45: 97.7000,
  k46: 40.5000,
  k47: 82.4000,
  k48: 25.2000,
  k49: 67.1000,
  k50: 9.9000,
  k51: 51.8000,
  k52: 93.7000,
  k53: 36.5000,
  k54: 78.4000,
  k55: 21.2000,
  k56: 63.1000,
  k57: 5.9000,
  k58: 47.8000,
  k59: 89.7000,
  k60: 32.5000,
  k61: 74.4000,
  k62: 17.2000,
  k63: 59.1000,
  k64: 1.9000,
  k65: 43.8000,
  k66: 85.7000,
  k67: 28.5000,
  k68: 70.4000,
  k69: 13.2000,
  k70: 55.1000,
  k71: 97.0000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_101_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_101_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_101_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_101_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_101_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_101_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_101_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_101_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_101_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_101_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_101_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_101_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
