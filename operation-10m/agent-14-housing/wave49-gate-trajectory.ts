import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave48ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave49GateBand,
  Wave49GateTrajectoryPersisted,
  Wave49GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave48ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave48 ? 12 : 66;
  if (!brief.shouldRunO10m226DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave49GateTrajectory(): Wave49GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.50-scale-wave-50' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave49GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave49GateTrajectory(
  raw?: Wave49GateTrajectoryPersisted | null
): Wave49GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave49GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave49GateEma =
    typeof raw.wave49GateEma === 'number' && Number.isFinite(raw.wave49GateEma)
      ? Math.max(0, Math.min(100, raw.wave49GateEma))
      : 9;
  return {
    schemaVersion: '10.14.50-scale-wave-50' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave49GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave48ProjectionHandoffBrief): Wave49GateBand {
  if (brief.shouldProjectWave48 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave49GateTrajectory(
  turn: number,
  brief: Agent25Wave48ProjectionHandoffBrief,
  persisted?: Wave49GateTrajectoryPersisted | null
): { snapshot: Wave49GateTrajectorySnapshot; persisted: Wave49GateTrajectoryPersisted } {
  const base = sanitizeWave49GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave49GateEma;
  const wave49GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave49GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 48 gate EMA improving (${priorEma} → ${wave49GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 48 gate EMA softening (${priorEma} → ${wave49GateEma})`);
  }
  if (brief.shouldProjectWave48) {
    evidence.push('Agent 25 wave 48 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave49GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave49GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave49GateEma,
    },
  };
}
