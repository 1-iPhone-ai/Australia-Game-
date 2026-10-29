/**
 * Agent 13 scale wave round 40 (O10-211) — compound geothermal basin heat federation & industrial thermal dispatch orchestration depth.
 */

export type V1014GeothermalBasinHeatBand =
  | 'untapped_basins'
  | 'pilot_geothermal_heat'
  | 'basin_heat_corridor'
  | 'federated_geothermal_heat_leader';

export type V1014IndustrialThermalFederationBand =
  | 'fossil_process_heat'
  | 'pilot_thermal_federation'
  | 'thermal_federation_hub'
  | 'deep_process_heat_mesh';

export interface V1014GeothermalBasinHeatInstrument {
  id: string;
  kind: 'basin_heat_federation_hub' | 'enhanced_geothermal_corridor' | 'industrial_heat_wheeling_mesh' | 'federation_geothermal_tie';
  label: string;
  heatScoreEq: number;
  geothermalReliefFactor: number;
  thermalFederationSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_GEOTHERMAL_BASIN_HEAT_CATALOG: readonly V1014GeothermalBasinHeatInstrument[] = [
  {
    id: 'gb_hub',
    kind: 'basin_heat_federation_hub',
    label: 'Geothermal basin heat federation hub',
    heatScoreEq: 47,
    geothermalReliefFactor: 0.17,
    thermalFederationSynergyFactor: 0.11,
    projectTypeHint: 'geothermal_basin_heat_federation_hub',
  },
  {
    id: 'gb_enhanced',
    kind: 'enhanced_geothermal_corridor',
    label: 'Enhanced geothermal corridor loop',
    heatScoreEq: 45,
    geothermalReliefFactor: 0.16,
    thermalFederationSynergyFactor: 0.12,
    projectTypeHint: 'enhanced_geothermal_corridor_loop',
  },
  {
    id: 'gb_wheel',
    kind: 'industrial_heat_wheeling_mesh',
    label: 'Industrial heat wheeling federation mesh',
    heatScoreEq: 49,
    geothermalReliefFactor: 0.18,
    thermalFederationSynergyFactor: 0.1,
    projectTypeHint: 'industrial_heat_wheeling_federation_mesh',
  },
  {
    id: 'gb_fed',
    kind: 'federation_geothermal_tie',
    label: 'Federation geothermal basin tie',
    heatScoreEq: 51,
    geothermalReliefFactor: 0.17,
    thermalFederationSynergyFactor: 0.13,
    projectTypeHint: 'federation_geothermal_basin_tie',
  },
] as const;

export interface V1014IndustrialThermalFederationTemplate {
  id: string;
  kind: 'process_heat_orchestration_hub' | 'thermal_storage_dispatch_stack' | 'csp_geothermal_hybrid_mesh' | 'district_thermal_federation_corridor';
  label: string;
  thermalScoreEq: number;
  thermalReliefFactor: number;
  geothermalSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_INDUSTRIAL_THERMAL_FEDERATION_CATALOG: readonly V1014IndustrialThermalFederationTemplate[] = [
  {
    id: 'tf_process',
    kind: 'process_heat_orchestration_hub',
    label: 'Process-heat orchestration hub',
    thermalScoreEq: 46,
    thermalReliefFactor: 0.15,
    geothermalSynergyFactor: 0.11,
    projectTypeHint: 'process_heat_orchestration_hub',
  },
  {
    id: 'tf_storage',
    kind: 'thermal_storage_dispatch_stack',
    label: 'Thermal storage dispatch stacking layer',
    thermalScoreEq: 48,
    thermalReliefFactor: 0.16,
    geothermalSynergyFactor: 0.12,
    projectTypeHint: 'thermal_storage_dispatch_federation_stack',
  },
  {
    id: 'tf_csp_geo',
    kind: 'csp_geothermal_hybrid_mesh',
    label: 'CSP–geothermal hybrid federation mesh',
    thermalScoreEq: 50,
    thermalReliefFactor: 0.17,
    geothermalSynergyFactor: 0.13,
    projectTypeHint: 'csp_geothermal_hybrid_federation_mesh',
  },
  {
    id: 'tf_district',
    kind: 'district_thermal_federation_corridor',
    label: 'District thermal federation corridor',
    thermalScoreEq: 44,
    thermalReliefFactor: 0.14,
    geothermalSynergyFactor: 0.1,
    projectTypeHint: 'district_thermal_federation_corridor',
  },
] as const;

export interface V1014RegionalGeothermalBasinHeatLedger {
  regionId: string;
  band: V1014GeothermalBasinHeatBand;
  basinHeatIndex: number;
  basinHeatBalance: number;
  geothermalBasinHeatRelief: number;
  summary: string;
}

export interface V1014RegionalIndustrialThermalFederationLedger {
  regionId: string;
  band: V1014IndustrialThermalFederationBand;
  thermalIndex: number;
  industrialThermalFederationRelief: number;
  summary: string;
}

export interface V1014GeothermalBasinHeatPersistedSlice {
  basinHeatBalance: number;
  basinHeatIndex: number;
}

export interface V1014IndustrialThermalFederationPersistedSlice {
  thermalIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const GEOTHERMAL_BASIN_REGIONS = new Set(['QLD', 'SA', 'VIC', 'NSW', 'WA']);

export function computeRegionalGeothermalBasinHeatLedger(params: {
  regionId: string;
  geothermalHeatRelief: number;
  symbiosisFederationRelief: number;
  circularStewardshipRelief: number;
  wasteHeatRecoveryRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014GeothermalBasinHeatPersistedSlice | null;
}): { ledger: V1014RegionalGeothermalBasinHeatLedger; next: V1014GeothermalBasinHeatPersistedSlice } {
  let heatGain = 0;
  let heatProxy = 0;
  let thermalSynergy = 0;
  for (const inst of V1014_GEOTHERMAL_BASIN_HEAT_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      heatGain += inst.heatScoreEq;
      heatProxy += inst.geothermalReliefFactor;
      thermalSynergy += inst.thermalFederationSynergyFactor;
    }
  }
  if (GEOTHERMAL_BASIN_REGIONS.has(params.regionId)) heatProxy += 0.07;
  else heatProxy *= 0.71;
  if (params.geothermalHeatRelief > 2.2) heatGain += clamp(params.geothermalHeatRelief * 0.72, 0, 9);
  if (params.symbiosisFederationRelief > 2.3) thermalSynergy += clamp(params.symbiosisFederationRelief * 0.009, 0, 0.05);
  if (params.circularStewardshipRelief > 2.3) heatProxy += clamp(params.circularStewardshipRelief * 0.007, 0, 0.04);
  if (params.wasteHeatRecoveryRelief > 2.2) heatGain += clamp(params.wasteHeatRecoveryRelief * 0.55, 0, 7);
  heatProxy += clamp(params.renewableShareScore / 108, 0, 0.08);

