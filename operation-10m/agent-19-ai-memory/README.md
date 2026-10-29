# Agent 19 — AI memory, evaluation, explainability

Modular extensions aligned with V9.4 inlined AI memory (`SECTION 1B`). Read the canonical file for behavior; this tree is the assembly source for Agent 25.

## Layout

| File | Role |
|------|------|
| `types.ts` | Shared types + disclaimer constant |
| `horizon.ts` | Match vs cross-match horizon snapshot |
| `explainability.ts` | Player-facing briefs and slice summaries |
| `influence-audit.ts` | Trace integrity and bounded-influence audits |
| `eval/run-suite.ts` | Self-tests + canonical Phase 7 parity |
| `canonical-study/` | Read-only V9.4 SECTION 1B excerpt for Node parity tests |
| `scripts/build-chunk.mjs` | Emits `operation-10m/modules/agent-19-ai-memory/chunk.tsx` |

## Assembly chunk

```bash
npm run build:agent19-chunk
```

Marker: `OP10M_MODULE_BEGIN agent-19-ai-memory` … `OP10M_MODULE_END agent-19-ai-memory`.

## Tests

```bash
npm run test:agent19
```

See [INTEGRATION.md](../INTEGRATION.md) for merge contracts.
