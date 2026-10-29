import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave49ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave50GateBand,
  Wave50GateTrajectoryPersisted,
  Wave50GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave49ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave49 ? 12 : 66;
  if (!brief.shouldRunO10m227DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave50GateTrajectory(): Wave50GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.54-scale-wave-54' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave50GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave50GateTrajectory(
  raw?: Wave50GateTrajectoryPersisted | null
): Wave50GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave50GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave50GateEma =
    typeof raw.wave50GateEma === 'number' && Number.isFinite(raw.wave50GateEma)
      ? Math.max(0, Math.min(100, raw.wave50GateEma))
      : 9;
  return {
    schemaVersion: '10.14.54-scale-wave-54' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave50GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave49ProjectionHandoffBrief): Wave50GateBand {
  if (brief.shouldProjectWave49 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave50GateTrajectory(
  turn: number,
  brief: Agent25Wave49ProjectionHandoffBrief,
  persisted?: Wave50GateTrajectoryPersisted | null
): { snapshot: Wave50GateTrajectorySnapshot; persisted: Wave50GateTrajectoryPersisted } {
  const base = sanitizeWave50GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave50GateEma;
  const wave50GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave50GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 49 gate EMA improving (${priorEma} → ${wave50GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 49 gate EMA softening (${priorEma} → ${wave50GateEma})`);
  }
  if (brief.shouldProjectWave49) {
    evidence.push('Agent 25 wave 49 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave50GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave50GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave50GateEma,
    },
  };
}
