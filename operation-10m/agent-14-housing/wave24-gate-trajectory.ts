import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave23ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave24GateBand,
  Wave24GateTrajectoryPersisted,
  Wave24GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave23ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave23 ? 13 : 67;
  if (!brief.shouldRunO10m178DryRun) {
    sample += 9;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave24GateTrajectory(): Wave24GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.24-scale-wave-24' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave24GateEma: 32,
    priorEma: undefined,
  };
}

export function sanitizeWave24GateTrajectory(
  raw?: Wave24GateTrajectoryPersisted | null
): Wave24GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave24GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave24GateEma =
    typeof raw.wave24GateEma === 'number' && Number.isFinite(raw.wave24GateEma)
      ? Math.max(0, Math.min(100, raw.wave24GateEma))
      : 32;
  return {
    schemaVersion: '10.14.24-scale-wave-24' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave24GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave23ProjectionHandoffBrief): Wave24GateBand {
  if (brief.shouldProjectWave23 && score <= 27) return 'ready';
  if (score >= 61) return 'blocked';
  return 'pending';
}

export function advanceWave24GateTrajectory(
  turn: number,
  brief: Agent25Wave23ProjectionHandoffBrief,
  persisted?: Wave24GateTrajectoryPersisted | null
): { snapshot: Wave24GateTrajectorySnapshot; persisted: Wave24GateTrajectoryPersisted } {
  const base = sanitizeWave24GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave24GateEma;
  const wave24GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave24GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 24 gate EMA improving (${priorEma} → ${wave24GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 24 gate EMA softening (${priorEma} → ${wave24GateEma})`);
  }
  if (brief.shouldProjectWave23) {
    evidence.push('Agent 25 wave 23 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave24GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave24GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave24GateEma,
    },
  };
}
