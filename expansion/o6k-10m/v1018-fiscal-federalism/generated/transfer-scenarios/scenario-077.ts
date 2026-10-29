import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 077 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_077_META = {
  id: 'transfer_077',
  regionId: 'TAS' as V1018FfedRegionId,
  primarySystem: 'industrial' as V1018FfedSystemDomain,
  transferBand: 'active' as V1018FfedTransferBand,
  seed: 67570,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_077_COEF = {
  k0: 28.3000,
  k1: 46.5000,
  k2: 64.7000,
  k3: 82.9000,
  k4: 2.0000,
  k5: 20.2000,
  k6: 38.4000,
  k7: 56.6000,
  k8: 74.8000,
  k9: 93.0000,
  k10: 12.1000,
  k11: 30.3000,
  k12: 48.5000,
  k13: 66.7000,
  k14: 84.9000,
  k15: 4.0000,
  k16: 22.2000,
  k17: 40.4000,
  k18: 58.6000,
  k19: 76.8000,
  k20: 95.0000,
  k21: 14.1000,
  k22: 32.3000,
  k23: 50.5000,
  k24: 68.7000,
  k25: 86.9000,
  k26: 6.0000,
  k27: 24.2000,
  k28: 42.4000,
  k29: 60.6000,
  k30: 78.8000,
  k31: 97.0000,
  k32: 16.1000,
  k33: 34.3000,
  k34: 52.5000,
  k35: 70.7000,
  k36: 88.9000,
  k37: 8.0000,
  k38: 26.2000,
  k39: 44.4000,
  k40: 62.6000,
  k41: 80.8000,
  k42: 99.0000,
  k43: 18.1000,
  k44: 36.3000,
  k45: 54.5000,
  k46: 72.7000,
  k47: 90.9000,
  k48: 10.0000,
  k49: 28.2000,
  k50: 46.4000,
  k51: 64.6000,
  k52: 82.8000,
  k53: 1.9000,
  k54: 20.1000,
  k55: 38.3000,
  k56: 56.5000,
  k57: 74.7000,
  k58: 92.9000,
  k59: 12.0000,
  k60: 30.2000,
  k61: 48.4000,
  k62: 66.6000,
  k63: 84.8000,
  k64: 3.9000,
  k65: 22.1000,
  k66: 40.3000,
  k67: 58.5000,
  k68: 76.7000,
  k69: 94.9000,
  k70: 14.0000,
  k71: 32.2000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_077_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_077_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_077_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_077_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_077_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_077_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_077_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_077_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_077_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_077_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_077_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_077_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
