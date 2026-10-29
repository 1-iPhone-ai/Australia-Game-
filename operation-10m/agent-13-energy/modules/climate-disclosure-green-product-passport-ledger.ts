/**
 * Agent 13 scale wave round 34 (O10-199) — compound climate disclosure assurance & green product passport federation orchestration depth.
 * Cross-turn persistence for disclosure assurance corridors and green product passport mesh coupled to scope-3 supply chain,
 * hard-to-abate abatement, net-zero pathway, and export carbon intensity across the scale-wave stack.
 */

export type V1014ClimateDisclosureBand =
  | 'opaque_reporting'
  | 'pilot_disclosure'
  | 'assurance_corridor'
  | 'federated_disclosure_leader';

export type V1014GreenProductPassportBand =
  | 'unverified_product'
  | 'pilot_passport'
  | 'passport_hub'
  | 'circular_passport_mesh';

export interface V1014ClimateDisclosureInstrument {
  id: string;
  kind: 'ifrs_climate_disclosure_hub' | 'assurance_readiness_corridor' | 'transition_plan_registry' | 'federation_disclosure_tie';
  label: string;
  disclosureScoreEq: number;
  assuranceReliefFactor: number;
  passportSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_CLIMATE_DISCLOSURE_CATALOG: readonly V1014ClimateDisclosureInstrument[] = [
  {
    id: 'cd_ifrs',
    kind: 'ifrs_climate_disclosure_hub',
    label: 'IFRS climate disclosure orchestration hub',
    disclosureScoreEq: 46,
    assuranceReliefFactor: 0.16,
    passportSynergyFactor: 0.11,
    projectTypeHint: 'ifrs_climate_disclosure_orchestration_hub',
  },
  {
    id: 'cd_assure',
    kind: 'assurance_readiness_corridor',
    label: 'Assurance readiness disclosure corridor',
    disclosureScoreEq: 44,
    assuranceReliefFactor: 0.15,
    passportSynergyFactor: 0.12,
    projectTypeHint: 'assurance_readiness_disclosure_corridor',
  },
  {
    id: 'cd_trans',
    kind: 'transition_plan_registry',
    label: 'Transition plan registry layer',
    disclosureScoreEq: 48,
    assuranceReliefFactor: 0.17,
    passportSynergyFactor: 0.1,
    projectTypeHint: 'transition_plan_registry_layer',
  },
  {
    id: 'cd_fed',
    kind: 'federation_disclosure_tie',
    label: 'Federation disclosure assurance tie',
    disclosureScoreEq: 50,
    assuranceReliefFactor: 0.16,
    passportSynergyFactor: 0.13,
    projectTypeHint: 'federation_disclosure_assurance_tie',
  },
] as const;

export interface V1014GreenProductPassportTemplate {
  id: string;
  kind: 'digital_product_passport_hub' | 'circular_material_trace_mesh' | 'renewable_content_certificate_stack' | 'export_green_passport_corridor';
  label: string;
  passportScoreEq: number;
  traceReliefFactor: number;
  disclosureSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_GREEN_PRODUCT_PASSPORT_CATALOG: readonly V1014GreenProductPassportTemplate[] = [
  {
    id: 'gp_dpp',
    kind: 'digital_product_passport_hub',
    label: 'Digital product passport hub',
    passportScoreEq: 45,
    traceReliefFactor: 0.15,
    disclosureSynergyFactor: 0.1,
    projectTypeHint: 'digital_product_passport_hub',
  },
  {
    id: 'gp_trace',
    kind: 'circular_material_trace_mesh',
    label: 'Circular material traceability mesh',
    passportScoreEq: 47,
    traceReliefFactor: 0.16,
    disclosureSynergyFactor: 0.11,
    projectTypeHint: 'circular_material_traceability_mesh',
  },
  {
    id: 'gp_renew',
    kind: 'renewable_content_certificate_stack',
    label: 'Renewable content certificate stack',
    passportScoreEq: 43,
    traceReliefFactor: 0.14,
    disclosureSynergyFactor: 0.12,
    projectTypeHint: 'renewable_content_certificate_stack',
  },
  {
    id: 'gp_export',
    kind: 'export_green_passport_corridor',
    label: 'Export green passport corridor',
    passportScoreEq: 49,
    traceReliefFactor: 0.17,
    disclosureSynergyFactor: 0.13,
    projectTypeHint: 'export_green_passport_corridor',
  },
] as const;

export interface V1014RegionalClimateDisclosureLedger {
  regionId: string;
  band: V1014ClimateDisclosureBand;
  disclosureIndex: number;
  assuranceBalance: number;
  climateDisclosureRelief: number;
  summary: string;
}

export interface V1014RegionalGreenProductPassportLedger {
  regionId: string;
  band: V1014GreenProductPassportBand;
  passportIndex: number;
  greenProductPassportRelief: number;
  summary: string;
}

export interface V1014ClimateDisclosurePersistedSlice {
  assuranceBalance: number;
  disclosureIndex: number;
}

export interface V1014GreenProductPassportPersistedSlice {
  passportIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const DISCLOSURE_HUB_REGIONS = new Set(['NSW', 'QLD', 'VIC', 'WA', 'SA']);

export function computeRegionalClimateDisclosureLedger(params: {
  regionId: string;
  scope3SupplyChainRelief: number;
  hardToAbateRelief: number;
  scope3Band: string;
  hardToAbateBand: string;
  netZeroPathwayRelief: number;
  exportCarbonIntensityRelief: number;
  decarbonFederationRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014ClimateDisclosurePersistedSlice | null;
}): { ledger: V1014RegionalClimateDisclosureLedger; next: V1014ClimateDisclosurePersistedSlice } {
  let disclosureGain = 0;
  let assuranceProxy = 0;
  let passportSynergy = 0;
  for (const inst of V1014_CLIMATE_DISCLOSURE_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      disclosureGain += inst.disclosureScoreEq;
      assuranceProxy += inst.assuranceReliefFactor;
      passportSynergy += inst.passportSynergyFactor;
    }
  }
  if (DISCLOSURE_HUB_REGIONS.has(params.regionId)) assuranceProxy += 0.06;
  else assuranceProxy *= 0.72;
  if (params.scope3SupplyChainRelief > 2.6) {
    disclosureGain += clamp(params.scope3SupplyChainRelief * 0.76, 0, 10);
    assuranceProxy += 0.06;
  }
  if (params.hardToAbateRelief > 2.5) passportSynergy += clamp(params.hardToAbateRelief * 0.01, 0, 0.06);
  if (params.scope3Band === 'supply_chain_corridor' || params.scope3Band === 'federated_scope3_leader') {
    disclosureGain += 15;
    assuranceProxy += 0.05;
  }
  if (params.hardToAbateBand === 'hard_to_abate_hub' || params.hardToAbateBand === 'deep_abatement_process_mesh') {
    passportSynergy += 0.09;
  }
  if (params.netZeroPathwayRelief > 2.7) assuranceProxy += clamp(params.netZeroPathwayRelief * 0.008, 0, 0.05);
  if (params.exportCarbonIntensityRelief > 2.6) disclosureGain += clamp(params.exportCarbonIntensityRelief * 0.68, 0, 8);
  if (params.decarbonFederationRelief > 2.8) passportSynergy += clamp(params.decarbonFederationRelief * 0.009, 0, 0.05);
  assuranceProxy += clamp(params.renewableShareScore / 108, 0, 0.09);

