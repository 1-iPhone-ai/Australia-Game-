import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave18ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave19GateBand,
  Wave19GateTrajectoryPersisted,
  Wave19GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave18ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave18 ? 18 : 72;
  if (!brief.shouldRunO10m167DryRun) {
    sample += 14;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave19GateTrajectory(): Wave19GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.55-scale-wave-55' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave19GateEma: 42,
    priorEma: undefined,
  };
}

export function sanitizeWave19GateTrajectory(
  raw?: Wave19GateTrajectoryPersisted | null
): Wave19GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave19GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave19GateEma =
    typeof raw.wave19GateEma === 'number' && Number.isFinite(raw.wave19GateEma)
      ? Math.max(0, Math.min(100, raw.wave19GateEma))
      : 42;
  return {
    schemaVersion: '10.14.55-scale-wave-55' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave19GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave18ProjectionHandoffBrief): Wave19GateBand {
  if (brief.shouldProjectWave18 && score <= 32) return 'ready';
  if (score >= 66) return 'blocked';
  return 'pending';
}

export function advanceWave19GateTrajectory(
  turn: number,
  brief: Agent25Wave18ProjectionHandoffBrief,
  persisted?: Wave19GateTrajectoryPersisted | null
): { snapshot: Wave19GateTrajectorySnapshot; persisted: Wave19GateTrajectoryPersisted } {
  const base = sanitizeWave19GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave19GateEma;
  const wave19GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave19GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 19 gate EMA improving (${priorEma} → ${wave19GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 19 gate EMA softening (${priorEma} → ${wave19GateEma})`);
  }
  if (brief.shouldProjectWave18) {
    evidence.push('Agent 25 wave 18 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave19GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave19GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave19GateEma,
    },
  };
}
