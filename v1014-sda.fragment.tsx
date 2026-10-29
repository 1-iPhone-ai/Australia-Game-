// ============================================================================
// SECTION 20AG: V10.14 STRATEGIC DECISION ARCHITECTURE — ACTIONS, CHAINS, POLICY TRADE-OFFS
// ----------------------------------------------------------------------------
// Player-initiated strategic commitments with prerequisites, multi-step decision chains,
// explicit policy trade-offs, and consequences wired to V10.0–V10.13 derived state.
// Never bypasses legality of canonical actions; adds bounded modifiers + World Reaction events.
// Deterministic: identical inputs + persisted memory → identical outcomes.
// ============================================================================

export const V1014_SCHEMA_VERSION = '10.14.0';

export const SDA_LIMITS = {
  history: 40, activePolicies: 24, activeChains: 8, modifiers: 32, cooldowns: 80,
  chainSteps: 6, evidence: 8, catalogPolicies: 96, catalogChains: 24
} as const;

export type SDADomain = 'economy' | 'infrastructure' | 'industry' | 'diplomacy' | 'workforce' | 'resilience' | 'governance' | 'domestic' | 'strategy';
export type SDAPrereqKind = 'min_cash' | 'min_net_worth' | 'network_condition' | 'resilience_band' | 'fiscal_band' | 'state_capacity_band' | 'priority_active' | 'megaproject_stage' | 'project_status' | 'region_control' | 'stability_band' | 'chain_step' | 'policy_not_active' | 'cooldown_clear';
export type SDAModifierKind = 'project_cost_pct' | 'project_speed_pct' | 'travel_cost_pct' | 'market_fee_pct' | 'deposit_bonus_pct' | 'stability_delta' | 'faction_goodwill_delta' | 'national_network_delta' | 'fiscal_pressure_delta' | 'workforce_readiness_delta' | 'domestic_demand_delta';
export type SDAChainStatus = 'available' | 'in_progress' | 'awaiting_choice' | 'completed' | 'failed' | 'abandoned';
export type SDAPolicyStatus = 'available' | 'active' | 'winding_down' | 'expired' | 'blocked';

export interface SDAPrerequisite { id: string; kind: SDAPrereqKind; label: string; target?: string; minRank?: number; minValue?: number; regionId?: string; projectId?: string; policyId?: string; chainId?: string; stepIndex?: number }
export interface SDATradeoff { benefit: string; cost: string; domains: SDADomain[]; magnitude: 'minor' | 'moderate' | 'major' }
export interface SDAModifierDef { kind: SDAModifierKind; value: number; durationTurns: number; regionId?: string; network?: NationalNetworkKind; label: string }
export interface SDAPolicyDefinition {
  id: string; title: string; summary: string; domain: SDADomain; icon: string;
  actionPointCost: number; cashCost: number; cooldownTurns: number; durationTurns: number;
  prerequisites: SDAPrerequisite[]; tradeoffs: SDATradeoff[]; modifiers: SDAModifierDef[];
  unlocksChainIds?: string[]; tags: string[]
}

export interface SDAChainStepDef {
  index: number; title: string; summary: string; policyId: string | null;
  choiceIds?: string[]; autoAdvanceTurns?: number; failIfAbandoned?: boolean
}
export interface SDAChainDefinition {
  id: string; title: string; summary: string; domain: SDADomain; icon: string;
  prerequisites: SDAPrerequisite[]; steps: SDAChainStepDef[]; completionModifiers: SDAModifierDef[]; tags: string[]
}

export interface SDAActivePolicy { definitionId: string; actorId: string; startedTurn: number; expiresTurn: number; status: SDAPolicyStatus; modifiers: SDAModifierDef[] }
export interface SDAActiveChain { definitionId: string; actorId: string; startedTurn: number; stepIndex: number; status: SDAChainStatus; pendingChoiceId: string | null; history: Array<{ turn: number; note: string }> }
export interface SDAHistoryEntry { id: string; turn: number; kind: 'policy_committed' | 'policy_expired' | 'chain_started' | 'chain_advanced' | 'chain_completed' | 'chain_failed' | 'chain_abandoned'; subjectId: string; summary: string; actorId: string }
export interface StrategicDecisionArchitecturePersisted {
  schemaVersion: typeof V1014_SCHEMA_VERSION; revision: number; lastUpdatedTurn: number;
  activePolicies: Record<string, SDAActivePolicy>; activeChains: Record<string, SDAActiveChain>;
  cooldowns: Record<string, number>; modifiers: SDAModifierDef[]; history: SDAHistoryEntry[]; inputHash: string
}

export interface SDAInputs {
  turn: number; actorId: string; cash: number; netWorth: number; currentRegion: string | null;
  national: NationalSystemsState | null; fiscal: NationalFiscalCapacityState | null; stateCapacity: NationalStateCapacityState | null;
  priorities: NationalPrioritiesState | null; megaprojects: MegaprojectsPersisted | null; projects: Record<string, InfrastructureProject>;
  stability: number; controlledRegions: string[]
}

export interface SDAEvaluation { definitionId: string; kind: 'policy' | 'chain'; eligible: boolean; blockedReasons: string[]; metPrerequisites: string[]; unmetPrerequisites: SDAPrerequisite[]; tradeoffs: SDATradeoff[] }
export interface StrategicDecisionArchitectureState {
  turn: number; revision: number; policies: SDAEvaluation[]; chains: SDAEvaluation[]; activePolicyCount: number; activeChainCount: number; dominantDomain: SDADomain | null; summary: string
}

const sdaR = (v: number, d = 1) => { const p = Math.pow(10, d); return Math.round((Number.isFinite(v) ? v : 0) * p) / p; };
const sdaClamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Number.isFinite(v) ? v : lo));

export function createEmptyStrategicDecisionArchitecturePersisted(): StrategicDecisionArchitecturePersisted {
  return { schemaVersion: V1014_SCHEMA_VERSION, revision: 0, lastUpdatedTurn: 0, activePolicies: {}, activeChains: {}, cooldowns: {}, modifiers: [], history: [], inputHash: '' };
}

