import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 167 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_167_META = {
  id: 'transfer_167',
  regionId: 'ACT' as V1018FfedRegionId,
  primarySystem: 'industrial' as V1018FfedSystemDomain,
  transferBand: 'active' as V1018FfedTransferBand,
  seed: 146500,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_167_COEF = {
  k0: 80.6000,
  k1: 63.8000,
  k2: 47.0000,
  k3: 30.2000,
  k4: 13.4000,
  k5: 95.7000,
  k6: 78.9000,
  k7: 62.1000,
  k8: 45.3000,
  k9: 28.5000,
  k10: 11.7000,
  k11: 94.0000,
  k12: 77.2000,
  k13: 60.4000,
  k14: 43.6000,
  k15: 26.8000,
  k16: 10.0000,
  k17: 92.3000,
  k18: 75.5000,
  k19: 58.7000,
  k20: 41.9000,
  k21: 25.1000,
  k22: 8.3000,
  k23: 90.6000,
  k24: 73.8000,
  k25: 57.0000,
  k26: 40.2000,
  k27: 23.4000,
  k28: 6.6000,
  k29: 88.9000,
  k30: 72.1000,
  k31: 55.3000,
  k32: 38.5000,
  k33: 21.7000,
  k34: 4.9000,
  k35: 87.2000,
  k36: 70.4000,
  k37: 53.6000,
  k38: 36.8000,
  k39: 20.0000,
  k40: 3.2000,
  k41: 85.5000,
  k42: 68.7000,
  k43: 51.9000,
  k44: 35.1000,
  k45: 18.3000,
  k46: 1.5000,
  k47: 83.8000,
  k48: 67.0000,
  k49: 50.2000,
  k50: 33.4000,
  k51: 16.6000,
  k52: 98.9000,
  k53: 82.1000,
  k54: 65.3000,
  k55: 48.5000,
  k56: 31.7000,
  k57: 14.9000,
  k58: 97.2000,
  k59: 80.4000,
  k60: 63.6000,
  k61: 46.8000,
  k62: 30.0000,
  k63: 13.2000,
  k64: 95.5000,
  k65: 78.7000,
  k66: 61.9000,
  k67: 45.1000,
  k68: 28.3000,
  k69: 11.5000,
  k70: 93.8000,
  k71: 77.0000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_167_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_167_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_167_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_167_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_167_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_167_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_167_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_167_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_167_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_167_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_167_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_167_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
