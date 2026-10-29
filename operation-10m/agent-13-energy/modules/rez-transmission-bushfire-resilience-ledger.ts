/**
 * Agent 13 scale wave round 9 — renewable energy zone transmission corridors & bushfire grid resilience.
 * Cross-turn persistence for REZ backbone build-out and emergency microgrid / fire-season hardening relief.
 */

export type V1014RezTransmissionBand = 'isolated' | 'planning' | 'backbone_live' | 'rez_export_hub';

export type V1014BushfireResilienceBand = 'vulnerable' | 'hardening' | 'fire_season_ready' | 'islanded_resilience';

export interface V1014RezTransmissionInstrument {
  id: string;
  kind: 'rez_backbone' | 'gen_tie_line' | 'renewable_hub_switchyard' | 'wide_area_monitoring';
  label: string;
  mwEqPerTurn: number;
  spillReliefFactor: number;
  firmingSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_REZ_TRANSMISSION_CATALOG: readonly V1014RezTransmissionInstrument[] = [
  {
    id: 'rez_backbone',
    kind: 'rez_backbone',
    label: 'REZ backbone HV corridor',
    mwEqPerTurn: 48,
    spillReliefFactor: 0.16,
    firmingSynergyFactor: 0.1,
    projectTypeHint: 'rez_transmission_backbone',
  },
  {
    id: 'rez_gen_tie',
    kind: 'gen_tie_line',
    label: 'Generator tie-line to REZ hub',
    mwEqPerTurn: 36,
    spillReliefFactor: 0.13,
    firmingSynergyFactor: 0.08,
    projectTypeHint: 'rez_generator_tie_line',
  },
  {
    id: 'rez_switchyard',
    kind: 'renewable_hub_switchyard',
    label: 'Renewable hub switchyard expansion',
    mwEqPerTurn: 42,
    spillReliefFactor: 0.15,
    firmingSynergyFactor: 0.11,
    projectTypeHint: 'renewable_hub_switchyard',
  },
  {
    id: 'rez_wams',
    kind: 'wide_area_monitoring',
    label: 'Wide-area monitoring & control layer',
    mwEqPerTurn: 22,
    spillReliefFactor: 0.11,
    firmingSynergyFactor: 0.14,
    projectTypeHint: 'grid_wide_area_monitoring',
  },
] as const;

export interface V1014BushfireResilienceTemplate {
  id: string;
  kind: 'fire_season_microgrid' | 'line_hardening' | 'community_shelter_power' | 'rapid_islanding';
  label: string;
  resilienceMwEq: number;
  gridReliefFactor: number;
  rezSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_BUSHFIRE_RESILIENCE_CATALOG: readonly V1014BushfireResilienceTemplate[] = [
  {
    id: 'bf_microgrid',
    kind: 'fire_season_microgrid',
    label: 'Fire-season community microgrid',
    resilienceMwEq: 38,
    gridReliefFactor: 0.14,
    rezSynergyFactor: 0.09,
    projectTypeHint: 'fire_season_microgrid',
  },
  {
    id: 'bf_line_hard',
    kind: 'line_hardening',
    label: 'Bushfire line hardening program',
    resilienceMwEq: 44,
    gridReliefFactor: 0.17,
    rezSynergyFactor: 0.07,
    projectTypeHint: 'bushfire_line_hardening',
  },
  {
    id: 'bf_shelter',
    kind: 'community_shelter_power',
    label: 'Emergency shelter resilient power',
    resilienceMwEq: 28,
    gridReliefFactor: 0.12,
    rezSynergyFactor: 0.06,
    projectTypeHint: 'emergency_shelter_power',
  },
  {
    id: 'bf_islanding',
    kind: 'rapid_islanding',
    label: 'Rapid grid islanding controls',
    resilienceMwEq: 52,
    gridReliefFactor: 0.19,
    rezSynergyFactor: 0.12,
    projectTypeHint: 'rapid_grid_islanding',
  },
] as const;

export interface V1014RegionalRezTransmissionLedger {
  regionId: string;
  band: V1014RezTransmissionBand;
  backboneIndex: number;
  spillBalance: number;
  rezSpillRelief: number;
  summary: string;
}

export interface V1014RegionalBushfireResilienceLedger {
  regionId: string;
  band: V1014BushfireResilienceBand;
  resilienceIndex: number;
  bushfireGridRelief: number;
  summary: string;
}

export interface V1014RezPersistedSlice {
  spillBalance: number;
  backboneIndex: number;
}

export interface V1014BushfirePersistedSlice {
  resilienceIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const REZ_PRIORITY_REGIONS = new Set(['NSW', 'QLD', 'VIC', 'SA', 'WA']);
const FIRE_SEASON_REGIONS = new Set(['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT']);

export function computeRegionalRezTransmissionLedger(params: {
  regionId: string;
  renewableShareScore: number;
  gridFirmingRelief: number;
  completedProjectTypes: string[];
  prev?: V1014RezPersistedSlice | null;
}): { ledger: V1014RegionalRezTransmissionLedger; next: V1014RezPersistedSlice } {
  let mwGain = 0;
  let spillProxy = 0;
  let firmSynergy = 0;
  for (const inst of V1014_REZ_TRANSMISSION_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      mwGain += inst.mwEqPerTurn;
      spillProxy += inst.spillReliefFactor;
      firmSynergy += inst.firmingSynergyFactor;
    }
  }
  spillProxy += clamp(params.renewableShareScore / 110, 0, 0.14);
  if (REZ_PRIORITY_REGIONS.has(params.regionId)) spillProxy += 0.05;
  else spillProxy *= 0.72;

