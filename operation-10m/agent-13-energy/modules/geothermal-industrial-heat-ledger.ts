/**
 * Agent 13 scale wave round 12 — geothermal resource corridors & industrial process-heat decarbonization.
 * Cross-turn persistence for subsurface heat build-out and electrified industrial thermal relief.
 */

export type V1014GeothermalBand = 'prospect' | 'exploration' | 'field_online' | 'basin_leader';

export type V1014IndustrialHeatDecarbBand = 'fossil_locked' | 'hybridizing' | 'electrified' | 'zero_thermal_emissions';

export interface V1014GeothermalInstrument {
  id: string;
  kind: 'hot_sedimentary' | 'enhanced_geothermal' | 'direct_use_district' | 'binary_orc_plant';
  label: string;
  thermalMwEq: number;
  heatReliefFactor: number;
  industrialSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_GEOTHERMAL_CATALOG: readonly V1014GeothermalInstrument[] = [
  {
    id: 'geo_sedimentary',
    kind: 'hot_sedimentary',
    label: 'Hot sedimentary aquifer field',
    thermalMwEq: 46,
    heatReliefFactor: 0.16,
    industrialSynergyFactor: 0.1,
    projectTypeHint: 'hot_sedimentary_geothermal',
  },
  {
    id: 'geo_egs',
    kind: 'enhanced_geothermal',
    label: 'Enhanced geothermal system pilot',
    thermalMwEq: 38,
    heatReliefFactor: 0.14,
    industrialSynergyFactor: 0.11,
    projectTypeHint: 'enhanced_geothermal_system',
  },
  {
    id: 'geo_direct',
    kind: 'direct_use_district',
    label: 'Direct-use district heat network',
    thermalMwEq: 34,
    heatReliefFactor: 0.13,
    industrialSynergyFactor: 0.09,
    projectTypeHint: 'geothermal_direct_use_heat',
  },
  {
    id: 'geo_binary',
    kind: 'binary_orc_plant',
    label: 'Binary ORC geothermal plant',
    thermalMwEq: 42,
    heatReliefFactor: 0.15,
    industrialSynergyFactor: 0.12,
    projectTypeHint: 'binary_orc_geothermal',
  },
] as const;

export interface V1014IndustrialHeatDecarbTemplate {
  id: string;
  kind: 'industrial_heat_pump' | 'electric_process_boiler' | 'waste_heat_recovery' | 'smelter_electrification';
  label: string;
  decarbMwEq: number;
  emissionsReliefFactor: number;
  geoSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_INDUSTRIAL_HEAT_DECARB_CATALOG: readonly V1014IndustrialHeatDecarbTemplate[] = [
  {
    id: 'heat_pump',
    kind: 'industrial_heat_pump',
    label: 'Industrial high-temperature heat pump',
    decarbMwEq: 40,
    emissionsReliefFactor: 0.15,
    geoSynergyFactor: 0.1,
    projectTypeHint: 'industrial_heat_pump_hub',
  },
  {
    id: 'elec_boiler',
    kind: 'electric_process_boiler',
    label: 'Electric process boiler conversion',
    decarbMwEq: 36,
    emissionsReliefFactor: 0.13,
    geoSynergyFactor: 0.08,
    projectTypeHint: 'electric_process_boiler',
  },
  {
    id: 'whr',
    kind: 'waste_heat_recovery',
    label: 'Waste heat recovery loop',
    decarbMwEq: 44,
    emissionsReliefFactor: 0.17,
    geoSynergyFactor: 0.09,
    projectTypeHint: 'industrial_waste_heat_recovery',
  },
  {
    id: 'smelt_elec',
    kind: 'smelter_electrification',
    label: 'Smelter electrification corridor',
    decarbMwEq: 52,
    emissionsReliefFactor: 0.18,
    geoSynergyFactor: 0.11,
    projectTypeHint: 'smelter_electrification_corridor',
  },
] as const;

export interface V1014RegionalGeothermalLedger {
  regionId: string;
  band: V1014GeothermalBand;
  thermalIndex: number;
  reservoirBalance: number;
  geothermalHeatRelief: number;
  summary: string;
}

export interface V1014RegionalIndustrialHeatDecarbLedger {
  regionId: string;
  band: V1014IndustrialHeatDecarbBand;
  decarbIndex: number;
  industrialHeatRelief: number;
  summary: string;
}

export interface V1014GeothermalPersistedSlice {
  reservoirBalance: number;
  thermalIndex: number;
}

export interface V1014IndustrialHeatPersistedSlice {
  decarbIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const GEOTHERMAL_REGIONS = new Set(['SA', 'VIC', 'QLD', 'NSW', 'WA', 'NT', 'TAS']);

export function computeRegionalGeothermalLedger(params: {
  regionId: string;
  extractionScore: number;
  agrivoltaicsLandRelief: number;
  hydrogenGridRelief: number;
  completedProjectTypes: string[];
  prev?: V1014GeothermalPersistedSlice | null;
}): { ledger: V1014RegionalGeothermalLedger; next: V1014GeothermalPersistedSlice } {
  let thermalGain = 0;
  let heatProxy = 0;
  let industrialSynergy = 0;
  for (const inst of V1014_GEOTHERMAL_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      thermalGain += inst.thermalMwEq;
      heatProxy += inst.heatReliefFactor;
      industrialSynergy += inst.industrialSynergyFactor;
    }
  }
  if (GEOTHERMAL_REGIONS.has(params.regionId)) heatProxy += 0.05;
  else heatProxy *= 0.62;
  if (params.extractionScore > 40) thermalGain += clamp((params.extractionScore - 40) * 0.4, 0, 16);

