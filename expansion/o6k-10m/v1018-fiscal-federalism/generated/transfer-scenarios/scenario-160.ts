import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 160 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_160_META = {
  id: 'transfer_160',
  regionId: 'NSW' as V1018FfedRegionId,
  primarySystem: 'freight' as V1018FfedSystemDomain,
  transferBand: 'latent' as V1018FfedTransferBand,
  seed: 140361,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_160_COEF = {
  k0: 44.6000,
  k1: 8.5000,
  k2: 71.5000,
  k3: 35.4000,
  k4: 98.4000,
  k5: 62.3000,
  k6: 26.2000,
  k7: 89.2000,
  k8: 53.1000,
  k9: 17.0000,
  k10: 80.0000,
  k11: 43.9000,
  k12: 7.8000,
  k13: 70.8000,
  k14: 34.7000,
  k15: 97.7000,
  k16: 61.6000,
  k17: 25.5000,
  k18: 88.5000,
  k19: 52.4000,
  k20: 16.3000,
  k21: 79.3000,
  k22: 43.2000,
  k23: 7.1000,
  k24: 70.1000,
  k25: 34.0000,
  k26: 97.0000,
  k27: 60.9000,
  k28: 24.8000,
  k29: 87.8000,
  k30: 51.7000,
  k31: 15.6000,
  k32: 78.6000,
  k33: 42.5000,
  k34: 6.4000,
  k35: 69.4000,
  k36: 33.3000,
  k37: 96.3000,
  k38: 60.2000,
  k39: 24.1000,
  k40: 87.1000,
  k41: 51.0000,
  k42: 14.9000,
  k43: 77.9000,
  k44: 41.8000,
  k45: 5.7000,
  k46: 68.7000,
  k47: 32.6000,
  k48: 95.6000,
  k49: 59.5000,
  k50: 23.4000,
  k51: 86.4000,
  k52: 50.3000,
  k53: 14.2000,
  k54: 77.2000,
  k55: 41.1000,
  k56: 5.0000,
  k57: 68.0000,
  k58: 31.9000,
  k59: 94.9000,
  k60: 58.8000,
  k61: 22.7000,
  k62: 85.7000,
  k63: 49.6000,
  k64: 13.5000,
  k65: 76.5000,
  k66: 40.4000,
  k67: 4.3000,
  k68: 67.3000,
  k69: 31.2000,
  k70: 94.2000,
  k71: 58.1000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_160_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_160_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_160_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_160_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_160_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_160_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_160_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_160_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_160_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_160_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_160_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_160_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
