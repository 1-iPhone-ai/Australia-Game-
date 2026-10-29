import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  CouplingTrajectoryTrend,
  PortfolioResumptionPlan,
  ResumptionFrictionBand,
  ResumptionTrajectoryPersisted,
  ResumptionTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function frictionSample(plan: PortfolioResumptionPlan): number {
  let sample = plan.shouldHoldNewCommits ? 76 : plan.actions.length > 0 ? 32 : 44;
  if (plan.recommendedResumeTurn > plan.turn + 2) {
    sample += 10;
  }
  return Math.max(0, Math.min(100, sample));
}

export function createInitialResumptionTrajectory(): ResumptionTrajectoryPersisted {
  return {
    schemaVersion: '10.14.31-scale-wave-31' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    resumptionFrictionEma: 50,
    priorEma: undefined,
  };
}

export function sanitizeResumptionTrajectory(
  raw?: ResumptionTrajectoryPersisted | null
): ResumptionTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialResumptionTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const resumptionFrictionEma =
    typeof raw.resumptionFrictionEma === 'number' && Number.isFinite(raw.resumptionFrictionEma)
      ? Math.max(0, Math.min(100, raw.resumptionFrictionEma))
      : 50;
  return {
    schemaVersion: '10.14.31-scale-wave-31' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    resumptionFrictionEma,
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

function bandFromFriction(score: number): ResumptionFrictionBand {
  if (score >= 68) return 'high';
  if (score >= 48) return 'moderate';
  return 'low';
}

export function advanceResumptionTrajectory(
  turn: number,
  plan: PortfolioResumptionPlan,
  persisted?: ResumptionTrajectoryPersisted | null
): { snapshot: ResumptionTrajectorySnapshot; persisted: ResumptionTrajectoryPersisted } {
  const base = sanitizeResumptionTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = frictionSample(plan);
  const priorEma = base.resumptionFrictionEma;
  const resumptionFrictionEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(resumptionFrictionEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Resumption friction EMA easing (${priorEma} → ${resumptionFrictionEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Resumption friction EMA rising (${priorEma} → ${resumptionFrictionEma})`);
  }
  if (plan.shouldHoldNewCommits) {
    evidence.push(`Portfolio commits held until turn ${plan.recommendedResumeTurn}`);
  }

  return {
    snapshot: {
      turn,
      resumptionFrictionEma,
      instantaneousFriction: sample,
      band: bandFromFriction(resumptionFrictionEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      resumptionFrictionEma,
    },
  };
}
