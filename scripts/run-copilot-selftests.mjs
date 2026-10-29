import { runCoPilotDevSelfTests } from '../(V9.4) australia-game-with-ai.tsx';

const report = runCoPilotDevSelfTests();
console.log(report.summary);
if (report.failedCount > 0) {
  for (const cat of report.categories) {
    for (const t of cat.tests) {
      if (!t.success) {
        console.error(`FAIL [${cat.id}] ${t.id}: ${t.errorMessage || 'unknown'}`);
      }
    }
  }
  process.exit(1);
}
process.exit(0);
