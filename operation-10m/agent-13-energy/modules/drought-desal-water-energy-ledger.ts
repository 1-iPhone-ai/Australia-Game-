/**
 * Agent 13 scale wave round 15 — drought-responsive desalination & renewable water-energy nexus.
 * Cross-turn persistence for solar/brackish desal build-out and irrigation–grid coupling relief.
 */

export type V1014DroughtDesalBand = 'supply_stressed' | 'pilot_desal' | 'drought_resilient' | 'water_security_leader';

export type V1014WaterEnergyNexusBand = 'disconnected' | 'pilot_coupling' | 'nexus_operational' | 'integrated_water_grid';

export interface V1014DroughtDesalInstrument {
  id: string;
  kind: 'solar_desal' | 'brackish_desal' | 'water_recycling_plant' | 'drought_reserve_storage';
  label: string;
  waterMwEq: number;
  droughtReliefFactor: number;
  nexusSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_DROUGHT_DESAL_CATALOG: readonly V1014DroughtDesalInstrument[] = [
  {
    id: 'desal_solar',
    kind: 'solar_desal',
    label: 'Solar-powered desalination train',
    waterMwEq: 40,
    droughtReliefFactor: 0.15,
    nexusSynergyFactor: 0.1,
    projectTypeHint: 'solar_powered_desalination',
  },
  {
    id: 'desal_brackish',
    kind: 'brackish_desal',
    label: 'Brackish groundwater desal hub',
    waterMwEq: 36,
    droughtReliefFactor: 0.14,
    nexusSynergyFactor: 0.09,
    projectTypeHint: 'brackish_groundwater_desal',
  },
  {
    id: 'desal_recycle',
    kind: 'water_recycling_plant',
    label: 'Advanced water recycling plant',
    waterMwEq: 44,
    droughtReliefFactor: 0.16,
    nexusSynergyFactor: 0.11,
    projectTypeHint: 'advanced_water_recycling',
  },
  {
    id: 'desal_reserve',
    kind: 'drought_reserve_storage',
    label: 'Drought reserve storage scheme',
    waterMwEq: 32,
    droughtReliefFactor: 0.13,
    nexusSynergyFactor: 0.12,
    projectTypeHint: 'drought_reserve_storage',
  },
] as const;

export interface V1014WaterEnergyNexusTemplate {
  id: string;
  kind: 'pumped_water_storage' | 'irrigation_electrification' | 'effluent_energy_recovery' | 'basin_pumping_orchestration';
  label: string;
  nexusMwEq: number;
  gridReliefFactor: number;
  desalSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_WATER_ENERGY_NEXUS_CATALOG: readonly V1014WaterEnergyNexusTemplate[] = [
  {
    id: 'nex_pumped',
    kind: 'pumped_water_storage',
    label: 'Pumped water storage coupling',
    nexusMwEq: 42,
    gridReliefFactor: 0.15,
    desalSynergyFactor: 0.1,
    projectTypeHint: 'pumped_water_storage_coupling',
  },
  {
    id: 'nex_irrig',
    kind: 'irrigation_electrification',
    label: 'Irrigation electrification orchestration',
    nexusMwEq: 38,
    gridReliefFactor: 0.13,
    desalSynergyFactor: 0.11,
    projectTypeHint: 'irrigation_electrification_hub',
  },
  {
    id: 'nex_effluent',
    kind: 'effluent_energy_recovery',
    label: 'Effluent energy recovery loop',
    nexusMwEq: 34,
    gridReliefFactor: 0.12,
    desalSynergyFactor: 0.09,
    projectTypeHint: 'effluent_energy_recovery',
  },
  {
    id: 'nex_basin',
    kind: 'basin_pumping_orchestration',
    label: 'Basin pumping demand orchestration',
    nexusMwEq: 46,
    gridReliefFactor: 0.16,
    desalSynergyFactor: 0.12,
    projectTypeHint: 'basin_pumping_orchestration',
  },
] as const;

export interface V1014RegionalDroughtDesalLedger {
  regionId: string;
  band: V1014DroughtDesalBand;
  waterSecurityIndex: number;
  reserveBalance: number;
  droughtDesalRelief: number;
  summary: string;
}

export interface V1014RegionalWaterEnergyNexusLedger {
  regionId: string;
  band: V1014WaterEnergyNexusBand;
  nexusIndex: number;
  waterEnergyNexusRelief: number;
  summary: string;
}

export interface V1014DroughtDesalPersistedSlice {
  reserveBalance: number;
  waterSecurityIndex: number;
}

export interface V1014WaterNexusPersistedSlice {
  nexusIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const DROUGHT_PRONE_REGIONS = new Set(['NSW', 'QLD', 'VIC', 'SA', 'WA', 'NT']);

export function computeRegionalDroughtDesalLedger(params: {
  regionId: string;
  waterStressPressure: number;
  renewableShareScore: number;
  districtHeatRelief: number;
  completedProjectTypes: string[];
  prev?: V1014DroughtDesalPersistedSlice | null;
}): { ledger: V1014RegionalDroughtDesalLedger; next: V1014DroughtDesalPersistedSlice } {
  let waterGain = 0;
  let droughtProxy = 0;
  let nexusSynergy = 0;
  for (const inst of V1014_DROUGHT_DESAL_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      waterGain += inst.waterMwEq;
      droughtProxy += inst.droughtReliefFactor;
      nexusSynergy += inst.nexusSynergyFactor;
    }
  }
  if (DROUGHT_PRONE_REGIONS.has(params.regionId)) droughtProxy += 0.05;
  else droughtProxy *= 0.68;
  if (params.waterStressPressure > 14) {
    waterGain += clamp((params.waterStressPressure - 14) * 0.45, 0, 14);
    droughtProxy += 0.05;
  }
  droughtProxy += clamp(params.renewableShareScore / 115, 0, 0.11);

