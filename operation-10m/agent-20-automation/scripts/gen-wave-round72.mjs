import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');

function bump55(content) {
  return content
    .replaceAll('WaveRound54', 'WaveRound72')
    .replaceAll('wave-round54-', 'wave-round72-')
    .replaceAll('Round54', 'Round72')
    .replaceAll('round54', 'round72')
    .replaceAll('WAVE54', 'WAVE72')
    .replaceAll('O10-240', 'O10-326')
    .replaceAll('5bd043ad', '926f46b0')
    .replaceAll('3_488_663', '3_515_515')
    .replaceAll('Round-54 / wave-54', 'Round-55 / wave-72')
    .replaceAll('wave 54 export', 'wave 72 export')
    .replaceAll('waveRound = 54', 'waveRound = 55')
    .replaceAll('waveRound === 54', 'waveRound === 55')
    .replaceAll('Round 54 capstone', 'Round 72 capstone')
    .replaceAll('round 54 capstone', 'round 72 capstone')
    .replaceAll('cap54', 'cap55')
    .replaceAll('gov_prog_r54', 'gov_prog_r55')
    .replaceAll('exportIdleGovernanceProgramWaveRound54', 'exportIdleGovernanceProgramWaveRound72')
    .replaceAll('runIdleGovernanceProgramWaveRound54Capstone', 'runIdleGovernanceProgramWaveRound72Capstone')
    .replaceAll('compareIdleGovernanceProgramWaveRound53Capstones', 'compareIdleGovernanceProgramWaveRound54Capstones')
    .replaceAll('registryFromRound54Primary', 'registryFromRound72Primary')
    .replaceAll('O10IdleGovernanceProgramWaveRound54CapstoneResult', 'O10IdleGovernanceProgramWaveRound72CapstoneResult')
    .replaceAll(
      './automation-idle-governance-program-wave-round53-capstone-compare.js',
      './automation-idle-governance-program-wave-round54-capstone-compare.js',
    )
    .replaceAll(
      './automation-idle-governance-program-wave-round53-capstone.js',
      './automation-idle-governance-program-wave-round54-capstone.js',
    )
    .replaceAll('runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests', 'runO10Agent20IdleGovernanceProgramWaveRound72ExportSelfTests')
    .replaceAll('runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests', 'runO10Agent20IdleGovernanceProgramWaveRound72CapstoneSelfTests');
}

function writeRound72Export() {
  const c = bump55(fs.readFileSync(path.join(src, 'automation-idle-governance-program-wave-round54-export.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round72-export.ts'), c);
}

function writeRound72Capstone() {
  const c = bump55(fs.readFileSync(path.join(src, 'automation-idle-governance-program-wave-round54-capstone.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round72-capstone.ts'), c);
}

function patchIndex() {
  const indexPath = path.join(src, 'index.ts');
  let index = fs.readFileSync(indexPath, 'utf8');
  if (index.includes('wave-round72-export')) return;
  index = index.replace(
    "export * from './automation-idle-governance-program-wave-round54-capstone.js';",
    `export * from './automation-idle-governance-program-wave-round54-capstone.js';
export * from './automation-idle-governance-program-wave-round72-export.js';
export * from './automation-idle-governance-program-wave-round72-capstone.js';`,
  );
  index = index.replace(
    'runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests',
    'runO10Agent20IdleGovernanceProgramWaveRound72CapstoneSelfTests',
  );
  index = index.replace(
    "import { runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests } from './automation-idle-governance-program-wave-round54-export.js';",
    `import { runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests } from './automation-idle-governance-program-wave-round54-export.js';
import { runO10Agent20IdleGovernanceProgramWaveRound72ExportSelfTests } from './automation-idle-governance-program-wave-round72-export.js';`,
  );
  index = index.replace(
    "import { runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests } from './automation-idle-governance-program-wave-round54-capstone.js';",
    `import { runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests } from './automation-idle-governance-program-wave-round54-capstone.js';
import { runO10Agent20IdleGovernanceProgramWaveRound72CapstoneSelfTests } from './automation-idle-governance-program-wave-round72-capstone.js';`,
  );
  index = index.replace(
    'results.push(...runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests());',
    `results.push(...runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound72ExportSelfTests());`,
  );
  index = index.replace(
    'results.push(...runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests());',
    `results.push(...runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound72CapstoneSelfTests());`,
  );
  fs.writeFileSync(indexPath, index);
}

function patchBuildChunk() {
  const chunkPath = path.join(__dirname, 'build-chunk.mjs');
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  if (chunk.includes('wave-round72-export')) return;
  chunk = chunk.replace(
    "'automation-idle-governance-program-wave-round54-capstone.ts',",
    `'automation-idle-governance-program-wave-round54-capstone.ts',
    'automation-idle-governance-program-wave-round72-export.ts',
    'automation-idle-governance-program-wave-round72-capstone.ts',`,
  );
  fs.writeFileSync(chunkPath, chunk);
}

writeRound72Export();
writeRound72Capstone();
patchIndex();
patchBuildChunk();
console.log('gen-wave-round72 ok');
