import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 143 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_143_META = {
  id: 'pipeline_143',
  regionId: 'ACT' as V1020RpipeRegionId,
  primarySystem: 'digital' as V1020RpipeSystemDomain,
  transferBand: 'critical' as V1020RpipeTransferBand,
  seed: 125452,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_143_COEF = {
  k0: 13.8000,
  k1: 72.4000,
  k2: 31.9000,
  k3: 90.5000,
  k4: 50.0000,
  k5: 9.5000,
  k6: 68.1000,
  k7: 27.6000,
  k8: 86.2000,
  k9: 45.7000,
  k10: 5.2000,
  k11: 63.8000,
  k12: 23.3000,
  k13: 81.9000,
  k14: 41.4000,
  k15: 0.9000,
  k16: 59.5000,
  k17: 19.0000,
  k18: 77.6000,
  k19: 37.1000,
  k20: 95.7000,
  k21: 55.2000,
  k22: 14.7000,
  k23: 73.3000,
  k24: 32.8000,
  k25: 91.4000,
  k26: 50.9000,
  k27: 10.4000,
  k28: 69.0000,
  k29: 28.5000,
  k30: 87.1000,
  k31: 46.6000,
  k32: 6.1000,
  k33: 64.7000,
  k34: 24.2000,
  k35: 82.8000,
  k36: 42.3000,
  k37: 1.8000,
  k38: 60.4000,
  k39: 19.9000,
  k40: 78.5000,
  k41: 38.0000,
  k42: 96.6000,
  k43: 56.1000,
  k44: 15.6000,
  k45: 74.2000,
  k46: 33.7000,
  k47: 92.3000,
  k48: 51.8000,
  k49: 11.3000,
  k50: 69.9000,
  k51: 29.4000,
  k52: 88.0000,
  k53: 47.5000,
  k54: 7.0000,
  k55: 65.6000,
  k56: 25.1000,
  k57: 83.7000,
  k58: 43.2000,
  k59: 2.7000,
  k60: 61.3000,
  k61: 20.8000,
  k62: 79.4000,
  k63: 38.9000,
  k64: 97.5000,
  k65: 57.0000,
  k66: 16.5000,
  k67: 75.1000,
  k68: 34.6000,
  k69: 93.2000,
  k70: 52.7000,
  k71: 12.2000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_143_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_143_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_143_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_143_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_143_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_143_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_143_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_143_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_143_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_143_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_143_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_143_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
