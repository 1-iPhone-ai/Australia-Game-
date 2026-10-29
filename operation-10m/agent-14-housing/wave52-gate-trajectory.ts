import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave51ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave52GateBand,
  Wave52GateTrajectoryPersisted,
  Wave52GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave51ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave51 ? 12 : 66;
  if (!brief.shouldRunO10m231DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave52GateTrajectory(): Wave52GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.55-scale-wave-55' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave52GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave52GateTrajectory(
  raw?: Wave52GateTrajectoryPersisted | null
): Wave52GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave52GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave52GateEma =
    typeof raw.wave52GateEma === 'number' && Number.isFinite(raw.wave52GateEma)
      ? Math.max(0, Math.min(100, raw.wave52GateEma))
      : 9;
  return {
    schemaVersion: '10.14.55-scale-wave-55' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave52GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave51ProjectionHandoffBrief): Wave52GateBand {
  if (brief.shouldProjectWave51 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave52GateTrajectory(
  turn: number,
  brief: Agent25Wave51ProjectionHandoffBrief,
  persisted?: Wave52GateTrajectoryPersisted | null
): { snapshot: Wave52GateTrajectorySnapshot; persisted: Wave52GateTrajectoryPersisted } {
  const base = sanitizeWave52GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave52GateEma;
  const wave52GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave52GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 51 gate EMA improving (${priorEma} → ${wave52GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 51 gate EMA softening (${priorEma} → ${wave52GateEma})`);
  }
  if (brief.shouldProjectWave51) {
    evidence.push('Agent 25 wave 51 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave52GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave52GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave52GateEma,
    },
  };
}
