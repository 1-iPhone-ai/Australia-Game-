/**
 * Agent 13 scale wave round 13 — coastal blue-carbon stewardship & shore marine energy corridors.
 * Cross-turn persistence for mangrove/seagrass carbon sinks and tidal-lagoon / wave shore power relief.
 */

export type V1014BlueCarbonCoastalBand = 'degraded' | 'restoring' | 'blue_carbon_active' | 'coastal_sink_leader';

export type V1014ShoreMarineEnergyBand = 'shore_idle' | 'pilot_lagoon' | 'corridor_online' | 'tidal_wave_leader';

export interface V1014BlueCarbonCoastalInstrument {
  id: string;
  kind: 'mangrove_restoration' | 'seagrass_meadow' | 'saltmarsh_buffer' | 'coastal_wetland_credit';
  label: string;
  carbonMwEq: number;
  coastalReliefFactor: number;
  shoreEnergySynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_BLUE_CARBON_COASTAL_CATALOG: readonly V1014BlueCarbonCoastalInstrument[] = [
  {
    id: 'bc_mangrove',
    kind: 'mangrove_restoration',
    label: 'Mangrove blue-carbon restoration',
    carbonMwEq: 36,
    coastalReliefFactor: 0.14,
    shoreEnergySynergyFactor: 0.1,
    projectTypeHint: 'mangrove_blue_carbon_restoration',
  },
  {
    id: 'bc_seagrass',
    kind: 'seagrass_meadow',
    label: 'Seagrass meadow carbon sink',
    carbonMwEq: 32,
    coastalReliefFactor: 0.12,
    shoreEnergySynergyFactor: 0.09,
    projectTypeHint: 'seagrass_carbon_meadow',
  },
  {
    id: 'bc_saltmarsh',
    kind: 'saltmarsh_buffer',
    label: 'Saltmarsh coastal buffer program',
    carbonMwEq: 40,
    coastalReliefFactor: 0.15,
    shoreEnergySynergyFactor: 0.08,
    projectTypeHint: 'saltmarsh_coastal_buffer',
  },
  {
    id: 'bc_wetland',
    kind: 'coastal_wetland_credit',
    label: 'Coastal wetland stewardship credits',
    carbonMwEq: 44,
    coastalReliefFactor: 0.16,
    shoreEnergySynergyFactor: 0.11,
    projectTypeHint: 'coastal_wetland_stewardship',
  },
] as const;

export interface V1014ShoreMarineEnergyTemplate {
  id: string;
  kind: 'tidal_lagoon' | 'wave_array' | 'shore_battery_hub' | 'coastal_microgrid_tx';
  label: string;
  shoreMwEq: number;
  gridReliefFactor: number;
  blueCarbonSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SHORE_MARINE_ENERGY_CATALOG: readonly V1014ShoreMarineEnergyTemplate[] = [
  {
    id: 'shore_lagoon',
    kind: 'tidal_lagoon',
    label: 'Tidal lagoon shore power',
    shoreMwEq: 46,
    gridReliefFactor: 0.16,
    blueCarbonSynergyFactor: 0.1,
    projectTypeHint: 'tidal_lagoon_shore_power',
  },
  {
    id: 'shore_wave',
    kind: 'wave_array',
    label: 'Nearshore wave energy array',
    shoreMwEq: 38,
    gridReliefFactor: 0.14,
    blueCarbonSynergyFactor: 0.09,
    projectTypeHint: 'nearshore_wave_array',
  },
  {
    id: 'shore_batt',
    kind: 'shore_battery_hub',
    label: 'Coastal battery shore hub',
    shoreMwEq: 42,
    gridReliefFactor: 0.15,
    blueCarbonSynergyFactor: 0.08,
    projectTypeHint: 'coastal_battery_shore_hub',
  },
  {
    id: 'shore_micro',
    kind: 'coastal_microgrid_tx',
    label: 'Coastal microgrid transmission tie',
    shoreMwEq: 34,
    gridReliefFactor: 0.13,
    blueCarbonSynergyFactor: 0.12,
    projectTypeHint: 'coastal_microgrid_transmission',
  },
] as const;

export interface V1014RegionalBlueCarbonCoastalLedger {
  regionId: string;
  band: V1014BlueCarbonCoastalBand;
  sinkIndex: number;
  wetlandBalance: number;
  blueCarbonCoastalRelief: number;
  summary: string;
}

export interface V1014RegionalShoreMarineEnergyLedger {
  regionId: string;
  band: V1014ShoreMarineEnergyBand;
  shoreIndex: number;
  shoreMarineEnergyRelief: number;
  summary: string;
}

export interface V1014BlueCarbonPersistedSlice {
  wetlandBalance: number;
  sinkIndex: number;
}

export interface V1014ShoreMarinePersistedSlice {
  shoreIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const COASTAL_REGIONS = new Set(['NSW', 'QLD', 'VIC', 'SA', 'WA', 'TAS', 'NT']);

export function computeRegionalBlueCarbonCoastalLedger(params: {
  regionId: string;
  climateHazardPressure: number;
  offshoreRenewableRelief: number;
  soilCarbonLandRelief: number;
  completedProjectTypes: string[];
  prev?: V1014BlueCarbonPersistedSlice | null;
}): { ledger: V1014RegionalBlueCarbonCoastalLedger; next: V1014BlueCarbonPersistedSlice } {
  let carbonGain = 0;
  let coastalProxy = 0;
  let shoreSynergy = 0;
  for (const inst of V1014_BLUE_CARBON_COASTAL_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      carbonGain += inst.carbonMwEq;
      coastalProxy += inst.coastalReliefFactor;
      shoreSynergy += inst.shoreEnergySynergyFactor;
    }
  }
  if (COASTAL_REGIONS.has(params.regionId)) coastalProxy += 0.06;
  else coastalProxy *= 0.55;
  if (params.climateHazardPressure > 12) {
    carbonGain += clamp(params.climateHazardPressure * 0.25, 0, 12);
    coastalProxy += 0.04;
  }

