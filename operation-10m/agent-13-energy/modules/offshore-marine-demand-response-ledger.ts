/**
 * Agent 13 scale wave round 7 — offshore marine renewable corridors & demand-response orchestration.
 * Cross-turn persistence for floating wind build-out and virtual power plant grid relief.
 */

export type V1014OffshoreMarineBand = 'shore_idle' | 'lease_active' | 'export_corridor' | 'marine_leader';

export type V1014DemandResponseBand = 'dormant' | 'pilot_vpp' | 'orchestrated' | 'grid_shield';

export interface V1014OffshoreMarineInstrument {
  id: string;
  kind: 'floating_wind' | 'tidal_array' | 'offshore_solar' | 'marine_transmission';
  label: string;
  mwEqPerTurn: number;
  marineReliefFactor: number;
  demandBoostFactor: number;
  projectTypeHint: string;
}

export const V1014_OFFSHORE_MARINE_CATALOG: readonly V1014OffshoreMarineInstrument[] = [
  {
    id: 'off_float_wind',
    kind: 'floating_wind',
    label: 'Floating offshore wind zone',
    mwEqPerTurn: 58,
    marineReliefFactor: 0.17,
    demandBoostFactor: 0.14,
    projectTypeHint: 'offshore_floating_wind',
  },
  {
    id: 'off_tidal',
    kind: 'tidal_array',
    label: 'Tidal energy array',
    mwEqPerTurn: 34,
    marineReliefFactor: 0.12,
    demandBoostFactor: 0.1,
    projectTypeHint: 'tidal_energy_array',
  },
  {
    id: 'off_solar',
    kind: 'offshore_solar',
    label: 'Offshore solar pontoon field',
    mwEqPerTurn: 42,
    marineReliefFactor: 0.14,
    demandBoostFactor: 0.11,
    projectTypeHint: 'offshore_solar_field',
  },
  {
    id: 'off_tx',
    kind: 'marine_transmission',
    label: 'Subsea HVDC marine corridor',
    mwEqPerTurn: 26,
    marineReliefFactor: 0.09,
    demandBoostFactor: 0.16,
    projectTypeHint: 'subsea_hvdc_corridor',
  },
] as const;

export interface V1014DemandResponseTemplate {
  id: string;
  kind: 'industrial_load_shift' | 'residential_vpp' | 'battery_aggregation' | 'demand_flex_market';
  label: string;
  flexMwEq: number;
  gridReliefFactor: number;
  hydrogenSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_DEMAND_RESPONSE_CATALOG: readonly V1014DemandResponseTemplate[] = [
  {
    id: 'dr_industrial',
    kind: 'industrial_load_shift',
    label: 'Industrial load-shift orchestration',
    flexMwEq: 44,
    gridReliefFactor: 0.15,
    hydrogenSynergyFactor: 0.09,
    projectTypeHint: 'industrial_demand_response',
  },
  {
    id: 'dr_residential',
    kind: 'residential_vpp',
    label: 'Residential virtual power plant',
    flexMwEq: 32,
    gridReliefFactor: 0.12,
    hydrogenSynergyFactor: 0.06,
    projectTypeHint: 'residential_vpp',
  },
  {
    id: 'dr_battery_agg',
    kind: 'battery_aggregation',
    label: 'Distributed battery aggregation',
    flexMwEq: 52,
    gridReliefFactor: 0.18,
    hydrogenSynergyFactor: 0.11,
    projectTypeHint: 'battery_aggregation_hub',
  },
  {
    id: 'dr_flex_market',
    kind: 'demand_flex_market',
    label: 'Wholesale demand flexibility market',
    flexMwEq: 38,
    gridReliefFactor: 0.13,
    hydrogenSynergyFactor: 0.08,
    projectTypeHint: 'demand_flexibility_market',
  },
] as const;

export interface V1014RegionalOffshoreMarineLedger {
  regionId: string;
  band: V1014OffshoreMarineBand;
  marineIndex: number;
  leaseBalance: number;
  offshoreRenewableRelief: number;
  summary: string;
}

export interface V1014RegionalDemandResponseLedger {
  regionId: string;
  band: V1014DemandResponseBand;
  flexIndex: number;
  demandFlexRelief: number;
  summary: string;
}

export interface V1014OffshorePersistedSlice {
  leaseBalance: number;
  marineIndex: number;
}

export interface V1014DemandResponsePersistedSlice {
  flexIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const COASTAL_REGIONS = new Set(['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT']);

export function computeRegionalOffshoreMarineLedger(params: {
  regionId: string;
  renewableShareScore: number;
  gridStressPoints: number;
  hydrogenGridRelief: number;
  completedProjectTypes: string[];
  prev?: V1014OffshorePersistedSlice | null;
}): { ledger: V1014RegionalOffshoreMarineLedger; next: V1014OffshorePersistedSlice } {
  let mwGain = 0;
  let marineReliefProxy = 0;
  let demandBoost = 0;
  for (const inst of V1014_OFFSHORE_MARINE_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      mwGain += inst.mwEqPerTurn;
      marineReliefProxy += inst.marineReliefFactor;
      demandBoost += inst.demandBoostFactor;
    }
  }
  marineReliefProxy += clamp(params.renewableShareScore / 120, 0, 0.12);
  if (COASTAL_REGIONS.has(params.regionId)) marineReliefProxy += 0.06;
  else marineReliefProxy *= 0.55;

