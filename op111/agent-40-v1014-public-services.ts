// Operation 111 · Agent 40 — V10.14 Public Services & Civic Delivery (Phase 1 core)
// Merge target: insert as SECTION 20AG in `(V9.4) australia-game-with-ai.tsx` before SECTION 21B.

// ============================================================================
// SECTION 20AG: V10.14 PUBLIC SERVICES & CIVIC DELIVERY
// ============================================================================
// ARCHITECTURAL OWNERSHIP (Phase 1):
// - V10.11 remains authoritative for institutional coordination & delivery load.
// - V10.12 remains authoritative for fiscal capacity & revenue (never collects tax here).
// - V10.13 remains authoritative for household living standards & essential-access bands.
// - Living Regions remains authoritative for regional economy / development bands.
// - V10.14 interprets **service delivery quality & civic access** from those systems — it does
//   NOT spawn service actors, municipal budgets, or hospital/education micromanagement simulators.
// - No new AP costs, no player wallet debits, no hard action blocks (Guardian uses warn-only hooks in Phase 2).

export const V1014_SCHEMA_VERSION = '10.14.0';

export const V1014_CORE_REGIONS: readonly string[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;

export const V1014_LIMITS = {
  maxHistory: 20,
  maxTransitions: 12,
  maxRegionalRows: 8,
  hysteresisDeadband: 2.5
} as const;

export type PublicServiceDomain =
  | 'health'
  | 'education'
  | 'emergency_response'
  | 'justice_administration'
  | 'local_civic';

export const PUBLIC_SERVICE_DOMAINS: readonly PublicServiceDomain[] = [
  'health',
  'education',
  'emergency_response',
  'justice_administration',
  'local_civic'
] as const;

export const PUBLIC_SERVICE_DOMAIN_LABEL: Record<PublicServiceDomain, string> = {
  health: 'Health & Hospitals',
  education: 'Schools & Education',
  emergency_response: 'Emergency & Rescue',
  justice_administration: 'Justice & Administration',
  local_civic: 'Local Civic Services'
};

export type ServiceDeliveryBand =
  | 'critical'
  | 'strained'
  | 'adequate'
  | 'strong'
  | 'excellent';

export const SERVICE_DELIVERY_BANDS: readonly ServiceDeliveryBand[] = [
  'critical',
  'strained',
  'adequate',
  'strong',
  'excellent'
] as const;

export const SERVICE_DELIVERY_RANK: Record<ServiceDeliveryBand, number> = {
  critical: 0,
  strained: 1,
  adequate: 2,
  strong: 3,
  excellent: 4
};

export const SERVICE_DELIVERY_LABEL: Record<ServiceDeliveryBand, string> = {
  critical: 'Critical gaps',
  strained: 'Strained',
  adequate: 'Adequate',
  strong: 'Strong',
  excellent: 'Excellent'
};

export type CivicAccessBand = ServiceDeliveryBand;

export interface PublicServicesRegionalRow {
  regionId: string;
  overall: ServiceDeliveryBand;
  domains: Record<PublicServiceDomain, ServiceDeliveryBand>;
  accessScore: number;
  backlogPressure: number;
  explanation: string;
}

export interface PublicServicesNationalSnapshot {
  overall: ServiceDeliveryBand;
  civicAccess: CivicAccessBand;
  accessScore: number;
  backlogPressure: number;
  domains: Record<PublicServiceDomain, ServiceDeliveryBand>;
  strainedRegions: string[];
  leadingRegions: string[];
  summary: string;
}

export interface PublicServicesTransition {
  id: string;
  turn: number;
  domain: PublicServiceDomain | 'national';
  fromBand: ServiceDeliveryBand;
  toBand: ServiceDeliveryBand;
  regionId: string | null;
  reason: string;
}

export interface PublicServicesPersisted {
  schemaVersion: string;
  revision: number;
  lastInputHash: string;
  lastTurn: number;
  domainBands: Record<PublicServiceDomain, ServiceDeliveryBand>;
  nationalOverallBand?: ServiceDeliveryBand;
  regionalBandMemory: Record<string, ServiceDeliveryBand>;
  transitions: PublicServicesTransition[];
  history: Array<{ turn: number; overall: ServiceDeliveryBand; accessScore: number }>;
}

export interface PublicServicesSystemInputs {
  turn: number;
  enabled: boolean;
  regions?: Record<string, unknown>;
  livingRegions?: unknown;
  stateCapacity?: { national?: { coordinationLoad?: number; deliveryReadiness?: number } } | null;
  publicFinance?: { national?: { fiscalHeadroomBand?: string; maintenancePressure?: number } } | null;
  households?: { national?: { essentialAccess?: string; affordability?: string } } | null;
  publicStabilityScore?: number | null;
  completedInfrastructureSupport?: number;
  activeCrises?: number;
}

export interface NationalPublicServicesState {
  schemaVersion: string;
  revision: number;
  turn: number;
  enabled: boolean;
  inputHash: string;
  national: PublicServicesNationalSnapshot;
  regions: PublicServicesRegionalRow[];
  transitions: PublicServicesTransition[];
  warnings: string[];
}

export function v1014Clamp(v: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, Number.isFinite(v) ? v : lo));
}

