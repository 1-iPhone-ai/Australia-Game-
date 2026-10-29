/** Operation 10M · Agent 05 — dynamic events & narrative (standalone contract). */

export const OP10M_AGENT05_MODULE_ID = 'op10m_agent05_dynamic_events';
export const OP10M_AGENT05_MODULE_VERSION = '1.14.0';
export const OP10M_TURN_COMPUTE_DIGEST_FLAG = 'op10m_turn_compute_digest';

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

export interface Op10mTriggerRequireMinNationalEscalation {
  k: 'min_national_escalation';
  min: number;
}

export interface Op10mTriggerRequireMinResolvedChains {
  k: 'min_resolved_chains';
  min: number;
}

export interface Op10mTriggerRequireMultiRegionContagion {
  k: 'multi_region_contagion';
  minPerRegion: number;
  minRegions: number;
}

export interface Op10mTriggerRequireMinTurnComputePasses {
  k: 'min_turn_compute_passes';
  min: number;
}

export interface Op10mTriggerRequireMinDeferredQueue {
  k: 'min_deferred_queue';
  min: number;
}

export interface Op10mTriggerRequireMinComputeTurn {
  k: 'min_compute_turn';
  min: number;
}

export interface Op10mTriggerRequireTurnComputeDigestSet {
  k: 'turn_compute_digest_set';
}

export interface Op10mTriggerRequireComputeTurnDrift {
  k: 'compute_turn_drift';
}

export interface Op10mTriggerRequireNoComputeTurnDrift {
  k: 'no_compute_turn_drift';
}

export interface Op10mTriggerRequireComputeDriftSettled {
  k: 'compute_drift_settled';
}

export interface Op10mTriggerRequireComputeTurnGapAck {
  k: 'compute_turn_gap_ack';
}

export interface Op10mTriggerRequireMinPendingResponses {
  k: 'min_pending_responses';
  min: number;
}

export interface Op10mTriggerRequirePendingBacklog {
  k: 'pending_backlog';
}

export interface Op10mTriggerRequirePendingArbitration {
  k: 'pending_arbitration';
}

export interface Op10mTriggerRequirePendingExpiryWave {
  k: 'pending_expiry_wave';
}

export interface Op10mTriggerRequirePendingQueueClear {
  k: 'pending_queue_clear';
}

export interface Op10mTriggerRequireNoPendingBacklog {
  k: 'no_pending_backlog';
}

export interface Op10mTriggerRequirePendingStabilizationWave {
  k: 'pending_stabilization_wave';
}

export interface Op10mTriggerRequirePostQueueCalm {
  k: 'post_queue_calm';
}

export interface Op10mTriggerRequireStabilizationClosureWave {
  k: 'stabilization_closure_wave';
}

export interface Op10mTriggerRequireDigestClosureLatch {
  k: 'digest_closure_latch';
}

export interface Op10mTriggerRequireIntegrationSyncGate {
  k: 'integration_sync_gate';
}

export interface Op10mTriggerRequireClosureSealReady {
  k: 'closure_seal_ready';
}

export interface Op10mTriggerRequireAssemblyHandoffWave {
  k: 'assembly_handoff_wave';
}

export interface Op10mTriggerRequireSyncManifestLatch {
  k: 'sync_manifest_latch';
}

export interface Op10mTriggerRequireChunkAssemblySeal {
  k: 'chunk_assembly_seal';
}

export interface Op10mTriggerRequireHandoffManifestCommit {
  k: 'handoff_manifest_commit';
}

export interface Op10mTriggerRequireModuleManifestAnchor {
  k: 'module_manifest_anchor';
}

export interface Op10mTriggerRequireChunkInlineReady {
  k: 'chunk_inline_ready';
}

export interface Op10mTriggerRequireInlineAssemblyLock {
  k: 'inline_assembly_lock';
}

export interface Op10mTriggerRequireAgent25SlotReady {
  k: 'agent25_slot_ready';
}

export interface Op10mTriggerRequirePostCrisisSlotCommit {
  k: 'post_crisis_slot_commit';
}

export interface Op10mTriggerRequireChunkManifestSealed {
  k: 'chunk_manifest_sealed';
}

export interface Op10mTriggerRequireScaleWaveBundleLatch {
  k: 'scale_wave_bundle_latch';
}