  const prevIdx = params.prev?.marineIndex ?? 0;
  const prevLease = params.prev?.leaseBalance ?? 0;
  const leaseBalance = clamp(prevLease * 0.9 + mwGain * 0.11, 0, 220);
  const marineIndex = clamp(prevIdx * 0.86 + leaseBalance * 0.14 + marineReliefProxy * 90, 0, 150);

  let band: V1014OffshoreMarineBand = 'shore_idle';
  if (marineIndex >= 95 || mwGain >= 120) band = 'marine_leader';
  else if (marineIndex >= 62 || mwGain >= 70) band = 'export_corridor';
  else if (marineIndex >= 28 || mwGain >= 24) band = 'lease_active';

  let offshoreRenewableRelief = clamp(marineReliefProxy * 11 + mwGain * 0.07 + demandBoost * 5, 0, 14);
  if (params.gridStressPoints > 18) offshoreRenewableRelief += 1.4;
  if (params.hydrogenGridRelief > 6) offshoreRenewableRelief += clamp(params.hydrogenGridRelief * 0.08, 0, 2);
  if (band === 'shore_idle') offshoreRenewableRelief *= 0.4;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      marineIndex: clamp(marineIndex, 0, 150),
      leaseBalance: clamp(leaseBalance, 0, 220),
      offshoreRenewableRelief: clamp(offshoreRenewableRelief, 0, 16),
      summary: `${params.regionId} offshore ${band} · marine idx ${marineIndex.toFixed(0)} · relief ${offshoreRenewableRelief.toFixed(1)}`,
    },
    next: { leaseBalance, marineIndex: clamp(marineIndex, 0, 150) },
  };
}

export function advanceRegionalDemandResponse(params: {
  regionId: string;
  gridStressPoints: number;
  hydrogenGridRelief: number;
  offshoreBand: V1014OffshoreMarineBand;
  completedProjectTypes: string[];
  prev?: V1014DemandResponsePersistedSlice | null;
}): { ledger: V1014RegionalDemandResponseLedger; next: V1014DemandResponsePersistedSlice } {
  let flexGain = 0;
  let reliefProxy = 0;
  let h2Synergy = 0;
  for (const tpl of V1014_DEMAND_RESPONSE_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      flexGain += tpl.flexMwEq;
      reliefProxy += tpl.gridReliefFactor;
      h2Synergy += tpl.hydrogenSynergyFactor;
    }
  }
  if (params.offshoreBand === 'export_corridor' || params.offshoreBand === 'marine_leader') {
    flexGain += 12;
    reliefProxy += 0.05;
  }
  if (params.hydrogenGridRelief > 4) {
    flexGain += params.hydrogenGridRelief * 1.2;
    h2Synergy += clamp(params.hydrogenGridRelief * 0.02, 0, 0.15);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.45, 0, 18);
  const prevIdx = params.prev?.flexIndex ?? 0;
  const flexIndex = clamp(prevIdx * 0.88 + flexGain * 0.12 + reliefProxy * 40 - stressLoad * 0.08 + h2Synergy * 25, 0, 140);

  let band: V1014DemandResponseBand = 'dormant';
  if (flexIndex >= 88 || flexGain >= 110) band = 'grid_shield';
  else if (flexIndex >= 52 || flexGain >= 60) band = 'orchestrated';
  else if (flexIndex >= 22 || flexGain >= 20) band = 'pilot_vpp';

  const demandFlexRelief = clamp(flexIndex / 22 + reliefProxy * 8 + h2Synergy * 10, 0, 13);
  if (band === 'dormant') {
    return {
      ledger: {
        regionId: params.regionId,
        band,
        flexIndex: clamp(flexIndex, 0, 140),
        demandFlexRelief: clamp(demandFlexRelief * 0.35, 0, 4),
        summary: `${params.regionId} demand response dormant · flex ${flexIndex.toFixed(0)}`,
      },
      next: { flexIndex: clamp(flexIndex, 0, 140) },
    };
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      flexIndex: clamp(flexIndex, 0, 140),
      demandFlexRelief: clamp(demandFlexRelief, 0, 13),
      summary: `${params.regionId} demand ${band} · flex idx ${flexIndex.toFixed(0)} · relief ${demandFlexRelief.toFixed(1)}`,
    },
    next: { flexIndex: clamp(flexIndex, 0, 140) },
  };
}

