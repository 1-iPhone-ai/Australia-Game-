/** Operation 10M · Agent 05 — dynamic events & narrative (standalone contract). */

export const OP10M_AGENT05_MODULE_ID = 'op10m_agent05_dynamic_events';
export const OP10M_AGENT05_MODULE_VERSION = '1.2.0';

export type Op10mChainPhase = 'signal' | 'pressure' | 'rupture' | 'recovery';

export type Op10mCrisisCategory =
  | 'environmental'
  | 'economic'
  | 'infrastructure'
  | 'political'
  | 'technological';

export type Op10mSeason = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export type Op10mContentTheme =
  | 'mining'
  | 'agriculture'
  | 'energy'
  | 'renewables'
  | 'technology'
  | 'research'
  | 'trade'
  | 'logistics'
  | 'finance'
  | 'tourism'
  | 'water'
  | 'manufacturing'
  | 'governance'
  | 'environment'
  | 'exploration';

export interface Op10mPersistentModifier {
  id: string;
  sourceChainId: string;
  description: string;
  /** Applied each turn until expiry. */
  stabilityDeltaPerTurn: number;
  moneyDeltaPerTurn: number;
  sectorKey?: string;
  sectorDeltaPerTurn?: number;
  expiresDay: number;
}

export interface Op10mSimulationSlice {
  day: number;
  money: number;
  nationalStability: number;
  regionalStability: Record<string, number>;
  season: Op10mSeason;
  sectorActivity: Record<string, number>;
  /** Story / chain flags persisted on real save state. */
  flags: Record<string, boolean | number | string>;
  activeCrisisCount: number;
}

export interface Op10mTriggerRequireSeason {
  k: 'season';
  seasons: Op10mSeason[];
}

export interface Op10mTriggerRequireSector {
  k: 'sector';
  sector: string;
  min: number;
}

export interface Op10mTriggerRequireStability {
  k: 'stability';
  max?: number;
  min?: number;
}

export interface Op10mTriggerRequireMoney {
  k: 'money';
  max?: number;
  min?: number;
}

export interface Op10mTriggerRequireFlag {
  k: 'flag';
  key: string;
  equals?: boolean | number | string;
}

export interface Op10mTriggerRequireNoFlag {
  k: 'no_flag';
  key: string;
}

export interface Op10mTriggerRequireMinDay {
  k: 'min_day';
  day: number;
}

export type Op10mRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export interface Op10mRegionalContagionLedger {
  /** Per-target-region pressure used for deep-chain arming thresholds. */
  pressureByRegion: Record<string, number>;
  firedHookIds: string[];
  armedFollowUps: Op10mArmedDeepChainFollowUp[];
  /** Chain ids that may bypass seasonal gates on signal entry (cross-region escalation). */
  armedBypassChainIds: string[];
}

export interface Op10mArmedDeepChainFollowUp {
  id: string;
  sourceChainId: string;
  targetChainId: string;
  targetRegion: string;
  theme: Op10mContentTheme;
  armedDay: number;
  expiresDay: number;
}

export interface Op10mRegionalNarrativeHook {
  hookId: string;
  sourceRegion: Op10mRegionId;
  /** Minimum active-chain phase in the source region required to fire. */
  watchPhase: Op10mChainPhase;
  theme: Op10mContentTheme;
  category: Op10mCrisisCategory;
  targetRegions: Op10mRegionId[];
  narrativeBeat: string;
  cooldownTurns: number;
  contagionDelta: number;
  neighborStabilityDelta: number;
  setsContagionFlag: boolean;
  armNeighborFollowUp: boolean;
}

export interface Op10mTriggerRequireRegionalContagion {
  k: 'regional_contagion';
  region: string;
  theme: Op10mContentTheme;
  min: number;
}

export interface Op10mTriggerRequireArmedBypass {
  k: 'armed_bypass';
  chainId: string;
}

export interface Op10mTriggerRequireActivePhase {
  k: 'chain_phase';
  phase: Op10mChainPhase;
}

export interface Op10mTriggerRequireMinActiveCrises {
  k: 'min_active_crises';
  min: number;
}

