/**
 * Agent 21 — crosslink packet validation against telemetry (read-only round 8).
 */

import { buildAg21CrosslinkPacket } from './forecast-crosslink-packet';
import { collectAg21LabTelemetry } from './forecast-lab-telemetry';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21PacketValidationStatus = 'aligned' | 'drift' | 'blocked';

export interface Ag21PacketValidationReport {
  status: Ag21PacketValidationStatus;
  mismatchCount: number;
  mismatches: string[];
  packetId: string;
  telemetryHealth: ReturnType<typeof collectAg21LabTelemetry>['telemetryHealth'];
  surfaceDecision: ReturnType<typeof collectAg21LabTelemetry>['surfaceDecision'];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21TagValue(tags: string[], prefix: string): string | undefined {
  const hit = tags.find(t => t.startsWith(`${prefix}:`));
  return hit?.slice(prefix.length + 1);
}

/** Validate dashboard crosslink tags against live telemetry + surface decision. */
export function validateAg21CrosslinkHandoff(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21PacketValidationReport {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.83),
      actorDebt: baseCtx.actorDebt + 120
    } satisfies Ag21ForecastContext);

  const packet = buildAg21CrosslinkPacket(baseCtx, candidate);
  const telemetry = collectAg21LabTelemetry(baseCtx, candidate);

  const mismatches: string[] = [];
  const tagDecision = ag21TagValue(packet.dashboardTags, 'decision');
  const tagHealth = ag21TagValue(packet.dashboardTags, 'health');

  if (tagDecision !== telemetry.surfaceDecision) {
    mismatches.push(`decision tag ${tagDecision} vs telemetry ${telemetry.surfaceDecision}`);
  }
  if (tagHealth !== telemetry.telemetryHealth) {
    mismatches.push(`health tag ${tagHealth} vs telemetry ${telemetry.telemetryHealth}`);
  }
  if (packet.surfaceDecision !== telemetry.surfaceDecision) {
    mismatches.push(`packet decision ${packet.surfaceDecision} vs telemetry ${telemetry.surfaceDecision}`);
  }
  if (packet.telemetryHealth !== telemetry.telemetryHealth) {
    mismatches.push(`packet health ${packet.telemetryHealth} vs telemetry ${telemetry.telemetryHealth}`);
  }

  let status: Ag21PacketValidationStatus = 'aligned';
  if (telemetry.surfaceDecision === 'suppress' || telemetry.telemetryHealth === 'critical') {
    status = mismatches.length > 0 ? 'blocked' : 'aligned';
  } else if (mismatches.length > 0) {
    status = 'drift';
  }

  return {
    status,
    mismatchCount: mismatches.length,
    mismatches,
    packetId: packet.packetId,
    telemetryHealth: telemetry.telemetryHealth,
    surfaceDecision: telemetry.surfaceDecision,
    disclaimer: '(Non-authoritative forecast.) Packet validation for dashboard wiring only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'moderate' : 'high',
      [`validation=${status}`, `mismatches=${mismatches.length}`]
    ),
    authoritative: false
  };
}

export function runAg21PacketValidationSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 16, seed: 33, actorCash: 990, actorDebt: 95, regionsControlled: 3 };
  const report = validateAg21CrosslinkHandoff(ctx);

  push('validation_status', ['aligned', 'drift', 'blocked'].includes(report.status), report.status);
  push('validation_id', report.packetId.startsWith('ag21_xlink_'), report.packetId);
  push('validation_mismatch_nonneg', report.mismatchCount >= 0, String(report.mismatchCount));
  push('validation_non_auth', report.authoritative === false, report.disclaimer.slice(0, 30));

  return out;
}
