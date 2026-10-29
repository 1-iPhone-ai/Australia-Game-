/**
 * Agent 13 scale wave round 36 (O10-203) — compound industrial electrification flex & interregional grid interconnection federation orchestration depth.
 */

export type V1014IndustrialElectrificationFlexBand =
  | 'fossil_locked_load'
  | 'pilot_electrification'
  | 'electrification_corridor'
  | 'federated_industrial_flex_leader';

export type V1014InterregionalInterconnectionBand =
  | 'islanded_grid'
  | 'pilot_interconnection'
  | 'interconnection_hub'
  | 'deep_interconnection_mesh';

export interface V1014IndustrialElectrificationFlexInstrument {
  id: string;
  kind: 'process_heat_electrification_hub' | 'industrial_load_flex_corridor' | 'behind_meter_flex_mesh' | 'federation_electrification_tie';
  label: string;
  flexScoreEq: number;
  electrificationReliefFactor: number;
  interconnectionSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_INDUSTRIAL_ELECTRIFICATION_FLEX_CATALOG: readonly V1014IndustrialElectrificationFlexInstrument[] = [
  {
    id: 'ief_heat',
    kind: 'process_heat_electrification_hub',
    label: 'Process-heat electrification hub',
    flexScoreEq: 46,
    electrificationReliefFactor: 0.16,
    interconnectionSynergyFactor: 0.11,
    projectTypeHint: 'process_heat_electrification_hub',
  },
  {
    id: 'ief_load',
    kind: 'industrial_load_flex_corridor',
    label: 'Industrial load-flex corridor',
    flexScoreEq: 44,
    electrificationReliefFactor: 0.15,
    interconnectionSynergyFactor: 0.12,
    projectTypeHint: 'industrial_load_flex_corridor',
  },
  {
    id: 'ief_btm',
    kind: 'behind_meter_flex_mesh',
    label: 'Behind-the-meter flex mesh',
    flexScoreEq: 48,
    electrificationReliefFactor: 0.17,
    interconnectionSynergyFactor: 0.1,
    projectTypeHint: 'behind_meter_industrial_flex_mesh',
  },
  {
    id: 'ief_fed',
    kind: 'federation_electrification_tie',
    label: 'Federation industrial electrification tie',
    flexScoreEq: 50,
    electrificationReliefFactor: 0.16,
    interconnectionSynergyFactor: 0.13,
    projectTypeHint: 'federation_industrial_electrification_tie',
  },
] as const;

export interface V1014InterregionalInterconnectionTemplate {
  id: string;
  kind: 'hvdc_link_orchestration' | 'rez_spill_interconnection_mesh' | 'cross_border_capacity_corridor' | 'merchant_interconnection_stack';
  label: string;
  linkScoreEq: number;
  interconnectionReliefFactor: number;
  flexSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_INTERREGIONAL_INTERCONNECTION_CATALOG: readonly V1014InterregionalInterconnectionTemplate[] = [
  {
    id: 'iri_hvdc',
    kind: 'hvdc_link_orchestration',
    label: 'HVDC link orchestration hub',
    linkScoreEq: 47,
    interconnectionReliefFactor: 0.15,
    flexSynergyFactor: 0.1,
    projectTypeHint: 'hvdc_link_orchestration_hub',
  },
  {
    id: 'iri_rez',
    kind: 'rez_spill_interconnection_mesh',
    label: 'REZ spill interconnection mesh',
    linkScoreEq: 45,
    interconnectionReliefFactor: 0.14,
    flexSynergyFactor: 0.11,
    projectTypeHint: 'rez_spill_interconnection_mesh',
  },
  {
    id: 'iri_cross',
    kind: 'cross_border_capacity_corridor',
    label: 'Cross-border capacity corridor',
    linkScoreEq: 49,
    interconnectionReliefFactor: 0.16,
    flexSynergyFactor: 0.12,
    projectTypeHint: 'cross_border_capacity_corridor',
  },
  {
    id: 'iri_merchant',
    kind: 'merchant_interconnection_stack',
    label: 'Merchant interconnection stacking layer',
    linkScoreEq: 43,
    interconnectionReliefFactor: 0.14,
    flexSynergyFactor: 0.13,
    projectTypeHint: 'merchant_interconnection_stacking_layer',
  },
] as const;

export interface V1014RegionalIndustrialElectrificationFlexLedger {
  regionId: string;
  band: V1014IndustrialElectrificationFlexBand;
  flexIndex: number;
  electrificationBalance: number;
  industrialElectrificationFlexRelief: number;
  summary: string;
}

export interface V1014RegionalInterregionalInterconnectionLedger {
  regionId: string;
  band: V1014InterregionalInterconnectionBand;
  linkIndex: number;
  interregionalInterconnectionRelief: number;
  summary: string;
}

export interface V1014IndustrialElectrificationFlexPersistedSlice {
  electrificationBalance: number;
  flexIndex: number;
}

export interface V1014InterregionalInterconnectionPersistedSlice {
  linkIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const FLEX_HUB_REGIONS = new Set(['NSW', 'QLD', 'VIC', 'WA', 'SA']);

export function computeRegionalIndustrialElectrificationFlexLedger(params: {
  regionId: string;
  renewableAttributeRelief: number;
  carbonMarketIntegrityRelief: number;
  attributeBand: string;
  integrityBand: string;
  flexibleLoadRelief: number;
  transmissionCongestionRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014IndustrialElectrificationFlexPersistedSlice | null;
}): { ledger: V1014RegionalIndustrialElectrificationFlexLedger; next: V1014IndustrialElectrificationFlexPersistedSlice } {
  let flexGain = 0;
  let electrificationProxy = 0;
  let interconnectionSynergy = 0;
  for (const inst of V1014_INDUSTRIAL_ELECTRIFICATION_FLEX_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      flexGain += inst.flexScoreEq;
      electrificationProxy += inst.electrificationReliefFactor;
      interconnectionSynergy += inst.interconnectionSynergyFactor;
    }
  }
  if (FLEX_HUB_REGIONS.has(params.regionId)) electrificationProxy += 0.06;
  else electrificationProxy *= 0.72;
  if (params.renewableAttributeRelief > 2.6) {
    flexGain += clamp(params.renewableAttributeRelief * 0.72, 0, 10);
    electrificationProxy += 0.06;
  }
  if (params.carbonMarketIntegrityRelief > 2.5) interconnectionSynergy += clamp(params.carbonMarketIntegrityRelief * 0.01, 0, 0.06);
  if (params.attributeBand === 'attribute_corridor' || params.attributeBand === 'federated_renewable_attribute_leader') {
    flexGain += 15;
    electrificationProxy += 0.05;
  }
  if (params.integrityBand === 'integrity_hub' || params.integrityBand === 'deep_carbon_market_mesh') {
    interconnectionSynergy += 0.09;
  }
  if (params.flexibleLoadRelief > 2.4) electrificationProxy += clamp(params.flexibleLoadRelief * 0.008, 0, 0.05);
  if (params.transmissionCongestionRelief > 2.6) flexGain += clamp(params.transmissionCongestionRelief * 0.62, 0, 8);
  electrificationProxy += clamp(params.renewableShareScore / 104, 0, 0.1);

