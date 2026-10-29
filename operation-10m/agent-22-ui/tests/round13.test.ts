import { describe, expect, it } from 'vitest';
import { runAgent22Round13SelfTests } from '../src/engine/round13-self-tests.js';
import { buildNotificationLaneCoachPlan } from '../src/engine/notification-lane-coach-plan.js';
import { recommendDensityForLayoutPreset } from '../src/engine/layout-preset-density-bridge.js';

describe('round 13 self-tests bundle', () => {
  it('passes embedded round13 suite', () => {
    const r = runAgent22Round13SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});

describe('notification lane coach plan', () => {
  it('builds plan for guided day 3', () => {
    const plan = buildNotificationLaneCoachPlan({ gameDay: 3, turnCount: 3, interfaceLevel: 'guided' });
    expect(plan.activeCategories.length).toBeGreaterThan(0);
  });
});

describe('layout preset density bridge', () => {
  it('maps Developer to compact', () => {
    expect(recommendDensityForLayoutPreset('Developer')).toBe('compact');
  });
});
