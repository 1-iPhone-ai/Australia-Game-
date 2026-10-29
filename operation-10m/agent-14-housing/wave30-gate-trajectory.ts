import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave29ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave30GateBand,
  Wave30GateTrajectoryPersisted,
  Wave30GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave29ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave29 ? 12 : 66;
  if (!brief.shouldRunO10m190DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave30GateTrajectory(): Wave30GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.39-scale-wave-39' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave30GateEma: 25,
    priorEma: undefined,
  };
}

export function sanitizeWave30GateTrajectory(
  raw?: Wave30GateTrajectoryPersisted | null
): Wave30GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave30GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave30GateEma =
    typeof raw.wave30GateEma === 'number' && Number.isFinite(raw.wave30GateEma)
      ? Math.max(0, Math.min(100, raw.wave30GateEma))
      : 25;
  return {
    schemaVersion: '10.14.39-scale-wave-39' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave30GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave29ProjectionHandoffBrief): Wave30GateBand {
  if (brief.shouldProjectWave29 && score <= 21) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave30GateTrajectory(
  turn: number,
  brief: Agent25Wave29ProjectionHandoffBrief,
  persisted?: Wave30GateTrajectoryPersisted | null
): { snapshot: Wave30GateTrajectorySnapshot; persisted: Wave30GateTrajectoryPersisted } {
  const base = sanitizeWave30GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave30GateEma;
  const wave30GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave30GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 30 gate EMA improving (${priorEma} → ${wave30GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 30 gate EMA softening (${priorEma} → ${wave30GateEma})`);
  }
  if (brief.shouldProjectWave29) {
    evidence.push('Agent 25 wave 29 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave30GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave30GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave30GateEma,
    },
  };
}
