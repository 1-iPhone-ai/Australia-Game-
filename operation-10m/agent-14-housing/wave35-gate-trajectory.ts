import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave34ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave35GateBand,
  Wave35GateTrajectoryPersisted,
  Wave35GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave34ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave34 ? 12 : 66;
  if (!brief.shouldRunO10m200DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave35GateTrajectory(): Wave35GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.42-scale-wave-42' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave35GateEma: 20,
    priorEma: undefined,
  };
}

export function sanitizeWave35GateTrajectory(
  raw?: Wave35GateTrajectoryPersisted | null
): Wave35GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave35GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave35GateEma =
    typeof raw.wave35GateEma === 'number' && Number.isFinite(raw.wave35GateEma)
      ? Math.max(0, Math.min(100, raw.wave35GateEma))
      : 20;
  return {
    schemaVersion: '10.14.42-scale-wave-42' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave35GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave34ProjectionHandoffBrief): Wave35GateBand {
  if (brief.shouldProjectWave34 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave35GateTrajectory(
  turn: number,
  brief: Agent25Wave34ProjectionHandoffBrief,
  persisted?: Wave35GateTrajectoryPersisted | null
): { snapshot: Wave35GateTrajectorySnapshot; persisted: Wave35GateTrajectoryPersisted } {
  const base = sanitizeWave35GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave35GateEma;
  const wave35GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave35GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 35 gate EMA improving (${priorEma} → ${wave35GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 35 gate EMA softening (${priorEma} → ${wave35GateEma})`);
  }
  if (brief.shouldProjectWave34) {
    evidence.push('Agent 25 wave 34 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave35GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave35GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave35GateEma,
    },
  };
}
