// Dev-only harness entry for the untouched V9.5 file (regression baseline). See tools/selftest/run.mjs.
import * as G from '../../(V9.5) australia-game-with-ai.tsx';
import { runHarness } from './harness';

const M = G as unknown as Parameters<typeof runHarness>[0];
void runHarness(M, [
  ['gi2-async', () => (M.runGameIntelligence2AsyncSelfTests as () => Promise<unknown>)()],
  ['gi21-async', () => (M.runGameIntelligence21AsyncSelfTests as () => Promise<unknown>)()],
  ['v96-fidelity-async', () => (M.runV96HumanVsAiFidelitySelfTests as () => Promise<unknown>)()]
]);
