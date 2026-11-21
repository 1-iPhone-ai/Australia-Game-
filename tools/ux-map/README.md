# UX map tools

These scripts rebuild `V11.0_UX_MAP.md` and check it against the running game.

## Rebuild the map

```bash
node tools/ux-map/build-map.cjs
```

By default the map is written to `V11.0_UX_MAP.md` at the repo root. Give a path to write it somewhere else.

The builder combines three inputs: `plan.cjs`, the per-package overlays (`ux2-overlay.cjs`, `ux3-overlay.cjs`, `ux4-overlay.cjs`, `ux5-overlay.cjs`, `ux6-overlay.cjs`) and the audit data in `data/`. The map's *today* columns describe V10.1 as shipped. They are read from `(V9.9) australia-game-with-ai.tsx`, which is that release byte for byte (md5 `a7d56ae0e89666564909bacaaa7370df`). Some facts come from fixed line ranges, so the builder refuses any other file.

## Check the map against the game

```bash
node tools/selftest/node-eval.mjs tools/ux-map/check-map.mjs --file "(V11.0) australia-game-with-ai.tsx"
```

`check-map.mjs` runs 36 cross-checks against the running module:

- surfaces, sections and settings: nothing missing, nothing invented, nothing listed twice
- scope, type and default columns
- the inactive settings
- every nested field
- every setting has a home
- every surface has a plan, a V11.0 home and a package
- the *card:* notes: every switch of What's in the game's cards, and nothing else, names its card as the page does
- the side panel (UX-5): its row in §4, the six windows' homes in its tabs, and the plan column against the decisions, action windows and tool windows suite `v115dp` walks
- the switch-over (UX-6): the four V11.0 switches on by default, the classic switch's row in §7 (profile, off, its ⭐ Essentials home) and its section in §6
- the shortcuts

A check that cannot run on the given file (the card notes before UX-4, the side panel before UX-5, the switch-over before UX-6) is reported as skipped, not counted as a pass.

```bash
node tools/selftest/node-eval.mjs tools/ux-map/check-homes.mjs --file "(V11.0) australia-game-with-ai.tsx"
```

`check-homes.mjs` compares the map's *V11.0 home* column (§7) with the homes the game uses when the layered Settings is on, setting by setting.

Both checks read the map named by `MAP`. If `MAP` is not set, they read the repo's `V11.0_UX_MAP.md`.

## After changing the game

Refresh the registries, then rebuild:

```bash
node tools/selftest/node-eval.mjs tools/ux-map/extract.mjs --file "(V11.0) australia-game-with-ai.tsx"
```

```bash
node tools/ux-map/build-map.cjs
```

`extract.mjs` reads the registries from the running module, not from the source text. By default it writes `data/registries-ux6.json`; set `UXMAP_OUT` to write somewhere else.

## Data

| File | What it is |
|---|---|
| `registries-ux6.json` | `extract.mjs` run on the V11.0 file after UX-6 (the builder's live registries: What's in the game's 101 cards, the side panel's tabs, windows and plan lists, and the switch-over: the four switches, the classic switch, its section, home and Find Anything entries) |
| `registries-ux5.json` | `extract.mjs` run on the V11.0 file after UX-5 (kept for reference; the builder no longer reads it) |
| `registries-ux4.json` | `extract.mjs` run on the V11.0 file after UX-4 (kept for reference; the builder no longer reads it) |
| `registries-ux3.json` | `extract.mjs` run on the V11.0 file after UX-3 (kept for reference; the builder no longer reads it) |
| `registries-v101.json` | `extract.mjs` run on V10.1 as shipped (the UX-1 audit) |
| `ast.json` | UX-1 static scan: which settings section writes which key |
| `gates.json` | UX-1: the switches that hide a settings control |
| `extra-facts.json` | UX-1 checked facts: windows the registry did not know, misfiled keys, LAB cards, preferences outside settings |
| `search-all-ux2.json` | The settings hub's own search, run for every key |
| `browser/*.json` | UX-1 Chromium runs: a click crawl of the play screen, a probe of every settings control (with defaults, and with every gate switch on), and the measured Settings paths |
| `browser/ux6-hardening.json` | UX-6's measured results, read by `ux6-overlay.cjs`: the runners' totals, the 28 older checks it updated, the in-place marks, every browser check and the opening times |

The browser and scan scripts that produced the UX-1 and UX-6 data are not included; the data is kept as the runs recorded it.
