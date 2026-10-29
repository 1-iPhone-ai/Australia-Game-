#!/usr/bin/env node
import { runV1019MtrdSelfTests } from './self-tests/run-v1019-mtrd-self-tests.ts';

const r = runV1019MtrdSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
