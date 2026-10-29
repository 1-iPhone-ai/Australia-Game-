import { runAgent22Round47SelfTests } from '../src/engine/round47-self-tests.js';

describe('round47', () => {
  it('passes embedded round47 suite', () => {
    const r = runAgent22Round47SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
