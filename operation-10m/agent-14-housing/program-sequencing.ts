import { AGENT14_HOUSING_PROGRAM_STUBS, AGENT14_HOUSING_REGION_BASELINE, type Agent14CoreRegion } from './constants.ts';
import { canAcceptSpendingCommitment } from './public-service-capacity.ts';
import { commitmentFromProgramStub } from './scenario-sweep.ts';
import type {
  NationalHousingWellbeingSnapshot,
  NationalServiceAccessLens,
  ProgramSequencingRecommendation,
  PublicServiceCapacitySnapshot,
  PublicServicePillar,
} from './types.ts';

export function recommendAgent14ProgramSequence(
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  housing: NationalHousingWellbeingSnapshot,
  access: NationalServiceAccessLens,
  limit = 5
): ProgramSequencingRecommendation[] {
  const recs: ProgramSequencingRecommendation[] = [];
  const worstRegions = Object.values(housing.regions)
    .sort((a, b) => a.affordabilityIndex - b.affordabilityIndex)
    .slice(0, 4)
    .map((r) => r.regionId);

  const pillarPriority: PublicServicePillar[] =
    access.pillarNational.healthcare.band === 'critical' || access.pillarNational.healthcare.band === 'weak'
      ? ['healthcare', 'housing', 'education']
      : access.pillarNational.education.band === 'critical' || access.pillarNational.education.band === 'weak'
        ? ['education', 'housing', 'healthcare']
        : ['housing', 'healthcare', 'education'];

  let rank = 1;
  for (const regionId of worstRegions) {
    for (const pillar of pillarPriority) {
      const stub = AGENT14_HOUSING_PROGRAM_STUBS.find(
        (p) => p.regionId === (regionId as Agent14CoreRegion) && pillar === 'housing'
      );
      if (!stub && pillar !== 'housing') continue;
      const programId =
        stub?.id ??
        `ps_seq_${regionId}_${pillar}_${turn}`;
      const commitment =
        commitmentFromProgramStub(stub?.id ?? AGENT14_HOUSING_PROGRAM_STUBS[0]!.id, turn, rank) ??
        null;
      const fitsCapacity = commitment
        ? canAcceptSpendingCommitment(capacity, commitment).allowed
        : false;
      recs.push({
        rank,
        programId,
        regionId,
        pillar,
        rationale:
          pillar === 'housing'
            ? `Backlog ${housing.regions[regionId]?.planningBacklogMonths ?? '?'}m in ${regionId}; affordability ${housing.regions[regionId]?.affordabilityIndex ?? '?'}`
            : `${pillar} national band ${access.pillarNational[pillar].band}; uplift ${regionId} composite ${access.regions[regionId]?.compositeIndex ?? '?'}`,
        expectedLagTurns: stub?.effectLagTurns ?? 2,
        fitsCapacity,
      });
      rank += 1;
      if (recs.length >= limit) return recs;
    }
  }

  for (const stub of AGENT14_HOUSING_PROGRAM_STUBS) {
    if (recs.some((r) => r.programId === stub.id)) continue;
    const baseline = AGENT14_HOUSING_REGION_BASELINE[stub.regionId];
    const commitment = commitmentFromProgramStub(stub.id, turn, rank)!;
    recs.push({
      rank,
      programId: stub.id,
      regionId: stub.regionId,
      pillar: 'housing',
      rationale: `Catalog stub; remote ${baseline.remoteShare} planning ${baseline.planningBacklogMonths}m`,
      expectedLagTurns: stub.effectLagTurns,
      fitsCapacity: canAcceptSpendingCommitment(capacity, commitment).allowed,
    });
    rank += 1;
    if (recs.length >= limit) break;
  }

  return recs;
}