  const prevIdx = params.prev?.backboneIndex ?? 0;
  const prevSpill = params.prev?.spillBalance ?? 0;
  const spillBalance = clamp(prevSpill * 0.91 + mwGain * 0.1, 0, 210);
  const backboneIndex = clamp(prevIdx * 0.87 + spillBalance * 0.13 + spillProxy * 85 + firmSynergy * 20, 0, 145);

  let band: V1014RezTransmissionBand = 'isolated';
  if (backboneIndex >= 92 || mwGain >= 115) band = 'rez_export_hub';
  else if (backboneIndex >= 58 || mwGain >= 68) band = 'backbone_live';
  else if (backboneIndex >= 24 || mwGain >= 22) band = 'planning';

  let rezSpillRelief = clamp(spillProxy * 10 + mwGain * 0.06 + firmSynergy * 6, 0, 13);
  if (params.gridFirmingRelief > 5) rezSpillRelief += clamp(params.gridFirmingRelief * 0.12, 0, 2.2);
  if (band === 'isolated') rezSpillRelief *= 0.42;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      backboneIndex: clamp(backboneIndex, 0, 145),
      spillBalance: clamp(spillBalance, 0, 210),
      rezSpillRelief: clamp(rezSpillRelief, 0, 14),
      summary: `${params.regionId} REZ ${band} · backbone idx ${backboneIndex.toFixed(0)} · spill relief ${rezSpillRelief.toFixed(1)}`,
    },
    next: { spillBalance, backboneIndex: clamp(backboneIndex, 0, 145) },
  };
}

export function advanceRegionalBushfireResilience(params: {
  regionId: string;
  gridStressPoints: number;
  climateHazardPressure: number;
  rezBand: V1014RezTransmissionBand;
  completedProjectTypes: string[];
  prev?: V1014BushfirePersistedSlice | null;
}): { ledger: V1014RegionalBushfireResilienceLedger; next: V1014BushfirePersistedSlice } {
  let resilienceGain = 0;
  let reliefProxy = 0;
  let rezSynergy = 0;
  for (const tpl of V1014_BUSHFIRE_RESILIENCE_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      resilienceGain += tpl.resilienceMwEq;
      reliefProxy += tpl.gridReliefFactor;
      rezSynergy += tpl.rezSynergyFactor;
    }
  }
  if (params.rezBand === 'backbone_live' || params.rezBand === 'rez_export_hub') {
    resilienceGain += 14;
    rezSynergy += 0.06;
  }
  if (FIRE_SEASON_REGIONS.has(params.regionId)) {
    resilienceGain += clamp(params.climateHazardPressure * 0.35, 0, 18);
    reliefProxy += clamp(params.climateHazardPressure / 120, 0, 0.08);
  } else {
    resilienceGain *= 0.65;
  }

  const stressLoad = clamp(params.gridStressPoints * 0.42, 0, 16);
  const prevIdx = params.prev?.resilienceIndex ?? 0;
  const resilienceIndex = clamp(
    prevIdx * 0.89 + resilienceGain * 0.11 + reliefProxy * 38 - stressLoad * 0.07 + rezSynergy * 28,
    0,
    150,
  );

  let band: V1014BushfireResilienceBand = 'vulnerable';
  if (resilienceIndex >= 95 || resilienceGain >= 115) band = 'islanded_resilience';
  else if (resilienceIndex >= 58 || resilienceGain >= 70) band = 'fire_season_ready';
  else if (resilienceIndex >= 24 || resilienceGain >= 22) band = 'hardening';

  const bushfireGridRelief = clamp(resilienceIndex / 24 + reliefProxy * 7.5 + rezSynergy * 9, 0, 12);
  if (band === 'vulnerable') {
    return {
      ledger: {
        regionId: params.regionId,
        band,
        resilienceIndex: clamp(resilienceIndex, 0, 150),
        bushfireGridRelief: clamp(bushfireGridRelief * 0.38, 0, 4),
        summary: `${params.regionId} bushfire resilience vulnerable · idx ${resilienceIndex.toFixed(0)}`,
      },
      next: { resilienceIndex: clamp(resilienceIndex, 0, 150) },
    };
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      resilienceIndex: clamp(resilienceIndex, 0, 150),
      bushfireGridRelief: clamp(bushfireGridRelief, 0, 12),
      summary: `${params.regionId} bushfire ${band} · resilience idx ${resilienceIndex.toFixed(0)} · relief ${bushfireGridRelief.toFixed(1)}`,
    },
    next: { resilienceIndex: clamp(resilienceIndex, 0, 150) },
  };
}

