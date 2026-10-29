import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  CouplingTrajectoryTrend,
  NationalWireInReadinessBrief,
  WireInActivationBand,
  WireInTrajectoryPersisted,
  WireInTrajectorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function activationSample(brief: NationalWireInReadinessBrief): number {
  let sample = brief.shouldWireNationalTurn ? 27 : 73;
  sample -= Math.min(brief.dueCommitCount * 5, 20);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWireInTrajectory(): WireInTrajectoryPersisted {
  return {
    schemaVersion: '10.14.55-scale-wave-55' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wireInActivationEma: 50,
    priorEma: undefined,
  };
}

export function sanitizeWireInTrajectory(
  raw?: WireInTrajectoryPersisted | null
): WireInTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWireInTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wireInActivationEma =
    typeof raw.wireInActivationEma === 'number' && Number.isFinite(raw.wireInActivationEma)
      ? Math.max(0, Math.min(100, raw.wireInActivationEma))
      : 50;
  return {
    schemaVersion: '10.14.55-scale-wave-55' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wireInActivationEma,
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

function bandFromActivation(score: number, brief: NationalWireInReadinessBrief): WireInActivationBand {
  if (brief.shouldWireNationalTurn && score <= 38) return 'active';
  if (score >= 66) return 'blocked';
  return 'pending';
}

export function advanceWireInTrajectory(
  turn: number,
  brief: NationalWireInReadinessBrief,
  persisted?: WireInTrajectoryPersisted | null
): { snapshot: WireInTrajectorySnapshot; persisted: WireInTrajectoryPersisted } {
  const base = sanitizeWireInTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = activationSample(brief);
  const priorEma = base.wireInActivationEma;
  const wireInActivationEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wireInActivationEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wire-in activation EMA improving (${priorEma} → ${wireInActivationEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wire-in activation EMA softening (${priorEma} → ${wireInActivationEma})`);
  }
  if (brief.shouldWireNationalTurn) {
    evidence.push('National wire-in signal active');
  }

  return {
    snapshot: {
      turn,
      wireInActivationEma,
      instantaneousActivation: sample,
      band: bandFromActivation(wireInActivationEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wireInActivationEma,
    },
  };
}