  const prevIdx = params.prev?.disclosureIndex ?? 0;
  const prevBal = params.prev?.assuranceBalance ?? 0;
  const assuranceBalance = clamp(prevBal * 0.84 + disclosureGain * 0.1, 0, 240);
  const disclosureIndex = clamp(
    prevIdx * 0.81 + assuranceBalance * 0.09 + assuranceProxy * 79 + passportSynergy * 26,
    0,
    186,
  );

  let band: V1014ClimateDisclosureBand = 'opaque_reporting';
  if (disclosureIndex >= 116 || disclosureGain >= 130) band = 'federated_disclosure_leader';
  else if (disclosureIndex >= 76 || disclosureGain >= 84) band = 'assurance_corridor';
  else if (disclosureIndex >= 33 || disclosureGain >= 31) band = 'pilot_disclosure';

  let climateDisclosureRelief = clamp(assuranceProxy * 8.1 + disclosureGain * 0.03 + passportSynergy * 4.9, 0, 10.3);
  if (band === 'opaque_reporting') climateDisclosureRelief *= 0.24;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      disclosureIndex: clamp(disclosureIndex, 0, 186),
      assuranceBalance: clamp(assuranceBalance, 0, 240),
      climateDisclosureRelief: clamp(climateDisclosureRelief, 0, 10.3),
      summary: `${params.regionId} disclosure ${band} · idx ${disclosureIndex.toFixed(0)} · relief ${climateDisclosureRelief.toFixed(1)}`,
    },
    next: {
      assuranceBalance: clamp(assuranceBalance, 0, 240),
      disclosureIndex: clamp(disclosureIndex, 0, 186),
    },
  };
}

export function advanceRegionalGreenProductPassportOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  disclosureBand: V1014ClimateDisclosureBand;
  mineralsCircularRecoveryRelief: number;
  completedProjectTypes: string[];
  prev?: V1014GreenProductPassportPersistedSlice | null;
}): { ledger: V1014RegionalGreenProductPassportLedger; next: V1014GreenProductPassportPersistedSlice } {
  let passportGain = 0;
  let traceReliefProxy = 0;
  let disclosureSynergy = 0;
  for (const tpl of V1014_GREEN_PRODUCT_PASSPORT_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      passportGain += tpl.passportScoreEq;
      traceReliefProxy += tpl.traceReliefFactor;
      disclosureSynergy += tpl.disclosureSynergyFactor;
    }
  }
  if (params.disclosureBand === 'assurance_corridor' || params.disclosureBand === 'federated_disclosure_leader') {
    passportGain += 16;
    disclosureSynergy += 0.1;
  }
  if (params.mineralsCircularRecoveryRelief > 2.5) {
    passportGain += params.mineralsCircularRecoveryRelief * 0.7;
    traceReliefProxy += clamp(params.mineralsCircularRecoveryRelief * 0.007, 0, 0.04);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.21, 0, 8.2);
  const prevIdx = params.prev?.passportIndex ?? 0;
  const passportIndex = clamp(
    prevIdx * 0.82 + passportGain * 0.1 + traceReliefProxy * 29 - stressLoad * 0.025 + disclosureSynergy * 26,
    0,
    188,
  );

  let band: V1014GreenProductPassportBand = 'unverified_product';
  if (passportIndex >= 119 || passportGain >= 136) band = 'circular_passport_mesh';
  else if (passportIndex >= 79 || passportGain >= 90) band = 'passport_hub';
  else if (passportIndex >= 34 || passportGain >= 32) band = 'pilot_passport';

  let greenProductPassportRelief = clamp(passportIndex / 17.4 + traceReliefProxy * 6.4 + disclosureSynergy * 6.6, 0, 10);
  if (band === 'unverified_product') greenProductPassportRelief = clamp(greenProductPassportRelief * 0.22, 0, 2.3);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      passportIndex: clamp(passportIndex, 0, 188),
      greenProductPassportRelief: clamp(greenProductPassportRelief, 0, 10),
      summary: `${params.regionId} passport ${band} · idx ${passportIndex.toFixed(0)} · relief ${greenProductPassportRelief.toFixed(1)}`,
    },
    next: { passportIndex: clamp(passportIndex, 0, 188) },
  };
}

