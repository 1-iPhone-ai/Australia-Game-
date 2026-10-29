import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave57ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave57GateBand,
  Wave57GateTrajectoryPersisted,
  Wave57GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave57ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave57 ? 12 : 66;
  if (!brief.shouldRunO10m254DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave57GateTrajectory(): Wave57GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.57-scale-wave-57' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave57GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave57GateTrajectory(
  raw?: Wave57GateTrajectoryPersisted | null
): Wave57GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave57GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave57GateEma =
    typeof raw.wave57GateEma === 'number' && Number.isFinite(raw.wave57GateEma)
      ? Math.max(0, Math.min(100, raw.wave57GateEma))
      : 9;
  return {
    schemaVersion: '10.14.57-scale-wave-57' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave57GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave57ProjectionHandoffBrief): Wave57GateBand {
  if (brief.shouldProjectWave57 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave57GateTrajectory(
  turn: number,
  brief: Agent25Wave57ProjectionHandoffBrief,
  persisted?: Wave57GateTrajectoryPersisted | null
): { snapshot: Wave57GateTrajectorySnapshot; persisted: Wave57GateTrajectoryPersisted } {
  const base = sanitizeWave57GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave57GateEma;
  const wave57GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave57GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 53 gate EMA improving (${priorEma} → ${wave57GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 53 gate EMA softening (${priorEma} → ${wave57GateEma})`);
  }
  if (brief.shouldProjectWave57) {
    evidence.push('Agent 25 wave 56 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave57GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave57GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave57GateEma,
    },
  };
}