  const prevIdx = params.prev?.waterSecurityIndex ?? 0;
  const prevRes = params.prev?.reserveBalance ?? 0;
  const reserveBalance = clamp(prevRes * 0.91 + waterGain * 0.1, 0, 212);
  const waterSecurityIndex = clamp(prevIdx * 0.88 + reserveBalance * 0.12 + droughtProxy * 84 + nexusSynergy * 23, 0, 149);

  let band: V1014DroughtDesalBand = 'supply_stressed';
  if (waterSecurityIndex >= 95 || waterGain >= 114) band = 'water_security_leader';
  else if (waterSecurityIndex >= 58 || waterGain >= 66) band = 'drought_resilient';
  else if (waterSecurityIndex >= 24 || waterGain >= 22) band = 'pilot_desal';

  let droughtDesalRelief = clamp(droughtProxy * 9.2 + waterGain * 0.05 + nexusSynergy * 5.4, 0, 12);
  if (params.districtHeatRelief > 3) droughtDesalRelief += clamp(params.districtHeatRelief * 0.07, 0, 1.3);
  if (band === 'supply_stressed') droughtDesalRelief *= 0.42;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      waterSecurityIndex: clamp(waterSecurityIndex, 0, 149),
      reserveBalance: clamp(reserveBalance, 0, 212),
      droughtDesalRelief: clamp(droughtDesalRelief, 0, 13),
      summary: `${params.regionId} drought desal ${band} · security idx ${waterSecurityIndex.toFixed(0)} · relief ${droughtDesalRelief.toFixed(1)}`,
    },
    next: { reserveBalance, waterSecurityIndex: clamp(waterSecurityIndex, 0, 149) },
  };
}

