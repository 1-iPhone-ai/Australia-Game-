import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave50ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave51GateBand,
  Wave51GateTrajectoryPersisted,
  Wave51GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave50ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave50 ? 12 : 66;
  if (!brief.shouldRunO10m229DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave51GateTrajectory(): Wave51GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.53-scale-wave-53' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave51GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave51GateTrajectory(
  raw?: Wave51GateTrajectoryPersisted | null
): Wave51GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave51GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave51GateEma =
    typeof raw.wave51GateEma === 'number' && Number.isFinite(raw.wave51GateEma)
      ? Math.max(0, Math.min(100, raw.wave51GateEma))
      : 9;
  return {
    schemaVersion: '10.14.53-scale-wave-53' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave51GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave50ProjectionHandoffBrief): Wave51GateBand {
  if (brief.shouldProjectWave50 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave51GateTrajectory(
  turn: number,
  brief: Agent25Wave50ProjectionHandoffBrief,
  persisted?: Wave51GateTrajectoryPersisted | null
): { snapshot: Wave51GateTrajectorySnapshot; persisted: Wave51GateTrajectoryPersisted } {
  const base = sanitizeWave51GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave51GateEma;
  const wave51GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave51GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 49 gate EMA improving (${priorEma} → ${wave51GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 49 gate EMA softening (${priorEma} → ${wave51GateEma})`);
  }
  if (brief.shouldProjectWave50) {
    evidence.push('Agent 25 wave 49 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave51GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave51GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave51GateEma,
    },
  };
}
