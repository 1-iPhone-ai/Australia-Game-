import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave61ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave61GateBand,
  Wave61GateTrajectoryPersisted,
  Wave61GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave61ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave61 ? 12 : 66;
  if (!brief.shouldRunO10m265DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave61GateTrajectory(): Wave61GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.57-scale-wave-61' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave61GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave61GateTrajectory(
  raw?: Wave61GateTrajectoryPersisted | null
): Wave61GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave61GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave61GateEma =
    typeof raw.wave61GateEma === 'number' && Number.isFinite(raw.wave61GateEma)
      ? Math.max(0, Math.min(100, raw.wave61GateEma))
      : 9;
  return {
    schemaVersion: '10.14.57-scale-wave-61' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave61GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave61ProjectionHandoffBrief): Wave61GateBand {
  if (brief.shouldProjectWave61 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave61GateTrajectory(
  turn: number,
  brief: Agent25Wave61ProjectionHandoffBrief,
  persisted?: Wave61GateTrajectoryPersisted | null
): { snapshot: Wave61GateTrajectorySnapshot; persisted: Wave61GateTrajectoryPersisted } {
  const base = sanitizeWave61GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave61GateEma;
  const wave61GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave61GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 53 gate EMA improving (${priorEma} → ${wave61GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 53 gate EMA softening (${priorEma} → ${wave61GateEma})`);
  }
  if (brief.shouldProjectWave61) {
    evidence.push('Agent 25 wave 56 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave61GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave61GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave61GateEma,
    },
  };
}
