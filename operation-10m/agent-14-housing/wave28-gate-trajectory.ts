import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave27ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave28GateBand,
  Wave28GateTrajectoryPersisted,
  Wave28GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave27ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave27 ? 12 : 66;
  if (!brief.shouldRunO10m186DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave28GateTrajectory(): Wave28GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.36-scale-wave-36' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave28GateEma: 27,
    priorEma: undefined,
  };
}

export function sanitizeWave28GateTrajectory(
  raw?: Wave28GateTrajectoryPersisted | null
): Wave28GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave28GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave28GateEma =
    typeof raw.wave28GateEma === 'number' && Number.isFinite(raw.wave28GateEma)
      ? Math.max(0, Math.min(100, raw.wave28GateEma))
      : 27;
  return {
    schemaVersion: '10.14.36-scale-wave-36' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave28GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave27ProjectionHandoffBrief): Wave28GateBand {
  if (brief.shouldProjectWave27 && score <= 23) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave28GateTrajectory(
  turn: number,
  brief: Agent25Wave27ProjectionHandoffBrief,
  persisted?: Wave28GateTrajectoryPersisted | null
): { snapshot: Wave28GateTrajectorySnapshot; persisted: Wave28GateTrajectoryPersisted } {
  const base = sanitizeWave28GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave28GateEma;
  const wave28GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave28GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 28 gate EMA improving (${priorEma} → ${wave28GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 28 gate EMA softening (${priorEma} → ${wave28GateEma})`);
  }
  if (brief.shouldProjectWave27) {
    evidence.push('Agent 25 wave 27 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave28GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave28GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave28GateEma,
    },
  };
}
