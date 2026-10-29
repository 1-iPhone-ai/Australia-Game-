import {
  classifyO111ViewportBand,
  readO111ViewportSnapshot,
  resolveEffectiveSettingsCategoryNavMode,
  runO111ResponsiveUiSelfTests,
} from '../../(V9.4) australia-game-with-ai.tsx';

function assert(name: string, ok: boolean, detail?: string) {
  if (!ok) {
    console.error(`FAIL ${name}${detail ? `: ${detail}` : ''}`);
    process.exitCode = 1;
  } else {
    console.log(`ok ${name}`);
  }
}

const failed = runO111ResponsiveUiSelfTests().filter(t => !t.passed);
assert('runO111ResponsiveUiSelfTests', failed.length === 0, failed.map(f => f.id).join(', '));

assert('classify compact', classifyO111ViewportBand(400) === 'compact');
assert('classify wide', classifyO111ViewportBand(1600) === 'wide');

const snap = readO111ViewportSnapshot({ width: 720, height: 900 });
assert('read snapshot cozy', snap.band === 'cozy' && snap.width === 720);

const nav = resolveEffectiveSettingsCategoryNavMode(
  {
    settingsCategoryNavigationMode: 'full',
    autoCollapseCategoriesOnNarrow: true,
    rememberCategoryNavigationMode: false,
    allowSettingsCategoryCollapse: true,
  },
  'compact'
);
assert('auto collapse dropdown', nav === 'category_dropdown');

if (process.exitCode) {
  process.exit(process.exitCode);
}
