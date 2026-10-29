/**
 * Agent 13 scale wave round 30 (O10-191) — offshore-to-shore industrial electrification & port green corridor orchestration depth.
 * Wave-30 federation capstone: cross-turn persistence for offshore-shore power corridors and port green electrification relief,
 * coupled to offshore renewables, shore marine energy, green hydrogen export, and battery supply chain maturity.
 */

export type V1014OffshoreShoreElectrificationBand =
  | 'shore_legacy_feed'
  | 'pilot_shore_link'
  | 'offshore_shore_corridor'
  | 'industrial_shore_leader';

export type V1014PortGreenCorridorBand =
  | 'port_diesel_dependent'
  | 'pilot_green_port'
  | 'green_corridor_hub'
  | 'zero_emission_port_mesh';

export interface V1014OffshoreShoreElectrificationInstrument {
  id: string;
  kind: 'offshore_export_cable' | 'shore_substation_mesh' | 'industrial_pier_electrification' | 'marine_renewable_shore_tie';
  label: string;
  shoreMwEq: number;
  offshoreReliefFactor: number;
  portSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_OFFSHORE_SHORE_ELECTRIFICATION_CATALOG: readonly V1014OffshoreShoreElectrificationInstrument[] = [
  {
    id: 'os_cable',
    kind: 'offshore_export_cable',
    label: 'Offshore export cable corridor',
    shoreMwEq: 46,
    offshoreReliefFactor: 0.17,
    portSynergyFactor: 0.11,
    projectTypeHint: 'offshore_export_cable_corridor',
  },
  {
    id: 'os_sub',
    kind: 'shore_substation_mesh',
    label: 'Shore substation electrification mesh',
    shoreMwEq: 44,
    offshoreReliefFactor: 0.16,
    portSynergyFactor: 0.12,
    projectTypeHint: 'shore_substation_electrification_mesh',
  },
  {
    id: 'os_pier',
    kind: 'industrial_pier_electrification',
    label: 'Industrial pier electrification loop',
    shoreMwEq: 42,
    offshoreReliefFactor: 0.15,
    portSynergyFactor: 0.13,
    projectTypeHint: 'industrial_pier_electrification_loop',
  },
  {
    id: 'os_marine',
    kind: 'marine_renewable_shore_tie',
    label: 'Marine renewable shore tie hub',
    shoreMwEq: 48,
    offshoreReliefFactor: 0.18,
    portSynergyFactor: 0.1,
    projectTypeHint: 'marine_renewable_shore_tie_hub',
  },
] as const;

export interface V1014PortGreenCorridorTemplate {
  id: string;
  kind: 'shore_power_cold_ironing' | 'hydrogen_bunkering_corridor' | 'battery_swapping_port_hub' | 'export_cargo_electrification';
  label: string;
  corridorScoreEq: number;
  gridReliefFactor: number;
  shoreSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_PORT_GREEN_CORRIDOR_CATALOG: readonly V1014PortGreenCorridorTemplate[] = [
  {
    id: 'pg_cold',
    kind: 'shore_power_cold_ironing',
    label: 'Shore power cold ironing corridor',
    corridorScoreEq: 45,
    gridReliefFactor: 0.15,
    shoreSynergyFactor: 0.1,
    projectTypeHint: 'shore_power_cold_ironing_corridor',
  },
  {
    id: 'pg_h2',
    kind: 'hydrogen_bunkering_corridor',
    label: 'Hydrogen bunkering green corridor',
    corridorScoreEq: 47,
    gridReliefFactor: 0.16,
    shoreSynergyFactor: 0.11,
    projectTypeHint: 'hydrogen_bunkering_green_corridor',
  },
  {
    id: 'pg_battery',
    kind: 'battery_swapping_port_hub',
    label: 'Battery swapping port hub',
    corridorScoreEq: 43,
    gridReliefFactor: 0.14,
    shoreSynergyFactor: 0.12,
    projectTypeHint: 'battery_swapping_port_hub',
  },
  {
    id: 'pg_cargo',
    kind: 'export_cargo_electrification',
    label: 'Export cargo electrification mesh',
    corridorScoreEq: 49,
    gridReliefFactor: 0.17,
    shoreSynergyFactor: 0.13,
    projectTypeHint: 'export_cargo_electrification_mesh',
  },
] as const;

export interface V1014RegionalOffshoreShoreElectrificationLedger {
  regionId: string;
  band: V1014OffshoreShoreElectrificationBand;
  shoreIndex: number;
  shoreTieBalance: number;
  offshoreShoreElectrificationRelief: number;
  summary: string;
}

export interface V1014RegionalPortGreenCorridorLedger {
  regionId: string;
  band: V1014PortGreenCorridorBand;
  corridorIndex: number;
  portGreenCorridorRelief: number;
  summary: string;
}

export interface V1014OffshoreShoreElectrificationPersistedSlice {
  shoreTieBalance: number;
  shoreIndex: number;
}

export interface V1014PortGreenCorridorPersistedSlice {
  corridorIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const SHORE_REGIONS = new Set(['WA', 'QLD', 'NT', 'TAS', 'NSW']);

export function computeRegionalOffshoreShoreElectrificationLedger(params: {
  regionId: string;
  offshoreRenewableRelief: number;
  shoreMarineEnergyRelief: number;
  greenHydrogenExportRelief: number;
  batterySupplyChainRelief: number;
  blueCarbonCoastalRelief: number;
  completedProjectTypes: string[];
  prev?: V1014OffshoreShoreElectrificationPersistedSlice | null;
}): { ledger: V1014RegionalOffshoreShoreElectrificationLedger; next: V1014OffshoreShoreElectrificationPersistedSlice } {
  let shoreGain = 0;
  let offshoreProxy = 0;
  let portSynergy = 0;
  for (const inst of V1014_OFFSHORE_SHORE_ELECTRIFICATION_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      shoreGain += inst.shoreMwEq;
      offshoreProxy += inst.offshoreReliefFactor;
      portSynergy += inst.portSynergyFactor;
    }
  }
  if (SHORE_REGIONS.has(params.regionId)) offshoreProxy += 0.06;
  else offshoreProxy *= 0.71;
  if (params.offshoreRenewableRelief > 2.8) {
    shoreGain += clamp(params.offshoreRenewableRelief * 0.9, 0, 11);
    offshoreProxy += 0.07;
  }
  if (params.shoreMarineEnergyRelief > 2.5) portSynergy += clamp(params.shoreMarineEnergyRelief * 0.013, 0, 0.08);
  if (params.greenHydrogenExportRelief > 2.7) offshoreProxy += clamp(params.greenHydrogenExportRelief * 0.01, 0, 0.05);
  if (params.batterySupplyChainRelief > 2.4) shoreGain += clamp(params.batterySupplyChainRelief * 0.65, 0, 8);
  if (params.blueCarbonCoastalRelief > 2.2) portSynergy += clamp(params.blueCarbonCoastalRelief * 0.011, 0, 0.05);

