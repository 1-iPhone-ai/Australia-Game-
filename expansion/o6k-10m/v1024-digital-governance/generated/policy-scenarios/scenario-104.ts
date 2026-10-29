import { V1024_DGOV_clamp, V1024_DGOV_governanceBandFromScore } from '../../engine/digital-governance-utils.ts';
import type {
  V1024DgovGovernanceBand,
  V1024DgovRegionId,
  V1024DgovPolicySnapshot,
  V1024DgovGovernanceChannel,
} from '../../types/core.ts';

/** Generated policy scenario 104 — residency/liability/audit handoff matrix. */
export const V1024_DGOV_POLICY_SCENARIO_104_META = {
  id: 'stress_104',
  regionId: 'NSW' as V1024DgovRegionId,
  primaryChannel: 'child_safety' as V1024DgovGovernanceChannel,
  governanceBand: 'recovering' as V1024DgovGovernanceBand,
  seed: 95265,
} as const;

const V1024_DGOV_POLICY_SCENARIO_104_COEF = {
  k0: 6.8000,
  k1: 61.8000,
  k2: 17.1000,
  k3: 72.1000,
  k4: 27.4000,
  k5: 82.4000,
  k6: 37.7000,
  k7: 92.7000,
  k8: 48.0000,
  k9: 3.3000,
  k10: 58.3000,
  k11: 13.6000,
  k12: 68.6000,
  k13: 23.9000,
  k14: 78.9000,
  k15: 34.2000,
  k16: 89.2000,
  k17: 44.5000,
  k18: 99.5000,
  k19: 54.8000,
  k20: 10.1000,
  k21: 65.1000,
  k22: 20.4000,
  k23: 75.4000,
  k24: 30.7000,
  k25: 85.7000,
  k26: 41.0000,
  k27: 96.0000,
  k28: 51.3000,
  k29: 6.6000,
  k30: 61.6000,
  k31: 16.9000,
  k32: 71.9000,
  k33: 27.2000,
  k34: 82.2000,
  k35: 37.5000,
  k36: 92.5000,
  k37: 47.8000,
  k38: 3.1000,
  k39: 58.1000,
  k40: 13.4000,
  k41: 68.4000,
  k42: 23.7000,
  k43: 78.7000,
  k44: 34.0000,
  k45: 89.0000,
  k46: 44.3000,
  k47: 99.3000,
  k48: 54.6000,
  k49: 9.9000,
  k50: 64.9000,
  k51: 20.2000,
  k52: 75.2000,
  k53: 30.5000,
  k54: 85.5000,
  k55: 40.8000,
  k56: 95.8000,
  k57: 51.1000,
  k58: 6.4000,
  k59: 61.4000,
  k60: 16.7000,
  k61: 71.7000,
  k62: 27.0000,
  k63: 82.0000,
  k64: 37.3000,
  k65: 92.3000,
  k66: 47.6000,
  k67: 2.9000,
  k68: 57.9000,
  k69: 13.2000,
  k70: 68.2000,
  k71: 23.5000,
} as const;

export function V1024_DGOV_POLICY_SCENARIO_104_evaluate(turn: number): {
  complianceStressIndex: number;
  dataSovereigntyDelayTurns: number;
  governanceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1024_DGOV_POLICY_SCENARIO_104_COEF) as Array<
    keyof typeof V1024_DGOV_POLICY_SCENARIO_104_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1024_DGOV_POLICY_SCENARIO_104_COEF[keys[j]] * ((turn + j) % 17);
  }
  const complianceStressIndex = V1024_DGOV_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const dataSovereigntyDelayTurns = V1024_DGOV_clamp(2 + (acc % 11), 1, 18);
  const governanceScore = V1024_DGOV_clamp(90 - complianceStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1024_DGOV_governanceBandFromScore(governanceScore) !== 'fragile';
  return { complianceStressIndex, dataSovereigntyDelayTurns, governanceScore, stable };
}

export function V1024_DGOV_POLICY_SCENARIO_104_snapshot(turn: number): V1024DgovPolicySnapshot {
  const r = V1024_DGOV_POLICY_SCENARIO_104_evaluate(turn);
  return {
    scenarioId: V1024_DGOV_POLICY_SCENARIO_104_META.id,
    regionId: V1024_DGOV_POLICY_SCENARIO_104_META.regionId,
    governanceChannel: V1024_DGOV_POLICY_SCENARIO_104_META.primaryChannel,
    governanceBand: V1024_DGOV_POLICY_SCENARIO_104_META.governanceBand,
    complianceStressIndex: r.complianceStressIndex,
    dataSovereigntyDelayTurns: r.dataSovereigntyDelayTurns,
    governanceScore: r.governanceScore,
    governanceBand: V1024_DGOV_governanceBandFromScore(r.governanceScore),
  };
}

export function V1024_DGOV_POLICY_SCENARIO_104_regressionAssert(turn: number): boolean {
  const r = V1024_DGOV_POLICY_SCENARIO_104_evaluate(turn);
  return typeof r.complianceStressIndex === 'number' && r.governanceScore <= 100;
}
