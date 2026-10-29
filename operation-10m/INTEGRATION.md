# Operation 10M — integration contracts

Assembly owner: **Agent 25** (`scripts/agent25-*.py`).

## Agent 15 — Trade / diplomacy / world economy

- **Module root:** `operation-10m/agent-15-trade/`
- **Save key:** `gameState.globalTradeEconomy` → `GTELPersisted`
- **Turn hook:** `advanceGlobalTradeEconomyTurn` (+ shocks / agreements layer)
- **Household bridge:** `applyGlobalTradeHouseholdOverrides`
- **Self-tests:** `npm run test:agent15`
- **Assembly chunk:** `npm run build:agent15-chunk` → `modules/agent-15-trade/chunk.tsx`

Detail: `agent-15-trade/integration-contract.md`.
