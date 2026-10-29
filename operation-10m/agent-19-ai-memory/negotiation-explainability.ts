import type { AiRelationship } from './types.ts';

const memNum = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

/** Negotiation: trust/gratitude lower the acceptance bar, grievance raises it; a shared threat helps. */
export function computeNegotiationThresholdShift(
  rel: Partial<AiRelationship> | null | undefined,
  ctx: { dealAffordable?: boolean; thirdPartyThreat?: number },
): { shift: number; reasons: string[] } {
  const reasons: string[] = [];
  let shift = 0;
  if (rel) {
    const trust = memNum(rel.trust, 50);
    const grievance = memNum(rel.grievance);
    const gratitude = memNum(rel.gratitude);
    if (trust > 60) {
      shift -= (trust - 60) / 400;
      reasons.push('trusts this counterpart');
    }
    if (trust < 40) {
      shift += (40 - trust) / 400;
      reasons.push('distrusts this counterpart');
    }
    if (grievance > 10) {
      shift += Math.min(0.1, grievance / 300);
      reasons.push('holds a grievance');
    }
    if (gratitude > 10) {
      shift -= Math.min(0.08, gratitude / 400);
      reasons.push('is grateful for past help');
    }
  }
  if (memNum(ctx.thirdPartyThreat) > 40 && ctx.dealAffordable) {
    shift -= 0.04;
    reasons.push('a common threat makes a deal attractive');
  }
  return {
    shift: Math.max(-0.2, Math.min(0.2, Math.round(shift * 1000) / 1000)),
    reasons,
  };
}

export function formatNegotiationExplainability(
  rel: Partial<AiRelationship> | null | undefined,
  ctx: { dealAffordable?: boolean; thirdPartyThreat?: number; counterpartLabel?: string },
): string[] {
  const { shift, reasons } = computeNegotiationThresholdShift(rel, ctx);
  const who = ctx.counterpartLabel || rel?.actorId || 'this counterpart';
  const lines = [
    `Memory adjusts the deal acceptance threshold by ${shift >= 0 ? '+' : ''}${shift.toFixed(3)} for ${who}.`,
  ];
  if (reasons.length) {
    lines.push(`Factors: ${reasons.join('; ')}.`);
  } else {
    lines.push('No relationship memory is shifting negotiation yet.');
  }
  lines.push('Negotiation memory is bounded (±0.2) and never blocks legal offers.');
  return lines;
}
