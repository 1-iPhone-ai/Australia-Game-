# Diplomacy & Negotiation 2.0 — Subsystem Contract (V9.4)

**Operation 111 · Agent 53 (Diplomacy Engineer)**  
**Canonical baseline:** `(V9.4) australia-game-with-ai.tsx`  
**Branch:** `op111/agent-53-diplomacy`  
**Section:** **20H** (approx. lines 119954–123129)

Normative for any fleet work that touches deals, diplomatic state, rivalry UI, or cross-system diplomatic constraints. Integrated merges remain **Agent 111** only.

---

## 1. Purpose

**Diplomacy & Negotiation 2.0** is the structured deal-making layer between diplomatic leads (human for the player team; lead AI per opposing team in team mode). It provides:

- Draft → send → counter → accept/reject → active → complete/violate/expired lifecycle
- Natural-language and builder paths into the **same** `DiplomaticDeal` model
- Deterministic AI evaluation (no `Math.random` in the evaluator)
- Compliance monitoring on **canonical committed actions** (not a parallel combat engine)

It does **not** own long-term trust: **AI Memory** holds trust, reliability, grievance, and historic events. Legacy `aiRelationshipState` trust is display-only mirror.

---

## 2. Layer invariants (non‑negotiable)

From the Section 20H header and implementation:

| Rule | Meaning |
|------|---------|
| **No direct economy mutation in DN** | `evaluateDiplomaticDeal`, `validateDiplomaticDeal`, and NL compile paths never change actor balances or inventories. |
| **Payments are compiled actions** | Cash/resource terms become `GameAction`s (e.g. `transfer_cash`) executed via `reduceGameAction` / treasury governance paths. |
| **Regions are promises, not transfers** | Regional terms constrain behaviour (avoid pressure, do not challenge); deals never transfer region ownership. |
| **Threats are symbolic** | `threat` terms affect evaluation weight only; diplomacy never auto-executes sabotage or attacks. |
| **Fog-aware evaluation** | Evaluators use only knowledge visible to `viewerId` in `DiplomacyWorld` (hidden money stays null). |
| **Determinism** | Same deal + world + `DiplomacyState` → same evaluation (see self-test `dn_determinism`). |
| **Team coordination boundary** | Teammates do not negotiate with each other through DN (`validateDiplomaticDeal` → `same_team`). |

---

## 3. Authoritative state

| Artifact | Location | Notes |
|----------|----------|--------|
| **`diplomacyState`** | `gameState.diplomacyState` (`DiplomacyState`) | Deals, inbox, events, revision counter |
| **Live mirror** | `dnStateRef` in `AustraliaGame` | Read-only mirror for synchronous hooks; writes go through `dispatchGameState` |
| **Legacy migration input** | `(gameState\|save).diplomacy` relationships/pacts | Consumed once by `sanitizeDiplomacyState`; trust/stance/history not overwritten |

### `DiplomacyState` shape (summary)

- `deals[]`, `inbox[]`, `events[]`, `revision`
- Caps: `DN_LIMITS` (`activeDeals`, `history`, `inbox`, `events`, `rounds`, `termsPerDeal`, …)

**Load/save:** `validateSaveDataCore` sanitizes `gameState.diplomacyState` (and legacy top-level aliases). Round-trip is covered by self-test `dn_save_load`. See [save compatibility spec](/cursor/stores/bc-7b5c4ee8-fcb0-432c-a9f7-0ba2441f4483/docs/save-compatibility-spec.md) §3 — silent drop of diplomacy blocks is a compatibility bug.

---

## 4. Clock model

- **Diplomacy rounds** use `gameState.roundNumber` (one round = one full actor cycle).
- **HUD `turnCounter`** advances per actor turn; DN UI and obligations must not mix the two clocks.
- Live wiring documents this at ~L213099–213101 in the monolith.

---

## 5. Enablement gates

Diplomacy UI and live binding are active when:

- Live competitive match intent (`isLiveIntentMatch`)
- Competitive mode (`isCompetitiveMode`)
- Not isolated replay runtime

When disabled, panels show `data-testid="dn-disabled"`.

---

## 6. Public API surface (integration hooks)

These **exported functions** are the stable integration surface for Agent 111 and other divisions. Baseline-lock tests in `src/diplomacy/` assert their presence in the monolith.

### State & migration

- `createEmptyDiplomacyState`, `sanitizeDiplomacyState`

### Deal model & validation

