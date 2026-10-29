import { V1024_DGOV_clamp, V1024_DGOV_governanceBandFromScore } from '../../engine/digital-governance-utils.ts';
import type {
  V1024DgovGovernanceBand,
  V1024DgovRegionId,
  V1024DgovPolicySnapshot,
  V1024DgovGovernanceChannel,
} from '../../types/core.ts';

/** Generated policy scenario 040 — residency/liability/audit handoff matrix. */
export const V1024_DGOV_POLICY_SCENARIO_040_META = {
  id: 'stress_040',
  regionId: 'NSW' as V1024DgovRegionId,
  primaryChannel: 'data_residency' as V1024DgovGovernanceChannel,
  governanceBand: 'minimal' as V1024DgovGovernanceBand,
  seed: 36961,
} as const;

const V1024_DGOV_POLICY_SCENARIO_040_COEF = {
  k0: 79.2000,
  k1: 86.4000,
  k2: 93.6000,
  k3: 1.1000,
  k4: 8.3000,
  k5: 15.5000,
  k6: 22.7000,
  k7: 29.9000,
  k8: 37.1000,
  k9: 44.3000,
  k10: 51.5000,
  k11: 58.7000,
  k12: 65.9000,
  k13: 73.1000,
  k14: 80.3000,
  k15: 87.5000,
  k16: 94.7000,
  k17: 2.2000,
  k18: 9.4000,
  k19: 16.6000,
  k20: 23.8000,
  k21: 31.0000,
  k22: 38.2000,
  k23: 45.4000,
  k24: 52.6000,
  k25: 59.8000,
  k26: 67.0000,
  k27: 74.2000,
  k28: 81.4000,
  k29: 88.6000,
  k30: 95.8000,
  k31: 3.3000,
  k32: 10.5000,
  k33: 17.7000,
  k34: 24.9000,
  k35: 32.1000,
  k36: 39.3000,
  k37: 46.5000,
  k38: 53.7000,
  k39: 60.9000,
  k40: 68.1000,
  k41: 75.3000,
  k42: 82.5000,
  k43: 89.7000,
  k44: 96.9000,
  k45: 4.4000,
  k46: 11.6000,
  k47: 18.8000,
  k48: 26.0000,
  k49: 33.2000,
  k50: 40.4000,
  k51: 47.6000,
  k52: 54.8000,
  k53: 62.0000,
  k54: 69.2000,
  k55: 76.4000,
  k56: 83.6000,
  k57: 90.8000,
  k58: 98.0000,
  k59: 5.5000,
  k60: 12.7000,
  k61: 19.9000,
  k62: 27.1000,
  k63: 34.3000,
  k64: 41.5000,
  k65: 48.7000,
  k66: 55.9000,
  k67: 63.1000,
  k68: 70.3000,
  k69: 77.5000,
  k70: 84.7000,
  k71: 91.9000,
} as const;

export function V1024_DGOV_POLICY_SCENARIO_040_evaluate(turn: number): {
  complianceStressIndex: number;
  dataSovereigntyDelayTurns: number;
  governanceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1024_DGOV_POLICY_SCENARIO_040_COEF) as Array<
    keyof typeof V1024_DGOV_POLICY_SCENARIO_040_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1024_DGOV_POLICY_SCENARIO_040_COEF[keys[j]] * ((turn + j) % 17);
  }
  const complianceStressIndex = V1024_DGOV_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const dataSovereigntyDelayTurns = V1024_DGOV_clamp(2 + (acc % 11), 1, 18);
  const governanceScore = V1024_DGOV_clamp(90 - complianceStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1024_DGOV_governanceBandFromScore(governanceScore) !== 'fragile';
  return { complianceStressIndex, dataSovereigntyDelayTurns, governanceScore, stable };
}

export function V1024_DGOV_POLICY_SCENARIO_040_snapshot(turn: number): V1024DgovPolicySnapshot {
  const r = V1024_DGOV_POLICY_SCENARIO_040_evaluate(turn);
  return {
    scenarioId: V1024_DGOV_POLICY_SCENARIO_040_META.id,
    regionId: V1024_DGOV_POLICY_SCENARIO_040_META.regionId,
    governanceChannel: V1024_DGOV_POLICY_SCENARIO_040_META.primaryChannel,
    governanceBand: V1024_DGOV_POLICY_SCENARIO_040_META.governanceBand,
    complianceStressIndex: r.complianceStressIndex,
    dataSovereigntyDelayTurns: r.dataSovereigntyDelayTurns,
    governanceScore: r.governanceScore,
    governanceBand: V1024_DGOV_governanceBandFromScore(r.governanceScore),
  };
}

export function V1024_DGOV_POLICY_SCENARIO_040_regressionAssert(turn: number): boolean {
  const r = V1024_DGOV_POLICY_SCENARIO_040_evaluate(turn);
  return typeof r.complianceStressIndex === 'number' && r.governanceScore <= 100;
}
