import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 156 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_156_META = {
  id: 'pipeline_156',
  regionId: 'SA' as V1020RpipeRegionId,
  primarySystem: 'food' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 136853,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_156_COEF = {
  k0: 66.5000,
  k1: 76.0000,
  k2: 85.5000,
  k3: 95.0000,
  k4: 5.4000,
  k5: 14.9000,
  k6: 24.4000,
  k7: 33.9000,
  k8: 43.4000,
  k9: 52.9000,
  k10: 62.4000,
  k11: 71.9000,
  k12: 81.4000,
  k13: 90.9000,
  k14: 1.3000,
  k15: 10.8000,
  k16: 20.3000,
  k17: 29.8000,
  k18: 39.3000,
  k19: 48.8000,
  k20: 58.3000,
  k21: 67.8000,
  k22: 77.3000,
  k23: 86.8000,
  k24: 96.3000,
  k25: 6.7000,
  k26: 16.2000,
  k27: 25.7000,
  k28: 35.2000,
  k29: 44.7000,
  k30: 54.2000,
  k31: 63.7000,
  k32: 73.2000,
  k33: 82.7000,
  k34: 92.2000,
  k35: 2.6000,
  k36: 12.1000,
  k37: 21.6000,
  k38: 31.1000,
  k39: 40.6000,
  k40: 50.1000,
  k41: 59.6000,
  k42: 69.1000,
  k43: 78.6000,
  k44: 88.1000,
  k45: 97.6000,
  k46: 8.0000,
  k47: 17.5000,
  k48: 27.0000,
  k49: 36.5000,
  k50: 46.0000,
  k51: 55.5000,
  k52: 65.0000,
  k53: 74.5000,
  k54: 84.0000,
  k55: 93.5000,
  k56: 3.9000,
  k57: 13.4000,
  k58: 22.9000,
  k59: 32.4000,
  k60: 41.9000,
  k61: 51.4000,
  k62: 60.9000,
  k63: 70.4000,
  k64: 79.9000,
  k65: 89.4000,
  k66: 98.9000,
  k67: 9.3000,
  k68: 18.8000,
  k69: 28.3000,
  k70: 37.8000,
  k71: 47.3000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_156_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_156_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_156_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_156_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_156_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_156_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_156_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_156_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_156_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_156_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_156_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_156_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