const SDA_POLICY_FISCAL_DISCIPLINE: SDAPolicyDefinition = {
  id: 'fiscal_discipline', title: 'Fiscal Discipline', summary: 'Strategic economy commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'economy', icon: '💰',
  actionPointCost: 1, cashCost: 500, cooldownTurns: 2, durationTurns: 4,
  prerequisites: [
    { id: 'cash', kind: 'min_cash', label: 'Minimum cash reserves', minValue: 400 },
  ],
  tradeoffs: [
    { benefit: 'Improves economy outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['economy', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'deposit_bonus_pct', value: 0.05, durationTurns: 4, label: 'Fiscal Discipline effect' },
  ],
  unlocksChainIds: ['chain_economy_master'],
  tags: ['economy', 'v1014', 'policy']
};

const SDA_POLICY_GROWTH_STIMULUS: SDAPolicyDefinition = {
  id: 'growth_stimulus', title: 'Growth Stimulus', summary: 'Strategic economy commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'economy', icon: '💰',
  actionPointCost: 2, cashCost: 1000, cooldownTurns: 3, durationTurns: 5,
  prerequisites: [
    { id: 'cash', kind: 'min_cash', label: 'Minimum cash reserves', minValue: 400 },
  ],
  tradeoffs: [
    { benefit: 'Improves economy outcomes over 5 turns', cost: 'Raises short-term pressure elsewhere', domains: ['economy', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'deposit_bonus_pct', value: 0.07, durationTurns: 5, label: 'Growth Stimulus effect' },
  ],
  unlocksChainIds: [],
  tags: ['economy', 'v1014', 'policy']
};

const SDA_POLICY_SAVINGS_MOBILIZATION: SDAPolicyDefinition = {
  id: 'savings_mobilization', title: 'Savings Mobilization', summary: 'Strategic economy commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'economy', icon: '💰',
  actionPointCost: 3, cashCost: 1500, cooldownTurns: 4, durationTurns: 6,
  prerequisites: [
    { id: 'cash', kind: 'min_cash', label: 'Minimum cash reserves', minValue: 400 },
  ],
  tradeoffs: [
    { benefit: 'Improves economy outcomes over 6 turns', cost: 'Raises short-term pressure elsewhere', domains: ['economy', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'deposit_bonus_pct', value: 0.09, durationTurns: 6, label: 'Savings Mobilization effect' },
  ],
  unlocksChainIds: [],
  tags: ['economy', 'v1014', 'policy']
};

const SDA_POLICY_DEBT_RESTRUCTURE_PLAN: SDAPolicyDefinition = {
  id: 'debt_restructure_plan', title: 'Debt Restructure Plan', summary: 'Strategic economy commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'economy', icon: '💰',
  actionPointCost: 1, cashCost: 2000, cooldownTurns: 5, durationTurns: 7,
  prerequisites: [
    { id: 'cash', kind: 'min_cash', label: 'Minimum cash reserves', minValue: 400 },
  ],
  tradeoffs: [
    { benefit: 'Improves economy outcomes over 7 turns', cost: 'Raises short-term pressure elsewhere', domains: ['economy', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'deposit_bonus_pct', value: 0.11, durationTurns: 7, label: 'Debt Restructure Plan effect' },
  ],
  unlocksChainIds: [],
  tags: ['economy', 'v1014', 'policy']
};

const SDA_POLICY_EXPORT_PUSH: SDAPolicyDefinition = {
  id: 'export_push', title: 'Export Push', summary: 'Strategic economy commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'economy', icon: '💰',
  actionPointCost: 2, cashCost: 2500, cooldownTurns: 2, durationTurns: 8,
  prerequisites: [
    { id: 'cash', kind: 'min_cash', label: 'Minimum cash reserves', minValue: 400 },
  ],
  tradeoffs: [
    { benefit: 'Improves economy outcomes over 8 turns', cost: 'Raises short-term pressure elsewhere', domains: ['economy', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'deposit_bonus_pct', value: 0.13, durationTurns: 8, label: 'Export Push effect' },
  ],
  unlocksChainIds: [],
  tags: ['economy', 'v1014', 'policy']
};

const SDA_POLICY_IMPORT_SUBSTITUTION_DRIVE: SDAPolicyDefinition = {
  id: 'import_substitution_drive', title: 'Import Substitution Drive', summary: 'Strategic economy commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'economy', icon: '💰',
  actionPointCost: 3, cashCost: 3000, cooldownTurns: 3, durationTurns: 4,
  prerequisites: [
    { id: 'cash', kind: 'min_cash', label: 'Minimum cash reserves', minValue: 400 },
  ],
  tradeoffs: [
    { benefit: 'Improves economy outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['economy', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'deposit_bonus_pct', value: 0.15, durationTurns: 4, label: 'Import Substitution Drive effect' },
  ],
  unlocksChainIds: [],
  tags: ['economy', 'v1014', 'policy']
};

const SDA_POLICY_CORRIDOR_ACCELERATION: SDAPolicyDefinition = {
  id: 'corridor_acceleration', title: 'Corridor Acceleration', summary: 'Strategic infrastructure commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'infrastructure', icon: '🏗',
  actionPointCost: 1, cashCost: 500, cooldownTurns: 2, durationTurns: 4,
  prerequisites: [
    { id: 'ns', kind: 'network_condition', label: 'National freight not critical', target: 'freight', minRank: 3 },
  ],
  tradeoffs: [
    { benefit: 'Improves infrastructure outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['infrastructure', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'project_speed_pct', value: 0.05, durationTurns: 4, label: 'Corridor Acceleration effect' },
  ],
  unlocksChainIds: ['chain_infrastructure_master'],
  tags: ['infrastructure', 'v1014', 'policy']
};

const SDA_POLICY_GRID_HARDENING: SDAPolicyDefinition = {
  id: 'grid_hardening', title: 'Grid Hardening', summary: 'Strategic infrastructure commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'infrastructure', icon: '🏗',
  actionPointCost: 2, cashCost: 1000, cooldownTurns: 3, durationTurns: 5,
  prerequisites: [
    { id: 'ns', kind: 'network_condition', label: 'National freight not critical', target: 'freight', minRank: 3 },
  ],
  tradeoffs: [
    { benefit: 'Improves infrastructure outcomes over 5 turns', cost: 'Raises short-term pressure elsewhere', domains: ['infrastructure', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'project_speed_pct', value: 0.07, durationTurns: 5, label: 'Grid Hardening effect' },
  ],
  unlocksChainIds: [],
  tags: ['infrastructure', 'v1014', 'policy']
};

const SDA_POLICY_DIGITAL_BACKBONE: SDAPolicyDefinition = {
  id: 'digital_backbone', title: 'Digital Backbone', summary: 'Strategic infrastructure commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'infrastructure', icon: '🏗',
  actionPointCost: 3, cashCost: 1500, cooldownTurns: 4, durationTurns: 6,
  prerequisites: [
    { id: 'ns', kind: 'network_condition', label: 'National freight not critical', target: 'freight', minRank: 3 },
  ],
  tradeoffs: [
    { benefit: 'Improves infrastructure outcomes over 6 turns', cost: 'Raises short-term pressure elsewhere', domains: ['infrastructure', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'project_speed_pct', value: 0.09, durationTurns: 6, label: 'Digital Backbone effect' },
  ],
  unlocksChainIds: [],
  tags: ['infrastructure', 'v1014', 'policy']
};

const SDA_POLICY_PORT_MODERNIZATION: SDAPolicyDefinition = {
  id: 'port_modernization', title: 'Port Modernization', summary: 'Strategic infrastructure commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'infrastructure', icon: '🏗',
  actionPointCost: 1, cashCost: 2000, cooldownTurns: 5, durationTurns: 7,
  prerequisites: [
    { id: 'ns', kind: 'network_condition', label: 'National freight not critical', target: 'freight', minRank: 3 },
  ],
  tradeoffs: [
    { benefit: 'Improves infrastructure outcomes over 7 turns', cost: 'Raises short-term pressure elsewhere', domains: ['infrastructure', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'project_speed_pct', value: 0.11, durationTurns: 7, label: 'Port Modernization effect' },
  ],
  unlocksChainIds: [],
  tags: ['infrastructure', 'v1014', 'policy']
};

const SDA_POLICY_WATER_SECURITY_PROGRAM: SDAPolicyDefinition = {
  id: 'water_security_program', title: 'Water Security Program', summary: 'Strategic infrastructure commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'infrastructure', icon: '🏗',
  actionPointCost: 2, cashCost: 2500, cooldownTurns: 2, durationTurns: 8,
  prerequisites: [
    { id: 'ns', kind: 'network_condition', label: 'National freight not critical', target: 'freight', minRank: 3 },
  ],
  tradeoffs: [
    { benefit: 'Improves infrastructure outcomes over 8 turns', cost: 'Raises short-term pressure elsewhere', domains: ['infrastructure', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'project_speed_pct', value: 0.13, durationTurns: 8, label: 'Water Security Program effect' },
  ],
  unlocksChainIds: [],
  tags: ['infrastructure', 'v1014', 'policy']
};

const SDA_POLICY_FREIGHT_PRIORITY: SDAPolicyDefinition = {
  id: 'freight_priority', title: 'Freight Priority', summary: 'Strategic infrastructure commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'infrastructure', icon: '🏗',
  actionPointCost: 3, cashCost: 3000, cooldownTurns: 3, durationTurns: 4,
  prerequisites: [
    { id: 'ns', kind: 'network_condition', label: 'National freight not critical', target: 'freight', minRank: 3 },
  ],
  tradeoffs: [
    { benefit: 'Improves infrastructure outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['infrastructure', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'project_speed_pct', value: 0.15, durationTurns: 4, label: 'Freight Priority effect' },
  ],
  unlocksChainIds: [],
  tags: ['infrastructure', 'v1014', 'policy']
};

const SDA_POLICY_MANUFACTURING_REVIVAL: SDAPolicyDefinition = {
  id: 'manufacturing_revival', title: 'Manufacturing Revival', summary: 'Strategic industry commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'industry', icon: '🏭',
  actionPointCost: 1, cashCost: 500, cooldownTurns: 2, durationTurns: 4,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves industry outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['industry', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'project_cost_pct', value: -0.05, durationTurns: 4, label: 'Manufacturing Revival effect' },
  ],
  unlocksChainIds: ['chain_industry_master'],
  tags: ['industry', 'v1014', 'policy']
};

const SDA_POLICY_MINING_EFFICIENCY: SDAPolicyDefinition = {
  id: 'mining_efficiency', title: 'Mining Efficiency', summary: 'Strategic industry commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'industry', icon: '🏭',
  actionPointCost: 2, cashCost: 1000, cooldownTurns: 3, durationTurns: 5,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves industry outcomes over 5 turns', cost: 'Raises short-term pressure elsewhere', domains: ['industry', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'project_cost_pct', value: -0.07, durationTurns: 5, label: 'Mining Efficiency effect' },
  ],
  unlocksChainIds: [],
  tags: ['industry', 'v1014', 'policy']
};

const SDA_POLICY_AGTECH_ROLLOUT: SDAPolicyDefinition = {
  id: 'agtech_rollout', title: 'Agtech Rollout', summary: 'Strategic industry commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'industry', icon: '🏭',
  actionPointCost: 3, cashCost: 1500, cooldownTurns: 4, durationTurns: 6,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves industry outcomes over 6 turns', cost: 'Raises short-term pressure elsewhere', domains: ['industry', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'project_cost_pct', value: -0.09, durationTurns: 6, label: 'Agtech Rollout effect' },
  ],
  unlocksChainIds: [],
  tags: ['industry', 'v1014', 'policy']
};

const SDA_POLICY_RESEARCH_COMMERCIALIZATION_PUSH: SDAPolicyDefinition = {
  id: 'research_commercialization_push', title: 'Research Commercialization Push', summary: 'Strategic industry commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'industry', icon: '🏭',
  actionPointCost: 1, cashCost: 2000, cooldownTurns: 5, durationTurns: 7,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves industry outcomes over 7 turns', cost: 'Raises short-term pressure elsewhere', domains: ['industry', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'project_cost_pct', value: -0.11, durationTurns: 7, label: 'Research Commercialization Push effect' },
  ],
  unlocksChainIds: [],
  tags: ['industry', 'v1014', 'policy']
};

const SDA_POLICY_SUPPLY_CHAIN_RESILIENCE: SDAPolicyDefinition = {
  id: 'supply_chain_resilience', title: 'Supply Chain Resilience', summary: 'Strategic industry commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'industry', icon: '🏭',
  actionPointCost: 2, cashCost: 2500, cooldownTurns: 2, durationTurns: 8,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves industry outcomes over 8 turns', cost: 'Raises short-term pressure elsewhere', domains: ['industry', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'project_cost_pct', value: -0.13, durationTurns: 8, label: 'Supply Chain Resilience effect' },
  ],
  unlocksChainIds: [],
  tags: ['industry', 'v1014', 'policy']
};

const SDA_POLICY_INDUSTRIAL_DIVERSIFICATION: SDAPolicyDefinition = {
  id: 'industrial_diversification', title: 'Industrial Diversification', summary: 'Strategic industry commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'industry', icon: '🏭',
  actionPointCost: 3, cashCost: 3000, cooldownTurns: 3, durationTurns: 4,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves industry outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['industry', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'project_cost_pct', value: -0.15, durationTurns: 4, label: 'Industrial Diversification effect' },
  ],
  unlocksChainIds: [],
  tags: ['industry', 'v1014', 'policy']
};

const SDA_POLICY_TRADE_MISSION: SDAPolicyDefinition = {
  id: 'trade_mission', title: 'Trade Mission', summary: 'Strategic diplomacy commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'diplomacy', icon: '🤝',
  actionPointCost: 1, cashCost: 500, cooldownTurns: 2, durationTurns: 4,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves diplomacy outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['diplomacy', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'faction_goodwill_delta', value: 0.05, durationTurns: 4, label: 'Trade Mission effect' },
  ],
  unlocksChainIds: ['chain_diplomacy_master'],
  tags: ['diplomacy', 'v1014', 'policy']
};

const SDA_POLICY_REGIONAL_PACT: SDAPolicyDefinition = {
  id: 'regional_pact', title: 'Regional Pact', summary: 'Strategic diplomacy commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'diplomacy', icon: '🤝',
  actionPointCost: 2, cashCost: 1000, cooldownTurns: 3, durationTurns: 5,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves diplomacy outcomes over 5 turns', cost: 'Raises short-term pressure elsewhere', domains: ['diplomacy', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'faction_goodwill_delta', value: 0.07, durationTurns: 5, label: 'Regional Pact effect' },
  ],
  unlocksChainIds: [],
  tags: ['diplomacy', 'v1014', 'policy']
};

const SDA_POLICY_INVESTMENT_TREATY: SDAPolicyDefinition = {
  id: 'investment_treaty', title: 'Investment Treaty', summary: 'Strategic diplomacy commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'diplomacy', icon: '🤝',
  actionPointCost: 3, cashCost: 1500, cooldownTurns: 4, durationTurns: 6,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves diplomacy outcomes over 6 turns', cost: 'Raises short-term pressure elsewhere', domains: ['diplomacy', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'faction_goodwill_delta', value: 0.09, durationTurns: 6, label: 'Investment Treaty effect' },
  ],
  unlocksChainIds: [],
  tags: ['diplomacy', 'v1014', 'policy']
};

const SDA_POLICY_SANCTIONS_RELIEF: SDAPolicyDefinition = {
  id: 'sanctions_relief', title: 'Sanctions Relief', summary: 'Strategic diplomacy commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'diplomacy', icon: '🤝',
  actionPointCost: 1, cashCost: 2000, cooldownTurns: 5, durationTurns: 7,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves diplomacy outcomes over 7 turns', cost: 'Raises short-term pressure elsewhere', domains: ['diplomacy', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'faction_goodwill_delta', value: 0.11, durationTurns: 7, label: 'Sanctions Relief effect' },
  ],
  unlocksChainIds: [],
  tags: ['diplomacy', 'v1014', 'policy']
};

const SDA_POLICY_COOPERATION_SUMMIT: SDAPolicyDefinition = {
  id: 'cooperation_summit', title: 'Cooperation Summit', summary: 'Strategic diplomacy commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'diplomacy', icon: '🤝',
  actionPointCost: 2, cashCost: 2500, cooldownTurns: 2, durationTurns: 8,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves diplomacy outcomes over 8 turns', cost: 'Raises short-term pressure elsewhere', domains: ['diplomacy', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'faction_goodwill_delta', value: 0.13, durationTurns: 8, label: 'Cooperation Summit effect' },
  ],
  unlocksChainIds: [],
  tags: ['diplomacy', 'v1014', 'policy']
};

const SDA_POLICY_NEUTRAL_ARBITRATION: SDAPolicyDefinition = {
  id: 'neutral_arbitration', title: 'Neutral Arbitration', summary: 'Strategic diplomacy commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'diplomacy', icon: '🤝',
  actionPointCost: 3, cashCost: 3000, cooldownTurns: 3, durationTurns: 4,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves diplomacy outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['diplomacy', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'faction_goodwill_delta', value: 0.15, durationTurns: 4, label: 'Neutral Arbitration effect' },
  ],
  unlocksChainIds: [],
  tags: ['diplomacy', 'v1014', 'policy']
};

const SDA_POLICY_SKILLS_ACADEMY: SDAPolicyDefinition = {
  id: 'skills_academy', title: 'Skills Academy', summary: 'Strategic workforce commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'workforce', icon: '👷',
  actionPointCost: 1, cashCost: 500, cooldownTurns: 2, durationTurns: 4,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves workforce outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['workforce', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'workforce_readiness_delta', value: 0.05, durationTurns: 4, label: 'Skills Academy effect' },
  ],
  unlocksChainIds: ['chain_workforce_master'],
  tags: ['workforce', 'v1014', 'policy']
};

