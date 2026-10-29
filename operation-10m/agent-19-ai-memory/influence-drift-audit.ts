import type { MemoryInfluenceAuditFinding } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export const AGENT19_INFLUENCE_DRIFT_SPIKE_THRESHOLD = 18;

/** Flags explainability risk when influence magnitude jumps sharply between consecutive turn packs. */
export function auditInfluenceDriftBetweenTurns(
  previous: TurnExplainabilityPack | null | undefined,
  current: TurnExplainabilityPack,
): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  if (!previous) return findings;
  const prevMag = Math.abs(previous.influenceSummary.totalInfluenceDelta);
  const curMag = Math.abs(current.influenceSummary.totalInfluenceDelta);
  const delta = curMag - prevMag;
  if (delta >= AGENT19_INFLUENCE_DRIFT_SPIKE_THRESHOLD) {
    findings.push({
      code: 'influence_spike',
      severity: 'warn',
      message: `Influence |Δ| jumped from ${prevMag.toFixed(2)} (turn ${previous.turn}) to ${curMag.toFixed(2)} (turn ${current.turn}) — briefs should cite the dominant slice.`,
    });
  }
  const prevEvents = previous.horizonAfter.shortTermEventCount;
  const curEvents = current.horizonAfter.shortTermEventCount;
  if (curEvents > prevEvents + 3) {
    findings.push({
      code: 'event_burst',
      severity: 'info',
      message: `${curEvents - prevEvents} new committed event(s) since prior turn pack — horizon diff may dominate narratives.`,
    });
  }
  const pickDominant = (byHorizon: Record<string, { totalDelta: number; count: number }>) => {
    let best: string | null = null;
    let mag = 0;
    Object.entries(byHorizon).forEach(([h, v]) => {
      const m = Math.abs(v.totalDelta);
      if (m > mag) {
        mag = m;
        best = h;
      }
    });
    return best;
  };
  const prevHorizon = pickDominant(previous.influenceSummary.byHorizon);
  const curHorizon = pickDominant(current.influenceSummary.byHorizon);
  if (prevHorizon && curHorizon && prevHorizon !== curHorizon) {
    findings.push({
      code: 'dominant_horizon_shift',
      severity: 'info',
      message: `Dominant influence horizon shifted ${prevHorizon} → ${curHorizon} between turns ${previous.turn} and ${current.turn}.`,
    });
  }
  return findings;
}

export function summarizeInfluenceDrift(findings: MemoryInfluenceAuditFinding[]): string[] {
  if (!findings.length) {
    return ['Influence drift check: no sharp spikes vs the prior turn pack.'];
  }
  return ['Influence drift check:', ...findings.map(f => `[${f.severity}] ${f.message}`)];
}
