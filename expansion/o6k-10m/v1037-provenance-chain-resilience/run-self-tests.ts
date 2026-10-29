#!/usr/bin/env node
import { runV1037PcresSelfTests } from './self-tests/run-v1037-pcres-self-tests.ts';

const r = runV1037PcresSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
