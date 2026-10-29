/**
 * Agent 13 scale wave round 10 — rooftop DER orchestration & EV fleet vehicle-to-grid services.
 * Cross-turn persistence for behind-the-meter solar/battery aggregation and bidirectional EV charging relief.
 */

export type V1014RooftopDerBand = 'fragmented' | 'aggregating' | 'orchestrated' | 'der_mesh_leader';

export type V1014EvV2gFleetBand = 'parked_idle' | 'pilot_bidirectional' | 'fleet_dispatch' | 'grid_anchor_fleet';

export interface V1014RooftopDerInstrument {
  id: string;
  kind: 'rooftop_solar_cluster' | 'home_battery_vpp' | 'commercial_der_hub' | 'dynamic_export_limit';
  label: string;
  mwEqPerTurn: number;
  derReliefFactor: number;
  v2gSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_ROOFTOP_DER_CATALOG: readonly V1014RooftopDerInstrument[] = [
  {
    id: 'der_rooftop',
    kind: 'rooftop_solar_cluster',
    label: 'Rooftop solar DER cluster',
    mwEqPerTurn: 40,
    derReliefFactor: 0.15,
    v2gSynergyFactor: 0.09,
    projectTypeHint: 'rooftop_solar_der_cluster',
  },
  {
    id: 'der_home_batt',
    kind: 'home_battery_vpp',
    label: 'Home battery virtual plant',
    mwEqPerTurn: 34,
    derReliefFactor: 0.13,
    v2gSynergyFactor: 0.11,
    projectTypeHint: 'home_battery_vpp',
  },
  {
    id: 'der_commercial',
    kind: 'commercial_der_hub',
    label: 'Commercial DER orchestration hub',
    mwEqPerTurn: 46,
    derReliefFactor: 0.17,
    v2gSynergyFactor: 0.1,
    projectTypeHint: 'commercial_der_hub',
  },
  {
    id: 'der_export',
    kind: 'dynamic_export_limit',
    label: 'Dynamic export limit coordination',
    mwEqPerTurn: 24,
    derReliefFactor: 0.11,
    v2gSynergyFactor: 0.14,
    projectTypeHint: 'dynamic_export_coordination',
  },
] as const;

export interface V1014EvV2gFleetTemplate {
  id: string;
  kind: 'municipal_ev_v2g' | 'fleet_depot_bidirectional' | 'transit_bus_v2g' | 'workplace_smart_charging';
  label: string;
  v2gMwEq: number;
  gridReliefFactor: number;
  derSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_EV_V2G_CATALOG: readonly V1014EvV2gFleetTemplate[] = [
  {
    id: 'v2g_municipal',
    kind: 'municipal_ev_v2g',
    label: 'Municipal EV bidirectional fleet',
    v2gMwEq: 36,
    gridReliefFactor: 0.14,
    derSynergyFactor: 0.08,
    projectTypeHint: 'municipal_ev_v2g_fleet',
  },
  {
    id: 'v2g_depot',
    kind: 'fleet_depot_bidirectional',
    label: 'Fleet depot bidirectional charging',
    v2gMwEq: 48,
    gridReliefFactor: 0.17,
    derSynergyFactor: 0.1,
    projectTypeHint: 'fleet_depot_bidirectional',
  },
  {
    id: 'v2g_transit',
    kind: 'transit_bus_v2g',
    label: 'Transit bus V2G corridor',
    v2gMwEq: 42,
    gridReliefFactor: 0.16,
    derSynergyFactor: 0.09,
    projectTypeHint: 'transit_bus_v2g',
  },
  {
    id: 'v2g_workplace',
    kind: 'workplace_smart_charging',
    label: 'Workplace smart V2G charging',
    v2gMwEq: 30,
    gridReliefFactor: 0.12,
    derSynergyFactor: 0.12,
    projectTypeHint: 'workplace_smart_v2g',
  },
] as const;

export interface V1014RegionalRooftopDerLedger {
  regionId: string;
  band: V1014RooftopDerBand;
  derIndex: number;
  exportBalance: number;
  rooftopDerRelief: number;
  summary: string;
}

export interface V1014RegionalEvV2gFleetLedger {
  regionId: string;
  band: V1014EvV2gFleetBand;
  fleetIndex: number;
  evV2gGridRelief: number;
  summary: string;
}

export interface V1014RooftopDerPersistedSlice {
  exportBalance: number;
  derIndex: number;
}

export interface V1014EvV2gPersistedSlice {
  fleetIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const URBAN_DER_REGIONS = new Set(['NSW', 'VIC', 'QLD', 'SA', 'WA', 'ACT']);

export function computeRegionalRooftopDerLedger(params: {
  regionId: string;
  renewableShareScore: number;
  demandFlexRelief: number;
  bushfireGridRelief: number;
  completedProjectTypes: string[];
  prev?: V1014RooftopDerPersistedSlice | null;
}): { ledger: V1014RegionalRooftopDerLedger; next: V1014RooftopDerPersistedSlice } {
  let mwGain = 0;
  let derProxy = 0;
  let v2gSynergy = 0;
  for (const inst of V1014_ROOFTOP_DER_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      mwGain += inst.mwEqPerTurn;
      derProxy += inst.derReliefFactor;
      v2gSynergy += inst.v2gSynergyFactor;
    }
  }
  derProxy += clamp(params.renewableShareScore / 105, 0, 0.13);
  if (URBAN_DER_REGIONS.has(params.regionId)) derProxy += 0.05;
  else derProxy *= 0.7;

