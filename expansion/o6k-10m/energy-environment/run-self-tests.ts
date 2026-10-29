#!/usr/bin/env npx tsx
import { runV1014EnergyDepthSelfTests, formatV1014EnergyDepthSelfTestReport } from './src/self-tests';

const report = runV1014EnergyDepthSelfTests();
console.log(formatV1014EnergyDepthSelfTestReport(report));
process.exit(report.allPassed ? 0 : 1);
