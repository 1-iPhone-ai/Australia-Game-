import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave52ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave53GateBand,
  Wave53GateTrajectoryPersisted,
  Wave53GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave52ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave52 ? 12 : 66;
  if (!brief.shouldRunO10m233DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave53GateTrajectory(): Wave53GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.54-scale-wave-54' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave53GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave53GateTrajectory(
  raw?: Wave53GateTrajectoryPersisted | null
): Wave53GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave53GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave53GateEma =
    typeof raw.wave53GateEma === 'number' && Number.isFinite(raw.wave53GateEma)
      ? Math.max(0, Math.min(100, raw.wave53GateEma))
      : 9;
  return {
    schemaVersion: '10.14.54-scale-wave-54' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave53GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave52ProjectionHandoffBrief): Wave53GateBand {
  if (brief.shouldProjectWave52 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave53GateTrajectory(
  turn: number,
  brief: Agent25Wave52ProjectionHandoffBrief,
  persisted?: Wave53GateTrajectoryPersisted | null
): { snapshot: Wave53GateTrajectorySnapshot; persisted: Wave53GateTrajectoryPersisted } {
  const base = sanitizeWave53GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave53GateEma;
  const wave53GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave53GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 52 gate EMA improving (${priorEma} → ${wave53GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 52 gate EMA softening (${priorEma} → ${wave53GateEma})`);
  }
  if (brief.shouldProjectWave52) {
    evidence.push('Agent 25 wave 51 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave53GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave53GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave53GateEma,
    },
  };
}
