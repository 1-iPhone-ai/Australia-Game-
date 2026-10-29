import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_SCENARIO_CHAINS,
  attachCircuitSessionToState,
  attachExpeditionSessionToState,
  attachOdysseySessionToState,
  attachPilgrimageSessionToState,
  attachCaravanSessionToState,
  attachVoyageSessionToState,
  attachSiegeSessionToState,
  attachConvoySessionToState,
  attachEscortSessionToState,
  attachExtractionSessionToState,
  attachSubjectSessionToState,
  attachWitnessSessionToState,
  attachTribunalSessionToState,
  attachIndictmentSessionToState,
  attachAppealSessionToState,
  attachClemencySessionToState,
  attachPardonSessionToState,
  attachAmnestySessionToState,
  attachReprieveSessionToState,
  attachParoleSessionToState,
  attachProbationSessionToState,
  attachCommutationSessionToState,
  attachAcquittalSessionToState,
  attachExonerationSessionToState,
  attachExpungementSessionToState,
  attachVacaturSessionToState,
  attachRemandSessionToState,
  attachReversalSessionToState,
  attachAnnulmentSessionToState,
  attachReinstatementSessionToState,
  attachSetAsideSessionToState,
  attachQuashSessionToState,
  attachGauntletSessionToState,
  attachMarathonQueueToState,
  attachRelaySessionToState,
  campaignProgressSummary,
  createEmptyO10mModesPersistedState,
  createCircuitSession,
  createExpeditionSession,
  createOdysseySession,
  createPilgrimageSession,
  createCaravanSession,
  createVoyageSession,
  createSiegeSession,
  createConvoySession,
  createEscortSession,
  createExtractionSession,
  createSubjectSession,
  createWitnessSession,
  createTribunalSession,
  createIndictmentSession,
  createAppealSession,
  createClemencySession,
  createPardonSession,
  createAmnestySession,
  createReprieveSession,
  createParoleSession,
  createProbationSession,
  createCommutationSession,
  createAcquittalSession,
  createExonerationSession,
  createExpungementSession,
  createVacaturSession,
  createRemandSession,
  createReversalSession,
  createAnnulmentSession,
  createReinstatementSession,
  createSetAsideSession,
  createQuashSession,
  createGauntletSession,
  createMarathonQueue,
  createRelaySession,
  initializeChainProgress,
  pinCampaignSlot,
  planNextCampaignAction,
  rankCampaignSlotsByRecency,
} from '../src/index.js';

