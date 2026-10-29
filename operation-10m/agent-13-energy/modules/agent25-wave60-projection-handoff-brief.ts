/**
 * Agent 25 projection handoff brief — wave 57 (O10-265) @ integration baseline c4bbec67 / 3,054,213 projected.
 */

export interface Agent25Wave60IntegrationMonitor {
  shouldRunO10m265DryRun: boolean;
  wave60GateBand: 'ready' | 'blocked' | 'pending';
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
}

export interface Agent25Wave60GateTrajectorySnapshot {
  trajectory: 'improving' | 'stable' | 'deteriorating';
  band: 'ready' | 'watch' | 'blocked';
}

export interface Agent25Wave60ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave60: boolean;
  shouldRunO10m265DryRun: boolean;
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
  headlines: string[];
  summary: string;
}

export function composeAgent25Wave60ProjectionHandoffBrief(args: {
  turn: number;
  wave60IntegrationMonitor: Agent25Wave60IntegrationMonitor;
  wave60GateTrajectory?: Agent25Wave60GateTrajectorySnapshot;
}): Agent25Wave60ProjectionHandoffBrief {
  const shouldProjectWave60 =
    args.wave60IntegrationMonitor.shouldRunO10m265DryRun &&
    args.wave60GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave60) {
    headlines.push('Agent 25: project wave 55 module gate / O10-265 dry-run');
  } else {
    headlines.push('Agent 25 wave 56 projection deferred — integration gate not stable');
  }
  if (args.wave60GateTrajectory?.band === 'ready') {
    headlines.push('Wave 56 gate trajectory ready for O10-265 projection handoff');
  }
  if (args.wave60IntegrationMonitor.wave60GateBand === 'blocked') {
    headlines.push('Wave 56 gate blocked — hold O10-265 handoff');
  }

  const summary = `project=${shouldProjectWave60} o10m254=${args.wave60IntegrationMonitor.shouldRunO10m265DryRun} baseline=${args.wave60IntegrationMonitor.integrationBaselineSha.slice(0, 8)} projected=${args.wave60IntegrationMonitor.projectedAuditedFunctional}`;

  return {
    turn: args.turn,
    shouldProjectWave60,
    shouldRunO10m265DryRun: args.wave60IntegrationMonitor.shouldRunO10m265DryRun,
    integrationBaselineSha: args.wave60IntegrationMonitor.integrationBaselineSha,
    projectedAuditedFunctional: args.wave60IntegrationMonitor.projectedAuditedFunctional,
    headlines: headlines.slice(0, 3),
    summary,
  };
}

export function runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  const brief = composeAgent25Wave60ProjectionHandoffBrief({
    turn: 57,
    wave60IntegrationMonitor: {
      shouldRunO10m265DryRun: true,
      wave60GateBand: 'ready',
      integrationBaselineSha: 'af6c94f05d6c6b2bfc6c909226283e5ce1dcb525',
      projectedAuditedFunctional: 3_201_323,
    },
    wave60GateTrajectory: { trajectory: 'stable', band: 'ready' },
  });
  ok(brief.shouldProjectWave60);
  ok(brief.projectedAuditedFunctional === 3_201_323);
  ok(brief.integrationBaselineSha.startsWith('af6c94f0'));
  ok(brief.headlines.length >= 1);

  return { passed, failed, total: passed + failed };
}
