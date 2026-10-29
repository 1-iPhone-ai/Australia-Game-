/**
 * Agent 21 — pre-assembly staging packet for wave dry-runs (read-only round 10).
 */

import { buildAg21OperatorSignoffRecord } from './forecast-operator-signoff';
import { evaluateAg21HandoffReadiness } from './forecast-handoff-readiness';
import { buildAg21LabIntegrationHandoff } from './forecast-lab-integration-handoff';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21LabStagingPhase = 'draft' | 'staged' | 'rejected';

export interface Ag21LabStagingPacket {
  packetId: string;
  phase: Ag21LabStagingPhase;
  moduleVersion: string;
  handoffId: string;
  signoffId: string;
  stagingTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21StagingPhase(
  readiness: ReturnType<typeof evaluateAg21HandoffReadiness>['status'],
  mayStage: boolean
): Ag21LabStagingPhase {
  if (readiness === 'blocked') return 'rejected';
  if (mayStage && readiness === 'ready') return 'staged';
  return 'draft';
}

/** Build staging packet wrapping handoff + signoff for Agent 25 dry-run wiring. */
export function buildAg21LabStagingPacket(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabStagingPacket {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.76),
      actorDebt: baseCtx.actorDebt + 185
    } satisfies Ag21ForecastContext);

  const handoff = buildAg21LabIntegrationHandoff(baseCtx, candidate);
  const readiness = evaluateAg21HandoffReadiness(baseCtx, candidate);
  const signoff = buildAg21OperatorSignoffRecord(baseCtx, candidate);
  const phase = ag21StagingPhase(readiness.status, signoff.mayStage);

  const packetId = `ag21_stage_${baseCtx.turn}_${baseCtx.seed}_${phase}`;

  const stagingTags = [
    `phase:${phase}`,
    `readiness:${readiness.status}`,
    `signoff:${signoff.signoffId}`,
    `handoff:${handoff.handoffId}`,
    `version:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    packetId,
    phase,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    handoffId: handoff.handoffId,
    signoffId: signoff.signoffId,
    stagingTags,
    disclaimer: '(Non-authoritative forecast.) Staging packet for Operation 10M dry-run only.',
    overallUncertainty: ag21LabelUncertainty(
      phase === 'staged' ? 'low' : phase === 'rejected' ? 'high' : 'moderate',
      [`packet=${packetId}`, `phase=${phase}`]
    ),
    authoritative: false
  };
}

export function runAg21LabStagingPacketSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 24, seed: 17, actorCash: 1180, actorDebt: 62, regionsControlled: 4 };
  const packet = buildAg21LabStagingPacket(ctx);

  push('staging_packet_id', packet.packetId.startsWith('ag21_stage_'), packet.packetId);
  push('staging_phase', ['draft', 'staged', 'rejected'].includes(packet.phase), packet.phase);
  push('staging_tags', packet.stagingTags.length >= 5, String(packet.stagingTags.length));
  push('staging_non_auth', packet.authoritative === false, packet.disclaimer.slice(0, 28));

  return out;
}
