import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  CouplingTrajectoryTrend,
  ReadinessGapBand,
  ReadinessTrajectoryPersisted,
  ReadinessTrajectorySnapshot,
  WellbeingRecoveryReadinessBrief,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gapSample(brief: WellbeingRecoveryReadinessBrief): number {
  const base =
    brief.readinessBand === 'not_ready' ? 82 : brief.readinessBand === 'partial' ? 54 : 28;
  let sample = base + (brief.shouldResumePortfolioGrowth ? -10 : 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialReadinessTrajectory(): ReadinessTrajectoryPersisted {
  return {
    schemaVersion: '10.14.18-scale-wave-18' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    readinessGapEma: 48,
    priorEma: undefined,
  };
}

export function sanitizeReadinessTrajectory(
  raw?: ReadinessTrajectoryPersisted | null
): ReadinessTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialReadinessTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const readinessGapEma =
    typeof raw.readinessGapEma === 'number' && Number.isFinite(raw.readinessGapEma)
      ? Math.max(0, Math.min(100, raw.readinessGapEma))
      : 48;
  return {
    schemaVersion: '10.14.18-scale-wave-18' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    readinessGapEma,
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

function bandFromGap(score: number): ReadinessGapBand {
  if (score >= 72) return 'wide';
  if (score >= 52) return 'moderate';
  return 'narrow';
}

export function advanceReadinessTrajectory(
  turn: number,
  brief: WellbeingRecoveryReadinessBrief,
  persisted?: ReadinessTrajectoryPersisted | null
): { snapshot: ReadinessTrajectorySnapshot; persisted: ReadinessTrajectoryPersisted } {
  const base = sanitizeReadinessTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gapSample(brief);
  const priorEma = base.readinessGapEma;
  const readinessGapEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(readinessGapEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Readiness gap EMA narrowing (${priorEma} → ${readinessGapEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Readiness gap EMA widening (${priorEma} → ${readinessGapEma})`);
  }
  if (brief.readinessBand === 'not_ready') {
    evidence.push('Recovery readiness blocked this turn');
  }

  return {
    snapshot: {
      turn,
      readinessGapEma,
      instantaneousGap: sample,
      band: bandFromGap(readinessGapEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      readinessGapEma,
    },
  };
}
