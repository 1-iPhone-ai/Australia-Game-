#!/usr/bin/env node
/**
 * Bundle agent-04-modes-scenarios src/ into operation-10m/modules/agent-04-modes-scenarios/chunk.tsx
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');
const MODULE_ID = 'agent-04-modes-scenarios';

const SOURCE_FILES = [
  'operation-10m/agent-04-modes-scenarios/src/types.ts',
  'operation-10m/agent-04-modes-scenarios/src/canonical-modes.ts',
  'operation-10m/agent-04-modes-scenarios/src/objective-evaluator.ts',
  'operation-10m/agent-04-modes-scenarios/src/scenarios/o10m-presets.ts',
  'operation-10m/agent-04-modes-scenarios/src/challenge-modes.ts',
  'operation-10m/agent-04-modes-scenarios/src/mission-milestones.ts',
  'operation-10m/agent-04-modes-scenarios/src/alt-victory.ts',
  'operation-10m/agent-04-modes-scenarios/src/catalog.ts',
  'operation-10m/agent-04-modes-scenarios/src/scenario-chains.ts',
  'operation-10m/agent-04-modes-scenarios/src/sandbox-knobs.ts',
  'operation-10m/agent-04-modes-scenarios/src/mode-interactions.ts',
  'operation-10m/agent-04-modes-scenarios/src/mode-mission-registry.ts',
  'operation-10m/agent-04-modes-scenarios/src/scenario-content-audit.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-lifecycle.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-objective-sync.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-campaign.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-marathon.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-gauntlet.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-relay.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-circuit.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-expedition.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-odyssey.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-pilgrimage.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-caravan.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-voyage.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-siege.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-convoy.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-escort.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-extraction.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-subject.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-witness.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-tribunal.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-indictment.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-appeal.ts',
  'operation-10m/agent-04-modes-scenarios/src/save-format-clemency.ts',
  'operation-10m/agent-04-modes-scenarios/src/scenario-campaign-planner.ts',
];

function stripModuleImports(src) {
  const out = [];
  let skip = false;
  for (const line of src.split('\n')) {
    const st = line.trim();
    if (st.startsWith('export *')) continue;
    if (st.startsWith('import ') || st.startsWith('import type')) {
      skip = !st.includes(' from ') || !st.endsWith(';');
      continue;
    }
    if (skip) {
      if (line.includes(';')) skip = false;
      continue;
    }
    if (/ from ['"]\.\//.test(line)) continue;
    out.push(line);
  }
  return out.join('\n').trim();
}

const ASSEMBLY_SELF_TESTS = `
/** Agent 25 — smoke self-tests (subset of agent-04 npm test). */
export function runAgent04ModesScenariosSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; passed: boolean; detail?: string }> = [];
  const push = (id: string, passed: boolean, detail?: string) => results.push({ id, passed, detail });

  push('agent04_chunk_01', CANONICAL_GAME_MODE_SELECTIONS.length === 6, String(CANONICAL_GAME_MODE_SELECTIONS.length));
  push('agent04_chunk_02', O10M_OPERATION_SCENARIOS.length >= 25, String(O10M_OPERATION_SCENARIOS.length));
  push('agent04_chunk_03', O10M_SCENARIO_CHAINS.length === 24, String(O10M_SCENARIO_CHAINS.length));
  push('agent04_chunk_04', O10M_SANDBOX_KNOB_PROFILES.length >= 4, String(O10M_SANDBOX_KNOB_PROFILES.length));
  push('agent04_chunk_08', O10M_CHALLENGE_MODES.length >= 5, String(O10M_CHALLENGE_MODES.length));
  const audit = runO10mContentAudit();
  push('agent04_chunk_09', audit.isClean, summarizeContentAudit(audit));

  const modeOk = resolveModeInteraction({
    baseMode: 'scenario',
    scenarioId: 'o10m_silent_diplomat',
    challengeModeIds: ['o10m_ironman'],
    scenarioModeEnabled: true,
  });
  push('agent04_chunk_05', modeOk.ok, modeOk.errors.join('; ') || undefined);

  const chainProgress = initializeChainProgress('o10m_chain_northern_corridor');
  push('agent04_chunk_06', chainProgress !== null && chainProgress.activeStepIndex === 0);

  const merged = mergePlayableScenarioCatalog([{ id: 'outback_siege' } as ScenarioDefinition]);
  push('agent04_chunk_07', merged.collisionIds.length === 0 && merged.o10mIds.length === O10M_OPERATION_SCENARIOS.length);

  const saveRoundTrip = sanitizeO10mModesPersistedState(
    attachO10mModesProgressToGameState({}, createEmptyO10mModesPersistedState()).o10mModesProgress,
  );
  push('agent04_chunk_10', saveRoundTrip !== null && saveRoundTrip.schemaVersion === O10M_MODES_SAVE_SCHEMA_VERSION);
  const sealed = sealO10mModesPersistedState(createEmptyO10mModesPersistedState());
  push('agent04_chunk_11', verifyO10mModesIntegrity(sealed));
  const plan = planNextCampaignAction(createEmptyO10mModesPersistedState());
  push('agent04_chunk_12', plan.kind === 'free_play' && plan.reason.length > 0);
  const marathon = createMarathonQueue({
    queueId: 'o10m_marathon_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_marathon_pace_setter'],
  }).queue;
  const marathonState = marathon ? attachMarathonQueueToState(createEmptyO10mModesPersistedState(), marathon) : null;
  push('agent04_chunk_13', marathonState !== null && planNextCampaignAction(marathonState!).kind === 'marathon_step');

  const gauntlet = createGauntletSession({
    gauntletId: 'o10m_gauntlet_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_gauntlet_opening_gate'],
  }).session;
  const gauntletState = gauntlet ? attachGauntletSessionToState(createEmptyO10mModesPersistedState(), gauntlet) : null;
  push('agent04_chunk_14', gauntletState !== null && planNextCampaignAction(gauntletState!).kind === 'gauntlet_step');

  const relay = createRelaySession({
    relayId: 'o10m_relay_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_relay_dust_corridor'],
  }).session;
  const relayState = relay ? attachRelaySessionToState(createEmptyO10mModesPersistedState(), relay) : null;
  push('agent04_chunk_15', relayState !== null && planNextCampaignAction(relayState!).kind === 'relay_step');

  const circuit = createCircuitSession({
    circuitId: 'o10m_circuit_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_circuit_warmup_laps'],
  }).session;
  const circuitState = circuit ? attachCircuitSessionToState(createEmptyO10mModesPersistedState(), circuit) : null;
  push('agent04_chunk_16', circuitState !== null && planNextCampaignAction(circuitState!).kind === 'circuit_step');

  const expedition = createExpeditionSession({
    expeditionId: 'o10m_expedition_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_expedition_departure_dock'],
  }).session;
  const expeditionState = expedition ? attachExpeditionSessionToState(createEmptyO10mModesPersistedState(), expedition) : null;
  push('agent04_chunk_17', expeditionState !== null && planNextCampaignAction(expeditionState!).kind === 'expedition_step');

  const odyssey = createOdysseySession({
    odysseyId: 'o10m_odyssey_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_odyssey_opening_winds'],
  }).session;
  const odysseyState = odyssey ? attachOdysseySessionToState(createEmptyO10mModesPersistedState(), odyssey) : null;
  push('agent04_chunk_18', odysseyState !== null && planNextCampaignAction(odysseyState!).kind === 'odyssey_step');

  const pilgrimage = createPilgrimageSession({
    pilgrimageId: 'o10m_pilgrimage_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_pilgrimage_setting_out'],
  }).session;
  const pilgrimageState = pilgrimage ? attachPilgrimageSessionToState(createEmptyO10mModesPersistedState(), pilgrimage) : null;
  push('agent04_chunk_19', pilgrimageState !== null && planNextCampaignAction(pilgrimageState!).kind === 'pilgrimage_step');

  const caravan = createCaravanSession({
    caravanId: 'o10m_caravan_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_caravan_assembly_yard'],
  }).session;
  const caravanState = caravan ? attachCaravanSessionToState(createEmptyO10mModesPersistedState(), caravan) : null;
  push('agent04_chunk_20', caravanState !== null && planNextCampaignAction(caravanState!).kind === 'caravan_step');

  const voyage = createVoyageSession({
    voyageId: 'o10m_voyage_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_voyage_embark_pier'],
  }).session;
  const voyageState = voyage ? attachVoyageSessionToState(createEmptyO10mModesPersistedState(), voyage) : null;
  push('agent04_chunk_21', voyageState !== null && planNextCampaignAction(voyageState!).kind === 'voyage_step');

  const siege = createSiegeSession({
    siegeId: 'o10m_siege_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_siege_mustering_yard'],
  }).session;
  const siegeState = siege ? attachSiegeSessionToState(createEmptyO10mModesPersistedState(), siege) : null;
  push('agent04_chunk_22', siegeState !== null && planNextCampaignAction(siegeState!).kind === 'siege_step');

  const convoy = createConvoySession({
    convoyId: 'o10m_convoy_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_convoy_staging_depot'],
  }).session;
  const convoyState = convoy ? attachConvoySessionToState(createEmptyO10mModesPersistedState(), convoy) : null;
  push('agent04_chunk_23', convoyState !== null && planNextCampaignAction(convoyState!).kind === 'convoy_step');

  const escort = createEscortSession({
    escortId: 'o10m_escort_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_escort_briefing_yard'],
  }).session;
  const escortState = escort ? attachEscortSessionToState(createEmptyO10mModesPersistedState(), escort) : null;
  push('agent04_chunk_24', escortState !== null && planNextCampaignAction(escortState!).kind === 'escort_step');

  const extraction = createExtractionSession({
    extractionId: 'o10m_extraction_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_extraction_intel_brief'],
  }).session;
  const extractionState = extraction ? attachExtractionSessionToState(createEmptyO10mModesPersistedState(), extraction) : null;
  push('agent04_chunk_25', extractionState !== null && planNextCampaignAction(extractionState!).kind === 'extraction_step');

  const subject = createSubjectSession({
    subjectId: 'o10m_subject_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_subject_intake_brief'],
  }).session;
  const subjectState = subject ? attachSubjectSessionToState(createEmptyO10mModesPersistedState(), subject) : null;
  push('agent04_chunk_26', subjectState !== null && planNextCampaignAction(subjectState!).kind === 'subject_step');

  const witness = createWitnessSession({
    witnessId: 'o10m_witness_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_witness_brief_room'],
  }).session;
  const witnessState = witness ? attachWitnessSessionToState(createEmptyO10mModesPersistedState(), witness) : null;
  push('agent04_chunk_27', witnessState !== null && planNextCampaignAction(witnessState!).kind === 'witness_step');

  const tribunal = createTribunalSession({
    tribunalId: 'o10m_tribunal_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_tribunal_docket_brief'],
  }).session;
  const tribunalState = tribunal ? attachTribunalSessionToState(createEmptyO10mModesPersistedState(), tribunal) : null;
  push('agent04_chunk_28', tribunalState !== null && planNextCampaignAction(tribunalState!).kind === 'tribunal_step');

  const indictment = createIndictmentSession({
    indictmentId: 'o10m_indictment_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_indictment_charge_docket'],
  }).session;
  const indictmentState = indictment ? attachIndictmentSessionToState(createEmptyO10mModesPersistedState(), indictment) : null;
  push('agent04_chunk_29', indictmentState !== null && planNextCampaignAction(indictmentState!).kind === 'indictment_step');

  const appeal = createAppealSession({
    appealId: 'o10m_appeal_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_appeal_petition_filing'],
  }).session;
  const appealState = appeal ? attachAppealSessionToState(createEmptyO10mModesPersistedState(), appeal) : null;
  push('agent04_chunk_30', appealState !== null && planNextCampaignAction(appealState!).kind === 'appeal_step');

  const clemency = createClemencySession({
    clemencyId: 'o10m_clemency_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_clemency_plea_docket'],
  }).session;
  const clemencyState = clemency ? attachClemencySessionToState(createEmptyO10mModesPersistedState(), clemency) : null;
  push('agent04_chunk_31', clemencyState !== null && planNextCampaignAction(clemencyState!).kind === 'clemency_step');

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