export interface Op10mTriggerRequireCombinedSector {
  k: 'combined_sector';
  sectors: Array<{ sector: string; min: number }>;
}

export interface Op10mTriggerRequireCrossSystemCoupling {
  k: 'cross_system_coupling';
  region: string;
  synergyId: string;
  min: number;
}

export interface Op10mTriggerRequirePeerChainPhase {
  k: 'peer_chain_phase';
  region: string;
  theme: Op10mContentTheme;
  minPhase: Op10mChainPhase;
}

export type Op10mTriggerRequirement =
  | Op10mTriggerRequireSeason
  | Op10mTriggerRequireSector
  | Op10mTriggerRequireStability
  | Op10mTriggerRequireMoney
  | Op10mTriggerRequireFlag
  | Op10mTriggerRequireNoFlag
  | Op10mTriggerRequireMinDay
  | Op10mTriggerRequireActivePhase
  | Op10mTriggerRequireRegionalContagion
  | Op10mTriggerRequireArmedBypass
  | Op10mTriggerRequireMinActiveCrises
  | Op10mTriggerRequireCombinedSector
  | Op10mTriggerRequireCrossSystemCoupling
  | Op10mTriggerRequirePeerChainPhase;

export interface Op10mConsequenceMutation {
  moneyDelta?: number;
  stabilityDelta?: number;
  regionalStabilityDelta?: Record<string, number>;
  setFlags?: Record<string, boolean | number | string>;
  clearFlags?: string[];
  sectorActivityDelta?: Record<string, number>;
  escalateToPhase?: Op10mChainPhase;
  resolveChain?: boolean;
  spawnModifier?: Omit<Op10mPersistentModifier, 'id' | 'sourceChainId'>;
  incrementActiveCrises?: number;
}

export interface Op10mNarrativeChoice {
  id: string;
  label: string;
  description: string;
  costMoney: number;
  onSelect: Op10mConsequenceMutation;
  onDefer?: Op10mConsequenceMutation;
}

export interface Op10mChainStageTemplate {
  phase: Op10mChainPhase;
  title: string;
  narrative: string;
  requires: Op10mTriggerRequirement[];
  cooldownTurns: number;
  choices: Op10mNarrativeChoice[];
  passiveTick?: Op10mConsequenceMutation;
}

export interface Op10mChainDescriptor {
  chainId: string;
  region: string;
  theme: Op10mContentTheme;
  category: Op10mCrisisCategory;
  phases: Op10mChainStageTemplate[];
  entryFlag: string;
  exitFlag: string;
}

export interface Op10mPendingPlayerResponse {
  id: string;
  chainId: string;
  stagePhase: Op10mChainPhase;
  regionId: string;
  choiceIds: string[];
  openedDay: number;
  expiresDay: number;
  snapshot: Pick<Op10mSimulationSlice, 'day' | 'money' | 'nationalStability' | 'activeCrisisCount'>;
}

export interface Op10mActiveChainRuntime {
  chainId: string;
  phase: Op10mChainPhase;
  startedDay: number;
  lastAdvancedDay: number;
  stageCooldownUntilDay: number;
}

export interface Op10mCooldownEntry {
  key: string;
  lastFiredDay: number;
  cooldownTurns: number;
}

export interface Op10mNarrativeEngineState {
  version: 1;
  activeChains: Record<string, Op10mActiveChainRuntime>;
  pendingResponses: Op10mPendingPlayerResponse[];
  resolvedChainIds: string[];
  cooldowns: Op10mCooldownEntry[];
  persistentModifiers: Op10mPersistentModifier[];
  telemetry: {
    eligibilityChecks: number;
    chainsAdvanced: number;
    responsesOpened: number;
    responsesResolved: number;
    consequencesApplied: number;
    regionalHooksFired: number;
    deepFollowUpsArmed: number;
    crossSystemCouplings: number;
  };
  regional?: Op10mRegionalContagionLedger;
}

export interface Op10mTickResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
}

export interface Op10mResolveResult {
  simulation: Op10mSimulationSlice;
  narrative: Op10mNarrativeEngineState;
  log: string[];
  error: string | null;
}
