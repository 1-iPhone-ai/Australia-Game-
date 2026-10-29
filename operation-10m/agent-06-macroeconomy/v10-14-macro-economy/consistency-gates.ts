import type { MacroConsistencyGate, MacroEconomyInputs, NationalMacroEconomyState } from './types.ts';

export function evaluateMacroConsistencyGates(
  state: NationalMacroEconomyState,
  inputs: MacroEconomyInputs
): MacroConsistencyGate[] {
  const gates: MacroConsistencyGate[] = [];
  if (!state.accounting.identityOk) {
    gates.push({
      id: 'accounting_identity',
      triggered: true,
      severity: 'warn',
      summary: `Regional share accounting residual ${state.accounting.identityResidual.toFixed(6)}`
    });
  }
  const pf: any = inputs.publicFinance;
  const hh: any = inputs.households;
  const fiscalPressure = String(pf?.pressure ?? pf?.fiscalPosition?.pressure ?? '');
  const demand = String(hh?.domesticDemand?.level ?? hh?.domesticDemand?.band ?? '');
  if (fiscalPressure === 'critical' && (demand === 'strong' || demand === 'surging' || demand === 'very_strong')) {
    gates.push({
      id: 'fiscal_household_tension',
      triggered: true,
      severity: 'info',
      summary: 'Critical fiscal capacity coexists with strong household demand — interpret macro signals carefully.'
    });
  }
  if (state.investmentClimate === 'frozen' && state.utilizationBand === 'tight') {
    gates.push({
      id: 'investment_utilization_mismatch',
      triggered: true,
      severity: 'info',
      summary: 'Frozen investment climate despite tight utilization — binding constraint may be financial, not capacity.'
    });
  }
  if (state.regionalDivergence.band === 'wide_spread' && state.cyclePhase === 'expansion') {
    gates.push({
      id: 'regional_divergence_expansion',
      triggered: true,
      severity: 'info',
      summary: 'National expansion masks wide regional productivity dispersion.'
    });
  }
  const tr: any = inputs.trade;
  const terms = String(tr?.termsOfTrade?.band ?? tr?.termsBand ?? '');
  if (terms === 'weak' && (fiscalPressure === 'critical' || fiscalPressure === 'strained')) {
    gates.push({
      id: 'trade_fiscal_stress',
      triggered: true,
      severity: 'warn',
      summary: 'Weak external terms coincide with strained fiscal capacity — macro downside risk elevated.'
    });
  }
  if (state.transmissionReport?.dominantLayerId === 'v10.15_trade' && state.cyclePhase === 'contraction') {
    gates.push({
      id: 'external_led_contraction',
      triggered: true,
      severity: 'info',
      summary: 'External demand layer dominates transmission while cycle is in contraction.'
    });
  }
  const cm: any = inputs.creditMarkets ?? inputs.monetaryPolicy;
  const spread = String(cm?.spreadBand ?? cm?.creditSpread?.band ?? '');
  if (
    (spread === 'wide' || spread === 'stressed' || spread === 'frozen' || inputs.creditShockActive) &&
    state.investmentClimate === 'frozen'
  ) {
    gates.push({
      id: 'credit_investment_squeeze',
      triggered: true,
      severity: 'warn',
      summary: 'Tight credit conditions coincide with frozen investment climate — financing constraint likely binding.'
    });
  }
  const creditTight =
    inputs.creditShockActive ||
    spread === 'wide' ||
    spread === 'stressed' ||
    spread === 'frozen' ||
    String(cm?.policyStance ?? cm?.stance ?? '') === 'restrictive';
  if ((fiscalPressure === 'critical' || fiscalPressure === 'strained') && creditTight) {
    gates.push({
      id: 'monetary_fiscal_clamp',
      triggered: true,
      severity: 'warn',
      summary: 'Fiscal strain plus simultaneous credit tightening — composite policy stance is conflicted.'
    });
  }
  if (
    state.transmissionReport?.dominantLayerId === 'v10.16_credit' &&
    (creditTight || state.investmentClimate === 'frozen')
  ) {
    gates.push({
      id: 'credit_led_stress',
      triggered: true,
      severity: 'info',
      summary: 'Credit layer dominates macro transmission under tight financial conditions.'
    });
  }
  const wf: any = inputs.workforce;
  const readiness = String(wf?.nationalReadinessBand ?? wf?.readiness?.band ?? '');
  if (
    (readiness === 'critical' || readiness === 'shortage') &&
    (state.utilizationBand === 'tight' || state.utilizationBand === 'overextended')
  ) {
    gates.push({
      id: 'workforce_utilization_bind',
      triggered: true,
      severity: 'warn',
      summary: 'Labor shortages coincide with tight utilization — capacity constraint likely binding.'
    });
  }
  const inn: any = inputs.innovation;
  const innMomentum = String(inn?.momentum?.band ?? inn?.rAndDMomentum ?? '');
  if (
    (state.cyclePhase === 'contraction' || state.cyclePhase === 'trough') &&
    (innMomentum === 'stalled' || innMomentum === 'weak' || innMomentum === 'contracting')
  ) {
    gates.push({
      id: 'innovation_contraction_drag',
      triggered: true,
      severity: 'info',
      summary: 'Innovation pipeline weakness amplifies macro contraction read.'
    });
  }
  if (state.capacitySnapshot?.band === 'binding' && state.investmentClimate === 'frozen') {
    gates.push({
      id: 'capacity_investment_paradox',
      triggered: true,
      severity: 'info',
      summary: 'Binding capacity read coexists with frozen investment — financing or policy may be the bind, not physical capacity.'
    });
  }
  const hw: any = inputs.housingWellbeing ?? inputs.housing;
  const housingStress = String(hw?.affordability?.band ?? hw?.affordabilityBand ?? hw?.stressBand ?? '');
  if (
    (housingStress === 'severe' || housingStress === 'critical' || housingStress === 'stressed') &&
    (creditTight || spread === 'stressed' || spread === 'frozen')
  ) {
    gates.push({
      id: 'housing_credit_stress',
      triggered: true,
      severity: 'warn',
      summary: 'Housing affordability stress coincides with tight credit — domestic macro downside risk elevated.'
    });
  }
  const sc: any = inputs.strategicCapital;
  const stratAlloc = String(sc?.allocationBand ?? sc?.capitalBand ?? '');
  if (
    (stratAlloc === 'expansionary' || stratAlloc === 'growth' || stratAlloc === 'active') &&
    state.investmentClimate === 'frozen'
  ) {
    gates.push({
      id: 'strategic_investment_divergence',
      triggered: true,
      severity: 'info',
      summary: 'Strategic capital stance is expansionary while macro investment climate reads frozen — execution or financing gap likely.'
    });
  }
  if (
    state.transmissionBalance?.band === 'cross_current' ||
    state.transmissionBalance?.band === 'fragmented'
  ) {
    gates.push({
      id: 'transmission_cross_current',
      triggered: true,
      severity: 'info',
      summary: 'Cross-current transmission layers — headline macro scores may mask offsetting sector forces.'
    });
  }
  const nf: any = inputs.nationalFinance ?? inputs.monetaryPolicy;
  const inflBand = String(nf?.inflation?.band ?? nf?.inflationBand ?? nf?.cpiBand ?? '');
  if (
    (inflBand === 'elevated' || inflBand === 'high' || inflBand === 'very_high' || inputs.highInflationScenarioActive) &&
    (state.cyclePhase === 'contraction' || state.cyclePhase === 'slowdown' || state.cyclePhase === 'trough')
  ) {
    gates.push({
      id: 'inflation_cycle_drag',
      triggered: true,
      severity: 'warn',
      summary: 'Elevated inflation coincides with macro downturn — stagflation-style read elevated.'
    });
  }
  const en: any = inputs.industrialEnergy ?? inputs.energyEnvironment ?? inputs.nationalSystems?.industrialEnergy;
  const supply = String(en?.supplyReliability?.band ?? en?.reliabilityBand ?? en?.gridBand ?? '');
  if (
    (supply === 'critical' || supply === 'fragile' || supply === 'stressed') &&
    (state.utilizationBand === 'tight' || state.utilizationBand === 'overextended')
  ) {
    gates.push({
      id: 'energy_transition_bind',
      triggered: true,
      severity: 'warn',
      summary: 'Fragile energy supply with tight utilization — physical energy constraint may bind capacity.'
    });
  }
  const energyCost = String(en?.energyCost?.band ?? en?.inputCostBand ?? '');
  if (
    (energyCost === 'spike' || energyCost === 'severe' || energyCost === 'elevated') &&
    (inflBand === 'elevated' || inflBand === 'high' || inflBand === 'very_high' || inputs.highInflationScenarioActive)
  ) {
    gates.push({
      id: 'inflation_energy_stagflation',
      triggered: true,
      severity: 'info',
      summary: 'Energy cost shock aligns with elevated inflation — composite price-pressure macro risk.'
    });
  }
  if (
    state.transmissionCoherence?.band === 'contradictory' ||
    state.transmissionCoherence?.band === 'mixed'
  ) {
    gates.push({
      id: 'transmission_phase_incoherence',
      triggered: true,
      severity: 'info',
      summary: 'Transmission layer nudges partially contradict the headline cycle phase.'
    });
  }
  const ev: any = inputs.dynamicEvents ?? inputs.narrativeEvents ?? inputs.op10mEvents;
  const stability = String(ev?.nationalStabilityBand ?? ev?.stabilityBand ?? '');
  if (
    (stability === 'critical' || stability === 'fragile' || stability === 'stressed') &&
    (state.cyclePhase === 'contraction' || state.cyclePhase === 'trough' || state.cyclePhase === 'slowdown')
  ) {
    gates.push({
      id: 'events_cycle_drag',
      triggered: true,
      severity: 'warn',
      summary: 'Fragile national narrative stability coincides with macro downturn — event-layer downside risk elevated.'
    });
  }
  const co: any = inputs.companies ?? inputs.privateSector ?? inputs.nationalPrivateSector;
  const utilization = String(co?.nationalUtilizationBand ?? co?.utilization?.band ?? co?.productionUtilization?.band ?? '');
  const overloaded = Math.max(0, Math.floor(Number(co?.overloadedFirmCount ?? co?.overloadedCount ?? 0)));
  if (
    (utilization === 'overextended' || utilization === 'saturated' || overloaded >= 3) &&
    (state.utilizationBand === 'tight' || state.utilizationBand === 'overextended')
  ) {
    gates.push({
      id: 'companies_capacity_bind',
      triggered: true,
      severity: 'warn',
      summary: 'Private-sector production strain coincides with tight macro utilization — capacity bind likely.'
    });
  }
  const backlog = String(ev?.pendingBacklogBand ?? ev?.backlogBand ?? '');
  if (
    (backlog === 'surging' || backlog === 'critical') &&
    (utilization === 'slack' || utilization === 'depressed' || utilization === 'critical')
  ) {
    gates.push({
      id: 'events_production_disruption',
      triggered: true,
      severity: 'info',
      summary: 'Event backlog pressure aligns with slack production utilization — narrative-production macro tension.'
    });
  }
  if (
    state.transmissionConcentration?.band === 'dominant_single' ||
    state.transmissionConcentration?.band === 'concentrated'
  ) {
    gates.push({
      id: 'transmission_concentration_risk',
      triggered: true,
      severity: 'info',
      summary: 'Macro transmission is concentrated in a narrow layer set — headline scores may be brittle.'
    });
  }
  const tt: any = inputs.turnsTime ?? inputs.temporalCadence ?? inputs.gameClock;
  const pace = String(tt?.paceBand ?? tt?.turnPace?.band ?? '');
  if (
    (pace === 'stalled' || pace === 'frozen' || pace === 'deferred') &&
    (state.cyclePhase === 'expansion' || state.cyclePhase === 'recovery')
  ) {
    gates.push({
      id: 'turns_cycle_desync',
      triggered: true,
      severity: 'info',
      summary: 'Stalled turn cadence coexists with expansionary macro phase — temporal desync elevated.'
    });
  }
  const infra: any = inputs.transportInfrastructure ?? inputs.infrastructure ?? inputs.nationalInfrastructure;
  const connectivity = String(infra?.connectivityBand ?? infra?.connectivity?.band ?? '');
  if (
    (connectivity === 'fragmented' || connectivity === 'critical' || connectivity === 'degraded') &&
    (state.productivityBand === 'strong' || state.productivityBand === 'leading')
  ) {
    gates.push({
      id: 'transport_productivity_tension',
      triggered: true,
      severity: 'warn',
      summary: 'Strong macro productivity read conflicts with degraded transport connectivity — logistics bind likely.'
    });
  }
  if (
    state.transmissionAsymmetry?.band === 'restrict_skewed' &&
    (state.cyclePhase === 'contraction' || state.cyclePhase === 'trough')
  ) {
    gates.push({
      id: 'transmission_asymmetry_downside',
      triggered: true,
      severity: 'info',
      summary: 'Restrictive transmission skew aligns with macro downturn — downside reinforcement elevated.'
    });
  }
  const rs: any = inputs.researchTech ?? inputs.research ?? inputs.nationalResearch;
  const pipeline = String(rs?.pipelineBand ?? rs?.techPipeline?.band ?? '');
  if (
    (pipeline === 'stalled' || pipeline === 'blocked' || pipeline === 'weak') &&
    (state.productivityBand === 'strong' || state.productivityBand === 'leading')
  ) {
    gates.push({
      id: 'research_productivity_divergence',
      triggered: true,
      severity: 'info',
      summary: 'Strong macro productivity read conflicts with weak research pipeline — tech drag may be latent.'
    });
  }
  const pop: any = inputs.population ?? inputs.demographics ?? inputs.nationalPopulation;
  const growth = String(pop?.growthBand ?? pop?.populationGrowth?.band ?? '');
  if (
    (growth === 'contracting' || growth === 'critical' || growth === 'stagnant') &&
    (state.investmentClimate === 'active' || state.investmentClimate === 'overheating')
  ) {
    gates.push({
      id: 'population_investment_tension',
      triggered: true,
      severity: 'warn',
      summary: 'Weak demographic momentum coexists with overheating investment read — sustainability risk elevated.'
    });
  }
  if (state.transmissionVolatility?.band === 'turbulent' || state.transmissionVolatility?.band === 'elevated') {
    gates.push({
      id: 'transmission_volatility_elevated',
      triggered: true,
      severity: 'info',
      summary: 'Elevated cross-layer transmission volatility — composite macro scores may swing turn-to-turn.'
    });
  }
  const md: any = inputs.modesScenarios ?? inputs.gameModes ?? inputs.scenarioRuntime;
  const difficulty = String(md?.difficultyBand ?? md?.scenarioDifficulty?.band ?? '');
  if (
    (difficulty === 'extreme' || difficulty === 'crisis') &&
    (state.stressIndex?.band === 'acute' || state.stressIndex?.band === 'elevated')
  ) {
    gates.push({
      id: 'modes_stress_alignment',
      triggered: true,
      severity: 'warn',
      summary: 'Extreme scenario difficulty aligns with elevated macro stress index — composite downside risk.'
    });
  }
  const grd: any = inputs.guardianCopilot ?? inputs.guardian ?? inputs.coPilotWarnings;
  const alert = String(grd?.alertBand ?? grd?.riskBand ?? '');
  if (
    (alert === 'critical' || alert === 'severe' || alert === 'red') &&
    state.transmissionResilience?.band === 'fragile'
  ) {
    gates.push({
      id: 'guardian_resilience_fragility',
      triggered: true,
      severity: 'warn',
      summary: 'Critical guardian alerts with fragile transmission resilience — macro read highly brittle.'
    });
  }
  return gates;
}
