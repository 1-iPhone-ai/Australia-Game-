import { runAgent22Round69SelfTests } from '../src/engine/round69-self-tests.js';

describe('round69', () => {
  it('passes embedded round69 suite', () => {
    const r = runAgent22Round69SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
