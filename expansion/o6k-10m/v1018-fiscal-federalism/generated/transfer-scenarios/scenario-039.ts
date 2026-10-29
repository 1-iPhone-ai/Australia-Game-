import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 039 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_039_META = {
  id: 'transfer_039',
  regionId: 'ACT' as V1018FfedRegionId,
  primarySystem: 'finance' as V1018FfedSystemDomain,
  transferBand: 'recovering' as V1018FfedTransferBand,
  seed: 34244,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_039_COEF = {
  k0: 87.7000,
  k1: 43.6000,
  k2: 98.6000,
  k3: 54.5000,
  k4: 10.4000,
  k5: 65.4000,
  k6: 21.3000,
  k7: 76.3000,
  k8: 32.2000,
  k9: 87.2000,
  k10: 43.1000,
  k11: 98.1000,
  k12: 54.0000,
  k13: 9.9000,
  k14: 64.9000,
  k15: 20.8000,
  k16: 75.8000,
  k17: 31.7000,
  k18: 86.7000,
  k19: 42.6000,
  k20: 97.6000,
  k21: 53.5000,
  k22: 9.4000,
  k23: 64.4000,
  k24: 20.3000,
  k25: 75.3000,
  k26: 31.2000,
  k27: 86.2000,
  k28: 42.1000,
  k29: 97.1000,
  k30: 53.0000,
  k31: 8.9000,
  k32: 63.9000,
  k33: 19.8000,
  k34: 74.8000,
  k35: 30.7000,
  k36: 85.7000,
  k37: 41.6000,
  k38: 96.6000,
  k39: 52.5000,
  k40: 8.4000,
  k41: 63.4000,
  k42: 19.3000,
  k43: 74.3000,
  k44: 30.2000,
  k45: 85.2000,
  k46: 41.1000,
  k47: 96.1000,
  k48: 52.0000,
  k49: 7.9000,
  k50: 62.9000,
  k51: 18.8000,
  k52: 73.8000,
  k53: 29.7000,
  k54: 84.7000,
  k55: 40.6000,
  k56: 95.6000,
  k57: 51.5000,
  k58: 7.4000,
  k59: 62.4000,
  k60: 18.3000,
  k61: 73.3000,
  k62: 29.2000,
  k63: 84.2000,
  k64: 40.1000,
  k65: 95.1000,
  k66: 51.0000,
  k67: 6.9000,
  k68: 61.9000,
  k69: 17.8000,
  k70: 72.8000,
  k71: 28.7000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_039_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_039_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_039_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_039_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_039_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_039_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_039_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_039_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_039_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_039_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_039_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_039_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
