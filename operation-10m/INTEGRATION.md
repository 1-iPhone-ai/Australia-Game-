# Operation 10M — integration index

Modular worker slices live under `operation-10m/agent-NN-*` until **Agent 25** performs deterministic assembly into `(V9.4) australia-game-with-ai.tsx`.

## Rules

- Forecasting, policy experiments, and counterfactual forks are **non-authoritative**: they fingerprint canonical snapshots, mutate **isolated copies** only, and label uncertainty in player-facing copy.
- Workers do not mutate canonical TSX directly (except Agent 25 assembly PRs authorized by the program).
- Each module ships an integration contract listing exports, anchors, and upstream sim dependencies.

## Agent 21 — Forecasting / Policy Laboratory

| Item | Value |
|------|--------|
| Path | `operation-10m/agent-21-forecasting/` |
| Anchor | `O10M_AGENT21_INTEGRATION_ANCHOR` (replaces / supersedes inline `SECTION 20AQ` during next assembly tranche) |
| Contract | `operation-10m/agent-21-forecasting/integration-contract.md` |
| Tests | `npm run test:ag21` |
| Assembly chunk | `operation-10m/modules/agent-21-forecasting/chunk.tsx` (`npm run bundle:agent-21-chunk`) |
