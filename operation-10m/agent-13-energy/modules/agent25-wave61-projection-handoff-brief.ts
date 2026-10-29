/**
 * Agent 25 projection handoff brief — wave 57 (O10-267) @ integration baseline c4bbec67 / 3,054,213 projected.
 */

export interface Agent25Wave61IntegrationMonitor {
  shouldRunO10m267DryRun: boolean;
  wave61GateBand: 'ready' | 'blocked' | 'pending';
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
}

export interface Agent25Wave61GateTrajectorySnapshot {
  trajectory: 'improving' | 'stable' | 'deteriorating';
  band: 'ready' | 'watch' | 'blocked';
}

export interface Agent25Wave61ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave61: boolean;
  shouldRunO10m267DryRun: boolean;
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
  headlines: string[];
  summary: string;
}

export function composeAgent25Wave61ProjectionHandoffBrief(args: {
  turn: number;
  wave61IntegrationMonitor: Agent25Wave61IntegrationMonitor;
  wave61GateTrajectory?: Agent25Wave61GateTrajectorySnapshot;
}): Agent25Wave61ProjectionHandoffBrief {
  const shouldProjectWave61 =
    args.wave61IntegrationMonitor.shouldRunO10m267DryRun &&
    args.wave61GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave61) {
    headlines.push('Agent 25: project wave 55 module gate / O10-267 dry-run');
  } else {
    headlines.push('Agent 25 wave 56 projection deferred — integration gate not stable');
  }
  if (args.wave61GateTrajectory?.band === 'ready') {
    headlines.push('Wave 56 gate trajectory ready for O10-267 projection handoff');
  }
  if (args.wave61IntegrationMonitor.wave61GateBand === 'blocked') {
    headlines.push('Wave 56 gate blocked — hold O10-267 handoff');
  }

  const summary = `project=${shouldProjectWave61} o10m254=${args.wave61IntegrationMonitor.shouldRunO10m267DryRun} baseline=${args.wave61IntegrationMonitor.integrationBaselineSha.slice(0, 8)} projected=${args.wave61IntegrationMonitor.projectedAuditedFunctional}`;

  return {
    turn: args.turn,
    shouldProjectWave61,
    shouldRunO10m267DryRun: args.wave61IntegrationMonitor.shouldRunO10m267DryRun,
    integrationBaselineSha: args.wave61IntegrationMonitor.integrationBaselineSha,
    projectedAuditedFunctional: args.wave61IntegrationMonitor.projectedAuditedFunctional,
    headlines: headlines.slice(0, 3),
    summary,
  };
}

export function runAgent13Agent25Wave61ProjectionHandoffBriefSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  const brief = composeAgent25Wave61ProjectionHandoffBrief({
    turn: 57,
    wave61IntegrationMonitor: {
      shouldRunO10m267DryRun: true,
      wave61GateBand: 'ready',
      integrationBaselineSha: '7f862be03eba92ecc85d27e54e20c72cd3d2d9cd',
      projectedAuditedFunctional: 3_220_075,
    },
    wave61GateTrajectory: { trajectory: 'stable', band: 'ready' },
  });
  ok(brief.shouldProjectWave61);
  ok(brief.projectedAuditedFunctional === 3_220_075);
  ok(brief.integrationBaselineSha.startsWith('7f862be0'));
  ok(brief.headlines.length >= 1);

  return { passed, failed, total: passed + failed };
}
