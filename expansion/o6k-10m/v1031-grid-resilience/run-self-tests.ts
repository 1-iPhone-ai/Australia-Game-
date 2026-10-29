#!/usr/bin/env node
import { runV1031GresSelfTests } from './self-tests/run-v1031-gres-self-tests.ts';

const r = runV1031GresSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