export interface Op10mTriggerRequireAgent25AssemblyWaveReady {
  k: 'agent25_assembly_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveCatalogCommit {
  k: 'scale_wave_catalog_commit';
}

export interface Op10mTriggerRequireAgent25BundleCatalogSealed {
  k: 'agent25_bundle_catalog_sealed';
}

export interface Op10mTriggerRequireScaleWaveOriginGate {
  k: 'scale_wave_origin_gate';
}

export interface Op10mTriggerRequireAgent25OriginWaveAttested {
  k: 'agent25_origin_wave_attested';
}

export interface Op10mTriggerRequireScaleWaveProjectionLatch {
  k: 'scale_wave_projection_latch';
}

export interface Op10mTriggerRequireAgent25ProjectionWaveReady {
  k: 'agent25_projection_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveDryRunGate {
  k: 'scale_wave_dry_run_gate';
}

export interface Op10mTriggerRequireAgent25DryRunWaveAttested {
  k: 'agent25_dry_run_wave_attested';
}

export interface Op10mTriggerRequireScaleWaveGateClosureLatch {
  k: 'scale_wave_gate_closure_latch';
}

export interface Op10mTriggerRequireAgent25GateClosureWaveReady {
  k: 'agent25_gate_closure_wave_ready';
}

export interface Op10mTriggerRequireScaleWavePostClosureCommit {
  k: 'scale_wave_post_closure_commit';
}

export interface Op10mTriggerRequireAgent25PostClosureWaveSealed {
  k: 'agent25_post_closure_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveTrancheSyncLatch {
  k: 'scale_wave_tranche_sync_latch';
}

export interface Op10mTriggerRequireAgent25TrancheSyncWaveReady {
  k: 'agent25_tranche_sync_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveTrancheReadyCommit {
  k: 'scale_wave_tranche_ready_commit';
}

export interface Op10mTriggerRequireAgent25TrancheReadyWaveSealed {
  k: 'agent25_tranche_ready_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksLatch {
  k: 'scale_wave_full_chunks_latch';
}

export interface Op10mTriggerRequireAgent25FullChunksWaveReady {
  k: 'agent25_full_chunks_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksCommit {
  k: 'scale_wave_full_chunks_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksWaveSealed {
  k: 'agent25_full_chunks_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksSyncLatch {
  k: 'scale_wave_full_chunks_sync_latch';
}

