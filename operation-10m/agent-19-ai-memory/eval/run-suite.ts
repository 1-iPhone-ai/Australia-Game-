import { buildAiMemoryHorizonSnapshot, createEmptyAiActorMemory } from '../horizon.ts';
import {
  auditFindingsOk,
  auditMemoryInfluenceDecisions,
  AGENT19_MAX_SINGLE_DECISION_INFLUENCE,
} from '../influence-audit.ts';
import {
  buildMemoryExplainabilityBrief,
  formatHorizonBadge,
  rankInfluenceSlicesByMagnitude,
  summarizeSlicesByHorizon,
} from '../explainability.ts';
import { computeNegotiationThresholdShift, formatNegotiationExplainability } from '../negotiation-explainability.ts';
import {
  buildInspectionExplainabilityNarrative,
  getFilteredAiMemoryInspectionView,
} from '../inspection-explainability.ts';
import { auditActorMemoryBounds, memoryBoundsOk, AGENT19_AI_MEMORY_EVENT_CAP } from '../memory-bounds-audit.ts';
import {
  buildAgent19DecisionTraceReport,
  compareHorizonSnapshots,
  labelMemoryHorizon,
} from '../decision-trace.ts';
import { buildPersistentPriorExplainabilityBrief, listPersistentPriorBeliefs } from '../prior-explainability.ts';
import { explainAdaptivePlan } from '../adaptive-plan-explainability.ts';
import { computeMemoryHealthScorecard, formatMemoryHealthBrief } from '../memory-health-scorecard.ts';
import { summarizeTurnMemoryInfluence } from '../turn-influence-summary.ts';
import { buildMemoryGiClaims, formatGiClaimsAsBrief } from '../explainability-claims.ts';
import {
  buildMemoryEventTimeline,
  summarizeMemoryEventTimeline,
  AGENT19_TIMELINE_DISPLAY_CAP,
} from '../memory-event-timeline.ts';
import {
  buildRelationshipExplainabilityBrief,
  listTrackedRelationshipActorIds,
} from '../relationship-explainability.ts';
import { auditMemoryRetentionOrdering, retentionAuditOk } from '../memory-retention-audit.ts';
import { buildTurnExplainabilityPack } from '../turn-explainability-pack.ts';
import {
  buildCounterfactualMemoryReport,
  baselineScoresWithoutMemory,
} from '../counterfactual-explainability.ts';
import {
  auditMemoryStaleness,
  summarizeMemoryStaleness,
  AGENT19_RELATIONSHIP_STALE_TURN_GAP,
} from '../memory-staleness-audit.ts';
import { buildSessionExplainabilityRollup } from '../session-explainability-rollup.ts';
import {
  buildExplainabilityDebugExport,
  explainabilityDebugExportWithinCap,
  AGENT19_DEBUG_EXPORT_NARRATIVE_CAP,
} from '../explainability-debug-export.ts';
import { auditExplainabilityIntegrity } from '../memory-explainability-integrity.ts';
import {
  buildOpponentModelExplainabilityBrief,
  listOpponentBeliefExplainLines,
} from '../opponent-model-explainability.ts';
import {
  auditInfluenceDriftBetweenTurns,
  AGENT19_INFLUENCE_DRIFT_SPIKE_THRESHOLD,
} from '../influence-drift-audit.ts';
import { auditPriorEventTension } from '../prior-event-tension-audit.ts';
import { buildMatchExplainabilityDigest, AGENT19_MATCH_DIGEST_LINE_CAP } from '../match-explainability-digest.ts';
import { buildTurnPackGiClaims } from '../turn-pack-gi-bridge.ts';
import { auditTurnSliceAttribution, turnSliceAttributionOk } from '../slice-attribution-audit.ts';
import {
  auditGiRedactionConsistency,
  auditTurnPackGiRedaction,
  giRedactionConsistencyOk,
} from '../gi-redaction-consistency-audit.ts';
import { buildMultiTurnDriftRollup } from '../multi-turn-drift-rollup.ts';
import { buildIntegrityRecoveryHints, AGENT19_RECOVERY_HINT_CAP } from '../integrity-recovery-hints.ts';
import {
  adaptivePlanInfluenceAligned,
  buildAdaptivePlanInfluenceBridge,
  AGENT19_DIRECTIVE_BRIDGE_MAG_THRESHOLD,
} from '../adaptive-plan-influence-bridge.ts';
import { auditTurnPackComposite, turnPackCompositeOk } from '../turn-pack-composite-audit.ts';
import {
  buildSessionGiClaimsRollup,
  sessionGiRollupWithinCap,
  AGENT19_SESSION_GI_CLAIM_CAP,
} from '../session-gi-claims-rollup.ts';
import {
  buildNegotiationInfluenceBridge,
  negotiationInfluenceAligned,
} from '../negotiation-influence-bridge.ts';
import {
  auditDecisionTraceContinuity,
  decisionTraceContinuityOk,
} from '../decision-trace-continuity-audit.ts';
import {
  computeExplainabilityConfidence,
  explainabilityConfidenceAtLeast,
} from '../explainability-confidence-band.ts';
import {
  buildCompositeRecoveryHints,
  compositeRecoveryNeeded,
  AGENT19_COMPOSITE_RECOVERY_HINT_CAP,
} from '../composite-recovery-bridge.ts';
import {
  buildSessionConfidenceRollup,
  sessionConfidenceAtLeast,
} from '../session-confidence-rollup.ts';
import {
  auditHorizonSliceAlignment,
  horizonSliceAlignmentOk,
} from '../horizon-slice-alignment-audit.ts';
import {
  auditMatchExplainabilityGate,
  matchExplainabilityGateOpen,
} from '../match-explainability-gate.ts';
import { auditTraceCompositeBridge, traceCompositeBridgeOk } from '../trace-composite-bridge.ts';
import {
  buildMatchGateRecoveryHints,
  matchGateRecoveryNeeded,
  AGENT19_MATCH_RECOVERY_HINT_CAP,
} from '../match-gate-recovery-bridge.ts';
import {
  auditSessionTraceContinuityGate,
  sessionTraceContinuityGateOpen,
} from '../session-trace-continuity-gate.ts';
import {
  auditSessionHorizonAlignment,
  sessionHorizonAlignmentOk,
} from '../session-horizon-alignment-audit.ts';
import {
  auditExplainabilityExportGate,
  explainabilityExportAllowed,
} from '../explainability-export-gate.ts';
import {
  buildSessionTraceCompositeRollup,
  sessionTraceCompositeAllPassed,
} from '../session-trace-composite-rollup.ts';
import {
  auditMatchExplainabilityFinalGate,
  matchExplainabilityFinalGateOpen,
} from '../match-explainability-final-gate.ts';
import {
  buildSessionExportBundle,
  sessionExportBundleWithinCap,
  AGENT19_SESSION_EXPORT_TURN_CAP,
} from '../session-export-bundle.ts';
import {
  buildNegotiationSessionRollup,
  negotiationSessionMostlyAligned,
} from '../negotiation-session-rollup.ts';
import {
  auditConfidenceExportBridge,
  confidenceExportBridgeAllowed,
} from '../confidence-export-bridge.ts';
import {
  buildMatchRecoveryPlaybook,
  matchRecoveryPlaybookWithinCap,
  AGENT19_RECOVERY_PLAYBOOK_CAP,
} from '../match-recovery-playbook.ts';
import {
  buildMatchExplainabilityDeliveryBundle,
  matchExplainabilityDeliveryShippable,
  AGENT19_DELIVERY_NARRATIVE_CAP,
} from '../match-explainability-delivery-bundle.ts';
import { buildSessionGiDeliveryBundle, sessionGiDeliveryReady } from '../session-gi-delivery-bundle.ts';
import {
  buildFinalGateRecoveryHints,
  finalGateRecoveryNeeded,
  AGENT19_FINAL_RECOVERY_HINT_CAP,
} from '../final-gate-recovery-bridge.ts';
import {
  auditNegotiationExportBridge,
  negotiationExportNotesIncluded,
} from '../negotiation-export-bridge.ts';
import {
  auditMatchExplainabilityShipmentGate,
  matchExplainabilityShipmentAllowed,
} from '../match-explainability-shipment-gate.ts';
import {
  buildMatchExplainabilityReleaseBundle,
  matchExplainabilityReleaseReady,
} from '../match-explainability-release-bundle.ts';
import {
  buildShipmentRecoveryPlaybookBridge,
  shipmentRecoveryNeeded,
  AGENT19_SHIPMENT_RECOVERY_CAP,
} from '../shipment-recovery-playbook-bridge.ts';
import { auditDeliveryShipmentBridge, deliveryShipmentBridgeAligned } from '../delivery-shipment-bridge.ts';
import {
  buildSessionReleaseExportBundle,
  sessionReleaseExportEmitted,
} from '../session-release-export-bundle.ts';
import {
  auditMatchExplainabilityLaunchGate,
  matchExplainabilityLaunchAllowed,
} from '../match-explainability-launch-gate.ts';
import {
  buildMatchExplainabilityOperationsBundle,
  matchExplainabilityOperationsReady,
} from '../match-explainability-operations-bundle.ts';
import {
  buildLaunchRecoveryOrchestrator,
  launchRecoveryOrchestratorWithinCap,
  AGENT19_LAUNCH_RECOVERY_ORCHESTRATOR_CAP,
} from '../launch-recovery-orchestrator.ts';
import {
  buildSessionOperationsExportBundle,
  sessionOperationsExportReady,
} from '../session-operations-export-bundle.ts';
import { auditReleaseLaunchBridge, releaseLaunchBridgeAligned } from '../release-launch-bridge.ts';
import {
  auditMatchExplainabilityProductionGate,
  matchExplainabilityProductionAllowed,
} from '../match-explainability-production-gate.ts';
import {
  buildMatchExplainabilityDeploymentBundle,
  matchExplainabilityDeploymentReady,
} from '../match-explainability-deployment-bundle.ts';
import {
  buildProductionRecoveryOrchestrator,
  productionRecoveryOrchestratorWithinCap,
  AGENT19_PRODUCTION_RECOVERY_CAP,
} from '../production-recovery-orchestrator.ts';
import {
  buildSessionDeploymentExportBundle,
  sessionDeploymentExportShipped,
} from '../session-deployment-export-bundle.ts';
import {
  auditOperationsProductionBridge,
  operationsProductionBridgeHealthy,
} from '../operations-production-bridge.ts';
import {
  auditMatchExplainabilityFleetGate,
  matchExplainabilityFleetAllowed,
} from '../match-explainability-fleet-gate.ts';
import {
  buildMatchExplainabilitySustainmentBundle,
  matchExplainabilitySustainmentReady,
} from '../match-explainability-sustainment-bundle.ts';
import {
  buildSessionSustainmentExportBundle,
  sessionSustainmentExportShipped,
} from '../session-sustainment-export-bundle.ts';
import {
  auditFleetSustainmentBridge,
  fleetSustainmentBridgeHealthy,
} from '../fleet-sustainment-bridge.ts';
import {
  buildFleetRecoveryOrchestrator,
  fleetRecoveryOrchestratorWithinCap,
} from '../fleet-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityOrbitGate,
  matchExplainabilityOrbitAllowed,
} from '../match-explainability-orbit-gate.ts';
import {
  buildMatchExplainabilityTransitBundle,
  matchExplainabilityTransitReady,
} from '../match-explainability-transit-bundle.ts';
import {
  buildSessionTransitExportBundle,
  sessionTransitExportShipped,
} from '../session-transit-export-bundle.ts';
import { auditOrbitTransitBridge, orbitTransitBridgeHealthy } from '../orbit-transit-bridge.ts';
import {
  buildOrbitRecoveryOrchestrator,
  orbitRecoveryOrchestratorWithinCap,
} from '../orbit-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityRelayGate,
  matchExplainabilityRelayAllowed,
} from '../match-explainability-relay-gate.ts';
import {
  buildMatchExplainabilityRelayBundle,
  matchExplainabilityRelayReady,
} from '../match-explainability-relay-bundle.ts';
import {
  buildSessionRelayExportBundle,
  sessionRelayExportShipped,
} from '../session-relay-export-bundle.ts';
import { auditRelayTransitBridge, relayTransitBridgeHealthy } from '../relay-transit-bridge.ts';
import {
  buildRelayRecoveryOrchestrator,
  relayRecoveryOrchestratorWithinCap,
} from '../relay-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityBeaconGate,
  matchExplainabilityBeaconAllowed,
} from '../match-explainability-beacon-gate.ts';
import {
  buildMatchExplainabilityBeaconBundle,
  matchExplainabilityBeaconReady,
} from '../match-explainability-beacon-bundle.ts';
import {
  buildSessionBeaconExportBundle,
  sessionBeaconExportShipped,
} from '../session-beacon-export-bundle.ts';
import { auditRelayBeaconBridge, relayBeaconBridgeHealthy } from '../relay-beacon-bridge.ts';
import {
  buildBeaconRecoveryOrchestrator,
  beaconRecoveryOrchestratorWithinCap,
} from '../beacon-recovery-orchestrator.ts';
import {
  auditMatchExplainabilitySignalGate,
  matchExplainabilitySignalAllowed,
} from '../match-explainability-signal-gate.ts';
import {
  buildMatchExplainabilitySignalBundle,
  matchExplainabilitySignalReady,
} from '../match-explainability-signal-bundle.ts';
import {
  buildSessionSignalExportBundle,
  sessionSignalExportShipped,
} from '../session-signal-export-bundle.ts';
import { auditBeaconSignalBridge, beaconSignalBridgeHealthy } from '../beacon-signal-bridge.ts';
import {
  buildSignalRecoveryOrchestrator,
  signalRecoveryOrchestratorWithinCap,
} from '../signal-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityUplinkGate,
  matchExplainabilityUplinkAllowed,
} from '../match-explainability-uplink-gate.ts';
import {
  buildMatchExplainabilityUplinkBundle,
  matchExplainabilityUplinkReady,
} from '../match-explainability-uplink-bundle.ts';
import {
  buildSessionUplinkExportBundle,
  sessionUplinkExportShipped,
} from '../session-uplink-export-bundle.ts';
import { auditSignalUplinkBridge, signalUplinkBridgeHealthy } from '../signal-uplink-bridge.ts';
import {
  buildUplinkRecoveryOrchestrator,
  uplinkRecoveryOrchestratorWithinCap,
} from '../uplink-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityHandshakeGate,
  matchExplainabilityHandshakeAllowed,
} from '../match-explainability-handshake-gate.ts';
import {
  buildMatchExplainabilityHandshakeBundle,
  matchExplainabilityHandshakeReady,
} from '../match-explainability-handshake-bundle.ts';
import {
  buildSessionHandshakeExportBundle,
  sessionHandshakeExportShipped,
} from '../session-handshake-export-bundle.ts';
import { auditUplinkHandshakeBridge, uplinkHandshakeBridgeHealthy } from '../uplink-handshake-bridge.ts';
import {
  buildHandshakeRecoveryOrchestrator,
  handshakeRecoveryOrchestratorWithinCap,
} from '../handshake-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityAckGate,
  matchExplainabilityAckAllowed,
} from '../match-explainability-ack-gate.ts';
import {
  buildMatchExplainabilityAckBundle,
  matchExplainabilityAckReady,
} from '../match-explainability-ack-bundle.ts';
import {
  buildSessionAckExportBundle,
  sessionAckExportShipped,
} from '../session-ack-export-bundle.ts';
import { auditHandshakeAckBridge, handshakeAckBridgeHealthy } from '../handshake-ack-bridge.ts';
import {
  buildAckRecoveryOrchestrator,
  ackRecoveryOrchestratorWithinCap,
} from '../ack-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityConfirmGate,
  matchExplainabilityConfirmAllowed,
} from '../match-explainability-confirm-gate.ts';
import {
  buildMatchExplainabilityConfirmBundle,
  matchExplainabilityConfirmReady,
} from '../match-explainability-confirm-bundle.ts';
import {
  buildSessionConfirmExportBundle,
  sessionConfirmExportShipped,
} from '../session-confirm-export-bundle.ts';
import { auditAckConfirmBridge, ackConfirmBridgeHealthy } from '../ack-confirm-bridge.ts';
import {
  buildConfirmRecoveryOrchestrator,
  confirmRecoveryOrchestratorWithinCap,
} from '../confirm-recovery-orchestrator.ts';
import {
  auditMatchExplainabilitySealGate,
  matchExplainabilitySealAllowed,
} from '../match-explainability-seal-gate.ts';
import {
  buildMatchExplainabilitySealBundle,
  matchExplainabilitySealReady,
} from '../match-explainability-seal-bundle.ts';
import {
  buildSessionSealExportBundle,
  sessionSealExportShipped,
} from '../session-seal-export-bundle.ts';
import { auditConfirmSealBridge, confirmSealBridgeHealthy } from '../confirm-seal-bridge.ts';
import {
  buildSealRecoveryOrchestrator,
  sealRecoveryOrchestratorWithinCap,
} from '../seal-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityCovenantGate,
  matchExplainabilityCovenantAllowed,
} from '../match-explainability-covenant-gate.ts';
import {
  buildMatchExplainabilityCovenantBundle,
  matchExplainabilityCovenantReady,
} from '../match-explainability-covenant-bundle.ts';
import {
  buildSessionCovenantExportBundle,
  sessionCovenantExportShipped,
} from '../session-covenant-export-bundle.ts';
import { auditSealCovenantBridge, sealCovenantBridgeHealthy } from '../seal-covenant-bridge.ts';
import {
  buildCovenantRecoveryOrchestrator,
  covenantRecoveryOrchestratorWithinCap,
} from '../covenant-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityCharterGate,
  matchExplainabilityCharterAllowed,
} from '../match-explainability-charter-gate.ts';
import {
  buildMatchExplainabilityCharterBundle,
  matchExplainabilityCharterReady,
} from '../match-explainability-charter-bundle.ts';
import {
  buildSessionCharterExportBundle,
  sessionCharterExportShipped,
} from '../session-charter-export-bundle.ts';
import { auditCovenantCharterBridge, covenantCharterBridgeHealthy } from '../covenant-charter-bridge.ts';
import {
  buildCharterRecoveryOrchestrator,
  charterRecoveryOrchestratorWithinCap,
} from '../charter-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityPactGate,
  matchExplainabilityPactAllowed,
} from '../match-explainability-pact-gate.ts';
import {
  buildMatchExplainabilityPactBundle,
  matchExplainabilityPactReady,
} from '../match-explainability-pact-bundle.ts';
import {
  buildSessionPactExportBundle,
  sessionPactExportShipped,
} from '../session-pact-export-bundle.ts';
import { auditCharterPactBridge, charterPactBridgeHealthy } from '../charter-pact-bridge.ts';
import {
  buildPactRecoveryOrchestrator,
  pactRecoveryOrchestratorWithinCap,
} from '../pact-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityTreatyGate,
  matchExplainabilityTreatyAllowed,
} from '../match-explainability-treaty-gate.ts';
import {
  buildMatchExplainabilityTreatyBundle,
  matchExplainabilityTreatyReady,
} from '../match-explainability-treaty-bundle.ts';
import {
  buildSessionTreatyExportBundle,
  sessionTreatyExportShipped,
} from '../session-treaty-export-bundle.ts';
import { auditPactTreatyBridge, pactTreatyBridgeHealthy } from '../pact-treaty-bridge.ts';
import {
  buildTreatyRecoveryOrchestrator,
  treatyRecoveryOrchestratorWithinCap,
} from '../treaty-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityAccordGate,
  matchExplainabilityAccordAllowed,
} from '../match-explainability-accord-gate.ts';
import {
  buildMatchExplainabilityAccordBundle,
  matchExplainabilityAccordReady,
} from '../match-explainability-accord-bundle.ts';
import {
  buildSessionAccordExportBundle,
  sessionAccordExportShipped,
} from '../session-accord-export-bundle.ts';
import { auditTreatyAccordBridge, treatyAccordBridgeHealthy } from '../treaty-accord-bridge.ts';
import {
  buildAccordRecoveryOrchestrator,
  accordRecoveryOrchestratorWithinCap,
} from '../accord-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityLeagueGate,
  matchExplainabilityLeagueAllowed,
} from '../match-explainability-league-gate.ts';
import {
  buildMatchExplainabilityLeagueBundle,
  matchExplainabilityLeagueReady,
} from '../match-explainability-league-bundle.ts';
import {
  buildSessionLeagueExportBundle,
  sessionLeagueExportShipped,
} from '../session-league-export-bundle.ts';
import { auditAccordLeagueBridge, accordLeagueBridgeHealthy } from '../accord-league-bridge.ts';
import {
  buildLeagueRecoveryOrchestrator,
  leagueRecoveryOrchestratorWithinCap,
} from '../league-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityFederationGate,
  matchExplainabilityFederationAllowed,
} from '../match-explainability-federation-gate.ts';
import {
  buildMatchExplainabilityFederationBundle,
  matchExplainabilityFederationReady,
} from '../match-explainability-federation-bundle.ts';
import {
  buildSessionFederationExportBundle,
  sessionFederationExportShipped,
} from '../session-federation-export-bundle.ts';
import { auditLeagueFederationBridge, leagueFederationBridgeHealthy } from '../league-federation-bridge.ts';
import {
  buildFederationRecoveryOrchestrator,
  federationRecoveryOrchestratorWithinCap,
} from '../federation-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityUnionGate,
  matchExplainabilityUnionAllowed,
} from '../match-explainability-union-gate.ts';
import {
  buildMatchExplainabilityUnionBundle,
  matchExplainabilityUnionReady,
} from '../match-explainability-union-bundle.ts';
import {
  buildSessionUnionExportBundle,
  sessionUnionExportShipped,
} from '../session-union-export-bundle.ts';
import { auditFederationUnionBridge, federationUnionBridgeHealthy } from '../federation-union-bridge.ts';
import {
  buildUnionRecoveryOrchestrator,
  unionRecoveryOrchestratorWithinCap,
} from '../union-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityCommonwealthGate,
  matchExplainabilityCommonwealthAllowed,
} from '../match-explainability-commonwealth-gate.ts';
import {
  buildMatchExplainabilityCommonwealthBundle,
  matchExplainabilityCommonwealthReady,
} from '../match-explainability-commonwealth-bundle.ts';
import {
  buildSessionCommonwealthExportBundle,
  sessionCommonwealthExportShipped,
} from '../session-commonwealth-export-bundle.ts';
import { auditUnionCommonwealthBridge, unionCommonwealthBridgeHealthy } from '../union-commonwealth-bridge.ts';
import {
  buildCommonwealthRecoveryOrchestrator,
  commonwealthRecoveryOrchestratorWithinCap,
} from '../commonwealth-recovery-orchestrator.ts';
import {
  auditMatchExplainabilityRealmGate,
  matchExplainabilityRealmAllowed,
} from '../match-explainability-realm-gate.ts';
import {
  buildMatchExplainabilityRealmBundle,
  matchExplainabilityRealmReady,
} from '../match-explainability-realm-bundle.ts';
import {
  buildSessionRealmExportBundle,
  sessionRealmExportShipped,
} from '../session-realm-export-bundle.ts';
import { auditCommonwealthRealmBridge, commonwealthRealmBridgeHealthy } from '../commonwealth-realm-bridge.ts';
import {
  buildRealmRecoveryOrchestrator,
  realmRecoveryOrchestratorWithinCap,
} from '../realm-recovery-orchestrator.ts';
import {
  auditMatchExplainabilitySovereignGate,
  matchExplainabilitySovereignAllowed,
} from '../match-explainability-sovereign-gate.ts';
import type { MemoryEvalResult } from '../types.ts';

