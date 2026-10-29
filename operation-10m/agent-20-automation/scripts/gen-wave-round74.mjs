import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');

function bump55(content) {
  return content
    .replaceAll('WaveRound54', 'WaveRound74')
    .replaceAll('wave-round54-', 'wave-round74-')
    .replaceAll('Round54', 'Round74')
    .replaceAll('round54', 'round74')
    .replaceAll('WAVE54', 'WAVE74')
    .replaceAll('O10-240', 'O10-343')
    .replaceAll('5bd043ad', '72a7aee6')
    .replaceAll('3_542_367', '3_569_219')
    .replaceAll('Round-54 / wave-54', 'Round-55 / wave-74')
    .replaceAll('wave 54 export', 'wave 74 export')
    .replaceAll('waveRound = 54', 'waveRound = 55')
    .replaceAll('waveRound === 54', 'waveRound === 55')
    .replaceAll('Round 54 capstone', 'Round 74 capstone')
    .replaceAll('round 54 capstone', 'round 74 capstone')
    .replaceAll('cap54', 'cap55')
    .replaceAll('gov_prog_r54', 'gov_prog_r55')
    .replaceAll('exportIdleGovernanceProgramWaveRound54', 'exportIdleGovernanceProgramWaveRound74')
    .replaceAll('runIdleGovernanceProgramWaveRound54Capstone', 'runIdleGovernanceProgramWaveRound74Capstone')
    .replaceAll('compareIdleGovernanceProgramWaveRound53Capstones', 'compareIdleGovernanceProgramWaveRound54Capstones')
    .replaceAll('registryFromRound54Primary', 'registryFromRound74Primary')
    .replaceAll('O10IdleGovernanceProgramWaveRound54CapstoneResult', 'O10IdleGovernanceProgramWaveRound74CapstoneResult')
    .replaceAll(
      './automation-idle-governance-program-wave-round53-capstone-compare.js',
      './automation-idle-governance-program-wave-round54-capstone-compare.js',
    )
    .replaceAll(
      './automation-idle-governance-program-wave-round53-capstone.js',
      './automation-idle-governance-program-wave-round54-capstone.js',
    )
    .replaceAll('runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests', 'runO10Agent20IdleGovernanceProgramWaveRound74ExportSelfTests')
    .replaceAll('runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests', 'runO10Agent20IdleGovernanceProgramWaveRound74CapstoneSelfTests');
}

function writeRound74Export() {
  const c = bump55(fs.readFileSync(path.join(src, 'automation-idle-governance-program-wave-round54-export.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round74-export.ts'), c);
}

function writeRound74Capstone() {
  const c = bump55(fs.readFileSync(path.join(src, 'automation-idle-governance-program-wave-round54-capstone.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round74-capstone.ts'), c);
}

function patchIndex() {
  const indexPath = path.join(src, 'index.ts');
  let index = fs.readFileSync(indexPath, 'utf8');
  if (index.includes('wave-round74-export')) return;
  index = index.replace(
    "export * from './automation-idle-governance-program-wave-round54-capstone.js';",
    `export * from './automation-idle-governance-program-wave-round54-capstone.js';
export * from './automation-idle-governance-program-wave-round74-export.js';
export * from './automation-idle-governance-program-wave-round74-capstone.js';`,
  );
  index = index.replace(
    'runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests',
    'runO10Agent20IdleGovernanceProgramWaveRound74CapstoneSelfTests',
  );
  index = index.replace(
    "import { runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests } from './automation-idle-governance-program-wave-round54-export.js';",
    `import { runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests } from './automation-idle-governance-program-wave-round54-export.js';
import { runO10Agent20IdleGovernanceProgramWaveRound74ExportSelfTests } from './automation-idle-governance-program-wave-round74-export.js';`,
  );
  index = index.replace(
    "import { runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests } from './automation-idle-governance-program-wave-round54-capstone.js';",
    `import { runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests } from './automation-idle-governance-program-wave-round54-capstone.js';
import { runO10Agent20IdleGovernanceProgramWaveRound74CapstoneSelfTests } from './automation-idle-governance-program-wave-round74-capstone.js';`,
  );
  index = index.replace(
    'results.push(...runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests());',
    `results.push(...runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound74ExportSelfTests());`,
  );
  index = index.replace(
    'results.push(...runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests());',
    `results.push(...runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound74CapstoneSelfTests());`,
  );
  fs.writeFileSync(indexPath, index);
}

function patchBuildChunk() {
  const chunkPath = path.join(__dirname, 'build-chunk.mjs');
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  if (chunk.includes('wave-round74-export')) return;
  chunk = chunk.replace(
    "'automation-idle-governance-program-wave-round54-capstone.ts',",
    `'automation-idle-governance-program-wave-round54-capstone.ts',
    'automation-idle-governance-program-wave-round74-export.ts',
    'automation-idle-governance-program-wave-round74-capstone.ts',`,
  );
  fs.writeFileSync(chunkPath, chunk);
}

writeRound74Export();
writeRound74Capstone();
patchIndex();
patchBuildChunk();
console.log('gen-wave-round74 ok');