export const OP10M_AGENT04_MODULE_META = {
  moduleId: '${MODULE_ID}',
  schemaVersion: 'op10m-agent04-v24',
  touchesSaveFormat: true,
  saveGameStateKey: 'o10mModesProgress',
  saveSchemaVersion: 23,
  integrationDoc: 'operation-10m/agent-04-modes-scenarios/INTEGRATION.md',
  slot: 'scenario-engine-extension',
} as const;
`.trim();

const bundled = SOURCE_FILES.map(rel => {
  const abs = resolve(repoRoot, rel);
  const label = rel.replace('operation-10m/agent-04-modes-scenarios/', '');
  return `// --- bundled from ${label} ---\n${stripModuleImports(readFileSync(abs, 'utf8'))}`;
}).join('\n\n');

const header = `// OP10M_MODULE_BEGIN ${MODULE_ID}
// Operation 10M — Agent 04 modes / missions / scenarios (bundled for Agent 25 assembly).
// Source tree: operation-10m/agent-04-modes-scenarios/src/ — regenerate via npm run bundle:agent-04-chunk
`;

const footer = `
${ASSEMBLY_SELF_TESTS}
// OP10M_MODULE_END ${MODULE_ID}
`;

const chunk = header + bundled + '\n\n' + footer;
const outDir = resolve(repoRoot, 'operation-10m/modules/agent-04-modes-scenarios');
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, 'chunk.tsx');
writeFileSync(outPath, chunk);

