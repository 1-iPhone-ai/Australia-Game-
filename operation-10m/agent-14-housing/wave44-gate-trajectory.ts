import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave43ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave44GateBand,
  Wave44GateTrajectoryPersisted,
  Wave44GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave43ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave43 ? 12 : 66;
  if (!brief.shouldRunO10m218DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave44GateTrajectory(): Wave44GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.50-scale-wave-50' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave44GateEma: 11,
    priorEma: undefined,
  };
}

export function sanitizeWave44GateTrajectory(
  raw?: Wave44GateTrajectoryPersisted | null
): Wave44GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave44GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave44GateEma =
    typeof raw.wave44GateEma === 'number' && Number.isFinite(raw.wave44GateEma)
      ? Math.max(0, Math.min(100, raw.wave44GateEma))
      : 11;
  return {
    schemaVersion: '10.14.50-scale-wave-50' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave44GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave43ProjectionHandoffBrief): Wave44GateBand {
  if (brief.shouldProjectWave43 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave44GateTrajectory(
  turn: number,
  brief: Agent25Wave43ProjectionHandoffBrief,
  persisted?: Wave44GateTrajectoryPersisted | null
): { snapshot: Wave44GateTrajectorySnapshot; persisted: Wave44GateTrajectoryPersisted } {
  const base = sanitizeWave44GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave44GateEma;
  const wave44GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave44GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 44 gate EMA improving (${priorEma} → ${wave44GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 44 gate EMA softening (${priorEma} → ${wave44GateEma})`);
  }
  if (brief.shouldProjectWave43) {
    evidence.push('Agent 25 wave 43 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave44GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave44GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave44GateEma,
    },
  };
}