  const prevIdx = params.prev?.basinHeatIndex ?? 0;
  const prevBal = params.prev?.basinHeatBalance ?? 0;
  const basinHeatBalance = clamp(prevBal * 0.83 + heatGain * 0.1, 0, 255);
  const basinHeatIndex = clamp(
    prevIdx * 0.8 + basinHeatBalance * 0.09 + heatProxy * 76 + thermalSynergy * 22,
    0,
    194,
  );

  let band: V1014GeothermalBasinHeatBand = 'untapped_basins';
  if (basinHeatIndex >= 123 || heatGain >= 142) band = 'federated_geothermal_heat_leader';
  else if (basinHeatIndex >= 83 || heatGain >= 96) band = 'basin_heat_corridor';
  else if (basinHeatIndex >= 40 || heatGain >= 38) band = 'pilot_geothermal_heat';

  let geothermalBasinHeatRelief = clamp(heatProxy * 7.8 + heatGain * 0.026 + thermalSynergy * 4.5, 0, 10);
  if (band === 'untapped_basins') geothermalBasinHeatRelief *= 0.18;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      basinHeatIndex: clamp(basinHeatIndex, 0, 194),
      basinHeatBalance: clamp(basinHeatBalance, 0, 255),
      geothermalBasinHeatRelief: clamp(geothermalBasinHeatRelief, 0, 10),
      summary: `${params.regionId} geo basin ${band} · idx ${basinHeatIndex.toFixed(0)} · relief ${geothermalBasinHeatRelief.toFixed(1)}`,
    },
    next: {
      basinHeatBalance: clamp(basinHeatBalance, 0, 255),
      basinHeatIndex: clamp(basinHeatIndex, 0, 194),
    },
  };
}

export function advanceRegionalIndustrialThermalFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  basinHeatBand: V1014GeothermalBasinHeatBand;
  cspThermalDispatchRelief: number;
  districtHeatRelief: number;
  completedProjectTypes: string[];
  prev?: V1014IndustrialThermalFederationPersistedSlice | null;
}): { ledger: V1014RegionalIndustrialThermalFederationLedger; next: V1014IndustrialThermalFederationPersistedSlice } {
  let thermalGain = 0;
  let thermalProxy = 0;
  let geoSynergy = 0;
  for (const tpl of V1014_INDUSTRIAL_THERMAL_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      thermalGain += tpl.thermalScoreEq;
      thermalProxy += tpl.thermalReliefFactor;
      geoSynergy += tpl.geothermalSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('process_heat_recovery_loop')) {
    thermalGain += 9;
    thermalProxy += 0.04;
  }
  if (params.basinHeatBand === 'basin_heat_corridor' || params.basinHeatBand === 'federated_geothermal_heat_leader') {
    thermalGain += 17;
    geoSynergy += 0.11;
  }
  if (params.cspThermalDispatchRelief > 2.2) {
    thermalGain += params.cspThermalDispatchRelief * 0.6;
    thermalProxy += clamp(params.cspThermalDispatchRelief * 0.007, 0, 0.04);
  }
  if (params.districtHeatRelief > 2.1) geoSynergy += clamp(params.districtHeatRelief * 0.008, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.15, 0, 6.5);
  const prevIdx = params.prev?.thermalIndex ?? 0;
  const thermalIndex = clamp(
    prevIdx * 0.81 + thermalGain * 0.1 + thermalProxy * 25 - stressLoad * 0.02 + geoSynergy * 22,
    0,
    196,
  );

  let band: V1014IndustrialThermalFederationBand = 'fossil_process_heat';
  if (thermalIndex >= 126 || thermalGain >= 148) band = 'deep_process_heat_mesh';
  else if (thermalIndex >= 86 || thermalGain >= 102) band = 'thermal_federation_hub';
  else if (thermalIndex >= 41 || thermalGain >= 39) band = 'pilot_thermal_federation';

  let industrialThermalFederationRelief = clamp(thermalIndex / 18.2 + thermalProxy * 6 + geoSynergy * 6.2, 0, 9.8);
  if (band === 'fossil_process_heat') industrialThermalFederationRelief = clamp(industrialThermalFederationRelief * 0.16, 0, 1.7);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      thermalIndex: clamp(thermalIndex, 0, 196),
      industrialThermalFederationRelief: clamp(industrialThermalFederationRelief, 0, 9.8),
      summary: `${params.regionId} thermal fed ${band} · idx ${thermalIndex.toFixed(0)} · relief ${industrialThermalFederationRelief.toFixed(1)}`,
    },
    next: { thermalIndex: clamp(thermalIndex, 0, 196) },
  };
}

