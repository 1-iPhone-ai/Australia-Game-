import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');

function writeRound51Compare() {
  let c = fs.readFileSync(
    path.join(src, 'automation-idle-governance-program-wave-round50-capstone-compare.ts'),
    'utf8',
  );
  c = c
    .replaceAll('WaveRound50Capstone', 'WaveRound51Capstone')
    .replaceAll('wave-round50-capstone', 'wave-round51-capstone')
    .replaceAll('Round50Capstone', 'Round51Capstone')
    .replaceAll('round50Capstone', 'round51Capstone')
    .replaceAll('compareRound50CapstoneFields', 'compareRound51CapstoneFields')
    .replaceAll('compareIdleGovernanceProgramWaveRound50Capstones', 'compareIdleGovernanceProgramWaveRound51Capstones')
    .replaceAll('round50_export_ready', 'round51_export_ready')
    .replaceAll('round50Ready', 'round51Ready')
    .replaceAll('round50Export', 'round51Export')
    .replaceAll('Round-51 twin round-50', 'Round-52 twin round-51')
    .replaceAll('O10-233 ladder', 'O10-235 ladder')
    .replaceAll("o10TaskId: 'O10-231'", "o10TaskId: 'O10-233'")
    .replaceAll('waveRound: 50', 'waveRound: 51')
    .replaceAll('round 50 capstones', 'round 51 capstones')
    .replaceAll('gov_prog_r50_cap_cmp', 'gov_prog_r51_cap_cmp')
    .replaceAll('gov_program_wave_round50_capstone_compare', 'gov_program_wave_round51_capstone_compare');
  fs.writeFileSync(
    path.join(src, 'automation-idle-governance-program-wave-round51-capstone-compare.ts'),
    c,
  );
}

function writeRound52Export() {
  let c = fs.readFileSync(
    path.join(src, 'automation-idle-governance-program-wave-round51-export.ts'),
    'utf8',
  );
  c = c
    .replaceAll('WaveRound51', 'WaveRound52')
    .replaceAll('wave-round51-export', 'wave-round52-export')
    .replaceAll('Round51', 'Round52')
    .replaceAll('round51', 'round52')
    .replaceAll('Round50Capstone', 'Round51Capstone')
    .replaceAll('round50Capstone', 'round51Capstone')
    .replaceAll('WAVE51', 'WAVE52')
    .replaceAll('O10-233', 'O10-235')
    .replaceAll('a32b2b15', 'ba97bdce')
    .replaceAll('2_887_600', '2_932_752')
    .replaceAll('Round-51 / wave-51', 'Round-52 / wave-52')
    .replaceAll('wave 51 export', 'wave 52 export')
    .replaceAll('gov_prog_r51', 'gov_prog_r52');
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round52-export.ts'), c);
}

function writeRound52Capstone() {
  let c = fs.readFileSync(
    path.join(src, 'automation-idle-governance-program-wave-round51-capstone.ts'),
    'utf8',
  );
  c = c
    .replaceAll('WaveRound51', 'WaveRound52')
    .replaceAll('wave-round51-', 'wave-round52-')
    .replaceAll('Round51', 'Round52')
    .replaceAll('round51', 'round52')
    .replaceAll('Round50Capstone', 'Round51Capstone')
    .replaceAll('round50Capstone', 'round51Capstone')
    .replaceAll('runIdleGovernanceProgramWaveRound50Capstone', 'runIdleGovernanceProgramWaveRound51Capstone')
    .replaceAll(
      'compareIdleGovernanceProgramWaveRound50Capstones',
      'compareIdleGovernanceProgramWaveRound51Capstones',
    )
    .replaceAll(
      './automation-idle-governance-program-wave-round50-capstone-compare.js',
      './automation-idle-governance-program-wave-round51-capstone-compare.js',
    )
    .replaceAll(
      './automation-idle-governance-program-wave-round50-capstone.js',
      './automation-idle-governance-program-wave-round51-capstone.js',
    )
    .replaceAll('exportIdleGovernanceProgramWaveRound51', 'exportIdleGovernanceProgramWaveRound52')
    .replaceAll('registryFromRound51Primary', 'registryFromRound52Primary')
    .replaceAll('runIdleGovernanceProgramWaveRound51Capstone', 'runIdleGovernanceProgramWaveRound52Capstone')
    .replaceAll('O10IdleGovernanceProgramWaveRound51CapstoneResult', 'O10IdleGovernanceProgramWaveRound52CapstoneResult')
    .replaceAll('primaryRound49Capstone', 'primaryRound50Capstone')
    .replaceAll('twinRound49Capstone', 'twinRound50Capstone')
    .replaceAll('O10-233', 'O10-235')
    .replaceAll('a32b2b15', 'ba97bdce')
    .replaceAll('2_887_600', '2_932_752')
    .replaceAll('waveRound = 51', 'waveRound = 52')
    .replaceAll('waveRound === 51', 'waveRound === 52')
    .replaceAll('Round 51 capstone', 'Round 52 capstone')
    .replaceAll('round 51 capstone', 'round 52 capstone')
    .replaceAll('cap51', 'cap52')
    .replaceAll('gov_prog_r51', 'gov_prog_r52');
  fs.writeFileSync(path.join(src, 'automation-idle-governance-program-wave-round52-capstone.ts'), c);
}

writeRound51Compare();
writeRound52Export();
writeRound52Capstone();
console.log('gen-wave-round52 ok');