  const prevIdx = params.prev?.derIndex ?? 0;
  const prevExport = params.prev?.exportBalance ?? 0;
  const exportBalance = clamp(prevExport * 0.9 + mwGain * 0.11, 0, 200);
  const derIndex = clamp(prevIdx * 0.88 + exportBalance * 0.12 + derProxy * 82 + v2gSynergy * 22, 0, 148);

  let band: V1014RooftopDerBand = 'fragmented';
  if (derIndex >= 94 || mwGain >= 112) band = 'der_mesh_leader';
  else if (derIndex >= 60 || mwGain >= 66) band = 'orchestrated';
  else if (derIndex >= 26 || mwGain >= 24) band = 'aggregating';

  let rooftopDerRelief = clamp(derProxy * 9.5 + mwGain * 0.055 + v2gSynergy * 5.5, 0, 12);
  if (params.demandFlexRelief > 4) rooftopDerRelief += clamp(params.demandFlexRelief * 0.1, 0, 2);
  if (params.bushfireGridRelief > 3) rooftopDerRelief += clamp(params.bushfireGridRelief * 0.08, 0, 1.6);
  if (band === 'fragmented') rooftopDerRelief *= 0.4;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      derIndex: clamp(derIndex, 0, 148),
      exportBalance: clamp(exportBalance, 0, 200),
      rooftopDerRelief: clamp(rooftopDerRelief, 0, 13),
      summary: `${params.regionId} rooftop DER ${band} · der idx ${derIndex.toFixed(0)} · relief ${rooftopDerRelief.toFixed(1)}`,
    },
    next: { exportBalance, derIndex: clamp(derIndex, 0, 148) },
  };
}

