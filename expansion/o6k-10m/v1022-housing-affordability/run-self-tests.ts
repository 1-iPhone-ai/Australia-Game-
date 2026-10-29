#!/usr/bin/env node
import { runV1022HaffSelfTests } from './self-tests/run-v1022-haff-self-tests.ts';

const r = runV1022HaffSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
