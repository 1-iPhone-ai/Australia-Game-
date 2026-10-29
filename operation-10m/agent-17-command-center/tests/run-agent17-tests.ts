#!/usr/bin/env node
import { runAgent17Acc17DevTests } from '../harness/run-acc17-dev-tests.ts';
import { runAgent17RecoveryPathTests } from '../harness/run-recovery-path-tests.ts';
import { runAgent17PlanningDepthTests } from '../harness/run-planning-depth-tests.ts';
import { verifyAgent17Goals, validateGoalRegistryCoverage } from '../validation/goal-verification.ts';
import { createAgent17RollbackController } from '../rollback/rollback-controller.ts';

const devReport = runAgent17Acc17DevTests();
const recoveryReport = runAgent17RecoveryPathTests();
const depthReport = runAgent17PlanningDepthTests();
const combinedSuccess = devReport.success && recoveryReport.success && depthReport.success;
const lastDevReport = {
  ...devReport,
  totalTests: devReport.totalTests + recoveryReport.totalTests + depthReport.totalTests,
  passedCount: devReport.passedCount + recoveryReport.passedCount + depthReport.passedCount,
  failedCount: devReport.failedCount + recoveryReport.failedCount + depthReport.failedCount,
  success: combinedSuccess,
  overallStatus: combinedSuccess ? ('passed' as const) : ('failed' as const),
  testResults: [...devReport.testResults, ...recoveryReport.testResults, ...depthReport.testResults],
  summary: `Agent 17 combined: ${devReport.passedCount + recoveryReport.passedCount + depthReport.passedCount}/${devReport.totalTests + recoveryReport.totalTests + depthReport.totalTests} passed`,
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
  validationReport,
  goalRegistryCoverage: coverage,
  exitCode,
};

console.log(JSON.stringify(payload, null, 2));
process.exit(exitCode);
