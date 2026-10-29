import type { AiMemoryHorizonSnapshot, AiMemoryInfluenceSlice, AiMemoryHorizon } from './types.ts';

export function describeHorizonForPlayer(snapshot: AiMemoryHorizonSnapshot): string {
  const parts: string[] = [snapshot.qualityNote];
  if (snapshot.longTermPriorActive) {
    parts.push(
      `${snapshot.longTermPriorBeliefCount} cross-match prior belief(s) are active alongside ${snapshot.shortTermEventCount} event(s) this match.`,
    );
  } else if (snapshot.shortTermEventCount > 0) {
    parts.push(`${snapshot.shortTermEventCount} remembered event(s) and ${snapshot.shortTermRelationshipCount} relationship track(s) this match.`);
  }
  parts.push(snapshot.explainabilityDisclaimer);
  return parts.join(' ');
}

export function buildMemoryExplainabilityBrief(
  snapshot: AiMemoryHorizonSnapshot,
  slices?: AiMemoryInfluenceSlice[],
): string[] {
  const lines = [describeHorizonForPlayer(snapshot)];
  if (slices?.length) {
    lines.push('Score adjustments from memory this decision:');
    slices.slice(0, 5).forEach(s => {
      const sign = s.delta >= 0 ? '+' : '';
      lines.push(`• [${s.horizon}] ${sign}${s.delta.toFixed(2)} — ${s.reason}`);
    });
  }
  return lines;
}

export function summarizeSlicesByHorizon(
  slices: AiMemoryInfluenceSlice[],
): Record<string, { totalDelta: number; count: number }> {
  const out: Record<string, { totalDelta: number; count: number }> = {};
  slices.forEach(s => {
    const bucket = out[s.horizon] || { totalDelta: 0, count: 0 };
    bucket.totalDelta = Math.round((bucket.totalDelta + s.delta) * 100) / 100;
    bucket.count += 1;
    out[s.horizon] = bucket;
  });
  return out;
}

export function formatHorizonBadge(horizon: AiMemoryHorizon): string {
  switch (horizon) {
    case 'short_term_match':
      return 'Match memory';
    case 'long_term_prior':
      return 'Cross-match prior';
    case 'team_directive':
      return 'Team directive';
    default:
      return horizon;
  }
}

export function rankInfluenceSlicesByMagnitude(slices: AiMemoryInfluenceSlice[], limit = 5): AiMemoryInfluenceSlice[] {
  return slices
    .slice()
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.horizon.localeCompare(b.horizon))
    .slice(0, limit);
}