function bandFromScore(score: number, prev?: ServiceDeliveryBand, hasPrev?: boolean): ServiceDeliveryBand {
  const raw: ServiceDeliveryBand =
    score >= 82 ? 'excellent' : score >= 68 ? 'strong' : score >= 52 ? 'adequate' : score >= 36 ? 'strained' : 'critical';
  if (!hasPrev || !prev || prev === raw) return raw;
  const db = V1014_LIMITS.hysteresisDeadband;
  if (prev === 'strong' && raw === 'adequate' && score >= 68 - db) return 'strong';
  if (prev === 'adequate' && raw === 'strained' && score >= 52 - db) return 'adequate';
  return raw;
}

export function createInitialPublicServicesPersisted(turn = 1): PublicServicesPersisted {
  const base: ServiceDeliveryBand = 'adequate';
  const domainBands = Object.fromEntries(PUBLIC_SERVICE_DOMAINS.map(d => [d, base])) as Record<
    PublicServiceDomain,
    ServiceDeliveryBand
  >;
  return {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: 0,
    lastInputHash: '',
    lastTurn: Math.max(1, turn),
    domainBands,
    nationalOverallBand: base,
    regionalBandMemory: {},
    transitions: [],
    history: []
  };
}

export function sanitizePublicServicesPersisted(raw: unknown, turn = 1): PublicServicesPersisted | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<PublicServicesPersisted>;
  const init = createInitialPublicServicesPersisted(turn);
  const domainBands = { ...init.domainBands };
  if (r.domainBands && typeof r.domainBands === 'object') {
    for (const d of PUBLIC_SERVICE_DOMAINS) {
      const b = (r.domainBands as Record<string, string>)[d];
      if (SERVICE_DELIVERY_BANDS.includes(b as ServiceDeliveryBand)) domainBands[d] = b as ServiceDeliveryBand;
    }
  }
  const regionalBandMemory: Record<string, ServiceDeliveryBand> = {};
  if (r.regionalBandMemory && typeof r.regionalBandMemory === 'object') {
    for (const [k, v] of Object.entries(r.regionalBandMemory)) {
      if (V1014_CORE_REGIONS.includes(k) && SERVICE_DELIVERY_BANDS.includes(v as ServiceDeliveryBand)) {
        regionalBandMemory[k] = v as ServiceDeliveryBand;
      }
    }
  }
  return {
    schemaVersion: String(r.schemaVersion || V1014_SCHEMA_VERSION),
    revision: Math.max(0, Math.floor(Number(r.revision) || 0)),
    lastInputHash: String(r.lastInputHash || ''),
    lastTurn: Math.max(1, Math.floor(Number(r.lastTurn) || turn)),
    domainBands,
    nationalOverallBand: SERVICE_DELIVERY_BANDS.includes(r.nationalOverallBand as ServiceDeliveryBand)
      ? (r.nationalOverallBand as ServiceDeliveryBand)
      : init.nationalOverallBand,
    regionalBandMemory,
    transitions: Array.isArray(r.transitions) ? r.transitions.slice(-V1014_LIMITS.maxTransitions) : [],
    history: Array.isArray(r.history) ? r.history.slice(-V1014_LIMITS.maxHistory) : []
  };
}

function stableJson(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return '';
  }
}

export function publicServicesInputHash(inputs: PublicServicesSystemInputs): string {
  return stableJson({
    turn: inputs.turn,
    enabled: inputs.enabled,
    sc: inputs.stateCapacity?.national?.deliveryReadiness ?? null,
    pf: inputs.publicFinance?.national?.fiscalHeadroomBand ?? null,
    hh: inputs.households?.national?.essentialAccess ?? null,
    stab: inputs.publicStabilityScore ?? null,
    infra: inputs.completedInfrastructureSupport ?? null,
    crises: inputs.activeCrises ?? 0
  });
}

