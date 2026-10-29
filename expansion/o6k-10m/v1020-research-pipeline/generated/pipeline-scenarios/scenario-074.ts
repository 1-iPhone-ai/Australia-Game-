import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 074 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_074_META = {
  id: 'pipeline_074',
  regionId: 'QLD' as V1020RpipeRegionId,
  primarySystem: 'trade' as V1020RpipeSystemDomain,
  transferBand: 'recovering' as V1020RpipeTransferBand,
  seed: 64939,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_074_COEF = {
  k0: 69.5000,
  k1: 22.8000,
  k2: 75.2000,
  k3: 28.5000,
  k4: 80.9000,
  k5: 34.2000,
  k6: 86.6000,
  k7: 39.9000,
  k8: 92.3000,
  k9: 45.6000,
  k10: 98.0000,
  k11: 51.3000,
  k12: 4.6000,
  k13: 57.0000,
  k14: 10.3000,
  k15: 62.7000,
  k16: 16.0000,
  k17: 68.4000,
  k18: 21.7000,
  k19: 74.1000,
  k20: 27.4000,
  k21: 79.8000,
  k22: 33.1000,
  k23: 85.5000,
  k24: 38.8000,
  k25: 91.2000,
  k26: 44.5000,
  k27: 96.9000,
  k28: 50.2000,
  k29: 3.5000,
  k30: 55.9000,
  k31: 9.2000,
  k32: 61.6000,
  k33: 14.9000,
  k34: 67.3000,
  k35: 20.6000,
  k36: 73.0000,
  k37: 26.3000,
  k38: 78.7000,
  k39: 32.0000,
  k40: 84.4000,
  k41: 37.7000,
  k42: 90.1000,
  k43: 43.4000,
  k44: 95.8000,
  k45: 49.1000,
  k46: 2.4000,
  k47: 54.8000,
  k48: 8.1000,
  k49: 60.5000,
  k50: 13.8000,
  k51: 66.2000,
  k52: 19.5000,
  k53: 71.9000,
  k54: 25.2000,
  k55: 77.6000,
  k56: 30.9000,
  k57: 83.3000,
  k58: 36.6000,
  k59: 89.0000,
  k60: 42.3000,
  k61: 94.7000,
  k62: 48.0000,
  k63: 1.3000,
  k64: 53.7000,
  k65: 7.0000,
  k66: 59.4000,
  k67: 12.7000,
  k68: 65.1000,
  k69: 18.4000,
  k70: 70.8000,
  k71: 24.1000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_074_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_074_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_074_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_074_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_074_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_074_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_074_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_074_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_074_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_074_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_074_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_074_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
