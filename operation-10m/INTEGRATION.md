# Operation 10M — Integration contracts

**Canonical artifact:** `(V9.4) australia-game-with-ai.tsx` on branch `australia-game-upgrade`.

**Only Agent 25** may modify the canonical TSX via the controlled assembly pipeline. Module workers must not edit the canonical file.

See Agent 06: [`agent-06-macroeconomy/INTEGRATION.md`](agent-06-macroeconomy/INTEGRATION.md).

## Worker module layout

```
operation-10m/modules/agent-NN-<slug>/
  module.manifest.json
  chunk.tsx               # OP10M_MODULE_BEGIN … END
```

## Module file rules

1. No top-level `import` from npm or local paths in `chunk.tsx` (single React import lives in canonical SECTION 1).
2. Wrap contributed code:

```tsx
// OP10M_MODULE_BEGIN agent-06-macroeconomy
// …
// OP10M_MODULE_END agent-06-macroeconomy
```

3. Export names must be globally unique in the assembled file.

Full hub text: integration branch `operation-10m/INTEGRATION.md` on `op10m/agent-25-integration`.
