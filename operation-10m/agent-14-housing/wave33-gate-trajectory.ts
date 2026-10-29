import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave32ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave33GateBand,
  Wave33GateTrajectoryPersisted,
  Wave33GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave32ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave32 ? 12 : 66;
  if (!brief.shouldRunO10m196DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave33GateTrajectory(): Wave33GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.41-scale-wave-41' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave33GateEma: 22,
    priorEma: undefined,
  };
}

export function sanitizeWave33GateTrajectory(
  raw?: Wave33GateTrajectoryPersisted | null
): Wave33GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave33GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave33GateEma =
    typeof raw.wave33GateEma === 'number' && Number.isFinite(raw.wave33GateEma)
      ? Math.max(0, Math.min(100, raw.wave33GateEma))
      : 22;
  return {
    schemaVersion: '10.14.41-scale-wave-41' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave33GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave32ProjectionHandoffBrief): Wave33GateBand {
  if (brief.shouldProjectWave32 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave33GateTrajectory(
  turn: number,
  brief: Agent25Wave32ProjectionHandoffBrief,
  persisted?: Wave33GateTrajectoryPersisted | null
): { snapshot: Wave33GateTrajectorySnapshot; persisted: Wave33GateTrajectoryPersisted } {
  const base = sanitizeWave33GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave33GateEma;
  const wave33GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave33GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 33 gate EMA improving (${priorEma} → ${wave33GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 33 gate EMA softening (${priorEma} → ${wave33GateEma})`);
  }
  if (brief.shouldProjectWave32) {
    evidence.push('Agent 25 wave 32 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave33GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave33GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave33GateEma,
    },
  };
}
