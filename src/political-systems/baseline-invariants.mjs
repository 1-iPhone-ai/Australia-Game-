/** @typedef {string} BaselineMarker */

/** Path to the canonical monolith relative to repo root. */
export const BASELINE_GAME_FILE = '(V9.4) australia-game-with-ai.tsx';

/** Section headers that must remain for navigation and ownership docs. */
export const REQUIRED_SECTION_HEADERS = [
  'SECTION 10: GOVERNANCE, APPROVALS, AND OVERSIGHT',
  'SECTION 20K: REGIONAL FACTIONS & STAKEHOLDERS 2.0',
  'SECTION 20AD: V10.11 ADAPTIVE GOVERNANCE & STATE CAPACITY',
];

/** V10.11 ownership block — integrators must not weaken without spec update. */
export const V1011_OWNERSHIP_MARKERS = [
  'TEAM GOVERNANCE (`teamGovernanceMode`) IS NOT NATIONAL STATE CAPACITY',
  'PUBLIC STABILITY (`PublicStabilityState`) IS NOT STATE CAPACITY',
  'REGIONAL FACTIONS (`RegionalFactionsState`) REMAIN AUTHORITATIVE',
  'NO POLITICAL / BUREAUCRACY SIMULATOR & NO GOVERNMENT MANA',
];

/** Core political APIs that Agent 111 should not rename without migration plan. */
export const REQUIRED_EXPORTS = [
  'export function updatePublicStability',
  'export function runRegionalFactions2SelfTests',
  'export function runV1011AdaptiveGovernanceSelfTests',
  'export interface PublicStabilityState',
  'export interface RegionalFactionsState',
];

/** Settings keys referenced by the integration spec. */
export const REQUIRED_SETTINGS_KEYS = [
  'publicStabilityEnabled',
  'teamGovernanceMode',
  'governanceControlSurfaceEnabled',
  'stateCapacityEnabled',
];
