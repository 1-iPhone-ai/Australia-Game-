import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 137 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_137_META = {
  id: 'transfer_137',
  regionId: 'VIC' as V1018FfedRegionId,
  primarySystem: 'industrial' as V1018FfedSystemDomain,
  transferBand: 'active' as V1018FfedTransferBand,
  seed: 120190,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_137_COEF = {
  k0: 96.2000,
  k1: 25.0000,
  k2: 52.9000,
  k3: 80.8000,
  k4: 9.6000,
  k5: 37.5000,
  k6: 65.4000,
  k7: 93.3000,
  k8: 22.1000,
  k9: 50.0000,
  k10: 77.9000,
  k11: 6.7000,
  k12: 34.6000,
  k13: 62.5000,
  k14: 90.4000,
  k15: 19.2000,
  k16: 47.1000,
  k17: 75.0000,
  k18: 3.8000,
  k19: 31.7000,
  k20: 59.6000,
  k21: 87.5000,
  k22: 16.3000,
  k23: 44.2000,
  k24: 72.1000,
  k25: 0.9000,
  k26: 28.8000,
  k27: 56.7000,
  k28: 84.6000,
  k29: 13.4000,
  k30: 41.3000,
  k31: 69.2000,
  k32: 97.1000,
  k33: 25.9000,
  k34: 53.8000,
  k35: 81.7000,
  k36: 10.5000,
  k37: 38.4000,
  k38: 66.3000,
  k39: 94.2000,
  k40: 23.0000,
  k41: 50.9000,
  k42: 78.8000,
  k43: 7.6000,
  k44: 35.5000,
  k45: 63.4000,
  k46: 91.3000,
  k47: 20.1000,
  k48: 48.0000,
  k49: 75.9000,
  k50: 4.7000,
  k51: 32.6000,
  k52: 60.5000,
  k53: 88.4000,
  k54: 17.2000,
  k55: 45.1000,
  k56: 73.0000,
  k57: 1.8000,
  k58: 29.7000,
  k59: 57.6000,
  k60: 85.5000,
  k61: 14.3000,
  k62: 42.2000,
  k63: 70.1000,
  k64: 98.0000,
  k65: 26.8000,
  k66: 54.7000,
  k67: 82.6000,
  k68: 11.4000,
  k69: 39.3000,
  k70: 67.2000,
  k71: 95.1000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_137_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_137_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_137_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_137_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_137_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_137_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_137_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_137_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_137_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_137_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_137_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_137_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
