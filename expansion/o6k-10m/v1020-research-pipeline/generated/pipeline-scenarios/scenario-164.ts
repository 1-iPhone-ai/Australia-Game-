import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 164 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_164_META = {
  id: 'pipeline_164',
  regionId: 'SA' as V1020RpipeRegionId,
  primarySystem: 'trade' as V1020RpipeSystemDomain,
  transferBand: 'recovering' as V1020RpipeTransferBand,
  seed: 143869,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_164_COEF = {
  k0: 22.7000,
  k1: 40.1000,
  k2: 57.5000,
  k3: 74.9000,
  k4: 92.3000,
  k5: 10.6000,
  k6: 28.0000,
  k7: 45.4000,
  k8: 62.8000,
  k9: 80.2000,
  k10: 97.6000,
  k11: 15.9000,
  k12: 33.3000,
  k13: 50.7000,
  k14: 68.1000,
  k15: 85.5000,
  k16: 3.8000,
  k17: 21.2000,
  k18: 38.6000,
  k19: 56.0000,
  k20: 73.4000,
  k21: 90.8000,
  k22: 9.1000,
  k23: 26.5000,
  k24: 43.9000,
  k25: 61.3000,
  k26: 78.7000,
  k27: 96.1000,
  k28: 14.4000,
  k29: 31.8000,
  k30: 49.2000,
  k31: 66.6000,
  k32: 84.0000,
  k33: 2.3000,
  k34: 19.7000,
  k35: 37.1000,
  k36: 54.5000,
  k37: 71.9000,
  k38: 89.3000,
  k39: 7.6000,
  k40: 25.0000,
  k41: 42.4000,
  k42: 59.8000,
  k43: 77.2000,
  k44: 94.6000,
  k45: 12.9000,
  k46: 30.3000,
  k47: 47.7000,
  k48: 65.1000,
  k49: 82.5000,
  k50: 0.8000,
  k51: 18.2000,
  k52: 35.6000,
  k53: 53.0000,
  k54: 70.4000,
  k55: 87.8000,
  k56: 6.1000,
  k57: 23.5000,
  k58: 40.9000,
  k59: 58.3000,
  k60: 75.7000,
  k61: 93.1000,
  k62: 11.4000,
  k63: 28.8000,
  k64: 46.2000,
  k65: 63.6000,
  k66: 81.0000,
  k67: 98.4000,
  k68: 16.7000,
  k69: 34.1000,
  k70: 51.5000,
  k71: 68.9000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_164_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_164_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_164_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_164_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_164_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_164_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_164_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_164_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_164_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_164_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_164_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_164_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
