import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave30ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave31GateBand,
  Wave31GateTrajectoryPersisted,
  Wave31GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave30ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave30 ? 12 : 66;
  if (!brief.shouldRunO10m192DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave31GateTrajectory(): Wave31GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.53-scale-wave-53' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave31GateEma: 24,
    priorEma: undefined,
  };
}

export function sanitizeWave31GateTrajectory(
  raw?: Wave31GateTrajectoryPersisted | null
): Wave31GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave31GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave31GateEma =
    typeof raw.wave31GateEma === 'number' && Number.isFinite(raw.wave31GateEma)
      ? Math.max(0, Math.min(100, raw.wave31GateEma))
      : 24;
  return {
    schemaVersion: '10.14.53-scale-wave-53' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave31GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave30ProjectionHandoffBrief): Wave31GateBand {
  if (brief.shouldProjectWave30 && score <= 20) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave31GateTrajectory(
  turn: number,
  brief: Agent25Wave30ProjectionHandoffBrief,
  persisted?: Wave31GateTrajectoryPersisted | null
): { snapshot: Wave31GateTrajectorySnapshot; persisted: Wave31GateTrajectoryPersisted } {
  const base = sanitizeWave31GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave31GateEma;
  const wave31GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave31GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 31 gate EMA improving (${priorEma} → ${wave31GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 31 gate EMA softening (${priorEma} → ${wave31GateEma})`);
  }
  if (brief.shouldProjectWave30) {
    evidence.push('Agent 25 wave 30 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave31GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave31GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave31GateEma,
    },
  };
}
