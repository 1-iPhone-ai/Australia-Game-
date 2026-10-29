#!/usr/bin/env node
import { runV1026RhsSelfTests } from './self-tests/run-v1026-rhs-self-tests.ts';

const r = runV1026RhsSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
