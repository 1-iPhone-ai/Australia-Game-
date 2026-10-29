import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  CouplingStressBand,
  CouplingTrajectoryPersisted,
  CouplingTrajectorySnapshot,
  CrossPillarCouplingSnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.4;

export function createInitialCouplingTrajectory(): CouplingTrajectoryPersisted {
  return {
    schemaVersion: '10.14.43-scale-wave-43' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    nationalCouplingEma: 58,
    priorEma: undefined,
  };
}

export function sanitizeCouplingTrajectory(
  raw?: CouplingTrajectoryPersisted | null
): CouplingTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialCouplingTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const nationalCouplingEma =
    typeof raw.nationalCouplingEma === 'number' && Number.isFinite(raw.nationalCouplingEma)
      ? Math.max(0, Math.min(100, raw.nationalCouplingEma))
      : 58;
  return {
    schemaVersion: '10.14.43-scale-wave-43' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    nationalCouplingEma,
    priorEma:
      typeof raw.priorEma === 'number' && Number.isFinite(raw.priorEma)
        ? Math.max(0, Math.min(100, raw.priorEma))
        : undefined,
  };
}

function trajectoryFromDelta(
  current: number,
  previous: number | undefined,
  epsilon = 0.6
): CouplingTrajectorySnapshot['trajectory'] {
  if (previous === undefined) return 'flat';
  if (current - previous > epsilon) return 'improving';
  if (previous - current > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromCoupling(index: number): CouplingStressBand {
  if (index >= 72) return 'stable';
  if (index >= 55) return 'watch';
  if (index >= 38) return 'strained';
  return 'critical';
}

export function advanceCouplingTrajectory(
  turn: number,
  coupling: CrossPillarCouplingSnapshot,
  persisted?: CouplingTrajectoryPersisted | null
): { snapshot: CouplingTrajectorySnapshot; persisted: CouplingTrajectoryPersisted } {
  const base = sanitizeCouplingTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = coupling.nationalCouplingIndex;
  const priorEma = base.nationalCouplingEma;
  const nationalCouplingEma =
    Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(nationalCouplingEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'deteriorating') {
    evidence.push(`Coupling EMA slipping (${priorEma} → ${nationalCouplingEma})`);
  } else if (trajectory === 'improving') {
    evidence.push(`Coupling EMA recovering (${priorEma} → ${nationalCouplingEma})`);
  }
  if (coupling.band === 'critical' || coupling.band === 'strained') {
    evidence.push(`Instantaneous coupling ${coupling.band} at ${sample}`);
  }

  return {
    snapshot: {
      turn,
      nationalCouplingEma,
      instantaneousIndex: sample,
      band: bandFromCoupling(nationalCouplingEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      nationalCouplingEma,
    },
  };
}
