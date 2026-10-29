#!/usr/bin/env node
import { runV1033ScresSelfTests } from './self-tests/run-v1033-scres-self-tests.ts';

const r = runV1033ScresSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
