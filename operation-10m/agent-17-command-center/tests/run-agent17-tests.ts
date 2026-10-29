#!/usr/bin/env node
import { runAgent17Acc17DevTests } from '../harness/run-acc17-dev-tests.ts';
import { runAgent17RecoveryPathTests } from '../harness/run-recovery-path-tests.ts';
import { runAgent17PlanningDepthTests } from '../harness/run-planning-depth-tests.ts';
import { runAgent17DelegationDepthTests } from '../harness/run-delegation-depth-tests.ts';
import { runAgent17CoordinationDepthTests } from '../harness/run-coordination-depth-tests.ts';
import { runAgent17ExecutionDepthTests } from '../harness/run-execution-depth-tests.ts';
import { runAgent17ContinuityDepthTests } from '../harness/run-continuity-depth-tests.ts';
import { runAgent17GovernanceDepthTests } from '../harness/run-governance-depth-tests.ts';
import { runAgent17AssuranceDepthTests } from '../harness/run-assurance-depth-tests.ts';
import { runAgent17StabilizationDepthTests } from '../harness/run-stabilization-depth-tests.ts';
import { runAgent17ConvergenceDepthTests } from '../harness/run-convergence-depth-tests.ts';
import { runAgent17SynthesisDepthTests } from '../harness/run-synthesis-depth-tests.ts';
import { runAgent17CadenceDepthTests } from '../harness/run-cadence-depth-tests.ts';
import { runAgent17PulseDepthTests } from '../harness/run-pulse-depth-tests.ts';
import { runAgent17FluxDepthTests } from '../harness/run-flux-depth-tests.ts';
import { runAgent17CovenantDepthTests } from '../harness/run-covenant-depth-tests.ts';
import { runAgent17MandateDepthTests } from '../harness/run-mandate-depth-tests.ts';
import { runAgent17AuthorityDepthTests } from '../harness/run-authority-depth-tests.ts';
import { runAgent17OperationsDepthTests } from '../harness/run-operations-depth-tests.ts';
import { runAgent17FieldDepthTests } from '../harness/run-field-depth-tests.ts';
import { verifyAgent17Goals, validateGoalRegistryCoverage } from '../validation/goal-verification.ts';
import { createAgent17RollbackController } from '../rollback/rollback-controller.ts';

const reports = [
  runAgent17Acc17DevTests(),
  runAgent17RecoveryPathTests(),
  runAgent17PlanningDepthTests(),
  runAgent17DelegationDepthTests(),
  runAgent17CoordinationDepthTests(),
  runAgent17ExecutionDepthTests(),
  runAgent17ContinuityDepthTests(),
  runAgent17GovernanceDepthTests(),
  runAgent17AssuranceDepthTests(),
  runAgent17StabilizationDepthTests(),
  runAgent17ConvergenceDepthTests(),
  runAgent17SynthesisDepthTests(),
  runAgent17CadenceDepthTests(),
  runAgent17PulseDepthTests(),
  runAgent17FluxDepthTests(),
  runAgent17CovenantDepthTests(),
  runAgent17MandateDepthTests(),
  runAgent17AuthorityDepthTests(),
  runAgent17OperationsDepthTests(),
  runAgent17FieldDepthTests(),
];

const combinedSuccess = reports.every(r => r.success);
const lastDevReport = {
  timestamp: Date.now(),
  totalTests: reports.reduce((n, r) => n + r.totalTests, 0),
  passedCount: reports.reduce((n, r) => n + r.passedCount, 0),
  failedCount: reports.reduce((n, r) => n + r.failedCount, 0),
  executionTimeMs: reports.reduce((n, r) => n + r.executionTimeMs, 0),
  overallStatus: combinedSuccess ? ('passed' as const) : ('failed' as const),
  success: combinedSuccess,
  testResults: reports.flatMap(r => r.testResults),
  summary: `Agent 17 combined: ${reports.reduce((n, r) => n + r.passedCount, 0)}/${reports.reduce((n, r) => n + r.totalTests, 0)} passed`,
};

const rollback = createAgent17RollbackController();
const validationReport = verifyAgent17Goals({ rollback, lastDevReport });
const coverage = validateGoalRegistryCoverage();

const exitCode =
  combinedSuccess && validationReport.success && coverage.ok ? 0 : 1;

const payload = {
  devReport: reports[0],
  recoveryReport: reports[1],
  depthReport: reports[2],
  delegationReport: reports[3],
  coordinationReport: reports[4],
  executionReport: reports[5],
  continuityReport: reports[6],
  governanceReport: reports[7],
  assuranceReport: reports[8],
  stabilizationReport: reports[9],
  convergenceReport: reports[10],
  synthesisReport: reports[11],
  cadenceReport: reports[12],
  pulseReport: reports[13],
  fluxReport: reports[14],
  covenantReport: reports[15],
  mandateReport: reports[16],
  authorityReport: reports[17],
  operationsReport: reports[18],
  fieldReport: reports[19],
  validationReport,
  goalRegistryCoverage: coverage,
  exitCode,
};

console.log(JSON.stringify(payload, null, 2));
process.exit(exitCode);
