import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave53ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave54GateBand,
  Wave54GateTrajectoryPersisted,
  Wave54GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave53ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave53 ? 12 : 66;
  if (!brief.shouldRunO10m237DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave54GateTrajectory(): Wave54GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.55-scale-wave-55' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave54GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave54GateTrajectory(
  raw?: Wave54GateTrajectoryPersisted | null
): Wave54GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave54GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave54GateEma =
    typeof raw.wave54GateEma === 'number' && Number.isFinite(raw.wave54GateEma)
      ? Math.max(0, Math.min(100, raw.wave54GateEma))
      : 9;
  return {
    schemaVersion: '10.14.55-scale-wave-55' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave54GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave53ProjectionHandoffBrief): Wave54GateBand {
  if (brief.shouldProjectWave53 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave54GateTrajectory(
  turn: number,
  brief: Agent25Wave53ProjectionHandoffBrief,
  persisted?: Wave54GateTrajectoryPersisted | null
): { snapshot: Wave54GateTrajectorySnapshot; persisted: Wave54GateTrajectoryPersisted } {
  const base = sanitizeWave54GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave54GateEma;
  const wave54GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave54GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 53 gate EMA improving (${priorEma} → ${wave54GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 53 gate EMA softening (${priorEma} → ${wave54GateEma})`);
  }
  if (brief.shouldProjectWave53) {
    evidence.push('Agent 25 wave 53 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave54GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave54GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave54GateEma,
    },
  };
}