export function advanceRegionalEvV2gFleet(params: {
  regionId: string;
  gridStressPoints: number;
  rooftopDerBand: V1014RooftopDerBand;
  rezSpillRelief: number;
  completedProjectTypes: string[];
  prev?: V1014EvV2gPersistedSlice | null;
}): { ledger: V1014RegionalEvV2gFleetLedger; next: V1014EvV2gPersistedSlice } {
  let v2gGain = 0;
  let reliefProxy = 0;
  let derSynergy = 0;
  for (const tpl of V1014_EV_V2G_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      v2gGain += tpl.v2gMwEq;
      reliefProxy += tpl.gridReliefFactor;
      derSynergy += tpl.derSynergyFactor;
    }
  }
  if (params.rooftopDerBand === 'orchestrated' || params.rooftopDerBand === 'der_mesh_leader') {
    v2gGain += 13;
    derSynergy += 0.07;
  }
  if (params.rezSpillRelief > 4) {
    v2gGain += params.rezSpillRelief * 1.1;
    reliefProxy += clamp(params.rezSpillRelief * 0.015, 0, 0.1);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.4, 0, 15);
  const prevIdx = params.prev?.fleetIndex ?? 0;
  const fleetIndex = clamp(
    prevIdx * 0.88 + v2gGain * 0.12 + reliefProxy * 36 - stressLoad * 0.06 + derSynergy * 26,
    0,
    152,
  );

  let band: V1014EvV2gFleetBand = 'parked_idle';
  if (fleetIndex >= 96 || v2gGain >= 118) band = 'grid_anchor_fleet';
  else if (fleetIndex >= 58 || v2gGain >= 68) band = 'fleet_dispatch';
  else if (fleetIndex >= 24 || v2gGain >= 22) band = 'pilot_bidirectional';

  const evV2gGridRelief = clamp(fleetIndex / 23 + reliefProxy * 7 + derSynergy * 8.5, 0, 11);
  if (band === 'parked_idle') {
    return {
      ledger: {
        regionId: params.regionId,
        band,
        fleetIndex: clamp(fleetIndex, 0, 152),
        evV2gGridRelief: clamp(evV2gGridRelief * 0.36, 0, 3.5),
        summary: `${params.regionId} EV V2G parked idle · fleet idx ${fleetIndex.toFixed(0)}`,
      },
      next: { fleetIndex: clamp(fleetIndex, 0, 152) },
    };
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      fleetIndex: clamp(fleetIndex, 0, 152),
      evV2gGridRelief: clamp(evV2gGridRelief, 0, 11),
      summary: `${params.regionId} EV V2G ${band} · fleet idx ${fleetIndex.toFixed(0)} · relief ${evV2gGridRelief.toFixed(1)}`,
    },
    next: { fleetIndex: clamp(fleetIndex, 0, 152) },
  };
}

export const V1014_DER_V2G_SCENARIOS = [
  {
    id: 'sc_der_vic',
    label: 'VIC rooftop DER mesh with municipal V2G',
    regionId: 'VIC',
    renewableShareScore: 56,
    demandFlexRelief: 5,
    bushfireGridRelief: 4,
    gridStressPoints: 17,
    rezSpillRelief: 5,
    completedProjectTypes: [
      'rooftop_solar_der_cluster',
      'home_battery_vpp',
      'municipal_ev_v2g_fleet',
      'workplace_smart_v2g',
    ],
    expectDerBand: 'orchestrated' as V1014RooftopDerBand,
    expectMinDerRelief: 3,
    expectV2gBand: 'fleet_dispatch' as V1014EvV2gFleetBand,
    expectMinV2gRelief: 2,
  },
  {
    id: 'sc_v2g_qld',
    label: 'QLD fleet depot bidirectional with commercial DER',
    regionId: 'QLD',
    renewableShareScore: 44,
    demandFlexRelief: 3,
    bushfireGridRelief: 2,
    gridStressPoints: 20,
    rezSpillRelief: 3,
    rooftopDerBand: 'aggregating' as V1014RooftopDerBand,
    completedProjectTypes: ['commercial_der_hub', 'fleet_depot_bidirectional', 'transit_bus_v2g'],
    expectV2gBand: 'pilot_bidirectional' as V1014EvV2gFleetBand,
    expectMinV2gRelief: 2,
  },
] as const;

