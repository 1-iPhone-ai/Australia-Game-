/**
 * Agent 13 scale wave round 24 — transmission congestion relief & merchant storage orchestration depth.
 * Cross-turn persistence for congestion market corridors and merchant battery relief coupled to REZ spill, embedded networks, and hydrogen export maturity.
 */

export type V1014TransmissionCongestionBand = 'unmanaged_congestion' | 'pilot_relief' | 'orchestrated_flow' | 'congestion_free_leader';

export type V1014MerchantStorageBand = 'merchant_absent' | 'pilot_merchant' | 'storage_market_hub' | 'deep_merchant_mesh';

export interface V1014TransmissionCongestionInstrument {
  id: string;
  kind: 'dynamic_line_rating' | 'congestion_market' | 'flow_gate_orchestration' | 'interconnect_merchant_loop';
  label: string;
  flowMwEq: number;
  congestionReliefFactor: number;
  merchantSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_TRANSMISSION_CONGESTION_CATALOG: readonly V1014TransmissionCongestionInstrument[] = [
  {
    id: 'tc_dlr',
    kind: 'dynamic_line_rating',
    label: 'Dynamic line rating corridor',
    flowMwEq: 44,
    congestionReliefFactor: 0.16,
    merchantSynergyFactor: 0.1,
    projectTypeHint: 'dynamic_line_rating_corridor',
  },
  {
    id: 'tc_market',
    kind: 'congestion_market',
    label: 'Congestion relief market layer',
    flowMwEq: 40,
    congestionReliefFactor: 0.14,
    merchantSynergyFactor: 0.11,
    projectTypeHint: 'congestion_relief_market_layer',
  },
  {
    id: 'tc_gate',
    kind: 'flow_gate_orchestration',
    label: 'Flow gate orchestration hub',
    flowMwEq: 46,
    congestionReliefFactor: 0.15,
    merchantSynergyFactor: 0.12,
    projectTypeHint: 'flow_gate_orchestration_hub',
  },
  {
    id: 'tc_interconnect',
    kind: 'interconnect_merchant_loop',
    label: 'Interconnect merchant flow loop',
    flowMwEq: 48,
    congestionReliefFactor: 0.17,
    merchantSynergyFactor: 0.13,
    projectTypeHint: 'interconnect_merchant_flow_loop',
  },
] as const;

export interface V1014MerchantStorageTemplate {
  id: string;
  kind: 'merchant_battery' | 'storage_arbitrage_pool' | 'firming_merchant_hub' | 'export_aligned_storage';
  label: string;
  storageMwEq: number;
  gridReliefFactor: number;
  congestionSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_MERCHANT_STORAGE_CATALOG: readonly V1014MerchantStorageTemplate[] = [
  {
    id: 'ms_battery',
    kind: 'merchant_battery',
    label: 'Merchant battery arbitrage fleet',
    storageMwEq: 42,
    gridReliefFactor: 0.15,
    congestionSynergyFactor: 0.1,
    projectTypeHint: 'merchant_battery_arbitrage_fleet',
  },
  {
    id: 'ms_pool',
    kind: 'storage_arbitrage_pool',
    label: 'Storage arbitrage merchant pool',
    storageMwEq: 46,
    gridReliefFactor: 0.16,
    congestionSynergyFactor: 0.11,
    projectTypeHint: 'storage_arbitrage_merchant_pool',
  },
  {
    id: 'ms_firming',
    kind: 'firming_merchant_hub',
    label: 'Firming merchant orchestration hub',
    storageMwEq: 44,
    gridReliefFactor: 0.14,
    congestionSynergyFactor: 0.12,
    projectTypeHint: 'firming_merchant_orchestration_hub',
  },
  {
    id: 'ms_export',
    kind: 'export_aligned_storage',
    label: 'Export-aligned merchant storage',
    storageMwEq: 50,
    gridReliefFactor: 0.17,
    congestionSynergyFactor: 0.13,
    projectTypeHint: 'export_aligned_merchant_storage',
  },
] as const;

export interface V1014RegionalTransmissionCongestionLedger {
  regionId: string;
  band: V1014TransmissionCongestionBand;
  congestionIndex: number;
  flowBalance: number;
  transmissionCongestionRelief: number;
  summary: string;
}

export interface V1014RegionalMerchantStorageLedger {
  regionId: string;
  band: V1014MerchantStorageBand;
  merchantIndex: number;
  merchantStorageRelief: number;
  summary: string;
}

export interface V1014TransmissionCongestionPersistedSlice {
  flowBalance: number;
  congestionIndex: number;
}

export interface V1014MerchantStoragePersistedSlice {
  merchantIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const CONGESTION_REGIONS = new Set(['QLD', 'NSW', 'SA', 'VIC', 'WA']);

export function computeRegionalTransmissionCongestionLedger(params: {
  regionId: string;
  rezSpillRelief: number;
  embeddedNetworkRelief: number;
  hydrogenGridRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014TransmissionCongestionPersistedSlice | null;
}): { ledger: V1014RegionalTransmissionCongestionLedger; next: V1014TransmissionCongestionPersistedSlice } {
  let flowGain = 0;
  let congestionProxy = 0;
  let merchantSynergy = 0;
  for (const inst of V1014_TRANSMISSION_CONGESTION_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      flowGain += inst.flowMwEq;
      congestionProxy += inst.congestionReliefFactor;
      merchantSynergy += inst.merchantSynergyFactor;
    }
  }
  if (CONGESTION_REGIONS.has(params.regionId)) congestionProxy += 0.05;
  else congestionProxy *= 0.73;
  if (params.rezSpillRelief > 2.8) {
    flowGain += clamp(params.rezSpillRelief * 1.04, 0, 12);
    congestionProxy += 0.06;
  }
  if (params.embeddedNetworkRelief > 2.3) merchantSynergy += clamp(params.embeddedNetworkRelief * 0.017, 0, 0.08);
  if (params.hydrogenGridRelief > 2.5) congestionProxy += clamp(params.hydrogenGridRelief * 0.013, 0, 0.06);
  congestionProxy += clamp(params.renewableShareScore / 112, 0, 0.09);

