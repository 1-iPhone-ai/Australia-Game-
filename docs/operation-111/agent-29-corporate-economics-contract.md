# Corporate Sector & Firm Economics — Integration Contract (V10.14)

**Operation 111 · Agent 29 (Corporate Economics Engineer)**  
**Canonical baseline:** `(V9.4) australia-game-with-ai.tsx`  
**Branch:** `op111/agent-29-corporate`  
**Status:** Foundation + self-tests on branch; runtime turn hook pending Agent 111 merge.

---

## 1. Purpose

V10.14 **Corporate Sector & Firm Economics** is a **derived interpretation layer** for firm-level investment climate, profitability outlook, and corporate confidence. It explains how national industry conditions, private capital posture, and domestic demand align — without owning ledgers, prices, or actions.

| Owns | Does not own |
|------|----------------|
| Corporate climate bands (national + regional) | Canonical `money`, debt service, inventory |
| Firm profit outlook (interpretive) | Resource market prices |
| Corporate confidence & constraint narratives | Industry production math (V10.1) |
| Bounded history + hysteresis memory | Strategic capital allocation decisions (V10.9) |
| Derived events (for future SWR wiring) | Household wallets or CPI (V10.13) |

---

## 2. Upstream dependencies (read-only)

| System | Version | Consumes |
|--------|---------|----------|
| National Systems | V10.0 | Enable gate (`nationalSystemsEnabled`) |
| Industries & Supply Chains | V10.1 | National/regional industry conditions, bottlenecks |
| Strategic Capital | V10.9 | `investmentClimate`, capital pressure (optional) |
| Households & Domestic Demand | V10.13 | Domestic demand band (optional) |

When upstream views are `null`, V10.14 computes **conservative** outlooks from whatever industry snapshot is available — never invents cash or production.

---

## 3. Settings & save (P1 additive)

| Setting | Default | Requires |
|---------|---------|----------|
| `corporateEconomicsEnabled` | `true` | `nationalSystemsEnabled === true` |

Persisted memory: `gameState.corporateSectorEconomy` (`CorporateSectorPersisted`, schema `10.14`). Optional on load; sanitizer defaults to empty memory. No `SAVE_SCHEMA_VERSION` bump (class **P1** per [save compatibility spec](/cursor/stores/bc-7b5c4ee8-fcb0-432c-a9f7-0ba2441f4483/docs/save-compatibility-spec.md)).

Match-scoped key: `corporateEconomicsEnabled` (restore with other V10 flags).

---

## 4. Code map (baseline branch)

| Location | Symbol |
|----------|--------|
| §20AG (~after V10.13 self-tests) | `computeCorporateSectorEconomy`, types, sanitizers |
| §20AG | `runV1014CorporateSectorSelfTests` (25 tests `ce01`–`ce25`) |
| V9.5 regression registry | `{ id: 'v1014', … runV1014CorporateSectorSelfTests }` |

**Agent 111 integration checklist (not on this branch):**

1. Turn hook: recompute when `corporateSectorInputHash` changes (mirror V10.1/V10.13 effects).
2. Persist `corporateSectorEconomy` on band transitions.
3. Optional: SWR derived events (`corporate_climate_shifted`, `firm_outlook_weakened`).
4. Settings UI checkbox after Households toggle.
5. Guardian metadata tie-breaker (≤ ±2.0) for heavy industrial spend under `distressed` corporate climate.

---

## 5. Invariants

1. **No canonical mutation** — outputs are labels, scores, and evidence only.
2. **Deterministic** — identical inputs + persisted memory ⇒ identical state (ce24).
3. **Hysteresis** — band changes require deadband (no flicker at thresholds).
4. **Bounded state** — history capped (`V1014_LIMITS.history`); JSON footprint self-test (ce25).
5. **Disabled = inert** — `corporateEconomicsEnabled === false` ⇒ `enabled: false` state, no events.

---

## 6. Division boundaries

| Agent | Concern | V10.14 relationship |
|-------|---------|---------------------|
| 28 Investment & Capital | V10.9 allocation | V10.14 reads climate; never re-scores opportunities |
| 38 Industries & Companies | Canonical companies UI | V10.14 is national/regional sector outlook, not entity sim |
| 96 Economic Correctness | Proofs | Uses `runV1014CorporateSectorSelfTests` |

---

*Agent 29 · bc-4a344282-0a72-5124-afe1-07eb0392ad02 · 2026-10-29*
