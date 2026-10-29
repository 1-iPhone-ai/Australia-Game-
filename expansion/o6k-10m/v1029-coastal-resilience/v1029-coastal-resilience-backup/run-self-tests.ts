#!/usr/bin/env node
import { runV1029CresSelfTests } from './self-tests/run-v1029-cres-self-tests.ts';

const r = runV1029CresSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
