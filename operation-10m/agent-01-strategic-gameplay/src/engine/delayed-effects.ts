import type { StrategicGameplayContracts } from '../contracts/index.ts';
import type {
  DelayedTradeOff,
  DomainEffectBundle,
  StrategicGameplayState,
} from '../types/strategic-action.ts';

let tradeOffSeq = 0;

export function resetDelayedEffectSequence(forTests = 0): void {
  tradeOffSeq = forTests;
}

function nextTradeOffId(): string {
  tradeOffSeq += 1;
  return `tradeoff_${tradeOffSeq}`;
}

export function scheduleDelayedTradeOffs(
  state: StrategicGameplayState,
  sourceActionId: string,
  templates: Omit<DelayedTradeOff, 'id' | 'firesOnDay' | 'sourceActionId'>[],
  delayDays: number,
): StrategicGameplayState {
  const scheduled: DelayedTradeOff[] = templates.map((t) => ({
    ...t,
    id: nextTradeOffId(),
    sourceActionId,
    firesOnDay: state.day + delayDays,
  }));
  return {
    ...state,
    pendingDelayed: [...state.pendingDelayed, ...scheduled].sort(
      (a, b) => a.firesOnDay - b.firesOnDay,
    ),
  };
}

export function applyDomainEffects(
  contracts: StrategicGameplayContracts,
  bundle: DomainEffectBundle,
): void {
  if (bundle.economy) contracts.economy.applyPatch(bundle.economy);
  if (bundle.government) contracts.government.applyPatch(bundle.government);
  if (bundle.population) contracts.population.applyPatch(bundle.population);
  if (bundle.tech) contracts.tech.applyPatch(bundle.tech);
}

export interface AdvanceDayResult {
  state: StrategicGameplayState;
  fired: DelayedTradeOff[];
}

/** Process due delayed trade-offs when the calendar advances. */
export function advanceDayAndResolveDelayed(
  state: StrategicGameplayState,
  contracts: StrategicGameplayContracts,
  toDay: number,
): AdvanceDayResult {
  const fired: DelayedTradeOff[] = [];
  let pending = [...state.pendingDelayed];
  let day = state.day;

  while (day < toDay) {
    day += 1;
    const due = pending.filter((p) => p.firesOnDay <= day);
    pending = pending.filter((p) => p.firesOnDay > day);
    for (const tradeOff of due) {
      applyDomainEffects(contracts, tradeOff.effects);
      fired.push(tradeOff);
      contracts.ui.pushToast({
        id: tradeOff.id,
        severity: 'warning',
        title: 'Delayed trade-off',
        body: tradeOff.label,
        day,
      });
    }
  }

  return {
    state: { ...state, day, pendingDelayed: pending },
    fired,
  };
}
