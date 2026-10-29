#!/usr/bin/env node
import { runV1018FfedSelfTests } from './self-tests/run-v1018-ffed-self-tests.ts';

const r = runV1018FfedSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
