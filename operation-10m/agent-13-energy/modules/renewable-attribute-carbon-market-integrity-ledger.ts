/**
 * Agent 13 scale wave round 35 (O10-201) — compound renewable attribute traceability & carbon market integrity federation orchestration depth.
 * Cross-turn persistence for renewable attribute corridors and carbon market integrity mesh coupled to climate disclosure,
 * green product passport, scope-3 supply chain, and net-zero pathway across the scale-wave stack.
 */

export type V1014RenewableAttributeBand =
  | 'untracked_generation'
  | 'pilot_attribute_trace'
  | 'attribute_corridor'
  | 'federated_renewable_attribute_leader';

export type V1014CarbonMarketIntegrityBand =
  | 'fragmented_markets'
  | 'pilot_integrity'
  | 'integrity_hub'
  | 'deep_carbon_market_mesh';

export interface V1014RenewableAttributeInstrument {
  id: string;
  kind: 'granular_certificate_hub' | 'time_matched_attribute_corridor' | 'export_renewable_trace_mesh' | 'federation_attribute_tie';
  label: string;
  attributeScoreEq: number;
  attributeReliefFactor: number;
  integritySynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_RENEWABLE_ATTRIBUTE_CATALOG: readonly V1014RenewableAttributeInstrument[] = [
  {
    id: 'ra_granular',
    kind: 'granular_certificate_hub',
    label: 'Granular renewable certificate hub',
    attributeScoreEq: 45,
    attributeReliefFactor: 0.16,
    integritySynergyFactor: 0.11,
    projectTypeHint: 'granular_renewable_certificate_hub',
  },
  {
    id: 'ra_time',
    kind: 'time_matched_attribute_corridor',
    label: 'Time-matched renewable attribute corridor',
    attributeScoreEq: 47,
    attributeReliefFactor: 0.17,
    integritySynergyFactor: 0.1,
    projectTypeHint: 'time_matched_renewable_attribute_corridor',
  },
  {
    id: 'ra_export',
    kind: 'export_renewable_trace_mesh',
    label: 'Export renewable traceability mesh',
    attributeScoreEq: 44,
    attributeReliefFactor: 0.15,
    integritySynergyFactor: 0.12,
    projectTypeHint: 'export_renewable_traceability_mesh',
  },
  {
    id: 'ra_fed',
    kind: 'federation_attribute_tie',
    label: 'Federation renewable attribute tie',
    attributeScoreEq: 49,
    attributeReliefFactor: 0.16,
    integritySynergyFactor: 0.13,
    projectTypeHint: 'federation_renewable_attribute_tie',
  },
] as const;

export interface V1014CarbonMarketIntegrityTemplate {
  id: string;
  kind: 'safeguard_credit_integrity_hub' | 'offset_quality_assurance_mesh' | 'interoperable_registry_corridor' | 'trade_exposed_credit_stack';
  label: string;
  integrityScoreEq: number;
  marketReliefFactor: number;
  attributeSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_CARBON_MARKET_INTEGRITY_CATALOG: readonly V1014CarbonMarketIntegrityTemplate[] = [
  {
    id: 'cmi_safeguard',
    kind: 'safeguard_credit_integrity_hub',
    label: 'Safeguard credit integrity hub',
    integrityScoreEq: 46,
    marketReliefFactor: 0.15,
    attributeSynergyFactor: 0.1,
    projectTypeHint: 'safeguard_credit_integrity_hub',
  },
  {
    id: 'cmi_offset',
    kind: 'offset_quality_assurance_mesh',
    label: 'Offset quality assurance mesh',
    integrityScoreEq: 48,
    marketReliefFactor: 0.16,
    attributeSynergyFactor: 0.11,
    projectTypeHint: 'offset_quality_assurance_mesh',
  },
  {
    id: 'cmi_registry',
    kind: 'interoperable_registry_corridor',
    label: 'Interoperable carbon registry corridor',
    integrityScoreEq: 43,
    marketReliefFactor: 0.14,
    attributeSynergyFactor: 0.12,
    projectTypeHint: 'interoperable_carbon_registry_corridor',
  },
  {
    id: 'cmi_trade',
    kind: 'trade_exposed_credit_stack',
    label: 'Trade-exposed credit stacking layer',
    integrityScoreEq: 50,
    marketReliefFactor: 0.17,
    attributeSynergyFactor: 0.13,
    projectTypeHint: 'trade_exposed_carbon_credit_stack',
  },
] as const;

export interface V1014RegionalRenewableAttributeLedger {
  regionId: string;
  band: V1014RenewableAttributeBand;
  attributeIndex: number;
  attributeBalance: number;
  renewableAttributeRelief: number;
  summary: string;
}

export interface V1014RegionalCarbonMarketIntegrityLedger {
  regionId: string;
  band: V1014CarbonMarketIntegrityBand;
  integrityIndex: number;
  carbonMarketIntegrityRelief: number;
  summary: string;
}

export interface V1014RenewableAttributePersistedSlice {
  attributeBalance: number;
  attributeIndex: number;
}

export interface V1014CarbonMarketIntegrityPersistedSlice {
  integrityIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const ATTRIBUTE_HUB_REGIONS = new Set(['NSW', 'QLD', 'VIC', 'WA', 'SA']);

export function computeRegionalRenewableAttributeLedger(params: {
  regionId: string;
  climateDisclosureRelief: number;
  greenProductPassportRelief: number;
  disclosureBand: string;
  passportBand: string;
  scope3SupplyChainRelief: number;
  netZeroPathwayRelief: number;
  exportCarbonIntensityRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014RenewableAttributePersistedSlice | null;
}): { ledger: V1014RegionalRenewableAttributeLedger; next: V1014RenewableAttributePersistedSlice } {
  let attributeGain = 0;
  let attributeProxy = 0;
  let integritySynergy = 0;
  for (const inst of V1014_RENEWABLE_ATTRIBUTE_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      attributeGain += inst.attributeScoreEq;
      attributeProxy += inst.attributeReliefFactor;
      integritySynergy += inst.integritySynergyFactor;
    }
  }
  if (ATTRIBUTE_HUB_REGIONS.has(params.regionId)) attributeProxy += 0.06;
  else attributeProxy *= 0.72;
  if (params.climateDisclosureRelief > 2.6) {
    attributeGain += clamp(params.climateDisclosureRelief * 0.74, 0, 10);
    attributeProxy += 0.06;
  }
  if (params.greenProductPassportRelief > 2.5) integritySynergy += clamp(params.greenProductPassportRelief * 0.01, 0, 0.06);
  if (params.disclosureBand === 'assurance_corridor' || params.disclosureBand === 'federated_disclosure_leader') {
    attributeGain += 14;
    attributeProxy += 0.05;
  }
  if (params.passportBand === 'passport_hub' || params.passportBand === 'circular_passport_mesh') {
    integritySynergy += 0.09;
  }
  if (params.scope3SupplyChainRelief > 2.5) attributeProxy += clamp(params.scope3SupplyChainRelief * 0.008, 0, 0.05);
  if (params.netZeroPathwayRelief > 2.7) attributeGain += clamp(params.netZeroPathwayRelief * 0.65, 0, 8);
  if (params.exportCarbonIntensityRelief > 2.6) integritySynergy += clamp(params.exportCarbonIntensityRelief * 0.009, 0, 0.05);
  attributeProxy += clamp(params.renewableShareScore / 105, 0, 0.1);

