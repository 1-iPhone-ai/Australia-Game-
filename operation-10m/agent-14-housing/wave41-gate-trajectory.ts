import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave40ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave41GateBand,
  Wave41GateTrajectoryPersisted,
  Wave41GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave40ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave40 ? 12 : 66;
  if (!brief.shouldRunO10m212DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave41GateTrajectory(): Wave41GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.43-scale-wave-43' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave41GateEma: 14,
    priorEma: undefined,
  };
}

export function sanitizeWave41GateTrajectory(
  raw?: Wave41GateTrajectoryPersisted | null
): Wave41GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave41GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave41GateEma =
    typeof raw.wave41GateEma === 'number' && Number.isFinite(raw.wave41GateEma)
      ? Math.max(0, Math.min(100, raw.wave41GateEma))
      : 14;
  return {
    schemaVersion: '10.14.43-scale-wave-43' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave41GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave40ProjectionHandoffBrief): Wave41GateBand {
  if (brief.shouldProjectWave40 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave41GateTrajectory(
  turn: number,
  brief: Agent25Wave40ProjectionHandoffBrief,
  persisted?: Wave41GateTrajectoryPersisted | null
): { snapshot: Wave41GateTrajectorySnapshot; persisted: Wave41GateTrajectoryPersisted } {
  const base = sanitizeWave41GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave41GateEma;
  const wave41GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave41GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 41 gate EMA improving (${priorEma} → ${wave41GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 41 gate EMA softening (${priorEma} → ${wave41GateEma})`);
  }
  if (brief.shouldProjectWave40) {
    evidence.push('Agent 25 wave 40 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave41GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave41GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave41GateEma,
    },
  };
}
