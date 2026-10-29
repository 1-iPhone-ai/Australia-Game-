/**
 * Agent 13 scale wave round 43 (O10-217) — compound grid AI forecast & demand flexibility federation orchestration depth.
 */

export type V1014GridAiForecastBand =
  | 'heuristic_dispatch'
  | 'pilot_ai_forecast'
  | 'forecast_federation_hub'
  | 'federated_ai_grid_leader';

export type V1014DemandFlexFederationBand =
  | 'rigid_load'
  | 'pilot_flex_federation'
  | 'flex_federation_hub'
  | 'deep_demand_response_mesh';

export interface V1014GridAiForecastInstrument {
  id: string;
  kind: 'ai_forecast_federation_hub' | 'probabilistic_dispatch_corridor' | 'renewable_nowcast_mesh' | 'federation_forecast_tie';
  label: string;
  forecastScoreEq: number;
  forecastReliefFactor: number;
  flexSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_GRID_AI_FORECAST_CATALOG: readonly V1014GridAiForecastInstrument[] = [
  {
    id: 'af_hub',
    kind: 'ai_forecast_federation_hub',
    label: 'Grid AI forecast federation hub',
    forecastScoreEq: 46,
    forecastReliefFactor: 0.16,
    flexSynergyFactor: 0.11,
    projectTypeHint: 'grid_ai_forecast_federation_hub',
  },
  {
    id: 'af_prob',
    kind: 'probabilistic_dispatch_corridor',
    label: 'Probabilistic dispatch corridor',
    forecastScoreEq: 44,
    forecastReliefFactor: 0.15,
    flexSynergyFactor: 0.12,
    projectTypeHint: 'probabilistic_dispatch_federation_corridor',
  },
  {
    id: 'af_nowcast',
    kind: 'renewable_nowcast_mesh',
    label: 'Renewable nowcast federation mesh',
    forecastScoreEq: 48,
    forecastReliefFactor: 0.17,
    flexSynergyFactor: 0.1,
    projectTypeHint: 'renewable_nowcast_federation_mesh',
  },
  {
    id: 'af_fed',
    kind: 'federation_forecast_tie',
    label: 'Federation grid forecast tie',
    forecastScoreEq: 50,
    forecastReliefFactor: 0.16,
    flexSynergyFactor: 0.13,
    projectTypeHint: 'federation_grid_forecast_tie',
  },
] as const;

export interface V1014DemandFlexFederationTemplate {
  id: string;
  kind: 'industrial_dr_orchestration' | 'vpp_flex_federation_mesh' | 'price_responsive_load_stack' | 'trade_exposed_flex_corridor';
  label: string;
  flexScoreEq: number;
  flexReliefFactor: number;
  forecastSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_DEMAND_FLEX_FEDERATION_CATALOG: readonly V1014DemandFlexFederationTemplate[] = [
  {
    id: 'df_industrial',
    kind: 'industrial_dr_orchestration',
    label: 'Industrial demand-response orchestration hub',
    flexScoreEq: 45,
    flexReliefFactor: 0.15,
    forecastSynergyFactor: 0.11,
    projectTypeHint: 'industrial_dr_federation_orchestration_hub',
  },
  {
    id: 'df_vpp',
    kind: 'vpp_flex_federation_mesh',
    label: 'VPP flexibility federation mesh',
    flexScoreEq: 47,
    flexReliefFactor: 0.16,
    forecastSynergyFactor: 0.1,
    projectTypeHint: 'vpp_flex_federation_mesh',
  },
  {
    id: 'df_price',
    kind: 'price_responsive_load_stack',
    label: 'Price-responsive load stacking layer',
    flexScoreEq: 49,
    flexReliefFactor: 0.17,
    forecastSynergyFactor: 0.12,
    projectTypeHint: 'price_responsive_load_federation_stack',
  },
  {
    id: 'df_trade',
    kind: 'trade_exposed_flex_corridor',
    label: 'Trade-exposed flexibility corridor',
    flexScoreEq: 43,
    flexReliefFactor: 0.14,
    forecastSynergyFactor: 0.1,
    projectTypeHint: 'trade_exposed_flex_federation_corridor',
  },
] as const;

export interface V1014RegionalGridAiForecastLedger {
  regionId: string;
  band: V1014GridAiForecastBand;
  forecastIndex: number;
  forecastBalance: number;
  gridAiForecastRelief: number;
  summary: string;
}

export interface V1014RegionalDemandFlexFederationLedger {
  regionId: string;
  band: V1014DemandFlexFederationBand;
  flexIndex: number;
  demandFlexFederationRelief: number;
  summary: string;
}

export interface V1014GridAiForecastPersistedSlice {
  forecastBalance: number;
  forecastIndex: number;
}

export interface V1014DemandFlexFederationPersistedSlice {
  flexIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const FORECAST_HUB_REGIONS = new Set(['NSW', 'VIC', 'QLD', 'SA']);

export function computeRegionalGridAiForecastLedger(params: {
  regionId: string;
  exportBufferFederationRelief: number;
  hydrogenLdesStorageRelief: number;
  curtailmentRecoveryRelief: number;
  gridInertiaRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014GridAiForecastPersistedSlice | null;
}): { ledger: V1014RegionalGridAiForecastLedger; next: V1014GridAiForecastPersistedSlice } {
  let forecastGain = 0;
  let forecastProxy = 0;
  let flexSynergy = 0;
  for (const inst of V1014_GRID_AI_FORECAST_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      forecastGain += inst.forecastScoreEq;
      forecastProxy += inst.forecastReliefFactor;
      flexSynergy += inst.flexSynergyFactor;
    }
  }
  if (FORECAST_HUB_REGIONS.has(params.regionId)) forecastProxy += 0.06;
  else forecastProxy *= 0.7;
  if (params.exportBufferFederationRelief > 2.3) forecastGain += clamp(params.exportBufferFederationRelief * 0.54, 0, 7);
  if (params.hydrogenLdesStorageRelief > 2.3) flexSynergy += clamp(params.hydrogenLdesStorageRelief * 0.008, 0, 0.05);
  if (params.curtailmentRecoveryRelief > 2.2) {
    forecastGain += clamp(params.curtailmentRecoveryRelief * 0.6, 0, 8);
    forecastProxy += clamp(params.curtailmentRecoveryRelief * 0.007, 0, 0.04);
  }
  if (params.gridInertiaRelief > 2.1) flexSynergy += clamp(params.gridInertiaRelief * 0.008, 0, 0.04);
  forecastProxy += clamp(params.renewableShareScore / 109, 0, 0.09);