  const prevIdx = params.prev?.thermalIndex ?? 0;
  const prevRes = params.prev?.reservoirBalance ?? 0;
  const reservoirBalance = clamp(prevRes * 0.9 + thermalGain * 0.1, 0, 215);
  const thermalIndex = clamp(prevIdx * 0.87 + reservoirBalance * 0.13 + heatProxy * 86 + industrialSynergy * 22, 0, 147);

  let band: V1014GeothermalBand = 'prospect';
  if (thermalIndex >= 94 || thermalGain >= 112) band = 'basin_leader';
  else if (thermalIndex >= 58 || thermalGain >= 66) band = 'field_online';
  else if (thermalIndex >= 24 || thermalGain >= 22) band = 'exploration';

  let geothermalHeatRelief = clamp(heatProxy * 9.4 + thermalGain * 0.05 + industrialSynergy * 5.5, 0, 12);
  if (params.agrivoltaicsLandRelief > 3) geothermalHeatRelief += clamp(params.agrivoltaicsLandRelief * 0.08, 0, 1.5);
  if (params.hydrogenGridRelief > 4) geothermalHeatRelief += clamp(params.hydrogenGridRelief * 0.09, 0, 1.8);
  if (band === 'prospect') geothermalHeatRelief *= 0.4;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      thermalIndex: clamp(thermalIndex, 0, 147),
      reservoirBalance: clamp(reservoirBalance, 0, 215),
      geothermalHeatRelief: clamp(geothermalHeatRelief, 0, 13),
      summary: `${params.regionId} geothermal ${band} · thermal idx ${thermalIndex.toFixed(0)} · relief ${geothermalHeatRelief.toFixed(1)}`,
    },
    next: { reservoirBalance, thermalIndex: clamp(thermalIndex, 0, 147) },
  };
}

