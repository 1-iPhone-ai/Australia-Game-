import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');

function bump54(content) {
  return content
    .replaceAll('WaveRound55', 'WaveRound55')
    .replaceAll('wave-round55-', 'wave-round55-')
    .replaceAll('Round55', 'Round55')
    .replaceAll('round55', 'round55')
    .replaceAll('WAVE53', 'WAVE55')
    .replaceAll('O10-247', 'O10-247')
    .replaceAll('51039c5e', 'c4bbec67')
    .replaceAll('3_022_056', '3_054_213')
    .replaceAll('Round-53 / wave-53', 'Round-54 / wave-55')
    .replaceAll('wave 53 export', 'wave 55 export')
    .replaceAll('waveRound = 53', 'waveRound = 54')
    .replaceAll('waveRound === 53', 'waveRound === 54')
    .replaceAll('Round 53 capstone', 'Round 55 capstone')
    .replaceAll('round 53 capstone', 'round 55 capstone')
    .replaceAll('cap53', 'cap54')
    .replaceAll('gov_prog_r53', 'gov_prog_r54')
    .replaceAll('exportIdleGovernanceProgramWaveRound55', 'exportIdleGovernanceProgramWaveRound55')
    .replaceAll('runIdleGovernanceProgramWaveRound55Capstone', 'runIdleGovernanceProgramWaveRound55Capstone')
    .replaceAll('compareIdleGovernanceProgramWaveRound52Capstones', 'compareIdleGovernanceProgramWaveRound55Capstones')
    .replaceAll('registryFromRound55Primary', 'registryFromRound55Primary')
    .replaceAll('O10IdleGovernanceProgramWaveRound55CapstoneResult', 'O10IdleGovernanceProgramWaveRound55CapstoneResult')
    .replaceAll(
      './automation-idle-governance-program-wave-round52-capstone-compare.js',
      './automation-idle-governance-program-wave-round55-capstone-compare.js',
    )
    .replaceAll(
      './automation-idle-governance-program-wave-round52-capstone.js',
      './automation-idle-governance-program-wave-round55-capstone.js',
    )
    .replaceAll('runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests', 'runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests')
    .replaceAll('runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests', 'runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests');
}

function writeRound55Export() {
  const c = bump54(fs.readFileSync(path.join(src, 'automation-idle-governance-program-wave-round55-export.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round55-export.ts'), c);
}

function writeRound55Capstone() {
  const c = bump54(fs.readFileSync(path.join(src, 'automation-idle-governance-program-wave-round55-capstone.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round55-capstone.ts'), c);
}

function patchIndex() {
  const indexPath = path.join(src, 'index.ts');
  let index = fs.readFileSync(indexPath, 'utf8');
  if (index.includes('wave-round55-export')) return;
  index = index.replace(
    "export * from './automation-idle-governance-program-wave-round55-capstone.js';",
    `export * from './automation-idle-governance-program-wave-round55-capstone.js';
export * from './automation-idle-governance-program-wave-round55-export.js';
export * from './automation-idle-governance-program-wave-round55-capstone.js';`,
  );
  index = index.replace(
    'runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests',
    'runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests',
  );
  index = index.replace(
    "import { runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests } from './automation-idle-governance-program-wave-round55-export.js';",
    `import { runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests } from './automation-idle-governance-program-wave-round55-export.js';
import { runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests } from './automation-idle-governance-program-wave-round55-export.js';`,
  );
  index = index.replace(
    "import { runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests } from './automation-idle-governance-program-wave-round55-capstone.js';",
    `import { runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests } from './automation-idle-governance-program-wave-round55-capstone.js';
import { runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests } from './automation-idle-governance-program-wave-round55-capstone.js';`,
  );
  index = index.replace(
    'results.push(...runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests());',
    `results.push(...runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests());`,
  );
  index = index.replace(
    'results.push(...runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests());',
    `results.push(...runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests());`,
  );
  fs.writeFileSync(indexPath, index);
}

function patchBuildChunk() {
  const chunkPath = path.join(__dirname, 'build-chunk.mjs');
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  if (chunk.includes('wave-round55-export')) return;
  chunk = chunk.replace(
    "'automation-idle-governance-program-wave-round55-capstone.ts',",
    `'automation-idle-governance-program-wave-round55-capstone.ts',
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
