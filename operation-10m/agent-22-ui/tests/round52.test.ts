import { runAgent22Round52SelfTests } from '../src/engine/round52-self-tests.js';

describe('round52', () => {
  it('passes embedded round52 suite', () => {
    const r = runAgent22Round52SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
