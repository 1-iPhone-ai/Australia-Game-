import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');

function bump54(content) {
  return content
    .replaceAll('WaveRound53', 'WaveRound54')
    .replaceAll('wave-round53-', 'wave-round54-')
    .replaceAll('Round53', 'Round54')
    .replaceAll('round53', 'round54')
    .replaceAll('WAVE53', 'WAVE54')
    .replaceAll('O10-237', 'O10-240')
    .replaceAll('51039c5e', '5bd043ad')
    .replaceAll('2_979_928', '3_022_056')
    .replaceAll('Round-53 / wave-53', 'Round-54 / wave-54')
    .replaceAll('wave 53 export', 'wave 54 export')
    .replaceAll('waveRound = 53', 'waveRound = 54')
    .replaceAll('waveRound === 53', 'waveRound === 54')
    .replaceAll('Round 53 capstone', 'Round 54 capstone')
    .replaceAll('round 53 capstone', 'round 54 capstone')
    .replaceAll('cap53', 'cap54')
    .replaceAll('gov_prog_r53', 'gov_prog_r54')
    .replaceAll('exportIdleGovernanceProgramWaveRound53', 'exportIdleGovernanceProgramWaveRound54')
    .replaceAll('runIdleGovernanceProgramWaveRound53Capstone', 'runIdleGovernanceProgramWaveRound54Capstone')
    .replaceAll('compareIdleGovernanceProgramWaveRound52Capstones', 'compareIdleGovernanceProgramWaveRound53Capstones')
    .replaceAll('registryFromRound53Primary', 'registryFromRound54Primary')
    .replaceAll('O10IdleGovernanceProgramWaveRound53CapstoneResult', 'O10IdleGovernanceProgramWaveRound54CapstoneResult')
    .replaceAll(
      './automation-idle-governance-program-wave-round52-capstone-compare.js',
      './automation-idle-governance-program-wave-round53-capstone-compare.js',
    )
    .replaceAll(
      './automation-idle-governance-program-wave-round52-capstone.js',
      './automation-idle-governance-program-wave-round53-capstone.js',
    )
    .replaceAll('runO10Agent20IdleGovernanceProgramWaveRound53ExportSelfTests', 'runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests')
    .replaceAll('runO10Agent20IdleGovernanceProgramWaveRound53CapstoneSelfTests', 'runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests');
}

function writeRound54Export() {
  const c = bump54(fs.readFileSync(path.join(src, 'automation-idle-governance-program-wave-round53-export.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round54-export.ts'), c);
}

function writeRound54Capstone() {
  const c = bump54(fs.readFileSync(path.join(src, 'automation-idle-governance-program-wave-round53-capstone.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round54-capstone.ts'), c);
}

function patchIndex() {
  const indexPath = path.join(src, 'index.ts');
  let index = fs.readFileSync(indexPath, 'utf8');
  if (index.includes('wave-round54-export')) return;
  index = index.replace(
    "export * from './automation-idle-governance-program-wave-round53-capstone.js';",
    `export * from './automation-idle-governance-program-wave-round53-capstone.js';
export * from './automation-idle-governance-program-wave-round54-export.js';
export * from './automation-idle-governance-program-wave-round54-capstone.js';`,
  );
  index = index.replace(
    'runO10Agent20IdleGovernanceProgramWaveRound53CapstoneSelfTests',
    'runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests',
  );
  index = index.replace(
    "import { runO10Agent20IdleGovernanceProgramWaveRound53ExportSelfTests } from './automation-idle-governance-program-wave-round53-export.js';",
    `import { runO10Agent20IdleGovernanceProgramWaveRound53ExportSelfTests } from './automation-idle-governance-program-wave-round53-export.js';
import { runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests } from './automation-idle-governance-program-wave-round54-export.js';`,
  );
  index = index.replace(
    "import { runO10Agent20IdleGovernanceProgramWaveRound53CapstoneSelfTests } from './automation-idle-governance-program-wave-round53-capstone.js';",
    `import { runO10Agent20IdleGovernanceProgramWaveRound53CapstoneSelfTests } from './automation-idle-governance-program-wave-round53-capstone.js';
import { runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests } from './automation-idle-governance-program-wave-round54-capstone.js';`,
  );
  index = index.replace(
    'results.push(...runO10Agent20IdleGovernanceProgramWaveRound53ExportSelfTests());',
    `results.push(...runO10Agent20IdleGovernanceProgramWaveRound53ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests());`,
  );
  index = index.replace(
    'results.push(...runO10Agent20IdleGovernanceProgramWaveRound53CapstoneSelfTests());',
    `results.push(...runO10Agent20IdleGovernanceProgramWaveRound53CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests());`,
  );
  fs.writeFileSync(indexPath, index);
}

function patchBuildChunk() {
  const chunkPath = path.join(__dirname, 'build-chunk.mjs');
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  if (chunk.includes('wave-round54-export')) return;
  chunk = chunk.replace(
    "'automation-idle-governance-program-wave-round53-capstone.ts',",
    `'automation-idle-governance-program-wave-round53-capstone.ts',
    'automation-idle-governance-program-wave-round54-export.ts',
    'automation-idle-governance-program-wave-round54-capstone.ts',`,
  );
  fs.writeFileSync(chunkPath, chunk);
}

writeRound54Export();
writeRound54Capstone();
patchIndex();
patchBuildChunk();
console.log('gen-wave-round54 ok');