  const prevIdx = params.prev?.congestionIndex ?? 0;
  const prevBal = params.prev?.flowBalance ?? 0;
  const flowBalance = clamp(prevBal * 0.86 + flowGain * 0.1, 0, 220);
  const congestionIndex = clamp(prevIdx * 0.83 + flowBalance * 0.1 + congestionProxy * 76 + merchantSynergy * 22, 0, 152);

  let band: V1014TransmissionCongestionBand = 'unmanaged_congestion';
  if (congestionIndex >= 97 || flowGain >= 116) band = 'congestion_free_leader';
  else if (congestionIndex >= 59 || flowGain >= 66) band = 'orchestrated_flow';
  else if (congestionIndex >= 25 || flowGain >= 22) band = 'pilot_relief';

  let transmissionCongestionRelief = clamp(congestionProxy * 7.7 + flowGain * 0.038 + merchantSynergy * 4.6, 0, 9.9);
  if (band === 'unmanaged_congestion') transmissionCongestionRelief *= 0.3;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      congestionIndex: clamp(congestionIndex, 0, 152),
      flowBalance: clamp(flowBalance, 0, 220),
      transmissionCongestionRelief: clamp(transmissionCongestionRelief, 0, 9.9),
      summary: `${params.regionId} congestion ${band} · idx ${congestionIndex.toFixed(0)} · relief ${transmissionCongestionRelief.toFixed(1)}`,
    },
    next: { flowBalance: clamp(flowBalance, 0, 220), congestionIndex: clamp(congestionIndex, 0, 152) },
  };
}

export function advanceRegionalMerchantStorageOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  congestionBand: V1014TransmissionCongestionBand;
  gridFirmingRelief: number;
  completedProjectTypes: string[];
  prev?: V1014MerchantStoragePersistedSlice | null;
}): { ledger: V1014RegionalMerchantStorageLedger; next: V1014MerchantStoragePersistedSlice } {
  let storageGain = 0;
  let reliefProxy = 0;
  let congestionSynergy = 0;
  for (const tpl of V1014_MERCHANT_STORAGE_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      storageGain += tpl.storageMwEq;
      reliefProxy += tpl.gridReliefFactor;
      congestionSynergy += tpl.congestionSynergyFactor;
    }
  }
  if (params.congestionBand === 'orchestrated_flow' || params.congestionBand === 'congestion_free_leader') {
    storageGain += 13;
    congestionSynergy += 0.08;
  }
  if (params.gridFirmingRelief > 2.7) {
    storageGain += params.gridFirmingRelief * 0.84;
    reliefProxy += clamp(params.gridFirmingRelief * 0.009, 0, 0.05);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.25, 0, 9);
  const prevIdx = params.prev?.merchantIndex ?? 0;
  const merchantIndex = clamp(prevIdx * 0.84 + storageGain * 0.1 + reliefProxy * 28 - stressLoad * 0.029 + congestionSynergy * 23, 0, 156);

  let band: V1014MerchantStorageBand = 'merchant_absent';
  if (merchantIndex >= 102 || storageGain >= 120) band = 'deep_merchant_mesh';
  else if (merchantIndex >= 64 || storageGain >= 74) band = 'storage_market_hub';
  else if (merchantIndex >= 28 || storageGain >= 24) band = 'pilot_merchant';

  let merchantStorageRelief = clamp(merchantIndex / 20 + reliefProxy * 6.1 + congestionSynergy * 6.4, 0, 9.5);
  if (band === 'merchant_absent') merchantStorageRelief = clamp(merchantStorageRelief * 0.28, 0, 2.6);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      merchantIndex: clamp(merchantIndex, 0, 156),
      merchantStorageRelief: clamp(merchantStorageRelief, 0, 9.5),
      summary: `${params.regionId} merchant ${band} · idx ${merchantIndex.toFixed(0)} · relief ${merchantStorageRelief.toFixed(1)}`,
    },
    next: { merchantIndex: clamp(merchantIndex, 0, 156) },
  };
}

export const V1014_TRANSMISSION_MERCHANT_SCENARIOS = [
  {
    id: 'sc_tm_qld',
    label: 'QLD dynamic line rating with merchant battery fleet',
    regionId: 'QLD',
    rezSpillRelief: 3.2,
    embeddedNetworkRelief: 2.8,
    hydrogenGridRelief: 2.9,
    renewableShareScore: 56,
    gridStressPoints: 16,
    gridFirmingRelief: 3,
    completedProjectTypes: [
      'dynamic_line_rating_corridor',
      'interconnect_merchant_flow_loop',
      'merchant_battery_arbitrage_fleet',
      'storage_arbitrage_merchant_pool',
    ],
    expectCongestionBand: 'orchestrated_flow' as V1014TransmissionCongestionBand,
    expectMinCongestionRelief: 2,
    expectMerchantBand: 'storage_market_hub' as V1014MerchantStorageBand,
    expectMinMerchantRelief: 1.8,
  },
  {
    id: 'sc_tm_sa',
    label: 'SA flow gate with firming merchant hub',
    regionId: 'SA',
    rezSpillRelief: 2.7,
    embeddedNetworkRelief: 2.5,
    hydrogenGridRelief: 2.6,
    renewableShareScore: 50,
    gridStressPoints: 14,
    gridFirmingRelief: 2.5,
    congestionBand: 'pilot_relief' as V1014TransmissionCongestionBand,
    completedProjectTypes: ['flow_gate_orchestration_hub', 'firming_merchant_orchestration_hub', 'congestion_relief_market_layer'],
    expectMerchantBand: 'pilot_merchant' as V1014MerchantStorageBand,
    expectMinMerchantRelief: 1.5,
  },
] as const;

