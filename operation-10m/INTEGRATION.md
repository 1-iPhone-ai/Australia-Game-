# Operation 10M — Integration contracts (draft)

Modular slices live under `operation-10m/agent-NN-*` until Agent 25 assembly into `(V9.4) australia-game-with-ai.tsx`.

## Agent 10 — Finance / inflation / investment (`agent-10-finance`)

| Concern | Canonical anchor (V9.4) | Modular source |
|--------|-------------------------|----------------|
| Macro inflation bands (non-commodity CPI) | `SECTION 20AO` / `V1014_FINSTAB_*` | `agent-10-finance/src/` |
| Credit conditions & loan spread metadata | same | `credit/`, `rates/` |
| Commodity **resource market** prices | `getResourceMarketPrice`, `computeDailyMarketUpdate` | `prices/resource-market.ts` |
| Credit / liquidity **shocks** | `creditShockActive`, score drivers | `shocks/` |

### Boundaries (binding)

1. **Resource market prices** (`gameState.resourcePrices`) are commodity/trade quotes — never averaged into macro CPI (`integrationNotes` in canonical compute).
2. **Macro cost-of-living multiplier** applies to bounded economy/travel presentation layers only; it does not rewrite `resourcePrices`.
3. **Credit spread multiplier** informs loan pricing metadata; it does not mutate wallets or auto-borrow.
4. **V10.9** remains authoritative for investment climate scores; Agent 10 interprets transmission only.
5. **V10.12** remains authoritative for fiscal headroom; Agent 10 reads pressure bands only.

### Assembly hook (Agent 25)

Export surface: `operation-10m/agent-10-finance/src/index.ts` — must stay aligned with exported symbols in V9.4 Section 20AO before merge.

Run module tests: `npm run test:agent10`.
