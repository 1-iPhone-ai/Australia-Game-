#!/usr/bin/env node
import { runV1032TresSelfTests } from './self-tests/run-v1032-tres-self-tests.ts';

const r = runV1032TresSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
