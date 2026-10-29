import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 071 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_071_META = {
  id: 'pipeline_071',
  regionId: 'ACT' as V1020RpipeRegionId,
  primarySystem: 'energy' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 62308,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_071_COEF = {
  k0: 11.6000,
  k1: 98.2000,
  k2: 85.7000,
  k3: 73.2000,
  k4: 60.7000,
  k5: 48.2000,
  k6: 35.7000,
  k7: 23.2000,
  k8: 10.7000,
  k9: 97.3000,
  k10: 84.8000,
  k11: 72.3000,
  k12: 59.8000,
  k13: 47.3000,
  k14: 34.8000,
  k15: 22.3000,
  k16: 9.8000,
  k17: 96.4000,
  k18: 83.9000,
  k19: 71.4000,
  k20: 58.9000,
  k21: 46.4000,
  k22: 33.9000,
  k23: 21.4000,
  k24: 8.9000,
  k25: 95.5000,
  k26: 83.0000,
  k27: 70.5000,
  k28: 58.0000,
  k29: 45.5000,
  k30: 33.0000,
  k31: 20.5000,
  k32: 8.0000,
  k33: 94.6000,
  k34: 82.1000,
  k35: 69.6000,
  k36: 57.1000,
  k37: 44.6000,
  k38: 32.1000,
  k39: 19.6000,
  k40: 7.1000,
  k41: 93.7000,
  k42: 81.2000,
  k43: 68.7000,
  k44: 56.2000,
  k45: 43.7000,
  k46: 31.2000,
  k47: 18.7000,
  k48: 6.2000,
  k49: 92.8000,
  k50: 80.3000,
  k51: 67.8000,
  k52: 55.3000,
  k53: 42.8000,
  k54: 30.3000,
  k55: 17.8000,
  k56: 5.3000,
  k57: 91.9000,
  k58: 79.4000,
  k59: 66.9000,
  k60: 54.4000,
  k61: 41.9000,
  k62: 29.4000,
  k63: 16.9000,
  k64: 4.4000,
  k65: 91.0000,
  k66: 78.5000,
  k67: 66.0000,
  k68: 53.5000,
  k69: 41.0000,
  k70: 28.5000,
  k71: 16.0000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_071_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_071_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_071_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_071_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_071_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_071_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_071_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_071_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_071_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_071_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_071_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_071_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
