/**
 * Agent 13 scale wave round 41 (O10-213) — compound safeguard trade-exposed buffer & decarbon certificate stacking federation orchestration depth.
 */

export type V1014SafeguardTradeBufferBand =
  | 'unshielded_exposure'
  | 'pilot_trade_buffer'
  | 'trade_exposed_buffer_hub'
  | 'federated_safeguard_trade_leader';

export type V1014DecarbonCertificateStackBand =
  | 'fragmented_credits'
  | 'pilot_certificate_stack'
  | 'certificate_stack_hub'
  | 'deep_integrity_stack_mesh';

export interface V1014SafeguardTradeBufferInstrument {
  id: string;
  kind: 'trade_exposed_buffer_hub' | 'safeguard_mechanism_corridor' | 'border_adjustment_readiness_mesh' | 'federation_safeguard_tie';
  label: string;
  bufferScoreEq: number;
  bufferReliefFactor: number;
  certificateStackSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SAFEGUARD_TRADE_BUFFER_CATALOG: readonly V1014SafeguardTradeBufferInstrument[] = [
  {
    id: 'stb_hub',
    kind: 'trade_exposed_buffer_hub',
    label: 'Trade-exposed safeguard buffer hub',
    bufferScoreEq: 46,
    bufferReliefFactor: 0.16,
    certificateStackSynergyFactor: 0.11,
    projectTypeHint: 'trade_exposed_safeguard_buffer_hub',
  },
  {
    id: 'stb_mech',
    kind: 'safeguard_mechanism_corridor',
    label: 'Safeguard mechanism federation corridor',
    bufferScoreEq: 44,
    bufferReliefFactor: 0.15,
    certificateStackSynergyFactor: 0.12,
    projectTypeHint: 'safeguard_mechanism_federation_corridor',
  },
  {
    id: 'stb_border',
    kind: 'border_adjustment_readiness_mesh',
    label: 'Border-adjustment readiness mesh',
    bufferScoreEq: 48,
    bufferReliefFactor: 0.17,
    certificateStackSynergyFactor: 0.1,
    projectTypeHint: 'border_adjustment_readiness_mesh',
  },
  {
    id: 'stb_fed',
    kind: 'federation_safeguard_tie',
    label: 'Federation safeguard trade tie',
    bufferScoreEq: 50,
    bufferReliefFactor: 0.16,
    certificateStackSynergyFactor: 0.13,
    projectTypeHint: 'federation_safeguard_trade_tie',
  },
] as const;

export interface V1014DecarbonCertificateStackTemplate {
  id: string;
  kind: 'granular_certificate_stack' | 'renewable_attribute_mesh' | 'safeguard_credit_integrity_hub' | 'hard_to_abate_stack_corridor';
  label: string;
  stackScoreEq: number;
  stackReliefFactor: number;
  bufferSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_DECARBON_CERTIFICATE_STACK_CATALOG: readonly V1014DecarbonCertificateStackTemplate[] = [
  {
    id: 'dcs_granular',
    kind: 'granular_certificate_stack',
    label: 'Granular certificate stacking hub',
    stackScoreEq: 45,
    stackReliefFactor: 0.15,
    bufferSynergyFactor: 0.11,
    projectTypeHint: 'granular_certificate_stacking_hub',
  },
  {
    id: 'dcs_attr',
    kind: 'renewable_attribute_mesh',
    label: 'Renewable attribute integrity mesh',
    stackScoreEq: 47,
    stackReliefFactor: 0.16,
    bufferSynergyFactor: 0.1,
    projectTypeHint: 'renewable_attribute_integrity_mesh',
  },
  {
    id: 'dcs_safeguard',
    kind: 'safeguard_credit_integrity_hub',
    label: 'Safeguard credit integrity hub',
    stackScoreEq: 49,
    stackReliefFactor: 0.17,
    bufferSynergyFactor: 0.12,
    projectTypeHint: 'safeguard_credit_integrity_hub',
  },
  {
    id: 'dcs_abate',
    kind: 'hard_to_abate_stack_corridor',
    label: 'Hard-to-abate certificate stack corridor',
    stackScoreEq: 51,
    stackReliefFactor: 0.16,
    bufferSynergyFactor: 0.13,
    projectTypeHint: 'hard_to_abate_certificate_stack_corridor',
  },
] as const;

export interface V1014RegionalSafeguardTradeBufferLedger {
  regionId: string;
  band: V1014SafeguardTradeBufferBand;
  bufferIndex: number;
  bufferBalance: number;
  safeguardTradeBufferRelief: number;
  summary: string;
}

export interface V1014RegionalDecarbonCertificateStackLedger {
  regionId: string;
  band: V1014DecarbonCertificateStackBand;
  stackIndex: number;
  decarbonCertificateStackRelief: number;
  summary: string;
}

export interface V1014SafeguardTradeBufferPersistedSlice {
  bufferBalance: number;
  bufferIndex: number;
}

export interface V1014DecarbonCertificateStackPersistedSlice {
  stackIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const TRADE_EXPOSED_REGIONS = new Set(['NSW', 'VIC', 'QLD', 'WA', 'SA']);

export function computeRegionalSafeguardTradeBufferLedger(params: {
  regionId: string;
  industrialThermalFederationRelief: number;
  geothermalBasinHeatRelief: number;
  carbonMarketIntegrityRelief: number;
  netZeroPathwayRelief: number;
  scope3HardToAbateRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014SafeguardTradeBufferPersistedSlice | null;
}): { ledger: V1014RegionalSafeguardTradeBufferLedger; next: V1014SafeguardTradeBufferPersistedSlice } {
  let bufferGain = 0;
  let bufferProxy = 0;
  let stackSynergy = 0;
  for (const inst of V1014_SAFEGUARD_TRADE_BUFFER_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      bufferGain += inst.bufferScoreEq;
      bufferProxy += inst.bufferReliefFactor;
      stackSynergy += inst.certificateStackSynergyFactor;
    }
  }
  if (TRADE_EXPOSED_REGIONS.has(params.regionId)) bufferProxy += 0.06;
  else bufferProxy *= 0.7;
  if (params.industrialThermalFederationRelief > 2.3) bufferGain += clamp(params.industrialThermalFederationRelief * 0.58, 0, 7);
  if (params.geothermalBasinHeatRelief > 2.3) stackSynergy += clamp(params.geothermalBasinHeatRelief * 0.008, 0, 0.05);
  if (params.carbonMarketIntegrityRelief > 2.4) bufferProxy += clamp(params.carbonMarketIntegrityRelief * 0.008, 0, 0.05);
  if (params.netZeroPathwayRelief > 2.3) bufferGain += clamp(params.netZeroPathwayRelief * 0.52, 0, 6);
  if (params.scope3HardToAbateRelief > 2.4) stackSynergy += clamp(params.scope3HardToAbateRelief * 0.009, 0, 0.05);
  bufferProxy += clamp(params.renewableShareScore / 110, 0, 0.08);

