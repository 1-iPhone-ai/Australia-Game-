import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave26ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave27GateBand,
  Wave27GateTrajectoryPersisted,
  Wave27GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave26ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave26 ? 12 : 66;
  if (!brief.shouldRunO10m184DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave27GateTrajectory(): Wave27GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.31-scale-wave-31' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave27GateEma: 28,
    priorEma: undefined,
  };
}

export function sanitizeWave27GateTrajectory(
  raw?: Wave27GateTrajectoryPersisted | null
): Wave27GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave27GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave27GateEma =
    typeof raw.wave27GateEma === 'number' && Number.isFinite(raw.wave27GateEma)
      ? Math.max(0, Math.min(100, raw.wave27GateEma))
      : 28;
  return {
    schemaVersion: '10.14.31-scale-wave-31' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave27GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave26ProjectionHandoffBrief): Wave27GateBand {
  if (brief.shouldProjectWave26 && score <= 24) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave27GateTrajectory(
  turn: number,
  brief: Agent25Wave26ProjectionHandoffBrief,
  persisted?: Wave27GateTrajectoryPersisted | null
): { snapshot: Wave27GateTrajectorySnapshot; persisted: Wave27GateTrajectoryPersisted } {
  const base = sanitizeWave27GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave27GateEma;
  const wave27GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave27GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 27 gate EMA improving (${priorEma} → ${wave27GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 27 gate EMA softening (${priorEma} → ${wave27GateEma})`);
  }
  if (brief.shouldProjectWave26) {
    evidence.push('Agent 25 wave 26 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave27GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave27GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave27GateEma,
    },
  };
}
