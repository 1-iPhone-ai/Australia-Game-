import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 011 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_011_META = {
  id: 'pipeline_011',
  regionId: 'WA' as V1020RpipeRegionId,
  primarySystem: 'energy' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 9688,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_011_COEF = {
  k0: 42.8000,
  k1: 20.6000,
  k2: 97.5000,
  k3: 75.3000,
  k4: 53.1000,
  k5: 30.9000,
  k6: 8.7000,
  k7: 85.6000,
  k8: 63.4000,
  k9: 41.2000,
  k10: 19.0000,
  k11: 95.9000,
  k12: 73.7000,
  k13: 51.5000,
  k14: 29.3000,
  k15: 7.1000,
  k16: 84.0000,
  k17: 61.8000,
  k18: 39.6000,
  k19: 17.4000,
  k20: 94.3000,
  k21: 72.1000,
  k22: 49.9000,
  k23: 27.7000,
  k24: 5.5000,
  k25: 82.4000,
  k26: 60.2000,
  k27: 38.0000,
  k28: 15.8000,
  k29: 92.7000,
  k30: 70.5000,
  k31: 48.3000,
  k32: 26.1000,
  k33: 3.9000,
  k34: 80.8000,
  k35: 58.6000,
  k36: 36.4000,
  k37: 14.2000,
  k38: 91.1000,
  k39: 68.9000,
  k40: 46.7000,
  k41: 24.5000,
  k42: 2.3000,
  k43: 79.2000,
  k44: 57.0000,
  k45: 34.8000,
  k46: 12.6000,
  k47: 89.5000,
  k48: 67.3000,
  k49: 45.1000,
  k50: 22.9000,
  k51: 0.7000,
  k52: 77.6000,
  k53: 55.4000,
  k54: 33.2000,
  k55: 11.0000,
  k56: 87.9000,
  k57: 65.7000,
  k58: 43.5000,
  k59: 21.3000,
  k60: 98.2000,
  k61: 76.0000,
  k62: 53.8000,
  k63: 31.6000,
  k64: 9.4000,
  k65: 86.3000,
  k66: 64.1000,
  k67: 41.9000,
  k68: 19.7000,
  k69: 96.6000,
  k70: 74.4000,
  k71: 52.2000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_011_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_011_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_011_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_011_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_011_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_011_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_011_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_011_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_011_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_011_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_011_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_011_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
