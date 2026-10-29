import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave19ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave20GateBand,
  Wave20GateTrajectoryPersisted,
  Wave20GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave19ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave19 ? 17 : 71;
  if (!brief.shouldRunO10m169DryRun) {
    sample += 13;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave20GateTrajectory(): Wave20GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.25-scale-wave-25' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave20GateEma: 40,
    priorEma: undefined,
  };
}

export function sanitizeWave20GateTrajectory(
  raw?: Wave20GateTrajectoryPersisted | null
): Wave20GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave20GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave20GateEma =
    typeof raw.wave20GateEma === 'number' && Number.isFinite(raw.wave20GateEma)
      ? Math.max(0, Math.min(100, raw.wave20GateEma))
      : 40;
  return {
    schemaVersion: '10.14.25-scale-wave-25' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave20GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave19ProjectionHandoffBrief): Wave20GateBand {
  if (brief.shouldProjectWave19 && score <= 31) return 'ready';
  if (score >= 65) return 'blocked';
  return 'pending';
}

export function advanceWave20GateTrajectory(
  turn: number,
  brief: Agent25Wave19ProjectionHandoffBrief,
  persisted?: Wave20GateTrajectoryPersisted | null
): { snapshot: Wave20GateTrajectorySnapshot; persisted: Wave20GateTrajectoryPersisted } {
  const base = sanitizeWave20GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave20GateEma;
  const wave20GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave20GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 20 gate EMA improving (${priorEma} → ${wave20GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 20 gate EMA softening (${priorEma} → ${wave20GateEma})`);
  }
  if (brief.shouldProjectWave19) {
    evidence.push('Agent 25 wave 19 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave20GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave20GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave20GateEma,
    },
  };
}
