import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  CouplingTrajectoryTrend,
  HandoffReadinessBand,
  HandoffTrajectoryPersisted,
  HandoffTrajectorySnapshot,
  PortfolioHandoffBrief,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function readinessSample(brief: PortfolioHandoffBrief): number {
  let sample = brief.shouldSignalHandoff ? 30 : 72;
  sample -= Math.min(brief.allowedNewCommits * 6, 18);
  sample += Math.min(brief.queuedResumptionActions * 3, 15);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialHandoffTrajectory(): HandoffTrajectoryPersisted {
  return {
    schemaVersion: '10.14.28-scale-wave-28' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    handoffReadinessEma: 52,
    priorEma: undefined,
  };
}

export function sanitizeHandoffTrajectory(
  raw?: HandoffTrajectoryPersisted | null
): HandoffTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialHandoffTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const handoffReadinessEma =
    typeof raw.handoffReadinessEma === 'number' && Number.isFinite(raw.handoffReadinessEma)
      ? Math.max(0, Math.min(100, raw.handoffReadinessEma))
      : 52;
  return {
    schemaVersion: '10.14.28-scale-wave-28' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    handoffReadinessEma,
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

function bandFromReadiness(score: number, brief: PortfolioHandoffBrief): HandoffReadinessBand {
  if (brief.shouldSignalHandoff && score <= 45) return 'ready';
  if (score >= 68) return 'blocked';
  return 'pending';
}

export function advanceHandoffTrajectory(
  turn: number,
  brief: PortfolioHandoffBrief,
  persisted?: HandoffTrajectoryPersisted | null
): { snapshot: HandoffTrajectorySnapshot; persisted: HandoffTrajectoryPersisted } {
  const base = sanitizeHandoffTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = readinessSample(brief);
  const priorEma = base.handoffReadinessEma;
  const handoffReadinessEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(handoffReadinessEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Handoff readiness EMA improving (${priorEma} → ${handoffReadinessEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Handoff readiness EMA softening (${priorEma} → ${handoffReadinessEma})`);
  }
  if (brief.shouldSignalHandoff) {
    evidence.push('Portfolio handoff signal active');
  }

  return {
    snapshot: {
      turn,
      handoffReadinessEma,
      instantaneousReadiness: sample,
      band: bandFromReadiness(handoffReadinessEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      handoffReadinessEma,
    },
  };
}