export const V1014_DISCLOSURE_PASSPORT_SCENARIOS = [
  {
    id: 'sc_dp_vic',
    label: 'VIC IFRS hub with digital passport',
    regionId: 'VIC',
    scope3SupplyChainRelief: 2.9,
    hardToAbateRelief: 2.8,
    scope3Band: 'supply_chain_corridor',
    hardToAbateBand: 'hard_to_abate_hub',
    netZeroPathwayRelief: 2.9,
    exportCarbonIntensityRelief: 2.7,
    decarbonFederationRelief: 2.8,
    renewableShareScore: 53,
    gridStressPoints: 15,
    mineralsCircularRecoveryRelief: 2.6,
    completedProjectTypes: [
      'ifrs_climate_disclosure_orchestration_hub',
      'federation_disclosure_assurance_tie',
      'digital_product_passport_hub',
      'export_green_passport_corridor',
    ],
    expectDisclosureBand: 'assurance_corridor' as V1014ClimateDisclosureBand,
    expectMinDisclosureRelief: 1.9,
    expectPassportBand: 'passport_hub' as V1014GreenProductPassportBand,
    expectMinPassportRelief: 1.6,
  },
  {
    id: 'sc_dp_sa',
    label: 'SA transition registry with trace mesh',
    regionId: 'SA',
    scope3SupplyChainRelief: 2.3,
    hardToAbateRelief: 2.2,
    scope3Band: 'pilot_scope3_coverage',
    hardToAbateBand: 'pilot_hard_to_abate',
    netZeroPathwayRelief: 2.4,
    exportCarbonIntensityRelief: 2.2,
    decarbonFederationRelief: 2.3,
    renewableShareScore: 47,
    gridStressPoints: 14,
    mineralsCircularRecoveryRelief: 2.4,
    disclosureBand: 'pilot_disclosure' as V1014ClimateDisclosureBand,
    completedProjectTypes: ['transition_plan_registry_layer', 'circular_material_traceability_mesh'],
    expectPassportBand: 'pilot_passport' as V1014GreenProductPassportBand,
    expectMinPassportRelief: 1.2,
  },
] as const;