export function advanceRegionalWaterEnergyNexus(params: {
  regionId: string;
  gridStressPoints: number;
  desalBand: V1014DroughtDesalBand;
  agrivoltaicsLandRelief: number;
  completedProjectTypes: string[];
  prev?: V1014WaterNexusPersistedSlice | null;
}): { ledger: V1014RegionalWaterEnergyNexusLedger; next: V1014WaterNexusPersistedSlice } {
  let nexusGain = 0;
  let reliefProxy = 0;
  let desalSynergy = 0;
  for (const tpl of V1014_WATER_ENERGY_NEXUS_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      nexusGain += tpl.nexusMwEq;
      reliefProxy += tpl.gridReliefFactor;
      desalSynergy += tpl.desalSynergyFactor;
    }
  }
  if (params.desalBand === 'drought_resilient' || params.desalBand === 'water_security_leader') {
    nexusGain += 13;
    desalSynergy += 0.08;
  }
  if (params.agrivoltaicsLandRelief > 3) {
    nexusGain += params.agrivoltaicsLandRelief * 1.02;
    reliefProxy += clamp(params.agrivoltaicsLandRelief * 0.01, 0, 0.08);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.37, 0, 14);
  const prevIdx = params.prev?.nexusIndex ?? 0;
  const nexusIndex = clamp(
    prevIdx * 0.89 + nexusGain * 0.11 + reliefProxy * 35 - stressLoad * 0.06 + desalSynergy * 27,
    0,
    153,
  );

  let band: V1014WaterEnergyNexusBand = 'disconnected';
  if (nexusIndex >= 98 || nexusGain >= 118) band = 'integrated_water_grid';
  else if (nexusIndex >= 58 || nexusGain >= 68) band = 'nexus_operational';
  else if (nexusIndex >= 24 || nexusGain >= 22) band = 'pilot_coupling';

  const waterEnergyNexusRelief = clamp(nexusIndex / 24 + reliefProxy * 7 + desalSynergy * 8.4, 0, 11);
  if (band === 'disconnected') {
    return {
      ledger: {
        regionId: params.regionId,
        band,
        nexusIndex: clamp(nexusIndex, 0, 153),
        waterEnergyNexusRelief: clamp(waterEnergyNexusRelief * 0.36, 0, 3.5),
        summary: `${params.regionId} water-energy nexus disconnected · idx ${nexusIndex.toFixed(0)}`,
      },
      next: { nexusIndex: clamp(nexusIndex, 0, 153) },
    };
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      nexusIndex: clamp(nexusIndex, 0, 153),
      waterEnergyNexusRelief: clamp(waterEnergyNexusRelief, 0, 11),
      summary: `${params.regionId} water-energy ${band} · idx ${nexusIndex.toFixed(0)} · relief ${waterEnergyNexusRelief.toFixed(1)}`,
    },
    next: { nexusIndex: clamp(nexusIndex, 0, 153) },
  };
}

export const V1014_DESAL_NEXUS_SCENARIOS = [
  {
    id: 'sc_desal_sa',
    label: 'SA solar desal with pumped water storage',
    regionId: 'SA',
    waterStressPressure: 18,
    renewableShareScore: 52,
    districtHeatRelief: 4,
    gridStressPoints: 16,
    agrivoltaicsLandRelief: 4,
    completedProjectTypes: [
      'solar_powered_desalination',
      'drought_reserve_storage',
      'pumped_water_storage_coupling',
      'irrigation_electrification_hub',
    ],
    expectDesalBand: 'drought_resilient' as V1014DroughtDesalBand,
    expectMinDesalRelief: 3,
    expectNexusBand: 'nexus_operational' as V1014WaterEnergyNexusBand,
    expectMinNexusRelief: 2,
  },
  {
    id: 'sc_nexus_nsw',
    label: 'NSW recycling with basin pumping',
    regionId: 'NSW',
    waterStressPressure: 16,
    renewableShareScore: 44,
    districtHeatRelief: 3,
    gridStressPoints: 18,
    agrivoltaicsLandRelief: 3,
    desalBand: 'pilot_desal' as V1014DroughtDesalBand,
    completedProjectTypes: ['advanced_water_recycling', 'basin_pumping_orchestration', 'effluent_energy_recovery'],
    expectNexusBand: 'pilot_coupling' as V1014WaterEnergyNexusBand,
    expectMinNexusRelief: 2,
  },
] as const;

