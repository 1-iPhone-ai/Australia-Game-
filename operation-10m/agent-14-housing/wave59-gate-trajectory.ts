import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave59ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave59GateBand,
  Wave59GateTrajectoryPersisted,
  Wave59GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave59ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave59 ? 12 : 66;
  if (!brief.shouldRunO10m260DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave59GateTrajectory(): Wave59GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.57-scale-wave-59' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave59GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave59GateTrajectory(
  raw?: Wave59GateTrajectoryPersisted | null
): Wave59GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave59GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave59GateEma =
    typeof raw.wave59GateEma === 'number' && Number.isFinite(raw.wave59GateEma)
      ? Math.max(0, Math.min(100, raw.wave59GateEma))
      : 9;
  return {
    schemaVersion: '10.14.57-scale-wave-59' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave59GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave59ProjectionHandoffBrief): Wave59GateBand {
  if (brief.shouldProjectWave59 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave59GateTrajectory(
  turn: number,
  brief: Agent25Wave59ProjectionHandoffBrief,
  persisted?: Wave59GateTrajectoryPersisted | null
): { snapshot: Wave59GateTrajectorySnapshot; persisted: Wave59GateTrajectoryPersisted } {
  const base = sanitizeWave59GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave59GateEma;
  const wave59GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave59GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 53 gate EMA improving (${priorEma} → ${wave59GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 53 gate EMA softening (${priorEma} → ${wave59GateEma})`);
  }
  if (brief.shouldProjectWave59) {
    evidence.push('Agent 25 wave 56 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave59GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave59GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave59GateEma,
    },
  };
}