export function buildPublicServicesInputs(params: {
  turn: number;
  gameState?: any;
  gameSettings?: any;
  stateCapacity?: unknown;
  publicFinance?: unknown;
  households?: unknown;
}): PublicServicesSystemInputs {
  const gs = params.gameState || {};
  const gset = params.gameSettings || {};
  const turn = Math.max(1, Math.floor(Number(params.turn) || 1));
  const ps = gs.publicStabilityState;
  const stability =
    typeof ps === 'number' ? ps : ps && typeof ps.nationalStability === 'number' ? Number(ps.nationalStability) : null;
  const crises = Array.isArray(gs.crisisChainState?.activeCrisisChains)
    ? gs.crisisChainState.activeCrisisChains.filter((c: any) => c && c.status !== 'resolved').length
    : 0;
  return {
    turn,
    enabled: gset.publicServicesEnabled !== false && gset.nationalSystemsEnabled !== false,
    regions: gs.regions,
    livingRegions: gs.livingRegions,
    stateCapacity: (params.stateCapacity || gs.stateCapacityState || gs.stateCapacity) as PublicServicesSystemInputs['stateCapacity'],
    publicFinance: (params.publicFinance || gs.publicFinanceState || gs.publicFinance) as PublicServicesSystemInputs['publicFinance'],
    households: (params.households || gs.householdEconomyState) as PublicServicesSystemInputs['households'],
    publicStabilityScore: stability,
    completedInfrastructureSupport: undefined,
    activeCrises: crises
  };
}

function domainScore(
  domain: PublicServiceDomain,
  inputs: PublicServicesSystemInputs,
  regionalBias = 0
): number {
  let score = 58 + regionalBias;
  const readiness = Number(inputs.stateCapacity?.national?.deliveryReadiness ?? 62);
  const headroom = inputs.publicFinance?.national?.fiscalHeadroomBand;
  const essential = inputs.households?.national?.essentialAccess;
  const stab = inputs.publicStabilityScore ?? 70;
  const infra = inputs.completedInfrastructureSupport ?? 65;
  const crises = inputs.activeCrises ?? 0;

  score += (readiness - 60) * 0.35;
  score += (infra - 60) * 0.15;
  score += (stab - 70) * 0.12;
  if (headroom === 'strained' || headroom === 'critical') score -= 6;
  if (headroom === 'strong' || headroom === 'comfortable') score += 4;
  if (essential === 'critical' || essential === 'poor') score -= domain === 'health' || domain === 'emergency_response' ? 10 : 4;
  if (essential === 'strong' || essential === 'excellent') score += 4;
  score -= Math.min(18, crises * 4);

  if (domain === 'education') score += 2;
  if (domain === 'emergency_response') score -= crises * 2;
  if (domain === 'justice_administration') score += (readiness - 60) * 0.08;
  if (domain === 'local_civic') score += (infra - 60) * 0.12;

  return v1014Clamp(score);
}

function pushTransition(
  list: PublicServicesTransition[],
  turn: number,
  domain: PublicServiceDomain | 'national',
  fromBand: ServiceDeliveryBand,
  toBand: ServiceDeliveryBand,
  regionId: string | null,
  reason: string
): void {
  if (fromBand === toBand) return;
  list.push({
    id: `ps_${domain}_${regionId || 'national'}_t${turn}_${list.length}`,
    turn,
    domain,
    fromBand,
    toBand,
    regionId,
    reason
  });
}