const SDA_POLICY_MIGRATION_FAST_TRACK: SDAPolicyDefinition = {
  id: 'migration_fast_track', title: 'Migration Fast Track', summary: 'Strategic workforce commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'workforce', icon: '👷',
  actionPointCost: 2, cashCost: 1000, cooldownTurns: 3, durationTurns: 5,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves workforce outcomes over 5 turns', cost: 'Raises short-term pressure elsewhere', domains: ['workforce', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'workforce_readiness_delta', value: 0.07, durationTurns: 5, label: 'Migration Fast Track effect' },
  ],
  unlocksChainIds: [],
  tags: ['workforce', 'v1014', 'policy']
};

const SDA_POLICY_APPRENTICESHIP_SURGE: SDAPolicyDefinition = {
  id: 'apprenticeship_surge', title: 'Apprenticeship Surge', summary: 'Strategic workforce commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'workforce', icon: '👷',
  actionPointCost: 3, cashCost: 1500, cooldownTurns: 4, durationTurns: 6,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves workforce outcomes over 6 turns', cost: 'Raises short-term pressure elsewhere', domains: ['workforce', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'workforce_readiness_delta', value: 0.09, durationTurns: 6, label: 'Apprenticeship Surge effect' },
  ],
  unlocksChainIds: [],
  tags: ['workforce', 'v1014', 'policy']
};

const SDA_POLICY_PRODUCTIVITY_COMPACT: SDAPolicyDefinition = {
  id: 'productivity_compact', title: 'Productivity Compact', summary: 'Strategic workforce commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'workforce', icon: '👷',
  actionPointCost: 1, cashCost: 2000, cooldownTurns: 5, durationTurns: 7,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves workforce outcomes over 7 turns', cost: 'Raises short-term pressure elsewhere', domains: ['workforce', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'workforce_readiness_delta', value: 0.11, durationTurns: 7, label: 'Productivity Compact effect' },
  ],
  unlocksChainIds: [],
  tags: ['workforce', 'v1014', 'policy']
};

const SDA_POLICY_REGIONAL_RELOCATION_INCENTIVE: SDAPolicyDefinition = {
  id: 'regional_relocation_incentive', title: 'Regional Relocation Incentive', summary: 'Strategic workforce commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'workforce', icon: '👷',
  actionPointCost: 2, cashCost: 2500, cooldownTurns: 2, durationTurns: 8,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves workforce outcomes over 8 turns', cost: 'Raises short-term pressure elsewhere', domains: ['workforce', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'workforce_readiness_delta', value: 0.13, durationTurns: 8, label: 'Regional Relocation Incentive effect' },
  ],
  unlocksChainIds: [],
  tags: ['workforce', 'v1014', 'policy']
};

const SDA_POLICY_UNION_MEDIATION: SDAPolicyDefinition = {
  id: 'union_mediation', title: 'Union Mediation', summary: 'Strategic workforce commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'workforce', icon: '👷',
  actionPointCost: 3, cashCost: 3000, cooldownTurns: 3, durationTurns: 4,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves workforce outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['workforce', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'workforce_readiness_delta', value: 0.15, durationTurns: 4, label: 'Union Mediation effect' },
  ],
  unlocksChainIds: [],
  tags: ['workforce', 'v1014', 'policy']
};

const SDA_POLICY_EMERGENCY_STOCKPILE: SDAPolicyDefinition = {
  id: 'emergency_stockpile', title: 'Emergency Stockpile', summary: 'Strategic resilience commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'resilience', icon: '🛡',
  actionPointCost: 1, cashCost: 500, cooldownTurns: 2, durationTurns: 4,
  prerequisites: [
    { id: 'res', kind: 'resilience_band', label: 'National resilience at least exposed', minRank: 1 },
  ],
  tradeoffs: [
    { benefit: 'Improves resilience outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['resilience', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'stability_delta', value: 0.05, durationTurns: 4, label: 'Emergency Stockpile effect' },
  ],
  unlocksChainIds: ['chain_resilience_master'],
  tags: ['resilience', 'v1014', 'policy']
};

const SDA_POLICY_CASCADE_CONTAINMENT: SDAPolicyDefinition = {
  id: 'cascade_containment', title: 'Cascade Containment', summary: 'Strategic resilience commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'resilience', icon: '🛡',
  actionPointCost: 2, cashCost: 1000, cooldownTurns: 3, durationTurns: 5,
  prerequisites: [
    { id: 'res', kind: 'resilience_band', label: 'National resilience at least exposed', minRank: 1 },
  ],
  tradeoffs: [
    { benefit: 'Improves resilience outcomes over 5 turns', cost: 'Raises short-term pressure elsewhere', domains: ['resilience', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'stability_delta', value: 0.07, durationTurns: 5, label: 'Cascade Containment effect' },
  ],
  unlocksChainIds: [],
  tags: ['resilience', 'v1014', 'policy']
};

const SDA_POLICY_RECOVERY_ACCELERATOR: SDAPolicyDefinition = {
  id: 'recovery_accelerator', title: 'Recovery Accelerator', summary: 'Strategic resilience commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'resilience', icon: '🛡',
  actionPointCost: 3, cashCost: 1500, cooldownTurns: 4, durationTurns: 6,
  prerequisites: [
    { id: 'res', kind: 'resilience_band', label: 'National resilience at least exposed', minRank: 1 },
  ],
  tradeoffs: [
    { benefit: 'Improves resilience outcomes over 6 turns', cost: 'Raises short-term pressure elsewhere', domains: ['resilience', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'stability_delta', value: 0.09, durationTurns: 6, label: 'Recovery Accelerator effect' },
  ],
  unlocksChainIds: [],
  tags: ['resilience', 'v1014', 'policy']
};

const SDA_POLICY_REDUNDANCY_MANDATE: SDAPolicyDefinition = {
  id: 'redundancy_mandate', title: 'Redundancy Mandate', summary: 'Strategic resilience commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'resilience', icon: '🛡',
  actionPointCost: 1, cashCost: 2000, cooldownTurns: 5, durationTurns: 7,
  prerequisites: [
    { id: 'res', kind: 'resilience_band', label: 'National resilience at least exposed', minRank: 1 },
  ],
  tradeoffs: [
    { benefit: 'Improves resilience outcomes over 7 turns', cost: 'Raises short-term pressure elsewhere', domains: ['resilience', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'stability_delta', value: 0.11, durationTurns: 7, label: 'Redundancy Mandate effect' },
  ],
  unlocksChainIds: [],
  tags: ['resilience', 'v1014', 'policy']
};

const SDA_POLICY_STRESS_TEST_PROGRAM: SDAPolicyDefinition = {
  id: 'stress_test_program', title: 'Stress Test Program', summary: 'Strategic resilience commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'resilience', icon: '🛡',
  actionPointCost: 2, cashCost: 2500, cooldownTurns: 2, durationTurns: 8,
  prerequisites: [
    { id: 'res', kind: 'resilience_band', label: 'National resilience at least exposed', minRank: 1 },
  ],
  tradeoffs: [
    { benefit: 'Improves resilience outcomes over 8 turns', cost: 'Raises short-term pressure elsewhere', domains: ['resilience', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'stability_delta', value: 0.13, durationTurns: 8, label: 'Stress Test Program effect' },
  ],
  unlocksChainIds: [],
  tags: ['resilience', 'v1014', 'policy']
};

const SDA_POLICY_INSURANCE_POOL: SDAPolicyDefinition = {
  id: 'insurance_pool', title: 'Insurance Pool', summary: 'Strategic resilience commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'resilience', icon: '🛡',
  actionPointCost: 3, cashCost: 3000, cooldownTurns: 3, durationTurns: 4,
  prerequisites: [
    { id: 'res', kind: 'resilience_band', label: 'National resilience at least exposed', minRank: 1 },
  ],
  tradeoffs: [
    { benefit: 'Improves resilience outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['resilience', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'stability_delta', value: 0.15, durationTurns: 4, label: 'Insurance Pool effect' },
  ],
  unlocksChainIds: [],
  tags: ['resilience', 'v1014', 'policy']
};

const SDA_POLICY_INSTITUTIONAL_REFORM: SDAPolicyDefinition = {
  id: 'institutional_reform', title: 'Institutional Reform', summary: 'Strategic governance commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'governance', icon: '🏛',
  actionPointCost: 1, cashCost: 500, cooldownTurns: 2, durationTurns: 4,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves governance outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['governance', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'fiscal_pressure_delta', value: 0.05, durationTurns: 4, label: 'Institutional Reform effect' },
  ],
  unlocksChainIds: ['chain_governance_master'],
  tags: ['governance', 'v1014', 'policy']
};

const SDA_POLICY_ANTI_CORRUPTION_DRIVE: SDAPolicyDefinition = {
  id: 'anti_corruption_drive', title: 'Anti Corruption Drive', summary: 'Strategic governance commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'governance', icon: '🏛',
  actionPointCost: 2, cashCost: 1000, cooldownTurns: 3, durationTurns: 5,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves governance outcomes over 5 turns', cost: 'Raises short-term pressure elsewhere', domains: ['governance', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'fiscal_pressure_delta', value: 0.07, durationTurns: 5, label: 'Anti Corruption Drive effect' },
  ],
  unlocksChainIds: [],
  tags: ['governance', 'v1014', 'policy']
};

const SDA_POLICY_REGULATORY_SANDBOX: SDAPolicyDefinition = {
  id: 'regulatory_sandbox', title: 'Regulatory Sandbox', summary: 'Strategic governance commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'governance', icon: '🏛',
  actionPointCost: 3, cashCost: 1500, cooldownTurns: 4, durationTurns: 6,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves governance outcomes over 6 turns', cost: 'Raises short-term pressure elsewhere', domains: ['governance', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'fiscal_pressure_delta', value: 0.09, durationTurns: 6, label: 'Regulatory Sandbox effect' },
  ],
  unlocksChainIds: [],
  tags: ['governance', 'v1014', 'policy']
};

const SDA_POLICY_TRANSPARENCY_INITIATIVE: SDAPolicyDefinition = {
  id: 'transparency_initiative', title: 'Transparency Initiative', summary: 'Strategic governance commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'governance', icon: '🏛',
  actionPointCost: 1, cashCost: 2000, cooldownTurns: 5, durationTurns: 7,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves governance outcomes over 7 turns', cost: 'Raises short-term pressure elsewhere', domains: ['governance', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'fiscal_pressure_delta', value: 0.11, durationTurns: 7, label: 'Transparency Initiative effect' },
  ],
  unlocksChainIds: [],
  tags: ['governance', 'v1014', 'policy']
};

const SDA_POLICY_DELIVERY_UNIT: SDAPolicyDefinition = {
  id: 'delivery_unit', title: 'Delivery Unit', summary: 'Strategic governance commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'governance', icon: '🏛',
  actionPointCost: 2, cashCost: 2500, cooldownTurns: 2, durationTurns: 8,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves governance outcomes over 8 turns', cost: 'Raises short-term pressure elsewhere', domains: ['governance', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'fiscal_pressure_delta', value: 0.13, durationTurns: 8, label: 'Delivery Unit effect' },
  ],
  unlocksChainIds: [],
  tags: ['governance', 'v1014', 'policy']
};

const SDA_POLICY_INTERAGENCY_FUSION: SDAPolicyDefinition = {
  id: 'interagency_fusion', title: 'Interagency Fusion', summary: 'Strategic governance commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'governance', icon: '🏛',
  actionPointCost: 3, cashCost: 3000, cooldownTurns: 3, durationTurns: 4,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves governance outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['governance', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'fiscal_pressure_delta', value: 0.15, durationTurns: 4, label: 'Interagency Fusion effect' },
  ],
  unlocksChainIds: [],
  tags: ['governance', 'v1014', 'policy']
};

