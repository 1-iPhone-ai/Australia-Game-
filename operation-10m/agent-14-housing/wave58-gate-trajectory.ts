import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave58ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave58GateBand,
  Wave58GateTrajectoryPersisted,
  Wave58GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave58ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave58 ? 12 : 66;
  if (!brief.shouldRunO10m257DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave58GateTrajectory(): Wave58GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.57-scale-wave-58' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave58GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave58GateTrajectory(
  raw?: Wave58GateTrajectoryPersisted | null
): Wave58GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave58GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave58GateEma =
    typeof raw.wave58GateEma === 'number' && Number.isFinite(raw.wave58GateEma)
      ? Math.max(0, Math.min(100, raw.wave58GateEma))
      : 9;
  return {
    schemaVersion: '10.14.57-scale-wave-58' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave58GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave58ProjectionHandoffBrief): Wave58GateBand {
  if (brief.shouldProjectWave58 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave58GateTrajectory(
  turn: number,
  brief: Agent25Wave58ProjectionHandoffBrief,
  persisted?: Wave58GateTrajectoryPersisted | null
): { snapshot: Wave58GateTrajectorySnapshot; persisted: Wave58GateTrajectoryPersisted } {
  const base = sanitizeWave58GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave58GateEma;
  const wave58GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave58GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 53 gate EMA improving (${priorEma} → ${wave58GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 53 gate EMA softening (${priorEma} → ${wave58GateEma})`);
  }
  if (brief.shouldProjectWave58) {
    evidence.push('Agent 25 wave 56 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave58GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave58GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave58GateEma,
    },
  };
}
