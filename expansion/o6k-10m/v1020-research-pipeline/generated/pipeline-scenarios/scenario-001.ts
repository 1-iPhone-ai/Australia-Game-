import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 001 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_001_META = {
  id: 'pipeline_001',
  regionId: 'VIC' as V1020RpipeRegionId,
  primarySystem: 'energy' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 918,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_001_COEF = {
  k0: 48.0000,
  k1: 40.7000,
  k2: 33.4000,
  k3: 26.1000,
  k4: 18.8000,
  k5: 11.5000,
  k6: 4.2000,
  k7: 96.0000,
  k8: 88.7000,
  k9: 81.4000,
  k10: 74.1000,
  k11: 66.8000,
  k12: 59.5000,
  k13: 52.2000,
  k14: 44.9000,
  k15: 37.6000,
  k16: 30.3000,
  k17: 23.0000,
  k18: 15.7000,
  k19: 8.4000,
  k20: 1.1000,
  k21: 92.9000,
  k22: 85.6000,
  k23: 78.3000,
  k24: 71.0000,
  k25: 63.7000,
  k26: 56.4000,
  k27: 49.1000,
  k28: 41.8000,
  k29: 34.5000,
  k30: 27.2000,
  k31: 19.9000,
  k32: 12.6000,
  k33: 5.3000,
  k34: 97.1000,
  k35: 89.8000,
  k36: 82.5000,
  k37: 75.2000,
  k38: 67.9000,
  k39: 60.6000,
  k40: 53.3000,
  k41: 46.0000,
  k42: 38.7000,
  k43: 31.4000,
  k44: 24.1000,
  k45: 16.8000,
  k46: 9.5000,
  k47: 2.2000,
  k48: 94.0000,
  k49: 86.7000,
  k50: 79.4000,
  k51: 72.1000,
  k52: 64.8000,
  k53: 57.5000,
  k54: 50.2000,
  k55: 42.9000,
  k56: 35.6000,
  k57: 28.3000,
  k58: 21.0000,
  k59: 13.7000,
  k60: 6.4000,
  k61: 98.2000,
  k62: 90.9000,
  k63: 83.6000,
  k64: 76.3000,
  k65: 69.0000,
  k66: 61.7000,
  k67: 54.4000,
  k68: 47.1000,
  k69: 39.8000,
  k70: 32.5000,
  k71: 25.2000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_001_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_001_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_001_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_001_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_001_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_001_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_001_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_001_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_001_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_001_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_001_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_001_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
