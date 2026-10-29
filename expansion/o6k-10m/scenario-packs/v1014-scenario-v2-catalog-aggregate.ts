import { V1014_SCENARIO_V2_PACK_TRADE_CORRIDOR } from './catalog/pack-trade_corridor';
import { V1014_SCENARIO_V2_PACK_ENERGY_TRANSITION } from './catalog/pack-energy_transition';
import { V1014_SCENARIO_V2_PACK_MINING_BOOM } from './catalog/pack-mining_boom';
import { V1014_SCENARIO_V2_PACK_COASTAL_RESILIENCE } from './catalog/pack-coastal_resilience';
import { V1014_SCENARIO_V2_PACK_INLAND_LOGISTICS } from './catalog/pack-inland_logistics';
import { V1014_SCENARIO_V2_PACK_RESEARCH_MOMENTUM } from './catalog/pack-research_momentum';
import { V1014_SCENARIO_V2_PACK_FISCAL_DISCIPLINE } from './catalog/pack-fiscal_discipline';
import { V1014_SCENARIO_V2_PACK_CRISIS_RECOVERY } from './catalog/pack-crisis_recovery';
import { V1014_SCENARIO_V2_PACK_DIPLOMATIC_WINDOW } from './catalog/pack-diplomatic_window';
import { V1014_SCENARIO_V2_PACK_WORKFORCE_PIPELINE } from './catalog/pack-workforce_pipeline';
import { buildV1014ScenarioV2MissionGraphIndex } from './v1014-scenario-v2-engine';

export const V1014_SCENARIO_V2_CATALOG = [
  ...V1014_SCENARIO_V2_PACK_TRADE_CORRIDOR,
  ...V1014_SCENARIO_V2_PACK_ENERGY_TRANSITION,
  ...V1014_SCENARIO_V2_PACK_MINING_BOOM,
  ...V1014_SCENARIO_V2_PACK_COASTAL_RESILIENCE,
  ...V1014_SCENARIO_V2_PACK_INLAND_LOGISTICS,
  ...V1014_SCENARIO_V2_PACK_RESEARCH_MOMENTUM,
  ...V1014_SCENARIO_V2_PACK_FISCAL_DISCIPLINE,
  ...V1014_SCENARIO_V2_PACK_CRISIS_RECOVERY,
  ...V1014_SCENARIO_V2_PACK_DIPLOMATIC_WINDOW,
  ...V1014_SCENARIO_V2_PACK_WORKFORCE_PIPELINE,
];

export const V1014_SCENARIO_V2_MISSION_GRAPHS = Object.values(buildV1014ScenarioV2MissionGraphIndex(V1014_SCENARIO_V2_CATALOG));
export const V1014_SCENARIO_V2_CATALOG_BY_ID = Object.fromEntries(V1014_SCENARIO_V2_CATALOG.map((s: { id: string }) => [s.id, s]));
export const V1014_SCENARIO_V2_GRAPH_BY_ID = buildV1014ScenarioV2MissionGraphIndex(V1014_SCENARIO_V2_CATALOG);
