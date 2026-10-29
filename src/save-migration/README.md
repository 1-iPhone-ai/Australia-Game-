# Save migration contracts (Operation 111 · Agent 85)

Normative companion to [save-compatibility-spec](/cursor/stores/bc-7b5c4ee8-fcb0-432c-a9f7-0ba2441f4483/docs/save-compatibility-spec.md). Locks the **migration graph**, baseline migrator exports, replay chain wiring, and pure **settings-carry idempotency** rules without executing the monolith.

```bash
npm run test:migration-contracts
```

Integration implementations remain in `(V9.4) australia-game-with-ai.tsx` until Agent 111 extracts them.
