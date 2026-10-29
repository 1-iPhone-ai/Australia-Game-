import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 128 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_128_META = {
  id: 'pipeline_128',
  regionId: 'NSW' as V1020RpipeRegionId,
  primarySystem: 'telecom' as V1020RpipeSystemDomain,
  transferBand: 'critical' as V1020RpipeTransferBand,
  seed: 112297,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_128_COEF = {
  k0: 21.6000,
  k1: 53.0000,
  k2: 84.4000,
  k3: 16.7000,
  k4: 48.1000,
  k5: 79.5000,
  k6: 11.8000,
  k7: 43.2000,
  k8: 74.6000,
  k9: 6.9000,
  k10: 38.3000,
  k11: 69.7000,
  k12: 2.0000,
  k13: 33.4000,
  k14: 64.8000,
  k15: 96.2000,
  k16: 28.5000,
  k17: 59.9000,
  k18: 91.3000,
  k19: 23.6000,
  k20: 55.0000,
  k21: 86.4000,
  k22: 18.7000,
  k23: 50.1000,
  k24: 81.5000,
  k25: 13.8000,
  k26: 45.2000,
  k27: 76.6000,
  k28: 8.9000,
  k29: 40.3000,
  k30: 71.7000,
  k31: 4.0000,
  k32: 35.4000,
  k33: 66.8000,
  k34: 98.2000,
  k35: 30.5000,
  k36: 61.9000,
  k37: 93.3000,
  k38: 25.6000,
  k39: 57.0000,
  k40: 88.4000,
  k41: 20.7000,
  k42: 52.1000,
  k43: 83.5000,
  k44: 15.8000,
  k45: 47.2000,
  k46: 78.6000,
  k47: 10.9000,
  k48: 42.3000,
  k49: 73.7000,
  k50: 6.0000,
  k51: 37.4000,
  k52: 68.8000,
  k53: 1.1000,
  k54: 32.5000,
  k55: 63.9000,
  k56: 95.3000,
  k57: 27.6000,
  k58: 59.0000,
  k59: 90.4000,
  k60: 22.7000,
  k61: 54.1000,
  k62: 85.5000,
  k63: 17.8000,
  k64: 49.2000,
  k65: 80.6000,
  k66: 12.9000,
  k67: 44.3000,
  k68: 75.7000,
  k69: 8.0000,
  k70: 39.4000,
  k71: 70.8000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_128_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_128_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_128_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_128_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_128_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_128_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_128_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_128_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_128_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_128_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_128_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_128_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
