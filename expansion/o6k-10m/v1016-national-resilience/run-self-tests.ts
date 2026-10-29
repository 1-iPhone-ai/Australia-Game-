#!/usr/bin/env node
import { runV1016NresSelfTests } from './self-tests/run-v1016-nres-self-tests.ts';

const r = runV1016NresSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
