import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave38ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave39GateBand,
  Wave39GateTrajectoryPersisted,
  Wave39GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave38ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave38 ? 12 : 66;
  if (!brief.shouldRunO10m208DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave39GateTrajectory(): Wave39GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.43-scale-wave-43' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave39GateEma: 16,
    priorEma: undefined,
  };
}

export function sanitizeWave39GateTrajectory(
  raw?: Wave39GateTrajectoryPersisted | null
): Wave39GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave39GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave39GateEma =
    typeof raw.wave39GateEma === 'number' && Number.isFinite(raw.wave39GateEma)
      ? Math.max(0, Math.min(100, raw.wave39GateEma))
      : 16;
  return {
    schemaVersion: '10.14.43-scale-wave-43' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave39GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave38ProjectionHandoffBrief): Wave39GateBand {
  if (brief.shouldProjectWave38 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave39GateTrajectory(
  turn: number,
  brief: Agent25Wave38ProjectionHandoffBrief,
  persisted?: Wave39GateTrajectoryPersisted | null
): { snapshot: Wave39GateTrajectorySnapshot; persisted: Wave39GateTrajectoryPersisted } {
  const base = sanitizeWave39GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave39GateEma;
  const wave39GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave39GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 39 gate EMA improving (${priorEma} → ${wave39GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 39 gate EMA softening (${priorEma} → ${wave39GateEma})`);
  }
  if (brief.shouldProjectWave38) {
    evidence.push('Agent 25 wave 38 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave39GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave39GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave39GateEma,
    },
  };
}
