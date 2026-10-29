import { runAgent08ModuleSelfTests, runAgent08IntegratedSelfTests, runAgent08RecoverySelfTests, runAgent08StabilizationSelfTests, runAgent08MandateSelfTests, runAgent08ComplianceSelfTests, runAgent08RemediationSelfTests, runAgent08ExecutionSelfTests, runAgent08UtilizationDepthSelfTests, runAgent08ReconciliationSelfTests, runAgent08OperatingPrioritySelfTests, runAgent08OperatingDigestSelfTests, runAgent08ReadinessPortfolioSelfTests, runAgent08TransitionHorizonSelfTests, runAgent08TransitionCommitmentSelfTests, runAgent08TransitionMobilizationSelfTests, runAgent08TransitionDeploymentSelfTests, runAgent08TransitionValidationSelfTests, runAgent08TransitionConsolidationSelfTests, runAgent08TransitionSustainmentSelfTests, runAgent08TransitionResilienceSelfTests, runAgent08TransitionEquilibriumSelfTests, runAgent08TransitionMaturitySelfTests, runAgent08TransitionContinuitySelfTests, runAgent08TransitionHeritageSelfTests, runAgent08TransitionCodificationSelfTests, runAgent08TransitionStewardshipSelfTests, runAgent08TransitionGovernanceSelfTests, runAgent08TransitionAccountabilitySelfTests, runAgent08TransitionAssuranceSelfTests, runAgent08TransitionTrustSelfTests, runAgent08TransitionLegitimacySelfTests, runAgent08TransitionRecognitionSelfTests, runAgent08TransitionPrecedenceSelfTests, runAgent08TransitionRatificationSelfTests, runAgent08TransitionConfirmationSelfTests, runAgent08TransitionFinalizationSelfTests, runAgent08TransitionClosureSelfTests, runAgent08TransitionCompletionSelfTests, runAgent08TransitionResolutionSelfTests, runAgent08TransitionSettlementSelfTests, runAgent08TransitionRetirementSelfTests, runAgent08TransitionLegacySelfTests, runAgent08TransitionRemembranceSelfTests, runAgent08TransitionCommemorationSelfTests, runAgent08TransitionVenerationSelfTests, runAgent08TransitionEnshrinementSelfTests, runAgent08TransitionImmortalizationSelfTests, runAgent08CascadeSelfTests, runAgent08SectorDepthSelfTests, runAgent08SupplyChainSelfTests, runAgent08TaxLaborSelfTests } from '../index.ts';