const SDA_POLICY_AFFORDABILITY_PACKAGE: SDAPolicyDefinition = {
  id: 'affordability_package', title: 'Affordability Package', summary: 'Strategic domestic commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'domestic', icon: '🏠',
  actionPointCost: 1, cashCost: 500, cooldownTurns: 2, durationTurns: 4,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves domestic outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['domestic', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'domestic_demand_delta', value: 0.05, durationTurns: 4, label: 'Affordability Package effect' },
  ],
  unlocksChainIds: ['chain_domestic_master'],
  tags: ['domestic', 'v1014', 'policy']
};

const SDA_POLICY_HOUSING_ACCELERATOR: SDAPolicyDefinition = {
  id: 'housing_accelerator', title: 'Housing Accelerator', summary: 'Strategic domestic commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'domestic', icon: '🏠',
  actionPointCost: 2, cashCost: 1000, cooldownTurns: 3, durationTurns: 5,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves domestic outcomes over 5 turns', cost: 'Raises short-term pressure elsewhere', domains: ['domestic', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'domestic_demand_delta', value: 0.07, durationTurns: 5, label: 'Housing Accelerator effect' },
  ],
  unlocksChainIds: [],
  tags: ['domestic', 'v1014', 'policy']
};

const SDA_POLICY_ESSENTIAL_SERVICES_GUARANTEE: SDAPolicyDefinition = {
  id: 'essential_services_guarantee', title: 'Essential Services Guarantee', summary: 'Strategic domestic commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'domestic', icon: '🏠',
  actionPointCost: 3, cashCost: 1500, cooldownTurns: 4, durationTurns: 6,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves domestic outcomes over 6 turns', cost: 'Raises short-term pressure elsewhere', domains: ['domestic', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'domestic_demand_delta', value: 0.09, durationTurns: 6, label: 'Essential Services Guarantee effect' },
  ],
  unlocksChainIds: [],
  tags: ['domestic', 'v1014', 'policy']
};

const SDA_POLICY_REGIONAL_LIVING_BONUS: SDAPolicyDefinition = {
  id: 'regional_living_bonus', title: 'Regional Living Bonus', summary: 'Strategic domestic commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'domestic', icon: '🏠',
  actionPointCost: 1, cashCost: 2000, cooldownTurns: 5, durationTurns: 7,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves domestic outcomes over 7 turns', cost: 'Raises short-term pressure elsewhere', domains: ['domestic', 'strategy'], magnitude: 'minor' },
  ],
  modifiers: [
    { kind: 'domestic_demand_delta', value: 0.11, durationTurns: 7, label: 'Regional Living Bonus effect' },
  ],
  unlocksChainIds: [],
  tags: ['domestic', 'v1014', 'policy']
};

const SDA_POLICY_COST_OF_LIVING_RELIEF: SDAPolicyDefinition = {
  id: 'cost_of_living_relief', title: 'Cost Of Living Relief', summary: 'Strategic domestic commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'domestic', icon: '🏠',
  actionPointCost: 2, cashCost: 2500, cooldownTurns: 2, durationTurns: 8,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves domestic outcomes over 8 turns', cost: 'Raises short-term pressure elsewhere', domains: ['domestic', 'strategy'], magnitude: 'moderate' },
  ],
  modifiers: [
    { kind: 'domestic_demand_delta', value: 0.13, durationTurns: 8, label: 'Cost Of Living Relief effect' },
  ],
  unlocksChainIds: [],
  tags: ['domestic', 'v1014', 'policy']
};

const SDA_POLICY_COMMUNITY_RESILIENCE_FUND: SDAPolicyDefinition = {
  id: 'community_resilience_fund', title: 'Community Resilience Fund', summary: 'Strategic domestic commitment with explicit costs and delayed benefits tied to national simulation state.', domain: 'domestic', icon: '🏠',
  actionPointCost: 3, cashCost: 3000, cooldownTurns: 3, durationTurns: 4,
  prerequisites: [
    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },
  ],
  tradeoffs: [
    { benefit: 'Improves domestic outcomes over 4 turns', cost: 'Raises short-term pressure elsewhere', domains: ['domestic', 'strategy'], magnitude: 'major' },
  ],
  modifiers: [
    { kind: 'domestic_demand_delta', value: 0.15, durationTurns: 4, label: 'Community Resilience Fund effect' },
  ],
  unlocksChainIds: [],
  tags: ['domestic', 'v1014', 'policy']
};

export const SDA_POLICY_CATALOG: Record<string, SDAPolicyDefinition> = {
  fiscal_discipline: SDA_POLICY_FISCAL_DISCIPLINE,
  growth_stimulus: SDA_POLICY_GROWTH_STIMULUS,
  savings_mobilization: SDA_POLICY_SAVINGS_MOBILIZATION,
  debt_restructure_plan: SDA_POLICY_DEBT_RESTRUCTURE_PLAN,
  export_push: SDA_POLICY_EXPORT_PUSH,
  import_substitution_drive: SDA_POLICY_IMPORT_SUBSTITUTION_DRIVE,
  corridor_acceleration: SDA_POLICY_CORRIDOR_ACCELERATION,
  grid_hardening: SDA_POLICY_GRID_HARDENING,
  digital_backbone: SDA_POLICY_DIGITAL_BACKBONE,
  port_modernization: SDA_POLICY_PORT_MODERNIZATION,
  water_security_program: SDA_POLICY_WATER_SECURITY_PROGRAM,
  freight_priority: SDA_POLICY_FREIGHT_PRIORITY,
  manufacturing_revival: SDA_POLICY_MANUFACTURING_REVIVAL,
  mining_efficiency: SDA_POLICY_MINING_EFFICIENCY,
  agtech_rollout: SDA_POLICY_AGTECH_ROLLOUT,
  research_commercialization_push: SDA_POLICY_RESEARCH_COMMERCIALIZATION_PUSH,
  supply_chain_resilience: SDA_POLICY_SUPPLY_CHAIN_RESILIENCE,
  industrial_diversification: SDA_POLICY_INDUSTRIAL_DIVERSIFICATION,
  trade_mission: SDA_POLICY_TRADE_MISSION,
  regional_pact: SDA_POLICY_REGIONAL_PACT,
  investment_treaty: SDA_POLICY_INVESTMENT_TREATY,
  sanctions_relief: SDA_POLICY_SANCTIONS_RELIEF,
  cooperation_summit: SDA_POLICY_COOPERATION_SUMMIT,
  neutral_arbitration: SDA_POLICY_NEUTRAL_ARBITRATION,
  skills_academy: SDA_POLICY_SKILLS_ACADEMY,
  migration_fast_track: SDA_POLICY_MIGRATION_FAST_TRACK,
  apprenticeship_surge: SDA_POLICY_APPRENTICESHIP_SURGE,
  productivity_compact: SDA_POLICY_PRODUCTIVITY_COMPACT,
  regional_relocation_incentive: SDA_POLICY_REGIONAL_RELOCATION_INCENTIVE,
  union_mediation: SDA_POLICY_UNION_MEDIATION,
  emergency_stockpile: SDA_POLICY_EMERGENCY_STOCKPILE,
  cascade_containment: SDA_POLICY_CASCADE_CONTAINMENT,
  recovery_accelerator: SDA_POLICY_RECOVERY_ACCELERATOR,
  redundancy_mandate: SDA_POLICY_REDUNDANCY_MANDATE,
  stress_test_program: SDA_POLICY_STRESS_TEST_PROGRAM,
  insurance_pool: SDA_POLICY_INSURANCE_POOL,
  institutional_reform: SDA_POLICY_INSTITUTIONAL_REFORM,
  anti_corruption_drive: SDA_POLICY_ANTI_CORRUPTION_DRIVE,
  regulatory_sandbox: SDA_POLICY_REGULATORY_SANDBOX,
  transparency_initiative: SDA_POLICY_TRANSPARENCY_INITIATIVE,
  delivery_unit: SDA_POLICY_DELIVERY_UNIT,
  interagency_fusion: SDA_POLICY_INTERAGENCY_FUSION,
  affordability_package: SDA_POLICY_AFFORDABILITY_PACKAGE,
  housing_accelerator: SDA_POLICY_HOUSING_ACCELERATOR,
  essential_services_guarantee: SDA_POLICY_ESSENTIAL_SERVICES_GUARANTEE,
  regional_living_bonus: SDA_POLICY_REGIONAL_LIVING_BONUS,
  cost_of_living_relief: SDA_POLICY_COST_OF_LIVING_RELIEF,
  community_resilience_fund: SDA_POLICY_COMMUNITY_RESILIENCE_FUND,
};
export const SDA_POLICY_IDS = Object.keys(SDA_POLICY_CATALOG);

const SDA_CHAIN_ECONOMY_MASTER: SDAChainDefinition = {
  id: 'chain_economy_master', title: 'Economy Master Chain', summary: 'Multi-step national economy program with branching commitments.', domain: 'economy', icon: '💰',
  prerequisites: [
    { id: 'policy_seed', kind: 'policy_not_active', label: 'Seed policy available', policyId: 'fiscal_discipline' },
  ],
  steps: [
    { index: 0, title: 'Step 1: Fiscal Discipline', summary: 'Commit or advance the fiscal_discipline policy.', policyId: 'fiscal_discipline', choiceIds: null },
    { index: 1, title: 'Step 2: Growth Stimulus', summary: 'Commit or advance the growth_stimulus policy.', policyId: 'growth_stimulus', choiceIds: ['commit', 'defer'] },
    { index: 2, title: 'Step 3: Savings Mobilization', summary: 'Commit or advance the savings_mobilization policy.', policyId: 'savings_mobilization', choiceIds: null },
    { index: 3, title: 'Step 4: Debt Restructure Plan', summary: 'Commit or advance the debt_restructure_plan policy.', policyId: 'debt_restructure_plan', choiceIds: null },
  ],
  completionModifiers: [
    { kind: 'national_network_delta', value: 0.08, durationTurns: 8, network: 'trade', label: 'economy chain completion' },
  ],
  tags: ['economy', 'chain', 'v1014']
};

const SDA_CHAIN_INFRASTRUCTURE_MASTER: SDAChainDefinition = {
  id: 'chain_infrastructure_master', title: 'Infrastructure Master Chain', summary: 'Multi-step national infrastructure program with branching commitments.', domain: 'infrastructure', icon: '🏗',
  prerequisites: [
    { id: 'policy_seed', kind: 'policy_not_active', label: 'Seed policy available', policyId: 'corridor_acceleration' },
  ],
  steps: [
    { index: 0, title: 'Step 1: Corridor Acceleration', summary: 'Commit or advance the corridor_acceleration policy.', policyId: 'corridor_acceleration', choiceIds: null },
    { index: 1, title: 'Step 2: Grid Hardening', summary: 'Commit or advance the grid_hardening policy.', policyId: 'grid_hardening', choiceIds: ['commit', 'defer'] },
    { index: 2, title: 'Step 3: Digital Backbone', summary: 'Commit or advance the digital_backbone policy.', policyId: 'digital_backbone', choiceIds: null },
    { index: 3, title: 'Step 4: Port Modernization', summary: 'Commit or advance the port_modernization policy.', policyId: 'port_modernization', choiceIds: null },
  ],
  completionModifiers: [
    { kind: 'national_network_delta', value: 0.08, durationTurns: 8, network: 'digital', label: 'infrastructure chain completion' },
  ],
  tags: ['infrastructure', 'chain', 'v1014']
};