export function computeNationalPublicServices(
  inputs: PublicServicesSystemInputs,
  persistedRaw?: PublicServicesPersisted | null,
  previousState?: NationalPublicServicesState | null
): { state: NationalPublicServicesState; persisted: PublicServicesPersisted; events: PublicServicesTransition[] } {
  const turn = Math.max(1, Math.floor(Number(inputs.turn) || 1));
  const persisted = sanitizePublicServicesPersisted(persistedRaw, turn) || createInitialPublicServicesPersisted(turn);
  const hash = publicServicesInputHash(inputs);
  const events: PublicServicesTransition[] = [];

  if (!inputs.enabled) {
    const off: NationalPublicServicesState = {
      schemaVersion: V1014_SCHEMA_VERSION,
      revision: persisted.revision,
      turn,
      enabled: false,
      inputHash: hash,
      national: {
        overall: 'adequate',
        civicAccess: 'adequate',
        accessScore: 0,
        backlogPressure: 0,
        domains: { ...persisted.domainBands },
        strainedRegions: [],
        leadingRegions: [],
        summary: 'Public services module disabled.'
      },
      regions: [],
      transitions: [],
      warnings: []
    };
    return {
      state: off,
      persisted: { ...persisted, lastInputHash: hash, lastTurn: turn },
      events
    };
  }

  const domainBands = { ...persisted.domainBands };
  const newTransitions: PublicServicesTransition[] = [];
  for (const d of PUBLIC_SERVICE_DOMAINS) {
    const prev = domainBands[d];
    const score = domainScore(d, inputs);
    const next = bandFromScore(score, prev, persisted.revision > 0);
    domainBands[d] = next;
    pushTransition(newTransitions, turn, d, prev, next, null, `National ${PUBLIC_SERVICE_DOMAIN_LABEL[d]} score ${Math.round(score)}`);
  }

  const domainScores = PUBLIC_SERVICE_DOMAINS.map(d => domainScore(d, inputs));
  const nationalScore = v1014Clamp(domainScores.reduce((a, b) => a + b, 0) / domainScores.length);
  const prevNational = persisted.nationalOverallBand || previousState?.national.overall || 'adequate';
  const nationalOverall = bandFromScore(nationalScore, prevNational, persisted.revision > 0);
  pushTransition(newTransitions, turn, 'national', prevNational, nationalOverall, null, `Composite civic delivery ${Math.round(nationalScore)}`);

  const regions: PublicServicesRegionalRow[] = [];
  const strainedRegions: string[] = [];
  const leadingRegions: string[] = [];
  for (let i = 0; i < V1014_CORE_REGIONS.length; i++) {
    const regionId = V1014_CORE_REGIONS[i];
    const bias = (i % 3) * 2 - 2;
    const domMap = Object.fromEntries(
      PUBLIC_SERVICE_DOMAINS.map(d => {
        const s = domainScore(d, inputs, bias);
        const prevR = persisted.regionalBandMemory[regionId];
        const band = bandFromScore(s, prevR, Boolean(prevR));
        return [d, band];
      })
    ) as Record<PublicServiceDomain, ServiceDeliveryBand>;
    const avg = v1014Clamp(
      PUBLIC_SERVICE_DOMAINS.reduce((acc, d) => acc + SERVICE_DELIVERY_RANK[domMap[d]], 0) *
        (100 / (PUBLIC_SERVICE_DOMAINS.length * (SERVICE_DELIVERY_RANK.excellent || 4)))
    );
    const overall = bandFromScore(avg, persisted.regionalBandMemory[regionId], Boolean(persisted.regionalBandMemory[regionId]));
    if (SERVICE_DELIVERY_RANK[overall] <= 1) strainedRegions.push(regionId);
    if (SERVICE_DELIVERY_RANK[overall] >= 3) leadingRegions.push(regionId);
    regions.push({
      regionId,
      overall,
      domains: domMap,
      accessScore: Math.round(avg),
      backlogPressure: v1014Clamp(100 - avg + (inputs.activeCrises || 0) * 5),
      explanation: `${regionId}: ${SERVICE_DELIVERY_LABEL[overall]} public service delivery.`
    });
  }

  const backlogPressure = v1014Clamp(
    100 - nationalScore + Math.max(0, (inputs.stateCapacity?.national?.coordinationLoad ?? 40) - 55)
  );

  const national: PublicServicesNationalSnapshot = {
    overall: nationalOverall,
    civicAccess: nationalOverall,
    accessScore: Math.round(nationalScore),
    backlogPressure: Math.round(backlogPressure),
    domains: domainBands,
    strainedRegions: strainedRegions.slice(0, 6),
    leadingRegions: leadingRegions.slice(0, 6),
    summary:
      nationalOverall === 'excellent' || nationalOverall === 'strong'
        ? 'Core public services are keeping pace with national demand.'
        : nationalOverall === 'adequate'
        ? 'Public services are functional but uneven across regions and domains.'
        : 'Public service delivery is under pressure — backlog and access gaps are widening.'
  };

  const warnings: string[] = [];
  if (backlogPressure >= 70) warnings.push('National service backlog pressure is elevated.');
  if (strainedRegions.length >= 3) warnings.push('Multiple regions show strained civic delivery simultaneously.');

  const nextPersisted: PublicServicesPersisted = {
    ...persisted,
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: persisted.revision + 1,
    lastInputHash: hash,
    lastTurn: turn,
    domainBands,
    nationalOverallBand: nationalOverall,
    regionalBandMemory: Object.fromEntries(regions.map(r => [r.regionId, r.overall])),
    transitions: [...persisted.transitions, ...newTransitions].slice(-V1014_LIMITS.maxTransitions),
    history: [...persisted.history, { turn, overall: nationalOverall, accessScore: Math.round(nationalScore) }].slice(
      -V1014_LIMITS.maxHistory
    )
  };

  const state: NationalPublicServicesState = {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: nextPersisted.revision,
    turn,
    enabled: true,
    inputHash: hash,
    national,
    regions,
    transitions: newTransitions,
    warnings
  };

  events.push(...newTransitions);
  return { state, persisted: nextPersisted, events };
}

