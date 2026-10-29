import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave60ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave60GateBand,
  Wave60GateTrajectoryPersisted,
  Wave60GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave60ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave60 ? 12 : 66;
  if (!brief.shouldRunO10m263DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave60GateTrajectory(): Wave60GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.57-scale-wave-60' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave60GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave60GateTrajectory(
  raw?: Wave60GateTrajectoryPersisted | null
): Wave60GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave60GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave60GateEma =
    typeof raw.wave60GateEma === 'number' && Number.isFinite(raw.wave60GateEma)
      ? Math.max(0, Math.min(100, raw.wave60GateEma))
      : 9;
  return {
    schemaVersion: '10.14.57-scale-wave-60' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave60GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave60ProjectionHandoffBrief): Wave60GateBand {
  if (brief.shouldProjectWave60 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave60GateTrajectory(
  turn: number,
  brief: Agent25Wave60ProjectionHandoffBrief,
  persisted?: Wave60GateTrajectoryPersisted | null
): { snapshot: Wave60GateTrajectorySnapshot; persisted: Wave60GateTrajectoryPersisted } {
  const base = sanitizeWave60GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave60GateEma;
  const wave60GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave60GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 53 gate EMA improving (${priorEma} → ${wave60GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 53 gate EMA softening (${priorEma} → ${wave60GateEma})`);
  }
  if (brief.shouldProjectWave60) {
    evidence.push('Agent 25 wave 56 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave60GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave60GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave60GateEma,
    },
  };
}
