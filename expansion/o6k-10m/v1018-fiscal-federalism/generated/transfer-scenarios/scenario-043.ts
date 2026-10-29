import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 043 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_043_META = {
  id: 'transfer_043',
  regionId: 'WA' as V1018FfedRegionId,
  primarySystem: 'digital' as V1018FfedSystemDomain,
  transferBand: 'critical' as V1018FfedTransferBand,
  seed: 37752,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_043_COEF = {
  k0: 65.8000,
  k1: 75.2000,
  k2: 84.6000,
  k3: 94.0000,
  k4: 4.3000,
  k5: 13.7000,
  k6: 23.1000,
  k7: 32.5000,
  k8: 41.9000,
  k9: 51.3000,
  k10: 60.7000,
  k11: 70.1000,
  k12: 79.5000,
  k13: 88.9000,
  k14: 98.3000,
  k15: 8.6000,
  k16: 18.0000,
  k17: 27.4000,
  k18: 36.8000,
  k19: 46.2000,
  k20: 55.6000,
  k21: 65.0000,
  k22: 74.4000,
  k23: 83.8000,
  k24: 93.2000,
  k25: 3.5000,
  k26: 12.9000,
  k27: 22.3000,
  k28: 31.7000,
  k29: 41.1000,
  k30: 50.5000,
  k31: 59.9000,
  k32: 69.3000,
  k33: 78.7000,
  k34: 88.1000,
  k35: 97.5000,
  k36: 7.8000,
  k37: 17.2000,
  k38: 26.6000,
  k39: 36.0000,
  k40: 45.4000,
  k41: 54.8000,
  k42: 64.2000,
  k43: 73.6000,
  k44: 83.0000,
  k45: 92.4000,
  k46: 2.7000,
  k47: 12.1000,
  k48: 21.5000,
  k49: 30.9000,
  k50: 40.3000,
  k51: 49.7000,
  k52: 59.1000,
  k53: 68.5000,
  k54: 77.9000,
  k55: 87.3000,
  k56: 96.7000,
  k57: 7.0000,
  k58: 16.4000,
  k59: 25.8000,
  k60: 35.2000,
  k61: 44.6000,
  k62: 54.0000,
  k63: 63.4000,
  k64: 72.8000,
  k65: 82.2000,
  k66: 91.6000,
  k67: 1.9000,
  k68: 11.3000,
  k69: 20.7000,
  k70: 30.1000,
  k71: 39.5000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_043_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_043_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_043_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_043_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_043_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_043_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_043_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_043_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_043_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_043_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_043_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_043_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
