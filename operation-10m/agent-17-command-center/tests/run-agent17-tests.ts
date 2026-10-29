#!/usr/bin/env node
import { runAgent17Acc17DevTests } from '../harness/run-acc17-dev-tests.ts';
import { verifyAgent17Goals, validateGoalRegistryCoverage } from '../validation/goal-verification.ts';
import { createAgent17RollbackController } from '../rollback/rollback-controller.ts';

const devReport = runAgent17Acc17DevTests();
const rollback = createAgent17RollbackController();
const validationReport = verifyAgent17Goals({ rollback, lastDevReport: devReport });
const coverage = validateGoalRegistryCoverage();

const exitCode =
  devReport.success && validationReport.success && coverage.ok ? 0 : 1;

const payload = {
  devReport,
  validationReport,
  goalRegistryCoverage: coverage,
  exitCode,
};

console.log(JSON.stringify(payload, null, 2));
process.exit(exitCode);