describe('scenario campaign planner round 4', () => {
  it('registers continuity arc chain with rebound finale', () => {
    const chain = O10M_SCENARIO_CHAINS.find(c => c.id === 'o10m_chain_continuity_arc');
    assert.ok(chain);
    assert.equal(chain!.steps[2]?.scenarioId, 'o10m_standing_rebound');
  });

  it('plans chain step when chain progress is active', () => {
    const progress = initializeChainProgress('o10m_chain_continuity_arc');
    assert.ok(progress);
    const state = {
      ...createEmptyO10mModesPersistedState(),
      chainProgress: progress,
    };
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'chain_step');
    assert.equal(plan.scenarioId, 'o10m_continuity_drill');
    assert.equal(plan.chainId, 'o10m_chain_continuity_arc');
  });

  it('prefers active parole over reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: parole } = createParoleSession({
      paroleId: 'o10m_parole_priority',
      label: 'Priority',
      scenarioIds: ['o10m_parole_intake_docket', 'o10m_parole_review_chamber'],
    });
    const { session: reprieve } = createReprieveSession({
      reprieveId: 'o10m_reprieve_priority',
      label: 'Priority',
      scenarioIds: ['o10m_reprieve_filing_docket', 'o10m_reprieve_review_chamber'],
    });
    const { session: amnesty } = createAmnestySession({
      amnestyId: 'o10m_amnesty_priority',
      label: 'Priority',
      scenarioIds: ['o10m_amnesty_warrant_docket', 'o10m_amnesty_review_chamber'],
    });
    const { session: pardon } = createPardonSession({
      pardonId: 'o10m_pardon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pardon_brief_docket', 'o10m_pardon_review_chamber'],
    });
    const { session: clemency } = createClemencySession({
      clemencyId: 'o10m_clemency_priority',
      label: 'Priority',
      scenarioIds: ['o10m_clemency_plea_docket', 'o10m_clemency_review_chamber'],
    });
    const { session: appeal } = createAppealSession({
      appealId: 'o10m_appeal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_appeal_petition_filing', 'o10m_appeal_review_chamber'],
    });
    const { session: indictment } = createIndictmentSession({
      indictmentId: 'o10m_indictment_priority',
      label: 'Priority',
      scenarioIds: ['o10m_indictment_charge_docket', 'o10m_indictment_arraign_bench'],
    });
    const { session: tribunal } = createTribunalSession({
      tribunalId: 'o10m_tribunal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_tribunal_docket_brief', 'o10m_tribunal_hearing_chamber'],
    });
    const { session: witness } = createWitnessSession({
      witnessId: 'o10m_witness_priority',
      label: 'Priority',
      scenarioIds: ['o10m_witness_brief_room', 'o10m_witness_testimony_floor'],
    });
    const { session: subject } = createSubjectSession({
      subjectId: 'o10m_subject_priority',
      label: 'Priority',
      scenarioIds: ['o10m_subject_intake_brief', 'o10m_subject_probe_field'],
    });
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_priority',
      label: 'Priority',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_priority',
      label: 'Priority',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_priority',
      label: 'Priority',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_pressure_lane'],
    });
    const marathon = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_midfield_push'],
    }).queue;
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_priority',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 99,
    }).state;
    state = attachMarathonQueueToState(state, marathon!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    state = attachConvoySessionToState(state, convoy!);
    state = attachEscortSessionToState(state, escort!);
    state = attachExtractionSessionToState(state, extraction!);
    state = attachSubjectSessionToState(state, subject!);
    state = attachWitnessSessionToState(state, witness!);
    state = attachTribunalSessionToState(state, tribunal!);
    state = attachIndictmentSessionToState(state, indictment!);
    state = attachAppealSessionToState(state, appeal!);
    state = attachClemencySessionToState(state, clemency!);
    state = attachPardonSessionToState(state, pardon!);
    state = attachAmnestySessionToState(state, amnesty!);
    state = attachReprieveSessionToState(state, reprieve!);
    state = attachParoleSessionToState(state, parole!);
    assert.equal(planNextCampaignAction(state).kind, 'parole_step');
  });

  it('prefers active quash over set-aside, reinstatement, annulment, reversal, remand, vacatur, expungement, exoneration, acquittal, commutation, probation, parole, reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: quash } = createQuashSession({
      quashId: 'o10m_quash_priority',
      label: 'Priority',
      scenarioIds: ['o10m_quash_filing_docket', 'o10m_quash_review_chamber'],
    });
    const { session: setAside } = createSetAsideSession({
      setAsideId: 'o10m_setaside_priority',
      label: 'Priority',
      scenarioIds: ['o10m_setaside_filing_docket', 'o10m_setaside_review_chamber'],
    });
    let state = attachSetAsideSessionToState(createEmptyO10mModesPersistedState(), setAside!);
    state = attachQuashSessionToState(state, quash!);
    assert.equal(planNextCampaignAction(state).kind, 'quash_step');
  });

  it('prefers active set-aside over reinstatement, annulment, reversal, remand, vacatur, expungement, exoneration, acquittal, commutation, probation, parole, reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: setAside } = createSetAsideSession({
      setAsideId: 'o10m_setaside_priority',
      label: 'Priority',
      scenarioIds: ['o10m_setaside_filing_docket', 'o10m_setaside_review_chamber'],
    });
    const { session: reinstatement } = createReinstatementSession({
      reinstatementId: 'o10m_reinstatement_priority',
      label: 'Priority',
      scenarioIds: ['o10m_reinstatement_filing_docket', 'o10m_reinstatement_review_chamber'],
    });
    let state = attachReinstatementSessionToState(createEmptyO10mModesPersistedState(), reinstatement!);
    state = attachSetAsideSessionToState(state, setAside!);
    assert.equal(planNextCampaignAction(state).kind, 'setaside_step');
  });

  it('prefers active reinstatement over annulment, reversal, remand, vacatur, expungement, exoneration, acquittal, commutation, probation, parole, reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: reinstatement } = createReinstatementSession({
      reinstatementId: 'o10m_reinstatement_priority',
      label: 'Priority',
      scenarioIds: ['o10m_reinstatement_filing_docket', 'o10m_reinstatement_review_chamber'],
    });
    const { session: annulment } = createAnnulmentSession({
      annulmentId: 'o10m_annulment_priority',
      label: 'Priority',
      scenarioIds: ['o10m_annulment_filing_docket', 'o10m_annulment_review_chamber'],
    });
    let state = attachAnnulmentSessionToState(createEmptyO10mModesPersistedState(), annulment!);
    state = attachReinstatementSessionToState(state, reinstatement!);
    assert.equal(planNextCampaignAction(state).kind, 'reinstatement_step');
  });

  it('prefers active annulment over reversal, remand, vacatur, expungement, exoneration, acquittal, commutation, probation, parole, reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: annulment } = createAnnulmentSession({
      annulmentId: 'o10m_annulment_priority',
      label: 'Priority',
      scenarioIds: ['o10m_annulment_filing_docket', 'o10m_annulment_review_chamber'],
    });
    const { session: reversal } = createReversalSession({
      reversalId: 'o10m_reversal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_reversal_motion_docket', 'o10m_reversal_review_chamber'],
    });
    let state = attachReversalSessionToState(createEmptyO10mModesPersistedState(), reversal!);
    state = attachAnnulmentSessionToState(state, annulment!);
    assert.equal(planNextCampaignAction(state).kind, 'annulment_step');
  });

  it('prefers active reversal over remand, vacatur, expungement, exoneration, acquittal, commutation, probation, parole, reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: reversal } = createReversalSession({
      reversalId: 'o10m_reversal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_reversal_motion_docket', 'o10m_reversal_review_chamber'],
    });
    const { session: remand } = createRemandSession({
      remandId: 'o10m_remand_priority',
      label: 'Priority',
      scenarioIds: ['o10m_remand_order_docket', 'o10m_remand_review_chamber'],
    });
    let state = attachRemandSessionToState(createEmptyO10mModesPersistedState(), remand!);
    state = attachReversalSessionToState(state, reversal!);
    assert.equal(planNextCampaignAction(state).kind, 'reversal_step');
  });

  it('prefers active remand over vacatur, expungement, exoneration, acquittal, commutation, probation, parole, reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: remand } = createRemandSession({
      remandId: 'o10m_remand_priority',
      label: 'Priority',
      scenarioIds: ['o10m_remand_order_docket', 'o10m_remand_review_chamber'],
    });
    const { session: vacatur } = createVacaturSession({
      vacaturId: 'o10m_vacatur_priority',
      label: 'Priority',
      scenarioIds: ['o10m_vacatur_petition_docket', 'o10m_vacatur_review_chamber'],
    });
    let state = attachVacaturSessionToState(createEmptyO10mModesPersistedState(), vacatur!);
    state = attachRemandSessionToState(state, remand!);
    assert.equal(planNextCampaignAction(state).kind, 'remand_step');
  });

  it('prefers active vacatur over expungement, exoneration, acquittal, commutation, probation, parole, reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: vacatur } = createVacaturSession({
      vacaturId: 'o10m_vacatur_priority',
      label: 'Priority',
      scenarioIds: ['o10m_vacatur_petition_docket', 'o10m_vacatur_review_chamber'],
    });
    const { session: expungement } = createExpungementSession({
      expungementId: 'o10m_expungement_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expungement_filing_docket', 'o10m_expungement_review_chamber'],
    });
    let state = attachExpungementSessionToState(createEmptyO10mModesPersistedState(), expungement!);
    state = attachVacaturSessionToState(state, vacatur!);
    assert.equal(planNextCampaignAction(state).kind, 'vacatur_step');
  });

  it('prefers active expungement over exoneration, acquittal, commutation, probation, parole, reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: expungement } = createExpungementSession({
      expungementId: 'o10m_expungement_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expungement_filing_docket', 'o10m_expungement_review_chamber'],
    });
    const { session: exoneration } = createExonerationSession({
      exonerationId: 'o10m_exoneration_priority',
      label: 'Priority',
      scenarioIds: ['o10m_exoneration_claim_docket', 'o10m_exoneration_review_chamber'],
    });
    let state = attachExonerationSessionToState(createEmptyO10mModesPersistedState(), exoneration!);
    state = attachExpungementSessionToState(state, expungement!);
    assert.equal(planNextCampaignAction(state).kind, 'expungement_step');
  });

  it('prefers active exoneration over acquittal, commutation, probation, parole, reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: exoneration } = createExonerationSession({
      exonerationId: 'o10m_exoneration_priority',
      label: 'Priority',
      scenarioIds: ['o10m_exoneration_claim_docket', 'o10m_exoneration_review_chamber'],
    });
    const { session: acquittal } = createAcquittalSession({
      acquittalId: 'o10m_acquittal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_acquittal_brief_docket', 'o10m_acquittal_review_chamber'],
    });
    let state = attachAcquittalSessionToState(createEmptyO10mModesPersistedState(), acquittal!);
    state = attachExonerationSessionToState(state, exoneration!);
    assert.equal(planNextCampaignAction(state).kind, 'exoneration_step');
  });

  it('prefers active acquittal over commutation, probation, parole, reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: acquittal } = createAcquittalSession({
      acquittalId: 'o10m_acquittal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_acquittal_brief_docket', 'o10m_acquittal_review_chamber'],
    });
    const { session: commutation } = createCommutationSession({
      commutationId: 'o10m_commutation_priority',
      label: 'Priority',
      scenarioIds: ['o10m_commutation_petition_docket', 'o10m_commutation_review_chamber'],
    });
    let state = attachCommutationSessionToState(createEmptyO10mModesPersistedState(), commutation!);
    state = attachAcquittalSessionToState(state, acquittal!);
    assert.equal(planNextCampaignAction(state).kind, 'acquittal_step');
  });

  it('prefers active commutation over probation, parole, reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: commutation } = createCommutationSession({
      commutationId: 'o10m_commutation_priority',
      label: 'Priority',
      scenarioIds: ['o10m_commutation_petition_docket', 'o10m_commutation_review_chamber'],
    });
    const { session: probation } = createProbationSession({
      probationId: 'o10m_probation_priority',
      label: 'Priority',
      scenarioIds: ['o10m_probation_enrollment_docket', 'o10m_probation_review_chamber'],
    });
    const { session: parole } = createParoleSession({
      paroleId: 'o10m_parole_priority',
      label: 'Priority',
      scenarioIds: ['o10m_parole_intake_docket', 'o10m_parole_review_chamber'],
    });
    let state = attachParoleSessionToState(createEmptyO10mModesPersistedState(), parole!);
    state = attachProbationSessionToState(state, probation!);
    state = attachCommutationSessionToState(state, commutation!);
    assert.equal(planNextCampaignAction(state).kind, 'commutation_step');
  });

  it('prefers active probation over parole, reprieve, amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: probation } = createProbationSession({
      probationId: 'o10m_probation_priority',
      label: 'Priority',
      scenarioIds: ['o10m_probation_enrollment_docket', 'o10m_probation_review_chamber'],
    });
    const { session: parole } = createParoleSession({
      paroleId: 'o10m_parole_priority',
      label: 'Priority',
      scenarioIds: ['o10m_parole_intake_docket', 'o10m_parole_review_chamber'],
    });
    const { session: reprieve } = createReprieveSession({
      reprieveId: 'o10m_reprieve_priority',
      label: 'Priority',
      scenarioIds: ['o10m_reprieve_filing_docket', 'o10m_reprieve_review_chamber'],
    });
    const { session: amnesty } = createAmnestySession({
      amnestyId: 'o10m_amnesty_priority',
      label: 'Priority',
      scenarioIds: ['o10m_amnesty_warrant_docket', 'o10m_amnesty_review_chamber'],
    });
    const { session: pardon } = createPardonSession({
      pardonId: 'o10m_pardon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pardon_brief_docket', 'o10m_pardon_review_chamber'],
    });
    const { session: clemency } = createClemencySession({
      clemencyId: 'o10m_clemency_priority',
      label: 'Priority',
      scenarioIds: ['o10m_clemency_plea_docket', 'o10m_clemency_review_chamber'],
    });
    const { session: appeal } = createAppealSession({
      appealId: 'o10m_appeal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_appeal_petition_filing', 'o10m_appeal_review_chamber'],
    });
    const { session: indictment } = createIndictmentSession({
      indictmentId: 'o10m_indictment_priority',
      label: 'Priority',
      scenarioIds: ['o10m_indictment_charge_docket', 'o10m_indictment_arraign_bench'],
    });
    const { session: tribunal } = createTribunalSession({
      tribunalId: 'o10m_tribunal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_tribunal_docket_brief', 'o10m_tribunal_hearing_chamber'],
    });
    const { session: witness } = createWitnessSession({
      witnessId: 'o10m_witness_priority',
      label: 'Priority',
      scenarioIds: ['o10m_witness_brief_room', 'o10m_witness_testimony_floor'],
    });
    const { session: subject } = createSubjectSession({
      subjectId: 'o10m_subject_priority',
      label: 'Priority',
      scenarioIds: ['o10m_subject_intake_brief', 'o10m_subject_probe_field'],
    });
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_priority',
      label: 'Priority',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_priority',
      label: 'Priority',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_priority',
      label: 'Priority',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_pressure_lane'],
    });
    const marathon = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_midfield_push'],
    }).queue;
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_priority',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 99,
    }).state;
    state = attachMarathonQueueToState(state, marathon!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    state = attachConvoySessionToState(state, convoy!);
    state = attachEscortSessionToState(state, escort!);
    state = attachExtractionSessionToState(state, extraction!);
    state = attachSubjectSessionToState(state, subject!);
    state = attachWitnessSessionToState(state, witness!);
    state = attachTribunalSessionToState(state, tribunal!);
    state = attachIndictmentSessionToState(state, indictment!);
    state = attachAppealSessionToState(state, appeal!);
    state = attachClemencySessionToState(state, clemency!);
    state = attachPardonSessionToState(state, pardon!);
    state = attachAmnestySessionToState(state, amnesty!);
    state = attachReprieveSessionToState(state, reprieve!);
    state = attachParoleSessionToState(state, parole!);
    state = attachProbationSessionToState(state, probation!);
    assert.equal(planNextCampaignAction(state).kind, 'probation_step');
  });

  it('prefers active reprieve over amnesty, pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: reprieve } = createReprieveSession({
      reprieveId: 'o10m_reprieve_priority',
      label: 'Priority',
      scenarioIds: ['o10m_reprieve_filing_docket', 'o10m_reprieve_review_chamber'],
    });
    const { session: amnesty } = createAmnestySession({
      amnestyId: 'o10m_amnesty_priority',
      label: 'Priority',
      scenarioIds: ['o10m_amnesty_warrant_docket', 'o10m_amnesty_review_chamber'],
    });
    const { session: pardon } = createPardonSession({
      pardonId: 'o10m_pardon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pardon_brief_docket', 'o10m_pardon_review_chamber'],
    });
    const { session: clemency } = createClemencySession({
      clemencyId: 'o10m_clemency_priority',
      label: 'Priority',
      scenarioIds: ['o10m_clemency_plea_docket', 'o10m_clemency_review_chamber'],
    });
    const { session: appeal } = createAppealSession({
      appealId: 'o10m_appeal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_appeal_petition_filing', 'o10m_appeal_review_chamber'],
    });
    const { session: indictment } = createIndictmentSession({
      indictmentId: 'o10m_indictment_priority',
      label: 'Priority',
      scenarioIds: ['o10m_indictment_charge_docket', 'o10m_indictment_arraign_bench'],
    });
    const { session: tribunal } = createTribunalSession({
      tribunalId: 'o10m_tribunal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_tribunal_docket_brief', 'o10m_tribunal_hearing_chamber'],
    });
    const { session: witness } = createWitnessSession({
      witnessId: 'o10m_witness_priority',
      label: 'Priority',
      scenarioIds: ['o10m_witness_brief_room', 'o10m_witness_testimony_floor'],
    });
    const { session: subject } = createSubjectSession({
      subjectId: 'o10m_subject_priority',
      label: 'Priority',
      scenarioIds: ['o10m_subject_intake_brief', 'o10m_subject_probe_field'],
    });
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_priority',
      label: 'Priority',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_priority',
      label: 'Priority',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_priority',
      label: 'Priority',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_pressure_lane'],
    });
    const marathon = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_midfield_push'],
    }).queue;
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_priority',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 99,
    }).state;
    state = attachMarathonQueueToState(state, marathon!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    state = attachConvoySessionToState(state, convoy!);
    state = attachEscortSessionToState(state, escort!);
    state = attachExtractionSessionToState(state, extraction!);
    state = attachSubjectSessionToState(state, subject!);
    state = attachWitnessSessionToState(state, witness!);
    state = attachTribunalSessionToState(state, tribunal!);
    state = attachIndictmentSessionToState(state, indictment!);
    state = attachAppealSessionToState(state, appeal!);
    state = attachClemencySessionToState(state, clemency!);
    state = attachPardonSessionToState(state, pardon!);
    state = attachAmnestySessionToState(state, amnesty!);
    state = attachReprieveSessionToState(state, reprieve!);
    assert.equal(planNextCampaignAction(state).kind, 'reprieve_step');
  });

  it('prefers active amnesty over pardon, clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: amnesty } = createAmnestySession({
      amnestyId: 'o10m_amnesty_priority',
      label: 'Priority',
      scenarioIds: ['o10m_amnesty_warrant_docket', 'o10m_amnesty_review_chamber'],
    });
    const { session: pardon } = createPardonSession({
      pardonId: 'o10m_pardon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pardon_brief_docket', 'o10m_pardon_review_chamber'],
    });
    const { session: clemency } = createClemencySession({
      clemencyId: 'o10m_clemency_priority',
      label: 'Priority',
      scenarioIds: ['o10m_clemency_plea_docket', 'o10m_clemency_review_chamber'],
    });
    const { session: appeal } = createAppealSession({
      appealId: 'o10m_appeal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_appeal_petition_filing', 'o10m_appeal_review_chamber'],
    });
    const { session: indictment } = createIndictmentSession({
      indictmentId: 'o10m_indictment_priority',
      label: 'Priority',
      scenarioIds: ['o10m_indictment_charge_docket', 'o10m_indictment_arraign_bench'],
    });
    const { session: tribunal } = createTribunalSession({
      tribunalId: 'o10m_tribunal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_tribunal_docket_brief', 'o10m_tribunal_hearing_chamber'],
    });
    const { session: witness } = createWitnessSession({
      witnessId: 'o10m_witness_priority',
      label: 'Priority',
      scenarioIds: ['o10m_witness_brief_room', 'o10m_witness_testimony_floor'],
    });
    const { session: subject } = createSubjectSession({
      subjectId: 'o10m_subject_priority',
      label: 'Priority',
      scenarioIds: ['o10m_subject_intake_brief', 'o10m_subject_probe_field'],
    });
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_priority',
      label: 'Priority',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_priority',
      label: 'Priority',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_priority',
      label: 'Priority',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_pressure_lane'],
    });
    const marathon = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_midfield_push'],
    }).queue;
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_priority',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 99,
    }).state;
    state = attachMarathonQueueToState(state, marathon!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    state = attachConvoySessionToState(state, convoy!);
    state = attachEscortSessionToState(state, escort!);
    state = attachExtractionSessionToState(state, extraction!);
    state = attachSubjectSessionToState(state, subject!);
    state = attachWitnessSessionToState(state, witness!);
    state = attachTribunalSessionToState(state, tribunal!);
    state = attachIndictmentSessionToState(state, indictment!);
    state = attachAppealSessionToState(state, appeal!);
    state = attachClemencySessionToState(state, clemency!);
    state = attachPardonSessionToState(state, pardon!);
    state = attachAmnestySessionToState(state, amnesty!);
    assert.equal(planNextCampaignAction(state).kind, 'amnesty_step');
  });

  it('prefers active pardon over clemency, appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: pardon } = createPardonSession({
      pardonId: 'o10m_pardon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pardon_brief_docket', 'o10m_pardon_review_chamber'],
    });
    const { session: clemency } = createClemencySession({
      clemencyId: 'o10m_clemency_priority',
      label: 'Priority',
      scenarioIds: ['o10m_clemency_plea_docket', 'o10m_clemency_review_chamber'],
    });
    const { session: appeal } = createAppealSession({
      appealId: 'o10m_appeal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_appeal_petition_filing', 'o10m_appeal_review_chamber'],
    });
    const { session: indictment } = createIndictmentSession({
      indictmentId: 'o10m_indictment_priority',
      label: 'Priority',
      scenarioIds: ['o10m_indictment_charge_docket', 'o10m_indictment_arraign_bench'],
    });
    const { session: tribunal } = createTribunalSession({
      tribunalId: 'o10m_tribunal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_tribunal_docket_brief', 'o10m_tribunal_hearing_chamber'],
    });
    const { session: witness } = createWitnessSession({
      witnessId: 'o10m_witness_priority',
      label: 'Priority',
      scenarioIds: ['o10m_witness_brief_room', 'o10m_witness_testimony_floor'],
    });
    const { session: subject } = createSubjectSession({
      subjectId: 'o10m_subject_priority',
      label: 'Priority',
      scenarioIds: ['o10m_subject_intake_brief', 'o10m_subject_probe_field'],
    });
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_priority',
      label: 'Priority',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_priority',
      label: 'Priority',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_priority',
      label: 'Priority',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_pressure_lane'],
    });
    const marathon = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_midfield_push'],
    }).queue;
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_priority',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 99,
    }).state;
    state = attachMarathonQueueToState(state, marathon!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    state = attachConvoySessionToState(state, convoy!);
    state = attachEscortSessionToState(state, escort!);
    state = attachExtractionSessionToState(state, extraction!);
    state = attachSubjectSessionToState(state, subject!);
    state = attachWitnessSessionToState(state, witness!);
    state = attachTribunalSessionToState(state, tribunal!);
    state = attachIndictmentSessionToState(state, indictment!);
    state = attachAppealSessionToState(state, appeal!);
    state = attachClemencySessionToState(state, clemency!);
    state = attachPardonSessionToState(state, pardon!);
    assert.equal(planNextCampaignAction(state).kind, 'pardon_step');
  });

  it('prefers active clemency over appeal, indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: clemency } = createClemencySession({
      clemencyId: 'o10m_clemency_priority',
      label: 'Priority',
      scenarioIds: ['o10m_clemency_plea_docket', 'o10m_clemency_review_chamber'],
    });
    const { session: appeal } = createAppealSession({
      appealId: 'o10m_appeal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_appeal_petition_filing', 'o10m_appeal_review_chamber'],
    });
    const { session: indictment } = createIndictmentSession({
      indictmentId: 'o10m_indictment_priority',
      label: 'Priority',
      scenarioIds: ['o10m_indictment_charge_docket', 'o10m_indictment_arraign_bench'],
    });
    const { session: tribunal } = createTribunalSession({
      tribunalId: 'o10m_tribunal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_tribunal_docket_brief', 'o10m_tribunal_hearing_chamber'],
    });
    const { session: witness } = createWitnessSession({
      witnessId: 'o10m_witness_priority',
      label: 'Priority',
      scenarioIds: ['o10m_witness_brief_room', 'o10m_witness_testimony_floor'],
    });
    const { session: subject } = createSubjectSession({
      subjectId: 'o10m_subject_priority',
      label: 'Priority',
      scenarioIds: ['o10m_subject_intake_brief', 'o10m_subject_probe_field'],
    });
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_priority',
      label: 'Priority',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_priority',
      label: 'Priority',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_priority',
      label: 'Priority',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_pressure_lane'],
    });
    const marathon = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_midfield_push'],
    }).queue;
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_priority',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 99,
    }).state;
    state = attachMarathonQueueToState(state, marathon!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    state = attachConvoySessionToState(state, convoy!);
    state = attachEscortSessionToState(state, escort!);
    state = attachExtractionSessionToState(state, extraction!);
    state = attachSubjectSessionToState(state, subject!);
    state = attachWitnessSessionToState(state, witness!);
    state = attachTribunalSessionToState(state, tribunal!);
    state = attachIndictmentSessionToState(state, indictment!);
    state = attachAppealSessionToState(state, appeal!);
    state = attachClemencySessionToState(state, clemency!);
    assert.equal(planNextCampaignAction(state).kind, 'clemency_step');
  });

  it('prefers active appeal over indictment, tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: appeal } = createAppealSession({
      appealId: 'o10m_appeal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_appeal_petition_filing', 'o10m_appeal_review_chamber'],
    });
    const { session: indictment } = createIndictmentSession({
      indictmentId: 'o10m_indictment_priority',
      label: 'Priority',
      scenarioIds: ['o10m_indictment_charge_docket', 'o10m_indictment_arraign_bench'],
    });
    const { session: tribunal } = createTribunalSession({
      tribunalId: 'o10m_tribunal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_tribunal_docket_brief', 'o10m_tribunal_hearing_chamber'],
    });
    const { session: witness } = createWitnessSession({
      witnessId: 'o10m_witness_priority',
      label: 'Priority',
      scenarioIds: ['o10m_witness_brief_room', 'o10m_witness_testimony_floor'],
    });
    const { session: subject } = createSubjectSession({
      subjectId: 'o10m_subject_priority',
      label: 'Priority',
      scenarioIds: ['o10m_subject_intake_brief', 'o10m_subject_probe_field'],
    });
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_priority',
      label: 'Priority',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_priority',
      label: 'Priority',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_priority',
      label: 'Priority',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_pressure_lane'],
    });
    const marathon = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_midfield_push'],
    }).queue;
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_priority',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 99,
    }).state;
    state = attachMarathonQueueToState(state, marathon!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    state = attachConvoySessionToState(state, convoy!);
    state = attachEscortSessionToState(state, escort!);
    state = attachExtractionSessionToState(state, extraction!);
    state = attachSubjectSessionToState(state, subject!);
    state = attachWitnessSessionToState(state, witness!);
    state = attachTribunalSessionToState(state, tribunal!);
    state = attachIndictmentSessionToState(state, indictment!);
    state = attachAppealSessionToState(state, appeal!);
    assert.equal(planNextCampaignAction(state).kind, 'appeal_step');
  });

  it('prefers active indictment over tribunal, witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: indictment } = createIndictmentSession({
      indictmentId: 'o10m_indictment_priority',
      label: 'Priority',
      scenarioIds: ['o10m_indictment_charge_docket', 'o10m_indictment_arraign_bench'],
    });
    const { session: tribunal } = createTribunalSession({
      tribunalId: 'o10m_tribunal_priority',
      label: 'Priority',
      scenarioIds: ['o10m_tribunal_docket_brief', 'o10m_tribunal_hearing_chamber'],
    });
    const { session: witness } = createWitnessSession({
      witnessId: 'o10m_witness_priority',
      label: 'Priority',
      scenarioIds: ['o10m_witness_brief_room', 'o10m_witness_testimony_floor'],
    });
    const { session: subject } = createSubjectSession({
      subjectId: 'o10m_subject_priority',
      label: 'Priority',
      scenarioIds: ['o10m_subject_intake_brief', 'o10m_subject_probe_field'],
    });
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_priority',
      label: 'Priority',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_priority',
      label: 'Priority',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_priority',
      label: 'Priority',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    state = attachConvoySessionToState(state, convoy!);
    state = attachEscortSessionToState(state, escort!);
    state = attachExtractionSessionToState(state, extraction!);
    state = attachSubjectSessionToState(state, subject!);
    state = attachWitnessSessionToState(state, witness!);
    state = attachTribunalSessionToState(state, tribunal!);
    state = attachIndictmentSessionToState(state, indictment!);
    assert.equal(planNextCampaignAction(state).kind, 'indictment_step');
  });

  it('prefers active tribunal over witness, subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: tribunal } = createTribunalSession({
      tribunalId: 'o10m_tribunal_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_tribunal_docket_brief', 'o10m_tribunal_hearing_chamber'],
    });
    const { session: witness } = createWitnessSession({
      witnessId: 'o10m_witness_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_witness_brief_room', 'o10m_witness_testimony_floor'],
    });
    const { session: subject } = createSubjectSession({
      subjectId: 'o10m_subject_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_subject_intake_brief', 'o10m_subject_probe_field'],
    });
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority_tri',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab_tri',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    state = attachConvoySessionToState(state, convoy!);
    state = attachEscortSessionToState(state, escort!);
    state = attachExtractionSessionToState(state, extraction!);
    state = attachSubjectSessionToState(state, subject!);
    state = attachWitnessSessionToState(state, witness!);
    state = attachTribunalSessionToState(state, tribunal!);
    assert.equal(planNextCampaignAction(state).kind, 'tribunal_step');
  });

  it('prefers active witness over subject, extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: witness } = createWitnessSession({
      witnessId: 'o10m_witness_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_witness_brief_room', 'o10m_witness_testimony_floor'],
    });
    const { session: subject } = createSubjectSession({
      subjectId: 'o10m_subject_priority_wit',
      label: 'Priority',
      scenarioIds: ['o10m_subject_intake_brief', 'o10m_subject_probe_field'],
    });
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_priority_only_sub',
      label: 'Priority',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab_only',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    state = attachConvoySessionToState(state, convoy!);
    state = attachEscortSessionToState(state, escort!);
    state = attachExtractionSessionToState(state, extraction!);
    state = attachSubjectSessionToState(state, subject!);
    state = attachWitnessSessionToState(state, witness!);
    assert.equal(planNextCampaignAction(state).kind, 'witness_step');
  });

  it('prefers active subject over extraction, escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: subject } = createSubjectSession({
      subjectId: 'o10m_subject_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_subject_intake_brief', 'o10m_subject_probe_field'],
    });
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_priority_only_sub',
      label: 'Priority',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab_only_ext',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    state = attachConvoySessionToState(state, convoy!);
    state = attachEscortSessionToState(state, escort!);
    state = attachExtractionSessionToState(state, extraction!);
    state = attachSubjectSessionToState(state, subject!);
    assert.equal(planNextCampaignAction(state).kind, 'subject_step');
  });

  it('prefers active extraction over escort, convoy, siege, voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_priority_only',
      label: 'Priority',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_convoy_staging_depot', 'o10m_convoy_transit_corridor'],
    });
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority_only_ext',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab_only_ext',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    state = attachConvoySessionToState(state, convoy!);
    state = attachEscortSessionToState(state, escort!);
    state = attachExtractionSessionToState(state, extraction!);
    assert.equal(planNextCampaignAction(state).kind, 'extraction_step');
  });

  it('prefers active siege over voyage, caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: siege } = createSiegeSession({
      siegeId: 'o10m_siege_priority',
      label: 'Priority',
      scenarioIds: ['o10m_siege_mustering_yard', 'o10m_siege_breach_wall'],
    });
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    state = attachSiegeSessionToState(state, siege!);
    assert.equal(planNextCampaignAction(state).kind, 'siege_step');
  });

  it('prefers active voyage over caravan, pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: voyage } = createVoyageSession({
      voyageId: 'o10m_voyage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_voyage_embark_pier', 'o10m_voyage_open_sea_passage'],
    });
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    state = attachVoyageSessionToState(state, voyage!);
    assert.equal(planNextCampaignAction(state).kind, 'voyage_step');
  });

  it('prefers active caravan over pilgrimage, odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: caravan } = createCaravanSession({
      caravanId: 'o10m_caravan_priority',
      label: 'Priority',
      scenarioIds: ['o10m_caravan_assembly_yard', 'o10m_caravan_dune_crossing'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    state = attachCaravanSessionToState(state, caravan!);
    assert.equal(planNextCampaignAction(state).kind, 'caravan_step');
  });

  it('prefers active pilgrimage over odyssey, expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_priority',
      label: 'Priority',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    assert.equal(planNextCampaignAction(state).kind, 'pilgrimage_step');
  });

  it('prefers active odyssey over expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    assert.equal(planNextCampaignAction(state).kind, 'odyssey_step');
  });

  it('prefers active expedition over circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    assert.equal(planNextCampaignAction(state).kind, 'expedition_step');
  });

  it('prefers active circuit over relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_top',
      label: 'Top',
      scenarioIds: ['o10m_gauntlet_opening_gate'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_rhythm_hold'],
    });
    let state = pinCampaignSlot(createEmptyO10mModesPersistedState(), {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    assert.equal(planNextCampaignAction(state).kind, 'circuit_step');
  });

  it('prefers active relay over gauntlet, marathon queue, and campaign slot', () => {
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_top',
      label: 'Top',
      scenarioIds: ['o10m_gauntlet_opening_gate'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_rhythm_hold'],
    });
    let state = pinCampaignSlot(createEmptyO10mModesPersistedState(), {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    assert.equal(planNextCampaignAction(state).kind, 'relay_step');
  });

  it('prefers active gauntlet over marathon queue and campaign slot when no relay', () => {
    const { session } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_top',
      label: 'Top',
      scenarioIds: ['o10m_gauntlet_opening_gate'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_rhythm_hold'],
    });
    let state = pinCampaignSlot(createEmptyO10mModesPersistedState(), {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, session!);
    assert.equal(planNextCampaignAction(state).kind, 'gauntlet_step');
  });

  it('prefers active marathon queue over campaign slot when no gauntlet', () => {
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_rhythm_hold'],
    });
    let state = pinCampaignSlot(createEmptyO10mModesPersistedState(), {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    assert.equal(planNextCampaignAction(state).kind, 'marathon_step');
  });

  it('prefers active campaign slot over chain when no marathon', () => {
    const base = {
      ...createEmptyO10mModesPersistedState(),
      chainProgress: initializeChainProgress('o10m_chain_continuity_arc'),
      scenarioId: 'o10m_slot_rotation_lab' as string | null,
    };
    const state = pinCampaignSlot(base, {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'slot_resume');
    assert.equal(plan.slotId, 'o10m_slot_lab');
  });

  it('ranks slots by pinned turn and summarizes campaign', () => {
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, { slotId: 'o10m_slot_a', scenarioId: 'o10m_slot_rotation_lab', turn: 2 }).state;
    state = pinCampaignSlot(state, { slotId: 'o10m_slot_b', scenarioId: 'o10m_continuity_drill', turn: 9 }).state;
    const order = rankCampaignSlotsByRecency(state);
    assert.deepEqual(order.slice(0, 2), ['o10m_slot_b', 'o10m_slot_a']);
    const summary = campaignProgressSummary(state);
    assert.equal(summary.nextPlan.kind, 'slot_resume');
  });
});
