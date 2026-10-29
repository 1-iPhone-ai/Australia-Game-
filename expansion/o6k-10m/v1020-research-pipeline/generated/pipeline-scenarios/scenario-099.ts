import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 099 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_099_META = {
  id: 'pipeline_099',
  regionId: 'WA' as V1020RpipeRegionId,
  primarySystem: 'finance' as V1020RpipeSystemDomain,
  transferBand: 'recovering' as V1020RpipeTransferBand,
  seed: 86864,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_099_COEF = {
  k0: 56.5000,
  k1: 22.1000,
  k2: 86.8000,
  k3: 52.4000,
  k4: 18.0000,
  k5: 82.7000,
  k6: 48.3000,
  k7: 13.9000,
  k8: 78.6000,
  k9: 44.2000,
  k10: 9.8000,
  k11: 74.5000,
  k12: 40.1000,
  k13: 5.7000,
  k14: 70.4000,
  k15: 36.0000,
  k16: 1.6000,
  k17: 66.3000,
  k18: 31.9000,
  k19: 96.6000,
  k20: 62.2000,
  k21: 27.8000,
  k22: 92.5000,
  k23: 58.1000,
  k24: 23.7000,
  k25: 88.4000,
  k26: 54.0000,
  k27: 19.6000,
  k28: 84.3000,
  k29: 49.9000,
  k30: 15.5000,
  k31: 80.2000,
  k32: 45.8000,
  k33: 11.4000,
  k34: 76.1000,
  k35: 41.7000,
  k36: 7.3000,
  k37: 72.0000,
  k38: 37.6000,
  k39: 3.2000,
  k40: 67.9000,
  k41: 33.5000,
  k42: 98.2000,
  k43: 63.8000,
  k44: 29.4000,
  k45: 94.1000,
  k46: 59.7000,
  k47: 25.3000,
  k48: 90.0000,
  k49: 55.6000,
  k50: 21.2000,
  k51: 85.9000,
  k52: 51.5000,
  k53: 17.1000,
  k54: 81.8000,
  k55: 47.4000,
  k56: 13.0000,
  k57: 77.7000,
  k58: 43.3000,
  k59: 8.9000,
  k60: 73.6000,
  k61: 39.2000,
  k62: 4.8000,
  k63: 69.5000,
  k64: 35.1000,
  k65: 0.7000,
  k66: 65.4000,
  k67: 31.0000,
  k68: 95.7000,
  k69: 61.3000,
  k70: 26.9000,
  k71: 91.6000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_099_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_099_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_099_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_099_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_099_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_099_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_099_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_099_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_099_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_099_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_099_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_099_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
