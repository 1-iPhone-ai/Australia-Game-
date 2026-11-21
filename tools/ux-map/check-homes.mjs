// node tools/selftest/node-eval.mjs tools/ux-map/check-homes.mjs --file "(V11.0) australia-game-with-ai.tsx"   (MAP=path/to/map.md; default: the repo's V11.0_UX_MAP.md)
// UX-3: the map's "V11.0 home" column (§7) against the homes the game uses with the layered Settings on (v113HomeOf), key by key.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const MAP = process.env.MAP || fileURLToPath(new URL('../../V11.0_UX_MAP.md', import.meta.url));
export default async (G) => {
  const md = fs.readFileSync(MAP, 'utf8');
  const a = md.indexOf('## 7. Every setting'); const b = md.indexOf('## 8.', a);
  const rows = md.slice(a, b).split('\n').filter(l => l.startsWith('| `'));
  const ICON = { '⭐': 'essentials', '🎮': 'match', '🤖': 'rival', '👥': 'teams', '🧭': 'help', '🔬': 'tools' };
  const bad = []; let n = 0;
  for (const l of rows) {
    const c = l.split(/(?<!\\)\|/).map(x => x.trim()); const key = c[1].replace(/`/g, ''); const home = c[9]; n++;
    const mine = G.v113HomeOf(key); const g = G.v113GroupOfHome(mine);
    if (/^internal/.test(home)) { if (mine !== 'v113.internal') bad.push(`${key}: map internal, game ${mine}`); continue; }
    const want = ICON[[...home][0]];
    if (want !== g) { bad.push(`${key}: map ${home.slice(0, 50)} / game ${mine} (${g})`); continue; }
    const m = home.match(/›\s*(.+?)(?:\s*\((?:show inactive|new)[^)]*\))*\s*$/);
    const title = m ? m[1].replace(/\s*\(show inactive.*$/, '').trim() : null;
    if (want !== 'essentials' && title && !G.isV113PseudoId(mine)) { const t = G.v113HomeTitle(mine); if (t !== title && !t.endsWith(title) && !title.endsWith(t.replace(/^\S+\s/, ''))) bad.push(`${key}: map title "${title}" / game "${t}"`); }
  }
  console.log(JSON.stringify({ rows: n, mismatches: bad.length, bad: bad.slice(0, 20) }, null, 1));
};
