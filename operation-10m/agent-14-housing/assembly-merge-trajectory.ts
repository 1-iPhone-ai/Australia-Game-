import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  Agent25AssemblyHandoffBrief,
  AssemblyMergeBand,
  AssemblyMergeTrajectoryPersisted,
  AssemblyMergeTrajectorySnapshot,
  CouplingTrajectoryTrend,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function mergeSample(brief: Agent25AssemblyHandoffBrief): number {
  let sample = brief.shouldHandoffChunk ? 25 : 74;
  if (!brief.shouldActivateTurnBoundary) {
    sample += 14;
  }
  sample -= Math.min(brief.headlines.length * 2, 8);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialAssemblyMergeTrajectory(): AssemblyMergeTrajectoryPersisted {
  return {
    schemaVersion: '10.14.51-scale-wave-51' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    assemblyMergeEma: 48,
    priorEma: undefined,
  };
}

export function sanitizeAssemblyMergeTrajectory(
  raw?: AssemblyMergeTrajectoryPersisted | null
): AssemblyMergeTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialAssemblyMergeTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const assemblyMergeEma =
    typeof raw.assemblyMergeEma === 'number' && Number.isFinite(raw.assemblyMergeEma)
      ? Math.max(0, Math.min(100, raw.assemblyMergeEma))
      : 48;
  return {
    schemaVersion: '10.14.51-scale-wave-51' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    assemblyMergeEma,
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

function bandFromMerge(score: number, brief: Agent25AssemblyHandoffBrief): AssemblyMergeBand {
  if (brief.shouldHandoffChunk && score <= 36) return 'ready';
  if (score >= 68) return 'blocked';
  return 'pending';
}

export function advanceAssemblyMergeTrajectory(
  turn: number,
  brief: Agent25AssemblyHandoffBrief,
  persisted?: AssemblyMergeTrajectoryPersisted | null
): { snapshot: AssemblyMergeTrajectorySnapshot; persisted: AssemblyMergeTrajectoryPersisted } {
  const base = sanitizeAssemblyMergeTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = mergeSample(brief);
  const priorEma = base.assemblyMergeEma;
  const assemblyMergeEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(assemblyMergeEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Assembly merge EMA improving (${priorEma} → ${assemblyMergeEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Assembly merge EMA softening (${priorEma} → ${assemblyMergeEma})`);
  }
  if (brief.shouldHandoffChunk) {
    evidence.push('Agent 25 assembly handoff signal active');
  }

  return {
    snapshot: {
      turn,
      assemblyMergeEma,
      instantaneousMerge: sample,
      band: bandFromMerge(assemblyMergeEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      assemblyMergeEma,
    },
  };
}
