# UX map tools

These scripts rebuild `V11.0_UX_MAP.md` and check it against the running game.

## Rebuild the map

```bash
node tools/ux-map/build-map.cjs
```

By default the map is written to `V11.0_UX_MAP.md` at the repo root. Give a path to write it somewhere else.

The builder combines three inputs: `plan.cjs`, the per-package overlays (`ux2-overlay.cjs`, `ux3-overlay.cjs`) and the audit data in `data/`. The map's *today* columns describe V10.1 as shipped. They are read from `(V9.9) australia-game-with-ai.tsx`, which is that release byte for byte (md5 `a7d56ae0e89666564909bacaaa7370df`). Some facts come from fixed line ranges, so the builder refuses any other file.

## Check the map against the game

```bash
node tools/selftest/node-eval.mjs tools/ux-map/check-map.mjs --file "(V11.0) australia-game-with-ai.tsx"
```

`check-map.mjs` runs 27 cross-checks against the running module:

- surfaces, sections and settings: nothing missing, nothing invented, nothing listed twice
- scope, type and default columns
- the inactive settings
- every nested field
- every setting has a home
- the shortcuts

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

`extract.mjs` reads the registries from the running module, not from the source text. By default it writes `data/registries-ux3.json`; set `UXMAP_OUT` to write somewhere else.

## Data

| File | What it is |
|---|---|
| `registries-ux3.json` | `extract.mjs` run on the V11.0 file after UX-3 (the builder's live registries) |
| `registries-v101.json` | `extract.mjs` run on V10.1 as shipped (the UX-1 audit) |
| `ast.json` | UX-1 static scan: which settings section writes which key |
| `gates.json` | UX-1: the switches that hide a settings control |
| `extra-facts.json` | UX-1 checked facts: windows the registry did not know, misfiled keys, LAB cards, preferences outside settings |
| `search-all-ux2.json` | The settings hub's own search, run for every key |
| `browser/*.json` | UX-1 Chromium runs: a click crawl of the play screen, a probe of every settings control (with defaults, and with every gate switch on), and the measured Settings paths |

The browser and scan scripts that produced the UX-1 data are not included; the data is kept as the audit recorded it.
