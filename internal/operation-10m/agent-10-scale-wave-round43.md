# Agent 10 — scale wave round 43 (O10-217)

**Integration baseline:** **`641d7d16`** · **Base commit:** `276d089` (round 42 gate) · **Gate commit:** **`ef39e48`** · **Task:** O10-217  
**Branch:** `op10m/agent-10-finance-inflation` · **PR:** [#339](https://github.com/1-iPhone-ai/Australia-Game-/pull/339) open  
**Worker:** `bc-51a92409-269a-5372-9613-1c28d58abfee`

## Round-43 depth

- **CPI channels:** `ui-shell-inflation-attention-latch`, `dashboard-regional-inflation-overlay-surge`
- **Bridges:** Agent **22** (`wave43ShellAttentionLatch`, `playerSaliencePressureBand`), Agent **23** (`wave43HeatmapOverlayLatch`, `regionalOverlaySurgeBand`)
- **Agent 21:** schema **`10.14.agent10.r43`**
- **UI:** `UiDashboardWaveInflationPanel`
- **Presets (+3):** `ui_shell_attention_latch_stack`, `dashboard_regional_overlay_surge_stress`, `ui_dashboard_wave43_fusion_stress` (`round43` tags)
- **Self-tests:** `a10_r43_01`–`13`

## Gate subject

`feat(op10m): O10-217 · wave 43 · round 43 — UI shell attention latch & dashboard regional overlay surge CPI, Agent 22/23 bridges`

## Verification (post-push)

| Check | Result |
|--------|--------|
| `npm run test:agent10` | **320/320** |
| Chunk | **20476** lines |

## Constraints

- No V9.4 · no promote · no PR triage

## Prior handoff

- Round 42: [agent-10-scale-wave-round42.md](./agent-10-scale-wave-round42.md) (gate `276d089`, handoff `b4def88`)
