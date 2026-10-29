import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 025 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_025_META = {
  id: 'transfer_025',
  regionId: 'VIC' as V1018FfedRegionId,
  primarySystem: 'pharma' as V1018FfedSystemDomain,
  transferBand: 'latent' as V1018FfedTransferBand,
  seed: 21966,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_025_COEF = {
  k0: 15.7000,
  k1: 32.1000,
  k2: 48.5000,
  k3: 64.9000,
  k4: 81.3000,
  k5: 97.7000,
  k6: 15.0000,
  k7: 31.4000,
  k8: 47.8000,
  k9: 64.2000,
  k10: 80.6000,
  k11: 97.0000,
  k12: 14.3000,
  k13: 30.7000,
  k14: 47.1000,
  k15: 63.5000,
  k16: 79.9000,
  k17: 96.3000,
  k18: 13.6000,
  k19: 30.0000,
  k20: 46.4000,
  k21: 62.8000,
  k22: 79.2000,
  k23: 95.6000,
  k24: 12.9000,
  k25: 29.3000,
  k26: 45.7000,
  k27: 62.1000,
  k28: 78.5000,
  k29: 94.9000,
  k30: 12.2000,
  k31: 28.6000,
  k32: 45.0000,
  k33: 61.4000,
  k34: 77.8000,
  k35: 94.2000,
  k36: 11.5000,
  k37: 27.9000,
  k38: 44.3000,
  k39: 60.7000,
  k40: 77.1000,
  k41: 93.5000,
  k42: 10.8000,
  k43: 27.2000,
  k44: 43.6000,
  k45: 60.0000,
  k46: 76.4000,
  k47: 92.8000,
  k48: 10.1000,
  k49: 26.5000,
  k50: 42.9000,
  k51: 59.3000,
  k52: 75.7000,
  k53: 92.1000,
  k54: 9.4000,
  k55: 25.8000,
  k56: 42.2000,
  k57: 58.6000,
  k58: 75.0000,
  k59: 91.4000,
  k60: 8.7000,
  k61: 25.1000,
  k62: 41.5000,
  k63: 57.9000,
  k64: 74.3000,
  k65: 90.7000,
  k66: 8.0000,
  k67: 24.4000,
  k68: 40.8000,
  k69: 57.2000,
  k70: 73.6000,
  k71: 90.0000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_025_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_025_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_025_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_025_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_025_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_025_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_025_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_025_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_025_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_025_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_025_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_025_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
