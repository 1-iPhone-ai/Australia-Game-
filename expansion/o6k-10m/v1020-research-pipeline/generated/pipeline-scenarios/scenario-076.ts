import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 076 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_076_META = {
  id: 'pipeline_076',
  regionId: 'SA' as V1020RpipeRegionId,
  primarySystem: 'food' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 66693,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_076_COEF = {
  k0: 9.0000,
  k1: 38.6000,
  k2: 68.2000,
  k3: 97.8000,
  k4: 28.3000,
  k5: 57.9000,
  k6: 87.5000,
  k7: 18.0000,
  k8: 47.6000,
  k9: 77.2000,
  k10: 7.7000,
  k11: 37.3000,
  k12: 66.9000,
  k13: 96.5000,
  k14: 27.0000,
  k15: 56.6000,
  k16: 86.2000,
  k17: 16.7000,
  k18: 46.3000,
  k19: 75.9000,
  k20: 6.4000,
  k21: 36.0000,
  k22: 65.6000,
  k23: 95.2000,
  k24: 25.7000,
  k25: 55.3000,
  k26: 84.9000,
  k27: 15.4000,
  k28: 45.0000,
  k29: 74.6000,
  k30: 5.1000,
  k31: 34.7000,
  k32: 64.3000,
  k33: 93.9000,
  k34: 24.4000,
  k35: 54.0000,
  k36: 83.6000,
  k37: 14.1000,
  k38: 43.7000,
  k39: 73.3000,
  k40: 3.8000,
  k41: 33.4000,
  k42: 63.0000,
  k43: 92.6000,
  k44: 23.1000,
  k45: 52.7000,
  k46: 82.3000,
  k47: 12.8000,
  k48: 42.4000,
  k49: 72.0000,
  k50: 2.5000,
  k51: 32.1000,
  k52: 61.7000,
  k53: 91.3000,
  k54: 21.8000,
  k55: 51.4000,
  k56: 81.0000,
  k57: 11.5000,
  k58: 41.1000,
  k59: 70.7000,
  k60: 1.2000,
  k61: 30.8000,
  k62: 60.4000,
  k63: 90.0000,
  k64: 20.5000,
  k65: 50.1000,
  k66: 79.7000,
  k67: 10.2000,
  k68: 39.8000,
  k69: 69.4000,
  k70: 99.0000,
  k71: 29.5000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_076_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_076_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_076_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_076_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_076_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_076_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_076_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_076_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_076_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_076_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_076_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_076_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
