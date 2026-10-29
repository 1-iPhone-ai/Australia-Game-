import { runAgent22Round60SelfTests } from '../src/engine/round60-self-tests.js';

describe('round60', () => {
  it('passes embedded round60 suite', () => {
    const r = runAgent22Round60SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBe(r.results.length);
  });
});
