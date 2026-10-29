#!/usr/bin/env node
import { runV1020RpipeSelfTests } from './self-tests/run-v1020-rpipe-self-tests.ts';

const r = runV1020RpipeSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
