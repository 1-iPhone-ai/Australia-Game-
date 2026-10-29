import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave21ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave22GateBand,
  Wave22GateTrajectoryPersisted,
  Wave22GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave21ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave21 ? 15 : 69;
  if (!brief.shouldRunO10m174DryRun) {
    sample += 11;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave22GateTrajectory(): Wave22GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.43-scale-wave-43' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave22GateEma: 36,
    priorEma: undefined,
  };
}

export function sanitizeWave22GateTrajectory(
  raw?: Wave22GateTrajectoryPersisted | null
): Wave22GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave22GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave22GateEma =
    typeof raw.wave22GateEma === 'number' && Number.isFinite(raw.wave22GateEma)
      ? Math.max(0, Math.min(100, raw.wave22GateEma))
      : 36;
  return {
    schemaVersion: '10.14.43-scale-wave-43' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave22GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave21ProjectionHandoffBrief): Wave22GateBand {
  if (brief.shouldProjectWave21 && score <= 29) return 'ready';
  if (score >= 63) return 'blocked';
  return 'pending';
}

export function advanceWave22GateTrajectory(
  turn: number,
  brief: Agent25Wave21ProjectionHandoffBrief,
  persisted?: Wave22GateTrajectoryPersisted | null
): { snapshot: Wave22GateTrajectorySnapshot; persisted: Wave22GateTrajectoryPersisted } {
  const base = sanitizeWave22GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave22GateEma;
  const wave22GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave22GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 22 gate EMA improving (${priorEma} → ${wave22GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 22 gate EMA softening (${priorEma} → ${wave22GateEma})`);
  }
  if (brief.shouldProjectWave21) {
    evidence.push('Agent 25 wave 21 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave22GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave22GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave22GateEma,
    },
  };
}
