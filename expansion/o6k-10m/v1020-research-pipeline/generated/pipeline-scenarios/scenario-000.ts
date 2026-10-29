import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 000 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_000_META = {
  id: 'pipeline_000',
  regionId: 'NSW' as V1020RpipeRegionId,
  primarySystem: 'freight' as V1020RpipeSystemDomain,
  transferBand: 'latent' as V1020RpipeTransferBand,
  seed: 41,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_000_COEF = {
  k0: 28.7000,
  k1: 32.8000,
  k2: 36.9000,
  k3: 41.0000,
  k4: 45.1000,
  k5: 49.2000,
  k6: 53.3000,
  k7: 57.4000,
  k8: 61.5000,
  k9: 65.6000,
  k10: 69.7000,
  k11: 73.8000,
  k12: 77.9000,
  k13: 82.0000,
  k14: 86.1000,
  k15: 90.2000,
  k16: 94.3000,
  k17: 98.4000,
  k18: 3.4000,
  k19: 7.5000,
  k20: 11.6000,
  k21: 15.7000,
  k22: 19.8000,
  k23: 23.9000,
  k24: 28.0000,
  k25: 32.1000,
  k26: 36.2000,
  k27: 40.3000,
  k28: 44.4000,
  k29: 48.5000,
  k30: 52.6000,
  k31: 56.7000,
  k32: 60.8000,
  k33: 64.9000,
  k34: 69.0000,
  k35: 73.1000,
  k36: 77.2000,
  k37: 81.3000,
  k38: 85.4000,
  k39: 89.5000,
  k40: 93.6000,
  k41: 97.7000,
  k42: 2.7000,
  k43: 6.8000,
  k44: 10.9000,
  k45: 15.0000,
  k46: 19.1000,
  k47: 23.2000,
  k48: 27.3000,
  k49: 31.4000,
  k50: 35.5000,
  k51: 39.6000,
  k52: 43.7000,
  k53: 47.8000,
  k54: 51.9000,
  k55: 56.0000,
  k56: 60.1000,
  k57: 64.2000,
  k58: 68.3000,
  k59: 72.4000,
  k60: 76.5000,
  k61: 80.6000,
  k62: 84.7000,
  k63: 88.8000,
  k64: 92.9000,
  k65: 97.0000,
  k66: 2.0000,
  k67: 6.1000,
  k68: 10.2000,
  k69: 14.3000,
  k70: 18.4000,
  k71: 22.5000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_000_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_000_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_000_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_000_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_000_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_000_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_000_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_000_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_000_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_000_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_000_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_000_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
