import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave37ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave38GateBand,
  Wave38GateTrajectoryPersisted,
  Wave38GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave37ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave37 ? 12 : 66;
  if (!brief.shouldRunO10m206DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave38GateTrajectory(): Wave38GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.47-scale-wave-47' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave38GateEma: 17,
    priorEma: undefined,
  };
}

export function sanitizeWave38GateTrajectory(
  raw?: Wave38GateTrajectoryPersisted | null
): Wave38GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave38GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave38GateEma =
    typeof raw.wave38GateEma === 'number' && Number.isFinite(raw.wave38GateEma)
      ? Math.max(0, Math.min(100, raw.wave38GateEma))
      : 17;
  return {
    schemaVersion: '10.14.47-scale-wave-47' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave38GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave37ProjectionHandoffBrief): Wave38GateBand {
  if (brief.shouldProjectWave37 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave38GateTrajectory(
  turn: number,
  brief: Agent25Wave37ProjectionHandoffBrief,
  persisted?: Wave38GateTrajectoryPersisted | null
): { snapshot: Wave38GateTrajectorySnapshot; persisted: Wave38GateTrajectoryPersisted } {
  const base = sanitizeWave38GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave38GateEma;
  const wave38GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave38GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 38 gate EMA improving (${priorEma} → ${wave38GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 38 gate EMA softening (${priorEma} → ${wave38GateEma})`);
  }
  if (brief.shouldProjectWave37) {
    evidence.push('Agent 25 wave 37 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave38GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave38GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave38GateEma,
    },
  };
}