  const prevIdx = params.prev?.flexIndex ?? 0;
  const prevBal = params.prev?.electrificationBalance ?? 0;
  const electrificationBalance = clamp(prevBal * 0.84 + flexGain * 0.1, 0, 244);
  const flexIndex = clamp(
    prevIdx * 0.81 + electrificationBalance * 0.09 + electrificationProxy * 77 + interconnectionSynergy * 24,
    0,
    188,
  );

  let band: V1014IndustrialElectrificationFlexBand = 'fossil_locked_load';
  if (flexIndex >= 118 || flexGain >= 134) band = 'federated_industrial_flex_leader';
  else if (flexIndex >= 78 || flexGain >= 88) band = 'electrification_corridor';
  else if (flexIndex >= 35 || flexGain >= 33) band = 'pilot_electrification';

  let industrialElectrificationFlexRelief = clamp(
    electrificationProxy * 7.9 + flexGain * 0.028 + interconnectionSynergy * 4.7,
    0,
    10.1,
  );
  if (band === 'fossil_locked_load') industrialElectrificationFlexRelief *= 0.22;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      flexIndex: clamp(flexIndex, 0, 188),
      electrificationBalance: clamp(electrificationBalance, 0, 244),
      industrialElectrificationFlexRelief: clamp(industrialElectrificationFlexRelief, 0, 10.1),
      summary: `${params.regionId} ind flex ${band} · idx ${flexIndex.toFixed(0)} · relief ${industrialElectrificationFlexRelief.toFixed(1)}`,
    },
    next: {
      electrificationBalance: clamp(electrificationBalance, 0, 244),
      flexIndex: clamp(flexIndex, 0, 188),
    },
  };
}

export function advanceRegionalInterregionalInterconnectionOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  flexBand: V1014IndustrialElectrificationFlexBand;
  merchantStorageRelief: number;
  completedProjectTypes: string[];
  prev?: V1014InterregionalInterconnectionPersistedSlice | null;
}): { ledger: V1014RegionalInterregionalInterconnectionLedger; next: V1014InterregionalInterconnectionPersistedSlice } {
  let linkGain = 0;
  let interconnectionProxy = 0;
  let flexSynergy = 0;
  for (const tpl of V1014_INTERREGIONAL_INTERCONNECTION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      linkGain += tpl.linkScoreEq;
      interconnectionProxy += tpl.interconnectionReliefFactor;
      flexSynergy += tpl.flexSynergyFactor;
    }
  }
  if (params.flexBand === 'electrification_corridor' || params.flexBand === 'federated_industrial_flex_leader') {
    linkGain += 18;
    flexSynergy += 0.1;
  }
  if (params.merchantStorageRelief > 2.5) {
    linkGain += params.merchantStorageRelief * 0.66;
    interconnectionProxy += clamp(params.merchantStorageRelief * 0.007, 0, 0.04);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.19, 0, 7.8);
  const prevIdx = params.prev?.linkIndex ?? 0;
  const linkIndex = clamp(
    prevIdx * 0.82 + linkGain * 0.1 + interconnectionProxy * 27 - stressLoad * 0.023 + flexSynergy * 24,
    0,
    190,
  );

  let band: V1014InterregionalInterconnectionBand = 'islanded_grid';
  if (linkIndex >= 121 || linkGain >= 140) band = 'deep_interconnection_mesh';
  else if (linkIndex >= 81 || linkGain >= 94) band = 'interconnection_hub';
  else if (linkIndex >= 36 || linkGain >= 34) band = 'pilot_interconnection';

  let interregionalInterconnectionRelief = clamp(linkIndex / 17.8 + interconnectionProxy * 6.2 + flexSynergy * 6.4, 0, 9.8);
  if (band === 'islanded_grid') interregionalInterconnectionRelief = clamp(interregionalInterconnectionRelief * 0.2, 0, 2.1);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      linkIndex: clamp(linkIndex, 0, 190),
      interregionalInterconnectionRelief: clamp(interregionalInterconnectionRelief, 0, 9.8),
      summary: `${params.regionId} interconnection ${band} · idx ${linkIndex.toFixed(0)} · relief ${interregionalInterconnectionRelief.toFixed(1)}`,
    },
    next: { linkIndex: clamp(linkIndex, 0, 190) },
  };
}

export const V1014_FLEX_INTERCONNECTION_SCENARIOS = [
  {
    id: 'sc_fi_nsw',
    label: 'NSW process heat with HVDC hub',
    regionId: 'NSW',
    renewableAttributeRelief: 2.9,
    carbonMarketIntegrityRelief: 2.8,
    attributeBand: 'attribute_corridor',
    integrityBand: 'integrity_hub',
    flexibleLoadRelief: 2.7,
    transmissionCongestionRelief: 2.8,
    renewableShareScore: 54,
    gridStressPoints: 15,
    merchantStorageRelief: 2.6,
    completedProjectTypes: [
      'process_heat_electrification_hub',
      'federation_industrial_electrification_tie',
      'hvdc_link_orchestration_hub',
      'merchant_interconnection_stacking_layer',
    ],
    expectFlexBand: 'electrification_corridor' as V1014IndustrialElectrificationFlexBand,
    expectMinFlexRelief: 1.8,
    expectInterconnectionBand: 'interconnection_hub' as V1014InterregionalInterconnectionBand,
    expectMinInterconnectionRelief: 1.5,
  },
] as const;

