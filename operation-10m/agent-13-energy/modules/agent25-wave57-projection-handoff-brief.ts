/**
 * Agent 25 projection handoff brief — wave 57 (O10-257) @ integration baseline c4bbec67 / 3,054,213 projected.
 */

export interface Agent25Wave57IntegrationMonitor {
  shouldRunO10m257DryRun: boolean;
  wave57GateBand: 'ready' | 'blocked' | 'pending';
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
}

export interface Agent25Wave57GateTrajectorySnapshot {
  trajectory: 'improving' | 'stable' | 'deteriorating';
  band: 'ready' | 'watch' | 'blocked';
}

export interface Agent25Wave57ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave57: boolean;
  shouldRunO10m257DryRun: boolean;
  integrationBaselineSha: string;
  projectedAuditedFunctional: number;
  headlines: string[];
  summary: string;
}

export function composeAgent25Wave57ProjectionHandoffBrief(args: {
  turn: number;
  wave57IntegrationMonitor: Agent25Wave57IntegrationMonitor;
  wave57GateTrajectory?: Agent25Wave57GateTrajectorySnapshot;
}): Agent25Wave57ProjectionHandoffBrief {
  const shouldProjectWave57 =
    args.wave57IntegrationMonitor.shouldRunO10m257DryRun &&
    args.wave57GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave57) {
    headlines.push('Agent 25: project wave 55 module gate / O10-257 dry-run');
  } else {
    headlines.push('Agent 25 wave 56 projection deferred — integration gate not stable');
  }
  if (args.wave57GateTrajectory?.band === 'ready') {
    headlines.push('Wave 56 gate trajectory ready for O10-257 projection handoff');
  }
  if (args.wave57IntegrationMonitor.wave57GateBand === 'blocked') {
    headlines.push('Wave 56 gate blocked — hold O10-257 handoff');
  }

  const summary = `project=${shouldProjectWave57} o10m254=${args.wave57IntegrationMonitor.shouldRunO10m257DryRun} baseline=${args.wave57IntegrationMonitor.integrationBaselineSha.slice(0, 8)} projected=${args.wave57IntegrationMonitor.projectedAuditedFunctional}`;

  return {
    turn: args.turn,
    shouldProjectWave57,
    shouldRunO10m257DryRun: args.wave57IntegrationMonitor.shouldRunO10m257DryRun,
    integrationBaselineSha: args.wave57IntegrationMonitor.integrationBaselineSha,
    projectedAuditedFunctional: args.wave57IntegrationMonitor.projectedAuditedFunctional,
    headlines: headlines.slice(0, 3),
    summary,
  };
}

export function runAgent13Agent25Wave57ProjectionHandoffBriefSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  const brief = composeAgent25Wave57ProjectionHandoffBrief({
    turn: 57,
    wave57IntegrationMonitor: {
      shouldRunO10m257DryRun: true,
      wave57GateBand: 'ready',
      integrationBaselineSha: '93c42b3d82e3700a0f14db0b66522b05bb1d6aec',
      projectedAuditedFunctional: 3_112_667,
    },
    wave57GateTrajectory: { trajectory: 'stable', band: 'ready' },
  });
  ok(brief.shouldProjectWave57);
  ok(brief.projectedAuditedFunctional === 3_112_667);
  ok(brief.integrationBaselineSha.startsWith('93c42b3d'));
  ok(brief.headlines.length >= 1);

  return { passed, failed, total: passed + failed };
}