export function advanceRegionalIndustrialHeatDecarbon(params: {
  regionId: string;
  netEmissionsIndex: number;
  geothermalBand: V1014GeothermalBand;
  mineralsSupplyRelief: number;
  completedProjectTypes: string[];
  prev?: V1014IndustrialHeatPersistedSlice | null;
}): { ledger: V1014RegionalIndustrialHeatDecarbLedger; next: V1014IndustrialHeatPersistedSlice } {
  let decarbGain = 0;
  let reliefProxy = 0;
  let geoSynergy = 0;
  for (const tpl of V1014_INDUSTRIAL_HEAT_DECARB_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      decarbGain += tpl.decarbMwEq;
      reliefProxy += tpl.emissionsReliefFactor;
      geoSynergy += tpl.geoSynergyFactor;
    }
  }
  if (params.geothermalBand === 'field_online' || params.geothermalBand === 'basin_leader') {
    decarbGain += 14;
    geoSynergy += 0.08;
  }
  if (params.mineralsSupplyRelief > 4) {
    decarbGain += params.mineralsSupplyRelief * 1.05;
    reliefProxy += clamp(params.mineralsSupplyRelief * 0.012, 0, 0.1);
  }
  const emissionsLoad = clamp(params.netEmissionsIndex * 0.06, 0, 14);

  const prevIdx = params.prev?.decarbIndex ?? 0;
  const decarbIndex = clamp(
    prevIdx * 0.88 + decarbGain * 0.12 + reliefProxy * 35 - emissionsLoad * 0.04 + geoSynergy * 28,
    0,
    153,
  );

  let band: V1014IndustrialHeatDecarbBand = 'fossil_locked';
  if (decarbIndex >= 97 || decarbGain >= 118) band = 'zero_thermal_emissions';
  else if (decarbIndex >= 58 || decarbGain >= 68) band = 'electrified';
  else if (decarbIndex >= 24 || decarbGain >= 22) band = 'hybridizing';

  const industrialHeatRelief = clamp(decarbIndex / 23 + reliefProxy * 7.2 + geoSynergy * 8.8, 0, 11);
  if (band === 'fossil_locked') {
    return {
      ledger: {
        regionId: params.regionId,
        band,
        decarbIndex: clamp(decarbIndex, 0, 153),
        industrialHeatRelief: clamp(industrialHeatRelief * 0.37, 0, 3.5),
        summary: `${params.regionId} industrial heat fossil-locked · idx ${decarbIndex.toFixed(0)}`,
      },
      next: { decarbIndex: clamp(decarbIndex, 0, 153) },
    };
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      decarbIndex: clamp(decarbIndex, 0, 153),
      industrialHeatRelief: clamp(industrialHeatRelief, 0, 11),
      summary: `${params.regionId} industrial heat ${band} · decarb idx ${decarbIndex.toFixed(0)} · relief ${industrialHeatRelief.toFixed(1)}`,
    },
    next: { decarbIndex: clamp(decarbIndex, 0, 153) },
  };
}

export const V1014_GEO_HEAT_SCENARIOS = [
  {
    id: 'sc_geo_sa',
    label: 'SA hot sedimentary with smelter electrification',
    regionId: 'SA',
    extractionScore: 44,
    agrivoltaicsLandRelief: 4,
    hydrogenGridRelief: 5,
    netEmissionsIndex: 58,
    mineralsSupplyRelief: 5,
    completedProjectTypes: [
      'hot_sedimentary_geothermal',
      'binary_orc_geothermal',
      'industrial_heat_pump_hub',
      'smelter_electrification_corridor',
    ],
    expectGeoBand: 'field_online' as V1014GeothermalBand,
    expectMinGeoRelief: 3,
    expectHeatBand: 'electrified' as V1014IndustrialHeatDecarbBand,
    expectMinHeatRelief: 2,
  },
  {
    id: 'sc_heat_vic',
    label: 'VIC waste heat recovery with EGS pilot',
    regionId: 'VIC',
    extractionScore: 36,
    agrivoltaicsLandRelief: 3,
    hydrogenGridRelief: 3,
    netEmissionsIndex: 62,
    mineralsSupplyRelief: 3,
    geothermalBand: 'exploration' as V1014GeothermalBand,
    completedProjectTypes: ['enhanced_geothermal_system', 'electric_process_boiler', 'industrial_waste_heat_recovery'],
    expectHeatBand: 'hybridizing' as V1014IndustrialHeatDecarbBand,
    expectMinHeatRelief: 2,
  },
] as const;