export function runAgent13FlexInterconnectionScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_INDUSTRIAL_ELECTRIFICATION_FLEX_CATALOG.length >= 4);
  ok(V1014_INTERREGIONAL_INTERCONNECTION_CATALOG.length >= 4);

  const sc0 = V1014_FLEX_INTERCONNECTION_SCENARIOS[0];
  const flex = computeRegionalIndustrialElectrificationFlexLedger({
    regionId: sc0.regionId,
    renewableAttributeRelief: sc0.renewableAttributeRelief,
    carbonMarketIntegrityRelief: sc0.carbonMarketIntegrityRelief,
    attributeBand: sc0.attributeBand,
    integrityBand: sc0.integrityBand,
    flexibleLoadRelief: sc0.flexibleLoadRelief,
    transmissionCongestionRelief: sc0.transmissionCongestionRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    flex.ledger.band === sc0.expectFlexBand ||
      flex.ledger.band === 'federated_industrial_flex_leader' ||
      flex.ledger.industrialElectrificationFlexRelief >= sc0.expectMinFlexRelief,
  );

  const interconnection = advanceRegionalInterregionalInterconnectionOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    flexBand: flex.ledger.band,
    merchantStorageRelief: sc0.merchantStorageRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    interconnection.ledger.band === sc0.expectInterconnectionBand ||
      interconnection.ledger.band === 'deep_interconnection_mesh' ||
      interconnection.ledger.interregionalInterconnectionRelief >= sc0.expectMinInterconnectionRelief,
  );

  const persistA = computeRegionalIndustrialElectrificationFlexLedger({
    regionId: 'VIC',
    renewableAttributeRelief: 2.3,
    carbonMarketIntegrityRelief: 2.2,
    attributeBand: 'pilot_attribute_trace',
    integrityBand: 'pilot_integrity',
    flexibleLoadRelief: 2.2,
    transmissionCongestionRelief: 2.3,
    renewableShareScore: 47,
    completedProjectTypes: ['industrial_load_flex_corridor'],
    prev: null,
  });
  const persistB = computeRegionalIndustrialElectrificationFlexLedger({
    regionId: 'VIC',
    renewableAttributeRelief: 2.3,
    carbonMarketIntegrityRelief: 2.2,
    attributeBand: 'pilot_attribute_trace',
    integrityBand: 'pilot_integrity',
    flexibleLoadRelief: 2.2,
    transmissionCongestionRelief: 2.3,
    renewableShareScore: 47,
    completedProjectTypes: ['industrial_load_flex_corridor'],
    prev: persistA.next,
  });
  ok(persistB.next.flexIndex >= persistA.next.flexIndex * 0.7);

  const turnSc = runAgent13FlexInterconnectionTurnScenario(V1014_FLEX_INTERCONNECTION_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastFlexRelief >= 1.7);

  const gi = scoreAgent13FlexInterconnectionGIAlignment({
    actionText: 'Process-heat electrification hub with HVDC link orchestration and industrial load-flex corridor',
    flexBand: 'electrification_corridor',
    interconnectionBand: 'interconnection_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13FlexInterconnectionTurnStep {
  turn: number;
  regionId: string;
  renewableAttributeRelief: number;
  carbonMarketIntegrityRelief: number;
  flexibleLoadRelief: number;
  transmissionCongestionRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  merchantStorageRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13FlexInterconnectionTurnScenario {
  id: string;
  label: string;
  steps: Agent13FlexInterconnectionTurnStep[];
  expect: { minFlexReliefOnLast?: number; minInterconnectionReliefOnLast?: number; lastFlexBand?: V1014IndustrialElectrificationFlexBand };
}

export const V1014_FLEX_INTERCONNECTION_TURN_SCENARIOS: readonly Agent13FlexInterconnectionTurnScenario[] = [
  {
    id: 'sc_fi_nsw_escalation',
    label: 'NSW federated flex with deep interconnection mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        renewableAttributeRelief: 2.1,
        carbonMarketIntegrityRelief: 2,
        flexibleLoadRelief: 2.1,
        transmissionCongestionRelief: 2,
        renewableShareScore: 43,
        gridStressPoints: 16,
        merchantStorageRelief: 2.1,
        completedProjectTypes: ['process_heat_electrification_hub', 'hvdc_link_orchestration_hub'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        renewableAttributeRelief: 2.5,
        carbonMarketIntegrityRelief: 2.4,
        flexibleLoadRelief: 2.4,
        transmissionCongestionRelief: 2.4,
        renewableShareScore: 49,
        gridStressPoints: 15,
        merchantStorageRelief: 2.4,
        completedProjectTypes: ['industrial_load_flex_corridor', 'rez_spill_interconnection_mesh'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        renewableAttributeRelief: 2.9,
        carbonMarketIntegrityRelief: 2.8,
        flexibleLoadRelief: 2.7,
        transmissionCongestionRelief: 2.8,
        renewableShareScore: 55,
        gridStressPoints: 13,
        merchantStorageRelief: 2.7,
        completedProjectTypes: [
          'process_heat_electrification_hub',
          'industrial_load_flex_corridor',
          'behind_meter_industrial_flex_mesh',
          'federation_industrial_electrification_tie',
          'hvdc_link_orchestration_hub',
          'rez_spill_interconnection_mesh',
          'cross_border_capacity_corridor',
          'merchant_interconnection_stacking_layer',
        ],
      },
    ],
    expect: { minFlexReliefOnLast: 1.7, minInterconnectionReliefOnLast: 1.4, lastFlexBand: 'electrification_corridor' },
  },
] as const;

export function runAgent13FlexInterconnectionTurnScenario(
  scenario: Agent13FlexInterconnectionTurnScenario,
): { passed: boolean; detail: string; lastFlexRelief: number; lastInterconnectionRelief: number } {
  let flexMem: V1014IndustrialElectrificationFlexPersistedSlice | null = null;
  let linkMem: V1014InterregionalInterconnectionPersistedSlice | null = null;
  let lastFlexRelief = 0;
  let lastInterconnectionRelief = 0;
  let lastBand: V1014IndustrialElectrificationFlexBand = 'fossil_locked_load';

  for (const step of scenario.steps) {
    const flex = computeRegionalIndustrialElectrificationFlexLedger({
      regionId: step.regionId,
      renewableAttributeRelief: step.renewableAttributeRelief,
      carbonMarketIntegrityRelief: step.carbonMarketIntegrityRelief,
      attributeBand: 'attribute_corridor',
      integrityBand: 'integrity_hub',
      flexibleLoadRelief: step.flexibleLoadRelief,
      transmissionCongestionRelief: step.transmissionCongestionRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: flexMem,
    });
    flexMem = flex.next;
    lastFlexRelief = flex.ledger.industrialElectrificationFlexRelief;
    lastBand = flex.ledger.band;

    const interconnection = advanceRegionalInterregionalInterconnectionOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      flexBand: flex.ledger.band,
      merchantStorageRelief: step.merchantStorageRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: linkMem,
    });
    linkMem = interconnection.next;
    lastInterconnectionRelief = interconnection.ledger.interregionalInterconnectionRelief;
  }

  if (scenario.expect.minFlexReliefOnLast != null && lastFlexRelief < scenario.expect.minFlexReliefOnLast) {
    return { passed: false, detail: `flex relief ${lastFlexRelief}`, lastFlexRelief, lastInterconnectionRelief };
  }
  if (scenario.expect.minInterconnectionReliefOnLast != null && lastInterconnectionRelief < scenario.expect.minInterconnectionReliefOnLast) {
    return { passed: false, detail: `link relief ${lastInterconnectionRelief}`, lastFlexRelief, lastInterconnectionRelief };
  }
  if (scenario.expect.lastFlexBand != null) {
    const allowed: V1014IndustrialElectrificationFlexBand[] = [scenario.expect.lastFlexBand];
    if (scenario.expect.lastFlexBand === 'electrification_corridor') allowed.push('federated_industrial_flex_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand}`, lastFlexRelief, lastInterconnectionRelief };
    }
  }

  return { passed: true, detail: 'ok', lastFlexRelief, lastInterconnectionRelief };
}

export function scoreAgent13FlexInterconnectionGIAlignment(params: {
  actionText: string;
  flexBand?: string;
  interconnectionBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'electrification',
    'process-heat',
    'process heat',
    'load-flex',
    'load flex',
    'hvdc',
    'interconnection',
    'rez spill',
    'cross-border capacity',
    'behind-the-meter',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.16, 0, 2);
  if (params.flexBand === 'federated_industrial_flex_leader' || params.flexBand === 'electrification_corridor') {
    delta += hits.some(h => h.includes('electrification') || h.includes('flex') || h.includes('heat')) ? 0.33 : 0.08;
  }
  if (params.interconnectionBand === 'interconnection_hub' || params.interconnectionBand === 'deep_interconnection_mesh') {
    delta += hits.some(h => h.includes('interconnection') || h.includes('hvdc') || h.includes('rez')) ? 0.31 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason: delta > 0.25 ? `Flex interconnection GI: ${hits.slice(0, 2).join(', ')} aligns with industrial flex and grid link depth.` : null,
  };
}
