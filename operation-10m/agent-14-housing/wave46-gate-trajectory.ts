import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave45ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave46GateBand,
  Wave46GateTrajectoryPersisted,
  Wave46GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave45ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave45 ? 12 : 66;
  if (!brief.shouldRunO10m222DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave46GateTrajectory(): Wave46GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave46GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave46GateTrajectory(
  raw?: Wave46GateTrajectoryPersisted | null
): Wave46GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave46GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave46GateEma =
    typeof raw.wave46GateEma === 'number' && Number.isFinite(raw.wave46GateEma)
      ? Math.max(0, Math.min(100, raw.wave46GateEma))
      : 9;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave46GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave45ProjectionHandoffBrief): Wave46GateBand {
  if (brief.shouldProjectWave45 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave46GateTrajectory(
  turn: number,
  brief: Agent25Wave45ProjectionHandoffBrief,
  persisted?: Wave46GateTrajectoryPersisted | null
): { snapshot: Wave46GateTrajectorySnapshot; persisted: Wave46GateTrajectoryPersisted } {
  const base = sanitizeWave46GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave46GateEma;
  const wave46GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave46GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 46 gate EMA improving (${priorEma} → ${wave46GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 46 gate EMA softening (${priorEma} → ${wave46GateEma})`);
  }
  if (brief.shouldProjectWave45) {
    evidence.push('Agent 25 wave 45 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave46GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave46GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave46GateEma,
    },
  };
}
