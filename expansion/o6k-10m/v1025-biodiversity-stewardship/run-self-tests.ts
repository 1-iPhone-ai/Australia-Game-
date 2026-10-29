#!/usr/bin/env node
import { runV1025BioSelfTests } from './self-tests/run-v1025-bio-self-tests.ts';

const r = runV1025BioSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
