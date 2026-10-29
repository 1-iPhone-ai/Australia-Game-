import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 097 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_097_META = {
  id: 'pipeline_097',
  regionId: 'VIC' as V1020RpipeRegionId,
  primarySystem: 'industrial' as V1020RpipeSystemDomain,
  transferBand: 'active' as V1020RpipeTransferBand,
  seed: 85110,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_097_COEF = {
  k0: 17.9000,
  k1: 6.3000,
  k2: 93.8000,
  k3: 82.2000,
  k4: 70.6000,
  k5: 59.0000,
  k6: 47.4000,
  k7: 35.8000,
  k8: 24.2000,
  k9: 12.6000,
  k10: 1.0000,
  k11: 88.5000,
  k12: 76.9000,
  k13: 65.3000,
  k14: 53.7000,
  k15: 42.1000,
  k16: 30.5000,
  k17: 18.9000,
  k18: 7.3000,
  k19: 94.8000,
  k20: 83.2000,
  k21: 71.6000,
  k22: 60.0000,
  k23: 48.4000,
  k24: 36.8000,
  k25: 25.2000,
  k26: 13.6000,
  k27: 2.0000,
  k28: 89.5000,
  k29: 77.9000,
  k30: 66.3000,
  k31: 54.7000,
  k32: 43.1000,
  k33: 31.5000,
  k34: 19.9000,
  k35: 8.3000,
  k36: 95.8000,
  k37: 84.2000,
  k38: 72.6000,
  k39: 61.0000,
  k40: 49.4000,
  k41: 37.8000,
  k42: 26.2000,
  k43: 14.6000,
  k44: 3.0000,
  k45: 90.5000,
  k46: 78.9000,
  k47: 67.3000,
  k48: 55.7000,
  k49: 44.1000,
  k50: 32.5000,
  k51: 20.9000,
  k52: 9.3000,
  k53: 96.8000,
  k54: 85.2000,
  k55: 73.6000,
  k56: 62.0000,
  k57: 50.4000,
  k58: 38.8000,
  k59: 27.2000,
  k60: 15.6000,
  k61: 4.0000,
  k62: 91.5000,
  k63: 79.9000,
  k64: 68.3000,
  k65: 56.7000,
  k66: 45.1000,
  k67: 33.5000,
  k68: 21.9000,
  k69: 10.3000,
  k70: 97.8000,
  k71: 86.2000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_097_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_097_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_097_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_097_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_097_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_097_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_097_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_097_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_097_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_097_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_097_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_097_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