const begin = `// OP10M_MODULE_BEGIN ${MODULE_ID}`;
const end = `// OP10M_MODULE_END ${MODULE_ID}`;
const bi = chunk.indexOf(begin);
const ei = chunk.indexOf(end);
const body = chunk.slice(bi + begin.length, ei).trim();
const hash = createHash('sha256').update(body, 'utf8').digest('hex');

const manifest = {
  moduleId: MODULE_ID,
  slot: 'scenario-engine-extension',
  touchesSaveFormat: true,
  proposedGameStateFields: ['o10mModesProgress'],
  saveFormat: {
    schemaVersion: 23,
    gameStateKey: 'o10mModesProgress',
    nestedFields: ['chainProgress', 'milestones', 'challengeModeIds', 'sandboxProfileId', 'recentRuns', 'integrityFingerprint', 'saveKind', 'objectiveProgress', 'campaignSlots', 'challengeStreak', 'marathonQueue', 'replayLedger', 'gauntletSession', 'catalogUnlockTokens', 'relaySession', 'circuitSession', 'expeditionSession', 'odysseySession', 'pilgrimageSession', 'caravanSession', 'voyageSession', 'siegeSession', 'convoySession', 'escortSession', 'extractionSession', 'subjectSession', 'witnessSession', 'tribunalSession', 'indictmentSession', 'appealSession', 'clemencySession'],
  },
  contentSha256: hash,
  chunkPath: 'operation-10m/modules/agent-04-modes-scenarios/chunk.tsx',
  regenerate: 'cd operation-10m/agent-04-modes-scenarios && npm run bundle:agent-04-chunk',
};

writeFileSync(resolve(outDir, 'module.manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${outPath} (${chunk.split('\n').length} lines, sha256=${hash})`);
