import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave20ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave21GateBand,
  Wave21GateTrajectoryPersisted,
  Wave21GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave20ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave20 ? 16 : 70;
  if (!brief.shouldRunO10m171DryRun) {
    sample += 12;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave21GateTrajectory(): Wave21GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.36-scale-wave-36' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave21GateEma: 38,
    priorEma: undefined,
  };
}

export function sanitizeWave21GateTrajectory(
  raw?: Wave21GateTrajectoryPersisted | null
): Wave21GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave21GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave21GateEma =
    typeof raw.wave21GateEma === 'number' && Number.isFinite(raw.wave21GateEma)
      ? Math.max(0, Math.min(100, raw.wave21GateEma))
      : 38;
  return {
    schemaVersion: '10.14.36-scale-wave-36' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave21GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave20ProjectionHandoffBrief): Wave21GateBand {
  if (brief.shouldProjectWave20 && score <= 30) return 'ready';
  if (score >= 64) return 'blocked';
  return 'pending';
}

export function advanceWave21GateTrajectory(
  turn: number,
  brief: Agent25Wave20ProjectionHandoffBrief,
  persisted?: Wave21GateTrajectoryPersisted | null
): { snapshot: Wave21GateTrajectorySnapshot; persisted: Wave21GateTrajectoryPersisted } {
  const base = sanitizeWave21GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave21GateEma;
  const wave21GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave21GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 21 gate EMA improving (${priorEma} → ${wave21GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 21 gate EMA softening (${priorEma} → ${wave21GateEma})`);
  }
  if (brief.shouldProjectWave20) {
    evidence.push('Agent 25 wave 20 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave21GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave21GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave21GateEma,
    },
  };
}
