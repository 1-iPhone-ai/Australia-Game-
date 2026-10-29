import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave54ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave55GateBand,
  Wave55GateTrajectoryPersisted,
  Wave55GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave54ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave54 ? 12 : 66;
  if (!brief.shouldRunO10m240DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave55GateTrajectory(): Wave55GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.55-scale-wave-55' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave55GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave55GateTrajectory(
  raw?: Wave55GateTrajectoryPersisted | null
): Wave55GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave55GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave55GateEma =
    typeof raw.wave55GateEma === 'number' && Number.isFinite(raw.wave55GateEma)
      ? Math.max(0, Math.min(100, raw.wave55GateEma))
      : 9;
  return {
    schemaVersion: '10.14.55-scale-wave-55' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave55GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave54ProjectionHandoffBrief): Wave55GateBand {
  if (brief.shouldProjectWave54 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave55GateTrajectory(
  turn: number,
  brief: Agent25Wave54ProjectionHandoffBrief,
  persisted?: Wave55GateTrajectoryPersisted | null
): { snapshot: Wave55GateTrajectorySnapshot; persisted: Wave55GateTrajectoryPersisted } {
  const base = sanitizeWave55GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave55GateEma;
  const wave55GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave55GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 53 gate EMA improving (${priorEma} → ${wave55GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 53 gate EMA softening (${priorEma} → ${wave55GateEma})`);
  }
  if (brief.shouldProjectWave54) {
    evidence.push('Agent 25 wave 53 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave55GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave55GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave55GateEma,
    },
  };
}