export function runAgent13DerV2gScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_ROOFTOP_DER_CATALOG.length >= 4);
  ok(V1014_EV_V2G_CATALOG.length >= 4);

  const sc0 = V1014_DER_V2G_SCENARIOS[0];
  const der = computeRegionalRooftopDerLedger({
    regionId: sc0.regionId,
    renewableShareScore: sc0.renewableShareScore,
    demandFlexRelief: sc0.demandFlexRelief,
    bushfireGridRelief: sc0.bushfireGridRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    der.ledger.band === sc0.expectDerBand ||
      der.ledger.band === 'der_mesh_leader' ||
      der.ledger.rooftopDerRelief >= sc0.expectMinDerRelief,
  );

  const v2g = advanceRegionalEvV2gFleet({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    rooftopDerBand: der.ledger.band,
    rezSpillRelief: sc0.rezSpillRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    v2g.ledger.band === sc0.expectV2gBand ||
      v2g.ledger.band === 'grid_anchor_fleet' ||
      v2g.ledger.evV2gGridRelief >= sc0.expectMinV2gRelief,
  );

  const sc1 = V1014_DER_V2G_SCENARIOS[1];
  const v2gQ = advanceRegionalEvV2gFleet({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    rooftopDerBand: sc1.rooftopDerBand,
    rezSpillRelief: sc1.rezSpillRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(v2gQ.ledger.evV2gGridRelief >= sc1.expectMinV2gRelief || v2gQ.ledger.band !== 'parked_idle');

  const persistA = computeRegionalRooftopDerLedger({
    regionId: 'NSW',
    renewableShareScore: 50,
    demandFlexRelief: 4,
    bushfireGridRelief: 3,
    completedProjectTypes: ['rooftop_solar_der_cluster'],
    prev: null,
  });
  const persistB = computeRegionalRooftopDerLedger({
    regionId: 'NSW',
    renewableShareScore: 50,
    demandFlexRelief: 4,
    bushfireGridRelief: 3,
    completedProjectTypes: ['rooftop_solar_der_cluster'],
    prev: persistA.next,
  });
  ok(persistB.next.derIndex >= persistA.next.derIndex * 0.82);

  const turnSc = runAgent13DerV2gTurnScenario(V1014_DER_V2G_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastDerRelief >= 3);

  const gi = scoreAgent13DerV2gGIAlignment({
    actionText: 'Rooftop DER orchestration and municipal EV V2G fleet dispatch',
    derBand: 'orchestrated',
    v2gBand: 'fleet_dispatch',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13DerV2gTurnStep {
  turn: number;
  regionId: string;
  renewableShareScore: number;
  demandFlexRelief: number;
  bushfireGridRelief: number;
  gridStressPoints: number;
  rezSpillRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13DerV2gTurnScenario {
  id: string;
  label: string;
  steps: Agent13DerV2gTurnStep[];
  expect: {
    minDerReliefOnLast?: number;
    minV2gReliefOnLast?: number;
    lastDerBand?: V1014RooftopDerBand;
  };
}

export const V1014_DER_V2G_TURN_SCENARIOS: readonly Agent13DerV2gTurnScenario[] = [
  {
    id: 'sc_der_v2g_vic',
    label: 'VIC rooftop DER mesh with escalating EV V2G fleet',
    steps: [
      {
        turn: 1,
        regionId: 'VIC',
        renewableShareScore: 46,
        demandFlexRelief: 3.5,
        bushfireGridRelief: 2.5,
        gridStressPoints: 19,
        rezSpillRelief: 3.5,
        completedProjectTypes: ['rooftop_solar_der_cluster', 'municipal_ev_v2g_fleet'],
      },
      {
        turn: 2,
        regionId: 'VIC',
        renewableShareScore: 52,
        demandFlexRelief: 4.5,
        bushfireGridRelief: 3.5,
        gridStressPoints: 17,
        rezSpillRelief: 4.5,
        completedProjectTypes: ['rooftop_solar_der_cluster', 'home_battery_vpp', 'workplace_smart_v2g'],
      },
      {
        turn: 3,
        regionId: 'VIC',
        renewableShareScore: 58,
        demandFlexRelief: 5.5,
        bushfireGridRelief: 4,
        gridStressPoints: 15,
        rezSpillRelief: 5.5,
        completedProjectTypes: [
          'rooftop_solar_der_cluster',
          'home_battery_vpp',
          'commercial_der_hub',
          'dynamic_export_coordination',
          'municipal_ev_v2g_fleet',
          'fleet_depot_bidirectional',
        ],
      },
    ],
    expect: { minDerReliefOnLast: 3, minV2gReliefOnLast: 2, lastDerBand: 'orchestrated' },
  },
] as const;

export function runAgent13DerV2gTurnScenario(
  scenario: Agent13DerV2gTurnScenario,
): { passed: boolean; detail: string; lastDerRelief: number; lastV2gRelief: number } {
  let derMem: V1014RooftopDerPersistedSlice | null = null;
  let v2gMem: V1014EvV2gPersistedSlice | null = null;
  let lastDerRelief = 0;
  let lastV2gRelief = 0;
  let lastBand: V1014RooftopDerBand = 'fragmented';

  for (const step of scenario.steps) {
    const der = computeRegionalRooftopDerLedger({
      regionId: step.regionId,
      renewableShareScore: step.renewableShareScore,
      demandFlexRelief: step.demandFlexRelief,
      bushfireGridRelief: step.bushfireGridRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: derMem,
    });
    derMem = der.next;
    lastDerRelief = der.ledger.rooftopDerRelief;
    lastBand = der.ledger.band;

    const v2g = advanceRegionalEvV2gFleet({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      rooftopDerBand: der.ledger.band,
      rezSpillRelief: step.rezSpillRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: v2gMem,
    });
    v2gMem = v2g.next;
    lastV2gRelief = v2g.ledger.evV2gGridRelief;
  }

  if (scenario.expect.minDerReliefOnLast != null && lastDerRelief < scenario.expect.minDerReliefOnLast) {
    return {
      passed: false,
      detail: `der relief ${lastDerRelief} < ${scenario.expect.minDerReliefOnLast}`,
      lastDerRelief,
      lastV2gRelief,
    };
  }
  if (scenario.expect.minV2gReliefOnLast != null && lastV2gRelief < scenario.expect.minV2gReliefOnLast) {
    return {
      passed: false,
      detail: `v2g relief ${lastV2gRelief} < ${scenario.expect.minV2gReliefOnLast}`,
      lastDerRelief,
      lastV2gRelief,
    };
  }
  if (scenario.expect.lastDerBand != null) {
    const allowed: V1014RooftopDerBand[] = [scenario.expect.lastDerBand];
    if (scenario.expect.lastDerBand === 'orchestrated') allowed.push('der_mesh_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastDerRelief, lastV2gRelief };
    }
  }

  return { passed: true, detail: 'ok', lastDerRelief, lastV2gRelief };
}

export function scoreAgent13DerV2gGIAlignment(params: {
  actionText: string;
  derBand?: string;
  v2gBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = ['rooftop', 'der', 'behind-the-meter', 'v2g', 'vehicle-to-grid', 'bidirectional', 'ev fleet', 'smart charging'].filter(
    k => text.includes(k),
  );
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.36, 0, 2);
  if (params.derBand === 'der_mesh_leader' || params.derBand === 'orchestrated') {
    delta += hits.some(h => h.includes('rooftop') || h.includes('der')) ? 0.52 : 0.18;
  }
  if (params.v2gBand === 'grid_anchor_fleet' || params.v2gBand === 'fleet_dispatch') {
    delta += hits.some(h => h.includes('v2g') || h.includes('ev') || h.includes('bidirectional')) ? 0.46 : 0.15;
  }
  if (params.v2gBand === 'parked_idle' && hits.some(h => h.includes('v2g'))) {
    delta -= 0.2;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `DER/V2G GI: ${hits.slice(0, 2).join(', ')} aligns with rooftop orchestration and EV fleet grid services.`
        : null,
  };
}
