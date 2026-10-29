import { runAgent22Round62SelfTests } from '../src/engine/round62-self-tests.js';

describe('round62', () => {
  it('passes embedded round62 suite', () => {
    const r = runAgent22Round62SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
