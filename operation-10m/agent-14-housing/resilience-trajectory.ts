import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  ResilienceTrajectoryPersisted,
  ResilienceTrajectorySnapshot,
  WellbeingResilienceBand,
  WellbeingResilienceSnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.32;

export function createInitialResilienceTrajectory(): ResilienceTrajectoryPersisted {
  return {
    schemaVersion: '10.14.25-scale-wave-25' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    resilienceIndexEma: 58,
    priorEma: undefined,
  };
}

export function sanitizeResilienceTrajectory(
  raw?: ResilienceTrajectoryPersisted | null
): ResilienceTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialResilienceTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const resilienceIndexEma =
    typeof raw.resilienceIndexEma === 'number' && Number.isFinite(raw.resilienceIndexEma)
      ? Math.max(0, Math.min(100, raw.resilienceIndexEma))
      : 58;
  return {
    schemaVersion: '10.14.25-scale-wave-25' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    resilienceIndexEma,
    priorEma:
      typeof raw.priorEma === 'number' && Number.isFinite(raw.priorEma)
        ? Math.max(0, Math.min(100, raw.priorEma))
        : undefined,
  };
}

function trajectoryFromDelta(
  current: number,
  previous: number | undefined,
  epsilon = 0.9
): ResilienceTrajectorySnapshot['trajectory'] {
  if (previous === undefined) return 'flat';
  if (current - previous > epsilon) return 'improving';
  if (previous - current > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromIndex(index: number): WellbeingResilienceBand {
  if (index >= 72) return 'robust';
  if (index >= 55) return 'steady';
  if (index >= 38) return 'fragile';
  return 'critical';
}

export function advanceResilienceTrajectory(
  turn: number,
  resilience: WellbeingResilienceSnapshot,
  persisted?: ResilienceTrajectoryPersisted | null
): { snapshot: ResilienceTrajectorySnapshot; persisted: ResilienceTrajectoryPersisted } {
  const base = sanitizeResilienceTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = resilience.resilienceIndex;
  const priorEma = base.resilienceIndexEma;
  const resilienceIndexEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(resilienceIndexEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'deteriorating') {
    evidence.push(`Resilience EMA softening (${priorEma} → ${resilienceIndexEma})`);
  } else if (trajectory === 'improving') {
    evidence.push(`Resilience EMA recovering (${priorEma} → ${resilienceIndexEma})`);
  }
  if (resilience.band === 'critical' || resilience.band === 'fragile') {
    evidence.push(`Instantaneous resilience ${resilience.band} at ${sample}`);
  }

  return {
    snapshot: {
      turn,
      resilienceIndexEma,
      instantaneousIndex: sample,
      band: bandFromIndex(resilienceIndexEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      resilienceIndexEma,
    },
  };
}
