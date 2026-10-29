/**
 * Agent 13 scale wave round 14 — landfill waste-to-energy capture & district renewable heat networks.
 * Cross-turn persistence for methane capture momentum and low-carbon district thermal grid relief.
 */

export type V1014LandfillWasteEnergyBand = 'uncapped' | 'capture_pilot' | 'wte_operational' | 'methane_neutral_hub';

export type V1014DistrictRenewableHeatBand = 'gas_dependent' | 'hybrid_loop' | 'renewable_thermal' | 'net_zero_heat_grid';

export interface V1014LandfillWasteEnergyInstrument {
  id: string;
  kind: 'landfill_gas_capture' | 'waste_to_energy_plant' | 'organics_digestion' | 'methane_flare_elimination';
  label: string;
  mwEqPerTurn: number;
  methaneReliefFactor: number;
  heatSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_LANDFILL_WASTE_ENERGY_CATALOG: readonly V1014LandfillWasteEnergyInstrument[] = [
  {
    id: 'lf_gas',
    kind: 'landfill_gas_capture',
    label: 'Landfill gas capture & utilisation',
    mwEqPerTurn: 36,
    methaneReliefFactor: 0.16,
    heatSynergyFactor: 0.1,
    projectTypeHint: 'landfill_gas_capture',
  },
  {
    id: 'lf_wte',
    kind: 'waste_to_energy_plant',
    label: 'Waste-to-energy thermal plant',
    mwEqPerTurn: 48,
    methaneReliefFactor: 0.14,
    heatSynergyFactor: 0.12,
    projectTypeHint: 'waste_to_energy_plant',
  },
  {
    id: 'lf_digest',
    kind: 'organics_digestion',
    label: 'Organics anaerobic digestion hub',
    mwEqPerTurn: 32,
    methaneReliefFactor: 0.15,
    heatSynergyFactor: 0.09,
    projectTypeHint: 'organics_anaerobic_digestion',
  },
  {
    id: 'lf_flare',
    kind: 'methane_flare_elimination',
    label: 'Methane flare elimination program',
    mwEqPerTurn: 28,
    methaneReliefFactor: 0.18,
    heatSynergyFactor: 0.08,
    projectTypeHint: 'methane_flare_elimination',
  },
] as const;

export interface V1014DistrictRenewableHeatTemplate {
  id: string;
  kind: 'renewable_district_heat' | 'industrial_steam_loop' | 'biomass_thermal_hub' | 'heat_pump_district';
  label: string;
  thermalMwEq: number;
  gridReliefFactor: number;
  wasteSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_DISTRICT_RENEWABLE_HEAT_CATALOG: readonly V1014DistrictRenewableHeatTemplate[] = [
  {
    id: 'dh_renew',
    kind: 'renewable_district_heat',
    label: 'Renewable district heating loop',
    thermalMwEq: 42,
    gridReliefFactor: 0.15,
    wasteSynergyFactor: 0.1,
    projectTypeHint: 'renewable_district_heating',
  },
  {
    id: 'dh_steam',
    kind: 'industrial_steam_loop',
    label: 'Industrial steam recovery loop',
    thermalMwEq: 46,
    gridReliefFactor: 0.16,
    wasteSynergyFactor: 0.11,
    projectTypeHint: 'industrial_steam_recovery_loop',
  },
  {
    id: 'dh_biomass',
    kind: 'biomass_thermal_hub',
    label: 'Biomass thermal hub (residuals)',
    thermalMwEq: 38,
    gridReliefFactor: 0.14,
    wasteSynergyFactor: 0.12,
    projectTypeHint: 'biomass_thermal_residuals_hub',
  },
  {
    id: 'dh_hp_dist',
    kind: 'heat_pump_district',
    label: 'District heat pump cascade',
    thermalMwEq: 40,
    gridReliefFactor: 0.13,
    wasteSynergyFactor: 0.13,
    projectTypeHint: 'district_heat_pump_cascade',
  },
] as const;

export interface V1014RegionalLandfillWasteEnergyLedger {
  regionId: string;
  band: V1014LandfillWasteEnergyBand;
  methaneIndex: number;
  captureBalance: number;
  landfillMethaneRelief: number;
  summary: string;
}

export interface V1014RegionalDistrictRenewableHeatLedger {
  regionId: string;
  band: V1014DistrictRenewableHeatBand;
  thermalIndex: number;
  districtHeatRelief: number;
  summary: string;
}

export interface V1014LandfillWastePersistedSlice {
  captureBalance: number;
  methaneIndex: number;
}

export interface V1014DistrictHeatPersistedSlice {
  thermalIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

export function computeRegionalLandfillWasteEnergyLedger(params: {
  regionId: string;
  circularRecoveryRelief: number;
  ccsEmissionsRelief: number;
  netEmissionsIndex: number;
  completedProjectTypes: string[];
  prev?: V1014LandfillWastePersistedSlice | null;
}): { ledger: V1014RegionalLandfillWasteEnergyLedger; next: V1014LandfillWastePersistedSlice } {
  let mwGain = 0;
  let methaneProxy = 0;
  let heatSynergy = 0;
  for (const inst of V1014_LANDFILL_WASTE_ENERGY_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      mwGain += inst.mwEqPerTurn;
      methaneProxy += inst.methaneReliefFactor;
      heatSynergy += inst.heatSynergyFactor;
    }
  }
  if (params.netEmissionsIndex > 50) {
    mwGain += clamp((params.netEmissionsIndex - 50) * 0.3, 0, 12);
    methaneProxy += 0.04;
  }

