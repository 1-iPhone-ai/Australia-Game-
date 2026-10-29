import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 103 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_103_META = {
  id: 'pipeline_103',
  regionId: 'ACT' as V1020RpipeRegionId,
  primarySystem: 'digital' as V1020RpipeSystemDomain,
  transferBand: 'critical' as V1020RpipeTransferBand,
  seed: 90372,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_103_COEF = {
  k0: 34.6000,
  k1: 53.7000,
  k2: 72.8000,
  k3: 91.9000,
  k4: 11.9000,
  k5: 31.0000,
  k6: 50.1000,
  k7: 69.2000,
  k8: 88.3000,
  k9: 8.3000,
  k10: 27.4000,
  k11: 46.5000,
  k12: 65.6000,
  k13: 84.7000,
  k14: 4.7000,
  k15: 23.8000,
  k16: 42.9000,
  k17: 62.0000,
  k18: 81.1000,
  k19: 1.1000,
  k20: 20.2000,
  k21: 39.3000,
  k22: 58.4000,
  k23: 77.5000,
  k24: 96.6000,
  k25: 16.6000,
  k26: 35.7000,
  k27: 54.8000,
  k28: 73.9000,
  k29: 93.0000,
  k30: 13.0000,
  k31: 32.1000,
  k32: 51.2000,
  k33: 70.3000,
  k34: 89.4000,
  k35: 9.4000,
  k36: 28.5000,
  k37: 47.6000,
  k38: 66.7000,
  k39: 85.8000,
  k40: 5.8000,
  k41: 24.9000,
  k42: 44.0000,
  k43: 63.1000,
  k44: 82.2000,
  k45: 2.2000,
  k46: 21.3000,
  k47: 40.4000,
  k48: 59.5000,
  k49: 78.6000,
  k50: 97.7000,
  k51: 17.7000,
  k52: 36.8000,
  k53: 55.9000,
  k54: 75.0000,
  k55: 94.1000,
  k56: 14.1000,
  k57: 33.2000,
  k58: 52.3000,
  k59: 71.4000,
  k60: 90.5000,
  k61: 10.5000,
  k62: 29.6000,
  k63: 48.7000,
  k64: 67.8000,
  k65: 86.9000,
  k66: 6.9000,
  k67: 26.0000,
  k68: 45.1000,
  k69: 64.2000,
  k70: 83.3000,
  k71: 3.3000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_103_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_103_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_103_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_103_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_103_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_103_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_103_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_103_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_103_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_103_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_103_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_103_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
