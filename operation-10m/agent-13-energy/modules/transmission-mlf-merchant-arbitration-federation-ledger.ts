/**
 * Agent 13 scale wave round 44 (O10-219) — compound transmission MLF & merchant storage arbitration federation orchestration depth.
 */

export type V1014TransmissionMlfBand =
  | 'static_loss_factors'
  | 'pilot_mlf_mesh'
  | 'mlf_arbitration_hub'
  | 'federated_transmission_mlf_leader';

export type V1014MerchantArbitrationFederationBand =
  | 'merchant_silo'
  | 'pilot_arbitration_fed'
  | 'arbitration_federation_hub'
  | 'deep_merchant_arbitration_mesh';

export interface V1014TransmissionMlfInstrument {
  id: string;
  kind: 'mlf_federation_hub' | 'dynamic_loss_factor_corridor' | 'congestion_price_mesh' | 'federation_mlf_tie';
  label: string;
  mlfScoreEq: number;
  mlfReliefFactor: number;
  arbitrationSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_TRANSMISSION_MLF_CATALOG: readonly V1014TransmissionMlfInstrument[] = [
  {
    id: 'mlf_hub',
    kind: 'mlf_federation_hub',
    label: 'Transmission MLF federation hub',
    mlfScoreEq: 47,
    mlfReliefFactor: 0.16,
    arbitrationSynergyFactor: 0.11,
    projectTypeHint: 'transmission_mlf_federation_hub',
  },
  {
    id: 'mlf_dyn',
    kind: 'dynamic_loss_factor_corridor',
    label: 'Dynamic loss-factor corridor',
    mlfScoreEq: 45,
    mlfReliefFactor: 0.15,
    arbitrationSynergyFactor: 0.12,
    projectTypeHint: 'dynamic_loss_factor_federation_corridor',
  },
  {
    id: 'mlf_cong',
    kind: 'congestion_price_mesh',
    label: 'Congestion-price federation mesh',
    mlfScoreEq: 49,
    mlfReliefFactor: 0.17,
    arbitrationSynergyFactor: 0.1,
    projectTypeHint: 'congestion_price_federation_mesh',
  },
  {
    id: 'mlf_fed',
    kind: 'federation_mlf_tie',
    label: 'Federation transmission MLF tie',
    mlfScoreEq: 51,
    mlfReliefFactor: 0.16,
    arbitrationSynergyFactor: 0.13,
    projectTypeHint: 'federation_transmission_mlf_tie',
  },
] as const;

export interface V1014MerchantArbitrationFederationTemplate {
  id: string;
  kind: 'merchant_storage_arbitration_hub' | 'rez_spill_arbitration_mesh' | 'cross_border_arbitration_stack' | 'trade_exposed_transmission_corridor';
  label: string;
  arbitrationScoreEq: number;
  arbitrationReliefFactor: number;
  mlfSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_MERCHANT_ARBITRATION_FEDERATION_CATALOG: readonly V1014MerchantArbitrationFederationTemplate[] = [
  {
    id: 'ma_storage',
    kind: 'merchant_storage_arbitration_hub',
    label: 'Merchant storage arbitration hub',
    arbitrationScoreEq: 46,
    arbitrationReliefFactor: 0.15,
    mlfSynergyFactor: 0.11,
    projectTypeHint: 'merchant_storage_arbitration_hub',
  },
  {
    id: 'ma_rez',
    kind: 'rez_spill_arbitration_mesh',
    label: 'REZ spill arbitration mesh',
    arbitrationScoreEq: 48,
    arbitrationReliefFactor: 0.16,
    mlfSynergyFactor: 0.12,
    projectTypeHint: 'rez_spill_arbitration_federation_mesh',
  },
  {
    id: 'ma_cross',
    kind: 'cross_border_arbitration_stack',
    label: 'Cross-border arbitration stacking layer',
    arbitrationScoreEq: 50,
    arbitrationReliefFactor: 0.17,
    mlfSynergyFactor: 0.1,
    projectTypeHint: 'cross_border_arbitration_federation_stack',
  },
  {
    id: 'ma_trade',
    kind: 'trade_exposed_transmission_corridor',
    label: 'Trade-exposed transmission corridor',
    arbitrationScoreEq: 44,
    arbitrationReliefFactor: 0.14,
    mlfSynergyFactor: 0.1,
    projectTypeHint: 'trade_exposed_transmission_federation_corridor',
  },
] as const;

export interface V1014RegionalTransmissionMlfLedger {
  regionId: string;
  band: V1014TransmissionMlfBand;
  mlfIndex: number;
  mlfBalance: number;
  transmissionMlfRelief: number;
  summary: string;
}

export interface V1014RegionalMerchantArbitrationFederationLedger {
  regionId: string;
  band: V1014MerchantArbitrationFederationBand;
  arbitrationIndex: number;
  merchantArbitrationFederationRelief: number;
  summary: string;
}

export interface V1014TransmissionMlfPersistedSlice {
  mlfBalance: number;
  mlfIndex: number;
}

export interface V1014MerchantArbitrationFederationPersistedSlice {
  arbitrationIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const MLF_HUB_REGIONS = new Set(['NSW', 'VIC', 'QLD', 'SA']);

export function computeRegionalTransmissionMlfLedger(params: {
  regionId: string;
  demandFlexFederationRelief: number;
  gridAiForecastRelief: number;
  transmissionCongestionRelief: number;
  merchantStorageRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014TransmissionMlfPersistedSlice | null;
}): { ledger: V1014RegionalTransmissionMlfLedger; next: V1014TransmissionMlfPersistedSlice } {
  let mlfGain = 0;
  let mlfProxy = 0;
  let arbitrationSynergy = 0;
  for (const inst of V1014_TRANSMISSION_MLF_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      mlfGain += inst.mlfScoreEq;
      mlfProxy += inst.mlfReliefFactor;
      arbitrationSynergy += inst.arbitrationSynergyFactor;
    }
  }
  if (MLF_HUB_REGIONS.has(params.regionId)) mlfProxy += 0.06;
  else mlfProxy *= 0.69;
  if (params.demandFlexFederationRelief > 2.3) mlfGain += clamp(params.demandFlexFederationRelief * 0.52, 0, 7);
  if (params.gridAiForecastRelief > 2.3) arbitrationSynergy += clamp(params.gridAiForecastRelief * 0.008, 0, 0.05);
  if (params.transmissionCongestionRelief > 2.4) {
    mlfGain += clamp(params.transmissionCongestionRelief * 0.64, 0, 8);
    mlfProxy += clamp(params.transmissionCongestionRelief * 0.007, 0, 0.04);
  }
  if (params.merchantStorageRelief > 2.3) arbitrationSynergy += clamp(params.merchantStorageRelief * 0.009, 0, 0.05);
  mlfProxy += clamp(params.renewableShareScore / 111, 0, 0.08);

