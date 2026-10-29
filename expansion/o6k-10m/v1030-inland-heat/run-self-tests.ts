#!/usr/bin/env node
import { runV1030IheatSelfTests } from './self-tests/run-v1030-iheat-self-tests.ts';

const r = runV1030IheatSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
