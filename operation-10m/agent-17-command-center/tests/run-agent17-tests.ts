#!/usr/bin/env node
import { runAgent17Acc17DevTests } from '../harness/run-acc17-dev-tests.ts';
import { runAgent17RecoveryPathTests } from '../harness/run-recovery-path-tests.ts';
import { runAgent17PlanningDepthTests } from '../harness/run-planning-depth-tests.ts';
import { runAgent17DelegationDepthTests } from '../harness/run-delegation-depth-tests.ts';
import { verifyAgent17Goals, validateGoalRegistryCoverage } from '../validation/goal-verification.ts';
import { createAgent17RollbackController } from '../rollback/rollback-controller.ts';

const devReport = runAgent17Acc17DevTests();
const recoveryReport = runAgent17RecoveryPathTests();
const depthReport = runAgent17PlanningDepthTests();
const delegationReport = runAgent17DelegationDepthTests();
const combinedSuccess =
  devReport.success &&
  recoveryReport.success &&
  depthReport.success &&
  delegationReport.success;
const lastDevReport = {
  ...devReport,
  totalTests:
    devReport.totalTests +
    recoveryReport.totalTests +
    depthReport.totalTests +
    delegationReport.totalTests,
  passedCount:
    devReport.passedCount +
    recoveryReport.passedCount +
    depthReport.passedCount +
    delegationReport.passedCount,
  failedCount:
    devReport.failedCount +
    recoveryReport.failedCount +
    depthReport.failedCount +
    delegationReport.failedCount,
  success: combinedSuccess,
  overallStatus: combinedSuccess ? ('passed' as const) : ('failed' as const),
  testResults: [
    ...devReport.testResults,
    ...recoveryReport.testResults,
    ...depthReport.testResults,
    ...delegationReport.testResults,
  ],
  summary: `Agent 17 combined: ${
    devReport.passedCount +
    recoveryReport.passedCount +
    depthReport.passedCount +
    delegationReport.passedCount
  }/${
    devReport.totalTests +
    recoveryReport.totalTests +
    depthReport.totalTests +
    delegationReport.totalTests
  } passed`,
};
const rollback = createAgent17RollbackController();
const validationReport = verifyAgent17Goals({ rollback, lastDevReport });
const coverage = validateGoalRegistryCoverage();

const exitCode =
  combinedSuccess && validationReport.success && coverage.ok ? 0 : 1;

const payload = {
  devReport,
  recoveryReport,
  depthReport,
  delegationReport,
  validationReport,
  goalRegistryCoverage: coverage,
  exitCode,
};

console.log(JSON.stringify(payload, null, 2));
process.exit(exitCode);
