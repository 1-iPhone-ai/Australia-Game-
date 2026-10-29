import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave42ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave43GateBand,
  Wave43GateTrajectoryPersisted,
  Wave43GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave42ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave42 ? 12 : 66;
  if (!brief.shouldRunO10m216DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave43GateTrajectory(): Wave43GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.46-scale-wave-46' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave43GateEma: 12,
    priorEma: undefined,
  };
}

export function sanitizeWave43GateTrajectory(
  raw?: Wave43GateTrajectoryPersisted | null
): Wave43GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave43GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave43GateEma =
    typeof raw.wave43GateEma === 'number' && Number.isFinite(raw.wave43GateEma)
      ? Math.max(0, Math.min(100, raw.wave43GateEma))
      : 12;
  return {
    schemaVersion: '10.14.46-scale-wave-46' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave43GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave42ProjectionHandoffBrief): Wave43GateBand {
  if (brief.shouldProjectWave42 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave43GateTrajectory(
  turn: number,
  brief: Agent25Wave42ProjectionHandoffBrief,
  persisted?: Wave43GateTrajectoryPersisted | null
): { snapshot: Wave43GateTrajectorySnapshot; persisted: Wave43GateTrajectoryPersisted } {
  const base = sanitizeWave43GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave43GateEma;
  const wave43GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave43GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 43 gate EMA improving (${priorEma} → ${wave43GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 43 gate EMA softening (${priorEma} → ${wave43GateEma})`);
  }
  if (brief.shouldProjectWave42) {
    evidence.push('Agent 25 wave 42 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave43GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave43GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave43GateEma,
    },
  };
}
