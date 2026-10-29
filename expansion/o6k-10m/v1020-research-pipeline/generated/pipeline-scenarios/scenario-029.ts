import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 029 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_029_META = {
  id: 'pipeline_029',
  regionId: 'TAS' as V1020RpipeRegionId,
  primarySystem: 'finance' as V1020RpipeSystemDomain,
  transferBand: 'recovering' as V1020RpipeTransferBand,
  seed: 25474,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_029_COEF = {
  k0: 92.9000,
  k1: 63.7000,
  k2: 34.5000,
  k3: 5.3000,
  k4: 75.2000,
  k5: 46.0000,
  k6: 16.8000,
  k7: 86.7000,
  k8: 57.5000,
  k9: 28.3000,
  k10: 98.2000,
  k11: 69.0000,
  k12: 39.8000,
  k13: 10.6000,
  k14: 80.5000,
  k15: 51.3000,
  k16: 22.1000,
  k17: 92.0000,
  k18: 62.8000,
  k19: 33.6000,
  k20: 4.4000,
  k21: 74.3000,
  k22: 45.1000,
  k23: 15.9000,
  k24: 85.8000,
  k25: 56.6000,
  k26: 27.4000,
  k27: 97.3000,
  k28: 68.1000,
  k29: 38.9000,
  k30: 9.7000,
  k31: 79.6000,
  k32: 50.4000,
  k33: 21.2000,
  k34: 91.1000,
  k35: 61.9000,
  k36: 32.7000,
  k37: 3.5000,
  k38: 73.4000,
  k39: 44.2000,
  k40: 15.0000,
  k41: 84.9000,
  k42: 55.7000,
  k43: 26.5000,
  k44: 96.4000,
  k45: 67.2000,
  k46: 38.0000,
  k47: 8.8000,
  k48: 78.7000,
  k49: 49.5000,
  k50: 20.3000,
  k51: 90.2000,
  k52: 61.0000,
  k53: 31.8000,
  k54: 2.6000,
  k55: 72.5000,
  k56: 43.3000,
  k57: 14.1000,
  k58: 84.0000,
  k59: 54.8000,
  k60: 25.6000,
  k61: 95.5000,
  k62: 66.3000,
  k63: 37.1000,
  k64: 7.9000,
  k65: 77.8000,
  k66: 48.6000,
  k67: 19.4000,
  k68: 89.3000,
  k69: 60.1000,
  k70: 30.9000,
  k71: 1.7000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_029_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_029_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_029_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_029_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_029_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_029_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_029_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_029_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_029_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_029_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_029_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_029_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
