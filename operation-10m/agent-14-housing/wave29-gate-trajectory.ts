import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave28ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave29GateBand,
  Wave29GateTrajectoryPersisted,
  Wave29GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave28ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave28 ? 12 : 66;
  if (!brief.shouldRunO10m188DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave29GateTrajectory(): Wave29GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.45-scale-wave-45' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave29GateEma: 26,
    priorEma: undefined,
  };
}

export function sanitizeWave29GateTrajectory(
  raw?: Wave29GateTrajectoryPersisted | null
): Wave29GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave29GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave29GateEma =
    typeof raw.wave29GateEma === 'number' && Number.isFinite(raw.wave29GateEma)
      ? Math.max(0, Math.min(100, raw.wave29GateEma))
      : 26;
  return {
    schemaVersion: '10.14.45-scale-wave-45' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave29GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave28ProjectionHandoffBrief): Wave29GateBand {
  if (brief.shouldProjectWave28 && score <= 22) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave29GateTrajectory(
  turn: number,
  brief: Agent25Wave28ProjectionHandoffBrief,
  persisted?: Wave29GateTrajectoryPersisted | null
): { snapshot: Wave29GateTrajectorySnapshot; persisted: Wave29GateTrajectoryPersisted } {
  const base = sanitizeWave29GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave29GateEma;
  const wave29GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave29GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 29 gate EMA improving (${priorEma} → ${wave29GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 29 gate EMA softening (${priorEma} → ${wave29GateEma})`);
  }
  if (brief.shouldProjectWave28) {
    evidence.push('Agent 25 wave 28 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave29GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave29GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave29GateEma,
    },
  };
}
