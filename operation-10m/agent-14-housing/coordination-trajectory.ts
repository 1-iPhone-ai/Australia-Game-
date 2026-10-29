import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  CoordinationEngagementBand,
  CoordinationTrajectoryPersisted,
  CoordinationTrajectorySnapshot,
  CouplingTrajectoryTrend,
  StakeholderCoordinationBrief,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function engagementSample(brief: StakeholderCoordinationBrief): number {
  let sample = brief.shouldEngageStakeholders ? 68 : 38;
  sample += Math.min(brief.reliefActions * 4, 24);
  if (brief.governanceBand === 'crisis' || brief.governanceBand === 'misaligned') {
    sample += 12;
  }
  if (brief.trajectory === 'deteriorating') {
    sample += 8;
  } else if (brief.trajectory === 'improving') {
    sample -= 6;
  }
  return Math.max(0, Math.min(100, sample));
}

export function createInitialCoordinationTrajectory(): CoordinationTrajectoryPersisted {
  return {
    schemaVersion: '10.14.43-scale-wave-43' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    engagementPressureEma: 45,
    priorEma: undefined,
  };
}

export function sanitizeCoordinationTrajectory(
  raw?: CoordinationTrajectoryPersisted | null
): CoordinationTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialCoordinationTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const engagementPressureEma =
    typeof raw.engagementPressureEma === 'number' && Number.isFinite(raw.engagementPressureEma)
      ? Math.max(0, Math.min(100, raw.engagementPressureEma))
      : 45;
  return {
    schemaVersion: '10.14.43-scale-wave-43' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    engagementPressureEma,
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
  if (current - previous > epsilon) return 'deteriorating';
  if (previous - current > epsilon) return 'improving';
  return 'flat';
}

function bandFromPressure(score: number): CoordinationEngagementBand {
  if (score >= 72) return 'escalation';
  if (score >= 52) return 'elevated';
  return 'routine';
}

export function advanceCoordinationTrajectory(
  turn: number,
  brief: StakeholderCoordinationBrief,
  persisted?: CoordinationTrajectoryPersisted | null
): { snapshot: CoordinationTrajectorySnapshot; persisted: CoordinationTrajectoryPersisted } {
  const base = sanitizeCoordinationTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = engagementSample(brief);
  const priorEma = base.engagementPressureEma;
  const engagementPressureEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(engagementPressureEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'deteriorating') {
    evidence.push(`Engagement pressure EMA rising (${priorEma} → ${engagementPressureEma})`);
  } else if (trajectory === 'improving') {
    evidence.push(`Engagement pressure EMA easing (${priorEma} → ${engagementPressureEma})`);
  }
  if (brief.shouldEngageStakeholders) {
    evidence.push('Stakeholder engagement flagged this turn');
  }

  return {
    snapshot: {
      turn,
      engagementPressureEma,
      instantaneousPressure: sample,
      band: bandFromPressure(engagementPressureEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      engagementPressureEma,
    },
  };
}
