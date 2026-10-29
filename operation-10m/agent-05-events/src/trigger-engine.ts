import type {
  Op10mActiveChainRuntime,
  Op10mChainDescriptor,
  Op10mChainStageTemplate,
  Op10mCooldownEntry,
  Op10mNarrativeEngineState,
  Op10mSimulationSlice,
  Op10mTriggerRequirement,
} from './types.ts';
import { getCrossSystemCouplingLevel, hasPeerChainAtPhase } from './cross-system-orchestrator.ts';
import { getNationalEscalationTier, countRegionsWithContagionAtLeast } from './national-escalation-orchestrator.ts';
import { hasArmedBypass } from './deep-chain-orchestrator.ts';
import { getContagionLevel } from './regional-graph.ts';
import { getDeferredQueueDepth, getTurnComputePassCount } from './deferred-queue.ts';
import { OP10M_COMPUTE_DRIFT_FLAG } from './compute-turn-reconcile.ts';
import { OP10M_COMPUTE_DRIFT_SETTLED_FLAG, OP10M_COMPUTE_TURN_GAP_ACK_FLAG } from './compute-turn-drift-settle.ts';
import { OP10M_TURN_COMPUTE_DIGEST_FLAG } from './types.ts';
import {
  OP10M_PENDING_ARBITRATION_FLAG,
  OP10M_PENDING_BACKLOG_FLAG,
  countPendingResponses,
} from './pending-response-orchestrator.ts';
import {
  OP10M_PENDING_EXPIRY_WAVE_FLAG,
  OP10M_PENDING_QUEUE_CLEARED_FLAG,
} from './pending-response-expiry-coordinator.ts';
import {
  OP10M_PENDING_STABILIZATION_WAVE_FLAG,
  OP10M_POST_QUEUE_CALM_FLAG,
} from './pending-response-stabilization-coordinator.ts';
import {
  OP10M_DIGEST_CLOSURE_LATCH_FLAG,
  OP10M_STABILIZATION_CLOSURE_WAVE_FLAG,
} from './pending-stabilization-closure-coordinator.ts';
import {
  OP10M_CLOSURE_SEAL_READY_FLAG,
  OP10M_INTEGRATION_SYNC_GATE_FLAG,
} from './compute-turn-integration-sync-coordinator.ts';
import {
  OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG,
  OP10M_SYNC_MANIFEST_LATCH_FLAG,
} from './compute-turn-assembly-handoff-coordinator.ts';
import {
  OP10M_CHUNK_ASSEMBLY_SEAL_FLAG,
  OP10M_HANDOFF_MANIFEST_COMMIT_FLAG,
} from './compute-turn-chunk-assembly-seal-coordinator.ts';
import {
  OP10M_CHUNK_INLINE_READY_FLAG,
  OP10M_MODULE_MANIFEST_ANCHOR_FLAG,
} from './compute-turn-module-manifest-anchor-coordinator.ts';
import {
  OP10M_AGENT25_SLOT_READY_FLAG,
  OP10M_INLINE_ASSEMBLY_LOCK_FLAG,
} from './compute-turn-inline-assembly-lock-coordinator.ts';
import {
  OP10M_CHUNK_MANIFEST_SEALED_FLAG,
  OP10M_POST_CRISIS_SLOT_COMMIT_FLAG,
} from './compute-turn-post-crisis-slot-commit-coordinator.ts';
import {
  OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG,
} from './compute-turn-scale-wave-bundle-latch-coordinator.ts';
import {
  OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG,
  OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG,
} from './compute-turn-scale-wave-catalog-commit-coordinator.ts';
import {
  OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG,
  OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG,
} from './compute-turn-scale-wave-origin-gate-coordinator.ts';
import {
  OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG,
} from './compute-turn-scale-wave-projection-latch-coordinator.ts';
import {
  OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG,
  OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG,
} from './compute-turn-scale-wave-dry-run-gate-coordinator.ts';
import {
  OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG,
} from './compute-turn-scale-wave-gate-closure-latch-coordinator.ts';
import {
  OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG,
} from './compute-turn-scale-wave-post-closure-commit-coordinator.ts';
import {
  OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG,
} from './compute-turn-scale-wave-tranche-sync-latch-coordinator.ts';
import {
  OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG,
} from './compute-turn-scale-wave-tranche-ready-commit-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG,
} from './compute-turn-scale-wave-full-chunks-latch-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG,
} from './compute-turn-scale-wave-full-chunks-commit-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_LATCH_FLAG,
} from './compute-turn-scale-wave-full-chunks-sync-latch-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_COMMIT_FLAG,
} from './compute-turn-scale-wave-full-chunks-sync-commit-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_LATCH_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-latch-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-commit-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-sync-latch-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_COMMIT_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-sync-commit-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_LATCH_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-latch-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-commit-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_LATCH_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-sync-latch-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_SEALED_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_COMMIT_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-sync-commit-coordinator.ts';
import {
  OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_READY_FLAG,
  OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_LATCH_FLAG,
} from './compute-turn-scale-wave-full-chunks-handoff-closure-seal-latch-coordinator.ts';