  const prevIdx = params.prev?.bufferIndex ?? 0;
  const prevBal = params.prev?.bufferBalance ?? 0;
  const bufferBalance = clamp(prevBal * 0.82 + bufferGain * 0.1, 0, 252);
  const bufferIndex = clamp(
    prevIdx * 0.79 + bufferBalance * 0.09 + bufferProxy * 75 + stackSynergy * 23,
    0,
    195,
  );

  let band: V1014SafeguardTradeBufferBand = 'unshielded_exposure';
  if (bufferIndex >= 122 || bufferGain >= 140) band = 'federated_safeguard_trade_leader';
  else if (bufferIndex >= 82 || bufferGain >= 95) band = 'trade_exposed_buffer_hub';
  else if (bufferIndex >= 39 || bufferGain >= 37) band = 'pilot_trade_buffer';

  let safeguardTradeBufferRelief = clamp(bufferProxy * 7.7 + bufferGain * 0.025 + stackSynergy * 4.6, 0, 10.1);
  if (band === 'unshielded_exposure') safeguardTradeBufferRelief *= 0.17;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      bufferIndex: clamp(bufferIndex, 0, 195),
      bufferBalance: clamp(bufferBalance, 0, 252),
      safeguardTradeBufferRelief: clamp(safeguardTradeBufferRelief, 0, 10.1),
      summary: `${params.regionId} safeguard trade ${band} · idx ${bufferIndex.toFixed(0)} · relief ${safeguardTradeBufferRelief.toFixed(1)}`,
    },
    next: {
      bufferBalance: clamp(bufferBalance, 0, 252),
      bufferIndex: clamp(bufferIndex, 0, 195),
    },
  };
}

export function advanceRegionalDecarbonCertificateStackOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  tradeBufferBand: V1014SafeguardTradeBufferBand;
  greenProductPassportRelief: number;
  climateDisclosureRelief: number;
  completedProjectTypes: string[];
  prev?: V1014DecarbonCertificateStackPersistedSlice | null;
}): { ledger: V1014RegionalDecarbonCertificateStackLedger; next: V1014DecarbonCertificateStackPersistedSlice } {
  let stackGain = 0;
  let stackProxy = 0;
  let bufferSynergy = 0;
  for (const tpl of V1014_DECARBON_CERTIFICATE_STACK_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      stackGain += tpl.stackScoreEq;
      stackProxy += tpl.stackReliefFactor;
      bufferSynergy += tpl.bufferSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('trade_exposed_carbon_credit_stack')) {
    stackGain += 11;
    stackProxy += 0.04;
  }
  if (params.tradeBufferBand === 'trade_exposed_buffer_hub' || params.tradeBufferBand === 'federated_safeguard_trade_leader') {
    stackGain += 18;
    bufferSynergy += 0.12;
  }
  if (params.greenProductPassportRelief > 2.3) {
    stackGain += params.greenProductPassportRelief * 0.55;
    stackProxy += clamp(params.greenProductPassportRelief * 0.007, 0, 0.04);
  }
  if (params.climateDisclosureRelief > 2.2) bufferSynergy += clamp(params.climateDisclosureRelief * 0.008, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.14, 0, 6);
  const prevIdx = params.prev?.stackIndex ?? 0;
  const stackIndex = clamp(
    prevIdx * 0.8 + stackGain * 0.1 + stackProxy * 24 - stressLoad * 0.02 + bufferSynergy * 23,
    0,
    197,
  );

  let band: V1014DecarbonCertificateStackBand = 'fragmented_credits';
  if (stackIndex >= 127 || stackGain >= 150) band = 'deep_integrity_stack_mesh';
  else if (stackIndex >= 87 || stackGain >= 104) band = 'certificate_stack_hub';
  else if (stackIndex >= 42 || stackGain >= 40) band = 'pilot_certificate_stack';

  let decarbonCertificateStackRelief = clamp(stackIndex / 18 + stackProxy * 6.1 + bufferSynergy * 6.3, 0, 10);
  if (band === 'fragmented_credits') decarbonCertificateStackRelief = clamp(decarbonCertificateStackRelief * 0.15, 0, 1.6);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      stackIndex: clamp(stackIndex, 0, 197),
      decarbonCertificateStackRelief: clamp(decarbonCertificateStackRelief, 0, 10),
      summary: `${params.regionId} cert stack ${band} · idx ${stackIndex.toFixed(0)} · relief ${decarbonCertificateStackRelief.toFixed(1)}`,
    },
    next: { stackIndex: clamp(stackIndex, 0, 197) },
  };
}