export const V1014_REZ_BUSHFIRE_SCENARIOS = [
  {
    id: 'sc_rez_nsw',
    label: 'NSW REZ backbone with fire-season microgrid',
    regionId: 'NSW',
    renewableShareScore: 58,
    gridFirmingRelief: 6,
    gridStressPoints: 19,
    climateHazardPressure: 22,
    completedProjectTypes: [
      'rez_transmission_backbone',
      'renewable_hub_switchyard',
      'fire_season_microgrid',
      'bushfire_line_hardening',
    ],
    expectRezBand: 'backbone_live' as V1014RezTransmissionBand,
    expectMinRezRelief: 3,
    expectFireBand: 'fire_season_ready' as V1014BushfireResilienceBand,
    expectMinFireRelief: 2,
  },
  {
    id: 'sc_fire_vic',
    label: 'VIC rapid islanding with generator tie-line',
    regionId: 'VIC',
    renewableShareScore: 46,
    gridFirmingRelief: 4,
    gridStressPoints: 21,
    climateHazardPressure: 28,
    rezBand: 'planning' as V1014RezTransmissionBand,
    completedProjectTypes: ['rez_generator_tie_line', 'rapid_grid_islanding', 'emergency_shelter_power'],
    expectFireBand: 'hardening' as V1014BushfireResilienceBand,
    expectMinFireRelief: 2,
  },
] as const;

