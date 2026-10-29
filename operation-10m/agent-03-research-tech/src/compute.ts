import { RESEARCH_BRANCHES, RESEARCH_BRANCH_NODES, RESEARCH_NODE_BY_ID } from './branches.ts';
import { computeRegionalDiffusion, pickLeadingResearchRegion } from './diffusion.ts';
import { computeInstitutionUpgrades, institutionUpgradesById, INSTITUTION_UPGRADE_TIER_RANK } from './institution-upgrades.ts';
import { applyLateGameDiffusionCascade } from './late-game-diffusion.ts';
import {
  applyScaleWaveReadinessBonus,
  computeResearchScaleWaveReport,
  scaleWaveDiffusionBonus,
} from './scale-wave.ts';
import {
  applyCommercializationReadinessNudge,
  computeResearchCommercializationReport,
} from './commercialization-bridge.ts';
import {
  applyPortfolioBalanceReadinessNudge,
  computeResearchPortfolioBalanceReport,
} from './portfolio-advisor.ts';
import { projectResearchDiffusionHorizon } from './diffusion-forecast.ts';
import { computeResearchSynergyOutlook } from './synergy-outlook.ts';
import { computeResearchIntegrationRiskOutlook } from './integration-risk-outlook.ts';
import { computeResearchAdoptionHorizonOutlook } from './adoption-horizon-outlook.ts';
import { computeResearchPortfolioStabilizationOutlook } from './portfolio-stabilization-outlook.ts';
import { computeResearchExportContinuityOutlook } from './export-continuity-outlook.ts';
import { computeResearchNationalCoherenceOutlook } from './national-coherence-outlook.ts';
import { computeResearchStrategicAlignmentOutlook } from './strategic-alignment-outlook.ts';
import { computeResearchHorizonConvergenceOutlook } from './horizon-convergence-outlook.ts';
import { computeResearchExecutionOutlook } from './research-execution-outlook.ts';
import { computeResearchStrategicDeliveryOutlook } from './strategic-delivery-outlook.ts';
import { computeResearchScaleWaveMaturityOutlook } from './scale-wave-maturity-outlook.ts';
import { computeResearchNationalIntegrationOutlook } from './national-integration-outlook.ts';
import { computeResearchScaleWaveProjectionOutlook } from './scale-wave-projection-outlook.ts';
import { computeResearchTrancheProjectionReadinessOutlook } from './tranche-projection-readiness-outlook.ts';
import { computeResearchScaleWaveIntegrationGateOutlook } from './scale-wave-integration-gate-outlook.ts';
import { computeResearchTrancheDryRunHandoffOutlook } from './tranche-dry-run-handoff-outlook.ts';
import { computeResearchMergedIntegrationBaselineOutlook } from './merged-integration-baseline-outlook.ts';
import { computeResearchScaleWavePostIntegrationDryRunOutlook } from './scale-wave-post-integration-dry-run-outlook.ts';
import { computeResearchScaleWaveIntegrationSealOutlook } from './scale-wave-integration-seal-outlook.ts';
import { computeResearchScaleWavePostSealHandoffOutlook } from './scale-wave-post-seal-handoff-outlook.ts';
import { computeResearchScaleWaveIntegrationContinuityOutlook } from './scale-wave-integration-continuity-outlook.ts';
import { computeResearchScaleWaveContinuityHandoffOutlook } from './scale-wave-continuity-handoff-outlook.ts';
import { computeResearchScaleWaveHandoffIntegrationOutlook } from './scale-wave-handoff-integration-outlook.ts';
import { computeResearchScaleWaveHandoffIntegrationSealOutlook } from './scale-wave-handoff-integration-seal-outlook.ts';
import { computeResearchScaleWaveIntegrationSealHandoffOutlook } from './scale-wave-integration-seal-handoff-outlook.ts';
import { computeResearchScaleWaveSealHandoffContinuityOutlook } from './scale-wave-seal-handoff-continuity-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationOutlook } from './scale-wave-seal-handoff-integration-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealOutlook } from './scale-wave-seal-handoff-integration-seal-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-outlook.ts';
import { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-outlook.ts';
import { branchNodeTopologicalOrder, evaluateNodePrerequisites } from './prerequisites.ts';
import { resolveActiveStrategyHooks, STRATEGY_HOOK_BY_ID } from './strategy-hooks.ts';
import {
  applyBranchEmphasisReadinessBonus,
  defaultBranchEmphasis,
  emptyResearchProgressCore,
  extractPersistedCore,
  mergeComputedResearchState,
  prepareResearchProgressForSave,
  sanitizeResearchProgressPersisted,
} from './save-migration.ts';
import { sealResearchProgressForSave } from './save-lifecycle.ts';
import { RESEARCH_INSTITUTIONS } from './institutions.ts';
import { RESEARCH_PROGRESS_SCHEMA_VERSION } from './types.ts';
import type {
  InstitutionUpgradeState,
  ResearchBranchId,
  ResearchProgressInputs,
  ResearchProgressState,
  UnlockedResearchNode,
} from './types.ts';
import { V94_REGION_CODES } from './v94-ids.ts';

export function researchInputHash(inputs: ResearchProgressInputs): string {
  let h = 2166136261 >>> 0;
  const mix = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
  };
  mix(`t${inputs.turn}`);
  inputs.regions.forEach(r => {
    mix(r.code);
    Object.keys(r.sectors)
      .sort()
      .forEach(k => mix(`${k}:${Math.round(Number(r.sectors[k as keyof typeof r.sectors] ?? 0) / 5)}`));
  });
  Object.keys(inputs.capabilities)
    .sort()
    .forEach(k => {
      const c = inputs.capabilities[k as keyof typeof inputs.capabilities];
      if (c) mix(`cap:${k}:${c.maturity}:${c.activeRegionIds.join(',')}`);
    });
  inputs.projects.forEach(p => mix(`${p.id}:${p.status}:${p.projectType}`));
  inputs.completedContracts.forEach(c => mix(`cc:${c.contractType}`));
  Object.keys(inputs.megaprojects)
    .sort()
    .forEach(k => {
      const m = inputs.megaprojects[k as keyof typeof inputs.megaprojects];
      if (m) mix(`mp:${k}:${m.completedStages}:${m.status}`);
    });
  Object.keys(inputs.factionStanding)
    .sort()
    .forEach(k => mix(`fs:${k}:${inputs.factionStanding[k as keyof typeof inputs.factionStanding]}`));
  return h.toString(36);
}

