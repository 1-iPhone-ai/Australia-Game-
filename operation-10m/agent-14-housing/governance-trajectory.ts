import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  CouplingTrajectoryTrend,
  GovernanceTrajectoryPersisted,
  GovernanceTrajectorySnapshot,
  WellbeingGovernanceBand,
  WellbeingGovernancePanel,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

export function createInitialGovernanceTrajectory(): GovernanceTrajectoryPersisted {
  return {
    schemaVersion: '10.14.36-scale-wave-36' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    governanceScoreEma: 60,
    priorEma: undefined,
  };
}

export function sanitizeGovernanceTrajectory(
  raw?: GovernanceTrajectoryPersisted | null
): GovernanceTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialGovernanceTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const governanceScoreEma =
    typeof raw.governanceScoreEma === 'number' && Number.isFinite(raw.governanceScoreEma)
      ? Math.max(0, Math.min(100, raw.governanceScoreEma))
      : 60;
  return {
    schemaVersion: '10.14.36-scale-wave-36' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    governanceScoreEma,
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
  if (current - previous > epsilon) return 'improving';
  if (previous - current > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromScore(score: number, panelBand: WellbeingGovernanceBand): WellbeingGovernanceBand {
  if (panelBand === 'crisis' || panelBand === 'misaligned') return panelBand;
  if (score >= 72) return 'aligned';
  if (score >= 52) return 'watch';
  return panelBand === 'aligned' ? 'watch' : panelBand;
}

export function advanceGovernanceTrajectory(
  turn: number,
  panel: WellbeingGovernancePanel,
  persisted?: GovernanceTrajectoryPersisted | null
): { snapshot: GovernanceTrajectorySnapshot; persisted: GovernanceTrajectoryPersisted } {
  const base = sanitizeGovernanceTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = panel.governanceScore;
  const priorEma = base.governanceScoreEma;
  const governanceScoreEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(governanceScoreEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'deteriorating') {
    evidence.push(`Governance EMA softening (${priorEma} → ${governanceScoreEma})`);
  } else if (trajectory === 'improving') {
    evidence.push(`Governance EMA recovering (${priorEma} → ${governanceScoreEma})`);
  }
  if (panel.band === 'crisis' || panel.band === 'misaligned') {
    evidence.push(`Instantaneous governance ${panel.band} at ${sample}`);
  }

  return {
    snapshot: {
      turn,
      governanceScoreEma,
      instantaneousScore: sample,
      band: bandFromScore(governanceScoreEma, panel.band),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      governanceScoreEma,
    },
  };
}
