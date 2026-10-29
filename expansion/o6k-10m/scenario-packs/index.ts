export * from './v1014-scenario-v2-types';
export * from './v1014-scenario-v2-engine';
export * from './v1014-scenario-v2-persistence';
export * from './v1014-scenario-v2-crosswire';
export * from './v1014-scenario-v2-gates';
export * from './v1014-scenario-v2-fixtures';
export * from './v1014-scenario-v2-catalog-aggregate';
export * from './v1014-scenario-v2-replay-manifests';
export * from './v1014-scenario-v2-coaching-ledger';
export { runV1014ScenarioV2SelfTests } from './v1014-scenario-v2-self-tests';

import { runV1014ScenarioV2SelfTests } from './v1014-scenario-v2-self-tests';

export const V1014_SCENARIO_V2_LAB_REGISTRATION = {
  id: 'v1014_scenarios_v2',
  label: 'V10.14 Scenario engine v2 (T6-2)',
  tier: 'full',
  section: 'System Regression',
  severity: 'MAJOR',
  run: () => runV1014ScenarioV2SelfTests(),
} as const;
