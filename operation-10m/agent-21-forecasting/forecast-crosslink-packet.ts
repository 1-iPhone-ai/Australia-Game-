/**
 * Agent 21 — cross-agent dashboard handoff packet (Agent 22/23, read-only round 7).
 */

import { assembleAg21PlayerForecastBrief } from './forecast-player-brief';
import { collectAg21LabTelemetry } from './forecast-lab-telemetry';
import { resolveAg21SurfaceDecision } from './forecast-surface-decision';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21CrosslinkPacket {
  packetId: string;
  headline: string;
  dashboardTags: string[];
  surfaceDecision: ReturnType<typeof resolveAg21SurfaceDecision>['decision'];
  telemetryHealth: ReturnType<typeof collectAg21LabTelemetry>['telemetryHealth'];
  readinessScore: number;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21PacketId(ctx: Ag21ForecastContext): string {
  return `ag21_xlink_${ctx.turn}_${ctx.seed}`;
}

/** Build a compact handoff packet for evolving UI / dashboard modules. */
export function buildAg21CrosslinkPacket(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21CrosslinkPacket {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.81),
      actorDebt: baseCtx.actorDebt + 100
    } satisfies Ag21ForecastContext);

  const brief = assembleAg21PlayerForecastBrief(baseCtx, candidate);
  const telemetry = collectAg21LabTelemetry(baseCtx, candidate);
  const decision = resolveAg21SurfaceDecision(baseCtx, candidate);

  const dashboardTags = [
    `tier:${brief.surfacingTier}`,
    `decision:${decision.decision}`,
    `health:${telemetry.telemetryHealth}`,
    `convergence:${brief.convergenceTone}`
  ];

  return {
    packetId: ag21PacketId(baseCtx),
    headline: brief.headline,
    dashboardTags,
    surfaceDecision: decision.decision,
    telemetryHealth: telemetry.telemetryHealth,
    readinessScore: brief.readinessScore,
    disclaimer: '(Non-authoritative forecast.) Crosslink packet for dashboard wiring only.',
    overallUncertainty: ag21LabelUncertainty(telemetry.overallUncertainty.band, [
      ...telemetry.overallUncertainty.factors,
      `packet=${ag21PacketId(baseCtx)}`
    ]),
    authoritative: false
  };
}

export function runAg21CrosslinkPacketSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 14, seed: 27, actorCash: 1010, actorDebt: 85, regionsControlled: 3 };
  const packet = buildAg21CrosslinkPacket(ctx);

  push('xlink_id', packet.packetId.startsWith('ag21_xlink_'), packet.packetId);
  push('xlink_tags', packet.dashboardTags.length === 4, String(packet.dashboardTags.length));
  push('xlink_disclaimer', packet.disclaimer.includes('Non-authoritative'), packet.disclaimer.slice(0, 40));
  push('xlink_non_auth', packet.authoritative === false, packet.headline.slice(0, 30));

  return out;
}
