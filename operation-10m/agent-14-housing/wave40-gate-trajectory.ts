import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25Wave39ProjectionHandoffBrief,
  CouplingTrajectoryTrend,
  Wave40GateBand,
  Wave40GateTrajectoryPersisted,
  Wave40GateTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave39ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave39 ? 12 : 66;
  if (!brief.shouldRunO10m210DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave40GateTrajectory(): Wave40GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.42-scale-wave-42' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave40GateEma: 15,
    priorEma: undefined,
  };
}

export function sanitizeWave40GateTrajectory(
  raw?: Wave40GateTrajectoryPersisted | null
): Wave40GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave40GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave40GateEma =
    typeof raw.wave40GateEma === 'number' && Number.isFinite(raw.wave40GateEma)
      ? Math.max(0, Math.min(100, raw.wave40GateEma))
      : 15;
  return {
    schemaVersion: '10.14.42-scale-wave-42' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave40GateEma,
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

function bandFromGate(score: number, brief: Agent25Wave39ProjectionHandoffBrief): Wave40GateBand {
  if (brief.shouldProjectWave39 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave40GateTrajectory(
  turn: number,
  brief: Agent25Wave39ProjectionHandoffBrief,
  persisted?: Wave40GateTrajectoryPersisted | null
): { snapshot: Wave40GateTrajectorySnapshot; persisted: Wave40GateTrajectoryPersisted } {
  const base = sanitizeWave40GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave40GateEma;
  const wave40GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave40GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 40 gate EMA improving (${priorEma} → ${wave40GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 40 gate EMA softening (${priorEma} → ${wave40GateEma})`);
  }
  if (brief.shouldProjectWave39) {
    evidence.push('Agent 25 wave 39 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave40GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave40GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave40GateEma,
    },
  };
}
