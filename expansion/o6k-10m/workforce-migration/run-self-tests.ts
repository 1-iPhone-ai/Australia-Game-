#!/usr/bin/env node
import { runV1014WorkforceMigrationSelfTests } from './self-tests/run-v1014-workforce-self-tests.ts';

const r = runV1014WorkforceMigrationSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed }, null, 2));
process.exit(r.allPassed ? 0 : 1);
