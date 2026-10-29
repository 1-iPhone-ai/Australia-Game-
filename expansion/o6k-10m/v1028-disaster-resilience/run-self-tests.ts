#!/usr/bin/env node
import { runV1028DresSelfTests } from './self-tests/run-v1028-dres-self-tests.ts';

const r = runV1028DresSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
