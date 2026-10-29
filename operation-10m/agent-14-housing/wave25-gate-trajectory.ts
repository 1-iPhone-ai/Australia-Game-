import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave24ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave25GateBand,
  Wave25GateTrajectoryPersisted,
  Wave25GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave24ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave24 ? 12 : 66;
  if (!brief.shouldRunO10m180DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave25GateTrajectory(): Wave25GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.37-scale-wave-37' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave25GateEma: 30,
    priorEma: undefined,
  };
}

export function sanitizeWave25GateTrajectory(
  raw?: Wave25GateTrajectoryPersisted | null
): Wave25GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave25GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave25GateEma =
    typeof raw.wave25GateEma === 'number' && Number.isFinite(raw.wave25GateEma)
      ? Math.max(0, Math.min(100, raw.wave25GateEma))
      : 30;
  return {
    schemaVersion: '10.14.37-scale-wave-37' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave25GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave24ProjectionHandoffBrief): Wave25GateBand {
  if (brief.shouldProjectWave24 && score <= 26) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave25GateTrajectory(
  turn: number,
  brief: Agent25Wave24ProjectionHandoffBrief,
  persisted?: Wave25GateTrajectoryPersisted | null
): { snapshot: Wave25GateTrajectorySnapshot; persisted: Wave25GateTrajectoryPersisted } {
  const base = sanitizeWave25GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave25GateEma;
  const wave25GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave25GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 25 gate EMA improving (${priorEma} → ${wave25GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 25 gate EMA softening (${priorEma} → ${wave25GateEma})`);
  }
  if (brief.shouldProjectWave24) {
    evidence.push('Agent 25 wave 24 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave25GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave25GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave25GateEma,
    },
  };
}