  const prevIdx = params.prev?.forecastIndex ?? 0;
  const prevBal = params.prev?.forecastBalance ?? 0;
  const forecastBalance = clamp(prevBal * 0.82 + forecastGain * 0.1, 0, 254);
  const forecastIndex = clamp(
    prevIdx * 0.79 + forecastBalance * 0.09 + forecastProxy * 74 + flexSynergy * 23,
    0,
    197,
  );

  let band: V1014GridAiForecastBand = 'heuristic_dispatch';
  if (forecastIndex >= 124 || forecastGain >= 144) band = 'federated_ai_grid_leader';
  else if (forecastIndex >= 84 || forecastGain >= 98) band = 'forecast_federation_hub';
  else if (forecastIndex >= 41 || forecastGain >= 39) band = 'pilot_ai_forecast';

  let gridAiForecastRelief = clamp(forecastProxy * 7.6 + forecastGain * 0.026 + flexSynergy * 4.7, 0, 10.1);
  if (band === 'heuristic_dispatch') gridAiForecastRelief *= 0.17;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      forecastIndex: clamp(forecastIndex, 0, 197),
      forecastBalance: clamp(forecastBalance, 0, 254),
      gridAiForecastRelief: clamp(gridAiForecastRelief, 0, 10.1),
      summary: `${params.regionId} AI forecast ${band} · idx ${forecastIndex.toFixed(0)} · relief ${gridAiForecastRelief.toFixed(1)}`,
    },
    next: {
      forecastBalance: clamp(forecastBalance, 0, 254),
      forecastIndex: clamp(forecastIndex, 0, 197),
    },
  };
}

export function advanceRegionalDemandFlexFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  forecastBand: V1014GridAiForecastBand;
  industrialElectrificationFlexRelief: number;
  derV2gFlexRelief: number;
  completedProjectTypes: string[];
  prev?: V1014DemandFlexFederationPersistedSlice | null;
}): { ledger: V1014RegionalDemandFlexFederationLedger; next: V1014DemandFlexFederationPersistedSlice } {
  let flexGain = 0;
  let flexProxy = 0;
  let forecastSynergy = 0;
  for (const tpl of V1014_DEMAND_FLEX_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      flexGain += tpl.flexScoreEq;
      flexProxy += tpl.flexReliefFactor;
      forecastSynergy += tpl.forecastSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('industrial_demand_response')) {
    flexGain += 10;
    flexProxy += 0.04;
  }
  if (params.forecastBand === 'forecast_federation_hub' || params.forecastBand === 'federated_ai_grid_leader') {
    flexGain += 18;
    forecastSynergy += 0.12;
  }
  if (params.industrialElectrificationFlexRelief > 2.3) {
    flexGain += params.industrialElectrificationFlexRelief * 0.58;
    flexProxy += clamp(params.industrialElectrificationFlexRelief * 0.007, 0, 0.04);
  }
  if (params.derV2gFlexRelief > 2.2) forecastSynergy += clamp(params.derV2gFlexRelief * 0.008, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.16, 0, 6.2);
  const prevIdx = params.prev?.flexIndex ?? 0;
  const flexIndex = clamp(
    prevIdx * 0.78 + flexGain * 0.1 + flexProxy * 24 - stressLoad * 0.021 + forecastSynergy * 24,
    0,
    200,
  );

  let band: V1014DemandFlexFederationBand = 'rigid_load';
  if (flexIndex >= 129 || flexGain >= 152) band = 'deep_demand_response_mesh';
  else if (flexIndex >= 89 || flexGain >= 106) band = 'flex_federation_hub';
  else if (flexIndex >= 43 || flexGain >= 41) band = 'pilot_flex_federation';

  let demandFlexFederationRelief = clamp(flexIndex / 17.6 + flexProxy * 6.1 + forecastSynergy * 6.5, 0, 10.2);
  if (band === 'rigid_load') demandFlexFederationRelief = clamp(demandFlexFederationRelief * 0.15, 0, 1.6);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      flexIndex: clamp(flexIndex, 0, 200),
      demandFlexFederationRelief: clamp(demandFlexFederationRelief, 0, 10.2),
      summary: `${params.regionId} demand flex ${band} · idx ${flexIndex.toFixed(0)} · relief ${demandFlexFederationRelief.toFixed(1)}`,
    },
    next: { flexIndex: clamp(flexIndex, 0, 200) },
  };
}