export interface Op10mTriggerRequireAgent25FullChunksSyncWaveReady {
  k: 'agent25_full_chunks_sync_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksSyncCommit {
  k: 'scale_wave_full_chunks_sync_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksSyncWaveSealed {
  k: 'agent25_full_chunks_sync_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffLatch {
  k: 'scale_wave_full_chunks_handoff_latch';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffWaveReady {
  k: 'agent25_full_chunks_handoff_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffCommit {
  k: 'scale_wave_full_chunks_handoff_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffWaveSealed {
  k: 'agent25_full_chunks_handoff_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffSyncLatch {
  k: 'scale_wave_full_chunks_handoff_sync_latch';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffSyncWaveReady {
  k: 'agent25_full_chunks_handoff_sync_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffSyncCommit {
  k: 'scale_wave_full_chunks_handoff_sync_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffSyncWaveSealed {
  k: 'agent25_full_chunks_handoff_sync_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureLatch {
  k: 'scale_wave_full_chunks_handoff_closure_latch';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureWaveReady {
  k: 'agent25_full_chunks_handoff_closure_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureCommit {
  k: 'scale_wave_full_chunks_handoff_closure_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureWaveSealed {
  k: 'agent25_full_chunks_handoff_closure_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureSyncLatch {
  k: 'scale_wave_full_chunks_handoff_closure_sync_latch';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureSyncWaveReady {
  k: 'agent25_full_chunks_handoff_closure_sync_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureSyncCommit {
  k: 'scale_wave_full_chunks_handoff_closure_sync_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureSyncWaveSealed {
  k: 'agent25_full_chunks_handoff_closure_sync_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureSealLatch {
  k: 'scale_wave_full_chunks_handoff_closure_seal_latch';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureSealWaveReady {
  k: 'agent25_full_chunks_handoff_closure_seal_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureSealCommit {
  k: 'scale_wave_full_chunks_handoff_closure_seal_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureSealWaveSealed {
  k: 'agent25_full_chunks_handoff_closure_seal_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureSealSyncLatch {
  k: 'scale_wave_full_chunks_handoff_closure_seal_sync_latch';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureSealSyncWaveReady {
  k: 'agent25_full_chunks_handoff_closure_seal_sync_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureSealSyncCommit {
  k: 'scale_wave_full_chunks_handoff_closure_seal_sync_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureSealSyncWaveSealed {
  k: 'agent25_full_chunks_handoff_closure_seal_sync_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeLatch {
  k: 'scale_wave_full_chunks_handoff_closure_finalize_latch';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeWaveReady {
  k: 'agent25_full_chunks_handoff_closure_finalize_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeCommit {
  k: 'scale_wave_full_chunks_handoff_closure_finalize_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeWaveSealed {
  k: 'agent25_full_chunks_handoff_closure_finalize_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSyncLatch {
  k: 'scale_wave_full_chunks_handoff_closure_finalize_sync_latch';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSyncWaveReady {
  k: 'agent25_full_chunks_handoff_closure_finalize_sync_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSyncCommit {
  k: 'scale_wave_full_chunks_handoff_closure_finalize_sync_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSyncWaveSealed {
  k: 'agent25_full_chunks_handoff_closure_finalize_sync_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSealLatch {
  k: 'scale_wave_full_chunks_handoff_closure_finalize_seal_latch';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSealWaveReady {
  k: 'agent25_full_chunks_handoff_closure_finalize_seal_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSealCommit {
  k: 'scale_wave_full_chunks_handoff_closure_finalize_seal_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSealWaveSealed {
  k: 'agent25_full_chunks_handoff_closure_finalize_seal_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatch {
  k: 'scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSealSyncWaveReady {
  k: 'agent25_full_chunks_handoff_closure_finalize_seal_sync_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchCommit {
  k: 'scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSealSyncWaveSealed {
  k: 'agent25_full_chunks_handoff_closure_finalize_seal_sync_wave_sealed';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReady {
  k: 'scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSealSyncLatchWaveReady {
  k: 'agent25_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready';
}

export interface Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommit {
  k: 'scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit';
}

export interface Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommit {
  k: 'agent25_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit';
}

export type Op10mComputeTurnStage =
  | 'pre_simulation'
  | 'post_simulation'
  | 'narrative_eligibility'
  | 'finalize';

export interface Op10mDeferredNarrativeMutation {
  id: string;
  chainId: string;
  firesOnTurn: number;
  enqueuedDay: number;
  mutation: Op10mConsequenceMutation;
}

export interface Op10mTurnComputeLedger {
  lastTurn: number;
  lastDay: number;
  computePassCount: number;
  turnComputeDigest: string;
  deferredMutations: Op10mDeferredNarrativeMutation[];
  lastStages: Op10mComputeTurnStage[];
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
  | Op10mTriggerRequirePeerChainPhase
  | Op10mTriggerRequireMinNationalEscalation
  | Op10mTriggerRequireMinResolvedChains
  | Op10mTriggerRequireMultiRegionContagion
  | Op10mTriggerRequireMinTurnComputePasses
  | Op10mTriggerRequireMinDeferredQueue
  | Op10mTriggerRequireMinComputeTurn
  | Op10mTriggerRequireTurnComputeDigestSet
  | Op10mTriggerRequireComputeTurnDrift
  | Op10mTriggerRequireNoComputeTurnDrift
  | Op10mTriggerRequireComputeDriftSettled
  | Op10mTriggerRequireComputeTurnGapAck
  | Op10mTriggerRequireMinPendingResponses
  | Op10mTriggerRequirePendingBacklog
  | Op10mTriggerRequirePendingArbitration
  | Op10mTriggerRequirePendingExpiryWave
  | Op10mTriggerRequirePendingQueueClear
  | Op10mTriggerRequireNoPendingBacklog
  | Op10mTriggerRequirePendingStabilizationWave
  | Op10mTriggerRequirePostQueueCalm
  | Op10mTriggerRequireStabilizationClosureWave
  | Op10mTriggerRequireDigestClosureLatch
  | Op10mTriggerRequireIntegrationSyncGate
  | Op10mTriggerRequireClosureSealReady
  | Op10mTriggerRequireAssemblyHandoffWave
  | Op10mTriggerRequireSyncManifestLatch
  | Op10mTriggerRequireChunkAssemblySeal
  | Op10mTriggerRequireHandoffManifestCommit
  | Op10mTriggerRequireModuleManifestAnchor
  | Op10mTriggerRequireChunkInlineReady
  | Op10mTriggerRequireInlineAssemblyLock
  | Op10mTriggerRequireAgent25SlotReady
  | Op10mTriggerRequirePostCrisisSlotCommit
  | Op10mTriggerRequireChunkManifestSealed
  | Op10mTriggerRequireScaleWaveBundleLatch
  | Op10mTriggerRequireAgent25AssemblyWaveReady
  | Op10mTriggerRequireScaleWaveCatalogCommit
  | Op10mTriggerRequireAgent25BundleCatalogSealed
  | Op10mTriggerRequireScaleWaveOriginGate
  | Op10mTriggerRequireAgent25OriginWaveAttested
  | Op10mTriggerRequireScaleWaveProjectionLatch
  | Op10mTriggerRequireAgent25ProjectionWaveReady
  | Op10mTriggerRequireScaleWaveDryRunGate
  | Op10mTriggerRequireAgent25DryRunWaveAttested
  | Op10mTriggerRequireScaleWaveGateClosureLatch
  | Op10mTriggerRequireAgent25GateClosureWaveReady
  | Op10mTriggerRequireScaleWavePostClosureCommit
  | Op10mTriggerRequireAgent25PostClosureWaveSealed
  | Op10mTriggerRequireScaleWaveTrancheSyncLatch
  | Op10mTriggerRequireAgent25TrancheSyncWaveReady
  | Op10mTriggerRequireScaleWaveTrancheReadyCommit
  | Op10mTriggerRequireAgent25TrancheReadyWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksLatch
  | Op10mTriggerRequireAgent25FullChunksWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksCommit
  | Op10mTriggerRequireAgent25FullChunksWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksSyncLatch
  | Op10mTriggerRequireAgent25FullChunksSyncWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksSyncCommit
  | Op10mTriggerRequireAgent25FullChunksSyncWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksHandoffLatch
  | Op10mTriggerRequireAgent25FullChunksHandoffWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksHandoffCommit
  | Op10mTriggerRequireAgent25FullChunksHandoffWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksHandoffSyncLatch
  | Op10mTriggerRequireAgent25FullChunksHandoffSyncWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksHandoffSyncCommit
  | Op10mTriggerRequireAgent25FullChunksHandoffSyncWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureLatch
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureCommit
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureSyncLatch
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureSyncWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureSyncCommit
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureSyncWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureSealLatch
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureSealWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureSealCommit
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureSealWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureSealSyncLatch
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureSealSyncWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureSealSyncCommit
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureSealSyncWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeLatch
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeCommit
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSyncLatch
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSyncWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSyncCommit
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSyncWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSealLatch
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSealWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSealCommit
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSealWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatch
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSealSyncWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchCommit
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSealSyncWaveSealed
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReady
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSealSyncLatchWaveReady
  | Op10mTriggerRequireScaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommit
  | Op10mTriggerRequireAgent25FullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommit;

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
    nationalEscalationSteps: number;
    computeTurnPasses: number;
    deferredMutationsFired: number;
    pendingBacklogSurges: number;
    responsesArbitrated: number;
    pendingResponsesExpired: number;
    pendingQueueClears: number;
    pendingStabilizationWaves: number;
    postQueueCalmPasses: number;
    stabilizationClosureWaves: number;
    digestClosureLatches: number;
    integrationSyncGates: number;
    closureSealReadyPasses: number;
    assemblyHandoffWaves: number;
    syncManifestLatches: number;
    chunkAssemblySeals: number;
    handoffManifestCommits: number;
    moduleManifestAnchors: number;
    chunkInlineReadyPasses: number;
    inlineAssemblyLocks: number;
    agent25SlotReadyPasses: number;
    postCrisisSlotCommits: number;
    chunkManifestSealedPasses: number;
    scaleWaveBundleLatches: number;
    agent25AssemblyWaveReadyPasses: number;
    scaleWaveCatalogCommits: number;
    agent25BundleCatalogSealedPasses: number;
    scaleWaveOriginGates: number;
    agent25OriginWaveAttestedPasses: number;
    scaleWaveProjectionLatches: number;
    agent25ProjectionWaveReadyPasses: number;
    scaleWaveDryRunGates: number;
    agent25DryRunWaveAttestedPasses: number;
    scaleWaveGateClosureLatches: number;
    agent25GateClosureWaveReadyPasses: number;
    scaleWavePostClosureCommits: number;
    agent25PostClosureWaveSealedPasses: number;
    scaleWaveTrancheSyncLatches: number;
    agent25TrancheSyncWaveReadyPasses: number;
    scaleWaveTrancheReadyCommits: number;
    agent25TrancheReadyWaveSealedPasses: number;
    scaleWaveFullChunksLatches: number;
    agent25FullChunksWaveReadyPasses: number;
    scaleWaveFullChunksCommits: number;
    agent25FullChunksWaveSealedPasses: number;
    scaleWaveFullChunksSyncLatches: number;
    agent25FullChunksSyncWaveReadyPasses: number;
    scaleWaveFullChunksSyncCommits: number;
    agent25FullChunksSyncWaveSealedPasses: number;
    scaleWaveFullChunksHandoffLatches: number;
    agent25FullChunksHandoffWaveReadyPasses: number;
    scaleWaveFullChunksHandoffCommits: number;
    agent25FullChunksHandoffWaveSealedPasses: number;
    scaleWaveFullChunksHandoffSyncLatches: number;
    agent25FullChunksHandoffSyncWaveReadyPasses: number;
    scaleWaveFullChunksHandoffSyncCommits: number;
    agent25FullChunksHandoffSyncWaveSealedPasses: number;
    scaleWaveFullChunksHandoffClosureLatches: number;
    agent25FullChunksHandoffClosureWaveReadyPasses: number;
    scaleWaveFullChunksHandoffClosureCommits: number;
    agent25FullChunksHandoffClosureWaveSealedPasses: number;
    scaleWaveFullChunksHandoffClosureSyncLatches: number;
    agent25FullChunksHandoffClosureSyncWaveReadyPasses: number;
    scaleWaveFullChunksHandoffClosureSyncCommits: number;
    agent25FullChunksHandoffClosureSyncWaveSealedPasses: number;
    scaleWaveFullChunksHandoffClosureSealLatches: number;
    agent25FullChunksHandoffClosureSealWaveReadyPasses: number;
    scaleWaveFullChunksHandoffClosureSealCommits: number;
    agent25FullChunksHandoffClosureSealWaveSealedPasses: number;
    scaleWaveFullChunksHandoffClosureSealSyncLatches: number;
    agent25FullChunksHandoffClosureSealSyncWaveReadyPasses: number;
    scaleWaveFullChunksHandoffClosureSealSyncCommits: number;
    agent25FullChunksHandoffClosureSealSyncWaveSealedPasses: number;
    scaleWaveFullChunksHandoffClosureFinalizeLatches: number;
    agent25FullChunksHandoffClosureFinalizeWaveReadyPasses: number;
    scaleWaveFullChunksHandoffClosureFinalizeCommits: number;
    agent25FullChunksHandoffClosureFinalizeWaveSealedPasses: number;
    scaleWaveFullChunksHandoffClosureFinalizeSyncLatches: number;
    agent25FullChunksHandoffClosureFinalizeSyncWaveReadyPasses: number;
    scaleWaveFullChunksHandoffClosureFinalizeSyncCommits: number;
    agent25FullChunksHandoffClosureFinalizeSyncWaveSealedPasses: number;
    scaleWaveFullChunksHandoffClosureFinalizeSealLatches: number;
    agent25FullChunksHandoffClosureFinalizeSealWaveReadyPasses: number;
    scaleWaveFullChunksHandoffClosureFinalizeSealCommits: number;
    agent25FullChunksHandoffClosureFinalizeSealWaveSealedPasses: number;
    scaleWaveFullChunksHandoffClosureFinalizeSealSyncLatches: number;
    agent25FullChunksHandoffClosureFinalizeSealSyncWaveReadyPasses: number;
    scaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchCommits: number;
    agent25FullChunksHandoffClosureFinalizeSealSyncWaveSealedPasses: number;
    scaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyLatches: number;
    agent25FullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyPasses: number;
    scaleWaveFullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommits: number;
    agent25FullChunksHandoffClosureFinalizeSealSyncLatchWaveReadyCommitPasses: number;
  };
  regional?: Op10mRegionalContagionLedger;
  turnCompute?: Op10mTurnComputeLedger;
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