  const prevIdx = params.prev?.attributeIndex ?? 0;
  const prevBal = params.prev?.attributeBalance ?? 0;
  const attributeBalance = clamp(prevBal * 0.84 + attributeGain * 0.1, 0, 242);
  const attributeIndex = clamp(
    prevIdx * 0.81 + attributeBalance * 0.09 + attributeProxy * 78 + integritySynergy * 25,
    0,
    187,
  );

  let band: V1014RenewableAttributeBand = 'untracked_generation';
  if (attributeIndex >= 117 || attributeGain >= 132) band = 'federated_renewable_attribute_leader';
  else if (attributeIndex >= 77 || attributeGain >= 86) band = 'attribute_corridor';
  else if (attributeIndex >= 34 || attributeGain >= 32) band = 'pilot_attribute_trace';

  let renewableAttributeRelief = clamp(attributeProxy * 8 + attributeGain * 0.029 + integritySynergy * 4.8, 0, 10.2);
  if (band === 'untracked_generation') renewableAttributeRelief *= 0.23;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      attributeIndex: clamp(attributeIndex, 0, 187),
      attributeBalance: clamp(attributeBalance, 0, 242),
      renewableAttributeRelief: clamp(renewableAttributeRelief, 0, 10.2),
      summary: `${params.regionId} renewable attr ${band} · idx ${attributeIndex.toFixed(0)} · relief ${renewableAttributeRelief.toFixed(1)}`,
    },
    next: {
      attributeBalance: clamp(attributeBalance, 0, 242),
      attributeIndex: clamp(attributeIndex, 0, 187),
    },
  };
}