type Case = [string, string, () => boolean | string];

function runCases(cases: Case[]): MemoryEvalResult[] {
  return cases.map(([id, name, fn]) => {
    try {
      const r = fn();
      return { id, name, passed: r === true, detail: r === true ? undefined : String(r) };
    } catch (e) {
      return { id, name, passed: false, detail: e instanceof Error ? e.message : String(e) };
    }
  });
}

/** Modular eval cases (no React / localStorage). */
export function runAgent19ModuleSelfTests(): { results: MemoryEvalResult[] } {
  return {
    results: runCases([
      [
        'a19_horizon_idle',
        'Idle memory reports explainability disclaimer',
        () => {
          const snap = buildAiMemoryHorizonSnapshot(null);
          return snap.shortTermEventCount === 0 && snap.explainabilityDisclaimer.includes('not a neural') || JSON.stringify(snap);
        },
      ],
      [
        'a19_explain_brief',
        'Explainability brief includes quality note',
        () => {
          const snap = buildAiMemoryHorizonSnapshot(null);
          const lines = buildMemoryExplainabilityBrief(snap);
          return lines.length >= 1 && lines[0].includes('idle') || lines.join('|');
        },
      ],
      [
        'a19_audit_pass',
        'Audit accepts consistent influence trace',
        () => {
          const before = [{ type: 'sell', score: 10 }];
          const after = [
            {
              type: 'sell',
              score: 12.5,
              memoryInfluence: 2.5,
              memoryReasons: ['test'],
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2.5, reason: 'test' }],
            },
          ];
          const findings = auditMemoryInfluenceDecisions(before, after);
          return auditFindingsOk(findings) || JSON.stringify(findings);
        },
      ],
      [
        'a19_audit_fail_options',
        'Audit fails when decision count drops',
        () => {
          const findings = auditMemoryInfluenceDecisions([{ score: 1 }, { score: 2 }], [{ score: 1 }]);
          return findings.some(f => f.code === 'option_count_changed') || JSON.stringify(findings);
        },
      ],
      [
        'a19_slice_summary',
        'Horizon slice rollup aggregates deltas',
        () => {
          const sum = summarizeSlicesByHorizon([
            { horizon: 'team_directive', delta: 25, reason: 'a' },
            { horizon: 'short_term_match', delta: 3, reason: 'b' },
          ]);
          return sum.team_directive?.totalDelta === 25 && sum.short_term_match?.count === 1 || JSON.stringify(sum);
        },
      ],
      [
        'a19_cap_constant',
        'Documented influence cap is positive',
        () => AGENT19_MAX_SINGLE_DECISION_INFLUENCE >= 40 || String(AGENT19_MAX_SINGLE_DECISION_INFLUENCE),
      ],
      [
        'a19_negotiation_bounded',
        'Negotiation shift stays within ±0.2',
        () => {
          const lo = computeNegotiationThresholdShift({ trust: 10, grievance: 50 }, {});
          const hi = computeNegotiationThresholdShift({ trust: 90, gratitude: 40 }, { dealAffordable: true, thirdPartyThreat: 50 });
          return lo.shift > 0 && hi.shift < 0 && Math.abs(lo.shift) <= 0.2 && Math.abs(hi.shift) <= 0.2 || JSON.stringify({ lo, hi });
        },
      ],
      [
        'a19_negotiation_copy',
        'Negotiation explainability mentions bounded threshold',
        () => {
          const lines = formatNegotiationExplainability({ actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 }, {});
          return lines.some(l => l.includes('±0.2')) || lines.join('|');
        },
      ],
      [
        'a19_inspection_redaction',
        'Inspection narrative notes redaction for rivals',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.opponentModels.player = {
            actorId: 'player',
            totalOpportunities: 3,
            beliefs: { aggressive: { key: 'aggressive', value: 0.6, confidence: 0.4, observations: 2, opportunityCount: 3, source: 'match' } },
            regionalInterest: {},
            predictedObjectives: [],
          };
          const view = getFilteredAiMemoryInspectionView(mem, {
            viewerTeamId: 'team_player',
            ownerTeamId: 'team_opponent',
            persistentMemoryEnabled: false,
          });
          const lines = buildInspectionExplainabilityNarrative(view);
          return view.isRedacted && view.strategicProfiles.length === 0 && lines.some(l => l.includes('hidden')) || JSON.stringify({ view, lines });
        },
      ],
      [
        'a19_bounds_ok',
        'Empty actor memory passes bounds audit',
        () => memoryBoundsOk(createEmptyAiActorMemory('ai')) || JSON.stringify(auditActorMemoryBounds(createEmptyAiActorMemory('ai'))),
      ],
      [
        'a19_bounds_fail',
        'Oversized event list fails bounds audit',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = Array.from({ length: AGENT19_AI_MEMORY_EVENT_CAP + 1 }, (_, i) => ({
            id: `e${i}`,
            turn: i,
            actionType: 'sell',
            actorId: 'player',
            targetId: null,
            regionId: null,
            summary: 's',
            importance: 1,
            valence: 0,
            stableKey: `k${i}`,
          }));
          return !memoryBoundsOk(mem) || 'accepted oversize events';
        },
      ],
      [
        'a19_decision_trace',
        'Decision trace report merges horizon and slices',
        () => {
          const snap = buildAiMemoryHorizonSnapshot(null);
          const report = buildAgent19DecisionTraceReport({
            before: { type: 'sabotage', score: 10 },
            after: {
              type: 'sabotage',
              score: 14,
              memoryInfluence: 4,
              memoryInfluenceSlices: [
                { horizon: 'short_term_match', delta: 4, reason: 'rivalry' },
                { horizon: 'team_directive', delta: 0, reason: '' },
              ].filter(s => s.delta),
            },
            horizonSnapshot: snap,
          });
          return report.memoryInfluence === 4 && report.narrativeLines.length >= 2 || JSON.stringify(report);
        },
      ],
      [
        'a19_horizon_compare',
        'Horizon diff detects event count change',
        () => {
          const a = buildAiMemoryHorizonSnapshot(null);
          const mem = createEmptyAiActorMemory('ai');
          mem.events = [
            {
              id: 'e1',
              turn: 1,
              actionType: 'sell',
              actorId: 'player',
              targetId: null,
              regionId: null,
              summary: 's',
              importance: 1,
              valence: 0,
              stableKey: 'k1',
            },
            {
              id: 'e2',
              turn: 2,
              actionType: 'sell',
              actorId: 'player',
              targetId: null,
              regionId: null,
              summary: 's2',
              importance: 1,
              valence: 0,
              stableKey: 'k2',
            },
          ];
          const b = buildAiMemoryHorizonSnapshot(mem);
          const lines = compareHorizonSnapshots(a, b);
          return lines.some(l => l.includes('Match events')) || lines.join('|');
        },
      ],
      [
        'a19_horizon_labels',
        'Horizon labels are human readable',
        () => labelMemoryHorizon('long_term_prior').includes('Earlier') || labelMemoryHorizon('long_term_prior'),
      ],
      [
        'a19_slice_rank',
        'Influence slices rank by magnitude',
        () => {
          const ranked = rankInfluenceSlicesByMagnitude([
            { horizon: 'short_term_match', delta: 1, reason: 'a' },
            { horizon: 'team_directive', delta: 25, reason: 'b' },
          ]);
          return ranked[0].delta === 25 && formatHorizonBadge('team_directive') === 'Team directive' || JSON.stringify(ranked);
        },
      ],
      [
        'a19_r3_prior_lines',
        'Persistent prior brief lists saved beliefs when enabled',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.opponentModels.player = {
            actorId: 'player',
            totalOpportunities: 1,
            beliefs: {
              aggressive: { key: 'aggressive', value: 0.7, confidence: 0.4, observations: 0, opportunityCount: 1, source: 'persistent_prior' },
            },
            regionalInterest: {},
            predictedObjectives: [],
          };
          const lines = buildPersistentPriorExplainabilityBrief(mem, { persistentMemoryEnabled: true });
          return listPersistentPriorBeliefs(mem).length === 1 && lines.some(l => l.includes('Saved prior')) || lines.join('|');
        },
      ],
      [
        'a19_r3_adaptive_plan',
        'Adaptive plan explainability describes status',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.adaptivePlan = { objectiveId: 'counter_expand_NSW', status: 'revised', revisionReason: 'Rival focus shifted' };
          const lines = explainAdaptivePlan(mem);
          return lines.some(l => l.includes('revised')) && lines.some(l => l.includes('never execute')) || lines.join('|');
        },
      ],
      [
        'a19_r3_health_scorecard',
        'Health scorecard is excellent for empty bounded memory',
        () => {
          const card = computeMemoryHealthScorecard(createEmptyAiActorMemory('ai'));
          return card.boundsOk && card.band === 'excellent' && card.healthScore >= 90 || JSON.stringify(card);
        },
      ],
      [
        'a19_r3_turn_summary',
        'Turn influence summary aggregates horizons',
        () => {
          const before = [{ type: 'a', score: 5 }, { type: 'b', score: 5 }];
          const after = [
            { type: 'a', score: 30, memoryInfluence: 25, memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 25, reason: 'plan' }] },
            { type: 'b', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust' }] },
          ];
          const sum = summarizeTurnMemoryInfluence(before, after);
          return sum.auditOk && sum.influencedDecisionCount === 2 && sum.byHorizon.team_directive?.totalDelta === 25 || JSON.stringify(sum);
        },
      ],
      [
        'a19_r3_gi_claims',
        'GI claims include policy disclaimer and redaction',
        () => {
          const snap = buildAiMemoryHorizonSnapshot(null);
          const claims = buildMemoryGiClaims({
            horizon: snap,
            inspection: getFilteredAiMemoryInspectionView(createEmptyAiActorMemory('ai'), {
              viewerTeamId: 'a',
              ownerTeamId: 'b',
            }),
          });
          const brief = formatGiClaimsAsBrief(claims);
          return brief.some(l => l.includes('[policy]')) && brief.some(l => l.includes('hidden')) || brief.join('|');
        },
      ],
      [
        'a19_r3_health_brief',
        'Health brief formats scorecard summary',
        () => {
          const lines = formatMemoryHealthBrief(computeMemoryHealthScorecard(createEmptyAiActorMemory('x')));
          return lines[0].includes('100') || lines[0];
        },
      ],
      [
        'a19_r4_timeline_order',
        'Event timeline sorts by turn and caps display',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = [
            {
              id: 'b',
              turn: 2,
              actionType: 'sell',
              actorId: 'player',
              targetId: null,
              regionId: null,
              summary: 'late',
              importance: 1,
              valence: 0.2,
              stableKey: 'k2',
            },
            {
              id: 'a',
              turn: 1,
              actionType: 'buy',
              actorId: 'player',
              targetId: null,
              regionId: null,
              summary: 'early',
              importance: 1,
              valence: -0.1,
              stableKey: 'k1',
            },
          ];
          const tl = buildMemoryEventTimeline(mem);
          return tl.length === 2 && tl[0].turn === 1 && tl[1].valenceLabel === 'positive' || JSON.stringify(tl);
        },
      ],
      [
        'a19_r4_timeline_cap',
        'Timeline respects display cap constant',
        () => AGENT19_TIMELINE_DISPLAY_CAP >= 5 && AGENT19_TIMELINE_DISPLAY_CAP <= 20,
      ],
      [
        'a19_r4_relationship_brief',
        'Relationship brief surfaces dominant axes',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.relationships.player = {
            actorId: 'player',
            trust: 30,
            respect: 40,
            rivalry: 80,
            reliability: 50,
            cooperation: 20,
            threat: 70,
            grievance: 60,
            gratitude: 10,
            lastUpdatedTurn: 3,
          };
          const lines = buildRelationshipExplainabilityBrief(mem, 'player');
          return lines.some(l => l.includes('Rivalry')) && listTrackedRelationshipActorIds(mem).includes('player') || lines.join('|');
        },
      ],
      [
        'a19_r4_retention_dup_key',
        'Retention audit warns on duplicate stableKey',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = [
            {
              id: '1',
              turn: 1,
              actionType: 'sell',
              actorId: 'p',
              targetId: null,
              regionId: null,
              summary: 'a',
              importance: 1,
              valence: 0,
              stableKey: 'dup',
            },
            {
              id: '2',
              turn: 2,
              actionType: 'buy',
              actorId: 'p',
              targetId: null,
              regionId: null,
              summary: 'b',
              importance: 1,
              valence: 0,
              stableKey: 'dup',
            },
          ];
          const findings = auditMemoryRetentionOrdering(mem);
          return retentionAuditOk(findings) && findings.some(f => f.code === 'duplicate_stable_key') || JSON.stringify(findings);
        },
      ],
      [
        'a19_r4_turn_pack',
        'Turn explainability pack merges horizon, influence, timeline',
        () => {
          const before = createEmptyAiActorMemory('ai');
          const after = createEmptyAiActorMemory('ai');
          after.events = [
            {
              id: 'e1',
              turn: 1,
              actionType: 'sabotage',
              actorId: 'player',
              targetId: 'ai',
              regionId: null,
              summary: 'hit',
              importance: 2,
              valence: -0.5,
              stableKey: 's1',
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: before,
            memoryAfter: after,
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 8,
                memoryInfluence: 3,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 3, reason: 'grievance' }],
              },
            ],
          });
          const summaryLines = summarizeMemoryEventTimeline(buildMemoryEventTimeline(after));
          return (
            pack.influenceSummary.influencedDecisionCount === 1 &&
            pack.horizonDiffLines.some(l => l.includes('Match events')) &&
            pack.narrativeLines.length >= 4 &&
            summaryLines[0].includes('1 event')
          ) || JSON.stringify({ pack, summaryLines });
        },
      ],
      [
        'a19_r4_timeline_empty',
        'Empty timeline summary is explicit',
        () => {
          const lines = summarizeMemoryEventTimeline([]);
          return lines[0].includes('No committed') || lines[0];
        },
      ],
      [
        'a19_r5_counterfactual_delta',
        'Counterfactual report quantifies memory score nudges',
        () => {
          const before = [{ type: 'sell', score: 10 }];
          const after = [{ type: 'sell', score: 15, memoryInfluence: 5, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'trust' }] }];
          const report = buildCounterfactualMemoryReport(before, after);
          return report.influencedCount === 1 && report.deltas[0].baselineScore === 10 || JSON.stringify(report);
        },
      ],
      [
        'a19_r5_counterfactual_baseline',
        'Baseline strip removes influence but keeps option count',
        () => {
          const after = [{ type: 'a', score: 12, memoryInfluence: 2 }];
          const stripped = baselineScoresWithoutMemory(after);
          return stripped[0].score === 10 && (stripped[0].memoryInfluence ?? 1) === 0 || JSON.stringify(stripped);
        },
      ],
      [
        'a19_r5_staleness_relationship',
        'Staleness audit warns on old relationship updates',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.relationships.player = {
            actorId: 'player',
            trust: 50,
            respect: 50,
            rivalry: 0,
            reliability: 50,
            cooperation: 50,
            threat: 0,
            grievance: 0,
            gratitude: 0,
            lastUpdatedTurn: 1,
          };
          const findings = auditMemoryStaleness(mem, 1 + AGENT19_RELATIONSHIP_STALE_TURN_GAP);
          return findings.some(f => f.code === 'relationship_stale') || JSON.stringify(findings);
        },
      ],
      [
        'a19_r5_staleness_fresh',
        'Fresh relationships produce no staleness warnings',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.relationships.player = {
            actorId: 'player',
            trust: 50,
            respect: 50,
            rivalry: 0,
            reliability: 50,
            cooperation: 50,
            threat: 0,
            grievance: 0,
            gratitude: 0,
            lastUpdatedTurn: 10,
          };
          const summary = summarizeMemoryStaleness(mem, 10);
          return summary.findings.filter(f => f.code === 'relationship_stale').length === 0 || summary.narrativeLines.join('|');
        },
      ],
      [
        'a19_r5_session_rollup',
        'Session rollup aggregates turn packs by horizon',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 30,
                memoryInfluence: 25,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 25, reason: 'plan' }],
              },
            ],
          });
          const rollup = buildSessionExplainabilityRollup([pack, { ...pack, turn: 2 }]);
          return rollup.turnCount === 2 && rollup.dominantHorizon === 'team_directive' || JSON.stringify(rollup);
        },
      ],
      [
        'a19_r5_debug_export_cap',
        'Debug export caps narrative lines',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 3,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'x', score: 1 }],
            decisionsAfter: [{ type: 'x', score: 1 }],
          });
          const exp = buildExplainabilityDebugExport(pack);
          return (
            exp.schema === 'agent19.explainability.v1' &&
            explainabilityDebugExportWithinCap(exp) &&
            AGENT19_DEBUG_EXPORT_NARRATIVE_CAP >= 10
          ) || JSON.stringify(exp);
        },
      ],
      [
        'a19_r5_integrity_merge',
        'Integrity audit merges bounds retention and staleness',
        () => {
          const report = auditExplainabilityIntegrity(createEmptyAiActorMemory('ai'), 1);
          return report.boundsOk && report.findings.length >= 0 && report.narrativeLines[0].includes('integrity') || report.narrativeLines[0];
        },
      ],
      [
        'a19_r6_opponent_brief',
        'Opponent model brief lists confident match beliefs',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.opponentModels.player = {
            actorId: 'player',
            totalOpportunities: 4,
            beliefs: {
              aggressive: {
                key: 'aggressive',
                value: 0.72,
                confidence: 0.55,
                observations: 3,
                opportunityCount: 4,
                source: 'match',
              },
            },
            regionalInterest: {},
            predictedObjectives: [],
          };
          const lines = buildOpponentModelExplainabilityBrief(mem, 'player');
          return lines.some(l => l.includes('aggressive')) && listOpponentBeliefExplainLines(mem, 'player').length === 1 || lines.join('|');
        },
      ],
      [
        'a19_r6_opponent_empty',
        'Missing opponent model returns explicit idle copy',
        () => {
          const lines = buildOpponentModelExplainabilityBrief(createEmptyAiActorMemory('ai'), 'player');
          return lines[0].includes('No opponent model') || lines[0];
        },
      ],
      [
        'a19_r6_drift_spike',
        'Influence drift warns on sharp turn-to-turn spike',
        () => {
          const low = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 2, memoryInfluence: 1 }],
          });
          const high = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 30,
                memoryInfluence: 25,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 25, reason: 'plan' }],
              },
            ],
          });
          const findings = auditInfluenceDriftBetweenTurns(low, high);
          return (
            findings.some(f => f.code === 'influence_spike') &&
            AGENT19_INFLUENCE_DRIFT_SPIKE_THRESHOLD >= 10
          ) || JSON.stringify(findings);
        },
      ],
      [
        'a19_r6_drift_stable',
        'Stable influence between turns yields no spike warning',
        () => {
          const a = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 3, memoryInfluence: 2 }],
          });
          const b = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 4, memoryInfluence: 3 }],
          });
          const findings = auditInfluenceDriftBetweenTurns(a, b);
          return !findings.some(f => f.code === 'influence_spike') || JSON.stringify(findings);
        },
      ],
      [
        'a19_r6_match_digest',
        'Match digest merges session health and integrity',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 5, memoryInfluence: 4 }],
          });
          const digest = buildMatchExplainabilityDigest({
            packs: [pack],
            memory: createEmptyAiActorMemory('ai'),
            currentTurn: 2,
          });
          return (
            digest.integrityOk &&
            digest.narrativeLines.length <= AGENT19_MATCH_DIGEST_LINE_CAP &&
            digest.narrativeLines[0].includes('digest')
          ) || JSON.stringify(digest);
        },
      ],
      [
        'a19_r6_prior_tension',
        'Prior/event tension warns when cooperative prior meets hostile events',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = [
            {
              id: 'e1',
              turn: 5,
              actionType: 'sabotage',
              actorId: 'player',
              targetId: 'ai',
              regionId: null,
              summary: 'hit',
              importance: 2,
              valence: -0.6,
              stableKey: 's1',
            },
          ];
          mem.opponentModels.player = {
            actorId: 'player',
            totalOpportunities: 2,
            beliefs: {
              cooperative: {
                key: 'cooperative',
                value: 0.7,
                confidence: 0.4,
                observations: 1,
                opportunityCount: 2,
                source: 'persistent_prior',
              },
            },
            regionalInterest: {},
            predictedObjectives: [],
          };
          const findings = auditPriorEventTension(mem, { persistentMemoryEnabled: true });
          return findings.some(f => f.code === 'prior_event_tension') || JSON.stringify(findings);
        },
      ],
      [
        'a19_r6_turn_gi_bridge',
        'Turn pack GI bridge adds influence and counterfactual claims',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 10,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'grievance' }],
              },
            ],
          });
          const claims = buildTurnPackGiClaims({
            pack,
            horizon: pack.horizonAfter,
            memoryInfluenceEnabled: true,
          });
          return (
            claims.some(c => c.id === 'turn_influence') &&
            claims.some(c => c.id === 'turn_counterfactual') &&
            claims.some(c => c.id === 'mem_rule_based')
          ) || claims.map(c => c.id).join(',');
        },
      ],
      [
        'a19_r7_slice_attribution_ok',
        'Turn slice attribution passes when slices sum to influence',
        () => {
          const report = auditTurnSliceAttribution(
            [{ type: 'a', score: 5 }],
            [
              {
                type: 'a',
                score: 10,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'trust' }],
              },
            ],
          );
          return turnSliceAttributionOk(report) && report.sliceMismatchCount === 0 || JSON.stringify(report);
        },
      ],
      [
        'a19_r7_slice_attribution_fail',
        'Slice attribution flags mismatched slice sums',
        () => {
          const report = auditTurnSliceAttribution(
            [{ type: 'a', score: 5 }],
            [
              {
                type: 'a',
                score: 10,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust' }],
              },
            ],
          );
          return !turnSliceAttributionOk(report) && report.sliceMismatchCount === 1 || JSON.stringify(report);
        },
      ],
      [
        'a19_r7_gi_redaction_ok',
        'Turn pack GI claims stay consistent under redacted inspection',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 2, memoryInfluence: 1 }],
          });
          const inspection = getFilteredAiMemoryInspectionView(createEmptyAiActorMemory('ai'), {
            viewerTeamId: 'team_player',
            ownerTeamId: 'team_opponent',
          });
          const findings = auditTurnPackGiRedaction(pack, inspection);
          return giRedactionConsistencyOk(findings) && inspection.isRedacted || JSON.stringify(findings);
        },
      ],
      [
        'a19_r7_gi_redaction_leak',
        'GI redaction audit fails when claims mention private profiles',
        () => {
          const findings = auditGiRedactionConsistency({
            claims: [{ text: 'Rival strategic profile aggressionPreference is 0.9' }],
            inspection: getFilteredAiMemoryInspectionView(createEmptyAiActorMemory('ai'), {
              viewerTeamId: 'a',
              ownerTeamId: 'b',
            }),
          });
          return findings.some(f => f.code === 'gi_redaction_leak') || JSON.stringify(findings);
        },
      ],
      [
        'a19_r7_multi_drift_rollup',
        'Multi-turn drift rollup counts spikes across turn packs',
        () => {
          const low = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 2, memoryInfluence: 1 }],
          });
          const high = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 30,
                memoryInfluence: 25,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 25, reason: 'plan' }],
              },
            ],
          });
          const rollup = buildMultiTurnDriftRollup([low, high]);
          return rollup.pairCount === 1 && rollup.spikeCount >= 1 || JSON.stringify(rollup);
        },
      ],
      [
        'a19_r7_recovery_hints',
        'Integrity recovery hints cap and mention bounds when failing',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = Array.from({ length: AGENT19_AI_MEMORY_EVENT_CAP + 2 }, (_, i) => ({
            id: `e${i}`,
            turn: i,
            actionType: 'sell',
            actorId: 'player',
            targetId: null,
            regionId: null,
            summary: 's',
            importance: 1,
            valence: 0,
            stableKey: `k${i}`,
          }));
          const integrity = auditExplainabilityIntegrity(mem, 1);
          const hints = buildIntegrityRecoveryHints(integrity);
          return (
            !integrity.boundsOk &&
            hints.some(h => h.includes('caps')) &&
            hints.length <= AGENT19_RECOVERY_HINT_CAP
          ) || JSON.stringify({ integrity, hints });
        },
      ],
      [
        'a19_r7_adaptive_bridge',
        'Adaptive plan bridge cites team_directive magnitude',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.adaptivePlan = { objectiveId: 'counter_expand', status: 'active', revisionReason: null };
          const pack = buildTurnExplainabilityPack({
            turn: 3,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 35,
                memoryInfluence: 25,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 25, reason: 'plan' }],
              },
            ],
          });
          const lines = buildAdaptivePlanInfluenceBridge(mem, pack);
          return (
            adaptivePlanInfluenceAligned(mem, pack) &&
            lines.some(l => l.includes('Team-directive')) &&
            AGENT19_DIRECTIVE_BRIDGE_MAG_THRESHOLD >= 5
          ) || lines.join('|');
        },
      ],
      [
        'a19_r8_composite_ok',
        'Turn pack composite audit passes slice + GI checks',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 10,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'trust' }],
              },
            ],
          });
          const report = auditTurnPackComposite(pack, {
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: pack.influenceSummary.influencedDecisionCount
              ? [
                  {
                    type: 'a',
                    score: 10,
                    memoryInfluence: 5,
                    memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'trust' }],
                  },
                ]
              : [{ type: 'a', score: 5 }],
          });
          return turnPackCompositeOk(report) && report.sliceOk || JSON.stringify(report);
        },
      ],
      [
        'a19_r8_composite_fail',
        'Composite audit fails when slice sums mismatch',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'b', score: 1 }],
            decisionsAfter: [
              {
                type: 'b',
                score: 8,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 1, reason: 'plan' }],
              },
            ],
          });
          const report = auditTurnPackComposite(pack, {
            decisionsBefore: [{ type: 'b', score: 1 }],
            decisionsAfter: [
              {
                type: 'b',
                score: 8,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 1, reason: 'plan' }],
              },
            ],
          });
          return !turnPackCompositeOk(report) && !report.sliceOk || JSON.stringify(report);
        },
      ],
      [
        'a19_r8_session_gi_rollup',
        'Session GI rollup dedupes claims and respects cap',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 3, memoryInfluence: 2 }],
          });
          const rollup = buildSessionGiClaimsRollup([pack, pack], { memoryInfluenceEnabled: true });
          return (
            sessionGiRollupWithinCap(rollup) &&
            rollup.uniqueIds.includes('turn_influence') &&
            rollup.claimCount <= AGENT19_SESSION_GI_CLAIM_CAP
          ) || JSON.stringify(rollup);
        },
      ],
      [
        'a19_r8_negotiation_bridge',
        'Negotiation bridge aligns trust shift with relationship slices',
        () => {
          const bridge = buildNegotiationInfluenceBridge(
            { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 },
            [
              {
                type: 'diplomacy',
                score: 12,
                memoryInfluence: 3,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 3, reason: 'trust from prior deal' }],
              },
            ],
          );
          return negotiationInfluenceAligned(bridge) && bridge.negotiationShift < 0 || JSON.stringify(bridge);
        },
      ],
      [
        'a19_r8_trace_continuity_ok',
        'Trace continuity ok when option types preserved',
        () => {
          const report = auditDecisionTraceContinuity(
            [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }],
            [
              { type: 'sell', score: 7, memoryInfluence: 2 },
              { type: 'hold', score: 3 },
            ],
          );
          return decisionTraceContinuityOk(report) && report.droppedTypes.length === 0 || JSON.stringify(report);
        },
      ],
      [
        'a19_r8_trace_continuity_fail',
        'Trace continuity fails when an option type disappears',
        () => {
          const report = auditDecisionTraceContinuity(
            [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }],
            [{ type: 'sell', score: 7, memoryInfluence: 2 }],
          );
          return !decisionTraceContinuityOk(report) && report.droppedTypes.includes('hold') || JSON.stringify(report);
        },
      ],
      [
        'a19_r8_confidence_band',
        'Confidence band drops when integrity bounds fail',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = Array.from({ length: AGENT19_AI_MEMORY_EVENT_CAP + 1 }, (_, i) => ({
            id: `e${i}`,
            turn: i,
            actionType: 'sell',
            actorId: 'player',
            targetId: null,
            regionId: null,
            summary: 's',
            importance: 1,
            valence: 0,
            stableKey: `k${i}`,
          }));
          const integrity = auditExplainabilityIntegrity(mem, 1);
          const confidence = computeExplainabilityConfidence({ integrity });
          return (
            !integrity.boundsOk &&
            confidence.band === 'low' &&
            !explainabilityConfidenceAtLeast(confidence, 'medium')
          ) || JSON.stringify({ integrity, confidence });
        },
      ],
      [
        'a19_r9_composite_recovery',
        'Composite recovery hints when slice audit fails',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 3,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'x', score: 1 }],
            decisionsAfter: [
              {
                type: 'x',
                score: 9,
                memoryInfluence: 4,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 1, reason: 'plan' }],
              },
            ],
          });
          const report = auditTurnPackComposite(pack, {
            decisionsBefore: [{ type: 'x', score: 1 }],
            decisionsAfter: [
              {
                type: 'x',
                score: 9,
                memoryInfluence: 4,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 1, reason: 'plan' }],
              },
            ],
          });
          const hints = buildCompositeRecoveryHints(report);
          return (
            compositeRecoveryNeeded(report) &&
            hints.some(h => h.includes('slice')) &&
            hints.length <= AGENT19_COMPOSITE_RECOVERY_HINT_CAP
          ) || hints.join('|');
        },
      ],
      [
        'a19_r9_composite_recovery_pass',
        'Composite recovery hints praise clean audit',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 10,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'trust' }],
              },
            ],
          });
          const report = auditTurnPackComposite(pack, {
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 10,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'trust' }],
              },
            ],
          });
          const hints = buildCompositeRecoveryHints(report);
          return !compositeRecoveryNeeded(report) && hints[0].includes('passed') || hints.join('|');
        },
      ],
      [
        'a19_r9_session_confidence',
        'Session confidence rollup tracks min band across turns',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const rollup = buildSessionConfidenceRollup([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
          });
          return (
            rollup.turnCount === 1 &&
            sessionConfidenceAtLeast(rollup, 'medium') &&
            rollup.averageScore >= 55
          ) || JSON.stringify(rollup);
        },
      ],
      [
        'a19_r9_horizon_slice_ok',
        'Horizon slice alignment ok for short-term slices',
        () => {
          const snap = buildAiMemoryHorizonSnapshot(null);
          const report = auditHorizonSliceAlignment(snap, [
            {
              type: 'sell',
              score: 10,
              memoryInfluence: 2,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'event' }],
            },
          ]);
          return horizonSliceAlignmentOk(report) || JSON.stringify(report);
        },
      ],
      [
        'a19_r9_horizon_slice_fail',
        'Horizon slice alignment fails on inactive long-term prior',
        () => {
          const snap = buildAiMemoryHorizonSnapshot(null, { persistentMemoryEnabled: false });
          const report = auditHorizonSliceAlignment(snap, [
            {
              type: 'sell',
              score: 10,
              memoryInfluence: 3,
              memoryInfluenceSlices: [{ horizon: 'long_term_prior', delta: 3, reason: 'prior' }],
            },
          ]);
          return !horizonSliceAlignmentOk(report) && report.findings.some(f => f.code === 'horizon_slice_inactive') || JSON.stringify(report);
        },
      ],
      [
        'a19_r9_match_gate',
        'Match gate opens for healthy single-turn session',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const gate = auditMatchExplainabilityGate([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityGateOpen(gate) && gate.sessionRollupTurns === 1 || JSON.stringify(gate);
        },
      ],
      [
        'a19_r9_trace_composite',
        'Trace composite bridge requires slice + continuity',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'm' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 4,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditTraceCompositeBridge(pack, { decisionsBefore, decisionsAfter });
          return traceCompositeBridgeOk(report) && report.traceOk && report.compositeOk || JSON.stringify(report);
        },
      ],
      [
        'a19_r10_gate_recovery',
        'Match gate recovery hints when confidence gate fails',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = Array.from({ length: AGENT19_AI_MEMORY_EVENT_CAP + 1 }, (_, i) => ({
            id: `e${i}`,
            turn: i,
            actionType: 'sell',
            actorId: 'player',
            targetId: null,
            regionId: null,
            summary: 's',
            importance: 1,
            valence: 0,
            stableKey: `k${i}`,
          }));
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const gate = auditMatchExplainabilityGate([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          const hints = buildMatchGateRecoveryHints(gate, {
            memory: mem,
            currentTurn: 1,
            lastPack: pack,
            lastDecisions: { before: decisionsBefore, after: decisionsAfter },
          });
          return (
            matchGateRecoveryNeeded(gate) &&
            hints.some(h => h.includes('Trim') || h.includes('bounds')) &&
            hints.length <= AGENT19_MATCH_RECOVERY_HINT_CAP
          ) || hints.join('|');
        },
      ],
      [
        'a19_r10_gate_recovery_open',
        'Match gate recovery is minimal when gate open',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const gate = auditMatchExplainabilityGate([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          const hints = buildMatchGateRecoveryHints(gate, { memory: mem, currentTurn: 1 });
          return !matchGateRecoveryNeeded(gate) && hints[0].includes('open') || hints.join('|');
        },
      ],
      [
        'a19_r10_session_trace_ok',
        'Session trace continuity gate passes clean turns',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2 },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditSessionTraceContinuityGate([pack], [{ before: decisionsBefore, after: decisionsAfter }]);
          return sessionTraceContinuityGateOpen(report) && report.failedTurns.length === 0 || JSON.stringify(report);
        },
      ],
      [
        'a19_r10_session_trace_fail',
        'Session trace continuity gate fails when option dropped',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({
            turn: 3,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditSessionTraceContinuityGate([pack], [{ before: decisionsBefore, after: decisionsAfter }]);
          return !sessionTraceContinuityGateOpen(report) && report.failedTurns.includes(3) || JSON.stringify(report);
        },
      ],
      [
        'a19_r10_session_horizon',
        'Session horizon alignment flags inactive prior slices',
        () => {
          const decisionsAfter = [
            {
              type: 'x',
              score: 8,
              memoryInfluence: 2,
              memoryInfluenceSlices: [{ horizon: 'long_term_prior', delta: 2, reason: 'prior' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'x', score: 6 }],
            decisionsAfter,
            persistentMemoryEnabled: false,
          });
          const report = auditSessionHorizonAlignment([pack], [{ after: decisionsAfter }]);
          return !sessionHorizonAlignmentOk(report) && report.failedTurns.includes(1) || JSON.stringify(report);
        },
      ],
      [
        'a19_r10_export_gate',
        'Explainability export allowed when match gate open',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditExplainabilityExportGate([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return (
            explainabilityExportAllowed(report) &&
            report.exportPayload !== null &&
            report.exportPayload.schema === 'agent19.explainability.v1'
          ) || JSON.stringify(report);
        },
      ],
      [
        'a19_r10_trace_composite_rollup',
        'Session trace composite rollup counts passes',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'm' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 5,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const rollup = buildSessionTraceCompositeRollup([pack], [{ before: decisionsBefore, after: decisionsAfter }]);
          return sessionTraceCompositeAllPassed(rollup) && rollup.passCount === 1 || JSON.stringify(rollup);
        },
      ],
      [
        'a19_r11_final_gate_ok',
        'Final match gate opens when all session checks pass',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'm' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityFinalGate([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityFinalGateOpen(report) && report.traceCompositeAllPassed || JSON.stringify(report);
        },
      ],
      [
        'a19_r11_final_gate_fail',
        'Final match gate closed when trace continuity fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityFinalGate([pack], {
            memory: null,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityFinalGateOpen(report) && !report.traceContinuityOpen || JSON.stringify(report);
        },
      ],
      [
        'a19_r11_export_bundle',
        'Session export bundle materializes when gates pass',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const bundle = buildSessionExportBundle([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return (
            bundle.exports.length === 1 &&
            sessionExportBundleWithinCap(bundle) &&
            AGENT19_SESSION_EXPORT_TURN_CAP >= 1
          ) || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r11_negotiation_session',
        'Negotiation session rollup counts aligned diplomacy turns',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const decisionsAfter = [
            {
              type: 'diplomacy',
              score: 12,
              memoryInfluence: 3,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 3, reason: 'trust from prior deal' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'diplomacy', score: 9 }],
            decisionsAfter,
          });
          const rollup = buildNegotiationSessionRollup([pack], {
            relationship: rel,
            decisionsByTurn: [{ after: decisionsAfter }],
          });
          return negotiationSessionMostlyAligned(rollup) && rollup.alignedTurns === 1 || JSON.stringify(rollup);
        },
      ],
      [
        'a19_r11_confidence_export',
        'Confidence export bridge allows export on healthy session',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditConfidenceExportBridge([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return confidenceExportBridgeAllowed(report) && report.confidenceOk || JSON.stringify(report);
        },
      ],
      [
        'a19_r11_recovery_playbook',
        'Recovery playbook lists bounds steps when gate closed',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = Array.from({ length: AGENT19_AI_MEMORY_EVENT_CAP + 1 }, (_, i) => ({
            id: `e${i}`,
            turn: i,
            actionType: 'sell',
            actorId: 'player',
            targetId: null,
            regionId: null,
            summary: 's',
            importance: 1,
            valence: 0,
            stableKey: `k${i}`,
          }));
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const playbook = buildMatchRecoveryPlaybook([pack], {
            memory: mem,
            currentTurn: 1,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return (
            matchRecoveryPlaybookWithinCap(playbook) &&
            playbook.steps.some(s => s.includes('Trim') || s.includes('bounds')) &&
            playbook.stepCount <= AGENT19_RECOVERY_PLAYBOOK_CAP
          ) || playbook.steps.join('|');
        },
      ],
      [
        'a19_r11_recovery_playbook_clean',
        'Recovery playbook is short when match gate open',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const playbook = buildMatchRecoveryPlaybook([pack], {
            memory: mem,
            currentTurn: 1,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return playbook.steps[0].includes('open') && playbook.stepCount >= 1 || playbook.steps.join('|');
        },
      ],
      [
        'a19_r12_delivery_ship',
        'Delivery bundle ships exports when final gate open',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'm' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const delivery = buildMatchExplainabilityDeliveryBundle([pack], {
            memory: mem,
            currentTurn: 1,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return (
            matchExplainabilityDeliveryShippable(delivery) &&
            delivery.exportBundle !== null &&
            delivery.recoveryPlaybook === null &&
            delivery.narrativeLines.length <= AGENT19_DELIVERY_NARRATIVE_CAP
          ) || JSON.stringify(delivery);
        },
      ],
      [
        'a19_r12_delivery_blocked',
        'Delivery bundle returns playbook when trace fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const delivery = buildMatchExplainabilityDeliveryBundle([pack], {
            memory: null,
            currentTurn: 2,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return (
            !matchExplainabilityDeliveryShippable(delivery) &&
            delivery.recoveryPlaybook !== null &&
            delivery.exportBundle === null
          ) || JSON.stringify(delivery);
        },
      ],
      [
        'a19_r12_final_recovery_bridge',
        'Final gate recovery hints cite trace when continuity fails',
        () => {
          const decisionsBefore = [{ type: 'a', score: 1 }, { type: 'b', score: 1 }];
          const decisionsAfter = [{ type: 'a', score: 3, memoryInfluence: 1, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 1, reason: 't' }] }];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const finalGate = auditMatchExplainabilityFinalGate([pack], {
            memory: null,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          const hints = buildFinalGateRecoveryHints(finalGate);
          return (
            finalGateRecoveryNeeded(finalGate) &&
            hints.some(h => h.includes('option types') || h.includes('Restore')) &&
            hints.length <= AGENT19_FINAL_RECOVERY_HINT_CAP
          ) || hints.join('|');
        },
      ],
      [
        'a19_r12_gi_delivery',
        'Session GI delivery ready when match gate open',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const gi = buildSessionGiDeliveryBundle([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionGiDeliveryReady(gi) && gi.giWithinCap || JSON.stringify(gi);
        },
      ],
      [
        'a19_r12_negotiation_export',
        'Negotiation export bridge includes notes when aligned',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditNegotiationExportBridge([pack], {
            memory: mem,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return negotiationExportNotesIncluded(report) && report.exportTurnCount === 1 || JSON.stringify(report);
        },
      ],
      [
        'a19_r12_shipment_gate_ok',
        'Shipment gate allows healthy diplomacy session',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityShipmentGate([pack], {
            memory: mem,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityShipmentAllowed(report) && report.finalGateOpen || JSON.stringify(report);
        },
      ],
      [
        'a19_r12_shipment_gate_fail',
        'Shipment gate blocks when final trace continuity fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({
            turn: 3,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityShipmentGate([pack], {
            memory: null,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityShipmentAllowed(report) && !report.finalGateOpen || JSON.stringify(report);
        },
      ],
      [
        'a19_r13_release_ready',
        'Release bundle ready when delivery shipment and GI align',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const params = {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const release = buildMatchExplainabilityReleaseBundle([pack], params);
          return matchExplainabilityReleaseReady(release) && release.giDeliveryReady || JSON.stringify(release);
        },
      ],
      [
        'a19_r13_release_held',
        'Release bundle held when trace continuity fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const release = buildMatchExplainabilityReleaseBundle([pack], {
            memory: null,
            currentTurn: 2,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityReleaseReady(release) && !release.deliveryShippable || JSON.stringify(release);
        },
      ],
      [
        'a19_r13_shipment_recovery',
        'Shipment recovery bridge lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'a', score: 1 }, { type: 'b', score: 1 }];
          const decisionsAfter = [{ type: 'a', score: 3, memoryInfluence: 1, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 1, reason: 't' }] }];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const params = {
            memory: null,
            currentTurn: 1,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const bridge = buildShipmentRecoveryPlaybookBridge([pack], params);
          return (
            shipmentRecoveryNeeded([pack], params) &&
            bridge.stepCount >= 1 &&
            bridge.stepCount <= AGENT19_SHIPMENT_RECOVERY_CAP
          ) || bridge.steps.join('|');
        },
      ],
      [
        'a19_r13_delivery_shipment_bridge',
        'Delivery and shipment gates align on healthy session',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'm' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditDeliveryShipmentBridge([pack], {
            memory: mem,
            currentTurn: 1,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return deliveryShipmentBridgeAligned(report) && report.deliveryShippable || JSON.stringify(report);
        },
      ],
      [
        'a19_r13_session_release_export',
        'Session release export emits when release ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const params = {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const bundle = buildSessionReleaseExportBundle([pack], params);
          return (
            sessionReleaseExportEmitted(bundle) &&
            bundle.schema === 'agent19.release.v1' &&
            bundle.exports.length === 1
          ) || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r13_launch_gate_ok',
        'Launch gate GO when release export emitted',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityLaunchGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityLaunchAllowed(report) && report.releaseExportEmitted || JSON.stringify(report);
        },
      ],
      [
        'a19_r13_launch_gate_no',
        'Launch gate NO-GO when shipment blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({
            turn: 4,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityLaunchGate([pack], {
            memory: null,
            currentTurn: 4,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityLaunchAllowed(report) && report.recoveryStepCount >= 1 || JSON.stringify(report);
        },
      ],
      [
        'a19_r14_ops_ready',
        'Operations bundle ready when launch and GI delivery pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const params = {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const ops = buildMatchExplainabilityOperationsBundle([pack], params);
          return matchExplainabilityOperationsReady(ops) && ops.launchAllowed || JSON.stringify(ops);
        },
      ],
      [
        'a19_r14_launch_recovery_orchestrator',
        'Launch recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const params = {
            memory: null,
            currentTurn: 2,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const report = buildLaunchRecoveryOrchestrator([pack], params, false);
          return (
            report.launchBlocked &&
            report.stepCount >= 1 &&
            launchRecoveryOrchestratorWithinCap(report) &&
            report.stepCount <= AGENT19_LAUNCH_RECOVERY_ORCHESTRATOR_CAP
          ) || report.steps.join('|');
        },
      ],
      [
        'a19_r14_ops_export',
        'Session operations export ready on healthy launch',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const params = {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const bundle = buildSessionOperationsExportBundle([pack], params);
          return (
            sessionOperationsExportReady(bundle) &&
            bundle.operationsSchema === 'agent19.operations.v1' &&
            bundle.launchAllowed
          ) || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r14_release_launch_bridge',
        'Release launch bridge aligned on GO path',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditReleaseLaunchBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return releaseLaunchBridgeAligned(report) && report.launchAllowed || JSON.stringify(report);
        },
      ],
      [
        'a19_r14_production_gate_ok',
        'Production gate allowed on full healthy stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityProductionGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityProductionAllowed(report) && report.operationsExportReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r14_production_gate_block',
        'Production gate blocked when launch NO-GO',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({
            turn: 5,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityProductionGate([pack], {
            memory: null,
            currentTurn: 5,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityProductionAllowed(report) && !report.operationsReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r14_launch_recovery_idle',
        'Launch recovery orchestrator idle when GO',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const params = {
            memory: mem,
            currentTurn: 1,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const launch = auditMatchExplainabilityLaunchGate([pack], params);
          const report = buildLaunchRecoveryOrchestrator([pack], params, matchExplainabilityLaunchAllowed(launch));
          return !report.launchBlocked && report.steps[0].includes('idle') || report.steps.join('|');
        },
      ],
      [
        'a19_r15_deployment_ready',
        'Deployment bundle ready when production and ops pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const deploy = buildMatchExplainabilityDeploymentBundle([pack], params);
          return matchExplainabilityDeploymentReady(deploy) && deploy.productionAllowed || JSON.stringify(deploy);
        },
      ],
      [
        'a19_r15_deployment_held',
        'Deployment bundle pending when trace fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 2, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const deploy = buildMatchExplainabilityDeploymentBundle([pack], {
            memory: null,
            currentTurn: 2,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityDeploymentReady(deploy) && !deploy.productionAllowed || JSON.stringify(deploy);
        },
      ],
      [
        'a19_r15_production_recovery',
        'Production recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 1, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildProductionRecoveryOrchestrator([pack], params);
          return report.productionBlocked && productionRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r15_ops_production_bridge',
        'Ops production bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditOperationsProductionBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return operationsProductionBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r15_deployment_export',
        'Deployment export shipped when deployment ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionDeploymentExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionDeploymentExportShipped(bundle) && bundle.deploymentSchema === 'agent19.deployment.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r15_fleet_gate_ok',
        'Fleet gate allowed on healthy deployment stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityFleetGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityFleetAllowed(report) && report.deploymentExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r15_fleet_gate_block',
        'Fleet gate denied when deployment pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 6, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityFleetGate([pack], {
            memory: null,
            currentTurn: 6,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityFleetAllowed(report) && !report.deploymentReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r16_sustainment_ready',
        'Sustainment bundle ready when fleet and deployment export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilitySustainmentBundle([pack], params);
          return matchExplainabilitySustainmentReady(bundle) && bundle.fleetAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r16_sustainment_held',
        'Sustainment bundle pending when fleet fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 7, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilitySustainmentBundle([pack], {
            memory: null,
            currentTurn: 7,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySustainmentReady(bundle) && !bundle.fleetAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r16_fleet_recovery',
        'Fleet recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 2, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 2, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildFleetRecoveryOrchestrator([pack], params);
          return report.fleetBlocked && fleetRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r16_fleet_sustainment_bridge',
        'Fleet sustainment bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditFleetSustainmentBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return fleetSustainmentBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r16_sustainment_export',
        'Sustainment export shipped when sustainment ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionSustainmentExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionSustainmentExportShipped(bundle) && bundle.sustainmentSchema === 'agent19.sustainment.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r16_orbit_gate_ok',
        'Orbit gate allowed on healthy sustainment stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityOrbitGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityOrbitAllowed(report) && report.sustainmentExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r16_orbit_gate_block',
        'Orbit gate denied when sustainment pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 8, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityOrbitGate([pack], {
            memory: null,
            currentTurn: 8,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityOrbitAllowed(report) && !report.sustainmentReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r17_transit_ready',
        'Transit bundle ready when orbit and sustainment export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityTransitBundle([pack], params);
          return matchExplainabilityTransitReady(bundle) && bundle.orbitAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r17_transit_held',
        'Transit bundle pending when orbit fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 9, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityTransitBundle([pack], {
            memory: null,
            currentTurn: 9,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityTransitReady(bundle) && !bundle.orbitAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r17_orbit_recovery',
        'Orbit recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 3, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 3, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildOrbitRecoveryOrchestrator([pack], params);
          return report.orbitBlocked && orbitRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r17_orbit_transit_bridge',
        'Orbit transit bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditOrbitTransitBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return orbitTransitBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r17_transit_export',
        'Transit export shipped when transit ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionTransitExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionTransitExportShipped(bundle) && bundle.transitSchema === 'agent19.transit.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r17_relay_gate_ok',
        'Relay gate allowed on healthy transit stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityRelayGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityRelayAllowed(report) && report.transitExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r17_relay_gate_block',
        'Relay gate denied when transit pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 10, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityRelayGate([pack], {
            memory: null,
            currentTurn: 10,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityRelayAllowed(report) && !report.transitReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r18_relay_ready',
        'Relay bundle ready when relay gate and transit export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityRelayBundle([pack], params);
          return matchExplainabilityRelayReady(bundle) && bundle.relayAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r18_relay_held',
        'Relay bundle pending when relay gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 11, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityRelayBundle([pack], {
            memory: null,
            currentTurn: 11,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityRelayReady(bundle) && !bundle.relayAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r18_relay_recovery',
        'Relay recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 4, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 4, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildRelayRecoveryOrchestrator([pack], params);
          return report.relayBlocked && relayRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r18_relay_transit_bridge',
        'Relay transit bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditRelayTransitBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return relayTransitBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r18_relay_export',
        'Relay export shipped when relay ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionRelayExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionRelayExportShipped(bundle) && bundle.relaySchema === 'agent19.relay.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r18_beacon_gate_ok',
        'Beacon gate allowed on healthy relay stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityBeaconGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityBeaconAllowed(report) && report.relayExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r18_beacon_gate_block',
        'Beacon gate denied when relay pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 12, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityBeaconGate([pack], {
            memory: null,
            currentTurn: 12,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityBeaconAllowed(report) && !report.relayReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r19_beacon_ready',
        'Beacon bundle ready when beacon gate and relay export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityBeaconBundle([pack], params);
          return matchExplainabilityBeaconReady(bundle) && bundle.beaconAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r19_beacon_held',
        'Beacon bundle pending when beacon gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 13, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityBeaconBundle([pack], {
            memory: null,
            currentTurn: 13,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityBeaconReady(bundle) && !bundle.beaconAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r19_beacon_recovery',
        'Beacon recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 5, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 5, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildBeaconRecoveryOrchestrator([pack], params);
          return report.beaconBlocked && beaconRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r19_relay_beacon_bridge',
        'Relay beacon bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditRelayBeaconBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return relayBeaconBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r19_beacon_export',
        'Beacon export shipped when beacon ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionBeaconExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionBeaconExportShipped(bundle) && bundle.beaconSchema === 'agent19.beacon.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r19_signal_gate_ok',
        'Signal gate allowed on healthy beacon stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilitySignalGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilitySignalAllowed(report) && report.beaconExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r19_signal_gate_block',
        'Signal gate denied when beacon pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 14, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilitySignalGate([pack], {
            memory: null,
            currentTurn: 14,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySignalAllowed(report) && !report.beaconReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r20_signal_ready',
        'Signal bundle ready when signal gate and beacon export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilitySignalBundle([pack], params);
          return matchExplainabilitySignalReady(bundle) && bundle.signalAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r20_signal_held',
        'Signal bundle pending when signal gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 15, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilitySignalBundle([pack], {
            memory: null,
            currentTurn: 15,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySignalReady(bundle) && !bundle.signalAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r20_signal_recovery',
        'Signal recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 6, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 6, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildSignalRecoveryOrchestrator([pack], params);
          return report.signalBlocked && signalRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r20_beacon_signal_bridge',
        'Beacon signal bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditBeaconSignalBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return beaconSignalBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r20_signal_export',
        'Signal export shipped when signal ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionSignalExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionSignalExportShipped(bundle) && bundle.signalSchema === 'agent19.signal.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r20_uplink_gate_ok',
        'Uplink gate allowed on healthy signal stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityUplinkGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityUplinkAllowed(report) && report.signalExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r20_uplink_gate_block',
        'Uplink gate denied when signal pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 16, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityUplinkGate([pack], {
            memory: null,
            currentTurn: 16,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityUplinkAllowed(report) && !report.signalReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r21_uplink_ready',
        'Uplink bundle ready when uplink gate and signal export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityUplinkBundle([pack], params);
          return matchExplainabilityUplinkReady(bundle) && bundle.uplinkAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r21_uplink_held',
        'Uplink bundle pending when uplink gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 17, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityUplinkBundle([pack], {
            memory: null,
            currentTurn: 17,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityUplinkReady(bundle) && !bundle.uplinkAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r21_uplink_recovery',
        'Uplink recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 7, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 7, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildUplinkRecoveryOrchestrator([pack], params);
          return report.uplinkBlocked && uplinkRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r21_signal_uplink_bridge',
        'Signal uplink bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditSignalUplinkBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return signalUplinkBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r21_uplink_export',
        'Uplink export shipped when uplink ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionUplinkExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionUplinkExportShipped(bundle) && bundle.uplinkSchema === 'agent19.uplink.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r21_handshake_gate_ok',
        'Handshake gate allowed on healthy uplink stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityHandshakeGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityHandshakeAllowed(report) && report.uplinkExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r21_handshake_gate_block',
        'Handshake gate denied when uplink pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 18, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityHandshakeGate([pack], {
            memory: null,
            currentTurn: 18,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityHandshakeAllowed(report) && !report.uplinkReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r22_handshake_ready',
        'Handshake bundle ready when handshake gate and uplink export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityHandshakeBundle([pack], params);
          return matchExplainabilityHandshakeReady(bundle) && bundle.handshakeAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r22_handshake_held',
        'Handshake bundle pending when handshake gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 19, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityHandshakeBundle([pack], {
            memory: null,
            currentTurn: 19,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityHandshakeReady(bundle) && !bundle.handshakeAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r22_handshake_recovery',
        'Handshake recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 8, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 8, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildHandshakeRecoveryOrchestrator([pack], params);
          return report.handshakeBlocked && handshakeRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r22_uplink_handshake_bridge',
        'Uplink handshake bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditUplinkHandshakeBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return uplinkHandshakeBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r22_handshake_export',
        'Handshake export shipped when handshake ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionHandshakeExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionHandshakeExportShipped(bundle) && bundle.handshakeSchema === 'agent19.handshake.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r22_ack_gate_ok',
        'Ack gate allowed on healthy handshake stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityAckGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityAckAllowed(report) && report.handshakeExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r22_ack_gate_block',
        'Ack gate denied when handshake pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 20, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityAckGate([pack], {
            memory: null,
            currentTurn: 20,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityAckAllowed(report) && !report.handshakeReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r23_ack_ready',
        'Ack bundle ready when ack gate and handshake export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityAckBundle([pack], params);
          return matchExplainabilityAckReady(bundle) && bundle.ackAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r23_ack_held',
        'Ack bundle pending when ack gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 21, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityAckBundle([pack], {
            memory: null,
            currentTurn: 21,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityAckReady(bundle) && !bundle.ackAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r23_ack_recovery',
        'Ack recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 9, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 9, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildAckRecoveryOrchestrator([pack], params);
          return report.ackBlocked && ackRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r23_handshake_ack_bridge',
        'Handshake ack bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditHandshakeAckBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return handshakeAckBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r23_ack_export',
        'Ack export shipped when ack ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionAckExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionAckExportShipped(bundle) && bundle.ackSchema === 'agent19.ack.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r23_confirm_gate_ok',
        'Confirm gate allowed on healthy ack stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityConfirmGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityConfirmAllowed(report) && report.ackExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r23_confirm_gate_block',
        'Confirm gate denied when ack pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 22, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityConfirmGate([pack], {
            memory: null,
            currentTurn: 22,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityConfirmAllowed(report) && !report.ackReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r24_confirm_ready',
        'Confirm bundle ready when confirm gate and ack export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityConfirmBundle([pack], params);
          return matchExplainabilityConfirmReady(bundle) && bundle.confirmAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r24_confirm_held',
        'Confirm bundle pending when confirm gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 23, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityConfirmBundle([pack], {
            memory: null,
            currentTurn: 23,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityConfirmReady(bundle) && !bundle.confirmAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r24_confirm_recovery',
        'Confirm recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 10, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 10, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildConfirmRecoveryOrchestrator([pack], params);
          return report.confirmBlocked && confirmRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r24_ack_confirm_bridge',
        'Ack confirm bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditAckConfirmBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return ackConfirmBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r24_confirm_export',
        'Confirm export shipped when confirm ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionConfirmExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionConfirmExportShipped(bundle) && bundle.confirmSchema === 'agent19.confirm.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r24_seal_gate_ok',
        'Seal gate allowed on healthy confirm stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilitySealGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilitySealAllowed(report) && report.confirmExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r24_seal_gate_block',
        'Seal gate denied when confirm pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 24, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilitySealGate([pack], {
            memory: null,
            currentTurn: 24,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySealAllowed(report) && !report.confirmReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r25_seal_ready',
        'Seal bundle ready when seal gate and confirm export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilitySealBundle([pack], params);
          return matchExplainabilitySealReady(bundle) && bundle.sealAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r25_seal_held',
        'Seal bundle pending when seal gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 25, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilitySealBundle([pack], {
            memory: null,
            currentTurn: 25,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySealReady(bundle) && !bundle.sealAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r25_seal_recovery',
        'Seal recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 11, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 11, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildSealRecoveryOrchestrator([pack], params);
          return report.sealBlocked && sealRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r25_confirm_seal_bridge',
        'Confirm seal bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditConfirmSealBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return confirmSealBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r25_seal_export',
        'Seal export shipped when seal ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionSealExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionSealExportShipped(bundle) && bundle.sealSchema === 'agent19.seal.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r25_covenant_gate_ok',
        'Covenant gate allowed on healthy seal stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityCovenantGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityCovenantAllowed(report) && report.sealExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r25_covenant_gate_block',
        'Covenant gate denied when seal pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 26, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityCovenantGate([pack], {
            memory: null,
            currentTurn: 26,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityCovenantAllowed(report) && !report.sealReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r26_covenant_ready',
        'Covenant bundle ready when covenant gate and seal export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityCovenantBundle([pack], params);
          return matchExplainabilityCovenantReady(bundle) && bundle.covenantAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r26_covenant_held',
        'Covenant bundle pending when covenant gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 27, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityCovenantBundle([pack], {
            memory: null,
            currentTurn: 27,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityCovenantReady(bundle) && !bundle.covenantAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r26_covenant_recovery',
        'Covenant recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 12, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 12, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildCovenantRecoveryOrchestrator([pack], params);
          return report.covenantBlocked && covenantRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r26_seal_covenant_bridge',
        'Seal covenant bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditSealCovenantBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sealCovenantBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r26_covenant_export',
        'Covenant export shipped when covenant ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionCovenantExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionCovenantExportShipped(bundle) && bundle.covenantSchema === 'agent19.covenant.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r26_charter_gate_ok',
        'Charter gate allowed on healthy covenant stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityCharterGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityCharterAllowed(report) && report.covenantExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r26_charter_gate_block',
        'Charter gate denied when covenant pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 28, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityCharterGate([pack], {
            memory: null,
            currentTurn: 28,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityCharterAllowed(report) && !report.covenantReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r27_charter_ready',
        'Charter bundle ready when charter gate and covenant export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityCharterBundle([pack], params);
          return matchExplainabilityCharterReady(bundle) && bundle.charterAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r27_charter_held',
        'Charter bundle pending when charter gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 29, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityCharterBundle([pack], {
            memory: null,
            currentTurn: 29,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityCharterReady(bundle) && !bundle.charterAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r27_charter_recovery',
        'Charter recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 13, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 13, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildCharterRecoveryOrchestrator([pack], params);
          return report.charterBlocked && charterRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r27_covenant_charter_bridge',
        'Covenant charter bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditCovenantCharterBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return covenantCharterBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r27_charter_export',
        'Charter export shipped when charter ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionCharterExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionCharterExportShipped(bundle) && bundle.charterSchema === 'agent19.charter.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r27_pact_gate_ok',
        'Pact gate allowed on healthy charter stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityPactGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityPactAllowed(report) && report.charterExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r27_pact_gate_block',
        'Pact gate denied when charter pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 30, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityPactGate([pack], {
            memory: null,
            currentTurn: 30,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityPactAllowed(report) && !report.charterReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r28_pact_ready',
        'Pact bundle ready when pact gate and charter export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityPactBundle([pack], params);
          return matchExplainabilityPactReady(bundle) && bundle.pactAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r28_pact_held',
        'Pact bundle pending when pact gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 31, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityPactBundle([pack], {
            memory: null,
            currentTurn: 31,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityPactReady(bundle) && !bundle.pactAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r28_pact_recovery',
        'Pact recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 14, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 14, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildPactRecoveryOrchestrator([pack], params);
          return report.pactBlocked && pactRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r28_charter_pact_bridge',
        'Charter pact bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditCharterPactBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return charterPactBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r28_pact_export',
        'Pact export shipped when pact ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionPactExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionPactExportShipped(bundle) && bundle.pactSchema === 'agent19.pact.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r28_treaty_gate_ok',
        'Treaty gate allowed on healthy pact stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityTreatyGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityTreatyAllowed(report) && report.pactExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r28_treaty_gate_block',
        'Treaty gate denied when pact pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 32, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityTreatyGate([pack], {
            memory: null,
            currentTurn: 32,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityTreatyAllowed(report) && !report.pactReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r29_treaty_ready',
        'Treaty bundle ready when treaty gate and pact export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityTreatyBundle([pack], params);
          return matchExplainabilityTreatyReady(bundle) && bundle.treatyAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r29_treaty_held',
        'Treaty bundle pending when treaty gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 33, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityTreatyBundle([pack], {
            memory: null,
            currentTurn: 33,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityTreatyReady(bundle) && !bundle.treatyAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r29_treaty_recovery',
        'Treaty recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 15, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 15, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildTreatyRecoveryOrchestrator([pack], params);
          return report.treatyBlocked && treatyRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r29_pact_treaty_bridge',
        'Pact treaty bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditPactTreatyBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return pactTreatyBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r29_treaty_export',
        'Treaty export shipped when treaty ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionTreatyExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionTreatyExportShipped(bundle) && bundle.treatySchema === 'agent19.treaty.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r29_accord_gate_ok',
        'Accord gate allowed on healthy treaty stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityAccordGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityAccordAllowed(report) && report.treatyExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r29_accord_gate_block',
        'Accord gate denied when treaty pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 34, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityAccordGate([pack], {
            memory: null,
            currentTurn: 34,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityAccordAllowed(report) && !report.treatyReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r30_accord_ready',
        'Accord bundle ready when accord gate and treaty export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityAccordBundle([pack], params);
          return matchExplainabilityAccordReady(bundle) && bundle.accordAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r30_accord_held',
        'Accord bundle pending when accord gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 35, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityAccordBundle([pack], {
            memory: null,
            currentTurn: 35,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityAccordReady(bundle) && !bundle.accordAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r30_accord_recovery',
        'Accord recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 16, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 16, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildAccordRecoveryOrchestrator([pack], params);
          return report.accordBlocked && accordRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r30_treaty_accord_bridge',
        'Treaty accord bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditTreatyAccordBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return treatyAccordBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r30_accord_export',
        'Accord export shipped when accord ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionAccordExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionAccordExportShipped(bundle) && bundle.accordSchema === 'agent19.accord.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r30_league_gate_ok',
        'League gate allowed on healthy accord stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityLeagueGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityLeagueAllowed(report) && report.accordExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r30_league_gate_block',
        'League gate denied when accord pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 36, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityLeagueGate([pack], {
            memory: null,
            currentTurn: 36,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityLeagueAllowed(report) && !report.accordReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r31_league_ready',
        'League bundle ready when league gate and accord export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityLeagueBundle([pack], params);
          return matchExplainabilityLeagueReady(bundle) && bundle.leagueAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r31_league_held',
        'League bundle pending when league gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 37, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityLeagueBundle([pack], {
            memory: null,
            currentTurn: 37,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityLeagueReady(bundle) && !bundle.leagueAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r31_league_recovery',
        'League recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 17, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 17, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildLeagueRecoveryOrchestrator([pack], params);
          return report.leagueBlocked && leagueRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r31_accord_league_bridge',
        'Accord league bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditAccordLeagueBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return accordLeagueBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r31_league_export',
        'League export shipped when league ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionLeagueExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionLeagueExportShipped(bundle) && bundle.leagueSchema === 'agent19.league.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r31_federation_gate_ok',
        'Federation gate allowed on healthy league stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityFederationGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityFederationAllowed(report) && report.leagueExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r31_federation_gate_block',
        'Federation gate denied when league pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 38, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityFederationGate([pack], {
            memory: null,
            currentTurn: 38,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityFederationAllowed(report) && !report.leagueReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r32_federation_ready',
        'Federation bundle ready when federation gate and league export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityFederationBundle([pack], params);
          return matchExplainabilityFederationReady(bundle) && bundle.federationAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r32_federation_held',
        'Federation bundle pending when federation gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 39, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityFederationBundle([pack], {
            memory: null,
            currentTurn: 39,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityFederationReady(bundle) && !bundle.federationAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r32_federation_recovery',
        'Federation recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 18, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 18, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildFederationRecoveryOrchestrator([pack], params);
          return report.federationBlocked && federationRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r32_league_federation_bridge',
        'League federation bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditLeagueFederationBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return leagueFederationBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r32_federation_export',
        'Federation export shipped when federation ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionFederationExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionFederationExportShipped(bundle) && bundle.federationSchema === 'agent19.federation.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r32_union_gate_ok',
        'Union gate allowed on healthy federation stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityUnionGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityUnionAllowed(report) && report.federationExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r32_union_gate_block',
        'Union gate denied when federation pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 40, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityUnionGate([pack], {
            memory: null,
            currentTurn: 40,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityUnionAllowed(report) && !report.federationReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r33_union_ready',
        'Union bundle ready when union gate and federation export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityUnionBundle([pack], params);
          return matchExplainabilityUnionReady(bundle) && bundle.unionAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r33_union_held',
        'Union bundle pending when union gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 41, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityUnionBundle([pack], {
            memory: null,
            currentTurn: 41,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityUnionReady(bundle) && !bundle.unionAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r33_union_recovery',
        'Union recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 19, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 19, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildUnionRecoveryOrchestrator([pack], params);
          return report.unionBlocked && unionRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r33_federation_union_bridge',
        'Federation union bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditFederationUnionBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return federationUnionBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r33_union_export',
        'Union export shipped when union ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionUnionExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionUnionExportShipped(bundle) && bundle.unionSchema === 'agent19.union.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r33_commonwealth_gate_ok',
        'Commonwealth gate allowed on healthy union stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityCommonwealthGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityCommonwealthAllowed(report) && report.unionExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r33_commonwealth_gate_block',
        'Commonwealth gate denied when union pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 42, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityCommonwealthGate([pack], {
            memory: null,
            currentTurn: 42,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityCommonwealthAllowed(report) && !report.unionReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r34_commonwealth_ready',
        'Commonwealth bundle ready when commonwealth gate and union export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityCommonwealthBundle([pack], params);
          return matchExplainabilityCommonwealthReady(bundle) && bundle.commonwealthAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r34_commonwealth_held',
        'Commonwealth bundle pending when commonwealth gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 43, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityCommonwealthBundle([pack], {
            memory: null,
            currentTurn: 43,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityCommonwealthReady(bundle) && !bundle.commonwealthAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r34_commonwealth_recovery',
        'Commonwealth recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 20, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 20, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildCommonwealthRecoveryOrchestrator([pack], params);
          return report.commonwealthBlocked && commonwealthRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r34_union_commonwealth_bridge',
        'Union commonwealth bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditUnionCommonwealthBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return unionCommonwealthBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r34_commonwealth_export',
        'Commonwealth export shipped when commonwealth ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionCommonwealthExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionCommonwealthExportShipped(bundle) && bundle.commonwealthSchema === 'agent19.commonwealth.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r34_realm_gate_ok',
        'Realm gate allowed on healthy commonwealth stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityRealmGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityRealmAllowed(report) && report.commonwealthExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r34_realm_gate_block',
        'Realm gate denied when commonwealth pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 44, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityRealmGate([pack], {
            memory: null,
            currentTurn: 44,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityRealmAllowed(report) && !report.commonwealthReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r35_realm_ready',
        'Realm bundle ready when realm gate and commonwealth export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityRealmBundle([pack], params);
          return matchExplainabilityRealmReady(bundle) && bundle.realmAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r35_realm_held',
        'Realm bundle pending when realm gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 45, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityRealmBundle([pack], {
            memory: null,
            currentTurn: 45,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityRealmReady(bundle) && !bundle.realmAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r35_realm_recovery',
        'Realm recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 21, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 21, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildRealmRecoveryOrchestrator([pack], params);
          return report.realmBlocked && realmRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r35_commonwealth_realm_bridge',
        'Commonwealth realm bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditCommonwealthRealmBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return commonwealthRealmBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r35_realm_export',
        'Realm export shipped when realm ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionRealmExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionRealmExportShipped(bundle) && bundle.realmSchema === 'agent19.realm.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r35_sovereign_gate_ok',
        'Sovereign gate allowed on healthy realm stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilitySovereignGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilitySovereignAllowed(report) && report.realmExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r35_sovereign_gate_block',
        'Sovereign gate denied when realm pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 46, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilitySovereignGate([pack], {
            memory: null,
            currentTurn: 46,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySovereignAllowed(report) && !report.realmReady || JSON.stringify(report);
        },
      ],
    ]),
  };
}