function computeBranchReadiness(
  inputs: ResearchProgressInputs,
  branchId: ResearchBranchId,
  institutionUpgrades: InstitutionUpgradeState[]
): number {
  const upgrades = institutionUpgradesById(institutionUpgrades);
  const branch = RESEARCH_BRANCHES.find(b => b.id === branchId);
  if (!branch) return 0;

  let score = 0;
  for (const anchor of branch.anchorRegions) {
    const region = inputs.regions.find(r => r.code === anchor);
    if (!region) continue;
    for (const sec of branch.sectors) {
      score += Number(region.sectors[sec] ?? 0) * 0.15;
    }
  }

  const cap = inputs.capabilities[branch.primaryCapability];
  if (cap) {
    score += { unavailable: 0, emerging: 12, demonstrated: 22, operational: 32, scaled: 42, nationally_integrated: 52 }[
      cap.maturity
    ];
  }

  for (const inst of RESEARCH_INSTITUTIONS) {
    if (!inst.supportedBranches.includes(branchId)) continue;
    const standing = inputs.factionStanding[inst.id as keyof typeof inputs.factionStanding] ?? 0;
    const upgrade = upgrades[inst.id];
    if (standing >= inst.minStanding) {
      score += inst.readinessBonus * (upgrade?.readinessMultiplier ?? 1);
    }
  }

  return Math.round(Math.min(100, score));
}

function inferAnchorRegion(inputs: ResearchProgressInputs, branchId: ResearchBranchId): string | null {
  const branch = RESEARCH_BRANCHES.find(b => b.id === branchId);
  if (!branch) return null;
  let best: { code: string; score: number } | null = null;
  for (const code of branch.anchorRegions) {
    const region = inputs.regions.find(r => r.code === code);
    if (!region) continue;
    let s = 0;
    branch.sectors.forEach(sec => {
      s += Number(region.sectors[sec] ?? 0);
    });
    if (!best || s > best.score) best = { code, score: s };
  }
  return best?.code ?? branch.anchorRegions[0] ?? null;
}