export const V1014_OFFSHORE_DEMAND_SCENARIOS = [
  {
    id: 'sc_offshore_tas',
    label: 'TAS floating wind with battery aggregation',
    regionId: 'TAS',
    renewableShareScore: 72,
    gridStressPoints: 14,
    hydrogenGridRelief: 4.5,
    completedProjectTypes: ['offshore_floating_wind', 'subsea_hvdc_corridor', 'battery_aggregation_hub'],
    expectBand: 'export_corridor' as V1014OffshoreMarineBand,
    expectMinRelief: 4,
  },
  {
    id: 'sc_demand_nsw',
    label: 'NSW orchestrated demand with industrial shift',
    regionId: 'NSW',
    gridStressPoints: 20,
    hydrogenGridRelief: 7,
    offshoreBand: 'lease_active' as V1014OffshoreMarineBand,
    completedProjectTypes: ['industrial_demand_response', 'demand_flexibility_market', 'residential_vpp'],
    expectBand: 'orchestrated' as V1014DemandResponseBand,
    expectMinRelief: 2.5,
  },
] as const;

export function runAgent13OffshoreDemandScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_OFFSHORE_MARINE_CATALOG.length >= 4);
  ok(V1014_DEMAND_RESPONSE_CATALOG.length >= 4);

  const sc0 = V1014_OFFSHORE_DEMAND_SCENARIOS[0];
  const off = computeRegionalOffshoreMarineLedger({
    regionId: sc0.regionId,
    renewableShareScore: sc0.renewableShareScore,
    gridStressPoints: sc0.gridStressPoints,
    hydrogenGridRelief: sc0.hydrogenGridRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    (off.ledger.band === sc0.expectBand || off.ledger.band === 'marine_leader') &&
      off.ledger.offshoreRenewableRelief >= sc0.expectMinRelief,
  );

  const sc1 = V1014_OFFSHORE_DEMAND_SCENARIOS[1];
  const dr = advanceRegionalDemandResponse({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    hydrogenGridRelief: sc1.hydrogenGridRelief,
    offshoreBand: sc1.offshoreBand,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(
    dr.ledger.band === sc1.expectBand ||
      dr.ledger.band === 'grid_shield' ||
      dr.ledger.demandFlexRelief >= sc1.expectMinRelief,
  );

  const inland = computeRegionalOffshoreMarineLedger({
    regionId: 'ACT',
    renewableShareScore: 40,
    gridStressPoints: 8,
    hydrogenGridRelief: 2,
    completedProjectTypes: ['offshore_floating_wind'],
    prev: null,
  });
  ok(inland.ledger.band === 'shore_idle' || inland.ledger.offshoreRenewableRelief < off.ledger.offshoreRenewableRelief);

  const persistA = advanceRegionalDemandResponse({
    regionId: 'VIC',
    gridStressPoints: 16,
    hydrogenGridRelief: 5,
    offshoreBand: 'lease_active',
    completedProjectTypes: ['battery_aggregation_hub'],
    prev: null,
  });
  const persistB = advanceRegionalDemandResponse({
    regionId: 'VIC',
    gridStressPoints: 16,
    hydrogenGridRelief: 5,
    offshoreBand: 'lease_active',
    completedProjectTypes: ['battery_aggregation_hub'],
    prev: persistA.next,
  });
  ok(persistB.next.flexIndex >= persistA.next.flexIndex * 0.8);

  const turnSc = runAgent13OffshoreDemandTurnScenario(V1014_OFFSHORE_DEMAND_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastOffshoreRelief >= 4);

  const gi = scoreAgent13OffshoreDemandGIAlignment({
    actionText: 'Fund floating offshore wind and residential virtual power plant',
    offshoreBand: 'export_corridor',
    demandBand: 'orchestrated',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13OffshoreDemandTurnStep {
  turn: number;
  regionId: string;
  renewableShareScore: number;
  gridStressPoints: number;
  hydrogenGridRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13OffshoreDemandTurnScenario {
  id: string;
  label: string;
  steps: Agent13OffshoreDemandTurnStep[];
  expect: {
    minOffshoreReliefOnLast?: number;
    minDemandReliefOnLast?: number;
    lastOffshoreBand?: V1014OffshoreMarineBand;
  };
}

export const V1014_OFFSHORE_DEMAND_TURN_SCENARIOS: readonly Agent13OffshoreDemandTurnScenario[] = [
  {
    id: 'sc_offshore_dr_tas',
    label: 'TAS offshore corridor with demand orchestration across turns',
    steps: [
      {
        turn: 1,
        regionId: 'TAS',
        renewableShareScore: 48,
        gridStressPoints: 16,
        hydrogenGridRelief: 3,
        completedProjectTypes: ['offshore_floating_wind'],
      },
      {
        turn: 2,
        regionId: 'TAS',
        renewableShareScore: 58,
        gridStressPoints: 14,
        hydrogenGridRelief: 4.5,
        completedProjectTypes: ['offshore_floating_wind', 'subsea_hvdc_corridor'],
      },
      {
        turn: 3,
        regionId: 'TAS',
        renewableShareScore: 68,
        gridStressPoints: 12,
        hydrogenGridRelief: 5.5,
        completedProjectTypes: [
          'offshore_floating_wind',
          'subsea_hvdc_corridor',
          'battery_aggregation_hub',
          'residential_vpp',
        ],
      },
    ],
    expect: { minOffshoreReliefOnLast: 4, minDemandReliefOnLast: 2, lastOffshoreBand: 'export_corridor' },
  },
] as const;

export function runAgent13OffshoreDemandTurnScenario(
  scenario: Agent13OffshoreDemandTurnScenario,
): { passed: boolean; detail: string; lastOffshoreRelief: number; lastDemandRelief: number } {
  let offMem: V1014OffshorePersistedSlice | null = null;
  let drMem: V1014DemandResponsePersistedSlice | null = null;
  let lastOffshoreRelief = 0;
  let lastDemandRelief = 0;
  let lastBand: V1014OffshoreMarineBand = 'shore_idle';

  for (const step of scenario.steps) {
    const off = computeRegionalOffshoreMarineLedger({
      regionId: step.regionId,
      renewableShareScore: step.renewableShareScore,
      gridStressPoints: step.gridStressPoints,
      hydrogenGridRelief: step.hydrogenGridRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: offMem,
    });
    offMem = off.next;
    lastOffshoreRelief = off.ledger.offshoreRenewableRelief;
    lastBand = off.ledger.band;

    const dr = advanceRegionalDemandResponse({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      hydrogenGridRelief: step.hydrogenGridRelief,
      offshoreBand: off.ledger.band,
      completedProjectTypes: step.completedProjectTypes,
      prev: drMem,
    });
    drMem = dr.next;
    lastDemandRelief = dr.ledger.demandFlexRelief;
  }

  if (scenario.expect.minOffshoreReliefOnLast != null && lastOffshoreRelief < scenario.expect.minOffshoreReliefOnLast) {
    return {
      passed: false,
      detail: `offshore relief ${lastOffshoreRelief} < ${scenario.expect.minOffshoreReliefOnLast}`,
      lastOffshoreRelief,
      lastDemandRelief,
    };
  }
  if (scenario.expect.minDemandReliefOnLast != null && lastDemandRelief < scenario.expect.minDemandReliefOnLast) {
    return {
      passed: false,
      detail: `demand relief ${lastDemandRelief} < ${scenario.expect.minDemandReliefOnLast}`,
      lastOffshoreRelief,
      lastDemandRelief,
    };
  }
  if (scenario.expect.lastOffshoreBand != null) {
    const allowed: V1014OffshoreMarineBand[] = [scenario.expect.lastOffshoreBand];
    if (scenario.expect.lastOffshoreBand === 'export_corridor') allowed.push('marine_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastOffshoreRelief, lastDemandRelief };
    }
  }

  return { passed: true, detail: 'ok', lastOffshoreRelief, lastDemandRelief };
}

export function scoreAgent13OffshoreDemandGIAlignment(params: {
  actionText: string;
  offshoreBand?: string;
  demandBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = ['offshore', 'floating', 'wind', 'vpp', 'demand response', 'battery aggregation', 'marine'].filter(k =>
    text.includes(k),
  );
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.42, 0, 2);
  if (params.offshoreBand === 'marine_leader' || params.offshoreBand === 'export_corridor') {
    delta += hits.some(h => h.includes('offshore') || h.includes('floating')) ? 0.65 : 0.25;
  }
  if (params.demandBand === 'grid_shield' || params.demandBand === 'orchestrated') {
    delta += hits.some(h => h.includes('demand') || h.includes('vpp') || h.includes('battery')) ? 0.55 : 0.2;
  }
  if (params.demandBand === 'dormant' && hits.some(h => h.includes('vpp'))) {
    delta -= 0.3;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Offshore/demand GI: ${hits.slice(0, 2).join(', ')} aligns with marine corridor and flex orchestration.`
        : null,
  };
}
