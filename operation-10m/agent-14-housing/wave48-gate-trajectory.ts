import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave47ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave48GateBand,
  Wave48GateTrajectoryPersisted,
  Wave48GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave47ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave47 ? 12 : 66;
  if (!brief.shouldRunO10m225DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave48GateTrajectory(): Wave48GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.55-scale-wave-55' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave48GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave48GateTrajectory(
  raw?: Wave48GateTrajectoryPersisted | null
): Wave48GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave48GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave48GateEma =
    typeof raw.wave48GateEma === 'number' && Number.isFinite(raw.wave48GateEma)
      ? Math.max(0, Math.min(100, raw.wave48GateEma))
      : 9;
  return {
    schemaVersion: '10.14.55-scale-wave-55' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave48GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave47ProjectionHandoffBrief): Wave48GateBand {
  if (brief.shouldProjectWave47 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave48GateTrajectory(
  turn: number,
  brief: Agent25Wave47ProjectionHandoffBrief,
  persisted?: Wave48GateTrajectoryPersisted | null
): { snapshot: Wave48GateTrajectorySnapshot; persisted: Wave48GateTrajectoryPersisted } {
  const base = sanitizeWave48GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave48GateEma;
  const wave48GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave48GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 48 gate EMA improving (${priorEma} → ${wave48GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 48 gate EMA softening (${priorEma} → ${wave48GateEma})`);
  }
  if (brief.shouldProjectWave47) {
    evidence.push('Agent 25 wave 47 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave48GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave48GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave48GateEma,
    },
  };
}
