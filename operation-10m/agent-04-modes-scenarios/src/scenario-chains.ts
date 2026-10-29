import type {
  O10mChainAdvanceResult,
  O10mChainCarryBonus,
  O10mChainProgress,
  O10mRunSummary,
  O10mScenarioChain,
  O10mScenarioStartOverrides,
} from './types.js';

export const O10M_SCENARIO_CHAINS: O10mScenarioChain[] = [
  {
    id: 'o10m_chain_northern_corridor',
    title: 'Northern Corridor Arc',
    description:
      'Trade sprint into cyclone defense, then a decisive rival elimination finale across Queensland and the Top End.',
    completionBadgeId: 'badge_o10m_chain_northern_corridor',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_export_clock',
        title: 'Open the Export Window',
        narrativeBridge: 'Freight contracts flood the northern ports — prove you can bank cash before the cyclone season.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          startingMoneyDelta: 750,
          forcedSettingsPatch: { o10mChainNorthernExportComplete: true },
        },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_cyclone_corridor',
        title: 'Ride the Cyclone Season',
        narrativeBridge: 'The export windfall funds disaster relief — hold stability while rivals exploit the chaos.',
        requiresPrimaryVictory: true,
        requiresOptionalCount: 1,
        carryBonusOnComplete: {
          standingDelta: { QLD: 8, NT: 5 },
          forcedSettingsPatch: { o10mChainNorthernStabilityHeld: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_rival_elimination_classic',
        title: 'Sunshine Showdown',
        narrativeBridge: 'With corridors secured, eliminate the rival before they rebound in Queensland.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          forcedSettingsPatch: { o10mChainNorthernComplete: true },
        },
      },
    ],
  },
  {
    id: 'o10m_chain_diplomatic_arc',
    title: 'Diplomatic Arc',
    description: 'Warm up on challenges, win without sabotage, then prove the coalition model in team co-pilot play.',
    completionBadgeId: 'badge_o10m_chain_diplomatic_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_grand_tour_prologue',
        title: 'Tour Discipline',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 400 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_silent_diplomat',
        title: 'Silent Mandate',
        requiresPrimaryVictory: true,
        requiresOptionalCount: 1,
        carryBonusOnComplete: {
          standingDelta: { ACT: 5, NSW: 5 },
          forcedSettingsPatch: { o10mChainDiplomaticTrust: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_team_ledger',
        title: 'Coalition Ledger',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainDiplomaticComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_resource_pressure',
    title: 'Resource Pressure Spiral',
    description: 'Battery rush liquidity, wheatbelt debt squeeze, then cyclone corridor under combined economic and stability stress.',
    completionBadgeId: 'badge_o10m_chain_resource_pressure',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_tas_battery_rush',
        title: 'Grid Sprint',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 600 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_wheatbelt_squeeze',
        title: 'Debt Squeeze',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          forcedSettingsPatch: { o10mChainDebtLessons: true, advancedLoansEnabled: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_cyclone_corridor',
        title: 'Dual Stress Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainResourcePressureComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_capital_to_coast',
    title: 'Capital to Coast',
    description: 'Markets week in the capital, island supply stress, then an export sprint on the eastern seaboard.',
    completionBadgeId: 'badge_o10m_chain_capital_to_coast',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_capital_markets_week',
        title: 'Policy Sprint',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 500 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_island_supply_line',
        title: 'Bass Strait Stress',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { standingDelta: { TAS: 10 } },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_export_clock',
        title: 'Coastal Export Push',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainCapitalToCoastComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_continuity_arc',
    title: 'Continuity Arc',
    description:
      'Validate save checkpoints, federation standing, then rebound trust after compound crises — round-4 campaign path.',
    completionBadgeId: 'badge_o10m_chain_continuity_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_continuity_drill',
        title: 'Checkpoint Discipline',
        narrativeBridge: 'Prove mid-campaign saves preserve chain and milestone state.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 350 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_federation_standing',
        title: 'Federation Mandate',
        requiresPrimaryVictory: true,
        requiresOptionalCount: 1,
        carryBonusOnComplete: {
          standingDelta: { NSW: 4, VIC: 4, SA: 4 },
          forcedSettingsPatch: { o10mChainContinuityFederationComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_standing_rebound',
        title: 'Trust Rebound',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainContinuityArcComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_marathon_sprint',
    title: 'Marathon Sprint',
    description:
      'Three-scenario gauntlet with save-safe marathon queue rotation — round-5 campaign path.',
    completionBadgeId: 'badge_o10m_chain_marathon_sprint',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_marathon_pace_setter',
        title: 'Pace Setter',
        narrativeBridge: 'Establish rhythm before the midfield hold.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 200 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_marathon_rhythm_hold',
        title: 'Rhythm Hold',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, SA: 6 },
          forcedSettingsPatch: { o10mMarathonMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_marathon_sprint_close',
        title: 'Sprint Close',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainMarathonSprintComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_iron_gauntlet',
    title: 'Iron Gauntlet',
    description:
      'Three-scenario lives-based gauntlet with ironman challenge lock-in — round-6 campaign path.',
    completionBadgeId: 'badge_o10m_chain_iron_gauntlet',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_gauntlet_opening_gate',
        title: 'Opening Gate',
        narrativeBridge: 'Prove the opening gate before the midfield press.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 250 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_gauntlet_midfield_press',
        title: 'Midfield Press',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 5, NSW: 5 },
          forcedSettingsPatch: { o10mGauntletMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_gauntlet_iron_finish',
        title: 'Iron Finish',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainIronGauntletComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_relay_convoy',
    title: 'Relay Convoy',
    description:
      'Three-scenario relay with save-safe carry accumulation between legs — round-7 campaign path.',
    completionBadgeId: 'badge_o10m_chain_relay_convoy',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_relay_dust_corridor',
        title: 'Dust Corridor',
        narrativeBridge: 'Establish convoy rhythm before the coastal handoff.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 180 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_relay_coastal_handoff',
        title: 'Coastal Handoff',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { WA: 5, SA: 5 },
          forcedSettingsPatch: { o10mRelayMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_relay_terminal_sprint',
        title: 'Terminal Sprint',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainRelayConvoyComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_summit_circuit',
    title: 'Summit Circuit',
    description:
      'Three-phase summit circuit with momentum accrual between legs — round-8 campaign path.',
    completionBadgeId: 'badge_o10m_chain_summit_circuit',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_circuit_warmup_laps',
        title: 'Warmup Laps',
        narrativeBridge: 'Build circuit rhythm before the ridge climb.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 200 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_circuit_ridge_climb',
        title: 'Ridge Climb',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, ACT: 6 },
          forcedSettingsPatch: { o10mCircuitMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_circuit_summit_push',
        title: 'Summit Push',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainSummitCircuitComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_expedition_arc',
    title: 'Expedition Arc',
    description:
      'Three-leg expedition with supply accrual between waypoints — round-9 campaign path.',
    completionBadgeId: 'badge_o10m_chain_expedition_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_expedition_departure_dock',
        title: 'Departure Dock',
        narrativeBridge: 'Stage supplies before the transit pass.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 190 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_expedition_transit_pass',
        title: 'Transit Pass',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NT: 5, QLD: 5 },
          forcedSettingsPatch: { o10mExpeditionMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_expedition_arrival_haven',
        title: 'Arrival Haven',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainExpeditionArcComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_odyssey_route',
    title: 'Odyssey Route',
    description:
      'Three-act odyssey with renown accrual between chapters — round-10 campaign path.',
    completionBadgeId: 'badge_o10m_chain_odyssey_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_odyssey_opening_winds',
        title: 'Opening Winds',
        narrativeBridge: 'Build renown rhythm before the shelf crossing.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 210 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_odyssey_crossing_shelves',
        title: 'Crossing Shelves',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { SA: 6, NT: 6 },
          forcedSettingsPatch: { o10mOdysseyMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_odyssey_homecoming_harbor',
        title: 'Homecoming Harbor',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainOdysseyRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_pilgrimage_path',
    title: 'Pilgrimage Path',
    description:
      'Three-stage pilgrimage with devotion accrual between shrines — round-11 campaign path.',
    completionBadgeId: 'badge_o10m_chain_pilgrimage_path',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_pilgrimage_setting_out',
        title: 'Setting Out',
        narrativeBridge: 'Gather devotion before the midway shrine.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 205 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_pilgrimage_midway_shrine',
        title: 'Midway Shrine',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, ACT: 5 },
          forcedSettingsPatch: { o10mPilgrimageMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_pilgrimage_sanctuary_rest',
        title: 'Sanctuary Rest',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainPilgrimagePathComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_caravan_route',
    title: 'Caravan Route',
    description:
      'Three-leg trade caravan with cargo accrual between stops — round-12 campaign path.',
    completionBadgeId: 'badge_o10m_chain_caravan_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_caravan_assembly_yard',
        title: 'Assembly Yard',
        narrativeBridge: 'Load cargo before the dune crossing.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 220 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_caravan_dune_crossing',
        title: 'Dune Crossing',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { WA: 6, NT: 5 },
          forcedSettingsPatch: { o10mCaravanMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_caravan_bazaar_finale',
        title: 'Bazaar Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainCaravanRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_voyage_arc',
    title: 'Voyage Arc',
    description:
      'Three-segment coastal voyage with chart accrual between legs — round-13 campaign path.',
    completionBadgeId: 'badge_o10m_chain_voyage_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_voyage_embark_pier',
        title: 'Embark Pier',
        narrativeBridge: 'Plot charts before the open sea passage.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 230 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_voyage_open_sea_passage',
        title: 'Open Sea Passage',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { WA: 6, SA: 5 },
          forcedSettingsPatch: { o10mVoyageMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_voyage_port_call_finale',
        title: 'Port Call Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainVoyageArcComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_siege_arc',
    title: 'Siege Arc',
    description:
      'Three-phase fortress siege with morale accrual between legs — round-14 campaign path.',
    completionBadgeId: 'badge_o10m_chain_siege_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_siege_mustering_yard',
        title: 'Mustering Yard',
        narrativeBridge: 'Rally morale before the breach wall assault.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 240 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_siege_breach_wall',
        title: 'Breach Wall',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, VIC: 5 },
          forcedSettingsPatch: { o10mSiegeMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_siege_relief_finale',
        title: 'Relief Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainSiegeArcComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_convoy_route',
    title: 'Convoy Route',
    description:
      'Three-stage overland convoy with haul accrual between legs — round-15 campaign path.',
    completionBadgeId: 'badge_o10m_chain_convoy_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_convoy_staging_depot',
        title: 'Staging Depot',
        narrativeBridge: 'Load haul before the transit corridor run.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 250 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_convoy_transit_corridor',
        title: 'Transit Corridor',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { SA: 6, NT: 5 },
          forcedSettingsPatch: { o10mConvoyMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_convoy_delivery_finale',
        title: 'Delivery Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainConvoyRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_escort_route',
    title: 'Escort Route',
    description:
      'Three-phase VIP escort with trust accrual between legs — round-16 campaign path.',
    completionBadgeId: 'badge_o10m_chain_escort_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_escort_briefing_yard',
        title: 'Briefing Yard',
        narrativeBridge: 'Earn trust before the corridor patrol run.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 260 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_escort_corridor_patrol',
        title: 'Corridor Patrol',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, ACT: 5 },
          forcedSettingsPatch: { o10mEscortMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_escort_handoff_finale',
        title: 'Handoff Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainEscortRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_extraction_route',
    title: 'Extraction Route',
    description:
      'Three-phase asset extraction with asset accrual between legs — round-17 campaign path.',
    completionBadgeId: 'badge_o10m_chain_extraction_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_extraction_intel_brief',
        title: 'Intel Brief',
        narrativeBridge: 'Secure assets before the rescue run.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 270 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_extraction_rescue_site',
        title: 'Rescue Site',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, VIC: 5 },
          forcedSettingsPatch: { o10mExtractionMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_extraction_exfil_finale',
        title: 'Exfil Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainExtractionRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_subject_route',
    title: 'Subject Route',
    description:
      'Three-phase subject investigation with fidelity accrual between legs — round-18 campaign path.',
    completionBadgeId: 'badge_o10m_chain_subject_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_subject_intake_brief',
        title: 'Intake Brief',
        narrativeBridge: 'Establish subject context before field probes.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 280 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_subject_probe_field',
        title: 'Probe Field',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 5, QLD: 6 },
          forcedSettingsPatch: { o10mSubjectMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_subject_verdict_finale',
        title: 'Verdict Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainSubjectRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_witness_route',
    title: 'Witness Route',
    description:
      'Three-phase witness arc with credibility accrual between legs — round-19 campaign path.',
    completionBadgeId: 'badge_o10m_chain_witness_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_witness_brief_room',
        title: 'Brief Room',
        narrativeBridge: 'Establish witness context before testimony.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 290 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_witness_testimony_floor',
        title: 'Testimony Floor',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, SA: 5 },
          forcedSettingsPatch: { o10mWitnessMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_witness_affirm_finale',
        title: 'Affirm Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainWitnessRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_tribunal_route',
    title: 'Tribunal Route',
    description:
      'Three-phase tribunal arc with gravitas accrual between legs — round-20 campaign path.',
    completionBadgeId: 'badge_o10m_chain_tribunal_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_tribunal_docket_brief',
        title: 'Docket Brief',
        narrativeBridge: 'Open the docket before the hearing chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 300 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_tribunal_hearing_chamber',
        title: 'Hearing Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, ACT: 5 },
          forcedSettingsPatch: { o10mTribunalMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_tribunal_seal_finale',
        title: 'Seal Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainTribunalRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_indictment_route',
    title: 'Indictment Route',
    description:
      'Three-phase indictment arc with case-weight accrual between legs — round-21 campaign path.',
    completionBadgeId: 'badge_o10m_chain_indictment_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_indictment_charge_docket',
        title: 'Charge Docket',
        narrativeBridge: 'File charges before the arraign bench.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 310 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_indictment_arraign_bench',
        title: 'Arraign Bench',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { QLD: 6, WA: 5 },
          forcedSettingsPatch: { o10mIndictmentMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_indictment_bind_finale',
        title: 'Bind Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainIndictmentRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_appeal_route',
    title: 'Appeal Route',
    description:
      'Three-phase appeal arc with merit accrual between legs — round-22 campaign path.',
    completionBadgeId: 'badge_o10m_chain_appeal_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_appeal_petition_filing',
        title: 'Petition Filing',
        narrativeBridge: 'File petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 320 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_appeal_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { TAS: 6, NSW: 5 },
          forcedSettingsPatch: { o10mAppealMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_appeal_grant_finale',
        title: 'Grant Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainAppealRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_clemency_route',
    title: 'Clemency Route',
    description:
      'Three-phase clemency arc with mercy accrual between legs — round-23 campaign path.',
    completionBadgeId: 'badge_o10m_chain_clemency_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_clemency_plea_docket',
        title: 'Plea Docket',
        narrativeBridge: 'File plea before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 330 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_clemency_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { TAS: 6, VIC: 5 },
          forcedSettingsPatch: { o10mClemencyMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_clemency_mercy_finale',
        title: 'Mercy Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainClemencyRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_pardon_route',
    title: 'Pardon Route',
    description:
      'Three-phase pardon arc with grace accrual between legs — round-24 campaign path.',
    completionBadgeId: 'badge_o10m_chain_pardon_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_pardon_brief_docket',
        title: 'Brief Docket',
        narrativeBridge: 'File brief before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 340 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_pardon_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NT: 6, QLD: 5 },
          forcedSettingsPatch: { o10mPardonMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_pardon_grace_finale',
        title: 'Grace Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainPardonRouteComplete: true } },
      },
    ],
  },
];

const CHAIN_BY_ID = new Map(O10M_SCENARIO_CHAINS.map(c => [c.id, c]));

export function getO10mScenarioChain(chainId: string): O10mScenarioChain | undefined {
  return CHAIN_BY_ID.get(chainId);
}

export function initializeChainProgress(chainId: string): O10mChainProgress | null {
  const chain = getO10mScenarioChain(chainId);
  if (!chain) return null;
  return {
    chainId,
    completedStepIndexes: [],
    activeStepIndex: 0,
    accumulatedCarry: {},
    chainCompleted: false,
  };
}

function mergeCarry(base: O10mChainCarryBonus, add: O10mChainCarryBonus): O10mChainCarryBonus {
  const standingDelta = { ...(base.standingDelta || {}) };
  for (const [k, v] of Object.entries(add.standingDelta || {})) {
    standingDelta[k] = (standingDelta[k] || 0) + v;
  }
  return {
    startingMoneyDelta: (base.startingMoneyDelta || 0) + (add.startingMoneyDelta || 0),
    standingDelta: Object.keys(standingDelta).length ? standingDelta : undefined,
    forcedSettingsPatch: { ...(base.forcedSettingsPatch || {}), ...(add.forcedSettingsPatch || {}) },
  };
}

export function isChainStepUnlocked(chain: O10mScenarioChain, progress: O10mChainProgress, stepIndex: number): boolean {
  if (progress.chainCompleted) return false;
  if (stepIndex === 0) return progress.completedStepIndexes.length === 0 || progress.activeStepIndex === 0;
  const prev = stepIndex - 1;
  return progress.completedStepIndexes.includes(prev);
}

export function validateChainStepSelection(
  chainId: string,
  progress: O10mChainProgress | null | undefined,
  scenarioId: string,
  stepIndex: number,
): { ok: boolean; errors: string[] } {
  const chain = getO10mScenarioChain(chainId);
  if (!chain) return { ok: false, errors: [`Unknown chain: ${chainId}`] };
  const step = chain.steps.find(s => s.stepIndex === stepIndex);
  if (!step) return { ok: false, errors: [`Invalid step index ${stepIndex} for chain ${chainId}`] };
  if (step.scenarioId !== scenarioId) {
    return { ok: false, errors: [`Step ${stepIndex} expects scenario ${step.scenarioId}, got ${scenarioId}`] };
  }
  const prog = progress ?? initializeChainProgress(chainId);
  if (!prog) return { ok: false, errors: ['Could not initialize chain progress.'] };
  if (!isChainStepUnlocked(chain, prog, stepIndex)) {
    return { ok: false, errors: [`Chain step ${stepIndex} is locked.`] };
  }
  return { ok: true, errors: [] };
}

function runMeetsStepRequirements(
  step: O10mScenarioChain['steps'][number],
  run: O10mRunSummary,
): boolean {
  if (step.requiresPrimaryVictory && !run.primaryVictory) return false;
  if (step.requiresOptionalCount != null && run.optionalObjectivesCompleted < step.requiresOptionalCount) {
    return false;
  }
  return true;
}

export function advanceChainAfterRun(
  chainId: string,
  progress: O10mChainProgress,
  run: O10mRunSummary,
): O10mChainAdvanceResult {
  const chain = getO10mScenarioChain(chainId);
  if (!chain) {
    return {
      progress,
      advanced: false,
      chainCompleted: progress.chainCompleted,
      unlockedNextScenarioId: null,
    };
  }

  const step = chain.steps.find(s => s.stepIndex === progress.activeStepIndex);
  if (!step || step.scenarioId !== run.scenarioId) {
    return {
      progress,
      advanced: false,
      chainCompleted: progress.chainCompleted,
      unlockedNextScenarioId: null,
    };
  }

  if (!runMeetsStepRequirements(step, run)) {
    return {
      progress,
      advanced: false,
      chainCompleted: false,
      unlockedNextScenarioId: null,
    };
  }

  const completed = Array.from(new Set([...progress.completedStepIndexes, step.stepIndex])).sort((a, b) => a - b);
  const carry = step.carryBonusOnComplete
    ? mergeCarry(progress.accumulatedCarry, step.carryBonusOnComplete)
    : progress.accumulatedCarry;

  const isLast = step.stepIndex === chain.steps[chain.steps.length - 1]!.stepIndex;
  if (isLast) {
    return {
      progress: {
        chainId,
        completedStepIndexes: completed,
        activeStepIndex: step.stepIndex,
        accumulatedCarry: carry,
        chainCompleted: true,
      },
      advanced: true,
      chainCompleted: true,
      unlockedNextScenarioId: null,
    };
  }

  const nextIndex = step.stepIndex + 1;
  const nextStep = chain.steps.find(s => s.stepIndex === nextIndex);
  return {
    progress: {
      chainId,
      completedStepIndexes: completed,
      activeStepIndex: nextIndex,
      accumulatedCarry: carry,
      chainCompleted: false,
    },
    advanced: true,
    chainCompleted: false,
    unlockedNextScenarioId: nextStep?.scenarioId ?? null,
  };
}

export function buildChainScenarioStartOverrides(progress: O10mChainProgress): O10mScenarioStartOverrides {
  const carry = progress.accumulatedCarry;
  return {
    startingMoneyMultiplier: 1,
    startingStandingDelta: carry.standingDelta ? { ...carry.standingDelta } : undefined,
  };
}

export function buildChainForcedSettingsPatch(progress: O10mChainProgress): Record<string, unknown> {
  const patch: Record<string, unknown> = {
    ...(progress.accumulatedCarry.forcedSettingsPatch || {}),
    o10mActiveChainId: progress.chainId,
    o10mActiveChainStep: progress.activeStepIndex,
  };
  if (progress.accumulatedCarry.startingMoneyDelta) {
    patch.o10mChainStartingMoneyBonus = progress.accumulatedCarry.startingMoneyDelta;
  }
  return patch;
}

export function listO10mScenarioChainIds(): string[] {
  return O10M_SCENARIO_CHAINS.map(c => c.id);
}