  const prevIdx = params.prev?.sinkIndex ?? 0;
  const prevWet = params.prev?.wetlandBalance ?? 0;
  const wetlandBalance = clamp(prevWet * 0.91 + carbonGain * 0.1, 0, 208);
  const sinkIndex = clamp(prevIdx * 0.88 + wetlandBalance * 0.12 + coastalProxy * 83 + shoreSynergy * 24, 0, 149);

  let band: V1014BlueCarbonCoastalBand = 'degraded';
  if (sinkIndex >= 95 || carbonGain >= 115) band = 'coastal_sink_leader';
  else if (sinkIndex >= 58 || carbonGain >= 66) band = 'blue_carbon_active';
  else if (sinkIndex >= 24 || carbonGain >= 22) band = 'restoring';

  let blueCarbonCoastalRelief = clamp(coastalProxy * 9.1 + carbonGain * 0.05 + shoreSynergy * 5.2, 0, 12);
  if (params.offshoreRenewableRelief > 4) blueCarbonCoastalRelief += clamp(params.offshoreRenewableRelief * 0.08, 0, 1.6);
  if (params.soilCarbonLandRelief > 3) blueCarbonCoastalRelief += clamp(params.soilCarbonLandRelief * 0.07, 0, 1.3);
  if (band === 'degraded') blueCarbonCoastalRelief *= 0.4;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      sinkIndex: clamp(sinkIndex, 0, 149),
      wetlandBalance: clamp(wetlandBalance, 0, 208),
      blueCarbonCoastalRelief: clamp(blueCarbonCoastalRelief, 0, 13),
      summary: `${params.regionId} blue carbon ${band} · sink idx ${sinkIndex.toFixed(0)} · relief ${blueCarbonCoastalRelief.toFixed(1)}`,
    },
    next: { wetlandBalance, sinkIndex: clamp(sinkIndex, 0, 149) },
  };
}

