import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');

function bump(content) {
  return content
    .replaceAll('WaveRound52', 'WaveRound53')
    .replaceAll('wave-round52-', 'wave-round53-')
    .replaceAll('WaveRound51', 'WaveRound52')
    .replaceAll('wave-round51-', 'wave-round52-')
    .replaceAll('Round52', 'Round53')
    .replaceAll('round52', 'round53')
    .replaceAll('Round51', 'Round52')
    .replaceAll('round51', 'round52')
    .replaceAll('Round50Capstone', 'Round51Capstone')
    .replaceAll('round50Capstone', 'round51Capstone')
    .replaceAll('WAVE52', 'WAVE53')
    .replaceAll('WAVE51', 'WAVE52')
    .replaceAll('O10-235', 'O10-237')
    .replaceAll('O10-233', 'O10-235')
    .replaceAll('ba97bdce', '51039c5e')
    .replaceAll('a32b2b15', 'ba97bdce')
    .replaceAll('2_932_752', '2_979_928')
    .replaceAll('2_887_600', '2_932_752')
    .replaceAll('Round-52 / wave-52', 'Round-53 / wave-53')
    .replaceAll('Round-51 / wave-51', 'Round-52 / wave-52')
    .replaceAll('wave 52 export', 'wave 53 export')
    .replaceAll('wave 51 export', 'wave 52 export')
    .replaceAll('waveRound = 52', 'waveRound = 53')
    .replaceAll('waveRound === 52', 'waveRound === 53')
    .replaceAll('waveRound = 51', 'waveRound = 52')
    .replaceAll('waveRound === 51', 'waveRound === 52')
    .replaceAll('Round 52 capstone', 'Round 53 capstone')
    .replaceAll('round 52 capstone', 'round 53 capstone')
    .replaceAll('Round 51 capstone', 'Round 52 capstone')
    .replaceAll('cap52', 'cap53')
    .replaceAll('cap51', 'cap52')
    .replaceAll('gov_prog_r52', 'gov_prog_r53')
    .replaceAll('gov_prog_r51', 'gov_prog_r52')
    .replaceAll('exportIdleGovernanceProgramWaveRound52', 'exportIdleGovernanceProgramWaveRound53')
    .replaceAll('runIdleGovernanceProgramWaveRound52Capstone', 'runIdleGovernanceProgramWaveRound53Capstone')
    .replaceAll('runIdleGovernanceProgramWaveRound51Capstone', 'runIdleGovernanceProgramWaveRound52Capstone')
    .replaceAll('compareIdleGovernanceProgramWaveRound51Capstones', 'compareIdleGovernanceProgramWaveRound52Capstones')
    .replaceAll('compareIdleGovernanceProgramWaveRound50Capstones', 'compareIdleGovernanceProgramWaveRound51Capstones')
    .replaceAll('registryFromRound52Primary', 'registryFromRound53Primary')
    .replaceAll('registryFromRound51Primary', 'registryFromRound52Primary')
    .replaceAll('O10IdleGovernanceProgramWaveRound52CapstoneResult', 'O10IdleGovernanceProgramWaveRound53CapstoneResult')
    .replaceAll('O10IdleGovernanceProgramWaveRound51CapstoneResult', 'O10IdleGovernanceProgramWaveRound52CapstoneResult')
    .replaceAll(
      './automation-idle-governance-program-wave-round51-capstone-compare.js',
      './automation-idle-governance-program-wave-round52-capstone-compare.js',
    )
    .replaceAll(
      './automation-idle-governance-program-wave-round50-capstone-compare.js',
      './automation-idle-governance-program-wave-round51-capstone-compare.js',
    )
    .replaceAll(
      './automation-idle-governance-program-wave-round51-capstone.js',
      './automation-idle-governance-program-wave-round52-capstone.js',
    )
    .replaceAll(
      './automation-idle-governance-program-wave-round50-capstone.js',
      './automation-idle-governance-program-wave-round51-capstone.js',
    )
    .replaceAll('runO10Agent20IdleGovernanceProgramWaveRound52ExportSelfTests', 'runO10Agent20IdleGovernanceProgramWaveRound53ExportSelfTests')
    .replaceAll('runO10Agent20IdleGovernanceProgramWaveRound52CapstoneSelfTests', 'runO10Agent20IdleGovernanceProgramWaveRound53CapstoneSelfTests');
}

function writeRound53Export() {
  const c = bump(fs.readFileSync(path.join(src, 'automation-idle-governance-program-wave-round52-export.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round53-export.ts'), c);
}

function writeRound53Capstone() {
  const c = bump(fs.readFileSync(path.join(src, 'automation-idle-governance-program-wave-round52-capstone.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round53-capstone.ts'), c);
}

function patchIndex() {
  const indexPath = path.join(src, 'index.ts');
  let index = fs.readFileSync(indexPath, 'utf8');
  if (index.includes('wave-round53-export')) return;
  index = index.replace(
    "export * from './automation-idle-governance-program-wave-round52-capstone.js';",
    `export * from './automation-idle-governance-program-wave-round52-capstone.js';
export * from './automation-idle-governance-program-wave-round53-export.js';
export * from './automation-idle-governance-program-wave-round53-capstone.js';`,
  );
  index = index.replace(
    'runO10Agent20IdleGovernanceProgramWaveRound52CapstoneSelfTests',
    `runO10Agent20IdleGovernanceProgramWaveRound53CapstoneSelfTests`,
  );
  index = index.replace(
    "import { runO10Agent20IdleGovernanceProgramWaveRound52ExportSelfTests } from './automation-idle-governance-program-wave-round52-export.js';",
    `import { runO10Agent20IdleGovernanceProgramWaveRound52ExportSelfTests } from './automation-idle-governance-program-wave-round52-export.js';
import { runO10Agent20IdleGovernanceProgramWaveRound53ExportSelfTests } from './automation-idle-governance-program-wave-round53-export.js';`,
  );
  index = index.replace(
    "import { runO10Agent20IdleGovernanceProgramWaveRound52CapstoneSelfTests } from './automation-idle-governance-program-wave-round52-capstone.js';",
    `import { runO10Agent20IdleGovernanceProgramWaveRound52CapstoneSelfTests } from './automation-idle-governance-program-wave-round52-capstone.js';
import { runO10Agent20IdleGovernanceProgramWaveRound53CapstoneSelfTests } from './automation-idle-governance-program-wave-round53-capstone.js';`,
  );
  index = index.replace(
    'results.push(...runO10Agent20IdleGovernanceProgramWaveRound52ExportSelfTests());',
    `results.push(...runO10Agent20IdleGovernanceProgramWaveRound52ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound53ExportSelfTests());`,
  );
  index = index.replace(
    'results.push(...runO10Agent20IdleGovernanceProgramWaveRound52CapstoneSelfTests());',
    `results.push(...runO10Agent20IdleGovernanceProgramWaveRound52CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound53CapstoneSelfTests());`,
  );
  fs.writeFileSync(indexPath, index);
}

function patchBuildChunk() {
  const chunkPath = path.join(__dirname, 'build-chunk.mjs');
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  if (chunk.includes('wave-round53-export')) return;
  chunk = chunk.replace(
    "'automation-idle-governance-program-wave-round52-capstone.ts',",
    `'automation-idle-governance-program-wave-round52-capstone.ts',
    'automation-idle-governance-program-wave-round53-export.ts',
    'automation-idle-governance-program-wave-round53-capstone.ts',`,
  );
  fs.writeFileSync(chunkPath, chunk);
}

writeRound53Export();
writeRound53Capstone();
patchIndex();
patchBuildChunk();
console.log('gen-wave-round53 ok');
