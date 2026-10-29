import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 042 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_042_META = {
  id: 'pipeline_042',
  regionId: 'QLD' as V1020RpipeRegionId,
  primarySystem: 'water' as V1020RpipeSystemDomain,
  transferBand: 'active' as V1020RpipeTransferBand,
  seed: 36875,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_042_COEF = {
  k0: 46.5000,
  k1: 67.3000,
  k2: 88.1000,
  k3: 9.8000,
  k4: 30.6000,
  k5: 51.4000,
  k6: 72.2000,
  k7: 93.0000,
  k8: 14.7000,
  k9: 35.5000,
  k10: 56.3000,
  k11: 77.1000,
  k12: 97.9000,
  k13: 19.6000,
  k14: 40.4000,
  k15: 61.2000,
  k16: 82.0000,
  k17: 3.7000,
  k18: 24.5000,
  k19: 45.3000,
  k20: 66.1000,
  k21: 86.9000,
  k22: 8.6000,
  k23: 29.4000,
  k24: 50.2000,
  k25: 71.0000,
  k26: 91.8000,
  k27: 13.5000,
  k28: 34.3000,
  k29: 55.1000,
  k30: 75.9000,
  k31: 96.7000,
  k32: 18.4000,
  k33: 39.2000,
  k34: 60.0000,
  k35: 80.8000,
  k36: 2.5000,
  k37: 23.3000,
  k38: 44.1000,
  k39: 64.9000,
  k40: 85.7000,
  k41: 7.4000,
  k42: 28.2000,
  k43: 49.0000,
  k44: 69.8000,
  k45: 90.6000,
  k46: 12.3000,
  k47: 33.1000,
  k48: 53.9000,
  k49: 74.7000,
  k50: 95.5000,
  k51: 17.2000,
  k52: 38.0000,
  k53: 58.8000,
  k54: 79.6000,
  k55: 1.3000,
  k56: 22.1000,
  k57: 42.9000,
  k58: 63.7000,
  k59: 84.5000,
  k60: 6.2000,
  k61: 27.0000,
  k62: 47.8000,
  k63: 68.6000,
  k64: 89.4000,
  k65: 11.1000,
  k66: 31.9000,
  k67: 52.7000,
  k68: 73.5000,
  k69: 94.3000,
  k70: 16.0000,
  k71: 36.8000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_042_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_042_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_042_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_042_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_042_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_042_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_042_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_042_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_042_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_042_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_042_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_042_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
