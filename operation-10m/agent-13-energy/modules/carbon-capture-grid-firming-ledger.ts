/**
 * Agent 13 scale wave round 8 — carbon capture hubs & long-duration grid firming.
 * Cross-turn persistence for CCS build-out momentum and pumped-hydro / thermal firming relief.
 */

export type V1014CcsHubBand = 'idle' | 'pilot_injection' | 'hub_operational' | 'net_negative_cluster';

export type V1014GridFirmingBand = 'unfirm' | 'buffering' | 'duration_ready' | 'deep_firming';

export interface V1014CcsHubInstrument {
  id: string;
  kind: 'post_combustion' | 'direct_air' | 'industrial_cluster' | 'co2_pipeline_hub';
  label: string;
  captureTonnesEqPerTurn: number;
  emissionsReliefFactor: number;
  firmingSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_CCS_HUB_CATALOG: readonly V1014CcsHubInstrument[] = [
  {
    id: 'ccs_post_combust',
    kind: 'post_combustion',
    label: 'Post-combustion capture train',
    captureTonnesEqPerTurn: 42,
    emissionsReliefFactor: 0.19,
    firmingSynergyFactor: 0.08,
    projectTypeHint: 'ccs_post_combustion',
  },
  {
    id: 'ccs_dac',
    kind: 'direct_air',
    label: 'Direct air capture hub',
    captureTonnesEqPerTurn: 28,
    emissionsReliefFactor: 0.24,
    firmingSynergyFactor: 0.06,
    projectTypeHint: 'direct_air_capture',
  },
  {
    id: 'ccs_industrial',
    kind: 'industrial_cluster',
    label: 'Industrial CCS cluster',
    captureTonnesEqPerTurn: 55,
    emissionsReliefFactor: 0.16,
    firmingSynergyFactor: 0.11,
    projectTypeHint: 'industrial_ccs_cluster',
  },
  {
    id: 'ccs_pipeline',
    kind: 'co2_pipeline_hub',
    label: 'CO₂ transport & storage hub',
    captureTonnesEqPerTurn: 36,
    emissionsReliefFactor: 0.14,
    firmingSynergyFactor: 0.13,
    projectTypeHint: 'co2_storage_hub',
  },
] as const;

export interface V1014GridFirmingTemplate {
  id: string;
  kind: 'pumped_hydro' | 'thermal_storage' | 'long_duration_battery' | 'synchronous_condenser';
  label: string;
  firmMwEq: number;
  gridReliefFactor: number;
  ccsSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_GRID_FIRMING_CATALOG: readonly V1014GridFirmingTemplate[] = [
  {
    id: 'firm_pumped',
    kind: 'pumped_hydro',
    label: 'Pumped hydro expansion',
    firmMwEq: 64,
    gridReliefFactor: 0.2,
    ccsSynergyFactor: 0.07,
    projectTypeHint: 'pumped_hydro',
  },
  {
    id: 'firm_thermal',
    kind: 'thermal_storage',
    label: 'Molten-salt thermal storage',
    firmMwEq: 38,
    gridReliefFactor: 0.15,
    ccsSynergyFactor: 0.09,
    projectTypeHint: 'thermal_energy_storage',
  },
  {
    id: 'firm_ldes',
    kind: 'long_duration_battery',
    label: 'Long-duration battery bank',
    firmMwEq: 48,
    gridReliefFactor: 0.17,
    ccsSynergyFactor: 0.05,
    projectTypeHint: 'long_duration_battery',
  },
  {
    id: 'firm_sync',
    kind: 'synchronous_condenser',
    label: 'Grid-forming synchronous condenser',
    firmMwEq: 22,
    gridReliefFactor: 0.12,
    ccsSynergyFactor: 0.04,
    projectTypeHint: 'synchronous_condenser',
  },
] as const;

export interface V1014RegionalCcsHubLedger {
  regionId: string;
  band: V1014CcsHubBand;
  captureIndex: number;
  injectionBalance: number;
  ccsEmissionsRelief: number;
  summary: string;
}

export interface V1014RegionalGridFirmingLedger {
  regionId: string;
  band: V1014GridFirmingBand;
  firmingIndex: number;
  gridFirmingRelief: number;
  summary: string;
}

export interface V1014CcsPersistedSlice {
  injectionBalance: number;
  captureIndex: number;
}

export interface V1014FirmingPersistedSlice {
  firmingIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

export function computeRegionalCcsHubLedger(params: {
  regionId: string;
  extractionScore: number;
  emissionsPressureRelief: number;
  netEmissionsIndex: number;
  demandFlexRelief: number;
  completedProjectTypes: string[];
  prev?: V1014CcsPersistedSlice | null;
}): { ledger: V1014RegionalCcsHubLedger; next: V1014CcsPersistedSlice } {
  let captureGain = 0;
  let reliefProxy = 0;
  let firmingSynergy = 0;
  for (const inst of V1014_CCS_HUB_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      captureGain += inst.captureTonnesEqPerTurn;
      reliefProxy += inst.emissionsReliefFactor;
      firmingSynergy += inst.firmingSynergyFactor;
    }
  }
  reliefProxy += clamp(params.emissionsPressureRelief / 18, 0, 0.1);
  if (params.netEmissionsIndex > 70) reliefProxy += 0.04;

