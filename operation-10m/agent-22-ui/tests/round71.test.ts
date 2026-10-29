import { runAgent22Round71SelfTests } from '../src/engine/round71-self-tests.js';

describe('round71', () => {
  it('passes embedded round71 suite', () => {
    const r = runAgent22Round71SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
