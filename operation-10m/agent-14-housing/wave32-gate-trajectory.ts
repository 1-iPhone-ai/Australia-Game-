import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave31ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave32GateBand,
  Wave32GateTrajectoryPersisted,
  Wave32GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave31ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave31 ? 12 : 66;
  if (!brief.shouldRunO10m194DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave32GateTrajectory(): Wave32GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.37-scale-wave-37' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave32GateEma: 23,
    priorEma: undefined,
  };
}

export function sanitizeWave32GateTrajectory(
  raw?: Wave32GateTrajectoryPersisted | null
): Wave32GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave32GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave32GateEma =
    typeof raw.wave32GateEma === 'number' && Number.isFinite(raw.wave32GateEma)
      ? Math.max(0, Math.min(100, raw.wave32GateEma))
      : 23;
  return {
    schemaVersion: '10.14.37-scale-wave-37' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave32GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave31ProjectionHandoffBrief): Wave32GateBand {
  if (brief.shouldProjectWave31 && score <= 19) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave32GateTrajectory(
  turn: number,
  brief: Agent25Wave31ProjectionHandoffBrief,
  persisted?: Wave32GateTrajectoryPersisted | null
): { snapshot: Wave32GateTrajectorySnapshot; persisted: Wave32GateTrajectoryPersisted } {
  const base = sanitizeWave32GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave32GateEma;
  const wave32GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave32GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 32 gate EMA improving (${priorEma} → ${wave32GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 32 gate EMA softening (${priorEma} → ${wave32GateEma})`);
  }
  if (brief.shouldProjectWave31) {
    evidence.push('Agent 25 wave 31 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave32GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave32GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave32GateEma,
    },
  };
}
