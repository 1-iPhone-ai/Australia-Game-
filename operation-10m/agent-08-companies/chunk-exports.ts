/** Assembly-facing self-test entry (inlined in chunk.tsx). */
export function runAgent08ModuleSelfTests(): Array<{ id: string; name?: string; passed: boolean; detail: string }> {
  const core = runV1014_PRIVATE_PrivateSectorSelfTests().map(t => ({
    id: t.id,
    name: t.name,
    passed: t.passed,
    detail: t.detail,
  }));
  const taxLabor = runAgent08TaxLaborSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const supply = runAgent08SupplyChainSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const sector = runAgent08SectorDepthSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const cascade = runAgent08CascadeSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const integrated = runAgent08IntegratedSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const recovery = runAgent08RecoverySelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const stabilization = runAgent08StabilizationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const mandate = runAgent08MandateSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const compliance = runAgent08ComplianceSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const remediation = runAgent08RemediationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const execution = runAgent08ExecutionSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const utilizationDepth = runAgent08UtilizationDepthSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const reconciliation = runAgent08ReconciliationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const operatingPriority = runAgent08OperatingPrioritySelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const operatingDigest = runAgent08OperatingDigestSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const readinessPortfolio = runAgent08ReadinessPortfolioSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionHorizon = runAgent08TransitionHorizonSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionCommitment = runAgent08TransitionCommitmentSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionMobilization = runAgent08TransitionMobilizationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionDeployment = runAgent08TransitionDeploymentSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionValidation = runAgent08TransitionValidationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionConsolidation = runAgent08TransitionConsolidationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionSustainment = runAgent08TransitionSustainmentSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionResilience = runAgent08TransitionResilienceSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  return [
    ...core.slice(0, 5),
    ...taxLabor,
    ...supply,
    ...sector,
    ...cascade,
    ...integrated,
    ...recovery,
    ...stabilization,
    ...mandate,
    ...compliance,
    ...remediation,
    ...execution,
    ...utilizationDepth,
    ...reconciliation,
    ...operatingPriority,
    ...operatingDigest,
    ...readinessPortfolio,
    ...transitionHorizon,
    ...transitionCommitment,
    ...transitionMobilization,
    ...transitionDeployment,
    ...transitionValidation,
    ...transitionConsolidation,
    ...transitionSustainment,
    ...transitionResilience,
  ];
}