  const prevIdx = params.prev?.methaneIndex ?? 0;
  const prevCap = params.prev?.captureBalance ?? 0;
  const captureBalance = clamp(prevCap * 0.9 + mwGain * 0.11, 0, 210);
  const methaneIndex = clamp(prevIdx * 0.88 + captureBalance * 0.12 + methaneProxy * 85 + heatSynergy * 22, 0, 148);

  let band: V1014LandfillWasteEnergyBand = 'uncapped';
  if (methaneIndex >= 94 || mwGain >= 112) band = 'methane_neutral_hub';
  else if (methaneIndex >= 58 || mwGain >= 66) band = 'wte_operational';
  else if (methaneIndex >= 24 || mwGain >= 22) band = 'capture_pilot';

  let landfillMethaneRelief = clamp(methaneProxy * 9.3 + mwGain * 0.052 + heatSynergy * 5.5, 0, 12);
  if (params.circularRecoveryRelief > 3) landfillMethaneRelief += clamp(params.circularRecoveryRelief * 0.09, 0, 1.6);
  if (params.ccsEmissionsRelief > 4) landfillMethaneRelief += clamp(params.ccsEmissionsRelief * 0.07, 0, 1.4);
  if (band === 'uncapped') landfillMethaneRelief *= 0.4;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      methaneIndex: clamp(methaneIndex, 0, 148),
      captureBalance: clamp(captureBalance, 0, 210),
      landfillMethaneRelief: clamp(landfillMethaneRelief, 0, 13),
      summary: `${params.regionId} landfill/WtE ${band} · methane idx ${methaneIndex.toFixed(0)} · relief ${landfillMethaneRelief.toFixed(1)}`,
    },
    next: { captureBalance, methaneIndex: clamp(methaneIndex, 0, 148) },
  };
}