  const prevIdx = params.prev?.captureIndex ?? 0;
  const prevInj = params.prev?.injectionBalance ?? 0;
  const injectionBalance = clamp(prevInj * 0.89 + captureGain * 0.12, 0, 240);
  const captureIndex = clamp(prevIdx * 0.85 + injectionBalance * 0.13 + reliefProxy * 85, 0, 160);

  let band: V1014CcsHubBand = 'idle';
  if (captureIndex >= 98 || captureGain >= 110) band = 'net_negative_cluster';
  else if (captureIndex >= 64 || captureGain >= 65) band = 'hub_operational';
  else if (captureIndex >= 26 || captureGain >= 22) band = 'pilot_injection';

  let ccsEmissionsRelief = clamp(reliefProxy * 12 + captureGain * 0.06 + firmingSynergy * 4, 0, 15);
  if (params.demandFlexRelief > 4) ccsEmissionsRelief += clamp(params.demandFlexRelief * 0.12, 0, 1.8);
  if (params.extractionScore > 65 && band === 'idle') ccsEmissionsRelief *= 0.45;
  if (band === 'net_negative_cluster') ccsEmissionsRelief += 2;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      captureIndex: clamp(captureIndex, 0, 160),
      injectionBalance: clamp(injectionBalance, 0, 240),
      ccsEmissionsRelief: clamp(ccsEmissionsRelief, 0, 17),
      summary: `${params.regionId} CCS ${band} · capture idx ${captureIndex.toFixed(0)} · relief ${ccsEmissionsRelief.toFixed(1)}`,
    },
    next: { injectionBalance, captureIndex: clamp(captureIndex, 0, 160) },
  };
}

