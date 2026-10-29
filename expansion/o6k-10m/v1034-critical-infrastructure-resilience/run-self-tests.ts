#!/usr/bin/env node
import { runV1034CiresSelfTests } from './self-tests/run-v1034-cires-self-tests.ts';

const r = runV1034CiresSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
