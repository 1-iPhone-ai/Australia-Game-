import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25InlineReadinessBrief,
  CouplingTrajectoryTrend,
  InlineMergeBand,
  InlineMergeTrajectoryPersisted,
  InlineMergeTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function inlineSample(brief: Agent25InlineReadinessBrief): number {
  let sample = brief.shouldInlineChunk ? 22 : 71;
  if (!brief.anchorAligned) {
    sample += 16;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialInlineMergeTrajectory(): InlineMergeTrajectoryPersisted {
  return {
    schemaVersion: '10.14.46-scale-wave-46' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    inlineMergeEma: 46,
    priorEma: undefined,
  };
}

export function sanitizeInlineMergeTrajectory(
  raw?: InlineMergeTrajectoryPersisted | null
): InlineMergeTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialInlineMergeTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const inlineMergeEma =
    typeof raw.inlineMergeEma === 'number' && Number.isFinite(raw.inlineMergeEma)
      ? Math.max(0, Math.min(100, raw.inlineMergeEma))
      : 46;
  return {
    schemaVersion: '10.14.46-scale-wave-46' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    inlineMergeEma,
    priorEma:
      typeof raw.priorEma === 'number' && Number.isFinite(raw.priorEma)
        ? Math.max(0, Math.min(100, raw.priorEma))
        : undefined,
  };
}

function trajectoryFromDelta(
  current: number,
  previous: number | undefined,
  epsilon = 0.85
): CouplingTrajectoryTrend {
  if (previous === undefined) return 'flat';
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromInline(score: number, brief: Agent25InlineReadinessBrief): InlineMergeBand {
  if (brief.shouldInlineChunk && score <= 34) return 'ready';
  if (score >= 66) return 'blocked';
  return 'pending';
}

export function advanceInlineMergeTrajectory(
  turn: number,
  brief: Agent25InlineReadinessBrief,
  persisted?: InlineMergeTrajectoryPersisted | null
): { snapshot: InlineMergeTrajectorySnapshot; persisted: InlineMergeTrajectoryPersisted } {
  const base = sanitizeInlineMergeTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = inlineSample(brief);
  const priorEma = base.inlineMergeEma;
  const inlineMergeEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(inlineMergeEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Inline merge EMA improving (${priorEma} → ${inlineMergeEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Inline merge EMA softening (${priorEma} → ${inlineMergeEma})`);
  }
  if (brief.shouldInlineChunk) {
    evidence.push('Agent 25 inline readiness signal active');
  }

  return {
    snapshot: {
      turn,
      inlineMergeEma,
      instantaneousInline: sample,
      band: bandFromInline(inlineMergeEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      inlineMergeEma,
    },
  };
}
