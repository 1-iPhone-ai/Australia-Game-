import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE1 } from '../generated/chain-catalog.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE2 } from '../generated/chain-catalog-tranche2.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE3 } from '../generated/chain-catalog-tranche3.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE4 } from '../generated/chain-catalog-tranche4.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE5 } from '../generated/chain-catalog-tranche5.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE6 } from '../generated/chain-catalog-tranche6.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE7 } from '../generated/chain-catalog-tranche7.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE8 } from '../generated/chain-catalog-tranche8.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE9 } from '../generated/chain-catalog-tranche9.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE10 } from '../generated/chain-catalog-tranche10.ts';
import type { Op10mChainDescriptor } from './types.ts';

export const OP10M_AGENT05_CATALOG_STATS = {
  tranche1Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE1.length,
  tranche2Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE2.length,
  tranche3Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE3.length,
  tranche4Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE4.length,
  tranche5Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE5.length,
  tranche6Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE6.length,
  tranche7Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE7.length,
  tranche8Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE8.length,
  tranche9Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE9.length,
  tranche10Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE10.length,
  totalChains:
    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE1.length +
    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE2.length +
    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE3.length +
    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE4.length +
    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE5.length +
    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE6.length +
    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE7.length +
    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE8.length +
    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE9.length +
    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE10.length,
  regions: 8,
} as const;

export const OP10M_AGENT05_CHAIN_CATALOG: Op10mChainDescriptor[] = [
  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE1,
  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE2,
  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE3,
  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE4,
  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE5,
  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE6,
  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE7,
  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE8,
  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE9,
  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE10,
];

export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE1,
  OP10M_AGENT05_CATALOG_TRANCHE1_STATS,
} from '../generated/chain-catalog.ts';
export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE2,
  OP10M_AGENT05_CATALOG_TRANCHE2_STATS,
} from '../generated/chain-catalog-tranche2.ts';
export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE3,
  OP10M_AGENT05_CATALOG_TRANCHE3_STATS,
} from '../generated/chain-catalog-tranche3.ts';
export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE4,
  OP10M_AGENT05_CATALOG_TRANCHE4_STATS,
} from '../generated/chain-catalog-tranche4.ts';
export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE5,
  OP10M_AGENT05_CATALOG_TRANCHE5_STATS,
} from '../generated/chain-catalog-tranche5.ts';
export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE6,
  OP10M_AGENT05_CATALOG_TRANCHE6_STATS,
} from '../generated/chain-catalog-tranche6.ts';
export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE7,
  OP10M_AGENT05_CATALOG_TRANCHE7_STATS,
} from '../generated/chain-catalog-tranche7.ts';
export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE8,
  OP10M_AGENT05_CATALOG_TRANCHE8_STATS,
} from '../generated/chain-catalog-tranche8.ts';
export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE9,
  OP10M_AGENT05_CATALOG_TRANCHE9_STATS,
} from '../generated/chain-catalog-tranche9.ts';
export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE10,
  OP10M_AGENT05_CATALOG_TRANCHE10_STATS,
} from '../generated/chain-catalog-tranche10.ts';
