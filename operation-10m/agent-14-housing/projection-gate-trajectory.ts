import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave17ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  ProjectionGateBand,
  ProjectionGateTrajectoryPersisted,
  ProjectionGateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave17ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave17 ? 19 : 73;
  if (!brief.shouldActivateInline) {
    sample += 15;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialProjectionGateTrajectory(): ProjectionGateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.28-scale-wave-28' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    projectionGateEma: 44,
    priorEma: undefined,
  };
}

export function sanitizeProjectionGateTrajectory(
  raw?: ProjectionGateTrajectoryPersisted | null
): ProjectionGateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialProjectionGateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const projectionGateEma =
    typeof raw.projectionGateEma === 'number' && Number.isFinite(raw.projectionGateEma)
      ? Math.max(0, Math.min(100, raw.projectionGateEma))
      : 44;
  return {
    schemaVersion: '10.14.28-scale-wave-28' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    projectionGateEma,
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

function bandFromGate(score: number, brief: Agent25Wave17ProjectionHandoffBrief): ProjectionGateBand {
  if (brief.shouldProjectWave17 && score <= 33) return 'ready';
  if (score >= 67) return 'blocked';
  return 'pending';
}

export function advanceProjectionGateTrajectory(
  turn: number,
  brief: Agent25Wave17ProjectionHandoffBrief,
  persisted?: ProjectionGateTrajectoryPersisted | null
): { snapshot: ProjectionGateTrajectorySnapshot; persisted: ProjectionGateTrajectoryPersisted } {
  const base = sanitizeProjectionGateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.projectionGateEma;
  const projectionGateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(projectionGateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Projection gate EMA improving (${priorEma} → ${projectionGateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Projection gate EMA softening (${priorEma} → ${projectionGateEma})`);
  }
  if (brief.shouldProjectWave17) {
    evidence.push('Agent 25 wave 17 projection signal active');
  }

  return {
    snapshot: {
      turn,
      projectionGateEma,
      instantaneousGate: sample,
      band: bandFromGate(projectionGateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      projectionGateEma,
    },
  };
}