export function createEmptyResearchProgressState(turn = 0): ResearchProgressState {
  const readinessByBranch = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<
    ResearchBranchId,
    number
  >;
  return {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: 0,
    turn,
    unlockedNodes: [],
    diffusion: V94_REGION_CODES.map(regionId => ({
      regionId,
      score: 0,
      level: 'latent',
      sourceNodeIds: [],
    })),
    readinessByBranch,
    activeHookIds: [],
    leadingResearchRegion: null,
    inputHash: '',
    institutionUpgrades: [],
    lateGameDiffusion: null,
    scaleWave: null,
    unlockSeq: 0,
    branchEmphasis: defaultBranchEmphasis(),
    emphasisRevision: 0,
    migrationLog: [],
    saveKind: 'manual',
    updatedAtTurn: turn,
    sessionId: `o10m_r03_${turn}_0`,
    persistRevision: 0,
    unlockEventLog: [],
    lastReconciledAtTurn: turn,
    emphasisChangeLog: [],
    institutionTierSnapshot: null,
  };
}

export function computeResearchProgress(
  inputs: ResearchProgressInputs,
  previous: ResearchProgressState | null
): ResearchProgressState {
  const coreBase = previous ? extractPersistedCore(previous) : emptyResearchProgressCore(inputs.turn);
  const unlockedMap = new Map<string, UnlockedResearchNode>();
  (previous?.unlockedNodes ?? []).forEach(u => unlockedMap.set(u.nodeId, u));

  const unlockedIds = () => new Set(unlockedMap.keys());

  for (const branch of RESEARCH_BRANCHES) {
    const order = branchNodeTopologicalOrder(branch.id);
    for (const nodeId of order) {
      if (unlockedMap.has(nodeId)) continue;
      const evalResult = evaluateNodePrerequisites(inputs, nodeId, unlockedIds());
      if (!evalResult.satisfied) continue;
      const def = RESEARCH_NODE_BY_ID[nodeId];
      unlockedMap.set(nodeId, {
        nodeId,
        branchId: def.branchId,
        unlockedTurn: inputs.turn,
        anchorRegionId: inferAnchorRegion(inputs, def.branchId) as UnlockedResearchNode['anchorRegionId'],
      });
    }
  }

  const unlockedNodes = [...unlockedMap.values()].sort((a, b) =>
    a.unlockedTurn !== b.unlockedTurn ? a.unlockedTurn - b.unlockedTurn : a.nodeId.localeCompare(b.nodeId)
  );

  const institutionUpgrades = mergeMonotonicInstitutionUpgrades(
    computeInstitutionUpgrades(inputs, unlockedNodes),
    previous?.institutionUpgrades ?? []
  );

  const baseDiffusion = computeRegionalDiffusion(inputs, unlockedNodes, institutionUpgrades);
  const { cells: diffusionRaw, report: lateGameDiffusion } = applyLateGameDiffusionCascade(
    baseDiffusion,
    unlockedNodes,
    institutionUpgrades
  );

  const scaleWave = computeResearchScaleWaveReport(inputs, unlockedNodes);
  const swBonus = scaleWaveDiffusionBonus(scaleWave);
  const diffusion = diffusionRaw.map(cell => ({
    ...cell,
    score: Math.min(0.85, Math.round((cell.score + swBonus) * 1000) / 1000),
  }));

  const hooks = resolveActiveStrategyHooks(new Set(unlockedNodes.map(u => u.nodeId)));

  let readinessByBranch = Object.fromEntries(
    RESEARCH_BRANCHES.map(b => [b.id, computeBranchReadiness(inputs, b.id, institutionUpgrades)])
  ) as Record<ResearchBranchId, number>;
  readinessByBranch = applyScaleWaveReadinessBonus(readinessByBranch, scaleWave);
  readinessByBranch = applyBranchEmphasisReadinessBonus(readinessByBranch, coreBase.branchEmphasis);

  const commercialization = computeResearchCommercializationReport(inputs, {
    unlockedNodes,
    readinessByBranch,
    branchEmphasis: coreBase.branchEmphasis,
    scaleWave,
  });
  readinessByBranch = applyCommercializationReadinessNudge(readinessByBranch, commercialization);

  const portfolioBalance = computeResearchPortfolioBalanceReport({
    unlockedNodes,
    readinessByBranch,
    branchEmphasis: coreBase.branchEmphasis,
    scaleWave,
  });
  readinessByBranch = applyPortfolioBalanceReadinessNudge(readinessByBranch, portfolioBalance);

  const diffusionForecast = projectResearchDiffusionHorizon(inputs, {
    diffusion,
    unlockedNodes,
    institutionUpgrades,
  });

  const synergyOutlook = computeResearchSynergyOutlook(inputs, {
    unlockedNodes,
    readinessByBranch,
    scaleWave,
    portfolioBalance,
  });

  const integrationRiskOutlook = computeResearchIntegrationRiskOutlook(inputs, {
    readinessByBranch,
    institutionUpgrades,
    portfolioBalance,
    institutionTierSnapshot: coreBase.institutionTierSnapshot ?? null,
  });

  const adoptionHorizonOutlook = computeResearchAdoptionHorizonOutlook(inputs, {
    diffusionForecast,
    scaleWave,
    synergyOutlook,
    diffusion,
    integrationRiskOutlook,
  });

  const portfolioStabilizationOutlook = computeResearchPortfolioStabilizationOutlook(inputs, {
    portfolioBalance,
    synergyOutlook,
    integrationRiskOutlook,
    adoptionHorizonOutlook,
    synergySnapshot: coreBase.synergySnapshot ?? null,
  });

  const exportContinuityOutlook = computeResearchExportContinuityOutlook(inputs, {
    commercialization,
    portfolioStabilizationOutlook,
    adoptionHorizonOutlook,
    commercializationSnapshot: coreBase.commercializationSnapshot ?? null,
  });

  const nationalCoherenceOutlook = computeResearchNationalCoherenceOutlook(inputs, {
    diffusion,
    diffusionForecast,
    exportContinuityOutlook,
    integrationRiskOutlook,
    diffusionIntegrationSnapshot: coreBase.diffusionIntegrationSnapshot ?? null,
  });

  const strategicAlignmentOutlook = computeResearchStrategicAlignmentOutlook(inputs, {
    portfolioBalance,
    nationalCoherenceOutlook,
    synergyOutlook,
    portfolioBalanceSnapshot: coreBase.portfolioBalanceSnapshot ?? null,
    branchEmphasis: coreBase.branchEmphasis,
  });

  const horizonConvergenceOutlook = computeResearchHorizonConvergenceOutlook(inputs, {
    diffusionForecast,
    strategicAlignmentOutlook,
    nationalCoherenceOutlook,
    diffusionForecastSnapshot: coreBase.diffusionForecastSnapshot ?? null,
  });

  const researchExecutionOutlook = computeResearchExecutionOutlook(inputs, {
    horizonConvergenceOutlook,
    strategicAlignmentOutlook,
    integrationRiskOutlook,
    horizonConvergenceSnapshot: coreBase.horizonConvergenceSnapshot ?? null,
  });

  const strategicDeliveryOutlook = computeResearchStrategicDeliveryOutlook(inputs, {
    researchExecutionOutlook,
    exportContinuityOutlook,
    adoptionHorizonOutlook,
    researchExecutionSnapshot: coreBase.researchExecutionSnapshot ?? null,
  });

  const scaleWaveMaturityOutlook = computeResearchScaleWaveMaturityOutlook(inputs, {
    strategicDeliveryOutlook,
    scaleWave,
    strategicDeliverySnapshot: coreBase.strategicDeliverySnapshot ?? null,
    unlockedNodes,
  });

  const nationalIntegrationOutlook = computeResearchNationalIntegrationOutlook(inputs, {
    scaleWaveMaturityOutlook,
    institutionTierSnapshot: coreBase.institutionTierSnapshot ?? null,
    lateGameDiffusion,
    scaleWaveMaturitySnapshot: coreBase.scaleWaveMaturitySnapshot ?? null,
  });

  const scaleWaveProjectionOutlook = computeResearchScaleWaveProjectionOutlook(inputs, {
    nationalIntegrationOutlook,
    scaleWaveMaturityOutlook,
    nationalIntegrationSnapshot: coreBase.nationalIntegrationSnapshot ?? null,
    scaleWaveMaturitySnapshot: coreBase.scaleWaveMaturitySnapshot ?? null,
  });

  const trancheProjectionReadinessOutlook = computeResearchTrancheProjectionReadinessOutlook(inputs, {
    scaleWaveProjectionOutlook,
    nationalIntegrationOutlook,
    scaleWaveProjectionSnapshot: coreBase.scaleWaveProjectionSnapshot ?? null,
    nationalIntegrationSnapshot: coreBase.nationalIntegrationSnapshot ?? null,
  });

  const scaleWaveIntegrationGateOutlook = computeResearchScaleWaveIntegrationGateOutlook(inputs, {
    trancheProjectionReadinessOutlook,
    scaleWaveProjectionOutlook,
    trancheProjectionSnapshot: coreBase.trancheProjectionSnapshot ?? null,
    scaleWaveProjectionSnapshot: coreBase.scaleWaveProjectionSnapshot ?? null,
  });

  const trancheDryRunHandoffOutlook = computeResearchTrancheDryRunHandoffOutlook(inputs, {
    scaleWaveIntegrationGateOutlook,
    trancheProjectionReadinessOutlook,
    integrationGateSnapshot: coreBase.integrationGateSnapshot ?? null,
    trancheProjectionSnapshot: coreBase.trancheProjectionSnapshot ?? null,
  });

  const mergedIntegrationBaselineOutlook = computeResearchMergedIntegrationBaselineOutlook(inputs, {
    trancheDryRunHandoffOutlook,
    scaleWaveIntegrationGateOutlook,
    dryRunHandoffSnapshot: coreBase.dryRunHandoffSnapshot ?? null,
    integrationGateSnapshot: coreBase.integrationGateSnapshot ?? null,
  });

  const scaleWavePostIntegrationDryRunOutlook =
    computeResearchScaleWavePostIntegrationDryRunOutlook(inputs, {
      mergedIntegrationBaselineOutlook,
      trancheDryRunHandoffOutlook,
      mergedIntegrationBaselineSnapshot: coreBase.mergedIntegrationBaselineSnapshot ?? null,
      dryRunHandoffSnapshot: coreBase.dryRunHandoffSnapshot ?? null,
    });

  const scaleWaveIntegrationSealOutlook = computeResearchScaleWaveIntegrationSealOutlook(inputs, {
    scaleWavePostIntegrationDryRunOutlook,
    mergedIntegrationBaselineOutlook,
    postIntegrationDryRunSnapshot: coreBase.postIntegrationDryRunSnapshot ?? null,
    mergedIntegrationBaselineSnapshot: coreBase.mergedIntegrationBaselineSnapshot ?? null,
  });

  const scaleWavePostSealHandoffOutlook = computeResearchScaleWavePostSealHandoffOutlook(inputs, {
    scaleWaveIntegrationSealOutlook,
    scaleWavePostIntegrationDryRunOutlook,
    integrationSealSnapshot: coreBase.integrationSealSnapshot ?? null,
    postIntegrationDryRunSnapshot: coreBase.postIntegrationDryRunSnapshot ?? null,
  });

  const scaleWaveIntegrationContinuityOutlook = computeResearchScaleWaveIntegrationContinuityOutlook(
    inputs,
    {
      scaleWavePostSealHandoffOutlook,
      scaleWaveIntegrationSealOutlook,
      postSealHandoffSnapshot: coreBase.postSealHandoffSnapshot ?? null,
      integrationSealSnapshot: coreBase.integrationSealSnapshot ?? null,
    }
  );

  const scaleWaveContinuityHandoffOutlook = computeResearchScaleWaveContinuityHandoffOutlook(inputs, {
    scaleWaveIntegrationContinuityOutlook,
    scaleWavePostSealHandoffOutlook,
    integrationContinuitySnapshot: coreBase.integrationContinuitySnapshot ?? null,
    postSealHandoffSnapshot: coreBase.postSealHandoffSnapshot ?? null,
  });

  const scaleWaveHandoffIntegrationOutlook = computeResearchScaleWaveHandoffIntegrationOutlook(inputs, {
    scaleWaveContinuityHandoffOutlook,
    scaleWaveIntegrationContinuityOutlook,
    continuityHandoffSnapshot: coreBase.continuityHandoffSnapshot ?? null,
    integrationContinuitySnapshot: coreBase.integrationContinuitySnapshot ?? null,
  });

  const scaleWaveHandoffIntegrationSealOutlook = computeResearchScaleWaveHandoffIntegrationSealOutlook(inputs, {
    scaleWaveHandoffIntegrationOutlook,
    scaleWaveContinuityHandoffOutlook,
    handoffIntegrationSnapshot: coreBase.handoffIntegrationSnapshot ?? null,
    continuityHandoffSnapshot: coreBase.continuityHandoffSnapshot ?? null,
  });

  const scaleWaveIntegrationSealHandoffOutlook = computeResearchScaleWaveIntegrationSealHandoffOutlook(inputs, {
    scaleWaveHandoffIntegrationSealOutlook,
    scaleWaveHandoffIntegrationOutlook,
    handoffIntegrationSealSnapshot: coreBase.handoffIntegrationSealSnapshot ?? null,
    handoffIntegrationSnapshot: coreBase.handoffIntegrationSnapshot ?? null,
  });

  const scaleWaveSealHandoffContinuityOutlook = computeResearchScaleWaveSealHandoffContinuityOutlook(inputs, {
    scaleWaveIntegrationSealHandoffOutlook,
    scaleWaveHandoffIntegrationSealOutlook,
    integrationSealHandoffSnapshot: coreBase.integrationSealHandoffSnapshot ?? null,
    handoffIntegrationSealSnapshot: coreBase.handoffIntegrationSealSnapshot ?? null,
  });

  const scaleWaveSealHandoffIntegrationOutlook = computeResearchScaleWaveSealHandoffIntegrationOutlook(inputs, {
    scaleWaveSealHandoffContinuityOutlook,
    scaleWaveIntegrationSealHandoffOutlook,
    sealHandoffContinuitySnapshot: coreBase.sealHandoffContinuitySnapshot ?? null,
    integrationSealHandoffSnapshot: coreBase.integrationSealHandoffSnapshot ?? null,
  });

  const scaleWaveSealHandoffIntegrationSealOutlook = computeResearchScaleWaveSealHandoffIntegrationSealOutlook(
    inputs,
    {
      scaleWaveSealHandoffIntegrationOutlook,
      scaleWaveSealHandoffContinuityOutlook,
      sealHandoffIntegrationSnapshot: coreBase.sealHandoffIntegrationSnapshot ?? null,
      sealHandoffContinuitySnapshot: coreBase.sealHandoffContinuitySnapshot ?? null,
    }
  );

  const scaleWaveSealHandoffIntegrationSealContinuityOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealOutlook,
      scaleWaveSealHandoffIntegrationOutlook,
      sealHandoffIntegrationSealSnapshot: coreBase.sealHandoffIntegrationSealSnapshot ?? null,
      sealHandoffIntegrationSnapshot: coreBase.sealHandoffIntegrationSnapshot ?? null,
    });

  const scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityOutlook,
      scaleWaveSealHandoffIntegrationSealOutlook,
      sealHandoffIntegrationSealContinuitySnapshot:
        coreBase.sealHandoffIntegrationSealContinuitySnapshot ?? null,
      sealHandoffIntegrationSealSnapshot: coreBase.sealHandoffIntegrationSealSnapshot ?? null,
    });

  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityOutlook,
      sealHandoffIntegrationSealContinuityHandoffSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
      sealHandoffIntegrationSealContinuitySnapshot:
        coreBase.sealHandoffIntegrationSealContinuitySnapshot ?? null,
    });

  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
      sealHandoffIntegrationSealContinuityHandoffSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
    });

  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
    });

  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot ?? null,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
    });

  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot ?? null,
    });

  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
    });

  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
    });

  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot ?? null,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
    });

  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot ?? null,
    });


  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
    });

  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
    });

  const computed: ResearchProgressState = {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: coreBase.revision,
    turn: inputs.turn,
    unlockedNodes,
    diffusion,
    readinessByBranch,
    activeHookIds: hooks.map(h => h.id),
    leadingResearchRegion: pickLeadingResearchRegion(diffusion),
    inputHash: researchInputHash(inputs),
    institutionUpgrades,
    lateGameDiffusion,
    scaleWave,
    commercialization,
    portfolioBalance,
    diffusionForecast,
    synergyOutlook,
    integrationRiskOutlook,
    adoptionHorizonOutlook,
    portfolioStabilizationOutlook,
    exportContinuityOutlook,
    nationalCoherenceOutlook,
    strategicAlignmentOutlook,
    horizonConvergenceOutlook,
    researchExecutionOutlook,
    strategicDeliveryOutlook,
    scaleWaveMaturityOutlook,
    nationalIntegrationOutlook,
    scaleWaveProjectionOutlook,
    trancheProjectionReadinessOutlook,
    scaleWaveIntegrationGateOutlook,
    trancheDryRunHandoffOutlook,
    mergedIntegrationBaselineOutlook,
    scaleWavePostIntegrationDryRunOutlook,
    scaleWaveIntegrationSealOutlook,
    scaleWavePostSealHandoffOutlook,
    scaleWaveIntegrationContinuityOutlook,
    scaleWaveContinuityHandoffOutlook,
    scaleWaveHandoffIntegrationOutlook,
    scaleWaveHandoffIntegrationSealOutlook,
    scaleWaveIntegrationSealHandoffOutlook,
    scaleWaveSealHandoffContinuityOutlook,
    scaleWaveSealHandoffIntegrationOutlook,
    scaleWaveSealHandoffIntegrationSealOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook,
    unlockSeq: coreBase.unlockSeq,
    branchEmphasis: coreBase.branchEmphasis,
  };

  return mergeComputedResearchState(coreBase, computed);
}