export function runAgent13AiForecastFlexScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_GRID_AI_FORECAST_CATALOG.length >= 4);
  ok(V1014_DEMAND_FLEX_FEDERATION_CATALOG.length >= 4);

  const forecast = computeRegionalGridAiForecastLedger({
    regionId: 'VIC',
    exportBufferFederationRelief: 2.5,
    hydrogenLdesStorageRelief: 2.4,
    curtailmentRecoveryRelief: 2.6,
    gridInertiaRelief: 2.3,
    renewableShareScore: 52,
    completedProjectTypes: ['grid_ai_forecast_federation_hub', 'federation_grid_forecast_tie'],
  });
  ok(forecast.ledger.gridAiForecastRelief >= 1.4 || forecast.ledger.band !== 'heuristic_dispatch');

  const flex = advanceRegionalDemandFlexFederationOrchestration({
    regionId: 'VIC',
    gridStressPoints: 16,
    forecastBand: forecast.ledger.band,
    industrialElectrificationFlexRelief: 2.5,
    derV2gFlexRelief: 2.4,
    completedProjectTypes: ['industrial_dr_federation_orchestration_hub', 'vpp_flex_federation_mesh'],
  });
  ok(flex.ledger.demandFlexFederationRelief >= 1.2 || flex.ledger.band !== 'rigid_load');

  const turnSc = runAgent13AiForecastFlexTurnScenario(V1014_AI_FORECAST_FLEX_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13AiForecastFlexGIAlignment({
    actionText: 'Grid AI forecast federation hub with industrial demand-response orchestration and VPP flex mesh',
    forecastBand: 'forecast_federation_hub',
    flexBand: 'flex_federation_hub',
  });
  ok(gi.relevanceDelta > 0.85 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13AiForecastFlexTurnStep {
  turn: number;
  regionId: string;
  exportBufferFederationRelief: number;
  hydrogenLdesStorageRelief: number;
  curtailmentRecoveryRelief: number;
  gridInertiaRelief: number;
  industrialElectrificationFlexRelief: number;
  derV2gFlexRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13AiForecastFlexTurnScenario {
  id: string;
  label: string;
  steps: Agent13AiForecastFlexTurnStep[];
  expect: { minForecastReliefOnLast?: number; minFlexReliefOnLast?: number };
}

export const V1014_AI_FORECAST_FLEX_TURN_SCENARIOS: readonly Agent13AiForecastFlexTurnScenario[] = [
  {
    id: 'sc_af_vic_escalation',
    label: 'VIC AI forecast with demand flex federation mesh',
    steps: [
      {
        turn: 1,
        regionId: 'VIC',
        exportBufferFederationRelief: 1.9,
        hydrogenLdesStorageRelief: 1.8,
        curtailmentRecoveryRelief: 2,
        gridInertiaRelief: 1.8,
        industrialElectrificationFlexRelief: 1.9,
        derV2gFlexRelief: 1.8,
        renewableShareScore: 42,
        gridStressPoints: 18,
        completedProjectTypes: ['grid_ai_forecast_federation_hub', 'industrial_dr_federation_orchestration_hub'],
      },
      {
        turn: 2,
        regionId: 'VIC',
        exportBufferFederationRelief: 2.2,
        hydrogenLdesStorageRelief: 2.1,
        curtailmentRecoveryRelief: 2.3,
        gridInertiaRelief: 2.1,
        industrialElectrificationFlexRelief: 2.2,
        derV2gFlexRelief: 2.1,
        renewableShareScore: 48,
        gridStressPoints: 17,
        completedProjectTypes: ['probabilistic_dispatch_federation_corridor', 'price_responsive_load_federation_stack'],
      },
      {
        turn: 3,
        regionId: 'VIC',
        exportBufferFederationRelief: 2.6,
        hydrogenLdesStorageRelief: 2.5,
        curtailmentRecoveryRelief: 2.7,
        gridInertiaRelief: 2.4,
        industrialElectrificationFlexRelief: 2.6,
        derV2gFlexRelief: 2.5,
        renewableShareScore: 54,
        gridStressPoints: 15,
        completedProjectTypes: [
          'grid_ai_forecast_federation_hub',
          'probabilistic_dispatch_federation_corridor',
          'renewable_nowcast_federation_mesh',
          'federation_grid_forecast_tie',
          'industrial_dr_federation_orchestration_hub',
          'vpp_flex_federation_mesh',
          'price_responsive_load_federation_stack',
          'trade_exposed_flex_federation_corridor',
          'industrial_demand_response',
        ],
      },
    ],
    expect: { minForecastReliefOnLast: 1.4, minFlexReliefOnLast: 1.1 },
  },
] as const;

export function runAgent13AiForecastFlexTurnScenario(
  scenario: Agent13AiForecastFlexTurnScenario,
): { passed: boolean; detail: string; lastForecastRelief: number; lastFlexRelief: number } {
  let forecastMem: V1014GridAiForecastPersistedSlice | null = null;
  let flexMem: V1014DemandFlexFederationPersistedSlice | null = null;
  let lastForecastRelief = 0;
  let lastFlexRelief = 0;

  for (const step of scenario.steps) {
    const forecast = computeRegionalGridAiForecastLedger({
      regionId: step.regionId,
      exportBufferFederationRelief: step.exportBufferFederationRelief,
      hydrogenLdesStorageRelief: step.hydrogenLdesStorageRelief,
      curtailmentRecoveryRelief: step.curtailmentRecoveryRelief,
      gridInertiaRelief: step.gridInertiaRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: forecastMem,
    });
    forecastMem = forecast.next;
    lastForecastRelief = forecast.ledger.gridAiForecastRelief;

    const flex = advanceRegionalDemandFlexFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      forecastBand: forecast.ledger.band,
      industrialElectrificationFlexRelief: step.industrialElectrificationFlexRelief,
      derV2gFlexRelief: step.derV2gFlexRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: flexMem,
    });
    flexMem = flex.next;
    lastFlexRelief = flex.ledger.demandFlexFederationRelief;
  }

  if (scenario.expect.minForecastReliefOnLast != null && lastForecastRelief < scenario.expect.minForecastReliefOnLast) {
    return { passed: false, detail: `forecast ${lastForecastRelief}`, lastForecastRelief, lastFlexRelief };
  }
  if (scenario.expect.minFlexReliefOnLast != null && lastFlexRelief < scenario.expect.minFlexReliefOnLast) {
    return { passed: false, detail: `flex ${lastFlexRelief}`, lastForecastRelief, lastFlexRelief };
  }
  return { passed: true, detail: 'ok', lastForecastRelief, lastFlexRelief };
}

export function scoreAgent13AiForecastFlexGIAlignment(params: {
  actionText: string;
  forecastBand?: string;
  flexBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'ai forecast',
    'grid forecast',
    'nowcast',
    'probabilistic dispatch',
    'demand response',
    'demand flex',
    'vpp',
    'price responsive',
    'flexibility',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.13, 0, 2);
  if (params.forecastBand === 'federated_ai_grid_leader' || params.forecastBand === 'forecast_federation_hub') {
    delta += hits.some(h => h.includes('forecast') || h.includes('nowcast') || h.includes('dispatch')) ? 0.33 : 0.08;
  }
  if (params.flexBand === 'flex_federation_hub' || params.flexBand === 'deep_demand_response_mesh') {
    delta += hits.some(h => h.includes('flex') || h.includes('demand') || h.includes('vpp')) ? 0.31 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `AI forecast flex GI: ${hits.slice(0, 2).join(', ')} aligns with grid AI forecast and demand flexibility federation depth.`
        : null,
  };
}
