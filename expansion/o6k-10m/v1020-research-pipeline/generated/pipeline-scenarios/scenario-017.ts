import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 017 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_017_META = {
  id: 'pipeline_017',
  regionId: 'VIC' as V1020RpipeRegionId,
  primarySystem: 'industrial' as V1020RpipeSystemDomain,
  transferBand: 'active' as V1020RpipeTransferBand,
  seed: 14950,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_017_COEF = {
  k0: 59.5000,
  k1: 68.0000,
  k2: 76.5000,
  k3: 85.0000,
  k4: 93.5000,
  k5: 2.9000,
  k6: 11.4000,
  k7: 19.9000,
  k8: 28.4000,
  k9: 36.9000,
  k10: 45.4000,
  k11: 53.9000,
  k12: 62.4000,
  k13: 70.9000,
  k14: 79.4000,
  k15: 87.9000,
  k16: 96.4000,
  k17: 5.8000,
  k18: 14.3000,
  k19: 22.8000,
  k20: 31.3000,
  k21: 39.8000,
  k22: 48.3000,
  k23: 56.8000,
  k24: 65.3000,
  k25: 73.8000,
  k26: 82.3000,
  k27: 90.8000,
  k28: 0.2000,
  k29: 8.7000,
  k30: 17.2000,
  k31: 25.7000,
  k32: 34.2000,
  k33: 42.7000,
  k34: 51.2000,
  k35: 59.7000,
  k36: 68.2000,
  k37: 76.7000,
  k38: 85.2000,
  k39: 93.7000,
  k40: 3.1000,
  k41: 11.6000,
  k42: 20.1000,
  k43: 28.6000,
  k44: 37.1000,
  k45: 45.6000,
  k46: 54.1000,
  k47: 62.6000,
  k48: 71.1000,
  k49: 79.6000,
  k50: 88.1000,
  k51: 96.6000,
  k52: 6.0000,
  k53: 14.5000,
  k54: 23.0000,
  k55: 31.5000,
  k56: 40.0000,
  k57: 48.5000,
  k58: 57.0000,
  k59: 65.5000,
  k60: 74.0000,
  k61: 82.5000,
  k62: 91.0000,
  k63: 0.4000,
  k64: 8.9000,
  k65: 17.4000,
  k66: 25.9000,
  k67: 34.4000,
  k68: 42.9000,
  k69: 51.4000,
  k70: 59.9000,
  k71: 68.4000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_017_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_017_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_017_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_017_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_017_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_017_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_017_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_017_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_017_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_017_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_017_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_017_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
