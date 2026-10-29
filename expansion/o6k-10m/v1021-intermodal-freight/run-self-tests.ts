#!/usr/bin/env node
import { runV1021ImfdSelfTests } from './self-tests/run-v1021-imfd-self-tests.ts';

const r = runV1021ImfdSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
