import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { createDefaultEvolvingUiPersistedState, tickEvolvingUiOnDayAdvance } from '../sim/evolution-hooks.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  ANNOUNCEMENT_DEDUP_WINDOW_DAYS,
  dedupStatusCopy,
  filterDedupedAnnouncements,
  hashAnnouncementText,
  isAnnouncementDuplicate,
  pruneAnnouncementDedupLedger,
} from './announcement-dedup-ledger.js';
import {
  modalFocusRestoreSkipLabel,
  navSelectorForTarget,
  resolveModalFocusRestorePlan,
} from './modal-focus-restoration.js';
import {
  attentionDeferralCopy,
  isAttentionCoachSurfaceVisible,
  planAttentionSurfaceGate,
} from './attention-surface-gate.js';

export function runAgent22Round8SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r8_hash_stable',
    'announcement hash is stable',
    hashAnnouncementText(' Unlock map ') === hashAnnouncementText('unlock map')
  );

  check(
    'r8_dup_within_window',
    'duplicate detected inside window',
    (() => {
      const hash = hashAnnouncementText('Panel unlocked');
      const ledger = { [hash]: 5 };
      return isAnnouncementDuplicate(hash, ledger, 6);
    })()
  );

  check(
    'r8_fresh_outside_window',
    'duplicate expires after window',
    (() => {
      const hash = hashAnnouncementText('Panel unlocked');
      const ledger = { [hash]: 1 };
      return !isAnnouncementDuplicate(hash, ledger, 1 + ANNOUNCEMENT_DEDUP_WINDOW_DAYS);
    })()
  );

  check(
    'r8_filter_suppresses_repeat',
    'filter suppresses repeated line',
    (() => {
      const line = 'Map panel unlocked';
      const first = filterDedupedAnnouncements([line, line], 4, {});
      return first.freshAnnouncements.length === 1 && first.suppressedCount === 1;
    })()
  );

  check(
    'r8_prune_ledger',
    'prune drops stale ledger entries',
    (() => {
      const pruned = pruneAnnouncementDedupLedger({ a: 1, b: 23 }, 25);
      return pruned.b === 23 && pruned.a == null;
    })()
  );

  check(
    'r8_dedup_copy',
    'dedup status copy mentions count',
    dedupStatusCopy(2).includes('2')
  );

  check(
    'r8_tick_merges_ledger',
    'day advance merges dedup ledger',
    (() => {
      const prior = { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' as const };
      const next = { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' as const };
      const persisted = createDefaultEvolvingUiPersistedState();
      const r = tickEvolvingUiOnDayAdvance(prior, next, DEFAULT_EVOLVING_UI_ACCESS_POLICY, persisted);
      return typeof r.updatedPersisted.announcementDedupLedger === 'object';
    })()
  );

  check(
    'r8_modal_restore_selector',
    'modal restore uses nav target selector',
    navSelectorForTarget('map').includes('map')
  );

  check(
    'r8_modal_restore_plan',
    'modal plan announces restore label',
    (() => {
      const plan = resolveModalFocusRestorePlan({
        modalId: 'settings_modal',
        lastNavTarget: 'map',
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
      });
      return plan.restoreEnabled && plan.announceOnClose.includes('settings_modal');
    })()
  );

  check(
    'r8_modal_skip_label',
    'modal skip label references restore target',
    modalFocusRestoreSkipLabel(
      resolveModalFocusRestorePlan({
        modalId: 'x',
        lastNavTarget: null,
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
      })
    ).includes('primary navigation')
  );

  check(
    'r8_attention_allows_focus',
    'attention plan allows focus banner first',
    (() => {
      const plan = planAttentionSurfaceGate({
        band: 'heavy',
        phase: 'save_load',
        focusSessionBannerRequested: true,
        cognitiveLoadCoachRequested: true,
      });
      return (
        isAttentionCoachSurfaceVisible(plan, 'focus_session_banner') &&
        plan.deferredIds.includes('cognitive_load_coach')
      );
    })()
  );

  check(
    'r8_attention_defer_copy',
    'attention deferral copy mentions waiting surfaces',
    attentionDeferralCopy(['cognitive_load_coach']).includes('waiting')
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
