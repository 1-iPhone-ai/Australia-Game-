import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  AccountabilityBand,
  AccountabilityTrajectoryPersisted,
  AccountabilityTrajectorySnapshot,
  Agent14WellbeingAccountabilityScorecard,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.35;

export function createInitialAccountabilityTrajectory(): AccountabilityTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    overallScoreEma: 62,
    priorEma: undefined,
  };
}

export function sanitizeAccountabilityTrajectory(
  raw?: AccountabilityTrajectoryPersisted | null
): AccountabilityTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialAccountabilityTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const overallScoreEma =
    typeof raw.overallScoreEma === 'number' && Number.isFinite(raw.overallScoreEma)
      ? Math.max(0, Math.min(100, raw.overallScoreEma))
      : 62;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    overallScoreEma,
    priorEma:
      typeof raw.priorEma === 'number' && Number.isFinite(raw.priorEma)
        ? Math.max(0, Math.min(100, raw.priorEma))
        : undefined,
  };
}

function trajectoryFromDelta(
  current: number,
  previous: number | undefined,
  epsilon = 0.8
): AccountabilityTrajectorySnapshot['trajectory'] {
  if (previous === undefined) return 'flat';
  if (current - previous > epsilon) return 'improving';
  if (previous - current > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromScore(score: number): AccountabilityBand {
  if (score >= 78) return 'strong';
  if (score >= 58) return 'adequate';
  if (score >= 38) return 'at_risk';
  return 'failing';
}

export function advanceAccountabilityTrajectory(
  turn: number,
  scorecard: Agent14WellbeingAccountabilityScorecard,
  persisted?: AccountabilityTrajectoryPersisted | null
): { snapshot: AccountabilityTrajectorySnapshot; persisted: AccountabilityTrajectoryPersisted } {
  const base = sanitizeAccountabilityTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = scorecard.overallScore;
  const priorEma = base.overallScoreEma;
  const overallScoreEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(overallScoreEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'deteriorating') {
    evidence.push(`Accountability EMA slipping (${priorEma} → ${overallScoreEma})`);
  } else if (trajectory === 'improving') {
    evidence.push(`Accountability EMA recovering (${priorEma} → ${overallScoreEma})`);
  }
  if (scorecard.band === 'failing' || scorecard.band === 'at_risk') {
    evidence.push(`Instantaneous accountability ${scorecard.band} at ${sample}`);
  }

  return {
    snapshot: {
      turn,
      overallScoreEma,
      instantaneousScore: sample,
      band: bandFromScore(overallScoreEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      overallScoreEma,
    },
  };
}
