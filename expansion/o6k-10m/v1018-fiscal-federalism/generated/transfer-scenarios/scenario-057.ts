import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 057 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_057_META = {
  id: 'transfer_057',
  regionId: 'VIC' as V1018FfedRegionId,
  primarySystem: 'industrial' as V1018FfedSystemDomain,
  transferBand: 'active' as V1018FfedTransferBand,
  seed: 50030,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_057_COEF = {
  k0: 38.7000,
  k1: 86.7000,
  k2: 35.6000,
  k3: 83.6000,
  k4: 32.5000,
  k5: 80.5000,
  k6: 29.4000,
  k7: 77.4000,
  k8: 26.3000,
  k9: 74.3000,
  k10: 23.2000,
  k11: 71.2000,
  k12: 20.1000,
  k13: 68.1000,
  k14: 17.0000,
  k15: 65.0000,
  k16: 13.9000,
  k17: 61.9000,
  k18: 10.8000,
  k19: 58.8000,
  k20: 7.7000,
  k21: 55.7000,
  k22: 4.6000,
  k23: 52.6000,
  k24: 1.5000,
  k25: 49.5000,
  k26: 97.5000,
  k27: 46.4000,
  k28: 94.4000,
  k29: 43.3000,
  k30: 91.3000,
  k31: 40.2000,
  k32: 88.2000,
  k33: 37.1000,
  k34: 85.1000,
  k35: 34.0000,
  k36: 82.0000,
  k37: 30.9000,
  k38: 78.9000,
  k39: 27.8000,
  k40: 75.8000,
  k41: 24.7000,
  k42: 72.7000,
  k43: 21.6000,
  k44: 69.6000,
  k45: 18.5000,
  k46: 66.5000,
  k47: 15.4000,
  k48: 63.4000,
  k49: 12.3000,
  k50: 60.3000,
  k51: 9.2000,
  k52: 57.2000,
  k53: 6.1000,
  k54: 54.1000,
  k55: 3.0000,
  k56: 51.0000,
  k57: 99.0000,
  k58: 47.9000,
  k59: 95.9000,
  k60: 44.8000,
  k61: 92.8000,
  k62: 41.7000,
  k63: 89.7000,
  k64: 38.6000,
  k65: 86.6000,
  k66: 35.5000,
  k67: 83.5000,
  k68: 32.4000,
  k69: 80.4000,
  k70: 29.3000,
  k71: 77.3000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_057_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_057_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_057_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_057_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_057_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_057_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_057_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_057_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_057_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_057_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_057_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_057_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