  const prevIdx = params.prev?.shoreIndex ?? 0;
  const prevBal = params.prev?.shoreTieBalance ?? 0;
  const shoreTieBalance = clamp(prevBal * 0.84 + shoreGain * 0.1, 0, 228);
  const shoreIndex = clamp(prevIdx * 0.81 + shoreTieBalance * 0.09 + offshoreProxy * 80 + portSynergy * 26, 0, 172);

  let band: V1014OffshoreShoreElectrificationBand = 'shore_legacy_feed';
  if (shoreIndex >= 110 || shoreGain >= 126) band = 'industrial_shore_leader';
  else if (shoreIndex >= 70 || shoreGain >= 74) band = 'offshore_shore_corridor';
  else if (shoreIndex >= 29 || shoreGain >= 27) band = 'pilot_shore_link';

  let offshoreShoreElectrificationRelief = clamp(offshoreProxy * 8.2 + shoreGain * 0.034 + portSynergy * 5, 0, 10.4);
  if (band === 'shore_legacy_feed') offshoreShoreElectrificationRelief *= 0.27;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      shoreIndex: clamp(shoreIndex, 0, 172),
      shoreTieBalance: clamp(shoreTieBalance, 0, 228),
      offshoreShoreElectrificationRelief: clamp(offshoreShoreElectrificationRelief, 0, 10.4),
      summary: `${params.regionId} offshore-shore ${band} · idx ${shoreIndex.toFixed(0)} · relief ${offshoreShoreElectrificationRelief.toFixed(1)}`,
    },
    next: {
      shoreTieBalance: clamp(shoreTieBalance, 0, 228),
      shoreIndex: clamp(shoreIndex, 0, 172),
    },
  };
}

export function advanceRegionalPortGreenCorridorOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  shoreBand: V1014OffshoreShoreElectrificationBand;
  climateAdaptationRelief: number;
  completedProjectTypes: string[];
  prev?: V1014PortGreenCorridorPersistedSlice | null;
}): { ledger: V1014RegionalPortGreenCorridorLedger; next: V1014PortGreenCorridorPersistedSlice } {
  let corridorGain = 0;
  let gridReliefProxy = 0;
  let shoreSynergy = 0;
  for (const tpl of V1014_PORT_GREEN_CORRIDOR_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      corridorGain += tpl.corridorScoreEq;
      gridReliefProxy += tpl.gridReliefFactor;
      shoreSynergy += tpl.shoreSynergyFactor;
    }
  }
  if (params.shoreBand === 'offshore_shore_corridor' || params.shoreBand === 'industrial_shore_leader') {
    corridorGain += 16;
    shoreSynergy += 0.1;
  }
  if (params.climateAdaptationRelief > 2.6) {
    corridorGain += params.climateAdaptationRelief * 0.7;
    gridReliefProxy += clamp(params.climateAdaptationRelief * 0.007, 0, 0.04);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.25, 0, 10);
  const prevIdx = params.prev?.corridorIndex ?? 0;
  const corridorIndex = clamp(
    prevIdx * 0.82 + corridorGain * 0.1 + gridReliefProxy * 29 - stressLoad * 0.028 + shoreSynergy * 26,
    0,
    174,
  );

  let band: V1014PortGreenCorridorBand = 'port_diesel_dependent';
  if (corridorIndex >= 112 || corridorGain >= 128) band = 'zero_emission_port_mesh';
  else if (corridorIndex >= 72 || corridorGain >= 82) band = 'green_corridor_hub';
  else if (corridorIndex >= 30 || corridorGain >= 28) band = 'pilot_green_port';

  let portGreenCorridorRelief = clamp(corridorIndex / 17.2 + gridReliefProxy * 6.5 + shoreSynergy * 6.8, 0, 10);
  if (band === 'port_diesel_dependent') portGreenCorridorRelief = clamp(portGreenCorridorRelief * 0.25, 0, 2.6);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      corridorIndex: clamp(corridorIndex, 0, 174),
      portGreenCorridorRelief: clamp(portGreenCorridorRelief, 0, 10),
      summary: `${params.regionId} green port ${band} · idx ${corridorIndex.toFixed(0)} · relief ${portGreenCorridorRelief.toFixed(1)}`,
    },
    next: { corridorIndex: clamp(corridorIndex, 0, 174) },
  };
}

export const V1014_OFFSHORE_PORT_SCENARIOS = [
  {
    id: 'sc_op_wa',
    label: 'WA offshore cable with export cargo electrification',
    regionId: 'WA',
    offshoreRenewableRelief: 3.2,
    shoreMarineEnergyRelief: 2.9,
    greenHydrogenExportRelief: 3,
    batterySupplyChainRelief: 2.8,
    blueCarbonCoastalRelief: 2.6,
    gridStressPoints: 16,
    climateAdaptationRelief: 2.8,
    completedProjectTypes: [
      'offshore_export_cable_corridor',
      'marine_renewable_shore_tie_hub',
      'export_cargo_electrification_mesh',
      'hydrogen_bunkering_green_corridor',
    ],
    expectShoreBand: 'offshore_shore_corridor' as V1014OffshoreShoreElectrificationBand,
    expectMinShoreRelief: 2,
    expectPortBand: 'green_corridor_hub' as V1014PortGreenCorridorBand,
    expectMinPortRelief: 1.8,
  },
  {
    id: 'sc_op_tas',
    label: 'TAS pier electrification with shore power',
    regionId: 'TAS',
    offshoreRenewableRelief: 2.6,
    shoreMarineEnergyRelief: 2.5,
    greenHydrogenExportRelief: 2.3,
    batterySupplyChainRelief: 2.4,
    blueCarbonCoastalRelief: 2.5,
    gridStressPoints: 14,
    climateAdaptationRelief: 2.4,
    shoreBand: 'pilot_shore_link' as V1014OffshoreShoreElectrificationBand,
    completedProjectTypes: ['industrial_pier_electrification_loop', 'shore_power_cold_ironing_corridor'],
    expectPortBand: 'pilot_green_port' as V1014PortGreenCorridorBand,
    expectMinPortRelief: 1.4,
  },
] as const;

