import { describe, expect, it } from 'vitest';
import {
  findMissingExports,
  findMissingMarkers,
  readBaseline,
  REQUIRED_AUTOMATION_ENGINE_EXPORTS,
} from './baseline-lock';

describe('automation engine baseline lock', () => {
  const source = readBaseline();

  it('includes Section 11 and orchestrator hooks', () => {
    expect(findMissingMarkers(source)).toEqual([]);
  });

  it('exports the contract surface', () => {
    expect(findMissingExports(source)).toEqual([]);
  });

  it('documents one-automation-per-turn scope in orchestrator', () => {
    expect(source).toMatch(/at most ONE automation per player-turn evaluation/);
  });

  it('locks export count for drift detection', () => {
    expect(REQUIRED_AUTOMATION_ENGINE_EXPORTS.length).toBeGreaterThanOrEqual(12);
  });
});
