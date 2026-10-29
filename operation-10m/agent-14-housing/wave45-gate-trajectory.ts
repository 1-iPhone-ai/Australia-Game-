import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave44ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave45GateBand,
  Wave45GateTrajectoryPersisted,
  Wave45GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave44ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave44 ? 12 : 66;
  if (!brief.shouldRunO10m220DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave45GateTrajectory(): Wave45GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.53-scale-wave-53' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave45GateEma: 10,
    priorEma: undefined,
  };
}

export function sanitizeWave45GateTrajectory(
  raw?: Wave45GateTrajectoryPersisted | null
): Wave45GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave45GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave45GateEma =
    typeof raw.wave45GateEma === 'number' && Number.isFinite(raw.wave45GateEma)
      ? Math.max(0, Math.min(100, raw.wave45GateEma))
      : 10;
  return {
    schemaVersion: '10.14.53-scale-wave-53' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave45GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave44ProjectionHandoffBrief): Wave45GateBand {
  if (brief.shouldProjectWave44 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave45GateTrajectory(
  turn: number,
  brief: Agent25Wave44ProjectionHandoffBrief,
  persisted?: Wave45GateTrajectoryPersisted | null
): { snapshot: Wave45GateTrajectorySnapshot; persisted: Wave45GateTrajectoryPersisted } {
  const base = sanitizeWave45GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave45GateEma;
  const wave45GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave45GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 45 gate EMA improving (${priorEma} → ${wave45GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 45 gate EMA softening (${priorEma} → ${wave45GateEma})`);
  }
  if (brief.shouldProjectWave44) {
    evidence.push('Agent 25 wave 44 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave45GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave45GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave45GateEma,
    },
  };
}