export function advanceRegionalGridFirming(params: {
  regionId: string;
  gridStressPoints: number;
  renewableShareScore: number;
  ccsBand: V1014CcsHubBand;
  offshoreRenewableRelief: number;
  completedProjectTypes: string[];
  prev?: V1014FirmingPersistedSlice | null;
}): { ledger: V1014RegionalGridFirmingLedger; next: V1014FirmingPersistedSlice } {
  let firmGain = 0;
  let reliefProxy = 0;
  let ccsSynergy = 0;
  for (const tpl of V1014_GRID_FIRMING_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      firmGain += tpl.firmMwEq;
      reliefProxy += tpl.gridReliefFactor;
      ccsSynergy += tpl.ccsSynergyFactor;
    }
  }
  if (params.ccsBand === 'hub_operational' || params.ccsBand === 'net_negative_cluster') {
    firmGain += 14;
    ccsSynergy += 0.06;
  }
  if (params.offshoreRenewableRelief > 5) {
    firmGain += params.offshoreRenewableRelief * 1.5;
    reliefProxy += 0.04;
  }
  firmGain += clamp(params.renewableShareScore / 14, 0, 12);

  const stressLoad = clamp(params.gridStressPoints * 0.5, 0, 20);
  const prevIdx = params.prev?.firmingIndex ?? 0;
  const firmingIndex = clamp(prevIdx * 0.87 + firmGain * 0.11 + reliefProxy * 38 - stressLoad * 0.06 + ccsSynergy * 22, 0, 150);

  let band: V1014GridFirmingBand = 'unfirm';
  if (firmingIndex >= 92 || firmGain >= 120) band = 'deep_firming';
  else if (firmingIndex >= 58 || firmGain >= 70) band = 'duration_ready';
  else if (firmingIndex >= 24 || firmGain >= 22) band = 'buffering';

  const gridFirmingRelief = clamp(firmingIndex / 20 + reliefProxy * 9 + ccsSynergy * 8, 0, 14);
  if (band === 'unfirm') {
    return {
      ledger: {
        regionId: params.regionId,
        band,
        firmingIndex: clamp(firmingIndex, 0, 150),
        gridFirmingRelief: clamp(gridFirmingRelief * 0.35, 0, 4),
        summary: `${params.regionId} grid firming unfirm · idx ${firmingIndex.toFixed(0)}`,
      },
      next: { firmingIndex: clamp(firmingIndex, 0, 150) },
    };
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      firmingIndex: clamp(firmingIndex, 0, 150),
      gridFirmingRelief: clamp(gridFirmingRelief, 0, 14),
      summary: `${params.regionId} firming ${band} · idx ${firmingIndex.toFixed(0)} · relief ${gridFirmingRelief.toFixed(1)}`,
    },
    next: { firmingIndex: clamp(firmingIndex, 0, 150) },
  };
}

export const V1014_CCS_FIRMING_SCENARIOS = [
  {
    id: 'sc_ccs_sa',
    label: 'SA industrial CCS with pumped hydro firming',
    regionId: 'SA',
    extractionScore: 38,
    emissionsPressureRelief: 6,
    netEmissionsIndex: 48,
    demandFlexRelief: 5,
    renewableShareScore: 62,
    gridStressPoints: 16,
    offshoreRenewableRelief: 4,
    completedProjectTypes: ['industrial_ccs_cluster', 'co2_storage_hub', 'pumped_hydro', 'long_duration_battery'],
    expectCcsBand: 'hub_operational' as V1014CcsHubBand,
    expectMinCcsRelief: 4,
    expectFirmBand: 'duration_ready' as V1014GridFirmingBand,
    expectMinFirmRelief: 3,
  },
  {
    id: 'sc_firm_qld',
    label: 'QLD thermal storage with direct air capture',
    regionId: 'QLD',
    extractionScore: 52,
    emissionsPressureRelief: 4,
    netEmissionsIndex: 58,
    demandFlexRelief: 3,
    renewableShareScore: 44,
    gridStressPoints: 22,
    offshoreRenewableRelief: 3,
    ccsBand: 'pilot_injection' as V1014CcsHubBand,
    completedProjectTypes: ['direct_air_capture', 'thermal_energy_storage', 'synchronous_condenser'],
    expectFirmBand: 'buffering' as V1014GridFirmingBand,
    expectMinFirmRelief: 2,
  },
] as const;