export function computeResearchProgressFromSave(
  inputs: ResearchProgressInputs,
  persistedRaw: unknown
): ResearchProgressState {
  const hydrated = sanitizeResearchProgressPersisted(persistedRaw);
  return computeResearchProgress(inputs, hydrated);
}

export function applyResearchProgressSavePipeline(
  inputs: ResearchProgressInputs,
  persistedRaw: unknown
): { state: ResearchProgressState; persist: ReturnType<typeof prepareResearchProgressForSave> } {
  const state = computeResearchProgressFromSave(inputs, persistedRaw);
  const persist = sealResearchProgressForSave(prepareResearchProgressForSave(state), {
    turn: inputs.turn,
    saveKind: state.saveKind,
    sessionId: state.sessionId,
  });
  return { state: { ...state, persistRevision: persist.persistRevision, saveKind: persist.saveKind }, persist };
}

function mergeMonotonicInstitutionUpgrades(
  next: InstitutionUpgradeState[],
  prev: InstitutionUpgradeState[]
): InstitutionUpgradeState[] {
  const prevById = institutionUpgradesById(prev);
  return next.map(u => {
    const old = prevById[u.institutionId];
    if (!old) return u;
    return INSTITUTION_UPGRADE_TIER_RANK[old.tier] > INSTITUTION_UPGRADE_TIER_RANK[u.tier] ? old : u;
  });
}

/** Integration adapter: map V10.5 innovation snapshot fields into Agent 03 inputs (pure). */
export function buildResearchProgressInputs(src: {
  turn: number;
  regions: ResearchProgressInputs['regions'];
  innovationCapabilities?: ResearchProgressInputs['capabilities'];
  projects: ResearchProgressInputs['projects'];
  completedContracts: ResearchProgressInputs['completedContracts'];
  megaprojects: ResearchProgressInputs['megaprojects'];
  factionStanding: ResearchProgressInputs['factionStanding'];
}): ResearchProgressInputs {
  return {
    turn: src.turn,
    regions: src.regions,
    capabilities: src.innovationCapabilities ?? {},
    projects: src.projects,
    completedContracts: src.completedContracts,
    megaprojects: src.megaprojects,
    factionStanding: src.factionStanding,
  };
}

export function getStrategyHooksForState(state: ResearchProgressState) {
  return state.activeHookIds.map(id => STRATEGY_HOOK_BY_ID[id]).filter(Boolean);
}

export const AGENT03_CATALOG = {
  branches: RESEARCH_BRANCHES,
  nodes: RESEARCH_BRANCH_NODES,
  institutions: RESEARCH_INSTITUTIONS,
};
