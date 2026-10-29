import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
  buildExternalCoalitionTurnSignals,
  buildTurnStrategicBriefing,
  CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  executeStrategicAction,
  GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
  getStrategicAction,
  INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
  INTEGRATED_COALITION_MATURITY_THRESHOLD,
  isCivilizationalCoalitionEndurance,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  serializeStrategicGameplayState,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 16 — civilizational coalition endurance', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks endurance charter until civilizational streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_civilizational_endurance_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionGenerationalContinuityStreakDays: GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
        coalitionCivilizationalEnduranceStreakDays: 2,
      },
    );
    expect(
      blocked.some((i) => i.code === 'COALITION_CIVILIZATIONAL_ENDURANCE_STREAK_TOO_SHORT'),
    ).toBe(true);
  });

  it('accumulates civilizational endurance streak after generational continuity is sustained', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(1),
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 3,
      coalitionLockInStreakDays: 2,
      crossModuleSyncStreakDays: 2,
      integratedCoalitionMaturityStreakDays: INTEGRATED_COALITION_MATURITY_THRESHOLD,
      coalitionStewardshipStreakDays: SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
      coalitionAnchoredGovernanceStreakDays: ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
      coalitionInstitutionalPermanenceStreakDays: INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
      coalitionGenerationalContinuityStreakDays: GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionCivilizationalEnduranceStreakDays).toBe(4);
    expect(isCivilizationalCoalitionEndurance(advanced)).toBe(true);
  });

  it('exports civilizational endurance on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionCivilizationalEnduranceStreakDays: CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.civilizationalCoalitionEndurance).toBe(true);
    expect(signals.coalitionCivilizationalEnduranceStreakDays).toBe(
      CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
    );
  });

  it('clears civilizational streak after heritage covenant executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionCivilizationalEnduranceStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_civilizational_heritage_covenant')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionCivilizationalEnduranceStreakDays).toBe(0);
  });

  it('extends turn briefing with civilizational endurance fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionCivilizationalEnduranceStreakDays: CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.civilizationalCoalitionEndurance).toBe(true);
    expect(briefing.coalitionCivilizationalEnduranceStreakDays).toBe(
      CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
    );
  });

  it('serializes save v15 with coalitionCivilizationalEnduranceStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionCivilizationalEnduranceStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(32);
    expect(save.coalitionCivilizationalEnduranceStreakDays).toBe(5);
  });
});
