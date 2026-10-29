import { V1014_REPLAY_fingerprint } from './primitives';
import type { V1014ReplayPersistenceSlice } from './types';
import { V1014_REPLAY_SCHEMA_VERSION } from './types';

/** §6 persistence keys — register in save.meta.v1014 replay slice. */
export const V1014_REPLAY_SECTION6_KEY_ROOT = 'save.meta.v1014.replay_counterfactual';
export const V1014_REPLAY_SECTION6_KEYS = {
  schema: `${V1014_REPLAY_SECTION6_KEY_ROOT}.schemaVersion`,
  archiveRing: `${V1014_REPLAY_SECTION6_KEY_ROOT}.archiveRing`,
  activeBranch: `${V1014_REPLAY_SECTION6_KEY_ROOT}.activeBranch`,
  lastDiffReport: `${V1014_REPLAY_SECTION6_KEY_ROOT}.lastDiffReportId`,
  slotBindings: `${V1014_REPLAY_SECTION6_KEY_ROOT}.section6SlotBindings`,
  scrubberIndex: `${V1014_REPLAY_SECTION6_KEY_ROOT}.scrubberIndex`,
  forecastOverlay: `${V1014_REPLAY_SECTION6_KEY_ROOT}.forecastOverlay`,
  dashboardTiles: `${V1014_REPLAY_SECTION6_KEY_ROOT}.dashboardTiles`,
} as const;

export type V1014ReplaySection6SlotId =
  | 'quick_save' | 'slot_a' | 'slot_b' | 'slot_c' | 'slot_d'
  | 'replay_autosave' | 'counterfactual_sandbox';

export const V1014_REPLAY_SECTION6_SLOT_IDS: V1014ReplaySection6SlotId[] = [
  'quick_save', 'slot_a', 'slot_b', 'slot_c', 'slot_d',
  'replay_autosave', 'counterfactual_sandbox',
];

export interface V1014ReplaySection6MigrationStep {
  fromVersion: string;
  toVersion: string;
  migrate: (slice: Record<string, unknown>) => Record<string, unknown>;
}

