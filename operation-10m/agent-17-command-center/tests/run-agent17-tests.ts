#!/usr/bin/env node
import { runAgent17Acc17DevTests } from '../harness/run-acc17-dev-tests.ts';
import { runAgent17RecoveryPathTests } from '../harness/run-recovery-path-tests.ts';
import { verifyAgent17Goals, validateGoalRegistryCoverage } from '../validation/goal-verification.ts';
import { createAgent17RollbackController } from '../rollback/rollback-controller.ts';

const devReport = runAgent17Acc17DevTests();
const recoveryReport = runAgent17RecoveryPathTests();
const combinedSuccess = devReport.success && recoveryReport.success;
const lastDevReport = {
  ...devReport,
  totalTests: devReport.totalTests + recoveryReport.totalTests,
  passedCount: devReport.passedCount + recoveryReport.passedCount,
  failedCount: devReport.failedCount + recoveryReport.failedCount,
  success: combinedSuccess,
  overallStatus: combinedSuccess ? ('passed' as const) : ('failed' as const),
  testResults: [...devReport.testResults, ...recoveryReport.testResults],
  summary: `Agent 17 combined: ${devReport.passedCount + recoveryReport.passedCount}/${devReport.totalTests + recoveryReport.totalTests} passed`,
};
const rollback = createAgent17RollbackController();
const validationReport = verifyAgent17Goals({ rollback, lastDevReport });
const coverage = validateGoalRegistryCoverage();

const exitCode =
  combinedSuccess && validationReport.success && coverage.ok ? 0 : 1;

const payload = {
  devReport,
  recoveryReport,
  validationReport,
  goalRegistryCoverage: coverage,
  exitCode,
};

console.log(JSON.stringify(payload, null, 2));
process.exit(exitCode);