export function advanceRegionalDistrictRenewableHeat(params: {
  regionId: string;
  gridStressPoints: number;
  landfillBand: V1014LandfillWasteEnergyBand;
  geothermalHeatRelief: number;
  completedProjectTypes: string[];
  prev?: V1014DistrictHeatPersistedSlice | null;
}): { ledger: V1014RegionalDistrictRenewableHeatLedger; next: V1014DistrictHeatPersistedSlice } {
  let thermalGain = 0;
  let reliefProxy = 0;
  let wasteSynergy = 0;
  for (const tpl of V1014_DISTRICT_RENEWABLE_HEAT_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      thermalGain += tpl.thermalMwEq;
      reliefProxy += tpl.gridReliefFactor;
      wasteSynergy += tpl.wasteSynergyFactor;
    }
  }
  if (params.landfillBand === 'wte_operational' || params.landfillBand === 'methane_neutral_hub') {
    thermalGain += 14;
    wasteSynergy += 0.08;
  }
  if (params.geothermalHeatRelief > 4) {
    thermalGain += params.geothermalHeatRelief * 1.08;
    reliefProxy += clamp(params.geothermalHeatRelief * 0.012, 0, 0.09);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.36, 0, 13);
  const prevIdx = params.prev?.thermalIndex ?? 0;
  const thermalIndex = clamp(
    prevIdx * 0.89 + thermalGain * 0.11 + reliefProxy * 36 - stressLoad * 0.05 + wasteSynergy * 27,
    0,
    152,
  );

  let band: V1014DistrictRenewableHeatBand = 'gas_dependent';
  if (thermalIndex >= 97 || thermalGain >= 118) band = 'net_zero_heat_grid';
  else if (thermalIndex >= 58 || thermalGain >= 68) band = 'renewable_thermal';
  else if (thermalIndex >= 24 || thermalGain >= 22) band = 'hybrid_loop';

  const districtHeatRelief = clamp(thermalIndex / 23 + reliefProxy * 7.1 + wasteSynergy * 8.6, 0, 11);
  if (band === 'gas_dependent') {
    return {
      ledger: {
        regionId: params.regionId,
        band,
        thermalIndex: clamp(thermalIndex, 0, 152),
        districtHeatRelief: clamp(districtHeatRelief * 0.36, 0, 3.5),
        summary: `${params.regionId} district heat gas-dependent · idx ${thermalIndex.toFixed(0)}`,
      },
      next: { thermalIndex: clamp(thermalIndex, 0, 152) },
    };
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      thermalIndex: clamp(thermalIndex, 0, 152),
      districtHeatRelief: clamp(districtHeatRelief, 0, 11),
      summary: `${params.regionId} district heat ${band} · thermal idx ${thermalIndex.toFixed(0)} · relief ${districtHeatRelief.toFixed(1)}`,
    },
    next: { thermalIndex: clamp(thermalIndex, 0, 152) },
  };
}

export const V1014_LANDFILL_DISTRICT_SCENARIOS = [
  {
    id: 'sc_lf_vic',
    label: 'VIC landfill gas with district heat pump cascade',
    regionId: 'VIC',
    circularRecoveryRelief: 4,
    ccsEmissionsRelief: 3,
    netEmissionsIndex: 58,
    gridStressPoints: 17,
    geothermalHeatRelief: 4,
    completedProjectTypes: [
      'landfill_gas_capture',
      'waste_to_energy_plant',
      'district_heat_pump_cascade',
      'renewable_district_heating',
    ],
    expectLfBand: 'wte_operational' as V1014LandfillWasteEnergyBand,
    expectMinLfRelief: 3,
    expectDhBand: 'renewable_thermal' as V1014DistrictRenewableHeatBand,
    expectMinDhRelief: 2,
  },
  {
    id: 'sc_dh_nsw',
    label: 'NSW organics digestion with steam loop',
    regionId: 'NSW',
    circularRecoveryRelief: 3,
    ccsEmissionsRelief: 2,
    netEmissionsIndex: 64,
    gridStressPoints: 19,
    geothermalHeatRelief: 3,
    landfillBand: 'capture_pilot' as V1014LandfillWasteEnergyBand,
    completedProjectTypes: ['organics_anaerobic_digestion', 'industrial_steam_recovery_loop', 'biomass_thermal_residuals_hub'],
    expectDhBand: 'hybrid_loop' as V1014DistrictRenewableHeatBand,
    expectMinDhRelief: 2,
  },
] as const;

