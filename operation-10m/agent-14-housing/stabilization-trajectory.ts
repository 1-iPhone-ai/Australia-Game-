import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  CouplingTrajectoryTrend,
  PortfolioStabilizationBrief,
  StabilizationStressBand,
  StabilizationTrajectoryPersisted,
  StabilizationTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function stressSample(brief: PortfolioStabilizationBrief): number {
  const base =
    brief.stabilizationPath === 'blocked' ? 84 : brief.stabilizationPath === 'watch' ? 58 : 34;
  let sample = base + (brief.shouldPausePortfolioGrowth ? 8 : 0);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialStabilizationTrajectory(): StabilizationTrajectoryPersisted {
  return {
    schemaVersion: '10.14.46-scale-wave-46' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    stabilizationStressEma: 50,
    priorEma: undefined,
  };
}

export function sanitizeStabilizationTrajectory(
  raw?: StabilizationTrajectoryPersisted | null
): StabilizationTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialStabilizationTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const stabilizationStressEma =
    typeof raw.stabilizationStressEma === 'number' && Number.isFinite(raw.stabilizationStressEma)
      ? Math.max(0, Math.min(100, raw.stabilizationStressEma))
      : 50;
  return {
    schemaVersion: '10.14.46-scale-wave-46' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    stabilizationStressEma,
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

function bandFromStress(score: number): StabilizationStressBand {
  if (score >= 72) return 'stressed';
  if (score >= 52) return 'constrained';
  return 'recovering';
}

export function advanceStabilizationTrajectory(
  turn: number,
  brief: PortfolioStabilizationBrief,
  persisted?: StabilizationTrajectoryPersisted | null
): { snapshot: StabilizationTrajectorySnapshot; persisted: StabilizationTrajectoryPersisted } {
  const base = sanitizeStabilizationTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = stressSample(brief);
  const priorEma = base.stabilizationStressEma;
  const stabilizationStressEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(stabilizationStressEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Stabilization stress EMA easing (${priorEma} → ${stabilizationStressEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Stabilization stress EMA rising (${priorEma} → ${stabilizationStressEma})`);
  }
  if (brief.stabilizationPath === 'blocked') {
    evidence.push(`Portfolio path blocked at turn ${turn}`);
  }

  return {
    snapshot: {
      turn,
      stabilizationStressEma,
      instantaneousStress: sample,
      band: bandFromStress(stabilizationStressEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      stabilizationStressEma,
    },
  };
}
