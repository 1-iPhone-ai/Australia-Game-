import { runAgent22Round55SelfTests } from '../src/engine/round55-self-tests.js';

describe('round55', () => {
  it('passes embedded round55 suite', () => {
    const r = runAgent22Round55SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