function main() {
  const tax = runAgent08TaxLaborSelfTests();
  const failedTax = tax.filter(t => !t.passed);
  if (failedTax.length) {
    console.error('Agent 08 tax/labor tests failed:', failedTax);
    process.exit(1);
  }
  console.log(`Agent 08 tax/labor: ${tax.length} passed`);

  const supply = runAgent08SupplyChainSelfTests();
  const failedSupply = supply.filter(t => !t.passed);
  if (failedSupply.length) {
    console.error('Agent 08 supply chain tests failed:', failedSupply);
    process.exit(1);
  }
  console.log(`Agent 08 supply chain: ${supply.length} passed`);

  const sector = runAgent08SectorDepthSelfTests();
  const failedSector = sector.filter(t => !t.passed);
  if (failedSector.length) {
    console.error('Agent 08 sector depth tests failed:', failedSector);
    process.exit(1);
  }
  console.log(`Agent 08 sector depth: ${sector.length} passed`);

  const cascade = runAgent08CascadeSelfTests();
  const failedCascade = cascade.filter(t => !t.passed);
  if (failedCascade.length) {
    console.error('Agent 08 cascade tests failed:', failedCascade);
    process.exit(1);
  }
  console.log(`Agent 08 production cascade: ${cascade.length} passed`);

  const integrated = runAgent08IntegratedSelfTests();
  const failedIntegrated = integrated.filter(t => !t.passed);
  if (failedIntegrated.length) {
    console.error('Agent 08 integrated tests failed:', failedIntegrated);
    process.exit(1);
  }
  console.log(`Agent 08 integrated synthesis: ${integrated.length} passed`);

  const recovery = runAgent08RecoverySelfTests();
  const failedRecovery = recovery.filter(t => !t.passed);
  if (failedRecovery.length) {
    console.error('Agent 08 recovery playbook tests failed:', failedRecovery);
    process.exit(1);
  }
  console.log(`Agent 08 recovery playbook: ${recovery.length} passed`);

  const stabilization = runAgent08StabilizationSelfTests();
  const failedStabilization = stabilization.filter(t => !t.passed);
  if (failedStabilization.length) {
    console.error('Agent 08 stabilization outlook tests failed:', failedStabilization);
    process.exit(1);
  }
  console.log(`Agent 08 stabilization outlook: ${stabilization.length} passed`);

  const mandate = runAgent08MandateSelfTests();
  const failedMandate = mandate.filter(t => !t.passed);
  if (failedMandate.length) {
    console.error('Agent 08 coordination mandate tests failed:', failedMandate);
    process.exit(1);
  }
  console.log(`Agent 08 coordination mandate: ${mandate.length} passed`);

  const compliance = runAgent08ComplianceSelfTests();
  const failedCompliance = compliance.filter(t => !t.passed);
  if (failedCompliance.length) {
    console.error('Agent 08 mandate compliance tests failed:', failedCompliance);
    process.exit(1);
  }
  console.log(`Agent 08 mandate compliance: ${compliance.length} passed`);

  const remediation = runAgent08RemediationSelfTests();
  const failedRemediation = remediation.filter(t => !t.passed);
  if (failedRemediation.length) {
    console.error('Agent 08 compliance remediation tests failed:', failedRemediation);
    process.exit(1);
  }
  console.log(`Agent 08 compliance remediation: ${remediation.length} passed`);

  const execution = runAgent08ExecutionSelfTests();
  const failedExecution = execution.filter(t => !t.passed);
  if (failedExecution.length) {
    console.error('Agent 08 remediation execution tests failed:', failedExecution);
    process.exit(1);
  }
  console.log(`Agent 08 remediation execution: ${execution.length} passed`);

  const utilizationDepth = runAgent08UtilizationDepthSelfTests();
  const failedUtilization = utilizationDepth.filter(t => !t.passed);
  if (failedUtilization.length) {
    console.error('Agent 08 production utilization depth tests failed:', failedUtilization);
    process.exit(1);
  }
  console.log(`Agent 08 production utilization depth: ${utilizationDepth.length} passed`);

  const reconciliation = runAgent08ReconciliationSelfTests();
  const failedReconciliation = reconciliation.filter(t => !t.passed);
  if (failedReconciliation.length) {
    console.error('Agent 08 capacity reconciliation tests failed:', failedReconciliation);
    process.exit(1);
  }
  console.log(`Agent 08 capacity reconciliation: ${reconciliation.length} passed`);

  const operatingPriority = runAgent08OperatingPrioritySelfTests();
  const failedOperating = operatingPriority.filter(t => !t.passed);
  if (failedOperating.length) {
    console.error('Agent 08 operating priority tests failed:', failedOperating);
    process.exit(1);
  }
  console.log(`Agent 08 operating priorities: ${operatingPriority.length} passed`);

  const operatingDigest = runAgent08OperatingDigestSelfTests();
  const failedDigest = operatingDigest.filter(t => !t.passed);
  if (failedDigest.length) {
    console.error('Agent 08 operating digest tests failed:', failedDigest);
    process.exit(1);
  }
  console.log(`Agent 08 operating digest: ${operatingDigest.length} passed`);

  const readinessPortfolio = runAgent08ReadinessPortfolioSelfTests();
  const failedReadiness = readinessPortfolio.filter(t => !t.passed);
  if (failedReadiness.length) {
    console.error('Agent 08 readiness portfolio tests failed:', failedReadiness);
    process.exit(1);
  }
  console.log(`Agent 08 readiness portfolio: ${readinessPortfolio.length} passed`);

  const transitionHorizon = runAgent08TransitionHorizonSelfTests();
  const failedHorizon = transitionHorizon.filter(t => !t.passed);
  if (failedHorizon.length) {
    console.error('Agent 08 transition horizon tests failed:', failedHorizon);
    process.exit(1);
  }
  console.log(`Agent 08 transition horizon: ${transitionHorizon.length} passed`);

  const transitionCommitment = runAgent08TransitionCommitmentSelfTests();
  const failedCommitment = transitionCommitment.filter(t => !t.passed);
  if (failedCommitment.length) {
    console.error('Agent 08 transition commitment tests failed:', failedCommitment);
    process.exit(1);
  }
  console.log(`Agent 08 transition commitment: ${transitionCommitment.length} passed`);

  const transitionMobilization = runAgent08TransitionMobilizationSelfTests();
  const failedMobilization = transitionMobilization.filter(t => !t.passed);
  if (failedMobilization.length) {
    console.error('Agent 08 transition mobilization tests failed:', failedMobilization);
    process.exit(1);
  }
  console.log(`Agent 08 transition mobilization: ${transitionMobilization.length} passed`);

  const transitionDeployment = runAgent08TransitionDeploymentSelfTests();
  const failedDeployment = transitionDeployment.filter(t => !t.passed);
  if (failedDeployment.length) {
    console.error('Agent 08 transition deployment tests failed:', failedDeployment);
    process.exit(1);
  }
  console.log(`Agent 08 transition deployment: ${transitionDeployment.length} passed`);

  const transitionValidation = runAgent08TransitionValidationSelfTests();
  const failedValidation = transitionValidation.filter(t => !t.passed);
  if (failedValidation.length) {
    console.error('Agent 08 transition validation tests failed:', failedValidation);
    process.exit(1);
  }
  console.log(`Agent 08 transition validation: ${transitionValidation.length} passed`);

  const transitionConsolidation = runAgent08TransitionConsolidationSelfTests();
  const failedConsolidation = transitionConsolidation.filter(t => !t.passed);
  if (failedConsolidation.length) {
    console.error('Agent 08 transition consolidation tests failed:', failedConsolidation);
    process.exit(1);
  }
  console.log(`Agent 08 transition consolidation: ${transitionConsolidation.length} passed`);

  const transitionSustainment = runAgent08TransitionSustainmentSelfTests();
  const failedSustainment = transitionSustainment.filter(t => !t.passed);
  if (failedSustainment.length) {
    console.error('Agent 08 transition sustainment tests failed:', failedSustainment);
    process.exit(1);
  }
  console.log(`Agent 08 transition sustainment: ${transitionSustainment.length} passed`);

  const transitionResilience = runAgent08TransitionResilienceSelfTests();
  const failedResilience = transitionResilience.filter(t => !t.passed);
  if (failedResilience.length) {
    console.error('Agent 08 transition resilience tests failed:', failedResilience);
    process.exit(1);
  }
  console.log(`Agent 08 transition resilience: ${transitionResilience.length} passed`);

  const transitionEquilibrium = runAgent08TransitionEquilibriumSelfTests();
  const failedEquilibrium = transitionEquilibrium.filter(t => !t.passed);
  if (failedEquilibrium.length) {
    console.error('Agent 08 transition equilibrium tests failed:', failedEquilibrium);
    process.exit(1);
  }
  console.log(`Agent 08 transition equilibrium: ${transitionEquilibrium.length} passed`);

  const transitionMaturity = runAgent08TransitionMaturitySelfTests();
  const failedMaturity = transitionMaturity.filter(t => !t.passed);
  if (failedMaturity.length) {
    console.error('Agent 08 transition maturity tests failed:', failedMaturity);
    process.exit(1);
  }
  console.log(`Agent 08 transition maturity: ${transitionMaturity.length} passed`);

  const transitionContinuity = runAgent08TransitionContinuitySelfTests();
  const failedContinuity = transitionContinuity.filter(t => !t.passed);
  if (failedContinuity.length) {
    console.error('Agent 08 transition continuity tests failed:', failedContinuity);
    process.exit(1);
  }
  console.log(`Agent 08 transition continuity: ${transitionContinuity.length} passed`);

  const transitionHeritage = runAgent08TransitionHeritageSelfTests();
  const failedHeritage = transitionHeritage.filter(t => !t.passed);
  if (failedHeritage.length) {
    console.error('Agent 08 transition heritage tests failed:', failedHeritage);
    process.exit(1);
  }
  console.log(`Agent 08 transition heritage: ${transitionHeritage.length} passed`);

  const transitionCodification = runAgent08TransitionCodificationSelfTests();
  const failedCodification = transitionCodification.filter(t => !t.passed);
  if (failedCodification.length) {
    console.error('Agent 08 transition codification tests failed:', failedCodification);
    process.exit(1);
  }
  console.log(`Agent 08 transition codification: ${transitionCodification.length} passed`);

  const transitionStewardship = runAgent08TransitionStewardshipSelfTests();
  const failedStewardship = transitionStewardship.filter(t => !t.passed);
  if (failedStewardship.length) {
    console.error('Agent 08 transition stewardship tests failed:', failedStewardship);
    process.exit(1);
  }
  console.log(`Agent 08 transition stewardship: ${transitionStewardship.length} passed`);

  const transitionGovernance = runAgent08TransitionGovernanceSelfTests();
  const failedGovernance = transitionGovernance.filter(t => !t.passed);
  if (failedGovernance.length) {
    console.error('Agent 08 transition governance tests failed:', failedGovernance);
    process.exit(1);
  }
  console.log(`Agent 08 transition governance: ${transitionGovernance.length} passed`);

  const transitionAccountability = runAgent08TransitionAccountabilitySelfTests();
  const failedAccountability = transitionAccountability.filter(t => !t.passed);
  if (failedAccountability.length) {
    console.error('Agent 08 transition accountability tests failed:', failedAccountability);
    process.exit(1);
  }
  console.log(`Agent 08 transition accountability: ${transitionAccountability.length} passed`);

  const transitionAssurance = runAgent08TransitionAssuranceSelfTests();
  const failedAssurance = transitionAssurance.filter(t => !t.passed);
  if (failedAssurance.length) {
    console.error('Agent 08 transition assurance tests failed:', failedAssurance);
    process.exit(1);
  }
  console.log(`Agent 08 transition assurance: ${transitionAssurance.length} passed`);

  const transitionTrust = runAgent08TransitionTrustSelfTests();
  const failedTrust = transitionTrust.filter(t => !t.passed);
  if (failedTrust.length) {
    console.error('Agent 08 transition trust tests failed:', failedTrust);
    process.exit(1);
  }
  console.log(`Agent 08 transition trust: ${transitionTrust.length} passed`);

  const transitionLegitimacy = runAgent08TransitionLegitimacySelfTests();
  const failedLegitimacy = transitionLegitimacy.filter(t => !t.passed);
  if (failedLegitimacy.length) {
    console.error('Agent 08 transition legitimacy tests failed:', failedLegitimacy);
    process.exit(1);
  }
  console.log(`Agent 08 transition legitimacy: ${transitionLegitimacy.length} passed`);

  const transitionRecognition = runAgent08TransitionRecognitionSelfTests();
  const failedRecognition = transitionRecognition.filter(t => !t.passed);
  if (failedRecognition.length) {
    console.error('Agent 08 transition recognition tests failed:', failedRecognition);
    process.exit(1);
  }
  console.log(`Agent 08 transition recognition: ${transitionRecognition.length} passed`);

  const transitionPrecedence = runAgent08TransitionPrecedenceSelfTests();
  const failedPrecedence = transitionPrecedence.filter(t => !t.passed);
  if (failedPrecedence.length) {
    console.error('Agent 08 transition precedence tests failed:', failedPrecedence);
    process.exit(1);
  }
  console.log(`Agent 08 transition precedence: ${transitionPrecedence.length} passed`);

  const transitionRatification = runAgent08TransitionRatificationSelfTests();
  const failedRatification = transitionRatification.filter(t => !t.passed);
  if (failedRatification.length) {
    console.error('Agent 08 transition ratification tests failed:', failedRatification);
    process.exit(1);
  }
  console.log(`Agent 08 transition ratification: ${transitionRatification.length} passed`);

  const transitionConfirmation = runAgent08TransitionConfirmationSelfTests();
  const failedConfirmation = transitionConfirmation.filter(t => !t.passed);
  if (failedConfirmation.length) {
    console.error('Agent 08 transition confirmation tests failed:', failedConfirmation);
    process.exit(1);
  }
  console.log(`Agent 08 transition confirmation: ${transitionConfirmation.length} passed`);

  const transitionFinalization = runAgent08TransitionFinalizationSelfTests();
  const failedFinalization = transitionFinalization.filter(t => !t.passed);
  if (failedFinalization.length) {
    console.error('Agent 08 transition finalization tests failed:', failedFinalization);
    process.exit(1);
  }
  console.log(`Agent 08 transition finalization: ${transitionFinalization.length} passed`);

  const transitionClosure = runAgent08TransitionClosureSelfTests();
  const failedClosure = transitionClosure.filter(t => !t.passed);
  if (failedClosure.length) {
    console.error('Agent 08 transition closure tests failed:', failedClosure);
    process.exit(1);
  }
  console.log(`Agent 08 transition closure: ${transitionClosure.length} passed`);

  const transitionCompletion = runAgent08TransitionCompletionSelfTests();
  const failedCompletion = transitionCompletion.filter(t => !t.passed);
  if (failedCompletion.length) {
    console.error('Agent 08 transition completion tests failed:', failedCompletion);
    process.exit(1);
  }
  console.log(`Agent 08 transition completion: ${transitionCompletion.length} passed`);

  const transitionResolution = runAgent08TransitionResolutionSelfTests();
  const failedResolution = transitionResolution.filter(t => !t.passed);
  if (failedResolution.length) {
    console.error('Agent 08 transition resolution tests failed:', failedResolution);
    process.exit(1);
  }
  console.log(`Agent 08 transition resolution: ${transitionResolution.length} passed`);

  const transitionSettlement = runAgent08TransitionSettlementSelfTests();
  const failedSettlement = transitionSettlement.filter(t => !t.passed);
  if (failedSettlement.length) {
    console.error('Agent 08 transition settlement tests failed:', failedSettlement);
    process.exit(1);
  }
  console.log(`Agent 08 transition settlement: ${transitionSettlement.length} passed`);

  const transitionRetirement = runAgent08TransitionRetirementSelfTests();
  const failedRetirement = transitionRetirement.filter(t => !t.passed);
  if (failedRetirement.length) {
    console.error('Agent 08 transition retirement tests failed:', failedRetirement);
    process.exit(1);
  }
  console.log(`Agent 08 transition retirement: ${transitionRetirement.length} passed`);

  const transitionLegacy = runAgent08TransitionLegacySelfTests();
  const failedLegacy = transitionLegacy.filter(t => !t.passed);
  if (failedLegacy.length) {
    console.error('Agent 08 transition legacy tests failed:', failedLegacy);
    process.exit(1);
  }
  console.log(`Agent 08 transition legacy: ${transitionLegacy.length} passed`);

  const transitionRemembrance = runAgent08TransitionRemembranceSelfTests();
  const failedRemembrance = transitionRemembrance.filter(t => !t.passed);
  if (failedRemembrance.length) {
    console.error('Agent 08 transition remembrance tests failed:', failedRemembrance);
    process.exit(1);
  }
  console.log(`Agent 08 transition remembrance: ${transitionRemembrance.length} passed`);

  const transitionCommemoration = runAgent08TransitionCommemorationSelfTests();
  const failedCommemoration = transitionCommemoration.filter(t => !t.passed);
  if (failedCommemoration.length) {
    console.error('Agent 08 transition commemoration tests failed:', failedCommemoration);
    process.exit(1);
  }
  console.log(`Agent 08 transition commemoration: ${transitionCommemoration.length} passed`);

  const transitionVeneration = runAgent08TransitionVenerationSelfTests();
  const failedVeneration = transitionVeneration.filter(t => !t.passed);
  if (failedVeneration.length) {
    console.error('Agent 08 transition veneration tests failed:', failedVeneration);
    process.exit(1);
  }
  console.log(`Agent 08 transition veneration: ${transitionVeneration.length} passed`);

  const transitionEnshrinement = runAgent08TransitionEnshrinementSelfTests();
  const failedEnshrinement = transitionEnshrinement.filter(t => !t.passed);
  if (failedEnshrinement.length) {
    console.error('Agent 08 transition enshrinement tests failed:', failedEnshrinement);
    process.exit(1);
  }
  console.log(`Agent 08 transition enshrinement: ${transitionEnshrinement.length} passed`);

  const transitionImmortalization = runAgent08TransitionImmortalizationSelfTests();
  const failedImmortalization = transitionImmortalization.filter(t => !t.passed);
  if (failedImmortalization.length) {
    console.error('Agent 08 transition immortalization tests failed:', failedImmortalization);
    process.exit(1);
  }
  console.log(`Agent 08 transition immortalization: ${transitionImmortalization.length} passed`);

  const moduleTests = runAgent08ModuleSelfTests();
  const failed = moduleTests.filter(t => !t.passed);
  if (failed.length) {
    console.error('Agent 08 module smoke tests failed:', failed);
    process.exit(1);
  }
  console.log(`Agent 08 module smoke: ${moduleTests.length} passed`);
}

main();
