import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');

function bump55(content) {
  return content
    .replaceAll('WaveRound54', 'WaveRound55')
    .replaceAll('wave-round54-', 'wave-round55-')
    .replaceAll('Round54', 'Round55')
    .replaceAll('round54', 'round55')
    .replaceAll('WAVE54', 'WAVE55')
    .replaceAll('O10-240', 'O10-247')
    .replaceAll('5bd043ad', 'c4bbec67')
    .replaceAll('3_022_056', '3_054_213')
    .replaceAll('Round-54 / wave-54', 'Round-55 / wave-55')
    .replaceAll('wave 54 export', 'wave 55 export')
    .replaceAll('waveRound = 54', 'waveRound = 55')
    .replaceAll('waveRound === 54', 'waveRound === 55')
    .replaceAll('Round 54 capstone', 'Round 55 capstone')
    .replaceAll('round 54 capstone', 'round 55 capstone')
    .replaceAll('cap54', 'cap55')
    .replaceAll('gov_prog_r54', 'gov_prog_r55')
    .replaceAll('exportIdleGovernanceProgramWaveRound54', 'exportIdleGovernanceProgramWaveRound55')
    .replaceAll('runIdleGovernanceProgramWaveRound54Capstone', 'runIdleGovernanceProgramWaveRound55Capstone')
    .replaceAll('compareIdleGovernanceProgramWaveRound53Capstones', 'compareIdleGovernanceProgramWaveRound54Capstones')
    .replaceAll('registryFromRound54Primary', 'registryFromRound55Primary')
    .replaceAll('O10IdleGovernanceProgramWaveRound54CapstoneResult', 'O10IdleGovernanceProgramWaveRound55CapstoneResult')
    .replaceAll(
      './automation-idle-governance-program-wave-round53-capstone-compare.js',
      './automation-idle-governance-program-wave-round54-capstone-compare.js',
    )
    .replaceAll(
      './automation-idle-governance-program-wave-round53-capstone.js',
      './automation-idle-governance-program-wave-round54-capstone.js',
    )
    .replaceAll('runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests', 'runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests')
    .replaceAll('runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests', 'runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests');
}

function writeRound55Export() {
  const c = bump55(fs.readFileSync(path.join(src, 'automation-idle-governance-program-wave-round54-export.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round55-export.ts'), c);
}

function writeRound55Capstone() {
  const c = bump55(fs.readFileSync(path.join(src, 'automation-idle-governance-program-wave-round54-capstone.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round55-capstone.ts'), c);
}

function patchIndex() {
  const indexPath = path.join(src, 'index.ts');
  let index = fs.readFileSync(indexPath, 'utf8');
  if (index.includes('wave-round55-export')) return;
  index = index.replace(
    "export * from './automation-idle-governance-program-wave-round54-capstone.js';",
    `export * from './automation-idle-governance-program-wave-round54-capstone.js';
export * from './automation-idle-governance-program-wave-round55-export.js';
export * from './automation-idle-governance-program-wave-round55-capstone.js';`,
  );
  index = index.replace(
    'runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests',
    'runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests',
  );
  index = index.replace(
    "import { runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests } from './automation-idle-governance-program-wave-round54-export.js';",
    `import { runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests } from './automation-idle-governance-program-wave-round54-export.js';
import { runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests } from './automation-idle-governance-program-wave-round55-export.js';`,
  );
  index = index.replace(
    "import { runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests } from './automation-idle-governance-program-wave-round54-capstone.js';",
    `import { runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests } from './automation-idle-governance-program-wave-round54-capstone.js';
import { runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests } from './automation-idle-governance-program-wave-round55-capstone.js';`,
  );
  index = index.replace(
    'results.push(...runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests());',
    `results.push(...runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests());`,
  );
  index = index.replace(
    'results.push(...runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests());',
    `results.push(...runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests());`,
  );
  fs.writeFileSync(indexPath, index);
}

function patchBuildChunk() {
  const chunkPath = path.join(__dirname, 'build-chunk.mjs');
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  if (chunk.includes('wave-round55-export')) return;
  chunk = chunk.replace(
    "'automation-idle-governance-program-wave-round54-capstone.ts',",
    `'automation-idle-governance-program-wave-round54-capstone.ts',
    'automation-idle-governance-program-wave-round55-export.ts',
    'automation-idle-governance-program-wave-round55-capstone.ts',`,
  );
  fs.writeFileSync(chunkPath, chunk);
}

writeRound55Export();
writeRound55Capstone();
patchIndex();
patchBuildChunk();
console.log('gen-wave-round55 ok');