export function runAgent13DesalNexusScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_DROUGHT_DESAL_CATALOG.length >= 4);
  ok(V1014_WATER_ENERGY_NEXUS_CATALOG.length >= 4);

  const sc0 = V1014_DESAL_NEXUS_SCENARIOS[0];
  const desal = computeRegionalDroughtDesalLedger({
    regionId: sc0.regionId,
    waterStressPressure: sc0.waterStressPressure,
    renewableShareScore: sc0.renewableShareScore,
    districtHeatRelief: sc0.districtHeatRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    desal.ledger.band === sc0.expectDesalBand ||
      desal.ledger.band === 'water_security_leader' ||
      desal.ledger.droughtDesalRelief >= sc0.expectMinDesalRelief,
  );

  const nexus = advanceRegionalWaterEnergyNexus({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    desalBand: desal.ledger.band,
    agrivoltaicsLandRelief: sc0.agrivoltaicsLandRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    nexus.ledger.band === sc0.expectNexusBand ||
      nexus.ledger.band === 'integrated_water_grid' ||
      nexus.ledger.waterEnergyNexusRelief >= sc0.expectMinNexusRelief,
  );

  const sc1 = V1014_DESAL_NEXUS_SCENARIOS[1];
  const nexusN = advanceRegionalWaterEnergyNexus({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    desalBand: sc1.desalBand,
    agrivoltaicsLandRelief: sc1.agrivoltaicsLandRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(nexusN.ledger.waterEnergyNexusRelief >= sc1.expectMinNexusRelief || nexusN.ledger.band !== 'disconnected');

  const persistA = computeRegionalDroughtDesalLedger({
    regionId: 'QLD',
    waterStressPressure: 15,
    renewableShareScore: 48,
    districtHeatRelief: 3,
    completedProjectTypes: ['solar_powered_desalination'],
    prev: null,
  });
  const persistB = computeRegionalDroughtDesalLedger({
    regionId: 'QLD',
    waterStressPressure: 15,
    renewableShareScore: 48,
    districtHeatRelief: 3,
    completedProjectTypes: ['solar_powered_desalination'],
    prev: persistA.next,
  });
  ok(persistB.next.waterSecurityIndex >= persistA.next.waterSecurityIndex * 0.82);

  const turnSc = runAgent13DesalNexusTurnScenario(V1014_DESAL_NEXUS_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastDesalRelief >= 3);

  const gi = scoreAgent13DesalNexusGIAlignment({
    actionText: 'Solar desalination with pumped water storage and irrigation electrification',
    desalBand: 'drought_resilient',
    nexusBand: 'nexus_operational',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13DesalNexusTurnStep {
  turn: number;
  regionId: string;
  waterStressPressure: number;
  renewableShareScore: number;
  districtHeatRelief: number;
  gridStressPoints: number;
  agrivoltaicsLandRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13DesalNexusTurnScenario {
  id: string;
  label: string;
  steps: Agent13DesalNexusTurnStep[];
  expect: {
    minDesalReliefOnLast?: number;
    minNexusReliefOnLast?: number;
    lastDesalBand?: V1014DroughtDesalBand;
  };
}

export const V1014_DESAL_NEXUS_TURN_SCENARIOS: readonly Agent13DesalNexusTurnScenario[] = [
  {
    id: 'sc_desal_nexus_sa',
    label: 'SA drought desal with water-energy nexus across turns',
    steps: [
      {
        turn: 1,
        regionId: 'SA',
        waterStressPressure: 16,
        renewableShareScore: 46,
        districtHeatRelief: 3,
        gridStressPoints: 18,
        agrivoltaicsLandRelief: 3,
        completedProjectTypes: ['solar_powered_desalination', 'pumped_water_storage_coupling'],
      },
      {
        turn: 2,
        regionId: 'SA',
        waterStressPressure: 17,
        renewableShareScore: 50,
        districtHeatRelief: 3.5,
        gridStressPoints: 16,
        agrivoltaicsLandRelief: 3.5,
        completedProjectTypes: ['solar_powered_desalination', 'drought_reserve_storage', 'irrigation_electrification_hub'],
      },
      {
        turn: 3,
        regionId: 'SA',
        waterStressPressure: 19,
        renewableShareScore: 56,
        districtHeatRelief: 4.5,
        gridStressPoints: 14,
        agrivoltaicsLandRelief: 4.5,
        completedProjectTypes: [
          'solar_powered_desalination',
          'brackish_groundwater_desal',
          'advanced_water_recycling',
          'drought_reserve_storage',
          'pumped_water_storage_coupling',
          'basin_pumping_orchestration',
        ],
      },
    ],
    expect: { minDesalReliefOnLast: 3, minNexusReliefOnLast: 2, lastDesalBand: 'drought_resilient' },
  },
] as const;

export function runAgent13DesalNexusTurnScenario(
  scenario: Agent13DesalNexusTurnScenario,
): { passed: boolean; detail: string; lastDesalRelief: number; lastNexusRelief: number } {
  let desalMem: V1014DroughtDesalPersistedSlice | null = null;
  let nexusMem: V1014WaterNexusPersistedSlice | null = null;
  let lastDesalRelief = 0;
  let lastNexusRelief = 0;
  let lastBand: V1014DroughtDesalBand = 'supply_stressed';

  for (const step of scenario.steps) {
    const desal = computeRegionalDroughtDesalLedger({
      regionId: step.regionId,
      waterStressPressure: step.waterStressPressure,
      renewableShareScore: step.renewableShareScore,
      districtHeatRelief: step.districtHeatRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: desalMem,
    });
    desalMem = desal.next;
    lastDesalRelief = desal.ledger.droughtDesalRelief;
    lastBand = desal.ledger.band;

    const nexus = advanceRegionalWaterEnergyNexus({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      desalBand: desal.ledger.band,
      agrivoltaicsLandRelief: step.agrivoltaicsLandRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: nexusMem,
    });
    nexusMem = nexus.next;
    lastNexusRelief = nexus.ledger.waterEnergyNexusRelief;
  }

  if (scenario.expect.minDesalReliefOnLast != null && lastDesalRelief < scenario.expect.minDesalReliefOnLast) {
    return {
      passed: false,
      detail: `desal relief ${lastDesalRelief} < ${scenario.expect.minDesalReliefOnLast}`,
      lastDesalRelief,
      lastNexusRelief,
    };
  }
  if (scenario.expect.minNexusReliefOnLast != null && lastNexusRelief < scenario.expect.minNexusReliefOnLast) {
    return {
      passed: false,
      detail: `nexus relief ${lastNexusRelief} < ${scenario.expect.minNexusReliefOnLast}`,
      lastDesalRelief,
      lastNexusRelief,
    };
  }
  if (scenario.expect.lastDesalBand != null) {
    const allowed: V1014DroughtDesalBand[] = [scenario.expect.lastDesalBand];
    if (scenario.expect.lastDesalBand === 'drought_resilient') allowed.push('water_security_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastDesalRelief, lastNexusRelief };
    }
  }

  return { passed: true, detail: 'ok', lastDesalRelief, lastNexusRelief };
}

export function scoreAgent13DesalNexusGIAlignment(params: {
  actionText: string;
  desalBand?: string;
  nexusBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = ['desal', 'drought', 'water recycling', 'irrigation', 'pumped storage', 'water-energy', 'basin pumping'].filter(
    k => text.includes(k),
  );
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.35, 0, 2);
  if (params.desalBand === 'water_security_leader' || params.desalBand === 'drought_resilient') {
    delta += hits.some(h => h.includes('desal') || h.includes('drought') || h.includes('water')) ? 0.5 : 0.17;
  }
  if (params.nexusBand === 'integrated_water_grid' || params.nexusBand === 'nexus_operational') {
    delta += hits.some(h => h.includes('irrigation') || h.includes('pumped') || h.includes('nexus')) ? 0.46 : 0.15;
  }
  if (params.nexusBand === 'disconnected' && hits.some(h => h.includes('nexus'))) {
    delta -= 0.2;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Desal/nexus GI: ${hits.slice(0, 2).join(', ')} aligns with drought desal and water-energy coupling.`
        : null,
  };
}
