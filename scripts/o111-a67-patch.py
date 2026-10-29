#!/usr/bin/env python3
"""Patch (V9.4) australia-game-with-ai.tsx for O111 Agent 67 contextual information."""
from pathlib import Path

GAME = Path("/workspace/(V9.4) australia-game-with-ai.tsx")

BLOCK = r'''
// ============================================================================
// SECTION 20P-A67: CONTEXTUAL INFORMATION — RANKING SNIPPETS FOR PLAY (O111 Agent 67)
// ============================================================================
// Surfaces why ranked actions score where they do (objective, strategy, V10 alignment metadata).
// Presentation only — never legality; Guardian and the canonical executor stay authoritative.

export type ContextualInformationTone = 'positive' | 'neutral' | 'caution' | 'conflict';

export interface ContextualInformationSnippet {
  id: string;
  category: 'goal' | 'strategy' | 'national' | 'location' | 'delivery' | 'fiscal' | 'household' | 'ranking' | 'attention';
  shortLabel: string;
  detail: string;
  tone: ContextualInformationTone;
  rankingOnly: true;
}

export function isContextualInformationEnabled(settings: any): boolean {
  if (settings?.contextualInformationEnabled === false) return false;
  if (settings?.playerExperienceSettings?.contextualInformationEnabled === false) return false;
  return true;
}

function contextualInfoToneFromPoints(points: number): ContextualInformationTone {
  if (points <= -8) return 'conflict';
  if (points < 0) return 'caution';
  if (points >= 12) return 'positive';
  return 'neutral';
}

function contextualInfoCategoryFromFactor(factor: string): ContextualInformationSnippet['category'] {
  const f = factor.toLowerCase();
  if (/national priority/.test(f)) return 'national';
  if (/location/.test(f)) return 'location';
  if (/delivery|implementation load/.test(f)) return 'delivery';
  if (/fiscal/.test(f)) return 'fiscal';
  if (/household|concentration/.test(f)) return 'household';
  if (/strategy/.test(f)) return 'strategy';
  if (/goal|objective|advances/.test(f)) return 'goal';
  if (/attention|addresses/.test(f)) return 'attention';
  return 'ranking';
}

export function buildContextualInformationSnippetsFromCandidate(
  c: ContextualActionCandidate,
  options?: { maxSnippets?: number }
): ContextualInformationSnippet[] {
  const max = Math.max(1, Math.min(6, options?.maxSnippets ?? 4));
  const snippets: ContextualInformationSnippet[] = [];
  const push = (s: ContextualInformationSnippet) => {
    if (snippets.length >= max) return;
    if (snippets.some(x => x.id === s.id)) return;
    snippets.push(s);
  };

  for (const f of c.scoreBreakdown || []) {
    if (snippets.length >= max) break;
    const factor = String(f.factor || '').trim();
    if (!factor) continue;
    if (/^co-pilot strategic value/i.test(factor)) continue;
    const points = Math.round(Number(f.points) || 0);
    push({
      id: `sb_${snippets.length}_${factor.slice(0, 24).replace(/\W+/g, '_')}`,
      category: contextualInfoCategoryFromFactor(factor),
      shortLabel: factor.length > 46 ? `${factor.slice(0, 43)}…` : factor,
      detail: `${points >= 0 ? '+' : ''}${points} relevance`,
      tone: contextualInfoToneFromPoints(points),
      rankingOnly: true
    });
  }

  const strat = c.strategyAlignment;
  if (strat?.reason) {
    push({
      id: 'align_strategy',
      category: 'strategy',
      shortLabel: 'Strategy fit',
      detail: strat.reason,
      tone: strat.label === 'conflict' ? 'conflict' : strat.label === 'high' ? 'positive' : 'neutral',
      rankingOnly: true
    });
  }
  const np = c.nationalPriorityAlignment;
  if (np?.reason) {
    push({
      id: 'align_np',
      category: 'national',
      shortLabel: np.band === 'conflict' ? 'Priority tension' : 'National priority',
      detail: np.reason,
      tone: np.band === 'conflict' ? 'conflict' : np.band === 'strong' ? 'positive' : 'neutral',
      rankingOnly: true
    });
  }
  const eg = c.economicGeographyAlignment;
  if (eg?.reason && Math.abs(Number(eg.score) || 0) >= 1) {
    push({
      id: 'align_eg',
      category: 'location',
      shortLabel: 'Location fit',
      detail: eg.reason,
      tone: Number(eg.score) >= 3 ? 'positive' : Number(eg.score) < 0 ? 'caution' : 'neutral',
      rankingOnly: true
    });
  }
  const sc = c.stateCapacityAlignment;
  if (sc?.reason && Number(sc.score) !== 0) {
    push({
      id: 'align_sc',
      category: 'delivery',
      shortLabel: Number(sc.score) > 0 ? 'Delivery fit' : 'Execution load',
      detail: sc.reason,
      tone: Number(sc.score) > 0 ? 'positive' : 'caution',
      rankingOnly: true
    });
  }
  const pf = c.publicFinanceAlignment;
  if (pf?.reason && Number(pf.scoreDelta) !== 0) {
    push({
      id: 'align_pf',
      category: 'fiscal',
      shortLabel: Number(pf.scoreDelta) > 0 ? 'Fiscal fit' : 'Fiscal caution',
      detail: pf.reason,
      tone: Number(pf.scoreDelta) > 0 ? 'positive' : 'caution',
      rankingOnly: true
    });
  }
  const hh = c.householdAlignment;
  if (hh?.reason && Number(hh.relevanceDelta) !== 0) {
    push({
      id: 'align_hh',
      category: 'household',
      shortLabel: Number(hh.relevanceDelta) > 0 ? 'Household impact' : 'Concentration strain',
      detail: hh.reason,
      tone: Number(hh.relevanceDelta) > 0 ? 'positive' : 'caution',
      rankingOnly: true
    });
  }

  return snippets.slice(0, max);
}

export function buildContextualInformationSnippetsFromRecommendation(
  rec: ContextualRecommendation,
  options?: { maxSnippets?: number }
): ContextualInformationSnippet[] {
  const max = Math.max(1, Math.min(6, options?.maxSnippets ?? 4));
  const extraWhy = (rec.whyPoints || []).slice(1, max + 2);
  const fromWhy: ContextualInformationSnippet[] = extraWhy.map((line, i) => ({
    id: `why_${i}`,
    category: /strategy/i.test(line) ? 'strategy' : /fiscal/i.test(line) ? 'fiscal' : /household|concentration/i.test(line) ? 'household' : /location/i.test(line) ? 'location' : /priority|national/i.test(line) ? 'national' : 'ranking',
    shortLabel: 'Why ranked',
    detail: line,
    tone: /caution|strain|risk|note:/i.test(line) ? 'caution' : /fits|advances|strong|\+/.test(line) ? 'positive' : 'neutral',
    rankingOnly: true as const
  }));
  const mockCandidate = {
    id: rec.id,
    actionType: rec.actionType,
    label: rec.title,
    description: rec.reason,
    category: rec.actionType,
    icon: '',
    navigation: null,
    execution: { kind: 'copilot_candidate', candidate: rec.candidate },
    legal: true,
    blockReason: null,
    relevance: rec.relevanceScore ?? 0,
    urgency: 'normal' as const,
    benefit: null,
    risk: null,
    costEstimate: rec.costEstimate,
    apCost: rec.apCost,
    objectiveRelation: null,
    reasons: rec.whyPoints || [],
    evidence: [],
    sourceSystem: 'Recommendations',
    confidence: null,
    requiresConfirmation: false,
    scoreBreakdown: [{ factor: 'Co-Pilot strategic value', points: Math.round(rec.relevanceScore || 0) }],
    strategyAlignment: rec.strategyAlignment,
    nationalPriorityAlignment: rec.nationalPriorityAlignment,
    economicGeographyAlignment: rec.economicGeographyAlignment,
    stateCapacityAlignment: rec.stateCapacityAlignment,
    publicFinanceAlignment: rec.publicFinanceAlignment,
    householdAlignment: rec.householdAlignment
  } as ContextualActionCandidate;
  const merged = [...fromWhy, ...buildContextualInformationSnippetsFromCandidate(mockCandidate, { maxSnippets: max })];
  const seen = new Set<string>();
  const out: ContextualInformationSnippet[] = [];
  for (const s of merged) {
    if (out.length >= max) break;
    const key = `${s.category}:${s.detail}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

export function formatContextualInformationAriaLabel(snippets: ContextualInformationSnippet[]): string {
  if (!snippets.length) return 'Ranking context unavailable';
  return `Ranking context (not legality): ${snippets.map(s => `${s.shortLabel}, ${s.detail}`).join('. ')}`;
}

const CONTEXTUAL_INFO_TONE_CLS: Record<ContextualInformationTone, string> = {
  positive: 'border-emerald-500/55 text-emerald-200',
  neutral: 'border-slate-500/50 text-slate-200',
  caution: 'border-amber-500/55 text-amber-200',
  conflict: 'border-rose-500/60 text-rose-200'
};

export const ContextualInformationChips: React.FC<{ snippets: ContextualInformationSnippet[]; compact?: boolean; className?: string }> = ({ snippets, compact, className = '' }) => {
  if (!snippets.length) return null;
  return (
    <ul
      className={`flex flex-wrap gap-1 ${className}`}
      aria-label={formatContextualInformationAriaLabel(snippets)}
      data-testid={compact ? 'ctx-info-chips-compact' : 'ctx-info-chips'}
    >
      {snippets.map(s => (
        <li
          key={s.id}
          title={`${s.shortLabel}: ${s.detail} (ranking only — legality checked separately)`}
          className={`px-1.5 py-0.5 rounded-full border ${CONTEXTUAL_INFO_TONE_CLS[s.tone]} ${compact ? 'text-[10px]' : 'text-[11px]'}`}
          data-category={s.category}
        >
          <span className="font-semibold">{s.shortLabel}</span>
          {!compact && s.detail ? <span className="opacity-85"> · {s.detail}</span> : null}
        </li>
      ))}
    </ul>
  );
};

export function runO111ContextualInformationSelfTests(): V9SelfTestResult[] {
  const results: V9SelfTestResult[] = [];
  const check = (id: string, name: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') });
    } catch (e) {
      results.push({ id, name, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };
  check('a67_enabled_default', 'Contextual information enabled by default', () => isContextualInformationEnabled({}) && !isContextualInformationEnabled({ contextualInformationEnabled: false }));
  const cand = {
    id: 'x', actionType: 'invest', label: 'Invest', description: '', category: 'invest', icon: '💰', navigation: null,
    execution: { kind: 'copilot_candidate', candidate: {} }, legal: true, blockReason: null, relevance: 40, urgency: 'normal' as const,
    benefit: null, risk: null, costEstimate: 0, apCost: 1, objectiveRelation: null, reasons: ['legal'], evidence: [], sourceSystem: 'test',
    confidence: null, requiresConfirmation: false,
    scoreBreakdown: [
      { factor: 'Co-Pilot strategic value', points: 30 },
      { factor: 'Advances goal: Grow NSW', points: 22 },
      { factor: 'Fiscal caution: tight headroom', points: -6 }
    ],
    strategyAlignment: { label: 'high', score: 40, reason: 'Matches expansion phase' },
    nationalPriorityAlignment: { band: 'conflict', score: -10, reason: 'Conflicts with water security priority' },
    economicGeographyAlignment: null,
    stateCapacityAlignment: null,
    publicFinanceAlignment: null,
    householdAlignment: null
  } as ContextualActionCandidate;
  check('a67_snippets_from_candidate', 'Candidate score breakdown yields ranking snippets', () => {
    const s = buildContextualInformationSnippetsFromCandidate(cand, { maxSnippets: 4 });
    return s.length >= 2 && s.every(x => x.rankingOnly === true) && s.some(x => x.tone === 'conflict');
  });
  check('a67_max_cap', 'maxSnippets cap honoured', () => buildContextualInformationSnippetsFromCandidate(cand, { maxSnippets: 2 }).length === 2);
  check('a67_aria', 'Aria label mentions ranking-not-legality framing', () => /Ranking context/.test(formatContextualInformationAriaLabel(buildContextualInformationSnippetsFromCandidate(cand))));
  return results;
}

'''