export function advanceRegionalCarbonMarketIntegrityOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  attributeBand: V1014RenewableAttributeBand;
  emissionsCreditRelief: number;
  completedProjectTypes: string[];
  prev?: V1014CarbonMarketIntegrityPersistedSlice | null;
}): { ledger: V1014RegionalCarbonMarketIntegrityLedger; next: V1014CarbonMarketIntegrityPersistedSlice } {
  let integrityGain = 0;
  let marketReliefProxy = 0;
  let attributeSynergy = 0;
  for (const tpl of V1014_CARBON_MARKET_INTEGRITY_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      integrityGain += tpl.integrityScoreEq;
      marketReliefProxy += tpl.marketReliefFactor;
      attributeSynergy += tpl.attributeSynergyFactor;
    }
  }
  if (params.attributeBand === 'attribute_corridor' || params.attributeBand === 'federated_renewable_attribute_leader') {
    integrityGain += 17;
    attributeSynergy += 0.1;
  }
  if (params.emissionsCreditRelief > 2.5) {
    integrityGain += params.emissionsCreditRelief * 0.68;
    marketReliefProxy += clamp(params.emissionsCreditRelief * 0.007, 0, 0.04);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.2, 0, 8);
  const prevIdx = params.prev?.integrityIndex ?? 0;
  const integrityIndex = clamp(
    prevIdx * 0.82 + integrityGain * 0.1 + marketReliefProxy * 28 - stressLoad * 0.024 + attributeSynergy * 25,
    0,
    189,
  );

  let band: V1014CarbonMarketIntegrityBand = 'fragmented_markets';
  if (integrityIndex >= 120 || integrityGain >= 138) band = 'deep_carbon_market_mesh';
  else if (integrityIndex >= 80 || integrityGain >= 92) band = 'integrity_hub';
  else if (integrityIndex >= 35 || integrityGain >= 33) band = 'pilot_integrity';

  let carbonMarketIntegrityRelief = clamp(integrityIndex / 17.6 + marketReliefProxy * 6.3 + attributeSynergy * 6.5, 0, 9.9);
  if (band === 'fragmented_markets') carbonMarketIntegrityRelief = clamp(carbonMarketIntegrityRelief * 0.21, 0, 2.2);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      integrityIndex: clamp(integrityIndex, 0, 189),
      carbonMarketIntegrityRelief: clamp(carbonMarketIntegrityRelief, 0, 9.9),
      summary: `${params.regionId} carbon market ${band} · idx ${integrityIndex.toFixed(0)} · relief ${carbonMarketIntegrityRelief.toFixed(1)}`,
    },
    next: { integrityIndex: clamp(integrityIndex, 0, 189) },
  };
}