export function validatePublicServicesState(state: NationalPublicServicesState | null): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!state) return { valid: false, errors: ['null state'] };
  if (state.schemaVersion !== V1014_SCHEMA_VERSION) errors.push(`schema ${state.schemaVersion}`);
  if (!SERVICE_DELIVERY_BANDS.includes(state.national.overall)) errors.push('invalid national band');
  if (state.regions.length > V1014_CORE_REGIONS.length) errors.push('too many regions');
  return { valid: errors.length === 0, errors };
}

export function runV1014PublicServicesSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  results: Array<{ name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ name: string; passed: boolean; detail: string }> = [];
  const check = (name: string, ok: boolean, detail: string) => results.push({ name, passed: ok, detail });

  const baseInputs = (): PublicServicesSystemInputs => ({
    turn: 3,
    enabled: true,
    stateCapacity: { national: { deliveryReadiness: 66, coordinationLoad: 48 } },
    publicFinance: { national: { fiscalHeadroomBand: 'balanced' } },
    households: { national: { essentialAccess: 'adequate' } },
    publicStabilityScore: 72,
    completedInfrastructureSupport: 70,
    activeCrises: 0
  });

  check('PS01 schema version', V1014_SCHEMA_VERSION === '10.14.0', V1014_SCHEMA_VERSION);
  check('PS02 five domains', PUBLIC_SERVICE_DOMAINS.length === 5, String(PUBLIC_SERVICE_DOMAINS.length));
  check('PS03 disabled off state', computeNationalPublicServices({ turn: 1, enabled: false }).state.enabled === false, 'enabled=false');

  const r1 = computeNationalPublicServices(baseInputs(), createInitialPublicServicesPersisted());
  check('PS04 compute returns state', Boolean(r1.state.national.summary), r1.state.national.summary);
  check('PS05 validate clean', validatePublicServicesState(r1.state).valid, validatePublicServicesState(r1.state).errors.join(';'));

  const r2 = computeNationalPublicServices(baseInputs(), r1.persisted, r1.state);
  check('PS06 revision increments', r2.persisted.revision === r1.persisted.revision + 1, `${r1.persisted.revision}->${r2.persisted.revision}`);

  const crisisInp = { ...baseInputs(), activeCrises: 3 };
  const rc = computeNationalPublicServices(crisisInp, createInitialPublicServicesPersisted());
  const rn = computeNationalPublicServices(baseInputs(), createInitialPublicServicesPersisted());
  check(
    'PS07 crises reduce access',
    rc.state.national.accessScore <= rn.state.national.accessScore,
    `${rc.state.national.accessScore} vs ${rn.state.national.accessScore}`
  );

  const lowRead = { ...baseInputs(), stateCapacity: { national: { deliveryReadiness: 30, coordinationLoad: 80 } } };
  const rh = computeNationalPublicServices(baseInputs(), createInitialPublicServicesPersisted());
  const rl = computeNationalPublicServices(lowRead, createInitialPublicServicesPersisted());
  check(
    'PS08 low readiness hurts delivery',
    rl.state.national.accessScore < rh.state.national.accessScore,
    `${rl.state.national.accessScore} vs ${rh.state.national.accessScore}`
  );

  const dA = computeNationalPublicServices(baseInputs(), createInitialPublicServicesPersisted());
  const dB = computeNationalPublicServices(baseInputs(), createInitialPublicServicesPersisted());
  check('PS09 determinism', JSON.stringify(dA.state.national) === JSON.stringify(dB.state.national), 'national snapshot match');

  const san = sanitizePublicServicesPersisted({ schemaVersion: '10.14.0', revision: 2, domainBands: r1.persisted.domainBands });
  check('PS10 sanitize roundtrip', san?.revision === 2, String(san?.revision));

  check('PS11 eight regions', r1.state.regions.length === 8, String(r1.state.regions.length));
  check('PS12 hash stable', publicServicesInputHash(baseInputs()) === publicServicesInputHash(baseInputs()), 'hash');

  const built = buildPublicServicesInputs({ turn: 2, gameSettings: { publicServicesEnabled: true, nationalSystemsEnabled: true } });
  check('PS13 build enabled', built.enabled === true, String(built.enabled));

  const passed = results.filter(r => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}