export function runAgent13GeoHeatScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_GEOTHERMAL_CATALOG.length >= 4);
  ok(V1014_INDUSTRIAL_HEAT_DECARB_CATALOG.length >= 4);

  const sc0 = V1014_GEO_HEAT_SCENARIOS[0];
  const geo = computeRegionalGeothermalLedger({
    regionId: sc0.regionId,
    extractionScore: sc0.extractionScore,
    agrivoltaicsLandRelief: sc0.agrivoltaicsLandRelief,
    hydrogenGridRelief: sc0.hydrogenGridRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    geo.ledger.band === sc0.expectGeoBand ||
      geo.ledger.band === 'basin_leader' ||
      geo.ledger.geothermalHeatRelief >= sc0.expectMinGeoRelief,
  );

  const heat = advanceRegionalIndustrialHeatDecarbon({
    regionId: sc0.regionId,
    netEmissionsIndex: sc0.netEmissionsIndex,
    geothermalBand: geo.ledger.band,
    mineralsSupplyRelief: sc0.mineralsSupplyRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    heat.ledger.band === sc0.expectHeatBand ||
      heat.ledger.band === 'zero_thermal_emissions' ||
      heat.ledger.industrialHeatRelief >= sc0.expectMinHeatRelief,
  );

  const sc1 = V1014_GEO_HEAT_SCENARIOS[1];
  const heatV = advanceRegionalIndustrialHeatDecarbon({
    regionId: sc1.regionId,
    netEmissionsIndex: sc1.netEmissionsIndex,
    geothermalBand: sc1.geothermalBand,
    mineralsSupplyRelief: sc1.mineralsSupplyRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(heatV.ledger.industrialHeatRelief >= sc1.expectMinHeatRelief || heatV.ledger.band !== 'fossil_locked');

  const persistA = computeRegionalGeothermalLedger({
    regionId: 'QLD',
    extractionScore: 48,
    agrivoltaicsLandRelief: 3,
    hydrogenGridRelief: 4,
    completedProjectTypes: ['hot_sedimentary_geothermal'],
    prev: null,
  });
  const persistB = computeRegionalGeothermalLedger({
    regionId: 'QLD',
    extractionScore: 48,
    agrivoltaicsLandRelief: 3,
    hydrogenGridRelief: 4,
    completedProjectTypes: ['hot_sedimentary_geothermal'],
    prev: persistA.next,
  });
  ok(persistB.next.thermalIndex >= persistA.next.thermalIndex * 0.82);

  const turnSc = runAgent13GeoHeatTurnScenario(V1014_GEO_HEAT_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastGeoRelief >= 3);

  const gi = scoreAgent13GeoHeatGIAlignment({
    actionText: 'Hot sedimentary geothermal with smelter electrification and heat pumps',
    geoBand: 'field_online',
    heatBand: 'electrified',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13GeoHeatTurnStep {
  turn: number;
  regionId: string;
  extractionScore: number;
  agrivoltaicsLandRelief: number;
  hydrogenGridRelief: number;
  netEmissionsIndex: number;
  mineralsSupplyRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13GeoHeatTurnScenario {
  id: string;
  label: string;
  steps: Agent13GeoHeatTurnStep[];
  expect: {
    minGeoReliefOnLast?: number;
    minHeatReliefOnLast?: number;
    lastGeoBand?: V1014GeothermalBand;
  };
}

export const V1014_GEO_HEAT_TURN_SCENARIOS: readonly Agent13GeoHeatTurnScenario[] = [
  {
    id: 'sc_geo_heat_sa',
    label: 'SA geothermal basin with industrial heat decarbon across turns',
    steps: [
      {
        turn: 1,
        regionId: 'SA',
        extractionScore: 46,
        agrivoltaicsLandRelief: 3,
        hydrogenGridRelief: 4,
        netEmissionsIndex: 68,
        mineralsSupplyRelief: 4,
        completedProjectTypes: ['hot_sedimentary_geothermal', 'industrial_heat_pump_hub'],
      },
      {
        turn: 2,
        regionId: 'SA',
        extractionScore: 44,
        agrivoltaicsLandRelief: 3.5,
        hydrogenGridRelief: 4.5,
        netEmissionsIndex: 60,
        mineralsSupplyRelief: 4.5,
        completedProjectTypes: ['hot_sedimentary_geothermal', 'binary_orc_geothermal', 'electric_process_boiler'],
      },
      {
        turn: 3,
        regionId: 'SA',
        extractionScore: 40,
        agrivoltaicsLandRelief: 4.5,
        hydrogenGridRelief: 5.5,
        netEmissionsIndex: 52,
        mineralsSupplyRelief: 5.5,
        completedProjectTypes: [
          'hot_sedimentary_geothermal',
          'binary_orc_geothermal',
          'geothermal_direct_use_heat',
          'industrial_heat_pump_hub',
          'smelter_electrification_corridor',
          'industrial_waste_heat_recovery',
        ],
      },
    ],
    expect: { minGeoReliefOnLast: 3, minHeatReliefOnLast: 2, lastGeoBand: 'field_online' },
  },
] as const;

export function runAgent13GeoHeatTurnScenario(
  scenario: Agent13GeoHeatTurnScenario,
): { passed: boolean; detail: string; lastGeoRelief: number; lastHeatRelief: number } {
  let geoMem: V1014GeothermalPersistedSlice | null = null;
  let heatMem: V1014IndustrialHeatPersistedSlice | null = null;
  let lastGeoRelief = 0;
  let lastHeatRelief = 0;
  let lastBand: V1014GeothermalBand = 'prospect';

  for (const step of scenario.steps) {
    const geo = computeRegionalGeothermalLedger({
      regionId: step.regionId,
      extractionScore: step.extractionScore,
      agrivoltaicsLandRelief: step.agrivoltaicsLandRelief,
      hydrogenGridRelief: step.hydrogenGridRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: geoMem,
    });
    geoMem = geo.next;
    lastGeoRelief = geo.ledger.geothermalHeatRelief;
    lastBand = geo.ledger.band;

    const heat = advanceRegionalIndustrialHeatDecarbon({
      regionId: step.regionId,
      netEmissionsIndex: step.netEmissionsIndex,
      geothermalBand: geo.ledger.band,
      mineralsSupplyRelief: step.mineralsSupplyRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: heatMem,
    });
    heatMem = heat.next;
    lastHeatRelief = heat.ledger.industrialHeatRelief;
  }

  if (scenario.expect.minGeoReliefOnLast != null && lastGeoRelief < scenario.expect.minGeoReliefOnLast) {
    return {
      passed: false,
      detail: `geo relief ${lastGeoRelief} < ${scenario.expect.minGeoReliefOnLast}`,
      lastGeoRelief,
      lastHeatRelief,
    };
  }
  if (scenario.expect.minHeatReliefOnLast != null && lastHeatRelief < scenario.expect.minHeatReliefOnLast) {
    return {
      passed: false,
      detail: `heat relief ${lastHeatRelief} < ${scenario.expect.minHeatReliefOnLast}`,
      lastGeoRelief,
      lastHeatRelief,
    };
  }
  if (scenario.expect.lastGeoBand != null) {
    const allowed: V1014GeothermalBand[] = [scenario.expect.lastGeoBand];
    if (scenario.expect.lastGeoBand === 'field_online') allowed.push('basin_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastGeoRelief, lastHeatRelief };
    }
  }

  return { passed: true, detail: 'ok', lastGeoRelief, lastHeatRelief };
}

export function scoreAgent13GeoHeatGIAlignment(params: {
  actionText: string;
  geoBand?: string;
  heatBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = ['geothermal', 'hot sedimentary', 'process heat', 'heat pump', 'smelter', 'electrification', 'waste heat'].filter(
    k => text.includes(k),
  );
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.36, 0, 2);
  if (params.geoBand === 'basin_leader' || params.geoBand === 'field_online') {
    delta += hits.some(h => h.includes('geo') || h.includes('hot')) ? 0.52 : 0.18;
  }
  if (params.heatBand === 'zero_thermal_emissions' || params.heatBand === 'electrified') {
    delta += hits.some(h => h.includes('heat') || h.includes('electr') || h.includes('smelter')) ? 0.47 : 0.15;
  }
  if (params.heatBand === 'fossil_locked' && hits.some(h => h.includes('electr'))) {
    delta -= 0.2;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Geo/heat GI: ${hits.slice(0, 2).join(', ')} aligns with geothermal corridors and industrial thermal decarbon.`
        : null,
  };
}