/** Compare modular horizon builder to canonical V9.4 export (parity gate). */
export function runAgent19CanonicalParityTests(
  canonical: {
    buildAiMemoryHorizonSnapshot: typeof buildAiMemoryHorizonSnapshot;
    createFreshAiMemories: (ids: string[]) => Record<string, import('../types.ts').AiActorMemory>;
    applyPriorsToFreshMemories: (m: Record<string, import('../types.ts').AiActorMemory>, priors: Record<string, unknown>) => Record<string, import('../types.ts').AiActorMemory>;
    profileToPriorSeed: (profile: unknown, subjectId: string) => unknown;
    HUMAN_PROFILE_ID: string;
  },
): { results: MemoryEvalResult[] } {
  return {
    results: runCases([
      [
        'a19_parity_empty',
        'Modular horizon matches canonical for empty memory',
        () => {
          const mod = buildAiMemoryHorizonSnapshot(null);
          const can = canonical.buildAiMemoryHorizonSnapshot(null);
          return JSON.stringify(mod) === JSON.stringify(can) || `mod ${JSON.stringify(mod)} can ${JSON.stringify(can)}`;
        },
      ],
      [
        'a19_parity_prior',
        'Modular horizon matches canonical with persistent priors',
        () => {
          let m = canonical.createFreshAiMemories(['ai']);
          m = canonical.applyPriorsToFreshMemories(m, {
            ai: canonical.profileToPriorSeed(
              {
                profileId: 'p',
                actorId: 'ai',
                rivalIdentityId: 'r',
                subjectProfileId: canonical.HUMAN_PROFILE_ID,
                matchesObserved: 2,
                wins: 1,
                losses: 1,
                draws: 0,
                observationCount: 4,
                confidence: 0.5,
                aggressionPreference: 0.7,
                expansionPreference: 0.3,
                economicPreference: 0.25,
                cooperationPreference: 0.25,
                strategicTendencies: {},
                relationshipHistory: { trust: 50, respect: 50, rivalry: 0, reliability: 50, cooperation: 50 },
                notableMemories: [],
                preferredTeamCoordination: [],
                committedMatchIds: [],
                lastUpdatedAt: 0,
              },
              'player',
            ),
          });
          const mod = buildAiMemoryHorizonSnapshot(m.ai, { persistentMemoryEnabled: true });
          const can = canonical.buildAiMemoryHorizonSnapshot(m.ai, { persistentMemoryEnabled: true });
          return JSON.stringify(mod) === JSON.stringify(can) || JSON.stringify({ mod, can });
        },
      ],
    ]),
  };
}

export function runAgent19MemoryEvalSuite(canonical?: Parameters<typeof runAgent19CanonicalParityTests>[0]): {
  results: MemoryEvalResult[];
  passed: number;
  failed: number;
} {
  const module = runAgent19ModuleSelfTests().results;
  const parity = canonical ? runAgent19CanonicalParityTests(canonical).results : [];
  const results = [...module, ...parity];
  const passed = results.filter(r => r.passed).length;
  return { results, passed, failed: results.length - passed };
}