export function advanceRegionalShoreMarineEnergy(params: {
  regionId: string;
  gridStressPoints: number;
  blueCarbonBand: V1014BlueCarbonCoastalBand;
  industrialHeatRelief: number;
  completedProjectTypes: string[];
  prev?: V1014ShoreMarinePersistedSlice | null;
}): { ledger: V1014RegionalShoreMarineEnergyLedger; next: V1014ShoreMarinePersistedSlice } {
  let shoreGain = 0;
  let reliefProxy = 0;
  let blueSynergy = 0;
  for (const tpl of V1014_SHORE_MARINE_ENERGY_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      shoreGain += tpl.shoreMwEq;
      reliefProxy += tpl.gridReliefFactor;
      blueSynergy += tpl.blueCarbonSynergyFactor;
    }
  }
  if (params.blueCarbonBand === 'blue_carbon_active' || params.blueCarbonBand === 'coastal_sink_leader') {
    shoreGain += 13;
    blueSynergy += 0.07;
  }
  if (params.industrialHeatRelief > 4) {
    shoreGain += params.industrialHeatRelief * 1.05;
    reliefProxy += clamp(params.industrialHeatRelief * 0.01, 0, 0.08);
  }
  if (!COASTAL_REGIONS.has(params.regionId)) shoreGain *= 0.6;

  const stressLoad = clamp(params.gridStressPoints * 0.38, 0, 14);
  const prevIdx = params.prev?.shoreIndex ?? 0;
  const shoreIndex = clamp(
    prevIdx * 0.89 + shoreGain * 0.11 + reliefProxy * 36 - stressLoad * 0.06 + blueSynergy * 27,
    0,
    151,
  );

  let band: V1014ShoreMarineEnergyBand = 'shore_idle';
  if (shoreIndex >= 96 || shoreGain >= 116) band = 'tidal_wave_leader';
  else if (shoreIndex >= 58 || shoreGain >= 68) band = 'corridor_online';
  else if (shoreIndex >= 24 || shoreGain >= 22) band = 'pilot_lagoon';

  const shoreMarineEnergyRelief = clamp(shoreIndex / 24 + reliefProxy * 7 + blueSynergy * 8.5, 0, 11);
  if (band === 'shore_idle') {
    return {
      ledger: {
        regionId: params.regionId,
        band,
        shoreIndex: clamp(shoreIndex, 0, 151),
        shoreMarineEnergyRelief: clamp(shoreMarineEnergyRelief * 0.36, 0, 3.5),
        summary: `${params.regionId} shore marine idle · idx ${shoreIndex.toFixed(0)}`,
      },
      next: { shoreIndex: clamp(shoreIndex, 0, 151) },
    };
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      shoreIndex: clamp(shoreIndex, 0, 151),
      shoreMarineEnergyRelief: clamp(shoreMarineEnergyRelief, 0, 11),
      summary: `${params.regionId} shore marine ${band} · idx ${shoreIndex.toFixed(0)} · relief ${shoreMarineEnergyRelief.toFixed(1)}`,
    },
    next: { shoreIndex: clamp(shoreIndex, 0, 151) },
  };
}

export const V1014_BLUE_SHORE_SCENARIOS = [
  {
    id: 'sc_blue_qld',
    label: 'QLD mangrove restoration with tidal lagoon',
    regionId: 'QLD',
    climateHazardPressure: 20,
    offshoreRenewableRelief: 5,
    soilCarbonLandRelief: 4,
    gridStressPoints: 18,
    industrialHeatRelief: 4,
    completedProjectTypes: [
      'mangrove_blue_carbon_restoration',
      'coastal_wetland_stewardship',
      'tidal_lagoon_shore_power',
      'coastal_battery_shore_hub',
    ],
    expectBlueBand: 'blue_carbon_active' as V1014BlueCarbonCoastalBand,
    expectMinBlueRelief: 3,
    expectShoreBand: 'corridor_online' as V1014ShoreMarineEnergyBand,
    expectMinShoreRelief: 2,
  },
  {
    id: 'sc_shore_tas',
    label: 'TAS wave array with seagrass meadow',
    regionId: 'TAS',
    climateHazardPressure: 16,
    offshoreRenewableRelief: 6,
    soilCarbonLandRelief: 3,
    gridStressPoints: 17,
    industrialHeatRelief: 3,
    blueCarbonBand: 'restoring' as V1014BlueCarbonCoastalBand,
    completedProjectTypes: ['seagrass_carbon_meadow', 'nearshore_wave_array', 'coastal_microgrid_transmission'],
    expectShoreBand: 'pilot_lagoon' as V1014ShoreMarineEnergyBand,
    expectMinShoreRelief: 2,
  },
] as const;