export function runAgent13LandfillDistrictScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_LANDFILL_WASTE_ENERGY_CATALOG.length >= 4);
  ok(V1014_DISTRICT_RENEWABLE_HEAT_CATALOG.length >= 4);

  const sc0 = V1014_LANDFILL_DISTRICT_SCENARIOS[0];
  const lf = computeRegionalLandfillWasteEnergyLedger({
    regionId: sc0.regionId,
    circularRecoveryRelief: sc0.circularRecoveryRelief,
    ccsEmissionsRelief: sc0.ccsEmissionsRelief,
    netEmissionsIndex: sc0.netEmissionsIndex,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    lf.ledger.band === sc0.expectLfBand ||
      lf.ledger.band === 'methane_neutral_hub' ||
      lf.ledger.landfillMethaneRelief >= sc0.expectMinLfRelief,
  );

  const dh = advanceRegionalDistrictRenewableHeat({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    landfillBand: lf.ledger.band,
    geothermalHeatRelief: sc0.geothermalHeatRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    dh.ledger.band === sc0.expectDhBand ||
      dh.ledger.band === 'net_zero_heat_grid' ||
      dh.ledger.districtHeatRelief >= sc0.expectMinDhRelief,
  );

  const sc1 = V1014_LANDFILL_DISTRICT_SCENARIOS[1];
  const dhN = advanceRegionalDistrictRenewableHeat({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    landfillBand: sc1.landfillBand,
    geothermalHeatRelief: sc1.geothermalHeatRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(dhN.ledger.districtHeatRelief >= sc1.expectMinDhRelief || dhN.ledger.band !== 'gas_dependent');

  const persistA = computeRegionalLandfillWasteEnergyLedger({
    regionId: 'QLD',
    circularRecoveryRelief: 3,
    ccsEmissionsRelief: 2,
    netEmissionsIndex: 55,
    completedProjectTypes: ['landfill_gas_capture'],
    prev: null,
  });
  const persistB = computeRegionalLandfillWasteEnergyLedger({
    regionId: 'QLD',
    circularRecoveryRelief: 3,
    ccsEmissionsRelief: 2,
    netEmissionsIndex: 55,
    completedProjectTypes: ['landfill_gas_capture'],
    prev: persistA.next,
  });
  ok(persistB.next.methaneIndex >= persistA.next.methaneIndex * 0.82);

  const turnSc = runAgent13LandfillDistrictTurnScenario(V1014_LANDFILL_DISTRICT_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastLfRelief >= 3);

  const gi = scoreAgent13LandfillDistrictGIAlignment({
    actionText: 'Landfill gas capture with renewable district heating and waste-to-energy',
    landfillBand: 'wte_operational',
    districtBand: 'renewable_thermal',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13LandfillDistrictTurnStep {
  turn: number;
  regionId: string;
  circularRecoveryRelief: number;
  ccsEmissionsRelief: number;
  netEmissionsIndex: number;
  gridStressPoints: number;
  geothermalHeatRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13LandfillDistrictTurnScenario {
  id: string;
  label: string;
  steps: Agent13LandfillDistrictTurnStep[];
  expect: {
    minLfReliefOnLast?: number;
    minDhReliefOnLast?: number;
    lastLfBand?: V1014LandfillWasteEnergyBand;
  };
}

export const V1014_LANDFILL_DISTRICT_TURN_SCENARIOS: readonly Agent13LandfillDistrictTurnScenario[] = [
  {
    id: 'sc_lf_dh_vic',
    label: 'VIC landfill capture with district heat escalation',
    steps: [
      {
        turn: 1,
        regionId: 'VIC',
        circularRecoveryRelief: 3,
        ccsEmissionsRelief: 2.5,
        netEmissionsIndex: 66,
        gridStressPoints: 19,
        geothermalHeatRelief: 3,
        completedProjectTypes: ['landfill_gas_capture', 'renewable_district_heating'],
      },
      {
        turn: 2,
        regionId: 'VIC',
        circularRecoveryRelief: 3.5,
        ccsEmissionsRelief: 3,
        netEmissionsIndex: 58,
        gridStressPoints: 17,
        geothermalHeatRelief: 3.5,
        completedProjectTypes: ['landfill_gas_capture', 'waste_to_energy_plant', 'district_heat_pump_cascade'],
      },
      {
        turn: 3,
        regionId: 'VIC',
        circularRecoveryRelief: 4.5,
        ccsEmissionsRelief: 3.5,
        netEmissionsIndex: 50,
        gridStressPoints: 15,
        geothermalHeatRelief: 4.5,
        completedProjectTypes: [
          'landfill_gas_capture',
          'waste_to_energy_plant',
          'methane_flare_elimination',
          'renewable_district_heating',
          'industrial_steam_recovery_loop',
          'district_heat_pump_cascade',
        ],
      },
    ],
    expect: { minLfReliefOnLast: 3, minDhReliefOnLast: 2, lastLfBand: 'wte_operational' },
  },
] as const;

export function runAgent13LandfillDistrictTurnScenario(
  scenario: Agent13LandfillDistrictTurnScenario,
): { passed: boolean; detail: string; lastLfRelief: number; lastDhRelief: number } {
  let lfMem: V1014LandfillWastePersistedSlice | null = null;
  let dhMem: V1014DistrictHeatPersistedSlice | null = null;
  let lastLfRelief = 0;
  let lastDhRelief = 0;
  let lastBand: V1014LandfillWasteEnergyBand = 'uncapped';

  for (const step of scenario.steps) {
    const lf = computeRegionalLandfillWasteEnergyLedger({
      regionId: step.regionId,
      circularRecoveryRelief: step.circularRecoveryRelief,
      ccsEmissionsRelief: step.ccsEmissionsRelief,
      netEmissionsIndex: step.netEmissionsIndex,
      completedProjectTypes: step.completedProjectTypes,
      prev: lfMem,
    });
    lfMem = lf.next;
    lastLfRelief = lf.ledger.landfillMethaneRelief;
    lastBand = lf.ledger.band;

    const dh = advanceRegionalDistrictRenewableHeat({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      landfillBand: lf.ledger.band,
      geothermalHeatRelief: step.geothermalHeatRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: dhMem,
    });
    dhMem = dh.next;
    lastDhRelief = dh.ledger.districtHeatRelief;
  }

  if (scenario.expect.minLfReliefOnLast != null && lastLfRelief < scenario.expect.minLfReliefOnLast) {
    return {
      passed: false,
      detail: `lf relief ${lastLfRelief} < ${scenario.expect.minLfReliefOnLast}`,
      lastLfRelief,
      lastDhRelief,
    };
  }
  if (scenario.expect.minDhReliefOnLast != null && lastDhRelief < scenario.expect.minDhReliefOnLast) {
    return {
      passed: false,
      detail: `dh relief ${lastDhRelief} < ${scenario.expect.minDhReliefOnLast}`,
      lastLfRelief,
      lastDhRelief,
    };
  }
  if (scenario.expect.lastLfBand != null) {
    const allowed: V1014LandfillWasteEnergyBand[] = [scenario.expect.lastLfBand];
    if (scenario.expect.lastLfBand === 'wte_operational') allowed.push('methane_neutral_hub');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastLfRelief, lastDhRelief };
    }
  }

  return { passed: true, detail: 'ok', lastLfRelief, lastDhRelief };
}

export function scoreAgent13LandfillDistrictGIAlignment(params: {
  actionText: string;
  landfillBand?: string;
  districtBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = ['landfill', 'waste-to-energy', 'methane', 'district heat', 'digestion', 'thermal loop', 'heat pump'].filter(
    k => text.includes(k),
  );
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.35, 0, 2);
  if (params.landfillBand === 'methane_neutral_hub' || params.landfillBand === 'wte_operational') {
    delta += hits.some(h => h.includes('landfill') || h.includes('methane') || h.includes('waste')) ? 0.5 : 0.17;
  }
  if (params.districtBand === 'net_zero_heat_grid' || params.districtBand === 'renewable_thermal') {
    delta += hits.some(h => h.includes('district') || h.includes('heat') || h.includes('thermal')) ? 0.46 : 0.15;
  }
  if (params.districtBand === 'gas_dependent' && hits.some(h => h.includes('district'))) {
    delta -= 0.2;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Landfill/district GI: ${hits.slice(0, 2).join(', ')} aligns with methane capture and renewable thermal grids.`
        : null,
  };
}
