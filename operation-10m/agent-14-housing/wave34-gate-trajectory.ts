import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave33ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave34GateBand,
  Wave34GateTrajectoryPersisted,
  Wave34GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave33ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave33 ? 12 : 66;
  if (!brief.shouldRunO10m198DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave34GateTrajectory(): Wave34GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.44-scale-wave-44' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave34GateEma: 21,
    priorEma: undefined,
  };
}

export function sanitizeWave34GateTrajectory(
  raw?: Wave34GateTrajectoryPersisted | null
): Wave34GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave34GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave34GateEma =
    typeof raw.wave34GateEma === 'number' && Number.isFinite(raw.wave34GateEma)
      ? Math.max(0, Math.min(100, raw.wave34GateEma))
      : 21;
  return {
    schemaVersion: '10.14.44-scale-wave-44' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave34GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave33ProjectionHandoffBrief): Wave34GateBand {
  if (brief.shouldProjectWave33 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave34GateTrajectory(
  turn: number,
  brief: Agent25Wave33ProjectionHandoffBrief,
  persisted?: Wave34GateTrajectoryPersisted | null
): { snapshot: Wave34GateTrajectorySnapshot; persisted: Wave34GateTrajectoryPersisted } {
  const base = sanitizeWave34GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave34GateEma;
  const wave34GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave34GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 34 gate EMA improving (${priorEma} → ${wave34GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 34 gate EMA softening (${priorEma} → ${wave34GateEma})`);
  }
  if (brief.shouldProjectWave33) {
    evidence.push('Agent 25 wave 33 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave34GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave34GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave34GateEma,
    },
  };
}
