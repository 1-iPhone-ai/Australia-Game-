import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave46ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave47GateBand,
  Wave47GateTrajectoryPersisted,
  Wave47GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave46ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave46 ? 12 : 66;
  if (!brief.shouldRunO10m224DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave47GateTrajectory(): Wave47GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.51-scale-wave-51' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave47GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave47GateTrajectory(
  raw?: Wave47GateTrajectoryPersisted | null
): Wave47GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave47GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave47GateEma =
    typeof raw.wave47GateEma === 'number' && Number.isFinite(raw.wave47GateEma)
      ? Math.max(0, Math.min(100, raw.wave47GateEma))
      : 9;
  return {
    schemaVersion: '10.14.51-scale-wave-51' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave47GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave46ProjectionHandoffBrief): Wave47GateBand {
  if (brief.shouldProjectWave46 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave47GateTrajectory(
  turn: number,
  brief: Agent25Wave46ProjectionHandoffBrief,
  persisted?: Wave47GateTrajectoryPersisted | null
): { snapshot: Wave47GateTrajectorySnapshot; persisted: Wave47GateTrajectoryPersisted } {
  const base = sanitizeWave47GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave47GateEma;
  const wave47GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave47GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 47 gate EMA improving (${priorEma} → ${wave47GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 47 gate EMA softening (${priorEma} → ${wave47GateEma})`);
  }
  if (brief.shouldProjectWave46) {
    evidence.push('Agent 25 wave 46 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave47GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave47GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave47GateEma,
    },
  };
}
