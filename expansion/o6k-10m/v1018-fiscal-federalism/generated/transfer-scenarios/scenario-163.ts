import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 163 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_163_META = {
  id: 'transfer_163',
  regionId: 'WA' as V1018FfedRegionId,
  primarySystem: 'digital' as V1018FfedSystemDomain,
  transferBand: 'critical' as V1018FfedTransferBand,
  seed: 142992,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_163_COEF = {
  k0: 3.4000,
  k1: 32.2000,
  k2: 61.0000,
  k3: 89.8000,
  k4: 19.5000,
  k5: 48.3000,
  k6: 77.1000,
  k7: 6.8000,
  k8: 35.6000,
  k9: 64.4000,
  k10: 93.2000,
  k11: 22.9000,
  k12: 51.7000,
  k13: 80.5000,
  k14: 10.2000,
  k15: 39.0000,
  k16: 67.8000,
  k17: 96.6000,
  k18: 26.3000,
  k19: 55.1000,
  k20: 83.9000,
  k21: 13.6000,
  k22: 42.4000,
  k23: 71.2000,
  k24: 0.9000,
  k25: 29.7000,
  k26: 58.5000,
  k27: 87.3000,
  k28: 17.0000,
  k29: 45.8000,
  k30: 74.6000,
  k31: 4.3000,
  k32: 33.1000,
  k33: 61.9000,
  k34: 90.7000,
  k35: 20.4000,
  k36: 49.2000,
  k37: 78.0000,
  k38: 7.7000,
  k39: 36.5000,
  k40: 65.3000,
  k41: 94.1000,
  k42: 23.8000,
  k43: 52.6000,
  k44: 81.4000,
  k45: 11.1000,
  k46: 39.9000,
  k47: 68.7000,
  k48: 97.5000,
  k49: 27.2000,
  k50: 56.0000,
  k51: 84.8000,
  k52: 14.5000,
  k53: 43.3000,
  k54: 72.1000,
  k55: 1.8000,
  k56: 30.6000,
  k57: 59.4000,
  k58: 88.2000,
  k59: 17.9000,
  k60: 46.7000,
  k61: 75.5000,
  k62: 5.2000,
  k63: 34.0000,
  k64: 62.8000,
  k65: 91.6000,
  k66: 21.3000,
  k67: 50.1000,
  k68: 78.9000,
  k69: 8.6000,
  k70: 37.4000,
  k71: 66.2000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_163_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_163_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_163_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_163_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_163_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_163_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_163_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_163_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_163_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_163_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_163_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_163_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
