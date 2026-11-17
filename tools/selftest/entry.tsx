// Dev-only harness entry for the current game file. See tools/selftest/run.mjs.
import * as G from '../../(V9.9) australia-game-with-ai.tsx';
import { runHarness } from './harness';
// V10.1 (SECTION 20BI): static renderer for the v101wl rendered-markup tests (the game file itself does not import react-dom/server).
import { renderToStaticMarkup } from 'react-dom/server';
(globalThis as unknown as { __v101RenderStatic?: unknown }).__v101RenderStatic = renderToStaticMarkup;

const M = G as unknown as Parameters<typeof runHarness>[0];
void runHarness(M, [
  ['v96em-direct', () => (G as unknown as { runV96ExperienceModesSelfTests: () => unknown }).runV96ExperienceModesSelfTests()],
  ['gi2-async', () => (M.runGameIntelligence2AsyncSelfTests as () => Promise<unknown>)()],
  ['gi21-async', () => (M.runGameIntelligence21AsyncSelfTests as () => Promise<unknown>)()],
  ['v96-fidelity-async', () => (M.runV96HumanVsAiFidelitySelfTests as () => Promise<unknown>)()]
]);