export function runAgent13DisclosurePassportScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_CLIMATE_DISCLOSURE_CATALOG.length >= 4);
  ok(V1014_GREEN_PRODUCT_PASSPORT_CATALOG.length >= 4);

  const sc0 = V1014_DISCLOSURE_PASSPORT_SCENARIOS[0];
  const disclosure = computeRegionalClimateDisclosureLedger({
    regionId: sc0.regionId,
    scope3SupplyChainRelief: sc0.scope3SupplyChainRelief,
    hardToAbateRelief: sc0.hardToAbateRelief,
    scope3Band: sc0.scope3Band,
    hardToAbateBand: sc0.hardToAbateBand,
    netZeroPathwayRelief: sc0.netZeroPathwayRelief,
    exportCarbonIntensityRelief: sc0.exportCarbonIntensityRelief,
    decarbonFederationRelief: sc0.decarbonFederationRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    disclosure.ledger.band === sc0.expectDisclosureBand ||
      disclosure.ledger.band === 'federated_disclosure_leader' ||
      disclosure.ledger.climateDisclosureRelief >= sc0.expectMinDisclosureRelief,
  );

  const passport = advanceRegionalGreenProductPassportOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    disclosureBand: disclosure.ledger.band,
    mineralsCircularRecoveryRelief: sc0.mineralsCircularRecoveryRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    passport.ledger.band === sc0.expectPassportBand ||
      passport.ledger.band === 'circular_passport_mesh' ||
      passport.ledger.greenProductPassportRelief >= sc0.expectMinPassportRelief,
  );

  const sc1 = V1014_DISCLOSURE_PASSPORT_SCENARIOS[1];
  const passportS = advanceRegionalGreenProductPassportOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    disclosureBand: sc1.disclosureBand,
    mineralsCircularRecoveryRelief: sc1.mineralsCircularRecoveryRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(
    passportS.ledger.greenProductPassportRelief >= sc1.expectMinPassportRelief ||
      passportS.ledger.band !== 'unverified_product',
  );

  const persistA = computeRegionalClimateDisclosureLedger({
    regionId: 'QLD',
    scope3SupplyChainRelief: 2.4,
    hardToAbateRelief: 2.3,
    scope3Band: 'pilot_scope3_coverage',
    hardToAbateBand: 'pilot_hard_to_abate',
    netZeroPathwayRelief: 2.4,
    exportCarbonIntensityRelief: 2.3,
    decarbonFederationRelief: 2.4,
    renewableShareScore: 46,
    completedProjectTypes: ['assurance_readiness_disclosure_corridor'],
    prev: null,
  });
  const persistB = computeRegionalClimateDisclosureLedger({
    regionId: 'QLD',
    scope3SupplyChainRelief: 2.4,
    hardToAbateRelief: 2.3,
    scope3Band: 'pilot_scope3_coverage',
    hardToAbateBand: 'pilot_hard_to_abate',
    netZeroPathwayRelief: 2.4,
    exportCarbonIntensityRelief: 2.3,
    decarbonFederationRelief: 2.4,
    renewableShareScore: 46,
    completedProjectTypes: ['assurance_readiness_disclosure_corridor'],
    prev: persistA.next,
  });
  ok(persistB.next.disclosureIndex >= persistA.next.disclosureIndex * 0.7);

  const turnSc = runAgent13DisclosurePassportTurnScenario(V1014_DISCLOSURE_PASSPORT_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastDisclosureRelief >= 1.8);

  const gi = scoreAgent13DisclosurePassportGIAlignment({
    actionText: 'IFRS climate disclosure hub with digital product passport and export green passport corridor',
    disclosureBand: 'assurance_corridor',
    passportBand: 'passport_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13DisclosurePassportTurnStep {
  turn: number;
  regionId: string;
  scope3SupplyChainRelief: number;
  hardToAbateRelief: number;
  netZeroPathwayRelief: number;
  exportCarbonIntensityRelief: number;
  decarbonFederationRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  mineralsCircularRecoveryRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13DisclosurePassportTurnScenario {
  id: string;
  label: string;
  steps: Agent13DisclosurePassportTurnStep[];
  expect: {
    minDisclosureReliefOnLast?: number;
    minPassportReliefOnLast?: number;
    lastDisclosureBand?: V1014ClimateDisclosureBand;
  };
}

export const V1014_DISCLOSURE_PASSPORT_TURN_SCENARIOS: readonly Agent13DisclosurePassportTurnScenario[] = [
  {
    id: 'sc_dp_vic_escalation',
    label: 'VIC federated disclosure with circular passport mesh',
    steps: [
      {
        turn: 1,
        regionId: 'VIC',
        scope3SupplyChainRelief: 2.1,
        hardToAbateRelief: 2,
        netZeroPathwayRelief: 2.1,
        exportCarbonIntensityRelief: 2,
        decarbonFederationRelief: 2.1,
        renewableShareScore: 42,
        gridStressPoints: 16,
        mineralsCircularRecoveryRelief: 2.1,
        completedProjectTypes: ['ifrs_climate_disclosure_orchestration_hub', 'digital_product_passport_hub'],
      },
      {
        turn: 2,
        regionId: 'VIC',
        scope3SupplyChainRelief: 2.5,
        hardToAbateRelief: 2.4,
        netZeroPathwayRelief: 2.5,
        exportCarbonIntensityRelief: 2.4,
        decarbonFederationRelief: 2.5,
        renewableShareScore: 48,
        gridStressPoints: 15,
        mineralsCircularRecoveryRelief: 2.4,
        completedProjectTypes: ['assurance_readiness_disclosure_corridor', 'circular_material_traceability_mesh'],
      },
      {
        turn: 3,
        regionId: 'VIC',
        scope3SupplyChainRelief: 2.9,
        hardToAbateRelief: 2.8,
        netZeroPathwayRelief: 2.9,
        exportCarbonIntensityRelief: 2.7,
        decarbonFederationRelief: 2.8,
        renewableShareScore: 54,
        gridStressPoints: 13,
        mineralsCircularRecoveryRelief: 2.7,
        completedProjectTypes: [
          'ifrs_climate_disclosure_orchestration_hub',
          'assurance_readiness_disclosure_corridor',
          'transition_plan_registry_layer',
          'federation_disclosure_assurance_tie',
          'digital_product_passport_hub',
          'circular_material_traceability_mesh',
          'renewable_content_certificate_stack',
          'export_green_passport_corridor',
        ],
      },
    ],
    expect: { minDisclosureReliefOnLast: 1.8, minPassportReliefOnLast: 1.5, lastDisclosureBand: 'assurance_corridor' },
  },
] as const;

export function runAgent13DisclosurePassportTurnScenario(
  scenario: Agent13DisclosurePassportTurnScenario,
): { passed: boolean; detail: string; lastDisclosureRelief: number; lastPassportRelief: number } {
  let disclosureMem: V1014ClimateDisclosurePersistedSlice | null = null;
  let passportMem: V1014GreenProductPassportPersistedSlice | null = null;
  let lastDisclosureRelief = 0;
  let lastPassportRelief = 0;
  let lastBand: V1014ClimateDisclosureBand = 'opaque_reporting';

  for (const step of scenario.steps) {
    const disclosure = computeRegionalClimateDisclosureLedger({
      regionId: step.regionId,
      scope3SupplyChainRelief: step.scope3SupplyChainRelief,
      hardToAbateRelief: step.hardToAbateRelief,
      scope3Band: 'supply_chain_corridor',
      hardToAbateBand: 'hard_to_abate_hub',
      netZeroPathwayRelief: step.netZeroPathwayRelief,
      exportCarbonIntensityRelief: step.exportCarbonIntensityRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: disclosureMem,
    });
    disclosureMem = disclosure.next;
    lastDisclosureRelief = disclosure.ledger.climateDisclosureRelief;
    lastBand = disclosure.ledger.band;

    const passport = advanceRegionalGreenProductPassportOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      disclosureBand: disclosure.ledger.band,
      mineralsCircularRecoveryRelief: step.mineralsCircularRecoveryRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: passportMem,
    });
    passportMem = passport.next;
    lastPassportRelief = passport.ledger.greenProductPassportRelief;
  }

  if (scenario.expect.minDisclosureReliefOnLast != null && lastDisclosureRelief < scenario.expect.minDisclosureReliefOnLast) {
    return {
      passed: false,
      detail: `disclosure relief ${lastDisclosureRelief} < ${scenario.expect.minDisclosureReliefOnLast}`,
      lastDisclosureRelief,
      lastPassportRelief,
    };
  }
  if (scenario.expect.minPassportReliefOnLast != null && lastPassportRelief < scenario.expect.minPassportReliefOnLast) {
    return {
      passed: false,
      detail: `passport relief ${lastPassportRelief} < ${scenario.expect.minPassportReliefOnLast}`,
      lastDisclosureRelief,
      lastPassportRelief,
    };
  }
  if (scenario.expect.lastDisclosureBand != null) {
    const allowed: V1014ClimateDisclosureBand[] = [scenario.expect.lastDisclosureBand];
    if (scenario.expect.lastDisclosureBand === 'assurance_corridor') allowed.push('federated_disclosure_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastDisclosureRelief, lastPassportRelief };
    }
  }

  return { passed: true, detail: 'ok', lastDisclosureRelief, lastPassportRelief };
}

export function scoreAgent13DisclosurePassportGIAlignment(params: {
  actionText: string;
  disclosureBand?: string;
  passportBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'climate disclosure',
    'ifrs',
    'assurance readiness',
    'transition plan',
    'product passport',
    'digital passport',
    'circular material',
    'renewable content certificate',
    'green passport',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.18, 0, 2);
  if (params.disclosureBand === 'federated_disclosure_leader' || params.disclosureBand === 'assurance_corridor') {
    delta += hits.some(h => h.includes('disclosure') || h.includes('ifrs') || h.includes('assurance')) ? 0.35 : 0.1;
  }
  if (params.passportBand === 'passport_hub' || params.passportBand === 'circular_passport_mesh') {
    delta += hits.some(h => h.includes('passport') || h.includes('circular') || h.includes('certificate')) ? 0.33 : 0.08;
  }
  if (params.passportBand === 'unverified_product' && hits.some(h => h.includes('passport'))) delta -= 0.1;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Disclosure passport GI: ${hits.slice(0, 2).join(', ')} aligns with assurance and product passport depth.`
        : null,
  };
}
