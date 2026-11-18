// node tools/selftest/node-eval.mjs tools/ux-map/extract.mjs --file "(V11.0) australia-game-with-ai.tsx"   (UXMAP_OUT=path; default: data/registries-ux4.json)
// Reads the registries the map is built from out of the running module (not from text) and writes them as JSON.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const OUT = process.env.UXMAP_OUT || fileURLToPath(new URL('./data/registries-ux4.json', import.meta.url));
const typeOf = v => v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v;
export default async (G) => {
  const out = {};
  out.version = { GAME_VERSION: G.GAME_VERSION, GAME_VERSION_LABEL: G.GAME_VERSION_LABEL };
  out.surfaces = Object.entries(G.UI_SURFACE_REGISTRY).map(([k, v]) => ({ key: k, ...v }));
  out.tabsOrder = G.SETTINGS_HUB_TAB_ORDER; out.tabLabels = G.SETTINGS_HUB_TAB_LABELS;
  out.sections = G.SETTINGS_HUB_SECTION_INDEX.map(s => ({ ...s }));
  const d = G.DEFAULT_GAME_SETTINGS;
  out.defaults = Object.keys(d).map(k => { const v = d[k]; const t = typeOf(v); return { key: k, type: t, value: (t === 'object' || t === 'array') ? JSON.stringify(v) : v, nestedKeys: t === 'object' ? Object.keys(v) : undefined }; });
  out.inert99 = G.V99_INERT_SETTINGS; out.inert101 = G.V101_INERT_SETTINGS;
  out.matchScoped = [...G.V95_MATCH_SCOPED_SETTING_KEYS]; out.profileScoped = [...G.V95_PROFILE_SCOPED_SETTING_KEYS];
  out.smart = G.SMART_CONTROLLABLE_SETTINGS_REGISTRY;
  out.expModes = G.EXPERIENCE_MODE_OPTIONS;
  out.suites = G.V95_EXISTING_SUITES.map(s => ({ id: s.id, label: s.label, tier: s.tier, section: s.section, severity: s.severity }));
  out.manifest = G.V101_SUITE_MANIFEST;
  out.v99Keys = G.V99_SETTING_KEYS; out.v100Keys = G.V100_SETTING_KEYS; out.v101Keys = G.V101_SETTING_KEYS;
  // UX-4: What's in the game's cards (the name the page shows, from the shared label table; the switch keys; the goal group), for §7's
  // "card:" notes. check-map.mjs checks those notes against the running module.
  const findIndex = G.v110FindIndex ? G.v110FindIndex() : [];
  out.cards = (G.V114_CARDS || []).map(c => { const win = c.window ? G.v114WindowEntry(c, findIndex) : null; return { id: c.id, map: c.map, name: G.v114CardName(c), keys: [...G.v114CardKeys(c)], group: G.v114CardGroup(c), window: win ? win.title : null }; });
  const cp = G.v95WithIsolatedGlobals(() => G.runCoPilotDevSelfTests());
  out.copilot = { keys: Object.keys(cp), totalTests: cp.totalTests, passed: cp.passedCount ?? cp.passed, failed: cp.failedCount ?? cp.failed, cats: (cp.categories || []).map(c => ({ name: c.name || c.categoryName || c.id, total: c.total, passed: c.passed })) };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  return `surfaces=${out.surfaces.length} sections=${out.sections.length} tabs=${out.tabsOrder.length} defaults=${out.defaults.length} inert99=${out.inert99.length} inert101=${out.inert101.length} match=${out.matchScoped.length} profile=${out.profileScoped.length} smart=${out.smart.length} suites=${out.suites.length} manifest=${out.manifest.length} cards=${out.cards.length} copilot=${JSON.stringify(out.copilot)}`;
};