export const V1014_RENEWABLE_CMI_SCENARIOS = [
  {
    id: 'sc_rc_qld',
    label: 'QLD granular certs with safeguard hub',
    regionId: 'QLD',
    climateDisclosureRelief: 2.9,
    greenProductPassportRelief: 2.8,
    disclosureBand: 'assurance_corridor',
    passportBand: 'passport_hub',
    scope3SupplyChainRelief: 2.8,
    netZeroPathwayRelief: 2.9,
    exportCarbonIntensityRelief: 2.7,
    renewableShareScore: 55,
    gridStressPoints: 15,
    emissionsCreditRelief: 2.7,
    completedProjectTypes: [
      'granular_renewable_certificate_hub',
      'federation_renewable_attribute_tie',
      'safeguard_credit_integrity_hub',
      'trade_exposed_carbon_credit_stack',
    ],
    expectAttributeBand: 'attribute_corridor' as V1014RenewableAttributeBand,
    expectMinAttributeRelief: 1.9,
    expectIntegrityBand: 'integrity_hub' as V1014CarbonMarketIntegrityBand,
    expectMinIntegrityRelief: 1.6,
  },
  {
    id: 'sc_rc_tas',
    label: 'TAS time-matched with offset mesh',
    regionId: 'TAS',
    climateDisclosureRelief: 2.3,
    greenProductPassportRelief: 2.2,
    disclosureBand: 'pilot_disclosure',
    passportBand: 'pilot_passport',
    scope3SupplyChainRelief: 2.2,
    netZeroPathwayRelief: 2.3,
    exportCarbonIntensityRelief: 2.1,
    renewableShareScore: 52,
    gridStressPoints: 13,
    emissionsCreditRelief: 2.4,
    attributeBand: 'pilot_attribute_trace' as V1014RenewableAttributeBand,
    completedProjectTypes: ['time_matched_renewable_attribute_corridor', 'offset_quality_assurance_mesh'],
    expectIntegrityBand: 'pilot_integrity' as V1014CarbonMarketIntegrityBand,
    expectMinIntegrityRelief: 1.2,
  },
] as const;

