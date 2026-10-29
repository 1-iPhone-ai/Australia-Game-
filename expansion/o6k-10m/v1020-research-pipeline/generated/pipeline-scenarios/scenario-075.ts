import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 075 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_075_META = {
  id: 'pipeline_075',
  regionId: 'WA' as V1020RpipeRegionId,
  primarySystem: 'pharma' as V1020RpipeSystemDomain,
  transferBand: 'latent' as V1020RpipeTransferBand,
  seed: 65816,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_075_COEF = {
  k0: 88.8000,
  k1: 30.7000,
  k2: 71.7000,
  k3: 13.6000,
  k4: 54.6000,
  k5: 95.6000,
  k6: 37.5000,
  k7: 78.5000,
  k8: 20.4000,
  k9: 61.4000,
  k10: 3.3000,
  k11: 44.3000,
  k12: 85.3000,
  k13: 27.2000,
  k14: 68.2000,
  k15: 10.1000,
  k16: 51.1000,
  k17: 92.1000,
  k18: 34.0000,
  k19: 75.0000,
  k20: 16.9000,
  k21: 57.9000,
  k22: 98.9000,
  k23: 40.8000,
  k24: 81.8000,
  k25: 23.7000,
  k26: 64.7000,
  k27: 6.6000,
  k28: 47.6000,
  k29: 88.6000,
  k30: 30.5000,
  k31: 71.5000,
  k32: 13.4000,
  k33: 54.4000,
  k34: 95.4000,
  k35: 37.3000,
  k36: 78.3000,
  k37: 20.2000,
  k38: 61.2000,
  k39: 3.1000,
  k40: 44.1000,
  k41: 85.1000,
  k42: 27.0000,
  k43: 68.0000,
  k44: 9.9000,
  k45: 50.9000,
  k46: 91.9000,
  k47: 33.8000,
  k48: 74.8000,
  k49: 16.7000,
  k50: 57.7000,
  k51: 98.7000,
  k52: 40.6000,
  k53: 81.6000,
  k54: 23.5000,
  k55: 64.5000,
  k56: 6.4000,
  k57: 47.4000,
  k58: 88.4000,
  k59: 30.3000,
  k60: 71.3000,
  k61: 13.2000,
  k62: 54.2000,
  k63: 95.2000,
  k64: 37.1000,
  k65: 78.1000,
  k66: 20.0000,
  k67: 61.0000,
  k68: 2.9000,
  k69: 43.9000,
  k70: 84.9000,
  k71: 26.8000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_075_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_075_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_075_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_075_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_075_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_075_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_075_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_075_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_075_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_075_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_075_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_075_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
