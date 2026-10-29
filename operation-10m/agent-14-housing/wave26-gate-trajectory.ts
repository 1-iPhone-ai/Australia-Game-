import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave25ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave26GateBand,
  Wave26GateTrajectoryPersisted,
  Wave26GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave25ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave25 ? 12 : 66;
  if (!brief.shouldRunO10m182DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave26GateTrajectory(): Wave26GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.54-scale-wave-54' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave26GateEma: 29,
    priorEma: undefined,
  };
}

export function sanitizeWave26GateTrajectory(
  raw?: Wave26GateTrajectoryPersisted | null
): Wave26GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave26GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave26GateEma =
    typeof raw.wave26GateEma === 'number' && Number.isFinite(raw.wave26GateEma)
      ? Math.max(0, Math.min(100, raw.wave26GateEma))
      : 29;
  return {
    schemaVersion: '10.14.54-scale-wave-54' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave26GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave25ProjectionHandoffBrief): Wave26GateBand {
  if (brief.shouldProjectWave25 && score <= 25) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave26GateTrajectory(
  turn: number,
  brief: Agent25Wave25ProjectionHandoffBrief,
  persisted?: Wave26GateTrajectoryPersisted | null
): { snapshot: Wave26GateTrajectorySnapshot; persisted: Wave26GateTrajectoryPersisted } {
  const base = sanitizeWave26GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave26GateEma;
  const wave26GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave26GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 26 gate EMA improving (${priorEma} → ${wave26GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 26 gate EMA softening (${priorEma} → ${wave26GateEma})`);
  }
  if (brief.shouldProjectWave25) {
    evidence.push('Agent 25 wave 25 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave26GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave26GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave26GateEma,
    },
  };
}
