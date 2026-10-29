import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 054 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_054_META = {
  id: 'pipeline_054',
  regionId: 'NT' as V1020RpipeRegionId,
  primarySystem: 'trade' as V1020RpipeSystemDomain,
  transferBand: 'recovering' as V1020RpipeTransferBand,
  seed: 47399,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_054_COEF = {
  k0: 79.9000,
  k1: 63.0000,
  k2: 46.1000,
  k3: 29.2000,
  k4: 12.3000,
  k5: 94.5000,
  k6: 77.6000,
  k7: 60.7000,
  k8: 43.8000,
  k9: 26.9000,
  k10: 10.0000,
  k11: 92.2000,
  k12: 75.3000,
  k13: 58.4000,
  k14: 41.5000,
  k15: 24.6000,
  k16: 7.7000,
  k17: 89.9000,
  k18: 73.0000,
  k19: 56.1000,
  k20: 39.2000,
  k21: 22.3000,
  k22: 5.4000,
  k23: 87.6000,
  k24: 70.7000,
  k25: 53.8000,
  k26: 36.9000,
  k27: 20.0000,
  k28: 3.1000,
  k29: 85.3000,
  k30: 68.4000,
  k31: 51.5000,
  k32: 34.6000,
  k33: 17.7000,
  k34: 0.8000,
  k35: 83.0000,
  k36: 66.1000,
  k37: 49.2000,
  k38: 32.3000,
  k39: 15.4000,
  k40: 97.6000,
  k41: 80.7000,
  k42: 63.8000,
  k43: 46.9000,
  k44: 30.0000,
  k45: 13.1000,
  k46: 95.3000,
  k47: 78.4000,
  k48: 61.5000,
  k49: 44.6000,
  k50: 27.7000,
  k51: 10.8000,
  k52: 93.0000,
  k53: 76.1000,
  k54: 59.2000,
  k55: 42.3000,
  k56: 25.4000,
  k57: 8.5000,
  k58: 90.7000,
  k59: 73.8000,
  k60: 56.9000,
  k61: 40.0000,
  k62: 23.1000,
  k63: 6.2000,
  k64: 88.4000,
  k65: 71.5000,
  k66: 54.6000,
  k67: 37.7000,
  k68: 20.8000,
  k69: 3.9000,
  k70: 86.1000,
  k71: 69.2000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_054_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_054_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_054_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_054_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_054_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_054_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_054_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_054_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_054_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_054_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_054_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_054_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
