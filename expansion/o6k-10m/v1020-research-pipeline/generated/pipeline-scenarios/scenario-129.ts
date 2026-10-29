import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 129 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_129_META = {
  id: 'pipeline_129',
  regionId: 'VIC' as V1020RpipeRegionId,
  primarySystem: 'finance' as V1020RpipeSystemDomain,
  transferBand: 'recovering' as V1020RpipeTransferBand,
  seed: 113174,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_129_COEF = {
  k0: 40.9000,
  k1: 60.9000,
  k2: 80.9000,
  k3: 1.8000,
  k4: 21.8000,
  k5: 41.8000,
  k6: 61.8000,
  k7: 81.8000,
  k8: 2.7000,
  k9: 22.7000,
  k10: 42.7000,
  k11: 62.7000,
  k12: 82.7000,
  k13: 3.6000,
  k14: 23.6000,
  k15: 43.6000,
  k16: 63.6000,
  k17: 83.6000,
  k18: 4.5000,
  k19: 24.5000,
  k20: 44.5000,
  k21: 64.5000,
  k22: 84.5000,
  k23: 5.4000,
  k24: 25.4000,
  k25: 45.4000,
  k26: 65.4000,
  k27: 85.4000,
  k28: 6.3000,
  k29: 26.3000,
  k30: 46.3000,
  k31: 66.3000,
  k32: 86.3000,
  k33: 7.2000,
  k34: 27.2000,
  k35: 47.2000,
  k36: 67.2000,
  k37: 87.2000,
  k38: 8.1000,
  k39: 28.1000,
  k40: 48.1000,
  k41: 68.1000,
  k42: 88.1000,
  k43: 9.0000,
  k44: 29.0000,
  k45: 49.0000,
  k46: 69.0000,
  k47: 89.0000,
  k48: 9.9000,
  k49: 29.9000,
  k50: 49.9000,
  k51: 69.9000,
  k52: 89.9000,
  k53: 10.8000,
  k54: 30.8000,
  k55: 50.8000,
  k56: 70.8000,
  k57: 90.8000,
  k58: 11.7000,
  k59: 31.7000,
  k60: 51.7000,
  k61: 71.7000,
  k62: 91.7000,
  k63: 12.6000,
  k64: 32.6000,
  k65: 52.6000,
  k66: 72.6000,
  k67: 92.6000,
  k68: 13.5000,
  k69: 33.5000,
  k70: 53.5000,
  k71: 73.5000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_129_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_129_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_129_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_129_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_129_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_129_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_129_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_129_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_129_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_129_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_129_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_129_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
