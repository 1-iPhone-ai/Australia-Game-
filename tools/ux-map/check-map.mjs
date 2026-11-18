// node tools/selftest/node-eval.mjs tools/ux-map/check-map.mjs --file "(V11.0) australia-game-with-ai.tsx"   (MAP=path/to/map.md; default: the repo's V11.0_UX_MAP.md)
// Cross-checks the map's tables against the live module: nothing missing, nothing invented, nothing listed twice.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const MAP = process.env.MAP || fileURLToPath(new URL('../../V11.0_UX_MAP.md', import.meta.url));
export default async (G) => {
  const md = fs.readFileSync(MAP, 'utf8');
  const section = (start, end) => { const a = md.indexOf(start); const b = end ? md.indexOf(end, a + 1) : md.length; return md.slice(a, b); };
  const firstCol = (text, col = 0) => text.split('\n').filter(l => l.startsWith('| ') && !l.startsWith('|---')).map(l => l.split(/(?<!\\)\|/)[col + 1]?.trim() || '').map(c => (c.match(/^`([^`]+)`$/) || [])[1]).filter(Boolean);
  const out = []; const fail = []; const ok = (name, cond, detail) => { out.push(`${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); if (!cond) fail.push(name); };
  // §4 surfaces
  const s4 = firstCol(section('## 4. Surfaces', '## 5.'), 1);
  const reg = Object.keys(G.UI_SURFACE_REGISTRY);
  ok('§4 lists every registry surface', reg.every(id => s4.includes(id)), `${reg.filter(id => !s4.includes(id)).join(',')}`);
  ok('§4 lists no unknown surface', s4.every(id => reg.includes(id)), s4.filter(id => !reg.includes(id)).join(','));
  ok('§4 lists each surface once', new Set(s4).size === s4.length && s4.length === reg.length, `${s4.length} rows / ${reg.length} ids`);
  // UX-4: a new id must not print placeholders: every row has a plan, a V11.0 home and a package.
  const rows4 = section('## 4. Surfaces', '## 5.').split('\n').filter(l => /^\| \d+ \| `/.test(l));
  const unfilled = rows4.filter(l => { const c = l.split(/(?<!\\)\|/).map(x => x.trim()); return [c[10], c[11], c[12]].some(v => !v || v === '?'); });
  ok('§4 gives every surface a plan, a V11.0 home and a package', unfilled.length === 0 && rows4.length === reg.length, unfilled.slice(0, 5).map(l => l.slice(0, 40)).join(' / '));
  // §6 sections
  const s6 = firstCol(section('## 6. Settings sections', '**Proposed groups'), 1);
  const secIds = G.SETTINGS_HUB_SECTION_INDEX.map(s => s.id);
  ok('§6 lists every indexed section', secIds.every(id => s6.includes(id)), secIds.filter(id => !s6.includes(id)).join(','));
  ok('§6 lists only indexed sections plus the rendered Balance Lab', s6.every(id => secIds.includes(id) || id === 'advancedSystems.balanceLab'), s6.filter(id => !secIds.includes(id)).join(','));
  ok('§6 lists each section once', new Set(s6).size === s6.length, `${s6.length} rows`);
  // §7 settings
  const s7 = firstCol(section('## 7. Every setting', '## 8.'), 0);
  const keys = Object.keys(G.DEFAULT_GAME_SETTINGS);
  ok('§7 lists every DEFAULT_GAME_SETTINGS key', keys.every(k => s7.includes(k)), keys.filter(k => !s7.includes(k)).join(','));
  ok('§7 lists no unknown key', s7.every(k => keys.includes(k)), s7.filter(k => !keys.includes(k)).join(','));
  ok('§7 lists each key once', new Set(s7).size === s7.length && s7.length === keys.length, `${s7.length} rows / ${keys.length} keys`);
  // §7 scope and default columns agree with the module
  const rows7 = section('## 7. Every setting', '## 8.').split('\n').filter(l => l.startsWith('| `'));
  const prof = new Set(G.V95_PROFILE_SCOPED_SETTING_KEYS);
  const badScope = rows7.filter(l => { const c = l.split(/(?<!\\)\|/).map(x => x.trim()); const k = c[1].replace(/`/g, ''); const sc = c[4]; return prof.has(k) ? !sc.startsWith('profile') : !sc.startsWith('match'); });
  ok('§7 scope column matches V95_PROFILE_SCOPED_SETTING_KEYS', badScope.length === 0, badScope.slice(0, 5).map(l => l.slice(0, 60)).join(' / '));
  const badType = rows7.filter(l => { const c = l.split(/(?<!\\)\|/).map(x => x.trim()); const k = c[1].replace(/`/g, ''); const v = G.DEFAULT_GAME_SETTINGS[k]; const t = v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v; return c[2] !== t; });
  ok('§7 type column matches DEFAULT_GAME_SETTINGS', badType.length === 0, badType.slice(0, 5).map(l => l.slice(0, 60)).join(' / '));
  const badDefault = rows7.filter(l => { const c = l.split(/(?<!\\)\|/).map(x => x.trim()); const k = c[1].replace(/`/g, ''); const v = G.DEFAULT_GAME_SETTINGS[k]; if (typeof v === 'boolean' || typeof v === 'number') return c[3] !== String(v); return false; });
  ok('§7 default column matches for every switch and number', badDefault.length === 0, badDefault.slice(0, 5).map(l => l.slice(0, 70)).join(' / '));
  const inert = new Set([...G.V99_INERT_SETTINGS, ...G.V101_INERT_SETTINGS].map(x => x.key));
  const inertRows = rows7.filter(l => /inactive \(V(9\.9|10\.1)\)/.test(l)).map(l => l.split('|')[1].trim().replace(/`/g, ''));
  ok('§7 marks exactly the 20 inactive settings', inertRows.length === inert.size && inertRows.every(k => inert.has(k)), `${inertRows.length} marked`);
  // UX-4: §7's "card:" notes against What's in the game's cards: every card switch, and nothing else, names its card as the page does
  // (a note reads "card: <page name>", followed by " (UX-1: <working name>)" where the two differ).
  const skipped = [];
  if (G.V114_CARDS) {
    const want = new Map(); G.V114_CARDS.forEach(c => G.v114CardKeys(c).forEach(k => want.set(k, G.v114CardName(c))));
    const got = new Map();
    rows7.forEach(l => {
      const c = l.split(/(?<!\\)\|/).map(x => x.trim()); const item = c[11].split('; ').find(n => n.startsWith('card: '));
      if (!item) return;
      const ux1 = item.lastIndexOf(' (UX-1: ');
      got.set(c[1].replace(/`/g, ''), ux1 > 0 && item.endsWith(')') ? item.slice(6, ux1) : item.slice(6));
    });
    const wrong = [...want].filter(([k, n]) => got.get(k) !== n).map(([k, n]) => `${k}: map "${got.get(k)}" / game "${n}"`);
    const extra = [...got.keys()].filter(k => !want.has(k)).map(k => `${k}: not a card switch`);
    ok(`§7 marks exactly the ${want.size} switches of the ${G.V114_CARDS.length} cards, each with its card's name`, wrong.length === 0 && extra.length === 0, [...wrong, ...extra].slice(0, 5).join(' / '));
  } else skipped.push("§7 card notes: this module has no What's in the game cards (a file before UX-4)");
  // §8 nested
  const s8 = section('## 8. Nested settings', '## 9.');
  const objs = keys.filter(k => G.DEFAULT_GAME_SETTINGS[k] && typeof G.DEFAULT_GAME_SETTINGS[k] === 'object' && !Array.isArray(G.DEFAULT_GAME_SETTINGS[k]));
  const missingNested = []; objs.forEach(k => { const row = s8.split('\n').find(l => l.startsWith('| `' + k + '`')); if (!row) { missingNested.push(k); return; } Object.keys(G.DEFAULT_GAME_SETTINGS[k]).forEach(n => { if (!row.includes('`' + n + '`')) missingNested.push(`${k}.${n}`); }); });
  ok('§8 lists every nested field of every object setting', missingNested.length === 0, missingNested.slice(0, 8).join(','));
  // §6 group plan covers every section; §7 gives every key a V11.0 home
  const noHome = rows7.filter(l => { const c = l.split(/(?<!\\)\|/).map(x => x.trim()); return !c[9] || c[9] === "null" || c[9] === "undefined"; });
  ok('§7 gives every key a V11.0 home', noHome.length === 0, noHome.slice(0, 5).map(l => l.slice(0, 60)).join(' / '));
  // shortcuts: every KEYBOARD_SHORTCUTS key appears in §10 (the constant is not exported; check the labels instead)
  const s10 = section('## 10. Keyboard shortcuts', '## 11.');
  ['Space', 'C / T / R / M / W', 'G', 'N / H / P', '?', 'Escape', 'Ctrl+Shift+C', 'Ctrl/⌘+S', 'Ctrl/⌘+K', 'Alt+C', 'Ctrl+Alt+D', 'Shift+Escape'].forEach(k => ok(`§10 lists ${k}`, s10.includes(k)));
  // A check that cannot run is reported as skipped, never counted as a pass.
  return [...out, ...skipped.map(s => `SKIP ${s}`), '', `${out.length - fail.length} of ${out.length} checks pass${skipped.length ? `, ${skipped.length} skipped` : ''}`].join('\n');
};