export function seasonForDay(day: number): Op10mSimulationSlice['season'] {
  const slot = Math.floor(((day - 1) % 360) / 90);
  return (['Spring', 'Summer', 'Autumn', 'Winter'] as const)[slot];
}

export function evaluateRequirements(
  requires: Op10mTriggerRequirement[],
  sim: Op10mSimulationSlice,
  chainRuntime: Op10mActiveChainRuntime | null,
  context?: {
    armedBypass?: boolean;
    chainId?: string;
    narrative?: Op10mNarrativeEngineState;
    catalog?: Op10mChainDescriptor[];
  }
): { ok: boolean; reason: string } {
  for (const req of requires) {
    switch (req.k) {
      case 'season':
        if (context?.armedBypass) break;
        if (!req.seasons.includes(sim.season)) {
          return { ok: false, reason: `season ${sim.season}` };
        }
        break;
      case 'sector': {
        const v = sim.sectorActivity[req.sector] ?? 0;
        if (v < req.min) return { ok: false, reason: `sector ${req.sector} ${v}<${req.min}` };
        break;
      }
      case 'stability':
        if (req.max !== undefined && sim.nationalStability > req.max) {
          return { ok: false, reason: `stability>${req.max}` };
        }
        if (req.min !== undefined && sim.nationalStability < req.min) {
          return { ok: false, reason: `stability<${req.min}` };
        }
        break;
      case 'money':
        if (req.max !== undefined && sim.money > req.max) {
          return { ok: false, reason: `money>${req.max}` };
        }
        if (req.min !== undefined && sim.money < req.min) {
          return { ok: false, reason: `money<${req.min}` };
        }
        break;
      case 'flag': {
        const val = sim.flags[req.key];
        if (req.equals !== undefined && val !== req.equals) {
          return { ok: false, reason: `flag ${req.key}` };
        }
        if (req.equals === undefined && !val) {
          return { ok: false, reason: `missing flag ${req.key}` };
        }
        break;
      }
      case 'no_flag':
        if (sim.flags[req.key]) return { ok: false, reason: `flag set ${req.key}` };
        break;
      case 'min_day':
        if (sim.day < req.day) return { ok: false, reason: `day<${req.day}` };
        break;
      case 'chain_phase':
        if (!chainRuntime || chainRuntime.phase !== req.phase) {
          return { ok: false, reason: `phase!=${req.phase}` };
        }
        break;
      case 'regional_contagion': {
        const level = getContagionLevel(sim, req.region, req.theme);
        if (level < req.min) return { ok: false, reason: `contagion ${level}<${req.min}` };
        break;
      }
      case 'armed_bypass': {
        const narrative = context?.narrative;
        if (!narrative || !hasArmedBypass(narrative, req.chainId)) {
          return { ok: false, reason: 'no armed bypass' };
        }
        break;
      }
      case 'min_active_crises':
        if (sim.activeCrisisCount < req.min) {
          return { ok: false, reason: `crises ${sim.activeCrisisCount}<${req.min}` };
        }
        break;
      case 'combined_sector':
        for (const s of req.sectors) {
          const v = sim.sectorActivity[s.sector] ?? 0;
          if (v < s.min) return { ok: false, reason: `sector ${s.sector} ${v}<${s.min}` };
        }
        break;
      case 'cross_system_coupling': {
        const level = getCrossSystemCouplingLevel(sim, req.region, req.synergyId);
        if (level < req.min) return { ok: false, reason: `xsys ${level}<${req.min}` };
        break;
      }
      case 'peer_chain_phase': {
        const narrative = context?.narrative;
        const catalog = context?.catalog;
        if (!narrative || !catalog) return { ok: false, reason: 'missing peer context' };
        if (!hasPeerChainAtPhase(narrative, catalog, req.region, req.theme, req.minPhase)) {
          return { ok: false, reason: 'peer chain phase' };
        }
        break;
      }
      case 'min_national_escalation': {
        const tier = getNationalEscalationTier(sim);
        if (tier < req.min) return { ok: false, reason: `national tier ${tier}<${req.min}` };
        break;
      }
      case 'min_resolved_chains': {
        const narrative = context?.narrative;
        if (!narrative) return { ok: false, reason: 'missing narrative' };
        if (narrative.resolvedChainIds.length < req.min) {
          return { ok: false, reason: `resolved ${narrative.resolvedChainIds.length}<${req.min}` };
        }
        break;
      }
      case 'multi_region_contagion': {
        const regions = countRegionsWithContagionAtLeast(sim, req.minPerRegion);
        if (regions < req.minRegions) {
          return { ok: false, reason: `regions ${regions}<${req.minRegions}` };
        }
        break;
      }
      case 'min_turn_compute_passes': {
        const narrative = context?.narrative;
        if (!narrative) return { ok: false, reason: 'missing narrative' };
        const passes = getTurnComputePassCount(narrative);
        if (passes < req.min) {
          return { ok: false, reason: `compute passes ${passes}<${req.min}` };
        }
        break;
      }
      case 'min_deferred_queue': {
        const narrative = context?.narrative;
        if (!narrative) return { ok: false, reason: 'missing narrative' };
        const depth = getDeferredQueueDepth(narrative);
        if (depth < req.min) {
          return { ok: false, reason: `deferred queue ${depth}<${req.min}` };
        }
        break;
      }
      case 'min_compute_turn': {
        const narrative = context?.narrative;
        if (!narrative) return { ok: false, reason: 'missing narrative' };
        const lastTurn = narrative.turnCompute?.lastTurn ?? 0;
        if (lastTurn < req.min) {
          return { ok: false, reason: `compute turn ${lastTurn}<${req.min}` };
        }
        break;
      }
      case 'turn_compute_digest_set': {
        const digest = sim.flags[OP10M_TURN_COMPUTE_DIGEST_FLAG];
        if (typeof digest !== 'string' || digest.length < 4) {
          return { ok: false, reason: 'digest unset' };
        }
        break;
      }
      case 'compute_turn_drift':
        if (!sim.flags[OP10M_COMPUTE_DRIFT_FLAG]) {
          return { ok: false, reason: 'no compute drift' };
        }
        break;
      case 'no_compute_turn_drift':
        if (sim.flags[OP10M_COMPUTE_DRIFT_FLAG]) {
          return { ok: false, reason: 'compute drift active' };
        }
        break;
      case 'compute_drift_settled':
        if (!sim.flags[OP10M_COMPUTE_DRIFT_SETTLED_FLAG]) {
          return { ok: false, reason: 'drift not settled' };
        }
        break;
      case 'compute_turn_gap_ack':
        if (!sim.flags[OP10M_COMPUTE_TURN_GAP_ACK_FLAG]) {
          return { ok: false, reason: 'turn gap not acked' };
        }
        break;
      case 'min_pending_responses': {
        const narrative = context?.narrative;
        if (!narrative) return { ok: false, reason: 'missing narrative' };
        const count = countPendingResponses(narrative);
        if (count < req.min) {
          return { ok: false, reason: `pending ${count}<${req.min}` };
        }
        break;
      }
      case 'pending_backlog':
        if (!sim.flags[OP10M_PENDING_BACKLOG_FLAG]) {
          return { ok: false, reason: 'no pending backlog' };
        }
        break;
      case 'pending_arbitration':
        if (!sim.flags[OP10M_PENDING_ARBITRATION_FLAG]) {
          return { ok: false, reason: 'no pending arbitration' };
        }
        break;
      case 'pending_expiry_wave':
        if (!sim.flags[OP10M_PENDING_EXPIRY_WAVE_FLAG]) {
          return { ok: false, reason: 'no pending expiry wave' };
        }
        break;
      case 'pending_queue_clear':
        if (!sim.flags[OP10M_PENDING_QUEUE_CLEARED_FLAG]) {
          return { ok: false, reason: 'pending queue not cleared' };
        }
        break;
      case 'no_pending_backlog':
        if (sim.flags[OP10M_PENDING_BACKLOG_FLAG]) {
          return { ok: false, reason: 'pending backlog active' };
        }
        break;
      case 'pending_stabilization_wave':
        if (!sim.flags[OP10M_PENDING_STABILIZATION_WAVE_FLAG]) {
          return { ok: false, reason: 'no pending stabilization wave' };
        }
        break;
      case 'post_queue_calm':
        if (!sim.flags[OP10M_POST_QUEUE_CALM_FLAG]) {
          return { ok: false, reason: 'post queue not calm' };
        }
        break;
      case 'stabilization_closure_wave':
        if (!sim.flags[OP10M_STABILIZATION_CLOSURE_WAVE_FLAG]) {
          return { ok: false, reason: 'no stabilization closure wave' };
        }
        break;
      case 'digest_closure_latch':
        if (!sim.flags[OP10M_DIGEST_CLOSURE_LATCH_FLAG]) {
          return { ok: false, reason: 'digest closure not latched' };
        }
        break;
      case 'integration_sync_gate':
        if (!sim.flags[OP10M_INTEGRATION_SYNC_GATE_FLAG]) {
          return { ok: false, reason: 'integration sync gate closed' };
        }
        break;
      case 'closure_seal_ready':
        if (!sim.flags[OP10M_CLOSURE_SEAL_READY_FLAG]) {
          return { ok: false, reason: 'closure seal not ready' };
        }
        break;
      case 'assembly_handoff_wave':
        if (!sim.flags[OP10M_ASSEMBLY_HANDOFF_WAVE_FLAG]) {
          return { ok: false, reason: 'no assembly handoff wave' };
        }
        break;
      case 'sync_manifest_latch':
        if (!sim.flags[OP10M_SYNC_MANIFEST_LATCH_FLAG]) {
          return { ok: false, reason: 'sync manifest not latched' };
        }
        break;
      case 'chunk_assembly_seal':
        if (!sim.flags[OP10M_CHUNK_ASSEMBLY_SEAL_FLAG]) {
          return { ok: false, reason: 'chunk assembly not sealed' };
        }
        break;
      case 'handoff_manifest_commit':
        if (!sim.flags[OP10M_HANDOFF_MANIFEST_COMMIT_FLAG]) {
          return { ok: false, reason: 'handoff manifest not committed' };
        }
        break;
      case 'module_manifest_anchor':
        if (!sim.flags[OP10M_MODULE_MANIFEST_ANCHOR_FLAG]) {
          return { ok: false, reason: 'module manifest not anchored' };
        }
        break;
      case 'chunk_inline_ready':
        if (!sim.flags[OP10M_CHUNK_INLINE_READY_FLAG]) {
          return { ok: false, reason: 'chunk inline not ready' };
        }
        break;
      case 'inline_assembly_lock':
        if (!sim.flags[OP10M_INLINE_ASSEMBLY_LOCK_FLAG]) {
          return { ok: false, reason: 'inline assembly not locked' };
        }
        break;
      case 'agent25_slot_ready':
        if (!sim.flags[OP10M_AGENT25_SLOT_READY_FLAG]) {
          return { ok: false, reason: 'agent25 slot not ready' };
        }
        break;
      case 'post_crisis_slot_commit':
        if (!sim.flags[OP10M_POST_CRISIS_SLOT_COMMIT_FLAG]) {
          return { ok: false, reason: 'post-crisis slot not committed' };
        }
        break;
      case 'chunk_manifest_sealed':
        if (!sim.flags[OP10M_CHUNK_MANIFEST_SEALED_FLAG]) {
          return { ok: false, reason: 'chunk manifest not sealed' };
        }
        break;
      case 'scale_wave_bundle_latch':
        if (!sim.flags[OP10M_SCALE_WAVE_BUNDLE_LATCH_FLAG]) {
          return { ok: false, reason: 'scale wave bundle not latched' };
        }
        break;
      case 'agent25_assembly_wave_ready':
        if (!sim.flags[OP10M_AGENT25_ASSEMBLY_WAVE_READY_FLAG]) {
          return { ok: false, reason: 'agent25 assembly wave not ready' };
        }
        break;
      case 'scale_wave_catalog_commit':
        if (!sim.flags[OP10M_SCALE_WAVE_CATALOG_COMMIT_FLAG]) {
          return { ok: false, reason: 'scale wave catalog not committed' };
        }
        break;
      case 'agent25_bundle_catalog_sealed':
        if (!sim.flags[OP10M_AGENT25_BUNDLE_CATALOG_SEALED_FLAG]) {
          return { ok: false, reason: 'agent25 bundle catalog not sealed' };
        }
        break;
      case 'scale_wave_origin_gate':
        if (!sim.flags[OP10M_SCALE_WAVE_ORIGIN_GATE_FLAG]) {
          return { ok: false, reason: 'scale wave origin gate not set' };
        }
        break;
      case 'agent25_origin_wave_attested':
        if (!sim.flags[OP10M_AGENT25_ORIGIN_WAVE_ATTESTED_FLAG]) {
          return { ok: false, reason: 'agent25 origin wave not attested' };
        }
        break;
      case 'scale_wave_projection_latch':
        if (!sim.flags[OP10M_SCALE_WAVE_PROJECTION_LATCH_FLAG]) {
          return { ok: false, reason: 'scale wave projection not latched' };
        }
        break;
      case 'agent25_projection_wave_ready':
        if (!sim.flags[OP10M_AGENT25_PROJECTION_WAVE_READY_FLAG]) {
          return { ok: false, reason: 'agent25 projection wave not ready' };
        }
        break;
      case 'scale_wave_dry_run_gate':
        if (!sim.flags[OP10M_SCALE_WAVE_DRY_RUN_GATE_FLAG]) {
          return { ok: false, reason: 'scale wave dry-run gate not set' };
        }
        break;
      case 'agent25_dry_run_wave_attested':
        if (!sim.flags[OP10M_AGENT25_DRY_RUN_WAVE_ATTESTED_FLAG]) {
          return { ok: false, reason: 'agent25 dry-run wave not attested' };
        }
        break;
      case 'scale_wave_gate_closure_latch':
        if (!sim.flags[OP10M_SCALE_WAVE_GATE_CLOSURE_LATCH_FLAG]) {
          return { ok: false, reason: 'scale wave gate closure not latched' };
        }
        break;
      case 'agent25_gate_closure_wave_ready':
        if (!sim.flags[OP10M_AGENT25_GATE_CLOSURE_WAVE_READY_FLAG]) {
          return { ok: false, reason: 'agent25 gate closure wave not ready' };
        }
        break;
      case 'scale_wave_post_closure_commit':
        if (!sim.flags[OP10M_SCALE_WAVE_POST_CLOSURE_COMMIT_FLAG]) {
          return { ok: false, reason: 'scale wave post-closure not committed' };
        }
        break;
      case 'agent25_post_closure_wave_sealed':
        if (!sim.flags[OP10M_AGENT25_POST_CLOSURE_WAVE_SEALED_FLAG]) {
          return { ok: false, reason: 'agent25 post-closure wave not sealed' };
        }
        break;
      case 'scale_wave_tranche_sync_latch':
        if (!sim.flags[OP10M_SCALE_WAVE_TRANCHE_SYNC_LATCH_FLAG]) {
          return { ok: false, reason: 'scale wave tranche sync not latched' };
        }
        break;
      case 'agent25_tranche_sync_wave_ready':
        if (!sim.flags[OP10M_AGENT25_TRANCHE_SYNC_WAVE_READY_FLAG]) {
          return { ok: false, reason: 'agent25 tranche sync wave not ready' };
        }
        break;
      case 'scale_wave_tranche_ready_commit':
        if (!sim.flags[OP10M_SCALE_WAVE_TRANCHE_READY_COMMIT_FLAG]) {
          return { ok: false, reason: 'scale wave tranche ready not committed' };
        }
        break;
      case 'agent25_tranche_ready_wave_sealed':
        if (!sim.flags[OP10M_AGENT25_TRANCHE_READY_WAVE_SEALED_FLAG]) {
          return { ok: false, reason: 'agent25 tranche ready wave not sealed' };
        }
        break;
      case 'scale_wave_full_chunks_latch':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_LATCH_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks not latched' };
        }
        break;
      case 'agent25_full_chunks_wave_ready':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_READY_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks wave not ready' };
        }
        break;
      case 'scale_wave_full_chunks_commit':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_COMMIT_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks not committed' };
        }
        break;
      case 'agent25_full_chunks_wave_sealed':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_WAVE_SEALED_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks wave not sealed' };
        }
        break;
      case 'scale_wave_full_chunks_sync_latch':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_LATCH_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks sync not latched' };
        }
        break;
      case 'agent25_full_chunks_sync_wave_ready':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_READY_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks sync wave not ready' };
        }
        break;
      case 'scale_wave_full_chunks_sync_commit':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_SYNC_COMMIT_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks sync not committed' };
        }
        break;
      case 'agent25_full_chunks_sync_wave_sealed':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_SYNC_WAVE_SEALED_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks sync wave not sealed' };
        }
        break;
      case 'scale_wave_full_chunks_handoff_latch':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_LATCH_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks handoff not latched' };
        }
        break;
      case 'agent25_full_chunks_handoff_wave_ready':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_READY_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks handoff wave not ready' };
        }
        break;
      case 'scale_wave_full_chunks_handoff_commit':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_COMMIT_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks handoff not committed' };
        }
        break;
      case 'agent25_full_chunks_handoff_wave_sealed':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_WAVE_SEALED_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks handoff wave not sealed' };
        }
        break;
      case 'scale_wave_full_chunks_handoff_sync_latch':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_LATCH_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks handoff sync not latched' };
        }
        break;
      case 'agent25_full_chunks_handoff_sync_wave_ready':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_READY_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks handoff sync wave not ready' };
        }
        break;
      case 'scale_wave_full_chunks_handoff_sync_commit':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_SYNC_COMMIT_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks handoff sync not committed' };
        }
        break;
      case 'agent25_full_chunks_handoff_sync_wave_sealed':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_SYNC_WAVE_SEALED_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks handoff sync wave not sealed' };
        }
        break;
      case 'scale_wave_full_chunks_handoff_closure_latch':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_LATCH_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks handoff closure not latched' };
        }
        break;
      case 'agent25_full_chunks_handoff_closure_wave_ready':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_READY_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks handoff closure wave not ready' };
        }
        break;
      case 'scale_wave_full_chunks_handoff_closure_commit':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_COMMIT_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks handoff closure not committed' };
        }
        break;
      case 'agent25_full_chunks_handoff_closure_wave_sealed':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_WAVE_SEALED_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks handoff closure wave not sealed' };
        }
        break;
      case 'scale_wave_full_chunks_handoff_closure_sync_latch':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_LATCH_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks handoff closure sync not latched' };
        }
        break;
      case 'agent25_full_chunks_handoff_closure_sync_wave_ready':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_READY_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks handoff closure sync wave not ready' };
        }
        break;
      case 'scale_wave_full_chunks_handoff_closure_sync_commit':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_COMMIT_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks handoff closure sync not committed' };
        }
        break;
      case 'agent25_full_chunks_handoff_closure_sync_wave_sealed':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SYNC_WAVE_SEALED_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks handoff closure sync wave not sealed' };
        }
        break;
      case 'scale_wave_full_chunks_handoff_closure_seal_latch':
        if (!sim.flags[OP10M_SCALE_WAVE_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_LATCH_FLAG]) {
          return { ok: false, reason: 'scale wave full-chunks handoff closure seal not latched' };
        }
        break;
      case 'agent25_full_chunks_handoff_closure_seal_wave_ready':
        if (!sim.flags[OP10M_AGENT25_FULL_CHUNKS_HANDOFF_CLOSURE_SEAL_WAVE_READY_FLAG]) {
          return { ok: false, reason: 'agent25 full-chunks handoff closure seal wave not ready' };
        }
        break;
      default:
        break;
    }
  }
  return { ok: true, reason: 'ok' };
}

export function findStageForPhase(
  descriptor: Op10mChainDescriptor,
  phase: Op10mChainStageTemplate['phase']
): Op10mChainStageTemplate | undefined {
  return descriptor.phases.find((p) => p.phase === phase);
}

export function isCooldownReady(
  cooldowns: Op10mCooldownEntry[],
  key: string,
  day: number
): boolean {
  const entry = cooldowns.find((c) => c.key === key);
  if (!entry) return true;
  return day - entry.lastFiredDay >= entry.cooldownTurns;
}

export function recordCooldown(
  narrative: Op10mNarrativeEngineState,
  key: string,
  day: number,
  cooldownTurns: number
): Op10mCooldownEntry[] {
  const without = narrative.cooldowns.filter((c) => c.key !== key);
  return [...without, { key, lastFiredDay: day, cooldownTurns }];
}

export function nextPhase(current: Op10mChainStageTemplate['phase']): Op10mChainStageTemplate['phase'] | null {
  const order: Op10mChainStageTemplate['phase'][] = ['signal', 'pressure', 'rupture', 'recovery'];
  const idx = order.indexOf(current);
  if (idx < 0 || idx >= order.length - 1) return null;
  return order[idx + 1];
}
