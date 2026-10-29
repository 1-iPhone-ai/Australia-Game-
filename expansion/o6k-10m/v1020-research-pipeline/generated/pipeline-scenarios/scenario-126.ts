import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 126 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_126_META = {
  id: 'pipeline_126',
  regionId: 'NT' as V1020RpipeRegionId,
  primarySystem: 'food' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 110543,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_126_COEF = {
  k0: 82.1000,
  k1: 37.2000,
  k2: 91.4000,
  k3: 46.5000,
  k4: 1.6000,
  k5: 55.8000,
  k6: 10.9000,
  k7: 65.1000,
  k8: 20.2000,
  k9: 74.4000,
  k10: 29.5000,
  k11: 83.7000,
  k12: 38.8000,
  k13: 93.0000,
  k14: 48.1000,
  k15: 3.2000,
  k16: 57.4000,
  k17: 12.5000,
  k18: 66.7000,
  k19: 21.8000,
  k20: 76.0000,
  k21: 31.1000,
  k22: 85.3000,
  k23: 40.4000,
  k24: 94.6000,
  k25: 49.7000,
  k26: 4.8000,
  k27: 59.0000,
  k28: 14.1000,
  k29: 68.3000,
  k30: 23.4000,
  k31: 77.6000,
  k32: 32.7000,
  k33: 86.9000,
  k34: 42.0000,
  k35: 96.2000,
  k36: 51.3000,
  k37: 6.4000,
  k38: 60.6000,
  k39: 15.7000,
  k40: 69.9000,
  k41: 25.0000,
  k42: 79.2000,
  k43: 34.3000,
  k44: 88.5000,
  k45: 43.6000,
  k46: 97.8000,
  k47: 52.9000,
  k48: 8.0000,
  k49: 62.2000,
  k50: 17.3000,
  k51: 71.5000,
  k52: 26.6000,
  k53: 80.8000,
  k54: 35.9000,
  k55: 90.1000,
  k56: 45.2000,
  k57: 0.3000,
  k58: 54.5000,
  k59: 9.6000,
  k60: 63.8000,
  k61: 18.9000,
  k62: 73.1000,
  k63: 28.2000,
  k64: 82.4000,
  k65: 37.5000,
  k66: 91.7000,
  k67: 46.8000,
  k68: 1.9000,
  k69: 56.1000,
  k70: 11.2000,
  k71: 65.4000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_126_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_126_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_126_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_126_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_126_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_126_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_126_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_126_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_126_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_126_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_126_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_126_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
