#!/usr/bin/env node
import { runV1023CladSelfTests } from './self-tests/run-v1023-clad-self-tests.ts';

const r = runV1023CladSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