export function runAgent13SafeguardCertificateScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_SAFEGUARD_TRADE_BUFFER_CATALOG.length >= 4);
  ok(V1014_DECARBON_CERTIFICATE_STACK_CATALOG.length >= 4);

  const buf = computeRegionalSafeguardTradeBufferLedger({
    regionId: 'NSW',
    industrialThermalFederationRelief: 2.5,
    geothermalBasinHeatRelief: 2.4,
    carbonMarketIntegrityRelief: 2.6,
    netZeroPathwayRelief: 2.5,
    scope3HardToAbateRelief: 2.5,
    renewableShareScore: 53,
    completedProjectTypes: ['trade_exposed_safeguard_buffer_hub', 'federation_safeguard_trade_tie'],
  });
  ok(buf.ledger.safeguardTradeBufferRelief >= 1.4 || buf.ledger.band !== 'unshielded_exposure');

  const stack = advanceRegionalDecarbonCertificateStackOrchestration({
    regionId: 'NSW',
    gridStressPoints: 14,
    tradeBufferBand: buf.ledger.band,
    greenProductPassportRelief: 2.5,
    climateDisclosureRelief: 2.4,
    completedProjectTypes: ['safeguard_credit_integrity_hub', 'hard_to_abate_certificate_stack_corridor'],
  });
  ok(stack.ledger.decarbonCertificateStackRelief >= 1.2 || stack.ledger.band !== 'fragmented_credits');

  const turnSc = runAgent13SafeguardCertificateTurnScenario(V1014_SAFEGUARD_CERTIFICATE_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13SafeguardCertificateGIAlignment({
    actionText: 'Trade-exposed safeguard buffer hub with safeguard credit integrity and hard-to-abate certificate stack corridor',
    tradeBufferBand: 'trade_exposed_buffer_hub',
    certificateStackBand: 'certificate_stack_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13SafeguardCertificateTurnStep {
  turn: number;
  regionId: string;
  industrialThermalFederationRelief: number;
  geothermalBasinHeatRelief: number;
  carbonMarketIntegrityRelief: number;
  netZeroPathwayRelief: number;
  scope3HardToAbateRelief: number;
  greenProductPassportRelief: number;
  climateDisclosureRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13SafeguardCertificateTurnScenario {
  id: string;
  label: string;
  steps: Agent13SafeguardCertificateTurnStep[];
  expect: { minBufferReliefOnLast?: number; minStackReliefOnLast?: number };
}

export const V1014_SAFEGUARD_CERTIFICATE_TURN_SCENARIOS: readonly Agent13SafeguardCertificateTurnScenario[] = [
  {
    id: 'sc_sc_nsw_escalation',
    label: 'NSW safeguard trade buffer with certificate stack mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        industrialThermalFederationRelief: 1.9,
        geothermalBasinHeatRelief: 1.8,
        carbonMarketIntegrityRelief: 2,
        netZeroPathwayRelief: 1.9,
        scope3HardToAbateRelief: 1.9,
        greenProductPassportRelief: 1.8,
        climateDisclosureRelief: 1.7,
        renewableShareScore: 43,
        gridStressPoints: 17,
        completedProjectTypes: ['trade_exposed_safeguard_buffer_hub', 'granular_certificate_stacking_hub'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        industrialThermalFederationRelief: 2.2,
        geothermalBasinHeatRelief: 2.1,
        carbonMarketIntegrityRelief: 2.3,
        netZeroPathwayRelief: 2.2,
        scope3HardToAbateRelief: 2.2,
        greenProductPassportRelief: 2.1,
        climateDisclosureRelief: 2,
        renewableShareScore: 49,
        gridStressPoints: 16,
        completedProjectTypes: ['safeguard_mechanism_federation_corridor', 'renewable_attribute_integrity_mesh'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        industrialThermalFederationRelief: 2.6,
        geothermalBasinHeatRelief: 2.5,
        carbonMarketIntegrityRelief: 2.7,
        netZeroPathwayRelief: 2.6,
        scope3HardToAbateRelief: 2.6,
        greenProductPassportRelief: 2.5,
        climateDisclosureRelief: 2.4,
        renewableShareScore: 55,
        gridStressPoints: 14,
        completedProjectTypes: [
          'trade_exposed_safeguard_buffer_hub',
          'safeguard_mechanism_federation_corridor',
          'border_adjustment_readiness_mesh',
          'federation_safeguard_trade_tie',
          'granular_certificate_stacking_hub',
          'renewable_attribute_integrity_mesh',
          'safeguard_credit_integrity_hub',
          'hard_to_abate_certificate_stack_corridor',
          'trade_exposed_carbon_credit_stack',
        ],
      },
    ],
    expect: { minBufferReliefOnLast: 1.4, minStackReliefOnLast: 1.1 },
  },
] as const;

export function runAgent13SafeguardCertificateTurnScenario(
  scenario: Agent13SafeguardCertificateTurnScenario,
): { passed: boolean; detail: string; lastBufferRelief: number; lastStackRelief: number } {
  let bufMem: V1014SafeguardTradeBufferPersistedSlice | null = null;
  let stackMem: V1014DecarbonCertificateStackPersistedSlice | null = null;
  let lastBufferRelief = 0;
  let lastStackRelief = 0;

  for (const step of scenario.steps) {
    const buf = computeRegionalSafeguardTradeBufferLedger({
      regionId: step.regionId,
      industrialThermalFederationRelief: step.industrialThermalFederationRelief,
      geothermalBasinHeatRelief: step.geothermalBasinHeatRelief,
      carbonMarketIntegrityRelief: step.carbonMarketIntegrityRelief,
      netZeroPathwayRelief: step.netZeroPathwayRelief,
      scope3HardToAbateRelief: step.scope3HardToAbateRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: bufMem,
    });
    bufMem = buf.next;
    lastBufferRelief = buf.ledger.safeguardTradeBufferRelief;

    const stack = advanceRegionalDecarbonCertificateStackOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      tradeBufferBand: buf.ledger.band,
      greenProductPassportRelief: step.greenProductPassportRelief,
      climateDisclosureRelief: step.climateDisclosureRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: stackMem,
    });
    stackMem = stack.next;
    lastStackRelief = stack.ledger.decarbonCertificateStackRelief;
  }

  if (scenario.expect.minBufferReliefOnLast != null && lastBufferRelief < scenario.expect.minBufferReliefOnLast) {
    return { passed: false, detail: `buf ${lastBufferRelief}`, lastBufferRelief, lastStackRelief };
  }
  if (scenario.expect.minStackReliefOnLast != null && lastStackRelief < scenario.expect.minStackReliefOnLast) {
    return { passed: false, detail: `stack ${lastStackRelief}`, lastBufferRelief, lastStackRelief };
  }
  return { passed: true, detail: 'ok', lastBufferRelief, lastStackRelief };
}

export function scoreAgent13SafeguardCertificateGIAlignment(params: {
  actionText: string;
  tradeBufferBand?: string;
  certificateStackBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'safeguard',
    'trade-exposed',
    'trade exposed',
    'border adjustment',
    'certificate stack',
    'credit integrity',
    'hard-to-abate',
    'hard to abate',
    'granular certificate',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.13, 0, 2);
  if (params.tradeBufferBand === 'federated_safeguard_trade_leader' || params.tradeBufferBand === 'trade_exposed_buffer_hub') {
    delta += hits.some(h => h.includes('safeguard') || h.includes('trade')) ? 0.34 : 0.08;
  }
  if (params.certificateStackBand === 'certificate_stack_hub' || params.certificateStackBand === 'deep_integrity_stack_mesh') {
    delta += hits.some(h => h.includes('certificate') || h.includes('credit') || h.includes('abate')) ? 0.32 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Safeguard certificate GI: ${hits.slice(0, 2).join(', ')} aligns with trade-exposed buffer and decarbon certificate stacking depth.`
        : null,
  };
}
