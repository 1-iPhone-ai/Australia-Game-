/**
 * Agent 21 — archive audit trail from seal through confirmation (read-only round 13).
 */

import { confirmAg21ExportManifest } from './forecast-manifest-confirmation';
import { sealAg21LabArchiveRecord } from './forecast-lab-archive-seal';
import { attestAg21LabCloseout } from './forecast-closeout-attestation';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21ArchiveAuditEvent {
  seq: number;
  kind: string;
  refId: string;
}

export interface Ag21ArchiveAuditTrail {
  trailId: string;
  eventCount: number;
  events: Ag21ArchiveAuditEvent[];
  confirmationStatus: ReturnType<typeof confirmAg21ExportManifest>['status'];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Build ordered audit trail for archive lifecycle (round 13). */
export function buildAg21ArchiveAuditTrail(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ArchiveAuditTrail {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.68),
      actorDebt: baseCtx.actorDebt + 265
    } satisfies Ag21ForecastContext);

  const attestation = attestAg21LabCloseout(baseCtx, candidate);
  const seal = sealAg21LabArchiveRecord(baseCtx, candidate);
  const confirmation = confirmAg21ExportManifest(baseCtx, candidate);

  const events: Ag21ArchiveAuditEvent[] = [
    { seq: 1, kind: 'attestation', refId: attestation.attestationId },
    { seq: 2, kind: 'archive_seal', refId: seal.sealId },
    { seq: 3, kind: 'manifest_confirm', refId: confirmation.manifestId }
  ];

  const trailId = `ag21_audit_${baseCtx.turn}_${baseCtx.seed}_${confirmation.status}`;

  return {
    trailId,
    eventCount: events.length,
    events,
    confirmationStatus: confirmation.status,
    disclaimer: '(Non-authoritative forecast.) Archive audit trail for operator review only.',
    overallUncertainty: ag21LabelUncertainty(
      confirmation.status === 'confirmed' ? 'low' : 'moderate',
      [`trail=${trailId}`, `events=${events.length}`]
    ),
    authoritative: false
  };
}

export function runAg21ArchiveAuditTrailSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 21, seed: 14, actorCash: 1100, actorDebt: 75, regionsControlled: 4 };
  const trail = buildAg21ArchiveAuditTrail(ctx);

  push('audit_trail_id', trail.trailId.startsWith('ag21_audit_'), trail.trailId);
  push('audit_events', trail.eventCount === 3 && trail.events.every((e, i) => e.seq === i + 1), String(trail.eventCount));
  push('audit_confirm', ['confirmed', 'pending', 'revoked'].includes(trail.confirmationStatus), trail.confirmationStatus);
  push('audit_non_auth', trail.authoritative === false, trail.disclaimer.slice(0, 28));

  return out;
}
