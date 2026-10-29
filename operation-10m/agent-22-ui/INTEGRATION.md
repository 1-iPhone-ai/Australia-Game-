# Agent 22 — Assembly integration (Evolving UI)

## Assembly chunk

- Path: `operation-10m/modules/agent-22-ui/chunk.tsx`
- Markers: `OP10M_MODULE_BEGIN agent-22-ui` … `OP10M_MODULE_END agent-22-ui`
- Regenerate: `npm run build:agent22-chunk` (from this directory)

## Export surface (`src/index.ts`)

Agent 25 should re-export or inline the following into V9.4 near existing **Interface Layout Presets** and **Contextual Hiding Engine** (≈ line 17600–18100):

| Symbol | Role |
|--------|------|
| `EVOLVING_UI_PANEL_REGISTRY` | Canonical panel + widget metadata |
| `resolveEvolvingPanelVisibility` | Progression + policy → visible/hidden/preview |
| `resolveLegacyUiAccess` | Nav/deep-link always opens target (preserve existing UI) |
| `mergeEvolvingUiWithContextualHiding` | AND with `shouldShowWidgetContextually` |
| `bridgeV94GameSettingsToEvolvingUi` | Maps `smartSettingsProfile.interfaceLevel`, layout preset, a11y |
| `buildProgressionPanelAria` | ARIA for gated rails and preview chips |
| React: `ProgressionPanelShell`, `EvolvingNavRail`, `AccessibilityAnnouncer`, `ShowAllPanelsToggle` | Optional chrome; assembly may wrap existing nav |

## Game settings extension (proposed)

Add optional field on `GameSettingsState` (assembly-owned):

```ts
evolvingUi?: {
  showAllPanelsOverride?: boolean;
  rememberedPanelIds?: string[];
  lastProgressionTier?: number;
};
```

When absent, engine defaults preserve **full legacy access** via nav patches (`resolveIntentNavToUiPatch`).

## Hooks into canonical code

1. **Nav rail / quick actions** — filter sort order with `resolveEvolvingPanelVisibility`; on click still call existing `updateUiState(resolveIntentNavToUiPatch(target))`.
2. **Floating widgets** — `mergeEvolvingUiWithContextualHiding(widgetId, …)` before render.
3. **Settings → Interface** — mount `ShowAllPanelsToggle` bound to `evolvingUi.showAllPanelsOverride`.
4. **Accessibility** — sync `AccessibilityAnnouncer` verbosity from `gameSettings.accessibilitySettings.announceVerbosity`.

## Fixtures

`src/fixtures/stories/*` — deterministic inputs for regression and Storybook-style docs post-assembly.

## Tests

Run `npm test` in this folder before assembly. Tests must pass without importing V9.4 (adapters use minimal structural types).