- `makeDiplomaticTerm`, `createDiplomaticDeal`, `validateDiplomaticDeal`, `dealTermsSignature`, `classifyDealType`
- `deriveDiplomaticPersonality`, `DN_LIMITS`, `DN_TEMPLATES`

### Evaluation & negotiation

- `evaluateDiplomaticDeal`, `estimateDiplomaticOutlook`, `buildDiplomaticLeverageSnapshot`
- `sendDiplomaticProposal`, `applyDiplomaticResponse`, `applyDiplomaticViolation`
- `compileDiplomaticProposalFromText`, `modifyDiplomaticDraft`
- `buildDiplomaticDealFromBuilder`, `buildDiplomaticTemplate`, `buildDiplomaticImpactPreview`

### Runtime constraints (gameplay AI)

- `applyDiplomaticConstraintsToDecisions`, `diplomaticRestrictionsFor`
- `applyDiplomaticConsequenceToAiMemories`

### UX / intelligence adapters

- `detectDiplomacyQuery`, `composeDiplomacyAnswer` (Ask the Game AI path)
- `diplomaticContextualSurface`, `buildDiplomaticDialogue`, `buildDiplomaticBreachAnswer`
- `deriveDiplomaticWindows`, `gi3DiplomaticWindowNotes` (GI3 read-only windows)
- `deriveDiplomaticObservations` (Background AI surfacing only — no auto-renegotiation)

### Regression

- `runDiplomacyNegotiation2SelfTests` — registered in V9 self-test registry as id `dn2` (tier `full`, severity `MAJOR`)

---

## 7. Cross-system dependency matrix

| Consumer | Direction | Contract |
|----------|-----------|----------|
| **Ask the Game AI** | Read | Intent `diplomacy` + `dn_state` fact bundle; never routes deals to settings |
| **Game Intelligence 3** | Read | `gi3DiplomaticWindowNotes` — may annotate strategy; **must not** rewrite explicit GI3 goals |
| **Team OS 2.0** | Read | `diplomaticRestrictionsFor` → contract objectives (e.g. suppress `take_region` on pledged regions) |
| **Background AI** | Read | Observations + `dn_open` button; no autonomous send/counter |
| **Co-Pilot / contextual actions** | Read | `diplomaticContextualSurface` for ranked diplomatic prompts |
| **Guardian** | Indirect | Deal payments inherit governance/treasury checks from compiled actions |
| **Living Regions / World Reaction** | Input | Regional value/context feeds valuation; DN chooses diplomatic response |
| **AI Memory** | Read/write (via consequences) | Violations and honoured deals adjust memory through `applyDiplomaticConsequenceToAiMemories` |

See also [system dependency graph](/cursor/stores/bc-7b5c4ee8-fcb0-432c-a9f7-0ba2441f4483/docs/system-dependency-graph.md) for spine-level `diplomacyState` row.

---

## 8. UI & test IDs

Primary surfaces:

- Modal: `#dn-modal-title`, `DiplomacyNegotiationModal` (~L241043+)
- Panel: `data-testid="dn-panel"`, `dn-relationship`, `dn-builder`, `dn-notes`
- Background strip: `data-testid="bg-diplomacy-observation"`

Co-Pilot / GI button kinds include `dn_open`, `dn_send`, `dn_accept`, `dn_counter`, … (see `DiplomaticButtonKind` near §20F wiring).

---

## 9. Change classification (for parallel workers)

| Class | Examples | Agent 111 / schema |
|-------|----------|-------------------|
| **Presentation** | Copy, styling, animation | No save schema bump |
| **Evaluator tuning** | Thresholds, counter ops, personality mapping | No schema bump; require `dn2` self-tests green |
| **New term kinds or condition vocabulary** | New `DNTermKind` | Schema review + new self-tests + save sanitize defaults |
| **Persistence field changes** | New fields on `DiplomacyState` | Per save compatibility spec §5 |
| **Extract/module split** | Move §20H to package | Integration PR only; keep export names or provide shim |

---

## 10. Verification

```bash
npm test    # src/diplomacy baseline-lock tests
npm run build
```

In-game: Settings → System Regression → **Diplomacy** (`dn2`) runs `runDiplomacyNegotiation2SelfTests`.

---

## 11. Open engineering backlog (Agent 111 / fleet)

1. **Module extraction** — §20H is ~3.2k lines; candidate for post-integration extract with re-export shims.
2. **Dependency graph § supplement** — dedicated diplomacy subgraph (Agent 3 doc currently lists `diplomacyState` only).
3. **Headless CI** — wire monolith self-test runner in Node (today: in-game registry + baseline-lock export presence).