export function runAgent13TransmissionMerchantScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_TRANSMISSION_CONGESTION_CATALOG.length >= 4);
  ok(V1014_MERCHANT_STORAGE_CATALOG.length >= 4);

  const sc0 = V1014_TRANSMISSION_MERCHANT_SCENARIOS[0];
  const congestion = computeRegionalTransmissionCongestionLedger({
    regionId: sc0.regionId,
    rezSpillRelief: sc0.rezSpillRelief,
    embeddedNetworkRelief: sc0.embeddedNetworkRelief,
    hydrogenGridRelief: sc0.hydrogenGridRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    congestion.ledger.band === sc0.expectCongestionBand ||
      congestion.ledger.band === 'congestion_free_leader' ||
      congestion.ledger.transmissionCongestionRelief >= sc0.expectMinCongestionRelief,
  );

  const merchant = advanceRegionalMerchantStorageOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    congestionBand: congestion.ledger.band,
    gridFirmingRelief: sc0.gridFirmingRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    merchant.ledger.band === sc0.expectMerchantBand ||
      merchant.ledger.band === 'deep_merchant_mesh' ||
      merchant.ledger.merchantStorageRelief >= sc0.expectMinMerchantRelief,
  );

  const sc1 = V1014_TRANSMISSION_MERCHANT_SCENARIOS[1];
  const merchantS = advanceRegionalMerchantStorageOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    congestionBand: sc1.congestionBand,
    gridFirmingRelief: sc1.gridFirmingRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(merchantS.ledger.merchantStorageRelief >= sc1.expectMinMerchantRelief || merchantS.ledger.band !== 'merchant_absent');

  const persistA = computeRegionalTransmissionCongestionLedger({
    regionId: 'NSW',
    rezSpillRelief: 2.6,
    embeddedNetworkRelief: 2.4,
    hydrogenGridRelief: 2.3,
    renewableShareScore: 43,
    completedProjectTypes: ['dynamic_line_rating_corridor'],
    prev: null,
  });
  const persistB = computeRegionalTransmissionCongestionLedger({
    regionId: 'NSW',
    rezSpillRelief: 2.6,
    embeddedNetworkRelief: 2.4,
    hydrogenGridRelief: 2.3,
    renewableShareScore: 43,
    completedProjectTypes: ['dynamic_line_rating_corridor'],
    prev: persistA.next,
  });
  ok(persistB.next.congestionIndex >= persistA.next.congestionIndex * 0.72);

  const turnSc = runAgent13TransmissionMerchantTurnScenario(V1014_TRANSMISSION_MERCHANT_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastCongestionRelief >= 2);

  const gi = scoreAgent13TransmissionMerchantGIAlignment({
    actionText: 'Dynamic line rating with interconnect merchant flow and storage arbitrage pool',
    congestionBand: 'orchestrated_flow',
    merchantBand: 'storage_market_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13TransmissionMerchantTurnStep {
  turn: number;
  regionId: string;
  rezSpillRelief: number;
  embeddedNetworkRelief: number;
  hydrogenGridRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  gridFirmingRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13TransmissionMerchantTurnScenario {
  id: string;
  label: string;
  steps: Agent13TransmissionMerchantTurnStep[];
  expect: {
    minCongestionReliefOnLast?: number;
    minMerchantReliefOnLast?: number;
    lastCongestionBand?: V1014TransmissionCongestionBand;
  };
}

export const V1014_TRANSMISSION_MERCHANT_TURN_SCENARIOS: readonly Agent13TransmissionMerchantTurnScenario[] = [
  {
    id: 'sc_tm_qld_escalation',
    label: 'QLD congestion relief with deep merchant mesh',
    steps: [
      {
        turn: 1,
        regionId: 'QLD',
        rezSpillRelief: 2.5,
        embeddedNetworkRelief: 2.3,
        hydrogenGridRelief: 2.2,
        renewableShareScore: 45,
        gridStressPoints: 17,
        gridFirmingRelief: 2.4,
        completedProjectTypes: ['dynamic_line_rating_corridor', 'congestion_relief_market_layer'],
      },
      {
        turn: 2,
        regionId: 'QLD',
        rezSpillRelief: 2.9,
        embeddedNetworkRelief: 2.7,
        hydrogenGridRelief: 2.6,
        renewableShareScore: 50,
        gridStressPoints: 15,
        gridFirmingRelief: 2.8,
        completedProjectTypes: ['flow_gate_orchestration_hub', 'merchant_battery_arbitrage_fleet'],
      },
      {
        turn: 3,
        regionId: 'QLD',
        rezSpillRelief: 3.3,
        embeddedNetworkRelief: 3,
        hydrogenGridRelief: 3,
        renewableShareScore: 56,
        gridStressPoints: 13,
        gridFirmingRelief: 3.2,
        completedProjectTypes: [
          'dynamic_line_rating_corridor',
          'congestion_relief_market_layer',
          'flow_gate_orchestration_hub',
          'interconnect_merchant_flow_loop',
          'merchant_battery_arbitrage_fleet',
          'storage_arbitrage_merchant_pool',
          'firming_merchant_orchestration_hub',
          'export_aligned_merchant_storage',
        ],
      },
    ],
    expect: { minCongestionReliefOnLast: 2, minMerchantReliefOnLast: 1.8, lastCongestionBand: 'orchestrated_flow' },
  },
] as const;

export function runAgent13TransmissionMerchantTurnScenario(
  scenario: Agent13TransmissionMerchantTurnScenario,
): { passed: boolean; detail: string; lastCongestionRelief: number; lastMerchantRelief: number } {
  let congestionMem: V1014TransmissionCongestionPersistedSlice | null = null;
  let merchantMem: V1014MerchantStoragePersistedSlice | null = null;
  let lastCongestionRelief = 0;
  let lastMerchantRelief = 0;
  let lastBand: V1014TransmissionCongestionBand = 'unmanaged_congestion';

  for (const step of scenario.steps) {
    const congestion = computeRegionalTransmissionCongestionLedger({
      regionId: step.regionId,
      rezSpillRelief: step.rezSpillRelief,
      embeddedNetworkRelief: step.embeddedNetworkRelief,
      hydrogenGridRelief: step.hydrogenGridRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: congestionMem,
    });
    congestionMem = congestion.next;
    lastCongestionRelief = congestion.ledger.transmissionCongestionRelief;
    lastBand = congestion.ledger.band;

    const merchant = advanceRegionalMerchantStorageOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      congestionBand: congestion.ledger.band,
      gridFirmingRelief: step.gridFirmingRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: merchantMem,
    });
    merchantMem = merchant.next;
    lastMerchantRelief = merchant.ledger.merchantStorageRelief;
  }

  if (scenario.expect.minCongestionReliefOnLast != null && lastCongestionRelief < scenario.expect.minCongestionReliefOnLast) {
    return {
      passed: false,
      detail: `congestion relief ${lastCongestionRelief} < ${scenario.expect.minCongestionReliefOnLast}`,
      lastCongestionRelief,
      lastMerchantRelief,
    };
  }
  if (scenario.expect.minMerchantReliefOnLast != null && lastMerchantRelief < scenario.expect.minMerchantReliefOnLast) {
    return {
      passed: false,
      detail: `merchant relief ${lastMerchantRelief} < ${scenario.expect.minMerchantReliefOnLast}`,
      lastCongestionRelief,
      lastMerchantRelief,
    };
  }
  if (scenario.expect.lastCongestionBand != null) {
    const allowed: V1014TransmissionCongestionBand[] = [scenario.expect.lastCongestionBand];
    if (scenario.expect.lastCongestionBand === 'orchestrated_flow') allowed.push('congestion_free_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastCongestionRelief, lastMerchantRelief };
    }
  }

  return { passed: true, detail: 'ok', lastCongestionRelief, lastMerchantRelief };
}

export function scoreAgent13TransmissionMerchantGIAlignment(params: {
  actionText: string;
  congestionBand?: string;
  merchantBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'transmission congestion',
    'congestion relief',
    'dynamic line rating',
    'merchant storage',
    'storage arbitrage',
    'interconnect merchant',
    'flow gate',
    'merchant battery',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.25, 0, 2);
  if (params.congestionBand === 'congestion_free_leader' || params.congestionBand === 'orchestrated_flow') {
    delta += hits.some(h => h.includes('congestion') || h.includes('transmission') || h.includes('flow')) ? 0.39 : 0.1;
  }
  if (params.merchantBand === 'storage_market_hub' || params.merchantBand === 'deep_merchant_mesh') {
    delta += hits.some(h => h.includes('merchant') || h.includes('arbitrage') || h.includes('storage')) ? 0.34 : 0.09;
  }
  if (params.merchantBand === 'merchant_absent' && hits.some(h => h.includes('merchant'))) delta -= 0.11;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Transmission merchant GI: ${hits.slice(0, 2).join(', ')} aligns with congestion relief and merchant storage depth.`
        : null,
  };
}