export function runAgent13BlueShoreScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_BLUE_CARBON_COASTAL_CATALOG.length >= 4);
  ok(V1014_SHORE_MARINE_ENERGY_CATALOG.length >= 4);

  const sc0 = V1014_BLUE_SHORE_SCENARIOS[0];
  const blue = computeRegionalBlueCarbonCoastalLedger({
    regionId: sc0.regionId,
    climateHazardPressure: sc0.climateHazardPressure,
    offshoreRenewableRelief: sc0.offshoreRenewableRelief,
    soilCarbonLandRelief: sc0.soilCarbonLandRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    blue.ledger.band === sc0.expectBlueBand ||
      blue.ledger.band === 'coastal_sink_leader' ||
      blue.ledger.blueCarbonCoastalRelief >= sc0.expectMinBlueRelief,
  );

  const shore = advanceRegionalShoreMarineEnergy({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    blueCarbonBand: blue.ledger.band,
    industrialHeatRelief: sc0.industrialHeatRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    shore.ledger.band === sc0.expectShoreBand ||
      shore.ledger.band === 'tidal_wave_leader' ||
      shore.ledger.shoreMarineEnergyRelief >= sc0.expectMinShoreRelief,
  );

  const sc1 = V1014_BLUE_SHORE_SCENARIOS[1];
  const shoreT = advanceRegionalShoreMarineEnergy({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    blueCarbonBand: sc1.blueCarbonBand,
    industrialHeatRelief: sc1.industrialHeatRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(shoreT.ledger.shoreMarineEnergyRelief >= sc1.expectMinShoreRelief || shoreT.ledger.band !== 'shore_idle');

  const persistA = computeRegionalBlueCarbonCoastalLedger({
    regionId: 'NSW',
    climateHazardPressure: 14,
    offshoreRenewableRelief: 4,
    soilCarbonLandRelief: 3,
    completedProjectTypes: ['mangrove_blue_carbon_restoration'],
    prev: null,
  });
  const persistB = computeRegionalBlueCarbonCoastalLedger({
    regionId: 'NSW',
    climateHazardPressure: 14,
    offshoreRenewableRelief: 4,
    soilCarbonLandRelief: 3,
    completedProjectTypes: ['mangrove_blue_carbon_restoration'],
    prev: persistA.next,
  });
  ok(persistB.next.sinkIndex >= persistA.next.sinkIndex * 0.82);

  const turnSc = runAgent13BlueShoreTurnScenario(V1014_BLUE_SHORE_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastBlueRelief >= 3);

  const gi = scoreAgent13BlueShoreGIAlignment({
    actionText: 'Mangrove blue carbon restoration with tidal lagoon shore power',
    blueBand: 'blue_carbon_active',
    shoreBand: 'corridor_online',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13BlueShoreTurnStep {
  turn: number;
  regionId: string;
  climateHazardPressure: number;
  offshoreRenewableRelief: number;
  soilCarbonLandRelief: number;
  gridStressPoints: number;
  industrialHeatRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13BlueShoreTurnScenario {
  id: string;
  label: string;
  steps: Agent13BlueShoreTurnStep[];
  expect: {
    minBlueReliefOnLast?: number;
    minShoreReliefOnLast?: number;
    lastBlueBand?: V1014BlueCarbonCoastalBand;
  };
}

export const V1014_BLUE_SHORE_TURN_SCENARIOS: readonly Agent13BlueShoreTurnScenario[] = [
  {
    id: 'sc_blue_shore_qld',
    label: 'QLD blue carbon with shore marine corridor across turns',
    steps: [
      {
        turn: 1,
        regionId: 'QLD',
        climateHazardPressure: 16,
        offshoreRenewableRelief: 4,
        soilCarbonLandRelief: 3,
        gridStressPoints: 19,
        industrialHeatRelief: 3,
        completedProjectTypes: ['mangrove_blue_carbon_restoration', 'tidal_lagoon_shore_power'],
      },
      {
        turn: 2,
        regionId: 'QLD',
        climateHazardPressure: 18,
        offshoreRenewableRelief: 5,
        soilCarbonLandRelief: 3.5,
        gridStressPoints: 17,
        industrialHeatRelief: 3.5,
        completedProjectTypes: ['mangrove_blue_carbon_restoration', 'saltmarsh_coastal_buffer', 'coastal_battery_shore_hub'],
      },
      {
        turn: 3,
        regionId: 'QLD',
        climateHazardPressure: 22,
        offshoreRenewableRelief: 6,
        soilCarbonLandRelief: 4.5,
        gridStressPoints: 15,
        industrialHeatRelief: 4.5,
        completedProjectTypes: [
          'mangrove_blue_carbon_restoration',
          'coastal_wetland_stewardship',
          'saltmarsh_coastal_buffer',
          'tidal_lagoon_shore_power',
          'nearshore_wave_array',
          'coastal_microgrid_transmission',
        ],
      },
    ],
    expect: { minBlueReliefOnLast: 3, minShoreReliefOnLast: 2, lastBlueBand: 'blue_carbon_active' },
  },
] as const;

export function runAgent13BlueShoreTurnScenario(
  scenario: Agent13BlueShoreTurnScenario,
): { passed: boolean; detail: string; lastBlueRelief: number; lastShoreRelief: number } {
  let blueMem: V1014BlueCarbonPersistedSlice | null = null;
  let shoreMem: V1014ShoreMarinePersistedSlice | null = null;
  let lastBlueRelief = 0;
  let lastShoreRelief = 0;
  let lastBand: V1014BlueCarbonCoastalBand = 'degraded';

  for (const step of scenario.steps) {
    const blue = computeRegionalBlueCarbonCoastalLedger({
      regionId: step.regionId,
      climateHazardPressure: step.climateHazardPressure,
      offshoreRenewableRelief: step.offshoreRenewableRelief,
      soilCarbonLandRelief: step.soilCarbonLandRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: blueMem,
    });
    blueMem = blue.next;
    lastBlueRelief = blue.ledger.blueCarbonCoastalRelief;
    lastBand = blue.ledger.band;

    const shore = advanceRegionalShoreMarineEnergy({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      blueCarbonBand: blue.ledger.band,
      industrialHeatRelief: step.industrialHeatRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: shoreMem,
    });
    shoreMem = shore.next;
    lastShoreRelief = shore.ledger.shoreMarineEnergyRelief;
  }

  if (scenario.expect.minBlueReliefOnLast != null && lastBlueRelief < scenario.expect.minBlueReliefOnLast) {
    return {
      passed: false,
      detail: `blue relief ${lastBlueRelief} < ${scenario.expect.minBlueReliefOnLast}`,
      lastBlueRelief,
      lastShoreRelief,
    };
  }
  if (scenario.expect.minShoreReliefOnLast != null && lastShoreRelief < scenario.expect.minShoreReliefOnLast) {
    return {
      passed: false,
      detail: `shore relief ${lastShoreRelief} < ${scenario.expect.minShoreReliefOnLast}`,
      lastBlueRelief,
      lastShoreRelief,
    };
  }
  if (scenario.expect.lastBlueBand != null) {
    const allowed: V1014BlueCarbonCoastalBand[] = [scenario.expect.lastBlueBand];
    if (scenario.expect.lastBlueBand === 'blue_carbon_active') allowed.push('coastal_sink_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastBlueRelief, lastShoreRelief };
    }
  }

  return { passed: true, detail: 'ok', lastBlueRelief, lastShoreRelief };
}

export function scoreAgent13BlueShoreGIAlignment(params: {
  actionText: string;
  blueBand?: string;
  shoreBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = ['blue carbon', 'mangrove', 'seagrass', 'coastal wetland', 'tidal lagoon', 'wave energy', 'shore power'].filter(
    k => text.includes(k),
  );
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.35, 0, 2);
  if (params.blueBand === 'coastal_sink_leader' || params.blueBand === 'blue_carbon_active') {
    delta += hits.some(h => h.includes('blue') || h.includes('mangrove') || h.includes('wetland')) ? 0.5 : 0.17;
  }
  if (params.shoreBand === 'tidal_wave_leader' || params.shoreBand === 'corridor_online') {
    delta += hits.some(h => h.includes('tidal') || h.includes('wave') || h.includes('shore')) ? 0.46 : 0.15;
  }
  if (params.shoreBand === 'shore_idle' && hits.some(h => h.includes('tidal'))) {
    delta -= 0.2;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Blue/shore GI: ${hits.slice(0, 2).join(', ')} aligns with coastal carbon stewardship and shore marine energy.`
        : null,
  };
}