export function runAgent13GeothermalThermalScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_GEOTHERMAL_BASIN_HEAT_CATALOG.length >= 4);
  ok(V1014_INDUSTRIAL_THERMAL_FEDERATION_CATALOG.length >= 4);

  const geo = computeRegionalGeothermalBasinHeatLedger({
    regionId: 'QLD',
    geothermalHeatRelief: 2.8,
    symbiosisFederationRelief: 2.5,
    circularStewardshipRelief: 2.4,
    wasteHeatRecoveryRelief: 2.5,
    renewableShareScore: 54,
    completedProjectTypes: ['geothermal_basin_heat_federation_hub', 'federation_geothermal_basin_tie'],
  });
  ok(geo.ledger.geothermalBasinHeatRelief >= 1.5 || geo.ledger.band !== 'untapped_basins');

  const therm = advanceRegionalIndustrialThermalFederationOrchestration({
    regionId: 'QLD',
    gridStressPoints: 15,
    basinHeatBand: geo.ledger.band,
    cspThermalDispatchRelief: 2.6,
    districtHeatRelief: 2.4,
    completedProjectTypes: ['process_heat_orchestration_hub', 'csp_geothermal_hybrid_federation_mesh'],
  });
  ok(therm.ledger.industrialThermalFederationRelief >= 1.2 || therm.ledger.band !== 'fossil_process_heat');

  const turnSc = runAgent13GeothermalThermalTurnScenario(V1014_GEOTHERMAL_THERMAL_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13GeothermalThermalGIAlignment({
    actionText: 'Geothermal basin heat federation hub with CSP geothermal hybrid mesh and thermal storage dispatch stack',
    basinHeatBand: 'basin_heat_corridor',
    thermalBand: 'thermal_federation_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13GeothermalThermalTurnStep {
  turn: number;
  regionId: string;
  geothermalHeatRelief: number;
  symbiosisFederationRelief: number;
  circularStewardshipRelief: number;
  wasteHeatRecoveryRelief: number;
  cspThermalDispatchRelief: number;
  districtHeatRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13GeothermalThermalTurnScenario {
  id: string;
  label: string;
  steps: Agent13GeothermalThermalTurnStep[];
  expect: { minBasinHeatReliefOnLast?: number; minThermalReliefOnLast?: number };
}

export const V1014_GEOTHERMAL_THERMAL_TURN_SCENARIOS: readonly Agent13GeothermalThermalTurnScenario[] = [
  {
    id: 'sc_gt_qld_escalation',
    label: 'QLD geothermal basin with thermal federation mesh',
    steps: [
      {
        turn: 1,
        regionId: 'QLD',
        geothermalHeatRelief: 2,
        symbiosisFederationRelief: 1.9,
        circularStewardshipRelief: 1.8,
        wasteHeatRecoveryRelief: 1.9,
        cspThermalDispatchRelief: 1.8,
        districtHeatRelief: 1.7,
        renewableShareScore: 44,
        gridStressPoints: 17,
        completedProjectTypes: ['geothermal_basin_heat_federation_hub', 'process_heat_orchestration_hub'],
      },
      {
        turn: 2,
        regionId: 'QLD',
        geothermalHeatRelief: 2.4,
        symbiosisFederationRelief: 2.2,
        circularStewardshipRelief: 2.1,
        wasteHeatRecoveryRelief: 2.2,
        cspThermalDispatchRelief: 2.1,
        districtHeatRelief: 2,
        renewableShareScore: 50,
        gridStressPoints: 16,
        completedProjectTypes: ['enhanced_geothermal_corridor_loop', 'thermal_storage_dispatch_federation_stack'],
      },
      {
        turn: 3,
        regionId: 'QLD',
        geothermalHeatRelief: 2.9,
        symbiosisFederationRelief: 2.6,
        circularStewardshipRelief: 2.5,
        wasteHeatRecoveryRelief: 2.5,
        cspThermalDispatchRelief: 2.5,
        districtHeatRelief: 2.3,
        renewableShareScore: 56,
        gridStressPoints: 14,
        completedProjectTypes: [
          'geothermal_basin_heat_federation_hub',
          'enhanced_geothermal_corridor_loop',
          'industrial_heat_wheeling_federation_mesh',
          'federation_geothermal_basin_tie',
          'process_heat_orchestration_hub',
          'thermal_storage_dispatch_federation_stack',
          'csp_geothermal_hybrid_federation_mesh',
          'district_thermal_federation_corridor',
          'process_heat_recovery_loop',
        ],
      },
    ],
    expect: { minBasinHeatReliefOnLast: 1.5, minThermalReliefOnLast: 1.1 },
  },
] as const;

export function runAgent13GeothermalThermalTurnScenario(
  scenario: Agent13GeothermalThermalTurnScenario,
): { passed: boolean; detail: string; lastBasinHeatRelief: number; lastThermalRelief: number } {
  let geoMem: V1014GeothermalBasinHeatPersistedSlice | null = null;
  let thermMem: V1014IndustrialThermalFederationPersistedSlice | null = null;
  let lastBasinHeatRelief = 0;
  let lastThermalRelief = 0;

  for (const step of scenario.steps) {
    const geo = computeRegionalGeothermalBasinHeatLedger({
      regionId: step.regionId,
      geothermalHeatRelief: step.geothermalHeatRelief,
      symbiosisFederationRelief: step.symbiosisFederationRelief,
      circularStewardshipRelief: step.circularStewardshipRelief,
      wasteHeatRecoveryRelief: step.wasteHeatRecoveryRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: geoMem,
    });
    geoMem = geo.next;
    lastBasinHeatRelief = geo.ledger.geothermalBasinHeatRelief;

    const therm = advanceRegionalIndustrialThermalFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      basinHeatBand: geo.ledger.band,
      cspThermalDispatchRelief: step.cspThermalDispatchRelief,
      districtHeatRelief: step.districtHeatRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: thermMem,
    });
    thermMem = therm.next;
    lastThermalRelief = therm.ledger.industrialThermalFederationRelief;
  }

  if (scenario.expect.minBasinHeatReliefOnLast != null && lastBasinHeatRelief < scenario.expect.minBasinHeatReliefOnLast) {
    return { passed: false, detail: `geo ${lastBasinHeatRelief}`, lastBasinHeatRelief, lastThermalRelief };
  }
  if (scenario.expect.minThermalReliefOnLast != null && lastThermalRelief < scenario.expect.minThermalReliefOnLast) {
    return { passed: false, detail: `therm ${lastThermalRelief}`, lastBasinHeatRelief, lastThermalRelief };
  }
  return { passed: true, detail: 'ok', lastBasinHeatRelief, lastThermalRelief };
}

export function scoreAgent13GeothermalThermalGIAlignment(params: {
  actionText: string;
  basinHeatBand?: string;
  thermalBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'geothermal',
    'basin heat',
    'process heat',
    'thermal storage',
    'csp',
    'district thermal',
    'heat wheeling',
    'industrial heat',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.14, 0, 2);
  if (params.basinHeatBand === 'federated_geothermal_heat_leader' || params.basinHeatBand === 'basin_heat_corridor') {
    delta += hits.some(h => h.includes('geothermal') || h.includes('basin')) ? 0.33 : 0.08;
  }
  if (params.thermalBand === 'thermal_federation_hub' || params.thermalBand === 'deep_process_heat_mesh') {
    delta += hits.some(h => h.includes('thermal') || h.includes('heat') || h.includes('csp')) ? 0.31 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Geothermal thermal GI: ${hits.slice(0, 2).join(', ')} aligns with basin heat federation and industrial thermal dispatch depth.`
        : null,
  };
}
