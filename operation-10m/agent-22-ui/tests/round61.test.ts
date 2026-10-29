import { runAgent22Round61SelfTests } from '../src/engine/round61-self-tests.js';

describe('round61', () => {
  it('passes embedded round61 suite', () => {
    const r = runAgent22Round61SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
