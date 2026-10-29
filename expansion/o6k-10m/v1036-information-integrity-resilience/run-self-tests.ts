#!/usr/bin/env node
import { runV1036IiresSelfTests } from './self-tests/run-v1036-iires-self-tests.ts';

const r = runV1036IiresSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