export function runAgent13RenewableCmiScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_RENEWABLE_ATTRIBUTE_CATALOG.length >= 4);
  ok(V1014_CARBON_MARKET_INTEGRITY_CATALOG.length >= 4);

  const sc0 = V1014_RENEWABLE_CMI_SCENARIOS[0];
  const attribute = computeRegionalRenewableAttributeLedger({
    regionId: sc0.regionId,
    climateDisclosureRelief: sc0.climateDisclosureRelief,
    greenProductPassportRelief: sc0.greenProductPassportRelief,
    disclosureBand: sc0.disclosureBand,
    passportBand: sc0.passportBand,
    scope3SupplyChainRelief: sc0.scope3SupplyChainRelief,
    netZeroPathwayRelief: sc0.netZeroPathwayRelief,
    exportCarbonIntensityRelief: sc0.exportCarbonIntensityRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    attribute.ledger.band === sc0.expectAttributeBand ||
      attribute.ledger.band === 'federated_renewable_attribute_leader' ||
      attribute.ledger.renewableAttributeRelief >= sc0.expectMinAttributeRelief,
  );

  const integrity = advanceRegionalCarbonMarketIntegrityOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    attributeBand: attribute.ledger.band,
    emissionsCreditRelief: sc0.emissionsCreditRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    integrity.ledger.band === sc0.expectIntegrityBand ||
      integrity.ledger.band === 'deep_carbon_market_mesh' ||
      integrity.ledger.carbonMarketIntegrityRelief >= sc0.expectMinIntegrityRelief,
  );

  const sc1 = V1014_RENEWABLE_CMI_SCENARIOS[1];
  const integrityT = advanceRegionalCarbonMarketIntegrityOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    attributeBand: sc1.attributeBand,
    emissionsCreditRelief: sc1.emissionsCreditRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(
    integrityT.ledger.carbonMarketIntegrityRelief >= sc1.expectMinIntegrityRelief ||
      integrityT.ledger.band !== 'fragmented_markets',
  );

  const persistA = computeRegionalRenewableAttributeLedger({
    regionId: 'SA',
    climateDisclosureRelief: 2.4,
    greenProductPassportRelief: 2.3,
    disclosureBand: 'pilot_disclosure',
    passportBand: 'pilot_passport',
    scope3SupplyChainRelief: 2.3,
    netZeroPathwayRelief: 2.4,
    exportCarbonIntensityRelief: 2.2,
    renewableShareScore: 48,
    completedProjectTypes: ['export_renewable_traceability_mesh'],
    prev: null,
  });
  const persistB = computeRegionalRenewableAttributeLedger({
    regionId: 'SA',
    climateDisclosureRelief: 2.4,
    greenProductPassportRelief: 2.3,
    disclosureBand: 'pilot_disclosure',
    passportBand: 'pilot_passport',
    scope3SupplyChainRelief: 2.3,
    netZeroPathwayRelief: 2.4,
    exportCarbonIntensityRelief: 2.2,
    renewableShareScore: 48,
    completedProjectTypes: ['export_renewable_traceability_mesh'],
    prev: persistA.next,
  });
  ok(persistB.next.attributeIndex >= persistA.next.attributeIndex * 0.7);

  const turnSc = runAgent13RenewableCmiTurnScenario(V1014_RENEWABLE_CMI_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastAttributeRelief >= 1.8);

  const gi = scoreAgent13RenewableCmiGIAlignment({
    actionText: 'Granular renewable certificate hub with safeguard credit integrity and trade-exposed carbon credit stack',
    attributeBand: 'attribute_corridor',
    integrityBand: 'integrity_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13RenewableCmiTurnStep {
  turn: number;
  regionId: string;
  climateDisclosureRelief: number;
  greenProductPassportRelief: number;
  scope3SupplyChainRelief: number;
  netZeroPathwayRelief: number;
  exportCarbonIntensityRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  emissionsCreditRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13RenewableCmiTurnScenario {
  id: string;
  label: string;
  steps: Agent13RenewableCmiTurnStep[];
  expect: {
    minAttributeReliefOnLast?: number;
    minIntegrityReliefOnLast?: number;
    lastAttributeBand?: V1014RenewableAttributeBand;
  };
}

export const V1014_RENEWABLE_CMI_TURN_SCENARIOS: readonly Agent13RenewableCmiTurnScenario[] = [
  {
    id: 'sc_rc_qld_escalation',
    label: 'QLD federated attributes with deep carbon market mesh',
    steps: [
      {
        turn: 1,
        regionId: 'QLD',
        climateDisclosureRelief: 2.1,
        greenProductPassportRelief: 2,
        scope3SupplyChainRelief: 2.1,
        netZeroPathwayRelief: 2.1,
        exportCarbonIntensityRelief: 2,
        renewableShareScore: 44,
        gridStressPoints: 16,
        emissionsCreditRelief: 2.1,
        completedProjectTypes: ['granular_renewable_certificate_hub', 'safeguard_credit_integrity_hub'],
      },
      {
        turn: 2,
        regionId: 'QLD',
        climateDisclosureRelief: 2.5,
        greenProductPassportRelief: 2.4,
        scope3SupplyChainRelief: 2.4,
        netZeroPathwayRelief: 2.5,
        exportCarbonIntensityRelief: 2.4,
        renewableShareScore: 50,
        gridStressPoints: 15,
        emissionsCreditRelief: 2.4,
        completedProjectTypes: ['time_matched_renewable_attribute_corridor', 'offset_quality_assurance_mesh'],
      },
      {
        turn: 3,
        regionId: 'QLD',
        climateDisclosureRelief: 2.9,
        greenProductPassportRelief: 2.8,
        scope3SupplyChainRelief: 2.8,
        netZeroPathwayRelief: 2.9,
        exportCarbonIntensityRelief: 2.7,
        renewableShareScore: 56,
        gridStressPoints: 13,
        emissionsCreditRelief: 2.7,
        completedProjectTypes: [
          'granular_renewable_certificate_hub',
          'time_matched_renewable_attribute_corridor',
          'export_renewable_traceability_mesh',
          'federation_renewable_attribute_tie',
          'safeguard_credit_integrity_hub',
          'offset_quality_assurance_mesh',
          'interoperable_carbon_registry_corridor',
          'trade_exposed_carbon_credit_stack',
        ],
      },
    ],
    expect: { minAttributeReliefOnLast: 1.8, minIntegrityReliefOnLast: 1.5, lastAttributeBand: 'attribute_corridor' },
  },
] as const;

export function runAgent13RenewableCmiTurnScenario(
  scenario: Agent13RenewableCmiTurnScenario,
): { passed: boolean; detail: string; lastAttributeRelief: number; lastIntegrityRelief: number } {
  let attributeMem: V1014RenewableAttributePersistedSlice | null = null;
  let integrityMem: V1014CarbonMarketIntegrityPersistedSlice | null = null;
  let lastAttributeRelief = 0;
  let lastIntegrityRelief = 0;
  let lastBand: V1014RenewableAttributeBand = 'untracked_generation';

  for (const step of scenario.steps) {
    const attribute = computeRegionalRenewableAttributeLedger({
      regionId: step.regionId,
      climateDisclosureRelief: step.climateDisclosureRelief,
      greenProductPassportRelief: step.greenProductPassportRelief,
      disclosureBand: 'assurance_corridor',
      passportBand: 'passport_hub',
      scope3SupplyChainRelief: step.scope3SupplyChainRelief,
      netZeroPathwayRelief: step.netZeroPathwayRelief,
      exportCarbonIntensityRelief: step.exportCarbonIntensityRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: attributeMem,
    });
    attributeMem = attribute.next;
    lastAttributeRelief = attribute.ledger.renewableAttributeRelief;
    lastBand = attribute.ledger.band;

    const integrity = advanceRegionalCarbonMarketIntegrityOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      attributeBand: attribute.ledger.band,
      emissionsCreditRelief: step.emissionsCreditRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: integrityMem,
    });
    integrityMem = integrity.next;
    lastIntegrityRelief = integrity.ledger.carbonMarketIntegrityRelief;
  }

  if (scenario.expect.minAttributeReliefOnLast != null && lastAttributeRelief < scenario.expect.minAttributeReliefOnLast) {
    return {
      passed: false,
      detail: `attribute relief ${lastAttributeRelief} < ${scenario.expect.minAttributeReliefOnLast}`,
      lastAttributeRelief,
      lastIntegrityRelief,
    };
  }
  if (scenario.expect.minIntegrityReliefOnLast != null && lastIntegrityRelief < scenario.expect.minIntegrityReliefOnLast) {
    return {
      passed: false,
      detail: `integrity relief ${lastIntegrityRelief} < ${scenario.expect.minIntegrityReliefOnLast}`,
      lastAttributeRelief,
      lastIntegrityRelief,
    };
  }
  if (scenario.expect.lastAttributeBand != null) {
    const allowed: V1014RenewableAttributeBand[] = [scenario.expect.lastAttributeBand];
    if (scenario.expect.lastAttributeBand === 'attribute_corridor') allowed.push('federated_renewable_attribute_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastAttributeRelief, lastIntegrityRelief };
    }
  }

  return { passed: true, detail: 'ok', lastAttributeRelief, lastIntegrityRelief };
}

export function scoreAgent13RenewableCmiGIAlignment(params: {
  actionText: string;
  attributeBand?: string;
  integrityBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'renewable certificate',
    'granular',
    'time-matched',
    'renewable attribute',
    'carbon market',
    'safeguard credit',
    'offset quality',
    'carbon registry',
    'trade-exposed credit',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.17, 0, 2);
  if (params.attributeBand === 'federated_renewable_attribute_leader' || params.attributeBand === 'attribute_corridor') {
    delta += hits.some(h => h.includes('renewable') || h.includes('granular') || h.includes('attribute')) ? 0.34 : 0.09;
  }
  if (params.integrityBand === 'integrity_hub' || params.integrityBand === 'deep_carbon_market_mesh') {
    delta += hits.some(h => h.includes('carbon') || h.includes('safeguard') || h.includes('offset')) ? 0.32 : 0.08;
  }
  if (params.integrityBand === 'fragmented_markets' && hits.some(h => h.includes('carbon'))) delta -= 0.1;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Renewable CMI GI: ${hits.slice(0, 2).join(', ')} aligns with attribute traceability and market integrity depth.`
        : null,
  };
}