export function runAgent13RezBushfireScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_REZ_TRANSMISSION_CATALOG.length >= 4);
  ok(V1014_BUSHFIRE_RESILIENCE_CATALOG.length >= 4);

  const sc0 = V1014_REZ_BUSHFIRE_SCENARIOS[0];
  const rez = computeRegionalRezTransmissionLedger({
    regionId: sc0.regionId,
    renewableShareScore: sc0.renewableShareScore,
    gridFirmingRelief: sc0.gridFirmingRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    rez.ledger.band === sc0.expectRezBand ||
      rez.ledger.band === 'rez_export_hub' ||
      rez.ledger.rezSpillRelief >= sc0.expectMinRezRelief,
  );

  const fire = advanceRegionalBushfireResilience({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    climateHazardPressure: sc0.climateHazardPressure,
    rezBand: rez.ledger.band,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    fire.ledger.band === sc0.expectFireBand ||
      fire.ledger.band === 'islanded_resilience' ||
      fire.ledger.bushfireGridRelief >= sc0.expectMinFireRelief,
  );

  const sc1 = V1014_REZ_BUSHFIRE_SCENARIOS[1];
  const fireV = advanceRegionalBushfireResilience({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    climateHazardPressure: sc1.climateHazardPressure,
    rezBand: sc1.rezBand,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(fireV.ledger.bushfireGridRelief >= sc1.expectMinFireRelief || fireV.ledger.band !== 'vulnerable');

  const persistA = computeRegionalRezTransmissionLedger({
    regionId: 'QLD',
    renewableShareScore: 52,
    gridFirmingRelief: 5,
    completedProjectTypes: ['rez_transmission_backbone'],
    prev: null,
  });
  const persistB = computeRegionalRezTransmissionLedger({
    regionId: 'QLD',
    renewableShareScore: 52,
    gridFirmingRelief: 5,
    completedProjectTypes: ['rez_transmission_backbone'],
    prev: persistA.next,
  });
  ok(persistB.next.backboneIndex >= persistA.next.backboneIndex * 0.82);

  const turnSc = runAgent13RezBushfireTurnScenario(V1014_REZ_BUSHFIRE_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastRezRelief >= 3);

  const gi = scoreAgent13RezBushfireGIAlignment({
    actionText: 'REZ transmission backbone and bushfire microgrid hardening',
    rezBand: 'backbone_live',
    fireBand: 'fire_season_ready',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13RezBushfireTurnStep {
  turn: number;
  regionId: string;
  renewableShareScore: number;
  gridFirmingRelief: number;
  gridStressPoints: number;
  climateHazardPressure: number;
  completedProjectTypes: string[];
}

export interface Agent13RezBushfireTurnScenario {
  id: string;
  label: string;
  steps: Agent13RezBushfireTurnStep[];
  expect: {
    minRezReliefOnLast?: number;
    minFireReliefOnLast?: number;
    lastRezBand?: V1014RezTransmissionBand;
  };
}

export const V1014_REZ_BUSHFIRE_TURN_SCENARIOS: readonly Agent13RezBushfireTurnScenario[] = [
  {
    id: 'sc_rez_fire_nsw',
    label: 'NSW REZ backbone with escalating fire-season resilience',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        renewableShareScore: 48,
        gridFirmingRelief: 4,
        gridStressPoints: 20,
        climateHazardPressure: 16,
        completedProjectTypes: ['rez_transmission_backbone', 'fire_season_microgrid'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        renewableShareScore: 54,
        gridFirmingRelief: 5.5,
        gridStressPoints: 18,
        climateHazardPressure: 20,
        completedProjectTypes: ['rez_transmission_backbone', 'renewable_hub_switchyard', 'bushfire_line_hardening'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        renewableShareScore: 60,
        gridFirmingRelief: 6.5,
        gridStressPoints: 16,
        climateHazardPressure: 24,
        completedProjectTypes: [
          'rez_transmission_backbone',
          'renewable_hub_switchyard',
          'grid_wide_area_monitoring',
          'fire_season_microgrid',
          'bushfire_line_hardening',
          'rapid_grid_islanding',
        ],
      },
    ],
    expect: { minRezReliefOnLast: 3, minFireReliefOnLast: 2, lastRezBand: 'backbone_live' },
  },
] as const;

export function runAgent13RezBushfireTurnScenario(
  scenario: Agent13RezBushfireTurnScenario,
): { passed: boolean; detail: string; lastRezRelief: number; lastFireRelief: number } {
  let rezMem: V1014RezPersistedSlice | null = null;
  let fireMem: V1014BushfirePersistedSlice | null = null;
  let lastRezRelief = 0;
  let lastFireRelief = 0;
  let lastBand: V1014RezTransmissionBand = 'isolated';

  for (const step of scenario.steps) {
    const rez = computeRegionalRezTransmissionLedger({
      regionId: step.regionId,
      renewableShareScore: step.renewableShareScore,
      gridFirmingRelief: step.gridFirmingRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: rezMem,
    });
    rezMem = rez.next;
    lastRezRelief = rez.ledger.rezSpillRelief;
    lastBand = rez.ledger.band;

    const fire = advanceRegionalBushfireResilience({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      climateHazardPressure: step.climateHazardPressure,
      rezBand: rez.ledger.band,
      completedProjectTypes: step.completedProjectTypes,
      prev: fireMem,
    });
    fireMem = fire.next;
    lastFireRelief = fire.ledger.bushfireGridRelief;
  }

  if (scenario.expect.minRezReliefOnLast != null && lastRezRelief < scenario.expect.minRezReliefOnLast) {
    return {
      passed: false,
      detail: `rez relief ${lastRezRelief} < ${scenario.expect.minRezReliefOnLast}`,
      lastRezRelief,
      lastFireRelief,
    };
  }
  if (scenario.expect.minFireReliefOnLast != null && lastFireRelief < scenario.expect.minFireReliefOnLast) {
    return {
      passed: false,
      detail: `fire relief ${lastFireRelief} < ${scenario.expect.minFireReliefOnLast}`,
      lastRezRelief,
      lastFireRelief,
    };
  }
  if (scenario.expect.lastRezBand != null) {
    const allowed: V1014RezTransmissionBand[] = [scenario.expect.lastRezBand];
    if (scenario.expect.lastRezBand === 'backbone_live') allowed.push('rez_export_hub');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastRezRelief, lastFireRelief };
    }
  }

  return { passed: true, detail: 'ok', lastRezRelief, lastFireRelief };
}

export function scoreAgent13RezBushfireGIAlignment(params: {
  actionText: string;
  rezBand?: string;
  fireBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = ['rez', 'transmission', 'renewable zone', 'bushfire', 'fire season', 'microgrid', 'islanding', 'line hardening'].filter(
    k => text.includes(k),
  );
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.38, 0, 2);
  if (params.rezBand === 'rez_export_hub' || params.rezBand === 'backbone_live') {
    delta += hits.some(h => h.includes('rez') || h.includes('transmission') || h.includes('renewable')) ? 0.55 : 0.2;
  }
  if (params.fireBand === 'islanded_resilience' || params.fireBand === 'fire_season_ready') {
    delta += hits.some(h => h.includes('bushfire') || h.includes('fire') || h.includes('microgrid')) ? 0.48 : 0.16;
  }
  if (params.fireBand === 'vulnerable' && hits.some(h => h.includes('islanding'))) {
    delta -= 0.22;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `REZ/bushfire GI: ${hits.slice(0, 2).join(', ')} aligns with transmission corridors and fire-season resilience.`
        : null,
  };
}