  const prevIdx = params.prev?.mlfIndex ?? 0;
  const prevBal = params.prev?.mlfBalance ?? 0;
  const mlfBalance = clamp(prevBal * 0.81 + mlfGain * 0.1, 0, 256);
  const mlfIndex = clamp(prevIdx * 0.78 + mlfBalance * 0.09 + mlfProxy * 75 + arbitrationSynergy * 24, 0, 199);

  let band: V1014TransmissionMlfBand = 'static_loss_factors';
  if (mlfIndex >= 126 || mlfGain >= 146) band = 'federated_transmission_mlf_leader';
  else if (mlfIndex >= 86 || mlfGain >= 100) band = 'mlf_arbitration_hub';
  else if (mlfIndex >= 42 || mlfGain >= 40) band = 'pilot_mlf_mesh';

  let transmissionMlfRelief = clamp(mlfProxy * 7.8 + mlfGain * 0.026 + arbitrationSynergy * 4.8, 0, 10.2);
  if (band === 'static_loss_factors') transmissionMlfRelief *= 0.16;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      mlfIndex: clamp(mlfIndex, 0, 199),
      mlfBalance: clamp(mlfBalance, 0, 256),
      transmissionMlfRelief: clamp(transmissionMlfRelief, 0, 10.2),
      summary: `${params.regionId} MLF ${band} · idx ${mlfIndex.toFixed(0)} · relief ${transmissionMlfRelief.toFixed(1)}`,
    },
    next: {
      mlfBalance: clamp(mlfBalance, 0, 256),
      mlfIndex: clamp(mlfIndex, 0, 199),
    },
  };
}

export function advanceRegionalMerchantArbitrationFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  mlfBand: V1014TransmissionMlfBand;
  nationalDecarbonArbitrationRelief: number;
  rezSpillRelief: number;
  completedProjectTypes: string[];
  prev?: V1014MerchantArbitrationFederationPersistedSlice | null;
}): { ledger: V1014RegionalMerchantArbitrationFederationLedger; next: V1014MerchantArbitrationFederationPersistedSlice } {
  let arbitrationGain = 0;
  let arbitrationProxy = 0;
  let mlfSynergy = 0;
  for (const tpl of V1014_MERCHANT_ARBITRATION_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      arbitrationGain += tpl.arbitrationScoreEq;
      arbitrationProxy += tpl.arbitrationReliefFactor;
      mlfSynergy += tpl.mlfSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('merchant_interconnection_stacking_layer')) {
    arbitrationGain += 11;
    arbitrationProxy += 0.04;
  }
  if (params.mlfBand === 'mlf_arbitration_hub' || params.mlfBand === 'federated_transmission_mlf_leader') {
    arbitrationGain += 18;
    mlfSynergy += 0.12;
  }
  if (params.nationalDecarbonArbitrationRelief > 2.2) {
    arbitrationGain += params.nationalDecarbonArbitrationRelief * 0.56;
    arbitrationProxy += clamp(params.nationalDecarbonArbitrationRelief * 0.007, 0, 0.04);
  }
  if (params.rezSpillRelief > 2.1) mlfSynergy += clamp(params.rezSpillRelief * 0.008, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.14, 0, 6);
  const prevIdx = params.prev?.arbitrationIndex ?? 0;
  const arbitrationIndex = clamp(
    prevIdx * 0.77 + arbitrationGain * 0.1 + arbitrationProxy * 25 - stressLoad * 0.02 + mlfSynergy * 25,
    0,
    201,
  );

  let band: V1014MerchantArbitrationFederationBand = 'merchant_silo';
  if (arbitrationIndex >= 130 || arbitrationGain >= 154) band = 'deep_merchant_arbitration_mesh';
  else if (arbitrationIndex >= 90 || arbitrationGain >= 108) band = 'arbitration_federation_hub';
  else if (arbitrationIndex >= 44 || arbitrationGain >= 42) band = 'pilot_arbitration_fed';

  let merchantArbitrationFederationRelief = clamp(arbitrationIndex / 17.4 + arbitrationProxy * 6.2 + mlfSynergy * 6.6, 0, 10.3);
  if (band === 'merchant_silo') merchantArbitrationFederationRelief = clamp(merchantArbitrationFederationRelief * 0.14, 0, 1.5);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      arbitrationIndex: clamp(arbitrationIndex, 0, 201),
      merchantArbitrationFederationRelief: clamp(merchantArbitrationFederationRelief, 0, 10.3),
      summary: `${params.regionId} merchant arb ${band} · idx ${arbitrationIndex.toFixed(0)} · relief ${merchantArbitrationFederationRelief.toFixed(1)}`,
    },
    next: { arbitrationIndex: clamp(arbitrationIndex, 0, 201) },
  };
}

export function runAgent13MlfMerchantArbitrationScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_TRANSMISSION_MLF_CATALOG.length >= 4);
  ok(V1014_MERCHANT_ARBITRATION_FEDERATION_CATALOG.length >= 4);

  const mlf = computeRegionalTransmissionMlfLedger({
    regionId: 'NSW',
    demandFlexFederationRelief: 2.5,
    gridAiForecastRelief: 2.4,
    transmissionCongestionRelief: 2.6,
    merchantStorageRelief: 2.5,
    renewableShareScore: 54,
    completedProjectTypes: ['transmission_mlf_federation_hub', 'federation_transmission_mlf_tie'],
  });
  ok(mlf.ledger.transmissionMlfRelief >= 1.4 || mlf.ledger.band !== 'static_loss_factors');

  const arb = advanceRegionalMerchantArbitrationFederationOrchestration({
    regionId: 'NSW',
    gridStressPoints: 15,
    mlfBand: mlf.ledger.band,
    nationalDecarbonArbitrationRelief: 2.4,
    rezSpillRelief: 2.3,
    completedProjectTypes: ['merchant_storage_arbitration_hub', 'rez_spill_arbitration_federation_mesh'],
  });
  ok(arb.ledger.merchantArbitrationFederationRelief >= 1.2 || arb.ledger.band !== 'merchant_silo');

  const turnSc = runAgent13MlfMerchantArbitrationTurnScenario(V1014_MLF_MERCHANT_ARBITRATION_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13MlfMerchantArbitrationGIAlignment({
    actionText: 'Transmission MLF federation hub with merchant storage arbitration and REZ spill arbitration mesh',
    mlfBand: 'mlf_arbitration_hub',
    arbitrationBand: 'arbitration_federation_hub',
  });
  ok(gi.relevanceDelta > 0.85 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13MlfMerchantArbitrationTurnStep {
  turn: number;
  regionId: string;
  demandFlexFederationRelief: number;
  gridAiForecastRelief: number;
  transmissionCongestionRelief: number;
  merchantStorageRelief: number;
  nationalDecarbonArbitrationRelief: number;
  rezSpillRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13MlfMerchantArbitrationTurnScenario {
  id: string;
  label: string;
  steps: Agent13MlfMerchantArbitrationTurnStep[];
  expect: { minMlfReliefOnLast?: number; minArbitrationReliefOnLast?: number };
}

export const V1014_MLF_MERCHANT_ARBITRATION_TURN_SCENARIOS: readonly Agent13MlfMerchantArbitrationTurnScenario[] = [
  {
    id: 'sc_mm_nsw_escalation',
    label: 'NSW MLF mesh with merchant arbitration federation',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        demandFlexFederationRelief: 1.9,
        gridAiForecastRelief: 1.8,
        transmissionCongestionRelief: 2,
        merchantStorageRelief: 1.9,
        nationalDecarbonArbitrationRelief: 1.8,
        rezSpillRelief: 1.7,
        renewableShareScore: 43,
        gridStressPoints: 18,
        completedProjectTypes: ['transmission_mlf_federation_hub', 'merchant_storage_arbitration_hub'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        demandFlexFederationRelief: 2.2,
        gridAiForecastRelief: 2.1,
        transmissionCongestionRelief: 2.3,
        merchantStorageRelief: 2.2,
        nationalDecarbonArbitrationRelief: 2.1,
        rezSpillRelief: 2,
        renewableShareScore: 49,
        gridStressPoints: 17,
        completedProjectTypes: ['dynamic_loss_factor_federation_corridor', 'cross_border_arbitration_federation_stack'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        demandFlexFederationRelief: 2.6,
        gridAiForecastRelief: 2.5,
        transmissionCongestionRelief: 2.7,
        merchantStorageRelief: 2.6,
        nationalDecarbonArbitrationRelief: 2.5,
        rezSpillRelief: 2.4,
        renewableShareScore: 55,
        gridStressPoints: 15,
        completedProjectTypes: [
          'transmission_mlf_federation_hub',
          'dynamic_loss_factor_federation_corridor',
          'congestion_price_federation_mesh',
          'federation_transmission_mlf_tie',
          'merchant_storage_arbitration_hub',
          'rez_spill_arbitration_federation_mesh',
          'cross_border_arbitration_federation_stack',
          'trade_exposed_transmission_federation_corridor',
          'merchant_interconnection_stacking_layer',
        ],
      },
    ],
    expect: { minMlfReliefOnLast: 1.4, minArbitrationReliefOnLast: 1.1 },
  },
] as const;

export function runAgent13MlfMerchantArbitrationTurnScenario(
  scenario: Agent13MlfMerchantArbitrationTurnScenario,
): { passed: boolean; detail: string; lastMlfRelief: number; lastArbitrationRelief: number } {
  let mlfMem: V1014TransmissionMlfPersistedSlice | null = null;
  let arbMem: V1014MerchantArbitrationFederationPersistedSlice | null = null;
  let lastMlfRelief = 0;
  let lastArbitrationRelief = 0;

  for (const step of scenario.steps) {
    const mlf = computeRegionalTransmissionMlfLedger({
      regionId: step.regionId,
      demandFlexFederationRelief: step.demandFlexFederationRelief,
      gridAiForecastRelief: step.gridAiForecastRelief,
      transmissionCongestionRelief: step.transmissionCongestionRelief,
      merchantStorageRelief: step.merchantStorageRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: mlfMem,
    });
    mlfMem = mlf.next;
    lastMlfRelief = mlf.ledger.transmissionMlfRelief;

    const arb = advanceRegionalMerchantArbitrationFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      mlfBand: mlf.ledger.band,
      nationalDecarbonArbitrationRelief: step.nationalDecarbonArbitrationRelief,
      rezSpillRelief: step.rezSpillRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: arbMem,
    });
    arbMem = arb.next;
    lastArbitrationRelief = arb.ledger.merchantArbitrationFederationRelief;
  }

  if (scenario.expect.minMlfReliefOnLast != null && lastMlfRelief < scenario.expect.minMlfReliefOnLast) {
    return { passed: false, detail: `mlf ${lastMlfRelief}`, lastMlfRelief, lastArbitrationRelief };
  }
  if (scenario.expect.minArbitrationReliefOnLast != null && lastArbitrationRelief < scenario.expect.minArbitrationReliefOnLast) {
    return { passed: false, detail: `arb ${lastArbitrationRelief}`, lastMlfRelief, lastArbitrationRelief };
  }
  return { passed: true, detail: 'ok', lastMlfRelief, lastArbitrationRelief };
}

export function scoreAgent13MlfMerchantArbitrationGIAlignment(params: {
  actionText: string;
  mlfBand?: string;
  arbitrationBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'mlf',
    'loss factor',
    'transmission',
    'congestion',
    'merchant storage',
    'arbitration',
    'rez spill',
    'cross-border',
    'merchant interconnection',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.12, 0, 2);
  if (params.mlfBand === 'federated_transmission_mlf_leader' || params.mlfBand === 'mlf_arbitration_hub') {
    delta += hits.some(h => h.includes('mlf') || h.includes('transmission') || h.includes('loss')) ? 0.34 : 0.08;
  }
  if (params.arbitrationBand === 'arbitration_federation_hub' || params.arbitrationBand === 'deep_merchant_arbitration_mesh') {
    delta += hits.some(h => h.includes('arbitration') || h.includes('merchant') || h.includes('rez')) ? 0.32 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `MLF merchant GI: ${hits.slice(0, 2).join(', ')} aligns with transmission MLF and merchant arbitration federation depth.`
        : null,
  };
}