const SDA_CHAIN_INDUSTRY_MASTER: SDAChainDefinition = {
  id: 'chain_industry_master', title: 'Industry Master Chain', summary: 'Multi-step national industry program with branching commitments.', domain: 'industry', icon: '🏭',
  prerequisites: [
    { id: 'policy_seed', kind: 'policy_not_active', label: 'Seed policy available', policyId: 'manufacturing_revival' },
  ],
  steps: [
    { index: 0, title: 'Step 1: Manufacturing Revival', summary: 'Commit or advance the manufacturing_revival policy.', policyId: 'manufacturing_revival', choiceIds: null },
    { index: 1, title: 'Step 2: Mining Efficiency', summary: 'Commit or advance the mining_efficiency policy.', policyId: 'mining_efficiency', choiceIds: ['commit', 'defer'] },
    { index: 2, title: 'Step 3: Agtech Rollout', summary: 'Commit or advance the agtech_rollout policy.', policyId: 'agtech_rollout', choiceIds: null },
    { index: 3, title: 'Step 4: Research Commercialization Push', summary: 'Commit or advance the research_commercialization_push policy.', policyId: 'research_commercialization_push', choiceIds: null },
  ],
  completionModifiers: [
    { kind: 'national_network_delta', value: 0.08, durationTurns: 8, network: 'trade', label: 'industry chain completion' },
  ],
  tags: ['industry', 'chain', 'v1014']
};

const SDA_CHAIN_DIPLOMACY_MASTER: SDAChainDefinition = {
  id: 'chain_diplomacy_master', title: 'Diplomacy Master Chain', summary: 'Multi-step national diplomacy program with branching commitments.', domain: 'diplomacy', icon: '🤝',
  prerequisites: [
    { id: 'policy_seed', kind: 'policy_not_active', label: 'Seed policy available', policyId: 'trade_mission' },
  ],
  steps: [
    { index: 0, title: 'Step 1: Trade Mission', summary: 'Commit or advance the trade_mission policy.', policyId: 'trade_mission', choiceIds: null },
    { index: 1, title: 'Step 2: Regional Pact', summary: 'Commit or advance the regional_pact policy.', policyId: 'regional_pact', choiceIds: ['commit', 'defer'] },
    { index: 2, title: 'Step 3: Investment Treaty', summary: 'Commit or advance the investment_treaty policy.', policyId: 'investment_treaty', choiceIds: null },
    { index: 3, title: 'Step 4: Sanctions Relief', summary: 'Commit or advance the sanctions_relief policy.', policyId: 'sanctions_relief', choiceIds: null },
  ],
  completionModifiers: [
    { kind: 'national_network_delta', value: 0.08, durationTurns: 8, network: 'trade', label: 'diplomacy chain completion' },
  ],
  tags: ['diplomacy', 'chain', 'v1014']
};

const SDA_CHAIN_WORKFORCE_MASTER: SDAChainDefinition = {
  id: 'chain_workforce_master', title: 'Workforce Master Chain', summary: 'Multi-step national workforce program with branching commitments.', domain: 'workforce', icon: '👷',
  prerequisites: [
    { id: 'policy_seed', kind: 'policy_not_active', label: 'Seed policy available', policyId: 'skills_academy' },
  ],
  steps: [
    { index: 0, title: 'Step 1: Skills Academy', summary: 'Commit or advance the skills_academy policy.', policyId: 'skills_academy', choiceIds: null },
    { index: 1, title: 'Step 2: Migration Fast Track', summary: 'Commit or advance the migration_fast_track policy.', policyId: 'migration_fast_track', choiceIds: ['commit', 'defer'] },
    { index: 2, title: 'Step 3: Apprenticeship Surge', summary: 'Commit or advance the apprenticeship_surge policy.', policyId: 'apprenticeship_surge', choiceIds: null },
    { index: 3, title: 'Step 4: Productivity Compact', summary: 'Commit or advance the productivity_compact policy.', policyId: 'productivity_compact', choiceIds: null },
  ],
  completionModifiers: [
    { kind: 'national_network_delta', value: 0.08, durationTurns: 8, network: 'trade', label: 'workforce chain completion' },
  ],
  tags: ['workforce', 'chain', 'v1014']
};

const SDA_CHAIN_RESILIENCE_MASTER: SDAChainDefinition = {
  id: 'chain_resilience_master', title: 'Resilience Master Chain', summary: 'Multi-step national resilience program with branching commitments.', domain: 'resilience', icon: '🛡',
  prerequisites: [
    { id: 'policy_seed', kind: 'policy_not_active', label: 'Seed policy available', policyId: 'emergency_stockpile' },
  ],
  steps: [
    { index: 0, title: 'Step 1: Emergency Stockpile', summary: 'Commit or advance the emergency_stockpile policy.', policyId: 'emergency_stockpile', choiceIds: null },
    { index: 1, title: 'Step 2: Cascade Containment', summary: 'Commit or advance the cascade_containment policy.', policyId: 'cascade_containment', choiceIds: ['commit', 'defer'] },
    { index: 2, title: 'Step 3: Recovery Accelerator', summary: 'Commit or advance the recovery_accelerator policy.', policyId: 'recovery_accelerator', choiceIds: null },
    { index: 3, title: 'Step 4: Redundancy Mandate', summary: 'Commit or advance the redundancy_mandate policy.', policyId: 'redundancy_mandate', choiceIds: null },
  ],
  completionModifiers: [
    { kind: 'national_network_delta', value: 0.08, durationTurns: 8, network: 'trade', label: 'resilience chain completion' },
  ],
  tags: ['resilience', 'chain', 'v1014']
};

const SDA_CHAIN_GOVERNANCE_MASTER: SDAChainDefinition = {
  id: 'chain_governance_master', title: 'Governance Master Chain', summary: 'Multi-step national governance program with branching commitments.', domain: 'governance', icon: '🏛',
  prerequisites: [
    { id: 'policy_seed', kind: 'policy_not_active', label: 'Seed policy available', policyId: 'institutional_reform' },
  ],
  steps: [
    { index: 0, title: 'Step 1: Institutional Reform', summary: 'Commit or advance the institutional_reform policy.', policyId: 'institutional_reform', choiceIds: null },
    { index: 1, title: 'Step 2: Anti Corruption Drive', summary: 'Commit or advance the anti_corruption_drive policy.', policyId: 'anti_corruption_drive', choiceIds: ['commit', 'defer'] },
    { index: 2, title: 'Step 3: Regulatory Sandbox', summary: 'Commit or advance the regulatory_sandbox policy.', policyId: 'regulatory_sandbox', choiceIds: null },
    { index: 3, title: 'Step 4: Transparency Initiative', summary: 'Commit or advance the transparency_initiative policy.', policyId: 'transparency_initiative', choiceIds: null },
  ],
  completionModifiers: [
    { kind: 'national_network_delta', value: 0.08, durationTurns: 8, network: 'trade', label: 'governance chain completion' },
  ],
  tags: ['governance', 'chain', 'v1014']
};

const SDA_CHAIN_DOMESTIC_MASTER: SDAChainDefinition = {
  id: 'chain_domestic_master', title: 'Domestic Master Chain', summary: 'Multi-step national domestic program with branching commitments.', domain: 'domestic', icon: '🏠',
  prerequisites: [
    { id: 'policy_seed', kind: 'policy_not_active', label: 'Seed policy available', policyId: 'affordability_package' },
  ],
  steps: [
    { index: 0, title: 'Step 1: Affordability Package', summary: 'Commit or advance the affordability_package policy.', policyId: 'affordability_package', choiceIds: null },
    { index: 1, title: 'Step 2: Housing Accelerator', summary: 'Commit or advance the housing_accelerator policy.', policyId: 'housing_accelerator', choiceIds: ['commit', 'defer'] },
    { index: 2, title: 'Step 3: Essential Services Guarantee', summary: 'Commit or advance the essential_services_guarantee policy.', policyId: 'essential_services_guarantee', choiceIds: null },
    { index: 3, title: 'Step 4: Regional Living Bonus', summary: 'Commit or advance the regional_living_bonus policy.', policyId: 'regional_living_bonus', choiceIds: null },
  ],
  completionModifiers: [
    { kind: 'national_network_delta', value: 0.08, durationTurns: 8, network: 'trade', label: 'domestic chain completion' },
  ],
  tags: ['domestic', 'chain', 'v1014']
};

export const SDA_CHAIN_CATALOG: Record<string, SDAChainDefinition> = {
  chain_economy_master: SDA_CHAIN_ECONOMY_MASTER,
  chain_infrastructure_master: SDA_CHAIN_INFRASTRUCTURE_MASTER,
  chain_industry_master: SDA_CHAIN_INDUSTRY_MASTER,
  chain_diplomacy_master: SDA_CHAIN_DIPLOMACY_MASTER,
  chain_workforce_master: SDA_CHAIN_WORKFORCE_MASTER,
  chain_resilience_master: SDA_CHAIN_RESILIENCE_MASTER,
  chain_governance_master: SDA_CHAIN_GOVERNANCE_MASTER,
  chain_domestic_master: SDA_CHAIN_DOMESTIC_MASTER,
};
export const SDA_CHAIN_IDS = Object.keys(SDA_CHAIN_CATALOG);


const NS_COND_RANK_SDA: Record<NationalNetworkCondition, number> = { surplus: 0, healthy: 1, strained: 2, bottlenecked: 3, critical: 4 };
const NS_RES_RANK_SDA: Record<NationalResilienceBand, number> = { fragile: 0, exposed: 1, stable: 2, resilient: 3, highly_resilient: 4 };

function sdaFiscalBandRank(band: string | undefined): number {
  const m: Record<string, number> = { comfortable: 3, stable: 2, strained: 1, critical: 0 };
  return m[String(band || 'stable')] ?? 1;
}
function sdaStateCapBandRank(band: string | undefined): number {
  const m: Record<string, number> = { strong: 3, adequate: 2, strained: 1, overloaded: 0 };
  return m[String(band || 'adequate')] ?? 1;
}

export function evaluateSDAPrerequisite(p: SDAPrerequisite, inp: SDAInputs, persisted: StrategicDecisionArchitecturePersisted | null): { met: boolean; reason: string } {
  const turn = inp.turn;
  switch (p.kind) {
    case 'min_cash':
      return { met: inp.cash >= (p.minValue ?? 0), reason: inp.cash >= (p.minValue ?? 0) ? 'cash ok' : `Need $${p.minValue} cash (have $${Math.round(inp.cash)})` };
    case 'min_net_worth':
      return { met: inp.netWorth >= (p.minValue ?? 0), reason: inp.netWorth >= (p.minValue ?? 0) ? 'net worth ok' : `Need net worth ${p.minValue}` };
    case 'network_condition': {
      const n = (p.target || 'freight') as NationalNetworkKind;
      const cond = inp.national?.national?.[n]?.condition || 'healthy';
      const rank = NS_COND_RANK_SDA[cond];
      const need = p.minRank ?? 3;
      return { met: rank <= need, reason: rank <= need ? `${n} ${cond}` : `${NATIONAL_NETWORK_LABEL[n]} is ${cond} (too stressed)` };
    }
    case 'resilience_band': {
      const band = inp.national?.national?.resilienceBand || 'stable';
      const rank = NS_RES_RANK_SDA[band];
      return { met: rank >= (p.minRank ?? 1), reason: rank >= (p.minRank ?? 1) ? band : `Resilience ${band} too low` };
    }
    case 'fiscal_band': {
      const band = (inp.fiscal as any)?.load?.band || (inp.fiscal as any)?.summary?.band || 'stable';
      return { met: sdaFiscalBandRank(band) >= (p.minRank ?? 1), reason: `Fiscal ${band}` };
    }
    case 'state_capacity_band': {
      const band = (inp.stateCapacity as any)?.summary?.readinessBand || 'adequate';
      return { met: sdaStateCapBandRank(band) >= (p.minRank ?? 1), reason: `State capacity ${band}` };
    }
    case 'priority_active': {
      const id = p.target || '';
      const active = inp.priorities?.active?.some(x => x.definitionId === id && x.status === 'active');
      return { met: Boolean(active), reason: active ? 'priority active' : 'Required national priority not active' };
    }
    case 'megaproject_stage': {
      const kind = p.target || '';
      const mp = inp.megaprojects?.programs?.[kind];
      const stage = mp?.stage || 'proposed';
      const order = ['proposed', 'committed', 'under_construction', 'partially_operational', 'operational', 'completed'];
      const met = order.indexOf(stage) >= (p.minRank ?? 2);
      return { met, reason: met ? `Megaproject ${stage}` : `Megaproject needs stage ≥ ${p.minRank}` };
    }
    case 'project_status': {
      const proj = p.projectId ? inp.projects[p.projectId] : null;
      const st = proj?.status || 'locked';
      const order = ['locked', 'unlocked', 'under_construction', 'active', 'upgraded'];
      return { met: order.indexOf(st) >= (p.minRank ?? 3), reason: proj ? `${proj.title}: ${st}` : 'Project not found' };
    }
    case 'region_control': {
      const r = p.regionId || 'NSW';
      return { met: inp.controlledRegions.includes(r), reason: inp.controlledRegions.includes(r) ? `Control ${r}` : `Need control of ${r}` };
    }
    case 'stability_band':
      return { met: inp.stability >= (p.minValue ?? 35), reason: inp.stability >= (p.minValue ?? 35) ? 'stability ok' : `Stability ${Math.round(inp.stability)} too low` };
    case 'cooldown_clear': {
      const key = p.target || p.policyId || p.chainId || '';
      const until = persisted?.cooldowns?.[key] ?? 0;
      return { met: until <= turn, reason: until <= turn ? 'cooldown clear' : `Cooldown until turn ${until}` };
    }
    case 'policy_not_active': {
      const pid = p.policyId || p.target || '';
      const active = Object.values(persisted?.activePolicies || {}).some(x => x.definitionId === pid && x.status === 'active');
      return { met: !active, reason: active ? 'Policy already active' : 'available' };
    }
    case 'chain_step': {
      const ch = p.chainId ? persisted?.activeChains?.[p.chainId] : null;
      return { met: Boolean(ch && ch.stepIndex >= (p.stepIndex ?? 0)), reason: ch ? `chain step ${ch.stepIndex}` : 'chain not started' };
    }
    default:
      return { met: true, reason: 'unknown prereq treated as met' };
  }
}