def main() -> None:
    text = GAME.read_text(encoding="utf-8")
    marker = "export interface ContextualActionPanelProps {"
    if "SECTION 20P-A67" in text:
        print("Already patched")
        return
    if marker not in text:
        raise SystemExit(f"Marker not found: {marker}")
    text = text.replace(marker, BLOCK + marker, 1)

    old_props = """  onShowAllActions: () => void;
}"""
    new_props = """  onShowAllActions: () => void;
  /** When false, alignment chips are hidden (settings-driven). Default true. */
  showContextualInformation?: boolean;
}"""
    if "showContextualInformation" not in text:
        text = text.replace(old_props, new_props, 1)

    old_panel = "export const ContextualActionPanel: React.FC<ContextualActionPanelProps> = ({ actionSet, control, theme, onButton, onShowAllActions }) => {\n  const rec = actionSet.recommended;\n  const renderButtons = (c: ContextualActionCandidate, compact: boolean) => ("
    new_panel = "export const ContextualActionPanel: React.FC<ContextualActionPanelProps> = ({ actionSet, control, theme, onButton, onShowAllActions, showContextualInformation = true }) => {\n  const rec = actionSet.recommended;\n  const renderInfo = (c: ContextualActionCandidate, compact: boolean) =>\n    showContextualInformation ? (\n      <ContextualInformationChips snippets={buildContextualInformationSnippetsFromCandidate(c, { maxSnippets: compact ? 2 : 4 })} compact={compact} className=\"mt-1\" />\n    ) : null;\n  const renderButtons = (c: ContextualActionCandidate, compact: boolean) => ("
    if old_panel not in text:
        raise SystemExit("ContextualActionPanel header not found")
    text = text.replace(old_panel, new_panel, 1)

    rec_block_old = """                <div className=\"text-[11px] opacity-70 mt-0.5\">{describeContextualCost(rec)}{rec.risk ? ` • ${rec.risk}` : ''}</div>
                {rec.backgroundReason && <div className=\"text-[11px] opacity-80 mt-0.5\" data-testid=\"bg-action-note\">🧠 Background AI #{rec.backgroundRank}: {rec.backgroundReason}</div>}"""
    rec_block_new = rec_block_old.replace(
        "{rec.backgroundReason",
        "{renderInfo(rec, false)}\n                {rec.backgroundReason",
        1,
    )
    text = text.replace(rec_block_old, rec_block_new, 1)

    useful_old = """                <div className=\"text-[10px] opacity-60\">{describeContextualCost(c)}</div>
                {c.backgroundReason && <div className=\"text-[10px] opacity-75\">🧠 #{c.backgroundRank}: {c.backgroundReason}</div>}
                {renderButtons(c, true)}"""
    useful_new = useful_old.replace(
        "{c.backgroundReason",
        "{renderInfo(c, true)}\n                {c.backgroundReason",
        1,
    )
    text = text.replace(useful_old, useful_new, 1)

    v95_old = "  { id: 'v94', label: 'V9.4 Game Feel', tier: 'quick', section: 'UI Recovery', severity: 'MAJOR', run: () => runV94GameFeelPolishSelfTests() },"
    v95_new = v95_old + "\n  { id: 'o111_a67', label: 'O111 Agent 67 Contextual Information', tier: 'quick', section: 'UI Recovery', severity: 'MAJOR', run: () => runO111ContextualInformationSelfTests() },"
    if "o111_a67" not in text:
        text = text.replace(v95_old, v95_new, 1)

    panel_usage = "<ContextualActionPanel actionSet={v9ActionSetView} control={playerControlState} theme={themeStyles} onButton={handleV9Button} onShowAllActions={showAllActions} />"
    panel_usage_new = "<ContextualActionPanel actionSet={v9ActionSetView} control={playerControlState} theme={themeStyles} onButton={handleV9Button} onShowAllActions={showAllActions} showContextualInformation={isContextualInformationEnabled(gameSettings)} />"
    text = text.replace(panel_usage, panel_usage_new)

    GAME.write_text(text, encoding="utf-8")
    print("Patched OK")


if __name__ == "__main__":
    main()
