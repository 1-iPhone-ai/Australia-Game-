import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  CouplingTrajectoryTrend,
  IntegrationPublishBand,
  IntegrationTrajectoryPersisted,
  IntegrationTrajectorySnapshot,
  WellbeingIntegrationHandoffBrief,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.3;

function publishSample(brief: WellbeingIntegrationHandoffBrief): number {
  let sample = brief.shouldPublishIntegration ? 26 : 74;
  sample -= Math.min(brief.scheduledCommitCount * 4, 16);
  if (brief.deferUntilTurn > brief.turn + 1) {
    sample += 12;
  }
  return Math.max(0, Math.min(100, sample));
}

export function createInitialIntegrationTrajectory(): IntegrationTrajectoryPersisted {
  return {
    schemaVersion: '10.14.35-scale-wave-35' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    integrationReadinessEma: 50,
    priorEma: undefined,
  };
}

export function sanitizeIntegrationTrajectory(
  raw?: IntegrationTrajectoryPersisted | null
): IntegrationTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialIntegrationTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const integrationReadinessEma =
    typeof raw.integrationReadinessEma === 'number' && Number.isFinite(raw.integrationReadinessEma)
      ? Math.max(0, Math.min(100, raw.integrationReadinessEma))
      : 50;
  return {
    schemaVersion: '10.14.35-scale-wave-35' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    integrationReadinessEma,
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

function bandFromReadiness(score: number, brief: WellbeingIntegrationHandoffBrief): IntegrationPublishBand {
  if (brief.shouldPublishIntegration && score <= 40) return 'publish';
  if (score >= 65) return 'hold';
  return 'watch';
}

export function advanceIntegrationTrajectory(
  turn: number,
  brief: WellbeingIntegrationHandoffBrief,
  persisted?: IntegrationTrajectoryPersisted | null
): { snapshot: IntegrationTrajectorySnapshot; persisted: IntegrationTrajectoryPersisted } {
  const base = sanitizeIntegrationTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = publishSample(brief);
  const priorEma = base.integrationReadinessEma;
  const integrationReadinessEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(integrationReadinessEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Integration readiness EMA improving (${priorEma} → ${integrationReadinessEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Integration readiness EMA softening (${priorEma} → ${integrationReadinessEma})`);
  }
  if (brief.shouldPublishIntegration) {
    evidence.push('Integration publish signal active');
  }

  return {
    snapshot: {
      turn,
      integrationReadinessEma,
      instantaneousReadiness: sample,
      band: bandFromReadiness(integrationReadinessEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      integrationReadinessEma,
    },
  };
}