export function evaluateSDAPolicy(def: SDAPolicyDefinition, inp: SDAInputs, persisted: StrategicDecisionArchitecturePersisted | null): SDAEvaluation {
  const blocked: string[] = [];
  const met: string[] = [];
  const unmet: SDAPrerequisite[] = [];
  def.prerequisites.forEach(pr => {
    const r = evaluateSDAPrerequisite(pr, inp, persisted);
    if (r.met) met.push(r.reason); else { blocked.push(r.reason); unmet.push(pr); }
  });
  const cd = evaluateSDAPrerequisite({ id: 'cd', kind: 'cooldown_clear', label: 'cooldown', target: def.id }, inp, persisted);
  if (!cd.met) { blocked.push(cd.reason); unmet.push({ id: 'cd', kind: 'cooldown_clear', label: cd.reason, target: def.id }); }
  if (inp.cash < def.cashCost) { blocked.push(`Need $${def.cashCost} (have $${Math.round(inp.cash)})`); }
  return { definitionId: def.id, kind: 'policy', eligible: blocked.length === 0, blockedReasons: blocked, metPrerequisites: met, unmetPrerequisites: unmet, tradeoffs: def.tradeoffs };
}

export function evaluateSDAChain(def: SDAChainDefinition, inp: SDAInputs, persisted: StrategicDecisionArchitecturePersisted | null): SDAEvaluation {
  const blocked: string[] = [];
  const met: string[] = [];
  const unmet: SDAPrerequisite[] = [];
  def.prerequisites.forEach(pr => {
    const r = evaluateSDAPrerequisite(pr, inp, persisted);
    if (r.met) met.push(r.reason); else { blocked.push(r.reason); unmet.push(pr); }
  });
  const cd = evaluateSDAPrerequisite({ id: 'cd', kind: 'cooldown_clear', label: 'cooldown', target: def.id }, inp, persisted);
  if (!cd.met) blocked.push(cd.reason);
  const already = Object.values(persisted?.activeChains || {}).some(c => c.definitionId === def.id && c.status === 'in_progress');
  if (already) blocked.push('Chain already in progress');
  return { definitionId: def.id, kind: 'chain', eligible: blocked.length === 0, blockedReasons: blocked, metPrerequisites: met, unmetPrerequisites: unmet, tradeoffs: [] };
}

export function strategicDecisionInputHash(inp: SDAInputs): string {
  const raw = JSON.stringify([inp.turn, Math.round(inp.cash), Math.round(inp.netWorth), inp.currentRegion, inp.controlledRegions.sort().join(','), Math.round(inp.stability),
    inp.national?.inputHash || '', inp.priorities ? inp.priorities.revision : 0, Object.keys(inp.projects).length]);
  let h = 2166136261;
  for (let k = 0; k < raw.length; k++) { h ^= raw.charCodeAt(k); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}

export function computeStrategicDecisionArchitecture(inp: SDAInputs, persistedIn: StrategicDecisionArchitecturePersisted | null): { state: StrategicDecisionArchitectureState; persisted: StrategicDecisionArchitecturePersisted } {
  const persisted = persistedIn ? { ...persistedIn, activePolicies: { ...persistedIn.activePolicies }, activeChains: { ...persistedIn.activeChains }, cooldowns: { ...persistedIn.cooldowns }, modifiers: [...(persistedIn.modifiers || [])], history: [...(persistedIn.history || [])] } : createEmptyStrategicDecisionArchitecturePersisted();
  const hash = strategicDecisionInputHash(inp);
  const policies = SDA_POLICY_IDS.map(id => evaluateSDAPolicy(SDA_POLICY_CATALOG[id], inp, persisted));
  const chains = SDA_CHAIN_IDS.map(id => evaluateSDAChain(SDA_CHAIN_CATALOG[id], inp, persisted));
  const activePolicyCount = Object.values(persisted.activePolicies).filter(p => p.status === 'active').length;
  const activeChainCount = Object.values(persisted.activeChains).filter(c => c.status === 'in_progress' || c.status === 'awaiting_choice').length;
  const dom = (Object.values(persisted.activePolicies).map(p => SDA_POLICY_CATALOG[p.definitionId]?.domain).filter(Boolean)[0] || null) as SDADomain | null;
  const state: StrategicDecisionArchitectureState = {
    turn: inp.turn,
    revision: persisted.revision,
    policies,
    chains,
    activePolicyCount,
    activeChainCount,
    dominantDomain: dom,
    summary: activePolicyCount || activeChainCount ? `${activePolicyCount} active policies · ${activeChainCount} chains in flight` : 'No active strategic commitments'
  };
  if (persisted.inputHash !== hash) { persisted.inputHash = hash; persisted.revision += 1; persisted.lastUpdatedTurn = inp.turn; }
  return { state, persisted };
}

export function sanitizeStrategicDecisionArchitecturePersisted(raw: unknown): StrategicDecisionArchitecturePersisted | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as any;
  if (r.schemaVersion !== V1014_SCHEMA_VERSION) return null;
  const ap: Record<string, SDAActivePolicy> = {};
  Object.entries(r.activePolicies && typeof r.activePolicies === 'object' ? r.activePolicies : {}).slice(0, SDA_LIMITS.activePolicies).forEach(([k, v]: [string, any]) => {
    if (!v || typeof v !== 'object' || !SDA_POLICY_CATALOG[v.definitionId]) return;
    ap[k.slice(0, 80)] = { definitionId: v.definitionId, actorId: String(v.actorId || 'player').slice(0, 40), startedTurn: Math.floor(Number(v.startedTurn) || 0), expiresTurn: Math.floor(Number(v.expiresTurn) || 0), status: (['available', 'active', 'winding_down', 'expired', 'blocked'].includes(v.status) ? v.status : 'active') as SDAPolicyStatus, modifiers: Array.isArray(v.modifiers) ? v.modifiers.slice(0, 6) : [] };
  });
  const ac: Record<string, SDAActiveChain> = {};
  Object.entries(r.activeChains && typeof r.activeChains === 'object' ? r.activeChains : {}).slice(0, SDA_LIMITS.activeChains).forEach(([k, v]: [string, any]) => {
    if (!v || typeof v !== 'object' || !SDA_CHAIN_CATALOG[v.definitionId]) return;
    ac[k.slice(0, 80)] = { definitionId: v.definitionId, actorId: String(v.actorId || 'player').slice(0, 40), startedTurn: Math.floor(Number(v.startedTurn) || 0), stepIndex: Math.floor(Number(v.stepIndex) || 0), status: (['available', 'in_progress', 'awaiting_choice', 'completed', 'failed', 'abandoned'].includes(v.status) ? v.status : 'in_progress') as SDAChainStatus, pendingChoiceId: v.pendingChoiceId ? String(v.pendingChoiceId).slice(0, 40) : null, history: Array.isArray(v.history) ? v.history.slice(-SDA_LIMITS.chainSteps) : [] };
  });
  return {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: Math.floor(Number(r.revision) || 0),
    lastUpdatedTurn: Math.floor(Number(r.lastUpdatedTurn) || 0),
    activePolicies: ap,
    activeChains: ac,
    cooldowns: Object.fromEntries(Object.entries(r.cooldowns && typeof r.cooldowns === 'object' ? r.cooldowns : {}).slice(0, SDA_LIMITS.cooldowns).map(([k, v]) => [String(k).slice(0, 60), Math.floor(Number(v) || 0)])),
    modifiers: Array.isArray(r.modifiers) ? r.modifiers.slice(0, SDA_LIMITS.modifiers) : [],
    history: Array.isArray(r.history) ? r.history.slice(-SDA_LIMITS.history).map((h: any, i: number) => ({ id: String(h?.id || `h${i}`).slice(0, 80), turn: Math.floor(Number(h?.turn) || 0), kind: h?.kind || 'policy_committed', subjectId: String(h?.subjectId || '').slice(0, 60), summary: String(h?.summary || '').slice(0, 200), actorId: String(h?.actorId || 'player').slice(0, 40) })) : [],
    inputHash: String(r.inputHash || '').slice(0, 32)
  };
}

function sdaNextId(p: StrategicDecisionArchitecturePersisted, prefix: string): string {
  return `${prefix}_${p.revision}_${Object.keys(p.activePolicies).length + Object.keys(p.activeChains).length}`.slice(0, 72);
}

export function commitStrategicPolicyAction(state: CanonicalGameState, actorId: string, policyId: string, turn: number): { ok: boolean; reason: string; persisted: StrategicDecisionArchitecturePersisted | null } {
  const def = SDA_POLICY_CATALOG[policyId];
  if (!def) return { ok: false, reason: 'Unknown policy', persisted: sanitizeStrategicDecisionArchitecturePersisted((state as any).strategicDecisionArchitecture) };
  const actor = state.actorsById[actorId] || state.player;
  if (!actor) return { ok: false, reason: 'No actor', persisted: null };
  let persisted = sanitizeStrategicDecisionArchitecturePersisted((state as any).strategicDecisionArchitecture) || createEmptyStrategicDecisionArchitecturePersisted();
  const inp = buildStrategicDecisionInputsFromCanonical(state, actorId);
  const ev = evaluateSDAPolicy(def, inp, persisted);
  if (!ev.eligible) return { ok: false, reason: ev.blockedReasons[0] || 'Blocked', persisted };
  const apCost = def.actionPointCost;
  if (state.gameSettings?.actionLimitsEnabled !== false && getRemainingActionPoints(actor as any, state.gameSettings || DEFAULT_GAME_SETTINGS) < apCost) {
    return { ok: false, reason: 'Not enough action points', persisted };
  }
  if (Number(actor.money) < def.cashCost) return { ok: false, reason: 'Insufficient cash', persisted };
  actor.money = Number(actor.money) - def.cashCost;
  actor.actionsUsedThisTurn = (actor.actionsUsedThisTurn || 0) + apCost;
  const instId = sdaNextId(persisted, 'pol');
  persisted.activePolicies[instId] = { definitionId: policyId, actorId, startedTurn: turn, expiresTurn: turn + def.durationTurns, status: 'active', modifiers: def.modifiers.map(m => ({ ...m })) };
  persisted.modifiers = [...persisted.modifiers, ...def.modifiers.map(m => ({ ...m }))].slice(-SDA_LIMITS.modifiers);
  persisted.cooldowns[policyId] = turn + def.cooldownTurns;
  persisted.history = [...persisted.history, { id: sdaNextId(persisted, 'hist'), turn, kind: 'policy_committed', subjectId: policyId, summary: `Committed ${def.title}`, actorId }].slice(-SDA_LIMITS.history);
  persisted.revision += 1;
  (state as any).strategicDecisionArchitecture = persisted;
  return { ok: true, reason: def.title, persisted };
}

