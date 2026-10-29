#!/usr/bin/env node
import { runV1024DgovSelfTests } from './self-tests/run-v1024-dgov-self-tests.ts';

const r = runV1024DgovSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
