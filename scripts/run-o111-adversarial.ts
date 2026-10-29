import { runO111AdversarialSelfTests } from '../(V9.4) australia-game-with-ai.tsx';

const results = runO111AdversarialSelfTests();
const failed = results.filter((t) => !t.passed);
for (const t of results) {
  console.log(`${t.passed ? 'PASS' : 'FAIL'}\t${t.id}\t${t.name}${t.detail ? `\n  ${t.detail}` : ''}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
