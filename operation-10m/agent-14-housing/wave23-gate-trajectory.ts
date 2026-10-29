import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave22ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave23GateBand,
  Wave23GateTrajectoryPersisted,
  Wave23GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave22ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave22 ? 14 : 68;
  if (!brief.shouldRunO10m176DryRun) {
    sample += 10;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave23GateTrajectory(): Wave23GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.34-scale-wave-34' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave23GateEma: 34,
    priorEma: undefined,
  };
}

export function sanitizeWave23GateTrajectory(
  raw?: Wave23GateTrajectoryPersisted | null
): Wave23GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave23GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave23GateEma =
    typeof raw.wave23GateEma === 'number' && Number.isFinite(raw.wave23GateEma)
      ? Math.max(0, Math.min(100, raw.wave23GateEma))
      : 34;
  return {
    schemaVersion: '10.14.34-scale-wave-34' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave23GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave22ProjectionHandoffBrief): Wave23GateBand {
  if (brief.shouldProjectWave22 && score <= 28) return 'ready';
  if (score >= 62) return 'blocked';
  return 'pending';
}

export function advanceWave23GateTrajectory(
  turn: number,
  brief: Agent25Wave22ProjectionHandoffBrief,
  persisted?: Wave23GateTrajectoryPersisted | null
): { snapshot: Wave23GateTrajectorySnapshot; persisted: Wave23GateTrajectoryPersisted } {
  const base = sanitizeWave23GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave23GateEma;
  const wave23GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave23GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 23 gate EMA improving (${priorEma} → ${wave23GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 23 gate EMA softening (${priorEma} → ${wave23GateEma})`);
  }
  if (brief.shouldProjectWave22) {
    evidence.push('Agent 25 wave 22 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave23GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave23GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave23GateEma,
    },
  };
}
