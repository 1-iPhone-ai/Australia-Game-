/** Agent 01 — technology / innovation contract slice. */

export type TechTrackId =
  | 'digital_infrastructure'
  | 'renewable_energy'
  | 'advanced_manufacturing'
  | 'biotech'
  | 'defence_dual_use';

export interface TechSnapshot {
  day: number;
  researchPoints: number;
  unlockedTracks: TechTrackId[];
  readinessByTrack: Record<TechTrackId, number>;
  innovationMomentum: number;
}

export interface TechPatch {
  researchDelta?: number;
  unlockTrack?: TechTrackId;
  readinessDelta?: Partial<Record<TechTrackId, number>>;
  momentumDelta?: number;
  ledgerNote?: string;
}

export interface TechContract {
  readonly moduleId: 'agent-01-tech';
  snapshot(): TechSnapshot;
  applyPatch(patch: TechPatch): TechSnapshot;
  meetsPrerequisite(track: TechTrackId, minReadiness: number): boolean;
}
