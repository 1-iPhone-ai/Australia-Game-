import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave35ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave36GateBand,
  Wave36GateTrajectoryPersisted,
  Wave36GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave35ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave35 ? 12 : 66;
  if (!brief.shouldRunO10m202DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave36GateTrajectory(): Wave36GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.53-scale-wave-53' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave36GateEma: 19,
    priorEma: undefined,
  };
}

export function sanitizeWave36GateTrajectory(
  raw?: Wave36GateTrajectoryPersisted | null
): Wave36GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave36GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave36GateEma =
    typeof raw.wave36GateEma === 'number' && Number.isFinite(raw.wave36GateEma)
      ? Math.max(0, Math.min(100, raw.wave36GateEma))
      : 19;
  return {
    schemaVersion: '10.14.53-scale-wave-53' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave36GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave35ProjectionHandoffBrief): Wave36GateBand {
  if (brief.shouldProjectWave35 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave36GateTrajectory(
  turn: number,
  brief: Agent25Wave35ProjectionHandoffBrief,
  persisted?: Wave36GateTrajectoryPersisted | null
): { snapshot: Wave36GateTrajectorySnapshot; persisted: Wave36GateTrajectoryPersisted } {
  const base = sanitizeWave36GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave36GateEma;
  const wave36GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave36GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 36 gate EMA improving (${priorEma} → ${wave36GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 36 gate EMA softening (${priorEma} → ${wave36GateEma})`);
  }
  if (brief.shouldProjectWave35) {
    evidence.push('Agent 25 wave 35 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave36GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave36GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave36GateEma,
    },
  };
}