export function V1014_REPLAY_migrateSection6Step1(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 1 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step1Fingerprint`] = V1014_REPLAY_fingerprint('migration_1', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step2(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 2 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step2Fingerprint`] = V1014_REPLAY_fingerprint('migration_2', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step3(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 3 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step3Fingerprint`] = V1014_REPLAY_fingerprint('migration_3', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step4(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 4 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step4Fingerprint`] = V1014_REPLAY_fingerprint('migration_4', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step5(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 5 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step5Fingerprint`] = V1014_REPLAY_fingerprint('migration_5', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step6(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 6 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step6Fingerprint`] = V1014_REPLAY_fingerprint('migration_6', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step7(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 7 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step7Fingerprint`] = V1014_REPLAY_fingerprint('migration_7', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step8(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 8 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step8Fingerprint`] = V1014_REPLAY_fingerprint('migration_8', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step9(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 9 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step9Fingerprint`] = V1014_REPLAY_fingerprint('migration_9', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step10(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 10 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step10Fingerprint`] = V1014_REPLAY_fingerprint('migration_10', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step11(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 11 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step11Fingerprint`] = V1014_REPLAY_fingerprint('migration_11', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step12(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 12 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step12Fingerprint`] = V1014_REPLAY_fingerprint('migration_12', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step13(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 13 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step13Fingerprint`] = V1014_REPLAY_fingerprint('migration_13', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step14(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 14 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step14Fingerprint`] = V1014_REPLAY_fingerprint('migration_14', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step15(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 15 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step15Fingerprint`] = V1014_REPLAY_fingerprint('migration_15', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step16(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 16 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step16Fingerprint`] = V1014_REPLAY_fingerprint('migration_16', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step17(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 17 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step17Fingerprint`] = V1014_REPLAY_fingerprint('migration_17', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step18(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 18 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step18Fingerprint`] = V1014_REPLAY_fingerprint('migration_18', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step19(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 19 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step19Fingerprint`] = V1014_REPLAY_fingerprint('migration_19', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step20(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 20 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step20Fingerprint`] = V1014_REPLAY_fingerprint('migration_20', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step21(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 21 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step21Fingerprint`] = V1014_REPLAY_fingerprint('migration_21', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step22(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 22 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step22Fingerprint`] = V1014_REPLAY_fingerprint('migration_22', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step23(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 23 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step23Fingerprint`] = V1014_REPLAY_fingerprint('migration_23', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step24(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 24 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step24Fingerprint`] = V1014_REPLAY_fingerprint('migration_24', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step25(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 25 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step25Fingerprint`] = V1014_REPLAY_fingerprint('migration_25', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step26(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 26 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step26Fingerprint`] = V1014_REPLAY_fingerprint('migration_26', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step27(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 27 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step27Fingerprint`] = V1014_REPLAY_fingerprint('migration_27', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step28(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 28 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step28Fingerprint`] = V1014_REPLAY_fingerprint('migration_28', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step29(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 29 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step29Fingerprint`] = V1014_REPLAY_fingerprint('migration_29', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step30(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 30 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step30Fingerprint`] = V1014_REPLAY_fingerprint('migration_30', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step31(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 31 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step31Fingerprint`] = V1014_REPLAY_fingerprint('migration_31', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step32(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 32 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step32Fingerprint`] = V1014_REPLAY_fingerprint('migration_32', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step33(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 33 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step33Fingerprint`] = V1014_REPLAY_fingerprint('migration_33', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step34(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 34 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step34Fingerprint`] = V1014_REPLAY_fingerprint('migration_34', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step35(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 35 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step35Fingerprint`] = V1014_REPLAY_fingerprint('migration_35', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step36(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 36 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step36Fingerprint`] = V1014_REPLAY_fingerprint('migration_36', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step37(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 37 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step37Fingerprint`] = V1014_REPLAY_fingerprint('migration_37', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step38(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 38 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step38Fingerprint`] = V1014_REPLAY_fingerprint('migration_38', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step39(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 39 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step39Fingerprint`] = V1014_REPLAY_fingerprint('migration_39', next);
  return next;
}

export function V1014_REPLAY_migrateSection6Step40(slice: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: 40 };
  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];
  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {
    next.section6SlotBindings = {};
  }
  next[`step40Fingerprint`] = V1014_REPLAY_fingerprint('migration_40', next);
  return next;
}

export const V1014_REPLAY_SECTION6_MIGRATIONS: V1014ReplaySection6MigrationStep[] = [
  { fromVersion: 'v1014.replay_counterfactual.0', toVersion: 'v1014.replay_counterfactual.1', migrate: V1014_REPLAY_migrateSection6Step1 },
  { fromVersion: 'v1014.replay_counterfactual.1', toVersion: 'v1014.replay_counterfactual.2', migrate: V1014_REPLAY_migrateSection6Step2 },
  { fromVersion: 'v1014.replay_counterfactual.2', toVersion: 'v1014.replay_counterfactual.3', migrate: V1014_REPLAY_migrateSection6Step3 },
  { fromVersion: 'v1014.replay_counterfactual.3', toVersion: 'v1014.replay_counterfactual.4', migrate: V1014_REPLAY_migrateSection6Step4 },
  { fromVersion: 'v1014.replay_counterfactual.4', toVersion: 'v1014.replay_counterfactual.5', migrate: V1014_REPLAY_migrateSection6Step5 },
  { fromVersion: 'v1014.replay_counterfactual.5', toVersion: 'v1014.replay_counterfactual.6', migrate: V1014_REPLAY_migrateSection6Step6 },
  { fromVersion: 'v1014.replay_counterfactual.6', toVersion: 'v1014.replay_counterfactual.7', migrate: V1014_REPLAY_migrateSection6Step7 },
  { fromVersion: 'v1014.replay_counterfactual.7', toVersion: 'v1014.replay_counterfactual.8', migrate: V1014_REPLAY_migrateSection6Step8 },
  { fromVersion: 'v1014.replay_counterfactual.8', toVersion: 'v1014.replay_counterfactual.9', migrate: V1014_REPLAY_migrateSection6Step9 },
  { fromVersion: 'v1014.replay_counterfactual.9', toVersion: 'v1014.replay_counterfactual.10', migrate: V1014_REPLAY_migrateSection6Step10 },
  { fromVersion: 'v1014.replay_counterfactual.10', toVersion: 'v1014.replay_counterfactual.11', migrate: V1014_REPLAY_migrateSection6Step11 },
  { fromVersion: 'v1014.replay_counterfactual.11', toVersion: 'v1014.replay_counterfactual.12', migrate: V1014_REPLAY_migrateSection6Step12 },
  { fromVersion: 'v1014.replay_counterfactual.12', toVersion: 'v1014.replay_counterfactual.13', migrate: V1014_REPLAY_migrateSection6Step13 },
  { fromVersion: 'v1014.replay_counterfactual.13', toVersion: 'v1014.replay_counterfactual.14', migrate: V1014_REPLAY_migrateSection6Step14 },
  { fromVersion: 'v1014.replay_counterfactual.14', toVersion: 'v1014.replay_counterfactual.15', migrate: V1014_REPLAY_migrateSection6Step15 },
  { fromVersion: 'v1014.replay_counterfactual.15', toVersion: 'v1014.replay_counterfactual.16', migrate: V1014_REPLAY_migrateSection6Step16 },
  { fromVersion: 'v1014.replay_counterfactual.16', toVersion: 'v1014.replay_counterfactual.17', migrate: V1014_REPLAY_migrateSection6Step17 },
  { fromVersion: 'v1014.replay_counterfactual.17', toVersion: 'v1014.replay_counterfactual.18', migrate: V1014_REPLAY_migrateSection6Step18 },
  { fromVersion: 'v1014.replay_counterfactual.18', toVersion: 'v1014.replay_counterfactual.19', migrate: V1014_REPLAY_migrateSection6Step19 },
  { fromVersion: 'v1014.replay_counterfactual.19', toVersion: 'v1014.replay_counterfactual.20', migrate: V1014_REPLAY_migrateSection6Step20 },
  { fromVersion: 'v1014.replay_counterfactual.20', toVersion: 'v1014.replay_counterfactual.21', migrate: V1014_REPLAY_migrateSection6Step21 },
  { fromVersion: 'v1014.replay_counterfactual.21', toVersion: 'v1014.replay_counterfactual.22', migrate: V1014_REPLAY_migrateSection6Step22 },
  { fromVersion: 'v1014.replay_counterfactual.22', toVersion: 'v1014.replay_counterfactual.23', migrate: V1014_REPLAY_migrateSection6Step23 },
  { fromVersion: 'v1014.replay_counterfactual.23', toVersion: 'v1014.replay_counterfactual.24', migrate: V1014_REPLAY_migrateSection6Step24 },
  { fromVersion: 'v1014.replay_counterfactual.24', toVersion: 'v1014.replay_counterfactual.25', migrate: V1014_REPLAY_migrateSection6Step25 },
  { fromVersion: 'v1014.replay_counterfactual.25', toVersion: 'v1014.replay_counterfactual.26', migrate: V1014_REPLAY_migrateSection6Step26 },
  { fromVersion: 'v1014.replay_counterfactual.26', toVersion: 'v1014.replay_counterfactual.27', migrate: V1014_REPLAY_migrateSection6Step27 },
  { fromVersion: 'v1014.replay_counterfactual.27', toVersion: 'v1014.replay_counterfactual.28', migrate: V1014_REPLAY_migrateSection6Step28 },
  { fromVersion: 'v1014.replay_counterfactual.28', toVersion: 'v1014.replay_counterfactual.29', migrate: V1014_REPLAY_migrateSection6Step29 },
  { fromVersion: 'v1014.replay_counterfactual.29', toVersion: 'v1014.replay_counterfactual.30', migrate: V1014_REPLAY_migrateSection6Step30 },
  { fromVersion: 'v1014.replay_counterfactual.30', toVersion: 'v1014.replay_counterfactual.31', migrate: V1014_REPLAY_migrateSection6Step31 },
  { fromVersion: 'v1014.replay_counterfactual.31', toVersion: 'v1014.replay_counterfactual.32', migrate: V1014_REPLAY_migrateSection6Step32 },
  { fromVersion: 'v1014.replay_counterfactual.32', toVersion: 'v1014.replay_counterfactual.33', migrate: V1014_REPLAY_migrateSection6Step33 },
  { fromVersion: 'v1014.replay_counterfactual.33', toVersion: 'v1014.replay_counterfactual.34', migrate: V1014_REPLAY_migrateSection6Step34 },
  { fromVersion: 'v1014.replay_counterfactual.34', toVersion: 'v1014.replay_counterfactual.35', migrate: V1014_REPLAY_migrateSection6Step35 },
  { fromVersion: 'v1014.replay_counterfactual.35', toVersion: 'v1014.replay_counterfactual.36', migrate: V1014_REPLAY_migrateSection6Step36 },
  { fromVersion: 'v1014.replay_counterfactual.36', toVersion: 'v1014.replay_counterfactual.37', migrate: V1014_REPLAY_migrateSection6Step37 },
  { fromVersion: 'v1014.replay_counterfactual.37', toVersion: 'v1014.replay_counterfactual.38', migrate: V1014_REPLAY_migrateSection6Step38 },
  { fromVersion: 'v1014.replay_counterfactual.38', toVersion: 'v1014.replay_counterfactual.39', migrate: V1014_REPLAY_migrateSection6Step39 },
  { fromVersion: 'v1014.replay_counterfactual.39', toVersion: 'v1014.replay_counterfactual.40', migrate: V1014_REPLAY_migrateSection6Step40 },
];

export function V1014_REPLAY_readPersistenceSlice(gameState: Record<string, unknown>): V1014ReplayPersistenceSlice | null {
  const meta = (gameState?.save as any)?.meta?.v1014?.replay_counterfactual;
  if (!meta || typeof meta !== 'object') return null;
  return meta as V1014ReplayPersistenceSlice;
}

export function V1014_REPLAY_patchPersistenceSlice(
  gameState: Record<string, unknown>,
  slice: V1014ReplayPersistenceSlice,
): Record<string, unknown> {
  const save = { ...(gameState.save as object || {}) } as Record<string, unknown>;
  const meta = { ...(save.meta as object || {}) } as Record<string, unknown>;
  const v1014 = { ...(meta.v1014 as object || {}) } as Record<string, unknown>;
  v1014.replay_counterfactual = slice;
  meta.v1014 = v1014;
  save.meta = meta;
  return { ...gameState, save };
}