export function runAgent13CcsFirmingScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_CCS_HUB_CATALOG.length >= 4);
  ok(V1014_GRID_FIRMING_CATALOG.length >= 4);

  const sc0 = V1014_CCS_FIRMING_SCENARIOS[0];
  const ccs = computeRegionalCcsHubLedger({
    regionId: sc0.regionId,
    extractionScore: sc0.extractionScore,
    emissionsPressureRelief: sc0.emissionsPressureRelief,
    netEmissionsIndex: sc0.netEmissionsIndex,
    demandFlexRelief: sc0.demandFlexRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    ccs.ledger.band === sc0.expectCcsBand ||
      ccs.ledger.band === 'net_negative_cluster' ||
      ccs.ledger.ccsEmissionsRelief >= sc0.expectMinCcsRelief,
  );

  const firm = advanceRegionalGridFirming({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    renewableShareScore: sc0.renewableShareScore,
    ccsBand: ccs.ledger.band,
    offshoreRenewableRelief: sc0.offshoreRenewableRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    firm.ledger.band === sc0.expectFirmBand ||
      firm.ledger.band === 'deep_firming' ||
      firm.ledger.gridFirmingRelief >= sc0.expectMinFirmRelief,
  );

  const sc1 = V1014_CCS_FIRMING_SCENARIOS[1];
  const ccsQ = computeRegionalCcsHubLedger({
    regionId: sc1.regionId,
    extractionScore: sc1.extractionScore,
    emissionsPressureRelief: sc1.emissionsPressureRelief,
    netEmissionsIndex: sc1.netEmissionsIndex,
    demandFlexRelief: sc1.demandFlexRelief,
    completedProjectTypes: ['direct_air_capture'],
    prev: null,
  });
  const firmQ = advanceRegionalGridFirming({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    renewableShareScore: sc1.renewableShareScore,
    ccsBand: sc1.ccsBand,
    offshoreRenewableRelief: sc1.offshoreRenewableRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(firmQ.ledger.gridFirmingRelief >= sc1.expectMinFirmRelief || firmQ.ledger.band !== 'unfirm');

  const persistA = advanceRegionalGridFirming({
    regionId: 'NSW',
    gridStressPoints: 18,
    renewableShareScore: 50,
    ccsBand: 'hub_operational',
    offshoreRenewableRelief: 6,
    completedProjectTypes: ['pumped_hydro'],
    prev: null,
  });
  const persistB = advanceRegionalGridFirming({
    regionId: 'NSW',
    gridStressPoints: 18,
    renewableShareScore: 50,
    ccsBand: 'hub_operational',
    offshoreRenewableRelief: 6,
    completedProjectTypes: ['pumped_hydro'],
    prev: persistA.next,
  });
  ok(persistB.next.firmingIndex >= persistA.next.firmingIndex * 0.82);

  const turnSc = runAgent13CcsFirmingTurnScenario(V1014_CCS_FIRMING_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastCcsRelief >= 4);

  const gi = scoreAgent13CcsFirmingGIAlignment({
    actionText: 'Industrial CCS cluster and pumped hydro firming expansion',
    ccsBand: 'hub_operational',
    firmingBand: 'duration_ready',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13CcsFirmingTurnStep {
  turn: number;
  regionId: string;
  extractionScore: number;
  emissionsPressureRelief: number;
  netEmissionsIndex: number;
  demandFlexRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  offshoreRenewableRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13CcsFirmingTurnScenario {
  id: string;
  label: string;
  steps: Agent13CcsFirmingTurnStep[];
  expect: {
    minCcsReliefOnLast?: number;
    minFirmReliefOnLast?: number;
    lastCcsBand?: V1014CcsHubBand;
  };
}

export const V1014_CCS_FIRMING_TURN_SCENARIOS: readonly Agent13CcsFirmingTurnScenario[] = [
  {
    id: 'sc_ccs_firm_sa',
    label: 'SA CCS hub with pumped hydro firming across turns',
    steps: [
      {
        turn: 1,
        regionId: 'SA',
        extractionScore: 42,
        emissionsPressureRelief: 5,
        netEmissionsIndex: 62,
        demandFlexRelief: 3,
        renewableShareScore: 52,
        gridStressPoints: 18,
        offshoreRenewableRelief: 3,
        completedProjectTypes: ['industrial_ccs_cluster', 'pumped_hydro'],
      },
      {
        turn: 2,
        regionId: 'SA',
        extractionScore: 40,
        emissionsPressureRelief: 6.5,
        netEmissionsIndex: 52,
        demandFlexRelief: 4.5,
        renewableShareScore: 58,
        gridStressPoints: 16,
        offshoreRenewableRelief: 4.5,
        completedProjectTypes: ['industrial_ccs_cluster', 'co2_storage_hub', 'pumped_hydro'],
      },
      {
        turn: 3,
        regionId: 'SA',
        extractionScore: 38,
        emissionsPressureRelief: 7,
        netEmissionsIndex: 44,
        demandFlexRelief: 5.5,
        renewableShareScore: 64,
        gridStressPoints: 14,
        offshoreRenewableRelief: 5,
        completedProjectTypes: [
          'industrial_ccs_cluster',
          'co2_storage_hub',
          'pumped_hydro',
          'long_duration_battery',
          'direct_air_capture',
        ],
      },
    ],
    expect: { minCcsReliefOnLast: 4, minFirmReliefOnLast: 3, lastCcsBand: 'hub_operational' },
  },
] as const;

export function runAgent13CcsFirmingTurnScenario(
  scenario: Agent13CcsFirmingTurnScenario,
): { passed: boolean; detail: string; lastCcsRelief: number; lastFirmRelief: number } {
  let ccsMem: V1014CcsPersistedSlice | null = null;
  let firmMem: V1014FirmingPersistedSlice | null = null;
  let lastCcsRelief = 0;
  let lastFirmRelief = 0;
  let lastBand: V1014CcsHubBand = 'idle';

  for (const step of scenario.steps) {
    const ccs = computeRegionalCcsHubLedger({
      regionId: step.regionId,
      extractionScore: step.extractionScore,
      emissionsPressureRelief: step.emissionsPressureRelief,
      netEmissionsIndex: step.netEmissionsIndex,
      demandFlexRelief: step.demandFlexRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: ccsMem,
    });
    ccsMem = ccs.next;
    lastCcsRelief = ccs.ledger.ccsEmissionsRelief;
    lastBand = ccs.ledger.band;

    const firm = advanceRegionalGridFirming({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      renewableShareScore: step.renewableShareScore,
      ccsBand: ccs.ledger.band,
      offshoreRenewableRelief: step.offshoreRenewableRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: firmMem,
    });
    firmMem = firm.next;
    lastFirmRelief = firm.ledger.gridFirmingRelief;
  }

  if (scenario.expect.minCcsReliefOnLast != null && lastCcsRelief < scenario.expect.minCcsReliefOnLast) {
    return {
      passed: false,
      detail: `ccs relief ${lastCcsRelief} < ${scenario.expect.minCcsReliefOnLast}`,
      lastCcsRelief,
      lastFirmRelief,
    };
  }
  if (scenario.expect.minFirmReliefOnLast != null && lastFirmRelief < scenario.expect.minFirmReliefOnLast) {
    return {
      passed: false,
      detail: `firm relief ${lastFirmRelief} < ${scenario.expect.minFirmReliefOnLast}`,
      lastCcsRelief,
      lastFirmRelief,
    };
  }
  if (scenario.expect.lastCcsBand != null) {
    const allowed: V1014CcsHubBand[] = [scenario.expect.lastCcsBand];
    if (scenario.expect.lastCcsBand === 'hub_operational') allowed.push('net_negative_cluster');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastCcsRelief, lastFirmRelief };
    }
  }

  return { passed: true, detail: 'ok', lastCcsRelief, lastFirmRelief };
}

export function scoreAgent13CcsFirmingGIAlignment(params: {
  actionText: string;
  ccsBand?: string;
  firmingBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = ['carbon capture', 'ccs', 'co2', 'pumped hydro', 'firming', 'storage hub', 'direct air'].filter(k =>
    text.includes(k),
  );
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.4, 0, 2);
  if (params.ccsBand === 'net_negative_cluster' || params.ccsBand === 'hub_operational') {
    delta += hits.some(h => h.includes('ccs') || h.includes('carbon') || h.includes('co2')) ? 0.6 : 0.22;
  }
  if (params.firmingBand === 'deep_firming' || params.firmingBand === 'duration_ready') {
    delta += hits.some(h => h.includes('pumped') || h.includes('firming') || h.includes('storage')) ? 0.5 : 0.18;
  }
  if (params.firmingBand === 'unfirm' && hits.some(h => h.includes('pumped'))) {
    delta -= 0.25;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `CCS/firming GI: ${hits.slice(0, 2).join(', ')} aligns with capture hubs and duration storage.`
        : null,
  };
}