export function startStrategicDecisionChain(state: CanonicalGameState, actorId: string, chainId: string, turn: number): { ok: boolean; reason: string; persisted: StrategicDecisionArchitecturePersisted | null } {
  const def = SDA_CHAIN_CATALOG[chainId];
  if (!def) return { ok: false, reason: 'Unknown chain', persisted: null };
  let persisted = sanitizeStrategicDecisionArchitecturePersisted((state as any).strategicDecisionArchitecture) || createEmptyStrategicDecisionArchitecturePersisted();
  const inp = buildStrategicDecisionInputsFromCanonical(state, actorId);
  const ev = evaluateSDAChain(def, inp, persisted);
  if (!ev.eligible) return { ok: false, reason: ev.blockedReasons[0] || 'Blocked', persisted };
  const instId = sdaNextId(persisted, 'chn');
  persisted.activeChains[instId] = { definitionId: chainId, actorId, startedTurn: turn, stepIndex: 0, status: 'in_progress', pendingChoiceId: null, history: [{ turn, note: `Started ${def.title}` }] };
  persisted.cooldowns[chainId] = turn + 3;
  persisted.history = [...persisted.history, { id: sdaNextId(persisted, 'hist'), turn, kind: 'chain_started', subjectId: chainId, summary: `Started chain ${def.title}`, actorId }].slice(-SDA_LIMITS.history);
  persisted.revision += 1;
  (state as any).strategicDecisionArchitecture = persisted;
  return { ok: true, reason: def.title, persisted };
}

export function advanceStrategicDecisionChain(state: CanonicalGameState, actorId: string, chainInstanceId: string, choiceId: string | null, turn: number): { ok: boolean; reason: string; persisted: StrategicDecisionArchitecturePersisted | null; completed: boolean } {
  let persisted = sanitizeStrategicDecisionArchitecturePersisted((state as any).strategicDecisionArchitecture) || createEmptyStrategicDecisionArchitecturePersisted();
  const inst = persisted.activeChains[chainInstanceId];
  if (!inst || inst.actorId !== actorId) return { ok: false, reason: 'Chain not found', persisted, completed: false };
  const def = SDA_CHAIN_CATALOG[inst.definitionId];
  if (!def) return { ok: false, reason: 'Unknown chain definition', persisted, completed: false };
  const step = def.steps[inst.stepIndex];
  if (!step) return { ok: false, reason: 'Chain already finished', persisted, completed: false };
  if (choiceId === 'defer') {
    inst.history = [...inst.history, { turn, note: 'Deferred step' }].slice(-SDA_LIMITS.chainSteps);
    persisted.revision += 1;
    (state as any).strategicDecisionArchitecture = persisted;
    return { ok: true, reason: 'Deferred', persisted, completed: false };
  }
  if (step.policyId) {
    const pr = commitStrategicPolicyAction(state, actorId, step.policyId, turn);
    if (!pr.ok) return { ok: false, reason: pr.reason, persisted, completed: false };
    persisted = pr.persisted || persisted;
  }
  inst.stepIndex += 1;
  inst.history = [...inst.history, { turn, note: `Advanced to step ${inst.stepIndex}` }].slice(-SDA_LIMITS.chainSteps);
  let completed = false;
  if (inst.stepIndex >= def.steps.length) {
    inst.status = 'completed';
    persisted.modifiers = [...persisted.modifiers, ...def.completionModifiers.map(m => ({ ...m }))].slice(-SDA_LIMITS.modifiers);
    persisted.history = [...persisted.history, { id: sdaNextId(persisted, 'hist'), turn, kind: 'chain_completed', subjectId: inst.definitionId, summary: `Completed ${def.title}`, actorId }].slice(-SDA_LIMITS.history);
    completed = true;
  } else {
    inst.status = def.steps[inst.stepIndex].choiceIds ? 'awaiting_choice' : 'in_progress';
  }
  persisted.revision += 1;
  (state as any).strategicDecisionArchitecture = persisted;
  return { ok: true, reason: completed ? 'Chain completed' : 'Advanced', persisted, completed };
}

export function tickStrategicDecisionArchitecture(state: CanonicalGameState, turn: number): StrategicDecisionArchitecturePersisted {
  let persisted = sanitizeStrategicDecisionArchitecturePersisted((state as any).strategicDecisionArchitecture) || createEmptyStrategicDecisionArchitecturePersisted();
  Object.values(persisted.activePolicies).forEach(p => {
    if (p.status === 'active' && turn >= p.expiresTurn) p.status = 'expired';
  });
  persisted.modifiers = persisted.modifiers.map(m => ({ ...m, durationTurns: m.durationTurns - 1 })).filter(m => m.durationTurns > 0);
  persisted.revision += 1;
  persisted.lastUpdatedTurn = turn;
  (state as any).strategicDecisionArchitecture = persisted;
  return persisted;
}

export function buildStrategicDecisionInputsFromCanonical(state: CanonicalGameState, actorId: string): SDAInputs {
  const actor = state.actorsById[actorId] || state.player;
  const gs = state.gameSettings || DEFAULT_GAME_SETTINGS;
  const turn = state.turn || 1;
  const projects = (state.infrastructureProjects || {}) as Record<string, InfrastructureProject>;
  const controlled = Object.entries(state.regions || {}).filter(([, r]: [string, any]) => r?.controller === actorId || r?.owner === actorId).map(([c]) => c);
  const netWorth = typeof (actor as any)?.netWorth === 'number' ? (actor as any).netWorth : Number(actor?.money) || 0;
  const stab = Number((state as any).publicStabilityState?.nationalStability) || 50;
  return {
    turn,
    actorId,
    cash: Number(actor?.money) || 0,
    netWorth,
    currentRegion: actor?.currentRegion || null,
    national: (state as any).nationalSystemsSnapshot || null,
    fiscal: (state as any).publicFinanceState || null,
    stateCapacity: (state as any).stateCapacityState || null,
    priorities: (state as any).nationalPrioritiesSnapshot || null,
    megaprojects: sanitizeMegaprojectsPersisted((state as any).megaprojects),
    projects,
    stability: stab,
    controlledRegions: controlled.length ? controlled : ['NSW', 'VIC']
  };
}

export function buildStrategicDecisionInputsLive(params: {
  turn: number; actorId: string; actor: any; national: NationalSystemsState | null; fiscal: any; stateCapacity: any;
  priorities: NationalPrioritiesState | null; megaprojects: MegaprojectsPersisted | null; projects: Record<string, InfrastructureProject>; stability: number; controlledRegions: string[];
}): SDAInputs {
  return {
    turn: params.turn,
    actorId: params.actorId,
    cash: Number(params.actor?.money) || 0,
    netWorth: typeof params.actor?.netWorth === 'number' ? params.actor.netWorth : Number(params.actor?.money) || 0,
    currentRegion: params.actor?.currentRegion || null,
    national: params.national,
    fiscal: params.fiscal,
    stateCapacity: params.stateCapacity,
    priorities: params.priorities,
    megaprojects: params.megaprojects,
    projects: params.projects,
    stability: params.stability,
    controlledRegions: params.controlledRegions
  };
}

/** Downstream: small bounded tie-breaker for infrastructure / project ranking (never legality). */
export function strategicDecisionProjectRankingBonus(persisted: StrategicDecisionArchitecturePersisted | null, projectType: string, regionId: string | null): number {
  if (!persisted) return 0;
  let bonus = 0;
  persisted.modifiers.forEach(m => {
    if (m.kind === 'project_speed_pct') bonus += m.value * 10;
    if (m.kind === 'project_cost_pct') bonus += m.value * 8;
    if (m.kind === 'national_network_delta' && regionId) bonus += m.value * 5;
  });
  Object.values(persisted.activePolicies).filter(p => p.status === 'active').forEach(p => {
    const def = SDA_POLICY_CATALOG[p.definitionId];
    if (!def) return;
    if (def.domain === 'infrastructure' && /rail|port|grid|pipeline|freight|energy|digital/.test(projectType)) bonus += 1.5;
    if (def.domain === 'industry' && /manufacturing|mining|research|agriculture/.test(projectType)) bonus += 1.2;
  });
  return sdaClamp(sdaR(bonus, 2), -4, 4);
}

export function strategicDecisionDepositBonusPct(persisted: StrategicDecisionArchitecturePersisted | null): number {
  if (!persisted) return 0;
  return persisted.modifiers.filter(m => m.kind === 'deposit_bonus_pct').reduce((a, m) => a + m.value, 0);
}

export interface SDADerivedEvent { id: string; turn: number; kind: 'strategic_policy_committed' | 'strategic_chain_completed' | 'strategic_chain_failed'; subjectId: string; text: string; significance: 'meaningful' | 'major'; actorId: string }

export function strategicDecisionToWorldEvent(ev: SDADerivedEvent, day: number, observers: string[]): StrategicWorldEvent {
  return {
    id: `sda_${ev.id}`.slice(0, 80),
    turn: ev.turn,
    day,
    sourceSystem: 'v10.14_strategic_decision_architecture',
    sourceEventId: ev.id,
    actorId: ev.actorId,
    teamId: null,
    kind: ev.kind === 'strategic_chain_completed' ? 'strategy_phase_changed' : 'objective_unblocked',
    subjectType: 'strategy',
    subjectId: ev.subjectId,
    magnitude: ev.significance === 'major' ? 0.85 : 0.55,
    significance: ev.significance,
    visibility: 'public',
    observers,
    evidence: [ev.text],
    before: {},
    after: { subjectId: ev.subjectId },
    delta: {},
    strategicMeaning: ev.text,
    affectedDomains: ['strategy', 'team'],
    tags: ['v1014', 'strategic_decision'],
    layer: 'strategic',
    claimKind: 'fact',
    rootEventId: ev.id,
    depth: 0,
    sequenceIndex: 0
  } as StrategicWorldEvent;
}

export interface StrategicDecisionWorldView { state: StrategicDecisionArchitectureState; persisted: StrategicDecisionArchitecturePersisted | null; inputs: SDAInputs; evaluations: { policies: SDAEvaluation[]; chains: SDAEvaluation[] } }


