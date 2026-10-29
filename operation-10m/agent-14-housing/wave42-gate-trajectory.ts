import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave41ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave42GateBand,
  Wave42GateTrajectoryPersisted,
  Wave42GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave41ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave41 ? 12 : 66;
  if (!brief.shouldRunO10m214DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave42GateTrajectory(): Wave42GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.54-scale-wave-54' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave42GateEma: 13,
    priorEma: undefined,
  };
}

export function sanitizeWave42GateTrajectory(
  raw?: Wave42GateTrajectoryPersisted | null
): Wave42GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave42GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave42GateEma =
    typeof raw.wave42GateEma === 'number' && Number.isFinite(raw.wave42GateEma)
      ? Math.max(0, Math.min(100, raw.wave42GateEma))
      : 13;
  return {
    schemaVersion: '10.14.54-scale-wave-54' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave42GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave41ProjectionHandoffBrief): Wave42GateBand {
  if (brief.shouldProjectWave41 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave42GateTrajectory(
  turn: number,
  brief: Agent25Wave41ProjectionHandoffBrief,
  persisted?: Wave42GateTrajectoryPersisted | null
): { snapshot: Wave42GateTrajectorySnapshot; persisted: Wave42GateTrajectoryPersisted } {
  const base = sanitizeWave42GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave42GateEma;
  const wave42GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave42GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 42 gate EMA improving (${priorEma} → ${wave42GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 42 gate EMA softening (${priorEma} → ${wave42GateEma})`);
  }
  if (brief.shouldProjectWave41) {
    evidence.push('Agent 25 wave 41 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave42GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave42GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave42GateEma,
    },
  };
}
