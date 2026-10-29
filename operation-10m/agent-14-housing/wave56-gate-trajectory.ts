import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave55ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave56GateBand,
  Wave56GateTrajectoryPersisted,
  Wave56GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave55ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave55 ? 12 : 66;
  if (!brief.shouldRunO10m247DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave56GateTrajectory(): Wave56GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.56-scale-wave-56' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave56GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave56GateTrajectory(
  raw?: Wave56GateTrajectoryPersisted | null
): Wave56GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave56GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave56GateEma =
    typeof raw.wave56GateEma === 'number' && Number.isFinite(raw.wave56GateEma)
      ? Math.max(0, Math.min(100, raw.wave56GateEma))
      : 9;
  return {
    schemaVersion: '10.14.56-scale-wave-56' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave56GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave55ProjectionHandoffBrief): Wave56GateBand {
  if (brief.shouldProjectWave55 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave56GateTrajectory(
  turn: number,
  brief: Agent25Wave55ProjectionHandoffBrief,
  persisted?: Wave56GateTrajectoryPersisted | null
): { snapshot: Wave56GateTrajectorySnapshot; persisted: Wave56GateTrajectoryPersisted } {
  const base = sanitizeWave56GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave56GateEma;
  const wave56GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave56GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 53 gate EMA improving (${priorEma} → ${wave56GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 53 gate EMA softening (${priorEma} → ${wave56GateEma})`);
  }
  if (brief.shouldProjectWave55) {
    evidence.push('Agent 25 wave 55 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave56GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave56GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave56GateEma,
    },
  };
}