export function runV1014StrategicDecisionArchitectureSelfTests(): V9SelfTestResult[] {
  const results: V9SelfTestResult[] = [];
  const check = (id: string, name: string, fn: () => boolean | string) => {
    try { const out = fn(); results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') }); }
    catch (e) { results.push({ id, name, passed: false, detail: e instanceof Error ? e.message : String(e) }); }
  };
  const baseState = (): CanonicalGameState => ({
    turn: 5, day: 5, gameSettings: { ...createDefaultGameSettings(), strategicDecisionArchitectureEnabled: true, nationalSystemsEnabled: true },
    player: { id: 'player', name: 'Player', money: 8000, currentRegion: 'NSW', actionsUsedThisTurn: 0, teamId: TEAM_PLAYER_ID } as any,
    actorsById: { player: { id: 'player', money: 8000, currentRegion: 'NSW', actionsUsedThisTurn: 0, teamId: TEAM_PLAYER_ID } } as any,
    infrastructureProjects: {}, regions: { NSW: { controller: 'player' }, VIC: { controller: 'player' } } as any,
    publicStabilityState: { nationalStability: 55 } as any,
    strategicDecisionArchitecture: null
  } as any);

  check('sda_pol_def_0', 'Policy catalog includes fiscal_discipline', () => Boolean(SDA_POLICY_CATALOG['fiscal_discipline']?.id === 'fiscal_discipline'));
  check('sda_pol_def_1', 'Policy catalog includes growth_stimulus', () => Boolean(SDA_POLICY_CATALOG['growth_stimulus']?.id === 'growth_stimulus'));
  check('sda_pol_def_2', 'Policy catalog includes savings_mobilization', () => Boolean(SDA_POLICY_CATALOG['savings_mobilization']?.id === 'savings_mobilization'));
  check('sda_pol_def_3', 'Policy catalog includes debt_restructure_plan', () => Boolean(SDA_POLICY_CATALOG['debt_restructure_plan']?.id === 'debt_restructure_plan'));
  check('sda_pol_def_4', 'Policy catalog includes export_push', () => Boolean(SDA_POLICY_CATALOG['export_push']?.id === 'export_push'));
  check('sda_pol_def_5', 'Policy catalog includes import_substitution_drive', () => Boolean(SDA_POLICY_CATALOG['import_substitution_drive']?.id === 'import_substitution_drive'));
  check('sda_pol_def_6', 'Policy catalog includes corridor_acceleration', () => Boolean(SDA_POLICY_CATALOG['corridor_acceleration']?.id === 'corridor_acceleration'));
  check('sda_pol_def_7', 'Policy catalog includes grid_hardening', () => Boolean(SDA_POLICY_CATALOG['grid_hardening']?.id === 'grid_hardening'));
  check('sda_pol_def_8', 'Policy catalog includes digital_backbone', () => Boolean(SDA_POLICY_CATALOG['digital_backbone']?.id === 'digital_backbone'));
  check('sda_pol_def_9', 'Policy catalog includes port_modernization', () => Boolean(SDA_POLICY_CATALOG['port_modernization']?.id === 'port_modernization'));
  check('sda_pol_def_10', 'Policy catalog includes water_security_program', () => Boolean(SDA_POLICY_CATALOG['water_security_program']?.id === 'water_security_program'));
  check('sda_pol_def_11', 'Policy catalog includes freight_priority', () => Boolean(SDA_POLICY_CATALOG['freight_priority']?.id === 'freight_priority'));
  check('sda_pol_def_12', 'Policy catalog includes manufacturing_revival', () => Boolean(SDA_POLICY_CATALOG['manufacturing_revival']?.id === 'manufacturing_revival'));
  check('sda_pol_def_13', 'Policy catalog includes mining_efficiency', () => Boolean(SDA_POLICY_CATALOG['mining_efficiency']?.id === 'mining_efficiency'));
  check('sda_pol_def_14', 'Policy catalog includes agtech_rollout', () => Boolean(SDA_POLICY_CATALOG['agtech_rollout']?.id === 'agtech_rollout'));
  check('sda_pol_def_15', 'Policy catalog includes research_commercialization_push', () => Boolean(SDA_POLICY_CATALOG['research_commercialization_push']?.id === 'research_commercialization_push'));
  check('sda_pol_def_16', 'Policy catalog includes supply_chain_resilience', () => Boolean(SDA_POLICY_CATALOG['supply_chain_resilience']?.id === 'supply_chain_resilience'));
  check('sda_pol_def_17', 'Policy catalog includes industrial_diversification', () => Boolean(SDA_POLICY_CATALOG['industrial_diversification']?.id === 'industrial_diversification'));
  check('sda_pol_def_18', 'Policy catalog includes trade_mission', () => Boolean(SDA_POLICY_CATALOG['trade_mission']?.id === 'trade_mission'));
  check('sda_pol_def_19', 'Policy catalog includes regional_pact', () => Boolean(SDA_POLICY_CATALOG['regional_pact']?.id === 'regional_pact'));
  check('sda_pol_def_20', 'Policy catalog includes investment_treaty', () => Boolean(SDA_POLICY_CATALOG['investment_treaty']?.id === 'investment_treaty'));
  check('sda_pol_def_21', 'Policy catalog includes sanctions_relief', () => Boolean(SDA_POLICY_CATALOG['sanctions_relief']?.id === 'sanctions_relief'));
  check('sda_pol_def_22', 'Policy catalog includes cooperation_summit', () => Boolean(SDA_POLICY_CATALOG['cooperation_summit']?.id === 'cooperation_summit'));
  check('sda_pol_def_23', 'Policy catalog includes neutral_arbitration', () => Boolean(SDA_POLICY_CATALOG['neutral_arbitration']?.id === 'neutral_arbitration'));
  check('sda_chain_economy', 'Chain catalog includes chain_economy_master', () => Boolean(SDA_CHAIN_CATALOG['chain_economy_master']?.steps?.length >= 2));
  check('sda_chain_infrastructure', 'Chain catalog includes chain_infrastructure_master', () => Boolean(SDA_CHAIN_CATALOG['chain_infrastructure_master']?.steps?.length >= 2));
  check('sda_chain_industry', 'Chain catalog includes chain_industry_master', () => Boolean(SDA_CHAIN_CATALOG['chain_industry_master']?.steps?.length >= 2));
  check('sda_chain_diplomacy', 'Chain catalog includes chain_diplomacy_master', () => Boolean(SDA_CHAIN_CATALOG['chain_diplomacy_master']?.steps?.length >= 2));
  check('sda_chain_workforce', 'Chain catalog includes chain_workforce_master', () => Boolean(SDA_CHAIN_CATALOG['chain_workforce_master']?.steps?.length >= 2));
  check('sda_chain_resilience', 'Chain catalog includes chain_resilience_master', () => Boolean(SDA_CHAIN_CATALOG['chain_resilience_master']?.steps?.length >= 2));
  check('sda_chain_governance', 'Chain catalog includes chain_governance_master', () => Boolean(SDA_CHAIN_CATALOG['chain_governance_master']?.steps?.length >= 2));
  check('sda_chain_domestic', 'Chain catalog includes chain_domestic_master', () => Boolean(SDA_CHAIN_CATALOG['chain_domestic_master']?.steps?.length >= 2));
  check('sda_sanitize_null', 'sanitize null → null', () => sanitizeStrategicDecisionArchitecturePersisted(null) === null);
  check('sda_sanitize_empty', 'sanitize creates valid persisted', () => sanitizeStrategicDecisionArchitecturePersisted(createEmptyStrategicDecisionArchitecturePersisted())?.schemaVersion === V1014_SCHEMA_VERSION);
  check('sda_commit_policy', 'commit policy deducts cash and writes persisted', () => {
    const st = baseState();
    const pid = SDA_POLICY_IDS[0];
    const r = commitStrategicPolicyAction(st, 'player', pid, 5);
    const p = sanitizeStrategicDecisionArchitecturePersisted((st as any).strategicDecisionArchitecture);
    return r.ok && p && Object.keys(p.activePolicies).length === 1 && st.actorsById.player.money < 8000 || JSON.stringify({ ok: r.ok, n: p && Object.keys(p.activePolicies).length });
  });
  check('sda_chain_flow', 'start + advance chain progresses', () => {
    const st = baseState();
    const cid = SDA_CHAIN_IDS[0];
    const s = startStrategicDecisionChain(st, 'player', cid, 5);
    if (!s.ok) return s.reason;
    const inst = Object.keys((st as any).strategicDecisionArchitecture.activeChains)[0];
    const a = advanceStrategicDecisionChain(st, 'player', inst, 'commit', 5);
    return a.ok || a.reason;
  });
  check('sda_ranking_bonus_bounded', 'project ranking bonus bounded ±4', () => {
    const p = createEmptyStrategicDecisionArchitecturePersisted();
    p.modifiers = Array.from({ length: 20 }, (_, i) => ({ kind: 'project_speed_pct' as SDAModifierKind, value: 0.5, durationTurns: 5, label: 'x' }));
    const b = strategicDecisionProjectRankingBonus(p, 'freight_rail_upgrade', 'NSW');
    return b <= 4 && b >= -4 || b;
  });
  check('sda_tick_expires', 'tick expires policies', () => {
    const st = baseState();
    commitStrategicPolicyAction(st, 'player', SDA_POLICY_IDS[0], 5);
    tickStrategicDecisionArchitecture(st, 999);
    const p = sanitizeStrategicDecisionArchitecturePersisted((st as any).strategicDecisionArchitecture);
    return Boolean(p && Object.values(p.activePolicies).every(x => x.status === 'expired'));
  });
  check('sda_reduce_commit', 'reduceGameAction commit_strategic_policy path', () => {
    const st = baseState();
    const res = reduceGameAction(st, { type: 'commit_strategic_policy', actorId: 'player', parameters: { policyId: SDA_POLICY_IDS[0] } } as any, { active: true, actorId: 'player' } as any);
    return res.actionExecuted && sanitizeStrategicDecisionArchitecturePersisted((res.nextState as any).strategicDecisionArchitecture) !== null || 'not executed';
  });
  return results;
}


export const StrategicDecisionArchitecturePanel: React.FC<{
  view: StrategicDecisionWorldView | null;
  theme: any;
  onCommitPolicy: (policyId: string) => void;
  onStartChain: (chainId: string) => void;
  onAdvanceChain: (instanceId: string, choiceId: string | null) => void;
}> = ({ view, theme, onCommitPolicy, onStartChain, onAdvanceChain }) => {
  if (!view) return null;
  const { state, persisted, evaluations } = view;
  const activeChains = Object.entries(persisted?.activeChains || {});
  return (
    <section aria-labelledby="sda-panel-h" className={`${theme.card} ${theme.border} border rounded-xl p-4 ${theme.shadow} text-xs space-y-2`} data-testid="sda-panel">
      <h3 id="sda-panel-h" className="font-bold text-sm">🎯 Strategic Decision Architecture</h3>
      <div className="opacity-80">{state.summary} · Turn {state.turn}</div>
      <details open data-testid="sda-policies">
        <summary className="cursor-pointer font-semibold">Policy portfolio ({evaluations.policies.filter(p => p.eligible).length} ready)</summary>
        <div className="max-h-48 overflow-y-auto space-y-1 mt-1">
          {evaluations.policies.slice(0, 24).map(ev => {
            const def = SDA_POLICY_CATALOG[ev.definitionId];
            return (
              <div key={ev.definitionId} className="flex flex-wrap items-center gap-1 border-b border-slate-700/40 pb-1">
                <span>{def?.icon} <b>{def?.title || ev.definitionId}</b></span>
                <span className={ev.eligible ? 'text-emerald-400' : 'text-amber-400'}>{ev.eligible ? 'Ready' : ev.blockedReasons[0] || 'Blocked'}</span>
                {ev.eligible && <button type="button" className="px-1.5 py-0.5 rounded border border-teal-500" onClick={() => onCommitPolicy(ev.definitionId)} data-testid={`sda-commit-${ev.definitionId}`}>Commit</button>}
              </div>
            );
          })}
        </div>
      </details>
      <details data-testid="sda-chains">
        <summary className="cursor-pointer font-semibold">Decision chains</summary>
        {evaluations.chains.map(ev => {
          const def = SDA_CHAIN_CATALOG[ev.definitionId];
          return (
            <div key={ev.definitionId} className="flex flex-wrap gap-1 items-center">
              <span>{def?.icon} {def?.title}</span>
              {ev.eligible && <button type="button" className="underline" onClick={() => onStartChain(ev.definitionId)} data-testid={`sda-start-${ev.definitionId}`}>Start</button>}
            </div>
          );
        })}
        {activeChains.map(([id, ch]) => (
          <div key={id} className="mt-1 p-1 rounded border border-slate-600/50">
            <div>{SDA_CHAIN_CATALOG[ch.definitionId]?.title} — step {ch.stepIndex + 1}/{SDA_CHAIN_CATALOG[ch.definitionId]?.steps.length || '?'}</div>
            <button type="button" className="underline mr-2" onClick={() => onAdvanceChain(id, 'commit')}>Advance</button>
            <button type="button" className="underline opacity-70" onClick={() => onAdvanceChain(id, 'defer')}>Defer</button>
          </div>
        ))}
      </details>
    </section>
  );
};

