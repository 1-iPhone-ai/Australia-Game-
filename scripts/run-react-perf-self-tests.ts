import { runO111ReactPerformanceSelfTests } from '../(V9.4) australia-game-with-ai.tsx';

const results = runO111ReactPerformanceSelfTests();
const failed = results.filter(r => !r.passed);
console.log(`total ${results.length}, passed ${results.length - failed.length}, failedCount ${failed.length}`);
for (const r of results) {
  console.log(`${r.passed ? '✓' : '✗'} ${r.id}: ${r.name}${r.passed ? '' : ` — ${r.detail}`}`);
}
process.exit(failed.length ? 1 : 0);
