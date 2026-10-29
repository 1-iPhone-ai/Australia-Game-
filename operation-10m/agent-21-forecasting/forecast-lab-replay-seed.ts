/**
 * Agent 21 — deterministic replay seed bundle for history modules (read-only round 8).
 */

import { validateAg21CrosslinkHandoff } from './forecast-packet-validation';
import { resolveAg21OperatorEscalation } from './forecast-operator-escalation';
import { buildAg21CrosslinkPacket } from './forecast-crosslink-packet';
import { collectAg21LabTelemetry } from './forecast-lab-telemetry';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21LabReplaySeed {
  seedId: string;
  turn: number;
  labSeed: number;
  packetId: string;
  validationStatus: ReturnType<typeof validateAg21CrosslinkHandoff>['status'];
  escalationTier: ReturnType<typeof resolveAg21OperatorEscalation>['tier'];
  telemetryHealth: ReturnType<typeof collectAg21LabTelemetry>['telemetryHealth'];
  fingerprint: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21ReplayFingerprint(ctx: Ag21ForecastContext, packetId: string, tier: Ag21LabReplaySeed['escalationTier']): string {
  return `ag21_replay_${ctx.turn}_${ctx.seed}_${packetId.split('_').pop()}_${tier}`;
}

/** Build a compact replay seed for Agent 24 history wiring (non-authoritative). */
export function buildAg21LabReplaySeed(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabReplaySeed {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.82),
      actorDebt: baseCtx.actorDebt + 110
    } satisfies Ag21ForecastContext);

  const packet = buildAg21CrosslinkPacket(baseCtx, candidate);
  const validation = validateAg21CrosslinkHandoff(baseCtx, candidate);
  const escalation = resolveAg21OperatorEscalation(baseCtx, candidate);
  const telemetry = collectAg21LabTelemetry(baseCtx, candidate);

  const seedId = `ag21_lab_seed_${baseCtx.turn}_${baseCtx.seed}`;

  return {
    seedId,
    turn: baseCtx.turn,
    labSeed: baseCtx.seed,
    packetId: packet.packetId,
    validationStatus: validation.status,
    escalationTier: escalation.tier,
    telemetryHealth: telemetry.telemetryHealth,
    fingerprint: ag21ReplayFingerprint(baseCtx, packet.packetId, escalation.tier),
    disclaimer: '(Non-authoritative forecast.) Replay seed for history modules only.',
    overallUncertainty: ag21LabelUncertainty(
      escalation.tier === 'incident' ? 'high' : escalation.tier === 'none' ? 'low' : 'moderate',
      [`replay=${seedId}`, `health=${telemetry.telemetryHealth}`]
    ),
    authoritative: false
  };
}

export function runAg21LabReplaySeedSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 19, seed: 8, actorCash: 1120, actorDebt: 70, regionsControlled: 4 };
  const replay = buildAg21LabReplaySeed(ctx);

  push('replay_seed_id', replay.seedId.startsWith('ag21_lab_seed_'), replay.seedId);
  push('replay_fingerprint', replay.fingerprint.startsWith('ag21_replay_'), replay.fingerprint);
  push('replay_packet', replay.packetId.startsWith('ag21_xlink_'), replay.packetId);
  push('replay_non_auth', replay.authoritative === false, replay.disclaimer.slice(0, 30));

  return out;
}
