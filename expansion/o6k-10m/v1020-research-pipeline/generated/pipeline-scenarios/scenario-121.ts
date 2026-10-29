import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 121 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_121_META = {
  id: 'pipeline_121',
  regionId: 'VIC' as V1020RpipeRegionId,
  primarySystem: 'energy' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 106158,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_121_COEF = {
  k0: 84.7000,
  k1: 96.8000,
  k2: 9.8000,
  k3: 21.9000,
  k4: 34.0000,
  k5: 46.1000,
  k6: 58.2000,
  k7: 70.3000,
  k8: 82.4000,
  k9: 94.5000,
  k10: 7.5000,
  k11: 19.6000,
  k12: 31.7000,
  k13: 43.8000,
  k14: 55.9000,
  k15: 68.0000,
  k16: 80.1000,
  k17: 92.2000,
  k18: 5.2000,
  k19: 17.3000,
  k20: 29.4000,
  k21: 41.5000,
  k22: 53.6000,
  k23: 65.7000,
  k24: 77.8000,
  k25: 89.9000,
  k26: 2.9000,
  k27: 15.0000,
  k28: 27.1000,
  k29: 39.2000,
  k30: 51.3000,
  k31: 63.4000,
  k32: 75.5000,
  k33: 87.6000,
  k34: 0.6000,
  k35: 12.7000,
  k36: 24.8000,
  k37: 36.9000,
  k38: 49.0000,
  k39: 61.1000,
  k40: 73.2000,
  k41: 85.3000,
  k42: 97.4000,
  k43: 10.4000,
  k44: 22.5000,
  k45: 34.6000,
  k46: 46.7000,
  k47: 58.8000,
  k48: 70.9000,
  k49: 83.0000,
  k50: 95.1000,
  k51: 8.1000,
  k52: 20.2000,
  k53: 32.3000,
  k54: 44.4000,
  k55: 56.5000,
  k56: 68.6000,
  k57: 80.7000,
  k58: 92.8000,
  k59: 5.8000,
  k60: 17.9000,
  k61: 30.0000,
  k62: 42.1000,
  k63: 54.2000,
  k64: 66.3000,
  k65: 78.4000,
  k66: 90.5000,
  k67: 3.5000,
  k68: 15.6000,
  k69: 27.7000,
  k70: 39.8000,
  k71: 51.9000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_121_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_121_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_121_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_121_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_121_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_121_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_121_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_121_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_121_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_121_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_121_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_121_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
