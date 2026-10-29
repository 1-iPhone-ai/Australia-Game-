import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseTotalSingularityVertexRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidCompleteErosionTerminalityBand,
  OP10M_A11_VoidCompleteErosionTerminalityRow,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTerminalErosionCascadeRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function terminalityBand(score: number): OP10M_A11_VoidCompleteErosionTerminalityBand {
  if (score < 16) return 'inactive';
  if (score < 32) return 'completing';
  if (score < 49) return 'terminal';
  return 'total_terminality';
}

export function op10mA11ComputeInterregionalVoidCompleteErosionTerminality(args: {
  voidTerminalErosionCascade: OP10M_A11_VoidTerminalErosionCascadeRow[];
  collapseTotalSingularityVertex: OP10M_A11_CollapseTotalSingularityVertexRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidCompleteErosionTerminalityRow[]; nationalIndex: number } {
  const cascadeByRegion = new Map(args.voidTerminalErosionCascade.map((c) => [c.regionId, c]));
  const vertexByRegion = new Map(args.collapseTotalSingularityVertex.map((v) => [v.regionId, v]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidCompleteErosionTerminalityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const cascade = cascadeByRegion.get(rid);
    const vertex = vertexByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const cascadeDrag = cascade ? op10mA11Clamp(cascade.cascadeScore * 0.52) : 14;
    const vertexDrag = vertex ? op10mA11Clamp(vertex.vertexScore * 0.48) : 12;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.45) : 11;

    const terminalityScore = op10mA11Clamp(cascadeDrag + vertexDrag + frontDrag * 0.55);
    weighted += terminalityScore;

    const phases: string[] = [];
    if (cascade && (cascade.band === 'cascade' || cascade.band === 'total_erosion')) {
      phases.push('cascade terminal');
    }
    if (vertex && (vertex.band === 'total' || vertex.band === 'vertex')) {
      phases.push('vertex terminal');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front terminal');
    }
    if (!phases.length) phases.push('terminality inactive');

    rows.push({
      regionId: rid,
      terminalityScore: op10mA11Round(terminalityScore),
      band: terminalityBand(terminalityScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void complete erosion terminality ${terminalityBand(terminalityScore)} (${op10mA11Round(terminalityScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.terminalityScore - a.terminalityScore), nationalIndex };
}

export function op10mA11RegionsWithCompleteErosionTerminality(
  rows: OP10M_A11_VoidCompleteErosionTerminalityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'terminal' || r.band === 'total_terminality').map((r) => r.regionId);
}

export function op10mA11VoidCompleteErosionTerminalityEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}
