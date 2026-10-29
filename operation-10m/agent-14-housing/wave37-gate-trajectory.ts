import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave36ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave37GateBand,
  Wave37GateTrajectoryPersisted,
  Wave37GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave36ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave36 ? 12 : 66;
  if (!brief.shouldRunO10m204DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave37GateTrajectory(): Wave37GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.37-scale-wave-37' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave37GateEma: 18,
    priorEma: undefined,
  };
}

export function sanitizeWave37GateTrajectory(
  raw?: Wave37GateTrajectoryPersisted | null
): Wave37GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave37GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave37GateEma =
    typeof raw.wave37GateEma === 'number' && Number.isFinite(raw.wave37GateEma)
      ? Math.max(0, Math.min(100, raw.wave37GateEma))
      : 18;
  return {
    schemaVersion: '10.14.37-scale-wave-37' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave37GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave36ProjectionHandoffBrief): Wave37GateBand {
  if (brief.shouldProjectWave36 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave37GateTrajectory(
  turn: number,
  brief: Agent25Wave36ProjectionHandoffBrief,
  persisted?: Wave37GateTrajectoryPersisted | null
): { snapshot: Wave37GateTrajectorySnapshot; persisted: Wave37GateTrajectoryPersisted } {
  const base = sanitizeWave37GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave37GateEma;
  const wave37GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave37GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 37 gate EMA improving (${priorEma} → ${wave37GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 37 gate EMA softening (${priorEma} → ${wave37GateEma})`);
  }
  if (brief.shouldProjectWave36) {
    evidence.push('Agent 25 wave 36 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave37GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave37GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave37GateEma,
    },
  };
}
