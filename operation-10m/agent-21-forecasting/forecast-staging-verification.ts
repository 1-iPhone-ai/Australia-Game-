/**
 * Agent 21 — staging packet integrity vs handoff + signoff (read-only round 11).
 */

import { buildAg21LabStagingPacket } from './forecast-lab-staging-packet';
import { buildAg21OperatorSignoffRecord } from './forecast-operator-signoff';
import { buildAg21LabIntegrationHandoff } from './forecast-lab-integration-handoff';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21StagingVerificationStatus = 'verified' | 'warning' | 'failed';

export interface Ag21StagingVerificationReport {
  status: Ag21StagingVerificationStatus;
  findings: string[];
  stagingPacketId: string;
  stagingPhase: ReturnType<typeof buildAg21LabStagingPacket>['phase'];
  signoffMayStage: boolean;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21TagValue(tags: string[], prefix: string): string | undefined {
  const hit = tags.find(t => t.startsWith(`${prefix}:`));
  return hit?.slice(prefix.length + 1);
}

/** Verify staging packet tags align with live handoff and signoff records (round 11). */
export function verifyAg21StagingIntegrity(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21StagingVerificationReport {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.75),
      actorDebt: baseCtx.actorDebt + 195
    } satisfies Ag21ForecastContext);

  const staging = buildAg21LabStagingPacket(baseCtx, candidate);
  const handoff = buildAg21LabIntegrationHandoff(baseCtx, candidate);
  const signoff = buildAg21OperatorSignoffRecord(baseCtx, candidate);

  const findings: string[] = [];
  const tagHandoff = ag21TagValue(staging.stagingTags, 'handoff');
  const tagSignoff = ag21TagValue(staging.stagingTags, 'signoff');

  if (tagHandoff !== handoff.handoffId) {
    findings.push(`handoff tag mismatch ${tagHandoff} vs ${handoff.handoffId}`);
  }
  if (tagSignoff !== signoff.signoffId) {
    findings.push(`signoff tag mismatch ${tagSignoff} vs ${signoff.signoffId}`);
  }
  if (staging.handoffId !== handoff.handoffId) {
    findings.push('staging handoffId diverges from integration handoff');
  }
  if (staging.signoffId !== signoff.signoffId) {
    findings.push('staging signoffId diverges from signoff record');
  }
  if (staging.phase === 'staged' && !signoff.mayStage) {
    findings.push('staged phase but signoff mayStage false');
  }

  let status: Ag21StagingVerificationStatus = 'verified';
  if (findings.length >= 2 || staging.phase === 'rejected') status = 'failed';
  else if (findings.length === 1 || staging.phase === 'draft') status = 'warning';

  return {
    status,
    findings,
    stagingPacketId: staging.packetId,
    stagingPhase: staging.phase,
    signoffMayStage: signoff.mayStage,
    disclaimer: '(Non-authoritative forecast.) Staging verification for modular dry-run only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'verified' ? 'low' : status === 'warning' ? 'moderate' : 'high',
      [`verify=${status}`, `findings=${findings.length}`]
    ),
    authoritative: false
  };
}

export function runAg21StagingVerificationSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 18, seed: 55, actorCash: 990, actorDebt: 105, regionsControlled: 3 };
  const report = verifyAg21StagingIntegrity(ctx);

  push('verify_status', ['verified', 'warning', 'failed'].includes(report.status), report.status);
  push('verify_packet', report.stagingPacketId.startsWith('ag21_stage_'), report.stagingPacketId);
  push('verify_findings', Array.isArray(report.findings), String(report.findings.length));
  push('verify_non_auth', report.authoritative === false, report.disclaimer.slice(0, 28));

  return out;
}
