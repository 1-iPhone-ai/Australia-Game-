# Operation 10M — Integration Index

Cross-agent assembly is owned by **Agent 25** into `(V9.4) australia-game-with-ai.tsx`. Worker modules live under `operation-10m/agent-NN-*` and must not edit the canonical TSX directly.

| Agent | Module root | Contract |
|-------|-------------|----------|
| 03 | `operation-10m/agent-03-research-tech/` | [agent-03-research-tech/INTEGRATION.md](./agent-03-research-tech/INTEGRATION.md) |

## Shared rules

1. **IDs** — Hook targets use the same string literals exported in V9.4 (capabilities, contract types, project types, megaproject kinds, faction ids). Modules duplicate minimal type unions locally; assembly verifies parity.
2. **No duplicate economy** — Agent 03 research branches are a **strategic overlay** aligned with V10.5 emerging capabilities (no science-point tech tree).
3. **Pure functions** — Turn recomputation from snapshots; persisted shape is JSON-serializable.
4. **Tests** — Each agent ships a Node-runnable self-test entrypoint documented in its INTEGRATION.md.