export function runAgent13OffshorePortScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_OFFSHORE_SHORE_ELECTRIFICATION_CATALOG.length >= 4);
  ok(V1014_PORT_GREEN_CORRIDOR_CATALOG.length >= 4);

  const sc0 = V1014_OFFSHORE_PORT_SCENARIOS[0];
  const shore = computeRegionalOffshoreShoreElectrificationLedger({
    regionId: sc0.regionId,
    offshoreRenewableRelief: sc0.offshoreRenewableRelief,
    shoreMarineEnergyRelief: sc0.shoreMarineEnergyRelief,
    greenHydrogenExportRelief: sc0.greenHydrogenExportRelief,
    batterySupplyChainRelief: sc0.batterySupplyChainRelief,
    blueCarbonCoastalRelief: sc0.blueCarbonCoastalRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    shore.ledger.band === sc0.expectShoreBand ||
      shore.ledger.band === 'industrial_shore_leader' ||
      shore.ledger.offshoreShoreElectrificationRelief >= sc0.expectMinShoreRelief,
  );

  const port = advanceRegionalPortGreenCorridorOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    shoreBand: shore.ledger.band,
    climateAdaptationRelief: sc0.climateAdaptationRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    port.ledger.band === sc0.expectPortBand ||
      port.ledger.band === 'zero_emission_port_mesh' ||
      port.ledger.portGreenCorridorRelief >= sc0.expectMinPortRelief,
  );

  const sc1 = V1014_OFFSHORE_PORT_SCENARIOS[1];
  const portT = advanceRegionalPortGreenCorridorOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    shoreBand: sc1.shoreBand,
    climateAdaptationRelief: sc1.climateAdaptationRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(portT.ledger.portGreenCorridorRelief >= sc1.expectMinPortRelief || portT.ledger.band !== 'port_diesel_dependent');

  const persistA = computeRegionalOffshoreShoreElectrificationLedger({
    regionId: 'QLD',
    offshoreRenewableRelief: 2.5,
    shoreMarineEnergyRelief: 2.3,
    greenHydrogenExportRelief: 2.4,
    batterySupplyChainRelief: 2.2,
    blueCarbonCoastalRelief: 2.2,
    completedProjectTypes: ['shore_substation_electrification_mesh'],
    prev: null,
  });
  const persistB = computeRegionalOffshoreShoreElectrificationLedger({
    regionId: 'QLD',
    offshoreRenewableRelief: 2.5,
    shoreMarineEnergyRelief: 2.3,
    greenHydrogenExportRelief: 2.4,
    batterySupplyChainRelief: 2.2,
    blueCarbonCoastalRelief: 2.2,
    completedProjectTypes: ['shore_substation_electrification_mesh'],
    prev: persistA.next,
  });
  ok(persistB.next.shoreIndex >= persistA.next.shoreIndex * 0.7);

  const turnSc = runAgent13OffshorePortTurnScenario(V1014_OFFSHORE_PORT_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastShoreRelief >= 2);

  const gi = scoreAgent13OffshorePortGIAlignment({
    actionText: 'Offshore export cable with hydrogen bunkering green corridor and export cargo electrification',
    shoreBand: 'offshore_shore_corridor',
    portBand: 'green_corridor_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13OffshorePortTurnStep {
  turn: number;
  regionId: string;
  offshoreRenewableRelief: number;
  shoreMarineEnergyRelief: number;
  greenHydrogenExportRelief: number;
  batterySupplyChainRelief: number;
  blueCarbonCoastalRelief: number;
  gridStressPoints: number;
  climateAdaptationRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13OffshorePortTurnScenario {
  id: string;
  label: string;
  steps: Agent13OffshorePortTurnStep[];
  expect: {
    minShoreReliefOnLast?: number;
    minPortReliefOnLast?: number;
    lastShoreBand?: V1014OffshoreShoreElectrificationBand;
  };
}

export const V1014_OFFSHORE_PORT_TURN_SCENARIOS: readonly Agent13OffshorePortTurnScenario[] = [
  {
    id: 'sc_op_wa_escalation',
    label: 'WA industrial shore leader with zero emission port mesh',
    steps: [
      {
        turn: 1,
        regionId: 'WA',
        offshoreRenewableRelief: 2.4,
        shoreMarineEnergyRelief: 2.2,
        greenHydrogenExportRelief: 2.3,
        batterySupplyChainRelief: 2.2,
        blueCarbonCoastalRelief: 2.1,
        gridStressPoints: 17,
        climateAdaptationRelief: 2.3,
        completedProjectTypes: ['offshore_export_cable_corridor', 'shore_power_cold_ironing_corridor'],
      },
      {
        turn: 2,
        regionId: 'WA',
        offshoreRenewableRelief: 2.8,
        shoreMarineEnergyRelief: 2.5,
        greenHydrogenExportRelief: 2.7,
        batterySupplyChainRelief: 2.5,
        blueCarbonCoastalRelief: 2.4,
        gridStressPoints: 15,
        climateAdaptationRelief: 2.6,
        completedProjectTypes: ['shore_substation_electrification_mesh', 'battery_swapping_port_hub'],
      },
      {
        turn: 3,
        regionId: 'WA',
        offshoreRenewableRelief: 3.2,
        shoreMarineEnergyRelief: 2.9,
        greenHydrogenExportRelief: 3.1,
        batterySupplyChainRelief: 2.9,
        blueCarbonCoastalRelief: 2.7,
        gridStressPoints: 13,
        climateAdaptationRelief: 2.9,
        completedProjectTypes: [
          'offshore_export_cable_corridor',
          'shore_substation_electrification_mesh',
          'industrial_pier_electrification_loop',
          'marine_renewable_shore_tie_hub',
          'shore_power_cold_ironing_corridor',
          'hydrogen_bunkering_green_corridor',
          'battery_swapping_port_hub',
          'export_cargo_electrification_mesh',
        ],
      },
    ],
    expect: { minShoreReliefOnLast: 2, minPortReliefOnLast: 1.8, lastShoreBand: 'offshore_shore_corridor' },
  },
] as const;

export function runAgent13OffshorePortTurnScenario(
  scenario: Agent13OffshorePortTurnScenario,
): { passed: boolean; detail: string; lastShoreRelief: number; lastPortRelief: number } {
  let shoreMem: V1014OffshoreShoreElectrificationPersistedSlice | null = null;
  let portMem: V1014PortGreenCorridorPersistedSlice | null = null;
  let lastShoreRelief = 0;
  let lastPortRelief = 0;
  let lastBand: V1014OffshoreShoreElectrificationBand = 'shore_legacy_feed';

  for (const step of scenario.steps) {
    const shore = computeRegionalOffshoreShoreElectrificationLedger({
      regionId: step.regionId,
      offshoreRenewableRelief: step.offshoreRenewableRelief,
      shoreMarineEnergyRelief: step.shoreMarineEnergyRelief,
      greenHydrogenExportRelief: step.greenHydrogenExportRelief,
      batterySupplyChainRelief: step.batterySupplyChainRelief,
      blueCarbonCoastalRelief: step.blueCarbonCoastalRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: shoreMem,
    });
    shoreMem = shore.next;
    lastShoreRelief = shore.ledger.offshoreShoreElectrificationRelief;
    lastBand = shore.ledger.band;

    const port = advanceRegionalPortGreenCorridorOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      shoreBand: shore.ledger.band,
      climateAdaptationRelief: step.climateAdaptationRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: portMem,
    });
    portMem = port.next;
    lastPortRelief = port.ledger.portGreenCorridorRelief;
  }

  if (scenario.expect.minShoreReliefOnLast != null && lastShoreRelief < scenario.expect.minShoreReliefOnLast) {
    return {
      passed: false,
      detail: `shore relief ${lastShoreRelief} < ${scenario.expect.minShoreReliefOnLast}`,
      lastShoreRelief,
      lastPortRelief,
    };
  }
  if (scenario.expect.minPortReliefOnLast != null && lastPortRelief < scenario.expect.minPortReliefOnLast) {
    return {
      passed: false,
      detail: `port relief ${lastPortRelief} < ${scenario.expect.minPortReliefOnLast}`,
      lastShoreRelief,
      lastPortRelief,
    };
  }
  if (scenario.expect.lastShoreBand != null) {
    const allowed: V1014OffshoreShoreElectrificationBand[] = [scenario.expect.lastShoreBand];
    if (scenario.expect.lastShoreBand === 'offshore_shore_corridor') allowed.push('industrial_shore_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastShoreRelief, lastPortRelief };
    }
  }

  return { passed: true, detail: 'ok', lastShoreRelief, lastPortRelief };
}

export function scoreAgent13OffshorePortGIAlignment(params: {
  actionText: string;
  shoreBand?: string;
  portBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'offshore export cable',
    'shore electrification',
    'green port',
    'hydrogen bunkering',
    'cold ironing',
    'export cargo electrification',
    'marine renewable shore',
    'battery swapping port',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.21, 0, 2);
  if (params.shoreBand === 'industrial_shore_leader' || params.shoreBand === 'offshore_shore_corridor') {
    delta += hits.some(h => h.includes('offshore') || h.includes('shore') || h.includes('marine')) ? 0.38 : 0.1;
  }
  if (params.portBand === 'green_corridor_hub' || params.portBand === 'zero_emission_port_mesh') {
    delta += hits.some(h => h.includes('port') || h.includes('bunkering') || h.includes('cargo')) ? 0.35 : 0.09;
  }
  if (params.portBand === 'port_diesel_dependent' && hits.some(h => h.includes('port'))) delta -= 0.1;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Offshore port GI: ${hits.slice(0, 2).join(', ')} aligns with shore electrification and green corridor depth.`
        : null,
  };
}
