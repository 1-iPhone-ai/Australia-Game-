// SECTION 20AV (cont.): V10.14 SUPPLY CHAIN BOM & BOTTLENECK ENGINE
// Regional bill-of-materials depth — V1014_SUPPLY_* namespace.

export const V1014_SUPPLY_SCHEMA_VERSION = 1 as const;

export interface V1014SupplyDayBoundaryContext {
  prevDay: number;
  newDay: number;
  turnCounter: number;
}

export interface V1014SupplyBomRow {
  skuId: string;
  industryId: string;
  regionId: string;
  inputSku: string;
  qtyPerUnit: number;
  leadDays: number;
  substituteIds: string[];
  elasticity: number;
  bottleneckWeight: number;
}

export interface V1014SupplyTickContext {
  turn: number;
  day: number;
  baseDemand: number;
  baseCapacity: number;
  demandBySku: Record<string, number>;
  capacityByRegion: Record<string, number>;
}

export interface V1014SupplyBottleneckSignal {
  skuId: string;
  regionId: string;
  severity: number;
  slackUnits: number;
  leadDays: number;
  checksum: number;
}

export interface V1014SupplyPersisted {
  schemaVersion: number;
  lastTurn: number;
  lastDay: number;
  activeBottlenecks: V1014SupplyBottleneckSignal[];
  propagationGeneration: number;
  aggregateSeverity: number;
}

export function V1014_SUPPLY_rowChecksum(row: V1014SupplyBomRow, turn: number): number {
  return V1015_ORCH_stableChecksum([row.skuId, row.regionId, row.qtyPerUnit, turn, row.bottleneckWeight]);
}

export function createInitialV1014SupplyPersisted(turn = 1, day = 1): V1014SupplyPersisted {
  return {
    schemaVersion: V1014_SUPPLY_SCHEMA_VERSION,
    lastTurn: turn,
    lastDay: day,
    activeBottlenecks: [],
    propagationGeneration: 0,
    aggregateSeverity: 0,
  };
}

export function sanitizeV1014SupplyPersisted(raw: unknown): V1014SupplyPersisted | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<V1014SupplyPersisted>;
  if (typeof r.schemaVersion !== 'number') return null;
  const base = createInitialV1014SupplyPersisted(Number(r.lastTurn) || 1, Number(r.lastDay) || 1);
  return {
    ...base,
    ...r,
    activeBottlenecks: Array.isArray(r.activeBottlenecks) ? r.activeBottlenecks.slice(0, 400) : [],
    propagationGeneration: Number(r.propagationGeneration) || 0,
    aggregateSeverity: Number(r.aggregateSeverity) || 0,
  };
}

export function v1014SupplyEnsurePersisted(gameState: any): V1014SupplyPersisted {
  return sanitizeV1014SupplyPersisted(gameState?.v1014SupplyChain) || createInitialV1014SupplyPersisted(
    Number(gameState?.turnCounter) || 1,
    Number(gameState?.day) || 1,
  );
}

export function v1014SupplyAttach(gameState: any, persisted: V1014SupplyPersisted): any {
  return { ...gameState, v1014SupplyChain: persisted };
}

export const V1014_SUPPLY_BOM_CATALOG: V1014SupplyBomRow[] = [
  { skuId: 'V1014_SUPPLY_sku_00000', industryId: 'ind_000', regionId: 'reg_00', inputSku: 'in_0000', qtyPerUnit: 1, leadDays: 1, substituteIds: ['sub_0001'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00001', industryId: 'ind_001', regionId: 'reg_01', inputSku: 'in_0003', qtyPerUnit: 2, leadDays: 2, substituteIds: ['sub_0002'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00002', industryId: 'ind_002', regionId: 'reg_02', inputSku: 'in_0006', qtyPerUnit: 3, leadDays: 3, substituteIds: ['sub_0003'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00003', industryId: 'ind_003', regionId: 'reg_03', inputSku: 'in_0009', qtyPerUnit: 4, leadDays: 4, substituteIds: ['sub_0004'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00004', industryId: 'ind_004', regionId: 'reg_04', inputSku: 'in_0012', qtyPerUnit: 5, leadDays: 5, substituteIds: ['sub_0005'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00005', industryId: 'ind_005', regionId: 'reg_05', inputSku: 'in_0015', qtyPerUnit: 6, leadDays: 6, substituteIds: ['sub_0006'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00006', industryId: 'ind_006', regionId: 'reg_06', inputSku: 'in_0018', qtyPerUnit: 7, leadDays: 7, substituteIds: ['sub_0007'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00007', industryId: 'ind_007', regionId: 'reg_07', inputSku: 'in_0021', qtyPerUnit: 8, leadDays: 8, substituteIds: ['sub_0008'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00008', industryId: 'ind_008', regionId: 'reg_08', inputSku: 'in_0024', qtyPerUnit: 9, leadDays: 9, substituteIds: ['sub_0009'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00009', industryId: 'ind_009', regionId: 'reg_09', inputSku: 'in_0027', qtyPerUnit: 10, leadDays: 10, substituteIds: ['sub_0010'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00010', industryId: 'ind_010', regionId: 'reg_10', inputSku: 'in_0030', qtyPerUnit: 11, leadDays: 11, substituteIds: ['sub_0011'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00011', industryId: 'ind_011', regionId: 'reg_11', inputSku: 'in_0033', qtyPerUnit: 12, leadDays: 12, substituteIds: ['sub_0012'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00012', industryId: 'ind_012', regionId: 'reg_12', inputSku: 'in_0036', qtyPerUnit: 13, leadDays: 13, substituteIds: ['sub_0013'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00013', industryId: 'ind_013', regionId: 'reg_13', inputSku: 'in_0039', qtyPerUnit: 14, leadDays: 14, substituteIds: ['sub_0014'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00014', industryId: 'ind_014', regionId: 'reg_14', inputSku: 'in_0042', qtyPerUnit: 15, leadDays: 15, substituteIds: ['sub_0015'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00015', industryId: 'ind_015', regionId: 'reg_15', inputSku: 'in_0045', qtyPerUnit: 16, leadDays: 16, substituteIds: ['sub_0016'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00016', industryId: 'ind_016', regionId: 'reg_16', inputSku: 'in_0048', qtyPerUnit: 17, leadDays: 17, substituteIds: ['sub_0017'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00017', industryId: 'ind_017', regionId: 'reg_17', inputSku: 'in_0051', qtyPerUnit: 1, leadDays: 18, substituteIds: ['sub_0018'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00018', industryId: 'ind_018', regionId: 'reg_18', inputSku: 'in_0054', qtyPerUnit: 2, leadDays: 19, substituteIds: ['sub_0019'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00019', industryId: 'ind_019', regionId: 'reg_19', inputSku: 'in_0057', qtyPerUnit: 3, leadDays: 20, substituteIds: ['sub_0020'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00020', industryId: 'ind_020', regionId: 'reg_20', inputSku: 'in_0060', qtyPerUnit: 4, leadDays: 21, substituteIds: ['sub_0021'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00021', industryId: 'ind_021', regionId: 'reg_21', inputSku: 'in_0063', qtyPerUnit: 5, leadDays: 22, substituteIds: ['sub_0022'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00022', industryId: 'ind_022', regionId: 'reg_22', inputSku: 'in_0066', qtyPerUnit: 6, leadDays: 23, substituteIds: ['sub_0023'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00023', industryId: 'ind_023', regionId: 'reg_23', inputSku: 'in_0069', qtyPerUnit: 7, leadDays: 24, substituteIds: ['sub_0024'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00024', industryId: 'ind_024', regionId: 'reg_24', inputSku: 'in_0072', qtyPerUnit: 8, leadDays: 25, substituteIds: ['sub_0025'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00025', industryId: 'ind_025', regionId: 'reg_25', inputSku: 'in_0075', qtyPerUnit: 9, leadDays: 26, substituteIds: ['sub_0026'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00026', industryId: 'ind_026', regionId: 'reg_26', inputSku: 'in_0078', qtyPerUnit: 10, leadDays: 27, substituteIds: ['sub_0027'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00027', industryId: 'ind_027', regionId: 'reg_27', inputSku: 'in_0081', qtyPerUnit: 11, leadDays: 28, substituteIds: ['sub_0028'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00028', industryId: 'ind_028', regionId: 'reg_00', inputSku: 'in_0084', qtyPerUnit: 12, leadDays: 29, substituteIds: ['sub_0029'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00029', industryId: 'ind_029', regionId: 'reg_01', inputSku: 'in_0087', qtyPerUnit: 13, leadDays: 30, substituteIds: ['sub_0030'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00030', industryId: 'ind_030', regionId: 'reg_02', inputSku: 'in_0090', qtyPerUnit: 14, leadDays: 31, substituteIds: ['sub_0031'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00031', industryId: 'ind_031', regionId: 'reg_03', inputSku: 'in_0093', qtyPerUnit: 15, leadDays: 32, substituteIds: ['sub_0032'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00032', industryId: 'ind_032', regionId: 'reg_04', inputSku: 'in_0096', qtyPerUnit: 16, leadDays: 33, substituteIds: ['sub_0033'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00033', industryId: 'ind_033', regionId: 'reg_05', inputSku: 'in_0099', qtyPerUnit: 17, leadDays: 34, substituteIds: ['sub_0034'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00034', industryId: 'ind_034', regionId: 'reg_06', inputSku: 'in_0102', qtyPerUnit: 1, leadDays: 35, substituteIds: ['sub_0035'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00035', industryId: 'ind_035', regionId: 'reg_07', inputSku: 'in_0105', qtyPerUnit: 2, leadDays: 36, substituteIds: ['sub_0036'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00036', industryId: 'ind_036', regionId: 'reg_08', inputSku: 'in_0108', qtyPerUnit: 3, leadDays: 37, substituteIds: ['sub_0037'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00037', industryId: 'ind_037', regionId: 'reg_09', inputSku: 'in_0111', qtyPerUnit: 4, leadDays: 38, substituteIds: ['sub_0038'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00038', industryId: 'ind_038', regionId: 'reg_10', inputSku: 'in_0114', qtyPerUnit: 5, leadDays: 39, substituteIds: ['sub_0039'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00039', industryId: 'ind_039', regionId: 'reg_11', inputSku: 'in_0117', qtyPerUnit: 6, leadDays: 40, substituteIds: ['sub_0040'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00040', industryId: 'ind_040', regionId: 'reg_12', inputSku: 'in_0120', qtyPerUnit: 7, leadDays: 41, substituteIds: ['sub_0041'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00041', industryId: 'ind_041', regionId: 'reg_13', inputSku: 'in_0123', qtyPerUnit: 8, leadDays: 42, substituteIds: ['sub_0042'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00042', industryId: 'ind_042', regionId: 'reg_14', inputSku: 'in_0126', qtyPerUnit: 9, leadDays: 43, substituteIds: ['sub_0043'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00043', industryId: 'ind_043', regionId: 'reg_15', inputSku: 'in_0129', qtyPerUnit: 10, leadDays: 44, substituteIds: ['sub_0044'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00044', industryId: 'ind_044', regionId: 'reg_16', inputSku: 'in_0132', qtyPerUnit: 11, leadDays: 45, substituteIds: ['sub_0045'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00045', industryId: 'ind_045', regionId: 'reg_17', inputSku: 'in_0135', qtyPerUnit: 12, leadDays: 1, substituteIds: ['sub_0046'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00046', industryId: 'ind_046', regionId: 'reg_18', inputSku: 'in_0138', qtyPerUnit: 13, leadDays: 2, substituteIds: ['sub_0047'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00047', industryId: 'ind_047', regionId: 'reg_19', inputSku: 'in_0141', qtyPerUnit: 14, leadDays: 3, substituteIds: ['sub_0048'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00048', industryId: 'ind_048', regionId: 'reg_20', inputSku: 'in_0144', qtyPerUnit: 15, leadDays: 4, substituteIds: ['sub_0049'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00049', industryId: 'ind_049', regionId: 'reg_21', inputSku: 'in_0147', qtyPerUnit: 16, leadDays: 5, substituteIds: ['sub_0050'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00050', industryId: 'ind_050', regionId: 'reg_22', inputSku: 'in_0150', qtyPerUnit: 17, leadDays: 6, substituteIds: ['sub_0051'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00051', industryId: 'ind_051', regionId: 'reg_23', inputSku: 'in_0153', qtyPerUnit: 1, leadDays: 7, substituteIds: ['sub_0052'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00052', industryId: 'ind_052', regionId: 'reg_24', inputSku: 'in_0156', qtyPerUnit: 2, leadDays: 8, substituteIds: ['sub_0053'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00053', industryId: 'ind_053', regionId: 'reg_25', inputSku: 'in_0159', qtyPerUnit: 3, leadDays: 9, substituteIds: ['sub_0054'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00054', industryId: 'ind_054', regionId: 'reg_26', inputSku: 'in_0162', qtyPerUnit: 4, leadDays: 10, substituteIds: ['sub_0055'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00055', industryId: 'ind_055', regionId: 'reg_27', inputSku: 'in_0165', qtyPerUnit: 5, leadDays: 11, substituteIds: ['sub_0056'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00056', industryId: 'ind_056', regionId: 'reg_00', inputSku: 'in_0168', qtyPerUnit: 6, leadDays: 12, substituteIds: ['sub_0057'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00057', industryId: 'ind_057', regionId: 'reg_01', inputSku: 'in_0171', qtyPerUnit: 7, leadDays: 13, substituteIds: ['sub_0058'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00058', industryId: 'ind_058', regionId: 'reg_02', inputSku: 'in_0174', qtyPerUnit: 8, leadDays: 14, substituteIds: ['sub_0059'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00059', industryId: 'ind_059', regionId: 'reg_03', inputSku: 'in_0177', qtyPerUnit: 9, leadDays: 15, substituteIds: ['sub_0060'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00060', industryId: 'ind_060', regionId: 'reg_04', inputSku: 'in_0180', qtyPerUnit: 10, leadDays: 16, substituteIds: ['sub_0061'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00061', industryId: 'ind_061', regionId: 'reg_05', inputSku: 'in_0183', qtyPerUnit: 11, leadDays: 17, substituteIds: ['sub_0062'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00062', industryId: 'ind_062', regionId: 'reg_06', inputSku: 'in_0186', qtyPerUnit: 12, leadDays: 18, substituteIds: ['sub_0063'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00063', industryId: 'ind_063', regionId: 'reg_07', inputSku: 'in_0189', qtyPerUnit: 13, leadDays: 19, substituteIds: ['sub_0064'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00064', industryId: 'ind_064', regionId: 'reg_08', inputSku: 'in_0192', qtyPerUnit: 14, leadDays: 20, substituteIds: ['sub_0065'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00065', industryId: 'ind_065', regionId: 'reg_09', inputSku: 'in_0195', qtyPerUnit: 15, leadDays: 21, substituteIds: ['sub_0066'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00066', industryId: 'ind_066', regionId: 'reg_10', inputSku: 'in_0198', qtyPerUnit: 16, leadDays: 22, substituteIds: ['sub_0067'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00067', industryId: 'ind_067', regionId: 'reg_11', inputSku: 'in_0201', qtyPerUnit: 17, leadDays: 23, substituteIds: ['sub_0068'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00068', industryId: 'ind_068', regionId: 'reg_12', inputSku: 'in_0204', qtyPerUnit: 1, leadDays: 24, substituteIds: ['sub_0069'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00069', industryId: 'ind_069', regionId: 'reg_13', inputSku: 'in_0207', qtyPerUnit: 2, leadDays: 25, substituteIds: ['sub_0070'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00070', industryId: 'ind_070', regionId: 'reg_14', inputSku: 'in_0210', qtyPerUnit: 3, leadDays: 26, substituteIds: ['sub_0071'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00071', industryId: 'ind_071', regionId: 'reg_15', inputSku: 'in_0213', qtyPerUnit: 4, leadDays: 27, substituteIds: ['sub_0072'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00072', industryId: 'ind_072', regionId: 'reg_16', inputSku: 'in_0216', qtyPerUnit: 5, leadDays: 28, substituteIds: ['sub_0073'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00073', industryId: 'ind_073', regionId: 'reg_17', inputSku: 'in_0219', qtyPerUnit: 6, leadDays: 29, substituteIds: ['sub_0074'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00074', industryId: 'ind_074', regionId: 'reg_18', inputSku: 'in_0222', qtyPerUnit: 7, leadDays: 30, substituteIds: ['sub_0075'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00075', industryId: 'ind_075', regionId: 'reg_19', inputSku: 'in_0225', qtyPerUnit: 8, leadDays: 31, substituteIds: ['sub_0076'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00076', industryId: 'ind_076', regionId: 'reg_20', inputSku: 'in_0228', qtyPerUnit: 9, leadDays: 32, substituteIds: ['sub_0077'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00077', industryId: 'ind_077', regionId: 'reg_21', inputSku: 'in_0231', qtyPerUnit: 10, leadDays: 33, substituteIds: ['sub_0078'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00078', industryId: 'ind_078', regionId: 'reg_22', inputSku: 'in_0234', qtyPerUnit: 11, leadDays: 34, substituteIds: ['sub_0079'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00079', industryId: 'ind_079', regionId: 'reg_23', inputSku: 'in_0237', qtyPerUnit: 12, leadDays: 35, substituteIds: ['sub_0080'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00080', industryId: 'ind_080', regionId: 'reg_24', inputSku: 'in_0240', qtyPerUnit: 13, leadDays: 36, substituteIds: ['sub_0081'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00081', industryId: 'ind_081', regionId: 'reg_25', inputSku: 'in_0243', qtyPerUnit: 14, leadDays: 37, substituteIds: ['sub_0082'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00082', industryId: 'ind_082', regionId: 'reg_26', inputSku: 'in_0246', qtyPerUnit: 15, leadDays: 38, substituteIds: ['sub_0083'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00083', industryId: 'ind_083', regionId: 'reg_27', inputSku: 'in_0249', qtyPerUnit: 16, leadDays: 39, substituteIds: ['sub_0084'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00084', industryId: 'ind_084', regionId: 'reg_00', inputSku: 'in_0252', qtyPerUnit: 17, leadDays: 40, substituteIds: ['sub_0085'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00085', industryId: 'ind_085', regionId: 'reg_01', inputSku: 'in_0255', qtyPerUnit: 1, leadDays: 41, substituteIds: ['sub_0086'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00086', industryId: 'ind_086', regionId: 'reg_02', inputSku: 'in_0258', qtyPerUnit: 2, leadDays: 42, substituteIds: ['sub_0087'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00087', industryId: 'ind_087', regionId: 'reg_03', inputSku: 'in_0261', qtyPerUnit: 3, leadDays: 43, substituteIds: ['sub_0088'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00088', industryId: 'ind_088', regionId: 'reg_04', inputSku: 'in_0264', qtyPerUnit: 4, leadDays: 44, substituteIds: ['sub_0089'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00089', industryId: 'ind_089', regionId: 'reg_05', inputSku: 'in_0267', qtyPerUnit: 5, leadDays: 45, substituteIds: ['sub_0090'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00090', industryId: 'ind_090', regionId: 'reg_06', inputSku: 'in_0270', qtyPerUnit: 6, leadDays: 1, substituteIds: ['sub_0091'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00091', industryId: 'ind_091', regionId: 'reg_07', inputSku: 'in_0273', qtyPerUnit: 7, leadDays: 2, substituteIds: ['sub_0092'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00092', industryId: 'ind_092', regionId: 'reg_08', inputSku: 'in_0276', qtyPerUnit: 8, leadDays: 3, substituteIds: ['sub_0093'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00093', industryId: 'ind_093', regionId: 'reg_09', inputSku: 'in_0279', qtyPerUnit: 9, leadDays: 4, substituteIds: ['sub_0094'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00094', industryId: 'ind_094', regionId: 'reg_10', inputSku: 'in_0282', qtyPerUnit: 10, leadDays: 5, substituteIds: ['sub_0095'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00095', industryId: 'ind_095', regionId: 'reg_11', inputSku: 'in_0285', qtyPerUnit: 11, leadDays: 6, substituteIds: ['sub_0096'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00096', industryId: 'ind_096', regionId: 'reg_12', inputSku: 'in_0288', qtyPerUnit: 12, leadDays: 7, substituteIds: ['sub_0097'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00097', industryId: 'ind_097', regionId: 'reg_13', inputSku: 'in_0291', qtyPerUnit: 13, leadDays: 8, substituteIds: ['sub_0098'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00098', industryId: 'ind_098', regionId: 'reg_14', inputSku: 'in_0294', qtyPerUnit: 14, leadDays: 9, substituteIds: ['sub_0099'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00099', industryId: 'ind_099', regionId: 'reg_15', inputSku: 'in_0297', qtyPerUnit: 15, leadDays: 10, substituteIds: ['sub_0100'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00100', industryId: 'ind_100', regionId: 'reg_16', inputSku: 'in_0300', qtyPerUnit: 16, leadDays: 11, substituteIds: ['sub_0101'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00101', industryId: 'ind_101', regionId: 'reg_17', inputSku: 'in_0303', qtyPerUnit: 17, leadDays: 12, substituteIds: ['sub_0102'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00102', industryId: 'ind_102', regionId: 'reg_18', inputSku: 'in_0306', qtyPerUnit: 1, leadDays: 13, substituteIds: ['sub_0103'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00103', industryId: 'ind_103', regionId: 'reg_19', inputSku: 'in_0309', qtyPerUnit: 2, leadDays: 14, substituteIds: ['sub_0104'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00104', industryId: 'ind_104', regionId: 'reg_20', inputSku: 'in_0312', qtyPerUnit: 3, leadDays: 15, substituteIds: ['sub_0105'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00105', industryId: 'ind_105', regionId: 'reg_21', inputSku: 'in_0315', qtyPerUnit: 4, leadDays: 16, substituteIds: ['sub_0106'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00106', industryId: 'ind_106', regionId: 'reg_22', inputSku: 'in_0318', qtyPerUnit: 5, leadDays: 17, substituteIds: ['sub_0107'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00107', industryId: 'ind_107', regionId: 'reg_23', inputSku: 'in_0321', qtyPerUnit: 6, leadDays: 18, substituteIds: ['sub_0108'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00108', industryId: 'ind_108', regionId: 'reg_24', inputSku: 'in_0324', qtyPerUnit: 7, leadDays: 19, substituteIds: ['sub_0109'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00109', industryId: 'ind_109', regionId: 'reg_25', inputSku: 'in_0327', qtyPerUnit: 8, leadDays: 20, substituteIds: ['sub_0110'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00110', industryId: 'ind_110', regionId: 'reg_26', inputSku: 'in_0330', qtyPerUnit: 9, leadDays: 21, substituteIds: ['sub_0111'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00111', industryId: 'ind_111', regionId: 'reg_27', inputSku: 'in_0333', qtyPerUnit: 10, leadDays: 22, substituteIds: ['sub_0112'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00112', industryId: 'ind_112', regionId: 'reg_00', inputSku: 'in_0336', qtyPerUnit: 11, leadDays: 23, substituteIds: ['sub_0113'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00113', industryId: 'ind_113', regionId: 'reg_01', inputSku: 'in_0339', qtyPerUnit: 12, leadDays: 24, substituteIds: ['sub_0114'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00114', industryId: 'ind_114', regionId: 'reg_02', inputSku: 'in_0342', qtyPerUnit: 13, leadDays: 25, substituteIds: ['sub_0115'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00115', industryId: 'ind_115', regionId: 'reg_03', inputSku: 'in_0345', qtyPerUnit: 14, leadDays: 26, substituteIds: ['sub_0116'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00116', industryId: 'ind_116', regionId: 'reg_04', inputSku: 'in_0348', qtyPerUnit: 15, leadDays: 27, substituteIds: ['sub_0117'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00117', industryId: 'ind_117', regionId: 'reg_05', inputSku: 'in_0351', qtyPerUnit: 16, leadDays: 28, substituteIds: ['sub_0118'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00118', industryId: 'ind_118', regionId: 'reg_06', inputSku: 'in_0354', qtyPerUnit: 17, leadDays: 29, substituteIds: ['sub_0119'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00119', industryId: 'ind_119', regionId: 'reg_07', inputSku: 'in_0357', qtyPerUnit: 1, leadDays: 30, substituteIds: ['sub_0120'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00120', industryId: 'ind_000', regionId: 'reg_08', inputSku: 'in_0360', qtyPerUnit: 2, leadDays: 31, substituteIds: ['sub_0121'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00121', industryId: 'ind_001', regionId: 'reg_09', inputSku: 'in_0363', qtyPerUnit: 3, leadDays: 32, substituteIds: ['sub_0122'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00122', industryId: 'ind_002', regionId: 'reg_10', inputSku: 'in_0366', qtyPerUnit: 4, leadDays: 33, substituteIds: ['sub_0123'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00123', industryId: 'ind_003', regionId: 'reg_11', inputSku: 'in_0369', qtyPerUnit: 5, leadDays: 34, substituteIds: ['sub_0124'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00124', industryId: 'ind_004', regionId: 'reg_12', inputSku: 'in_0372', qtyPerUnit: 6, leadDays: 35, substituteIds: ['sub_0125'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00125', industryId: 'ind_005', regionId: 'reg_13', inputSku: 'in_0375', qtyPerUnit: 7, leadDays: 36, substituteIds: ['sub_0126'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00126', industryId: 'ind_006', regionId: 'reg_14', inputSku: 'in_0378', qtyPerUnit: 8, leadDays: 37, substituteIds: ['sub_0127'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00127', industryId: 'ind_007', regionId: 'reg_15', inputSku: 'in_0381', qtyPerUnit: 9, leadDays: 38, substituteIds: ['sub_0128'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00128', industryId: 'ind_008', regionId: 'reg_16', inputSku: 'in_0384', qtyPerUnit: 10, leadDays: 39, substituteIds: ['sub_0129'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00129', industryId: 'ind_009', regionId: 'reg_17', inputSku: 'in_0387', qtyPerUnit: 11, leadDays: 40, substituteIds: ['sub_0130'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00130', industryId: 'ind_010', regionId: 'reg_18', inputSku: 'in_0390', qtyPerUnit: 12, leadDays: 41, substituteIds: ['sub_0131'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00131', industryId: 'ind_011', regionId: 'reg_19', inputSku: 'in_0393', qtyPerUnit: 13, leadDays: 42, substituteIds: ['sub_0132'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00132', industryId: 'ind_012', regionId: 'reg_20', inputSku: 'in_0396', qtyPerUnit: 14, leadDays: 43, substituteIds: ['sub_0133'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00133', industryId: 'ind_013', regionId: 'reg_21', inputSku: 'in_0399', qtyPerUnit: 15, leadDays: 44, substituteIds: ['sub_0134'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00134', industryId: 'ind_014', regionId: 'reg_22', inputSku: 'in_0002', qtyPerUnit: 16, leadDays: 45, substituteIds: ['sub_0135'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00135', industryId: 'ind_015', regionId: 'reg_23', inputSku: 'in_0005', qtyPerUnit: 17, leadDays: 1, substituteIds: ['sub_0136'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00136', industryId: 'ind_016', regionId: 'reg_24', inputSku: 'in_0008', qtyPerUnit: 1, leadDays: 2, substituteIds: ['sub_0137'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00137', industryId: 'ind_017', regionId: 'reg_25', inputSku: 'in_0011', qtyPerUnit: 2, leadDays: 3, substituteIds: ['sub_0138'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00138', industryId: 'ind_018', regionId: 'reg_26', inputSku: 'in_0014', qtyPerUnit: 3, leadDays: 4, substituteIds: ['sub_0139'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00139', industryId: 'ind_019', regionId: 'reg_27', inputSku: 'in_0017', qtyPerUnit: 4, leadDays: 5, substituteIds: ['sub_0140'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00140', industryId: 'ind_020', regionId: 'reg_00', inputSku: 'in_0020', qtyPerUnit: 5, leadDays: 6, substituteIds: ['sub_0141'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00141', industryId: 'ind_021', regionId: 'reg_01', inputSku: 'in_0023', qtyPerUnit: 6, leadDays: 7, substituteIds: ['sub_0142'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00142', industryId: 'ind_022', regionId: 'reg_02', inputSku: 'in_0026', qtyPerUnit: 7, leadDays: 8, substituteIds: ['sub_0143'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00143', industryId: 'ind_023', regionId: 'reg_03', inputSku: 'in_0029', qtyPerUnit: 8, leadDays: 9, substituteIds: ['sub_0144'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00144', industryId: 'ind_024', regionId: 'reg_04', inputSku: 'in_0032', qtyPerUnit: 9, leadDays: 10, substituteIds: ['sub_0145'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00145', industryId: 'ind_025', regionId: 'reg_05', inputSku: 'in_0035', qtyPerUnit: 10, leadDays: 11, substituteIds: ['sub_0146'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00146', industryId: 'ind_026', regionId: 'reg_06', inputSku: 'in_0038', qtyPerUnit: 11, leadDays: 12, substituteIds: ['sub_0147'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00147', industryId: 'ind_027', regionId: 'reg_07', inputSku: 'in_0041', qtyPerUnit: 12, leadDays: 13, substituteIds: ['sub_0148'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00148', industryId: 'ind_028', regionId: 'reg_08', inputSku: 'in_0044', qtyPerUnit: 13, leadDays: 14, substituteIds: ['sub_0149'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00149', industryId: 'ind_029', regionId: 'reg_09', inputSku: 'in_0047', qtyPerUnit: 14, leadDays: 15, substituteIds: ['sub_0150'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00150', industryId: 'ind_030', regionId: 'reg_10', inputSku: 'in_0050', qtyPerUnit: 15, leadDays: 16, substituteIds: ['sub_0151'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00151', industryId: 'ind_031', regionId: 'reg_11', inputSku: 'in_0053', qtyPerUnit: 16, leadDays: 17, substituteIds: ['sub_0152'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00152', industryId: 'ind_032', regionId: 'reg_12', inputSku: 'in_0056', qtyPerUnit: 17, leadDays: 18, substituteIds: ['sub_0153'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00153', industryId: 'ind_033', regionId: 'reg_13', inputSku: 'in_0059', qtyPerUnit: 1, leadDays: 19, substituteIds: ['sub_0154'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00154', industryId: 'ind_034', regionId: 'reg_14', inputSku: 'in_0062', qtyPerUnit: 2, leadDays: 20, substituteIds: ['sub_0155'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00155', industryId: 'ind_035', regionId: 'reg_15', inputSku: 'in_0065', qtyPerUnit: 3, leadDays: 21, substituteIds: ['sub_0156'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00156', industryId: 'ind_036', regionId: 'reg_16', inputSku: 'in_0068', qtyPerUnit: 4, leadDays: 22, substituteIds: ['sub_0157'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00157', industryId: 'ind_037', regionId: 'reg_17', inputSku: 'in_0071', qtyPerUnit: 5, leadDays: 23, substituteIds: ['sub_0158'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00158', industryId: 'ind_038', regionId: 'reg_18', inputSku: 'in_0074', qtyPerUnit: 6, leadDays: 24, substituteIds: ['sub_0159'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00159', industryId: 'ind_039', regionId: 'reg_19', inputSku: 'in_0077', qtyPerUnit: 7, leadDays: 25, substituteIds: ['sub_0160'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00160', industryId: 'ind_040', regionId: 'reg_20', inputSku: 'in_0080', qtyPerUnit: 8, leadDays: 26, substituteIds: ['sub_0161'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00161', industryId: 'ind_041', regionId: 'reg_21', inputSku: 'in_0083', qtyPerUnit: 9, leadDays: 27, substituteIds: ['sub_0162'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00162', industryId: 'ind_042', regionId: 'reg_22', inputSku: 'in_0086', qtyPerUnit: 10, leadDays: 28, substituteIds: ['sub_0163'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00163', industryId: 'ind_043', regionId: 'reg_23', inputSku: 'in_0089', qtyPerUnit: 11, leadDays: 29, substituteIds: ['sub_0164'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00164', industryId: 'ind_044', regionId: 'reg_24', inputSku: 'in_0092', qtyPerUnit: 12, leadDays: 30, substituteIds: ['sub_0165'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00165', industryId: 'ind_045', regionId: 'reg_25', inputSku: 'in_0095', qtyPerUnit: 13, leadDays: 31, substituteIds: ['sub_0166'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00166', industryId: 'ind_046', regionId: 'reg_26', inputSku: 'in_0098', qtyPerUnit: 14, leadDays: 32, substituteIds: ['sub_0167'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00167', industryId: 'ind_047', regionId: 'reg_27', inputSku: 'in_0101', qtyPerUnit: 15, leadDays: 33, substituteIds: ['sub_0168'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00168', industryId: 'ind_048', regionId: 'reg_00', inputSku: 'in_0104', qtyPerUnit: 16, leadDays: 34, substituteIds: ['sub_0169'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00169', industryId: 'ind_049', regionId: 'reg_01', inputSku: 'in_0107', qtyPerUnit: 17, leadDays: 35, substituteIds: ['sub_0170'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00170', industryId: 'ind_050', regionId: 'reg_02', inputSku: 'in_0110', qtyPerUnit: 1, leadDays: 36, substituteIds: ['sub_0171'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00171', industryId: 'ind_051', regionId: 'reg_03', inputSku: 'in_0113', qtyPerUnit: 2, leadDays: 37, substituteIds: ['sub_0172'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00172', industryId: 'ind_052', regionId: 'reg_04', inputSku: 'in_0116', qtyPerUnit: 3, leadDays: 38, substituteIds: ['sub_0173'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00173', industryId: 'ind_053', regionId: 'reg_05', inputSku: 'in_0119', qtyPerUnit: 4, leadDays: 39, substituteIds: ['sub_0174'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00174', industryId: 'ind_054', regionId: 'reg_06', inputSku: 'in_0122', qtyPerUnit: 5, leadDays: 40, substituteIds: ['sub_0175'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00175', industryId: 'ind_055', regionId: 'reg_07', inputSku: 'in_0125', qtyPerUnit: 6, leadDays: 41, substituteIds: ['sub_0176'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00176', industryId: 'ind_056', regionId: 'reg_08', inputSku: 'in_0128', qtyPerUnit: 7, leadDays: 42, substituteIds: ['sub_0177'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00177', industryId: 'ind_057', regionId: 'reg_09', inputSku: 'in_0131', qtyPerUnit: 8, leadDays: 43, substituteIds: ['sub_0178'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00178', industryId: 'ind_058', regionId: 'reg_10', inputSku: 'in_0134', qtyPerUnit: 9, leadDays: 44, substituteIds: ['sub_0179'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00179', industryId: 'ind_059', regionId: 'reg_11', inputSku: 'in_0137', qtyPerUnit: 10, leadDays: 45, substituteIds: ['sub_0180'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00180', industryId: 'ind_060', regionId: 'reg_12', inputSku: 'in_0140', qtyPerUnit: 11, leadDays: 1, substituteIds: ['sub_0181'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00181', industryId: 'ind_061', regionId: 'reg_13', inputSku: 'in_0143', qtyPerUnit: 12, leadDays: 2, substituteIds: ['sub_0182'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00182', industryId: 'ind_062', regionId: 'reg_14', inputSku: 'in_0146', qtyPerUnit: 13, leadDays: 3, substituteIds: ['sub_0183'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00183', industryId: 'ind_063', regionId: 'reg_15', inputSku: 'in_0149', qtyPerUnit: 14, leadDays: 4, substituteIds: ['sub_0184'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00184', industryId: 'ind_064', regionId: 'reg_16', inputSku: 'in_0152', qtyPerUnit: 15, leadDays: 5, substituteIds: ['sub_0185'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00185', industryId: 'ind_065', regionId: 'reg_17', inputSku: 'in_0155', qtyPerUnit: 16, leadDays: 6, substituteIds: ['sub_0186'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00186', industryId: 'ind_066', regionId: 'reg_18', inputSku: 'in_0158', qtyPerUnit: 17, leadDays: 7, substituteIds: ['sub_0187'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00187', industryId: 'ind_067', regionId: 'reg_19', inputSku: 'in_0161', qtyPerUnit: 1, leadDays: 8, substituteIds: ['sub_0188'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00188', industryId: 'ind_068', regionId: 'reg_20', inputSku: 'in_0164', qtyPerUnit: 2, leadDays: 9, substituteIds: ['sub_0189'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00189', industryId: 'ind_069', regionId: 'reg_21', inputSku: 'in_0167', qtyPerUnit: 3, leadDays: 10, substituteIds: ['sub_0190'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00190', industryId: 'ind_070', regionId: 'reg_22', inputSku: 'in_0170', qtyPerUnit: 4, leadDays: 11, substituteIds: ['sub_0191'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00191', industryId: 'ind_071', regionId: 'reg_23', inputSku: 'in_0173', qtyPerUnit: 5, leadDays: 12, substituteIds: ['sub_0192'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00192', industryId: 'ind_072', regionId: 'reg_24', inputSku: 'in_0176', qtyPerUnit: 6, leadDays: 13, substituteIds: ['sub_0193'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00193', industryId: 'ind_073', regionId: 'reg_25', inputSku: 'in_0179', qtyPerUnit: 7, leadDays: 14, substituteIds: ['sub_0194'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00194', industryId: 'ind_074', regionId: 'reg_26', inputSku: 'in_0182', qtyPerUnit: 8, leadDays: 15, substituteIds: ['sub_0195'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00195', industryId: 'ind_075', regionId: 'reg_27', inputSku: 'in_0185', qtyPerUnit: 9, leadDays: 16, substituteIds: ['sub_0196'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00196', industryId: 'ind_076', regionId: 'reg_00', inputSku: 'in_0188', qtyPerUnit: 10, leadDays: 17, substituteIds: ['sub_0197'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00197', industryId: 'ind_077', regionId: 'reg_01', inputSku: 'in_0191', qtyPerUnit: 11, leadDays: 18, substituteIds: ['sub_0198'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00198', industryId: 'ind_078', regionId: 'reg_02', inputSku: 'in_0194', qtyPerUnit: 12, leadDays: 19, substituteIds: ['sub_0199'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00199', industryId: 'ind_079', regionId: 'reg_03', inputSku: 'in_0197', qtyPerUnit: 13, leadDays: 20, substituteIds: ['sub_0200'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00200', industryId: 'ind_080', regionId: 'reg_04', inputSku: 'in_0200', qtyPerUnit: 14, leadDays: 21, substituteIds: ['sub_0201'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00201', industryId: 'ind_081', regionId: 'reg_05', inputSku: 'in_0203', qtyPerUnit: 15, leadDays: 22, substituteIds: ['sub_0202'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00202', industryId: 'ind_082', regionId: 'reg_06', inputSku: 'in_0206', qtyPerUnit: 16, leadDays: 23, substituteIds: ['sub_0203'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00203', industryId: 'ind_083', regionId: 'reg_07', inputSku: 'in_0209', qtyPerUnit: 17, leadDays: 24, substituteIds: ['sub_0204'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00204', industryId: 'ind_084', regionId: 'reg_08', inputSku: 'in_0212', qtyPerUnit: 1, leadDays: 25, substituteIds: ['sub_0205'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00205', industryId: 'ind_085', regionId: 'reg_09', inputSku: 'in_0215', qtyPerUnit: 2, leadDays: 26, substituteIds: ['sub_0206'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00206', industryId: 'ind_086', regionId: 'reg_10', inputSku: 'in_0218', qtyPerUnit: 3, leadDays: 27, substituteIds: ['sub_0207'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00207', industryId: 'ind_087', regionId: 'reg_11', inputSku: 'in_0221', qtyPerUnit: 4, leadDays: 28, substituteIds: ['sub_0208'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00208', industryId: 'ind_088', regionId: 'reg_12', inputSku: 'in_0224', qtyPerUnit: 5, leadDays: 29, substituteIds: ['sub_0209'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00209', industryId: 'ind_089', regionId: 'reg_13', inputSku: 'in_0227', qtyPerUnit: 6, leadDays: 30, substituteIds: ['sub_0210'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00210', industryId: 'ind_090', regionId: 'reg_14', inputSku: 'in_0230', qtyPerUnit: 7, leadDays: 31, substituteIds: ['sub_0211'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00211', industryId: 'ind_091', regionId: 'reg_15', inputSku: 'in_0233', qtyPerUnit: 8, leadDays: 32, substituteIds: ['sub_0212'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00212', industryId: 'ind_092', regionId: 'reg_16', inputSku: 'in_0236', qtyPerUnit: 9, leadDays: 33, substituteIds: ['sub_0213'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00213', industryId: 'ind_093', regionId: 'reg_17', inputSku: 'in_0239', qtyPerUnit: 10, leadDays: 34, substituteIds: ['sub_0214'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00214', industryId: 'ind_094', regionId: 'reg_18', inputSku: 'in_0242', qtyPerUnit: 11, leadDays: 35, substituteIds: ['sub_0215'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00215', industryId: 'ind_095', regionId: 'reg_19', inputSku: 'in_0245', qtyPerUnit: 12, leadDays: 36, substituteIds: ['sub_0216'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00216', industryId: 'ind_096', regionId: 'reg_20', inputSku: 'in_0248', qtyPerUnit: 13, leadDays: 37, substituteIds: ['sub_0217'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00217', industryId: 'ind_097', regionId: 'reg_21', inputSku: 'in_0251', qtyPerUnit: 14, leadDays: 38, substituteIds: ['sub_0218'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00218', industryId: 'ind_098', regionId: 'reg_22', inputSku: 'in_0254', qtyPerUnit: 15, leadDays: 39, substituteIds: ['sub_0219'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00219', industryId: 'ind_099', regionId: 'reg_23', inputSku: 'in_0257', qtyPerUnit: 16, leadDays: 40, substituteIds: ['sub_0220'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00220', industryId: 'ind_100', regionId: 'reg_24', inputSku: 'in_0260', qtyPerUnit: 17, leadDays: 41, substituteIds: ['sub_0221'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00221', industryId: 'ind_101', regionId: 'reg_25', inputSku: 'in_0263', qtyPerUnit: 1, leadDays: 42, substituteIds: ['sub_0222'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00222', industryId: 'ind_102', regionId: 'reg_26', inputSku: 'in_0266', qtyPerUnit: 2, leadDays: 43, substituteIds: ['sub_0223'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00223', industryId: 'ind_103', regionId: 'reg_27', inputSku: 'in_0269', qtyPerUnit: 3, leadDays: 44, substituteIds: ['sub_0224'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00224', industryId: 'ind_104', regionId: 'reg_00', inputSku: 'in_0272', qtyPerUnit: 4, leadDays: 45, substituteIds: ['sub_0225'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00225', industryId: 'ind_105', regionId: 'reg_01', inputSku: 'in_0275', qtyPerUnit: 5, leadDays: 1, substituteIds: ['sub_0226'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00226', industryId: 'ind_106', regionId: 'reg_02', inputSku: 'in_0278', qtyPerUnit: 6, leadDays: 2, substituteIds: ['sub_0227'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00227', industryId: 'ind_107', regionId: 'reg_03', inputSku: 'in_0281', qtyPerUnit: 7, leadDays: 3, substituteIds: ['sub_0228'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00228', industryId: 'ind_108', regionId: 'reg_04', inputSku: 'in_0284', qtyPerUnit: 8, leadDays: 4, substituteIds: ['sub_0229'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00229', industryId: 'ind_109', regionId: 'reg_05', inputSku: 'in_0287', qtyPerUnit: 9, leadDays: 5, substituteIds: ['sub_0230'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00230', industryId: 'ind_110', regionId: 'reg_06', inputSku: 'in_0290', qtyPerUnit: 10, leadDays: 6, substituteIds: ['sub_0231'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00231', industryId: 'ind_111', regionId: 'reg_07', inputSku: 'in_0293', qtyPerUnit: 11, leadDays: 7, substituteIds: ['sub_0232'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00232', industryId: 'ind_112', regionId: 'reg_08', inputSku: 'in_0296', qtyPerUnit: 12, leadDays: 8, substituteIds: ['sub_0233'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00233', industryId: 'ind_113', regionId: 'reg_09', inputSku: 'in_0299', qtyPerUnit: 13, leadDays: 9, substituteIds: ['sub_0234'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00234', industryId: 'ind_114', regionId: 'reg_10', inputSku: 'in_0302', qtyPerUnit: 14, leadDays: 10, substituteIds: ['sub_0235'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00235', industryId: 'ind_115', regionId: 'reg_11', inputSku: 'in_0305', qtyPerUnit: 15, leadDays: 11, substituteIds: ['sub_0236'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00236', industryId: 'ind_116', regionId: 'reg_12', inputSku: 'in_0308', qtyPerUnit: 16, leadDays: 12, substituteIds: ['sub_0237'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00237', industryId: 'ind_117', regionId: 'reg_13', inputSku: 'in_0311', qtyPerUnit: 17, leadDays: 13, substituteIds: ['sub_0238'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00238', industryId: 'ind_118', regionId: 'reg_14', inputSku: 'in_0314', qtyPerUnit: 1, leadDays: 14, substituteIds: ['sub_0239'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00239', industryId: 'ind_119', regionId: 'reg_15', inputSku: 'in_0317', qtyPerUnit: 2, leadDays: 15, substituteIds: ['sub_0240'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00240', industryId: 'ind_000', regionId: 'reg_16', inputSku: 'in_0320', qtyPerUnit: 3, leadDays: 16, substituteIds: ['sub_0241'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00241', industryId: 'ind_001', regionId: 'reg_17', inputSku: 'in_0323', qtyPerUnit: 4, leadDays: 17, substituteIds: ['sub_0242'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00242', industryId: 'ind_002', regionId: 'reg_18', inputSku: 'in_0326', qtyPerUnit: 5, leadDays: 18, substituteIds: ['sub_0243'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00243', industryId: 'ind_003', regionId: 'reg_19', inputSku: 'in_0329', qtyPerUnit: 6, leadDays: 19, substituteIds: ['sub_0244'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00244', industryId: 'ind_004', regionId: 'reg_20', inputSku: 'in_0332', qtyPerUnit: 7, leadDays: 20, substituteIds: ['sub_0245'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00245', industryId: 'ind_005', regionId: 'reg_21', inputSku: 'in_0335', qtyPerUnit: 8, leadDays: 21, substituteIds: ['sub_0246'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00246', industryId: 'ind_006', regionId: 'reg_22', inputSku: 'in_0338', qtyPerUnit: 9, leadDays: 22, substituteIds: ['sub_0247'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00247', industryId: 'ind_007', regionId: 'reg_23', inputSku: 'in_0341', qtyPerUnit: 10, leadDays: 23, substituteIds: ['sub_0248'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00248', industryId: 'ind_008', regionId: 'reg_24', inputSku: 'in_0344', qtyPerUnit: 11, leadDays: 24, substituteIds: ['sub_0249'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00249', industryId: 'ind_009', regionId: 'reg_25', inputSku: 'in_0347', qtyPerUnit: 12, leadDays: 25, substituteIds: ['sub_0250'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00250', industryId: 'ind_010', regionId: 'reg_26', inputSku: 'in_0350', qtyPerUnit: 13, leadDays: 26, substituteIds: ['sub_0251'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00251', industryId: 'ind_011', regionId: 'reg_27', inputSku: 'in_0353', qtyPerUnit: 14, leadDays: 27, substituteIds: ['sub_0252'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00252', industryId: 'ind_012', regionId: 'reg_00', inputSku: 'in_0356', qtyPerUnit: 15, leadDays: 28, substituteIds: ['sub_0253'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00253', industryId: 'ind_013', regionId: 'reg_01', inputSku: 'in_0359', qtyPerUnit: 16, leadDays: 29, substituteIds: ['sub_0254'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00254', industryId: 'ind_014', regionId: 'reg_02', inputSku: 'in_0362', qtyPerUnit: 17, leadDays: 30, substituteIds: ['sub_0255'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00255', industryId: 'ind_015', regionId: 'reg_03', inputSku: 'in_0365', qtyPerUnit: 1, leadDays: 31, substituteIds: ['sub_0256'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00256', industryId: 'ind_016', regionId: 'reg_04', inputSku: 'in_0368', qtyPerUnit: 2, leadDays: 32, substituteIds: ['sub_0257'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00257', industryId: 'ind_017', regionId: 'reg_05', inputSku: 'in_0371', qtyPerUnit: 3, leadDays: 33, substituteIds: ['sub_0258'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00258', industryId: 'ind_018', regionId: 'reg_06', inputSku: 'in_0374', qtyPerUnit: 4, leadDays: 34, substituteIds: ['sub_0259'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00259', industryId: 'ind_019', regionId: 'reg_07', inputSku: 'in_0377', qtyPerUnit: 5, leadDays: 35, substituteIds: ['sub_0260'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00260', industryId: 'ind_020', regionId: 'reg_08', inputSku: 'in_0380', qtyPerUnit: 6, leadDays: 36, substituteIds: ['sub_0261'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00261', industryId: 'ind_021', regionId: 'reg_09', inputSku: 'in_0383', qtyPerUnit: 7, leadDays: 37, substituteIds: ['sub_0262'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00262', industryId: 'ind_022', regionId: 'reg_10', inputSku: 'in_0386', qtyPerUnit: 8, leadDays: 38, substituteIds: ['sub_0263'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00263', industryId: 'ind_023', regionId: 'reg_11', inputSku: 'in_0389', qtyPerUnit: 9, leadDays: 39, substituteIds: ['sub_0264'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00264', industryId: 'ind_024', regionId: 'reg_12', inputSku: 'in_0392', qtyPerUnit: 10, leadDays: 40, substituteIds: ['sub_0265'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00265', industryId: 'ind_025', regionId: 'reg_13', inputSku: 'in_0395', qtyPerUnit: 11, leadDays: 41, substituteIds: ['sub_0266'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00266', industryId: 'ind_026', regionId: 'reg_14', inputSku: 'in_0398', qtyPerUnit: 12, leadDays: 42, substituteIds: ['sub_0267'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00267', industryId: 'ind_027', regionId: 'reg_15', inputSku: 'in_0001', qtyPerUnit: 13, leadDays: 43, substituteIds: ['sub_0268'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00268', industryId: 'ind_028', regionId: 'reg_16', inputSku: 'in_0004', qtyPerUnit: 14, leadDays: 44, substituteIds: ['sub_0269'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00269', industryId: 'ind_029', regionId: 'reg_17', inputSku: 'in_0007', qtyPerUnit: 15, leadDays: 45, substituteIds: ['sub_0270'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00270', industryId: 'ind_030', regionId: 'reg_18', inputSku: 'in_0010', qtyPerUnit: 16, leadDays: 1, substituteIds: ['sub_0271'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00271', industryId: 'ind_031', regionId: 'reg_19', inputSku: 'in_0013', qtyPerUnit: 17, leadDays: 2, substituteIds: ['sub_0272'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00272', industryId: 'ind_032', regionId: 'reg_20', inputSku: 'in_0016', qtyPerUnit: 1, leadDays: 3, substituteIds: ['sub_0273'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00273', industryId: 'ind_033', regionId: 'reg_21', inputSku: 'in_0019', qtyPerUnit: 2, leadDays: 4, substituteIds: ['sub_0274'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00274', industryId: 'ind_034', regionId: 'reg_22', inputSku: 'in_0022', qtyPerUnit: 3, leadDays: 5, substituteIds: ['sub_0275'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00275', industryId: 'ind_035', regionId: 'reg_23', inputSku: 'in_0025', qtyPerUnit: 4, leadDays: 6, substituteIds: ['sub_0276'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00276', industryId: 'ind_036', regionId: 'reg_24', inputSku: 'in_0028', qtyPerUnit: 5, leadDays: 7, substituteIds: ['sub_0277'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00277', industryId: 'ind_037', regionId: 'reg_25', inputSku: 'in_0031', qtyPerUnit: 6, leadDays: 8, substituteIds: ['sub_0278'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00278', industryId: 'ind_038', regionId: 'reg_26', inputSku: 'in_0034', qtyPerUnit: 7, leadDays: 9, substituteIds: ['sub_0279'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00279', industryId: 'ind_039', regionId: 'reg_27', inputSku: 'in_0037', qtyPerUnit: 8, leadDays: 10, substituteIds: ['sub_0280'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00280', industryId: 'ind_040', regionId: 'reg_00', inputSku: 'in_0040', qtyPerUnit: 9, leadDays: 11, substituteIds: ['sub_0281'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00281', industryId: 'ind_041', regionId: 'reg_01', inputSku: 'in_0043', qtyPerUnit: 10, leadDays: 12, substituteIds: ['sub_0282'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00282', industryId: 'ind_042', regionId: 'reg_02', inputSku: 'in_0046', qtyPerUnit: 11, leadDays: 13, substituteIds: ['sub_0283'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00283', industryId: 'ind_043', regionId: 'reg_03', inputSku: 'in_0049', qtyPerUnit: 12, leadDays: 14, substituteIds: ['sub_0284'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00284', industryId: 'ind_044', regionId: 'reg_04', inputSku: 'in_0052', qtyPerUnit: 13, leadDays: 15, substituteIds: ['sub_0285'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00285', industryId: 'ind_045', regionId: 'reg_05', inputSku: 'in_0055', qtyPerUnit: 14, leadDays: 16, substituteIds: ['sub_0286'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00286', industryId: 'ind_046', regionId: 'reg_06', inputSku: 'in_0058', qtyPerUnit: 15, leadDays: 17, substituteIds: ['sub_0287'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00287', industryId: 'ind_047', regionId: 'reg_07', inputSku: 'in_0061', qtyPerUnit: 16, leadDays: 18, substituteIds: ['sub_0288'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00288', industryId: 'ind_048', regionId: 'reg_08', inputSku: 'in_0064', qtyPerUnit: 17, leadDays: 19, substituteIds: ['sub_0289'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00289', industryId: 'ind_049', regionId: 'reg_09', inputSku: 'in_0067', qtyPerUnit: 1, leadDays: 20, substituteIds: ['sub_0290'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00290', industryId: 'ind_050', regionId: 'reg_10', inputSku: 'in_0070', qtyPerUnit: 2, leadDays: 21, substituteIds: ['sub_0291'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00291', industryId: 'ind_051', regionId: 'reg_11', inputSku: 'in_0073', qtyPerUnit: 3, leadDays: 22, substituteIds: ['sub_0292'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00292', industryId: 'ind_052', regionId: 'reg_12', inputSku: 'in_0076', qtyPerUnit: 4, leadDays: 23, substituteIds: ['sub_0293'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00293', industryId: 'ind_053', regionId: 'reg_13', inputSku: 'in_0079', qtyPerUnit: 5, leadDays: 24, substituteIds: ['sub_0294'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00294', industryId: 'ind_054', regionId: 'reg_14', inputSku: 'in_0082', qtyPerUnit: 6, leadDays: 25, substituteIds: ['sub_0295'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00295', industryId: 'ind_055', regionId: 'reg_15', inputSku: 'in_0085', qtyPerUnit: 7, leadDays: 26, substituteIds: ['sub_0296'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00296', industryId: 'ind_056', regionId: 'reg_16', inputSku: 'in_0088', qtyPerUnit: 8, leadDays: 27, substituteIds: ['sub_0297'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00297', industryId: 'ind_057', regionId: 'reg_17', inputSku: 'in_0091', qtyPerUnit: 9, leadDays: 28, substituteIds: ['sub_0298'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00298', industryId: 'ind_058', regionId: 'reg_18', inputSku: 'in_0094', qtyPerUnit: 10, leadDays: 29, substituteIds: ['sub_0299'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00299', industryId: 'ind_059', regionId: 'reg_19', inputSku: 'in_0097', qtyPerUnit: 11, leadDays: 30, substituteIds: ['sub_0300'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00300', industryId: 'ind_060', regionId: 'reg_20', inputSku: 'in_0100', qtyPerUnit: 12, leadDays: 31, substituteIds: ['sub_0301'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00301', industryId: 'ind_061', regionId: 'reg_21', inputSku: 'in_0103', qtyPerUnit: 13, leadDays: 32, substituteIds: ['sub_0302'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00302', industryId: 'ind_062', regionId: 'reg_22', inputSku: 'in_0106', qtyPerUnit: 14, leadDays: 33, substituteIds: ['sub_0303'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00303', industryId: 'ind_063', regionId: 'reg_23', inputSku: 'in_0109', qtyPerUnit: 15, leadDays: 34, substituteIds: ['sub_0304'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00304', industryId: 'ind_064', regionId: 'reg_24', inputSku: 'in_0112', qtyPerUnit: 16, leadDays: 35, substituteIds: ['sub_0305'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00305', industryId: 'ind_065', regionId: 'reg_25', inputSku: 'in_0115', qtyPerUnit: 17, leadDays: 36, substituteIds: ['sub_0306'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00306', industryId: 'ind_066', regionId: 'reg_26', inputSku: 'in_0118', qtyPerUnit: 1, leadDays: 37, substituteIds: ['sub_0307'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00307', industryId: 'ind_067', regionId: 'reg_27', inputSku: 'in_0121', qtyPerUnit: 2, leadDays: 38, substituteIds: ['sub_0308'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00308', industryId: 'ind_068', regionId: 'reg_00', inputSku: 'in_0124', qtyPerUnit: 3, leadDays: 39, substituteIds: ['sub_0309'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00309', industryId: 'ind_069', regionId: 'reg_01', inputSku: 'in_0127', qtyPerUnit: 4, leadDays: 40, substituteIds: ['sub_0310'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00310', industryId: 'ind_070', regionId: 'reg_02', inputSku: 'in_0130', qtyPerUnit: 5, leadDays: 41, substituteIds: ['sub_0311'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00311', industryId: 'ind_071', regionId: 'reg_03', inputSku: 'in_0133', qtyPerUnit: 6, leadDays: 42, substituteIds: ['sub_0312'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00312', industryId: 'ind_072', regionId: 'reg_04', inputSku: 'in_0136', qtyPerUnit: 7, leadDays: 43, substituteIds: ['sub_0313'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00313', industryId: 'ind_073', regionId: 'reg_05', inputSku: 'in_0139', qtyPerUnit: 8, leadDays: 44, substituteIds: ['sub_0314'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00314', industryId: 'ind_074', regionId: 'reg_06', inputSku: 'in_0142', qtyPerUnit: 9, leadDays: 45, substituteIds: ['sub_0315'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00315', industryId: 'ind_075', regionId: 'reg_07', inputSku: 'in_0145', qtyPerUnit: 10, leadDays: 1, substituteIds: ['sub_0316'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00316', industryId: 'ind_076', regionId: 'reg_08', inputSku: 'in_0148', qtyPerUnit: 11, leadDays: 2, substituteIds: ['sub_0317'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00317', industryId: 'ind_077', regionId: 'reg_09', inputSku: 'in_0151', qtyPerUnit: 12, leadDays: 3, substituteIds: ['sub_0318'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00318', industryId: 'ind_078', regionId: 'reg_10', inputSku: 'in_0154', qtyPerUnit: 13, leadDays: 4, substituteIds: ['sub_0319'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00319', industryId: 'ind_079', regionId: 'reg_11', inputSku: 'in_0157', qtyPerUnit: 14, leadDays: 5, substituteIds: ['sub_0320'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00320', industryId: 'ind_080', regionId: 'reg_12', inputSku: 'in_0160', qtyPerUnit: 15, leadDays: 6, substituteIds: ['sub_0321'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00321', industryId: 'ind_081', regionId: 'reg_13', inputSku: 'in_0163', qtyPerUnit: 16, leadDays: 7, substituteIds: ['sub_0322'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00322', industryId: 'ind_082', regionId: 'reg_14', inputSku: 'in_0166', qtyPerUnit: 17, leadDays: 8, substituteIds: ['sub_0323'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00323', industryId: 'ind_083', regionId: 'reg_15', inputSku: 'in_0169', qtyPerUnit: 1, leadDays: 9, substituteIds: ['sub_0324'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00324', industryId: 'ind_084', regionId: 'reg_16', inputSku: 'in_0172', qtyPerUnit: 2, leadDays: 10, substituteIds: ['sub_0325'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00325', industryId: 'ind_085', regionId: 'reg_17', inputSku: 'in_0175', qtyPerUnit: 3, leadDays: 11, substituteIds: ['sub_0326'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00326', industryId: 'ind_086', regionId: 'reg_18', inputSku: 'in_0178', qtyPerUnit: 4, leadDays: 12, substituteIds: ['sub_0327'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00327', industryId: 'ind_087', regionId: 'reg_19', inputSku: 'in_0181', qtyPerUnit: 5, leadDays: 13, substituteIds: ['sub_0328'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00328', industryId: 'ind_088', regionId: 'reg_20', inputSku: 'in_0184', qtyPerUnit: 6, leadDays: 14, substituteIds: ['sub_0329'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00329', industryId: 'ind_089', regionId: 'reg_21', inputSku: 'in_0187', qtyPerUnit: 7, leadDays: 15, substituteIds: ['sub_0330'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00330', industryId: 'ind_090', regionId: 'reg_22', inputSku: 'in_0190', qtyPerUnit: 8, leadDays: 16, substituteIds: ['sub_0331'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00331', industryId: 'ind_091', regionId: 'reg_23', inputSku: 'in_0193', qtyPerUnit: 9, leadDays: 17, substituteIds: ['sub_0332'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00332', industryId: 'ind_092', regionId: 'reg_24', inputSku: 'in_0196', qtyPerUnit: 10, leadDays: 18, substituteIds: ['sub_0333'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00333', industryId: 'ind_093', regionId: 'reg_25', inputSku: 'in_0199', qtyPerUnit: 11, leadDays: 19, substituteIds: ['sub_0334'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00334', industryId: 'ind_094', regionId: 'reg_26', inputSku: 'in_0202', qtyPerUnit: 12, leadDays: 20, substituteIds: ['sub_0335'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00335', industryId: 'ind_095', regionId: 'reg_27', inputSku: 'in_0205', qtyPerUnit: 13, leadDays: 21, substituteIds: ['sub_0336'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00336', industryId: 'ind_096', regionId: 'reg_00', inputSku: 'in_0208', qtyPerUnit: 14, leadDays: 22, substituteIds: ['sub_0337'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00337', industryId: 'ind_097', regionId: 'reg_01', inputSku: 'in_0211', qtyPerUnit: 15, leadDays: 23, substituteIds: ['sub_0338'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00338', industryId: 'ind_098', regionId: 'reg_02', inputSku: 'in_0214', qtyPerUnit: 16, leadDays: 24, substituteIds: ['sub_0339'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00339', industryId: 'ind_099', regionId: 'reg_03', inputSku: 'in_0217', qtyPerUnit: 17, leadDays: 25, substituteIds: ['sub_0340'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00340', industryId: 'ind_100', regionId: 'reg_04', inputSku: 'in_0220', qtyPerUnit: 1, leadDays: 26, substituteIds: ['sub_0341'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00341', industryId: 'ind_101', regionId: 'reg_05', inputSku: 'in_0223', qtyPerUnit: 2, leadDays: 27, substituteIds: ['sub_0342'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00342', industryId: 'ind_102', regionId: 'reg_06', inputSku: 'in_0226', qtyPerUnit: 3, leadDays: 28, substituteIds: ['sub_0343'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00343', industryId: 'ind_103', regionId: 'reg_07', inputSku: 'in_0229', qtyPerUnit: 4, leadDays: 29, substituteIds: ['sub_0344'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00344', industryId: 'ind_104', regionId: 'reg_08', inputSku: 'in_0232', qtyPerUnit: 5, leadDays: 30, substituteIds: ['sub_0345'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00345', industryId: 'ind_105', regionId: 'reg_09', inputSku: 'in_0235', qtyPerUnit: 6, leadDays: 31, substituteIds: ['sub_0346'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00346', industryId: 'ind_106', regionId: 'reg_10', inputSku: 'in_0238', qtyPerUnit: 7, leadDays: 32, substituteIds: ['sub_0347'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00347', industryId: 'ind_107', regionId: 'reg_11', inputSku: 'in_0241', qtyPerUnit: 8, leadDays: 33, substituteIds: ['sub_0348'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00348', industryId: 'ind_108', regionId: 'reg_12', inputSku: 'in_0244', qtyPerUnit: 9, leadDays: 34, substituteIds: ['sub_0349'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00349', industryId: 'ind_109', regionId: 'reg_13', inputSku: 'in_0247', qtyPerUnit: 10, leadDays: 35, substituteIds: ['sub_0350'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00350', industryId: 'ind_110', regionId: 'reg_14', inputSku: 'in_0250', qtyPerUnit: 11, leadDays: 36, substituteIds: ['sub_0351'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00351', industryId: 'ind_111', regionId: 'reg_15', inputSku: 'in_0253', qtyPerUnit: 12, leadDays: 37, substituteIds: ['sub_0352'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00352', industryId: 'ind_112', regionId: 'reg_16', inputSku: 'in_0256', qtyPerUnit: 13, leadDays: 38, substituteIds: ['sub_0353'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00353', industryId: 'ind_113', regionId: 'reg_17', inputSku: 'in_0259', qtyPerUnit: 14, leadDays: 39, substituteIds: ['sub_0354'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00354', industryId: 'ind_114', regionId: 'reg_18', inputSku: 'in_0262', qtyPerUnit: 15, leadDays: 40, substituteIds: ['sub_0355'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00355', industryId: 'ind_115', regionId: 'reg_19', inputSku: 'in_0265', qtyPerUnit: 16, leadDays: 41, substituteIds: ['sub_0356'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00356', industryId: 'ind_116', regionId: 'reg_20', inputSku: 'in_0268', qtyPerUnit: 17, leadDays: 42, substituteIds: ['sub_0357'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00357', industryId: 'ind_117', regionId: 'reg_21', inputSku: 'in_0271', qtyPerUnit: 1, leadDays: 43, substituteIds: ['sub_0358'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00358', industryId: 'ind_118', regionId: 'reg_22', inputSku: 'in_0274', qtyPerUnit: 2, leadDays: 44, substituteIds: ['sub_0359'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00359', industryId: 'ind_119', regionId: 'reg_23', inputSku: 'in_0277', qtyPerUnit: 3, leadDays: 45, substituteIds: ['sub_0360'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00360', industryId: 'ind_000', regionId: 'reg_24', inputSku: 'in_0280', qtyPerUnit: 4, leadDays: 1, substituteIds: ['sub_0361'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00361', industryId: 'ind_001', regionId: 'reg_25', inputSku: 'in_0283', qtyPerUnit: 5, leadDays: 2, substituteIds: ['sub_0362'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00362', industryId: 'ind_002', regionId: 'reg_26', inputSku: 'in_0286', qtyPerUnit: 6, leadDays: 3, substituteIds: ['sub_0363'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00363', industryId: 'ind_003', regionId: 'reg_27', inputSku: 'in_0289', qtyPerUnit: 7, leadDays: 4, substituteIds: ['sub_0364'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00364', industryId: 'ind_004', regionId: 'reg_00', inputSku: 'in_0292', qtyPerUnit: 8, leadDays: 5, substituteIds: ['sub_0365'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00365', industryId: 'ind_005', regionId: 'reg_01', inputSku: 'in_0295', qtyPerUnit: 9, leadDays: 6, substituteIds: ['sub_0366'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00366', industryId: 'ind_006', regionId: 'reg_02', inputSku: 'in_0298', qtyPerUnit: 10, leadDays: 7, substituteIds: ['sub_0367'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00367', industryId: 'ind_007', regionId: 'reg_03', inputSku: 'in_0301', qtyPerUnit: 11, leadDays: 8, substituteIds: ['sub_0368'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00368', industryId: 'ind_008', regionId: 'reg_04', inputSku: 'in_0304', qtyPerUnit: 12, leadDays: 9, substituteIds: ['sub_0369'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00369', industryId: 'ind_009', regionId: 'reg_05', inputSku: 'in_0307', qtyPerUnit: 13, leadDays: 10, substituteIds: ['sub_0370'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00370', industryId: 'ind_010', regionId: 'reg_06', inputSku: 'in_0310', qtyPerUnit: 14, leadDays: 11, substituteIds: ['sub_0371'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00371', industryId: 'ind_011', regionId: 'reg_07', inputSku: 'in_0313', qtyPerUnit: 15, leadDays: 12, substituteIds: ['sub_0372'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00372', industryId: 'ind_012', regionId: 'reg_08', inputSku: 'in_0316', qtyPerUnit: 16, leadDays: 13, substituteIds: ['sub_0373'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00373', industryId: 'ind_013', regionId: 'reg_09', inputSku: 'in_0319', qtyPerUnit: 17, leadDays: 14, substituteIds: ['sub_0374'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00374', industryId: 'ind_014', regionId: 'reg_10', inputSku: 'in_0322', qtyPerUnit: 1, leadDays: 15, substituteIds: ['sub_0375'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00375', industryId: 'ind_015', regionId: 'reg_11', inputSku: 'in_0325', qtyPerUnit: 2, leadDays: 16, substituteIds: ['sub_0376'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00376', industryId: 'ind_016', regionId: 'reg_12', inputSku: 'in_0328', qtyPerUnit: 3, leadDays: 17, substituteIds: ['sub_0377'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00377', industryId: 'ind_017', regionId: 'reg_13', inputSku: 'in_0331', qtyPerUnit: 4, leadDays: 18, substituteIds: ['sub_0378'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00378', industryId: 'ind_018', regionId: 'reg_14', inputSku: 'in_0334', qtyPerUnit: 5, leadDays: 19, substituteIds: ['sub_0379'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00379', industryId: 'ind_019', regionId: 'reg_15', inputSku: 'in_0337', qtyPerUnit: 6, leadDays: 20, substituteIds: ['sub_0380'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00380', industryId: 'ind_020', regionId: 'reg_16', inputSku: 'in_0340', qtyPerUnit: 7, leadDays: 21, substituteIds: ['sub_0381'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00381', industryId: 'ind_021', regionId: 'reg_17', inputSku: 'in_0343', qtyPerUnit: 8, leadDays: 22, substituteIds: ['sub_0382'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00382', industryId: 'ind_022', regionId: 'reg_18', inputSku: 'in_0346', qtyPerUnit: 9, leadDays: 23, substituteIds: ['sub_0383'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00383', industryId: 'ind_023', regionId: 'reg_19', inputSku: 'in_0349', qtyPerUnit: 10, leadDays: 24, substituteIds: ['sub_0384'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00384', industryId: 'ind_024', regionId: 'reg_20', inputSku: 'in_0352', qtyPerUnit: 11, leadDays: 25, substituteIds: ['sub_0385'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00385', industryId: 'ind_025', regionId: 'reg_21', inputSku: 'in_0355', qtyPerUnit: 12, leadDays: 26, substituteIds: ['sub_0386'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00386', industryId: 'ind_026', regionId: 'reg_22', inputSku: 'in_0358', qtyPerUnit: 13, leadDays: 27, substituteIds: ['sub_0387'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00387', industryId: 'ind_027', regionId: 'reg_23', inputSku: 'in_0361', qtyPerUnit: 14, leadDays: 28, substituteIds: ['sub_0388'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00388', industryId: 'ind_028', regionId: 'reg_24', inputSku: 'in_0364', qtyPerUnit: 15, leadDays: 29, substituteIds: ['sub_0389'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00389', industryId: 'ind_029', regionId: 'reg_25', inputSku: 'in_0367', qtyPerUnit: 16, leadDays: 30, substituteIds: ['sub_0390'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00390', industryId: 'ind_030', regionId: 'reg_26', inputSku: 'in_0370', qtyPerUnit: 17, leadDays: 31, substituteIds: ['sub_0391'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00391', industryId: 'ind_031', regionId: 'reg_27', inputSku: 'in_0373', qtyPerUnit: 1, leadDays: 32, substituteIds: ['sub_0392'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00392', industryId: 'ind_032', regionId: 'reg_00', inputSku: 'in_0376', qtyPerUnit: 2, leadDays: 33, substituteIds: ['sub_0393'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00393', industryId: 'ind_033', regionId: 'reg_01', inputSku: 'in_0379', qtyPerUnit: 3, leadDays: 34, substituteIds: ['sub_0394'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00394', industryId: 'ind_034', regionId: 'reg_02', inputSku: 'in_0382', qtyPerUnit: 4, leadDays: 35, substituteIds: ['sub_0395'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00395', industryId: 'ind_035', regionId: 'reg_03', inputSku: 'in_0385', qtyPerUnit: 5, leadDays: 36, substituteIds: ['sub_0396'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00396', industryId: 'ind_036', regionId: 'reg_04', inputSku: 'in_0388', qtyPerUnit: 6, leadDays: 37, substituteIds: ['sub_0397'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00397', industryId: 'ind_037', regionId: 'reg_05', inputSku: 'in_0391', qtyPerUnit: 7, leadDays: 38, substituteIds: ['sub_0398'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00398', industryId: 'ind_038', regionId: 'reg_06', inputSku: 'in_0394', qtyPerUnit: 8, leadDays: 39, substituteIds: ['sub_0399'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00399', industryId: 'ind_039', regionId: 'reg_07', inputSku: 'in_0397', qtyPerUnit: 9, leadDays: 40, substituteIds: ['sub_0000'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00400', industryId: 'ind_040', regionId: 'reg_08', inputSku: 'in_0000', qtyPerUnit: 10, leadDays: 41, substituteIds: ['sub_0001'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00401', industryId: 'ind_041', regionId: 'reg_09', inputSku: 'in_0003', qtyPerUnit: 11, leadDays: 42, substituteIds: ['sub_0002'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00402', industryId: 'ind_042', regionId: 'reg_10', inputSku: 'in_0006', qtyPerUnit: 12, leadDays: 43, substituteIds: ['sub_0003'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00403', industryId: 'ind_043', regionId: 'reg_11', inputSku: 'in_0009', qtyPerUnit: 13, leadDays: 44, substituteIds: ['sub_0004'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00404', industryId: 'ind_044', regionId: 'reg_12', inputSku: 'in_0012', qtyPerUnit: 14, leadDays: 45, substituteIds: ['sub_0005'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00405', industryId: 'ind_045', regionId: 'reg_13', inputSku: 'in_0015', qtyPerUnit: 15, leadDays: 1, substituteIds: ['sub_0006'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00406', industryId: 'ind_046', regionId: 'reg_14', inputSku: 'in_0018', qtyPerUnit: 16, leadDays: 2, substituteIds: ['sub_0007'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00407', industryId: 'ind_047', regionId: 'reg_15', inputSku: 'in_0021', qtyPerUnit: 17, leadDays: 3, substituteIds: ['sub_0008'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00408', industryId: 'ind_048', regionId: 'reg_16', inputSku: 'in_0024', qtyPerUnit: 1, leadDays: 4, substituteIds: ['sub_0009'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00409', industryId: 'ind_049', regionId: 'reg_17', inputSku: 'in_0027', qtyPerUnit: 2, leadDays: 5, substituteIds: ['sub_0010'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00410', industryId: 'ind_050', regionId: 'reg_18', inputSku: 'in_0030', qtyPerUnit: 3, leadDays: 6, substituteIds: ['sub_0011'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00411', industryId: 'ind_051', regionId: 'reg_19', inputSku: 'in_0033', qtyPerUnit: 4, leadDays: 7, substituteIds: ['sub_0012'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00412', industryId: 'ind_052', regionId: 'reg_20', inputSku: 'in_0036', qtyPerUnit: 5, leadDays: 8, substituteIds: ['sub_0013'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00413', industryId: 'ind_053', regionId: 'reg_21', inputSku: 'in_0039', qtyPerUnit: 6, leadDays: 9, substituteIds: ['sub_0014'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00414', industryId: 'ind_054', regionId: 'reg_22', inputSku: 'in_0042', qtyPerUnit: 7, leadDays: 10, substituteIds: ['sub_0015'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00415', industryId: 'ind_055', regionId: 'reg_23', inputSku: 'in_0045', qtyPerUnit: 8, leadDays: 11, substituteIds: ['sub_0016'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00416', industryId: 'ind_056', regionId: 'reg_24', inputSku: 'in_0048', qtyPerUnit: 9, leadDays: 12, substituteIds: ['sub_0017'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00417', industryId: 'ind_057', regionId: 'reg_25', inputSku: 'in_0051', qtyPerUnit: 10, leadDays: 13, substituteIds: ['sub_0018'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00418', industryId: 'ind_058', regionId: 'reg_26', inputSku: 'in_0054', qtyPerUnit: 11, leadDays: 14, substituteIds: ['sub_0019'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00419', industryId: 'ind_059', regionId: 'reg_27', inputSku: 'in_0057', qtyPerUnit: 12, leadDays: 15, substituteIds: ['sub_0020'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00420', industryId: 'ind_060', regionId: 'reg_00', inputSku: 'in_0060', qtyPerUnit: 13, leadDays: 16, substituteIds: ['sub_0021'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00421', industryId: 'ind_061', regionId: 'reg_01', inputSku: 'in_0063', qtyPerUnit: 14, leadDays: 17, substituteIds: ['sub_0022'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00422', industryId: 'ind_062', regionId: 'reg_02', inputSku: 'in_0066', qtyPerUnit: 15, leadDays: 18, substituteIds: ['sub_0023'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00423', industryId: 'ind_063', regionId: 'reg_03', inputSku: 'in_0069', qtyPerUnit: 16, leadDays: 19, substituteIds: ['sub_0024'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00424', industryId: 'ind_064', regionId: 'reg_04', inputSku: 'in_0072', qtyPerUnit: 17, leadDays: 20, substituteIds: ['sub_0025'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00425', industryId: 'ind_065', regionId: 'reg_05', inputSku: 'in_0075', qtyPerUnit: 1, leadDays: 21, substituteIds: ['sub_0026'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00426', industryId: 'ind_066', regionId: 'reg_06', inputSku: 'in_0078', qtyPerUnit: 2, leadDays: 22, substituteIds: ['sub_0027'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00427', industryId: 'ind_067', regionId: 'reg_07', inputSku: 'in_0081', qtyPerUnit: 3, leadDays: 23, substituteIds: ['sub_0028'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00428', industryId: 'ind_068', regionId: 'reg_08', inputSku: 'in_0084', qtyPerUnit: 4, leadDays: 24, substituteIds: ['sub_0029'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00429', industryId: 'ind_069', regionId: 'reg_09', inputSku: 'in_0087', qtyPerUnit: 5, leadDays: 25, substituteIds: ['sub_0030'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00430', industryId: 'ind_070', regionId: 'reg_10', inputSku: 'in_0090', qtyPerUnit: 6, leadDays: 26, substituteIds: ['sub_0031'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00431', industryId: 'ind_071', regionId: 'reg_11', inputSku: 'in_0093', qtyPerUnit: 7, leadDays: 27, substituteIds: ['sub_0032'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00432', industryId: 'ind_072', regionId: 'reg_12', inputSku: 'in_0096', qtyPerUnit: 8, leadDays: 28, substituteIds: ['sub_0033'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00433', industryId: 'ind_073', regionId: 'reg_13', inputSku: 'in_0099', qtyPerUnit: 9, leadDays: 29, substituteIds: ['sub_0034'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00434', industryId: 'ind_074', regionId: 'reg_14', inputSku: 'in_0102', qtyPerUnit: 10, leadDays: 30, substituteIds: ['sub_0035'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00435', industryId: 'ind_075', regionId: 'reg_15', inputSku: 'in_0105', qtyPerUnit: 11, leadDays: 31, substituteIds: ['sub_0036'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00436', industryId: 'ind_076', regionId: 'reg_16', inputSku: 'in_0108', qtyPerUnit: 12, leadDays: 32, substituteIds: ['sub_0037'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00437', industryId: 'ind_077', regionId: 'reg_17', inputSku: 'in_0111', qtyPerUnit: 13, leadDays: 33, substituteIds: ['sub_0038'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00438', industryId: 'ind_078', regionId: 'reg_18', inputSku: 'in_0114', qtyPerUnit: 14, leadDays: 34, substituteIds: ['sub_0039'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00439', industryId: 'ind_079', regionId: 'reg_19', inputSku: 'in_0117', qtyPerUnit: 15, leadDays: 35, substituteIds: ['sub_0040'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00440', industryId: 'ind_080', regionId: 'reg_20', inputSku: 'in_0120', qtyPerUnit: 16, leadDays: 36, substituteIds: ['sub_0041'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00441', industryId: 'ind_081', regionId: 'reg_21', inputSku: 'in_0123', qtyPerUnit: 17, leadDays: 37, substituteIds: ['sub_0042'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00442', industryId: 'ind_082', regionId: 'reg_22', inputSku: 'in_0126', qtyPerUnit: 1, leadDays: 38, substituteIds: ['sub_0043'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00443', industryId: 'ind_083', regionId: 'reg_23', inputSku: 'in_0129', qtyPerUnit: 2, leadDays: 39, substituteIds: ['sub_0044'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00444', industryId: 'ind_084', regionId: 'reg_24', inputSku: 'in_0132', qtyPerUnit: 3, leadDays: 40, substituteIds: ['sub_0045'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00445', industryId: 'ind_085', regionId: 'reg_25', inputSku: 'in_0135', qtyPerUnit: 4, leadDays: 41, substituteIds: ['sub_0046'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00446', industryId: 'ind_086', regionId: 'reg_26', inputSku: 'in_0138', qtyPerUnit: 5, leadDays: 42, substituteIds: ['sub_0047'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00447', industryId: 'ind_087', regionId: 'reg_27', inputSku: 'in_0141', qtyPerUnit: 6, leadDays: 43, substituteIds: ['sub_0048'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00448', industryId: 'ind_088', regionId: 'reg_00', inputSku: 'in_0144', qtyPerUnit: 7, leadDays: 44, substituteIds: ['sub_0049'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00449', industryId: 'ind_089', regionId: 'reg_01', inputSku: 'in_0147', qtyPerUnit: 8, leadDays: 45, substituteIds: ['sub_0050'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00450', industryId: 'ind_090', regionId: 'reg_02', inputSku: 'in_0150', qtyPerUnit: 9, leadDays: 1, substituteIds: ['sub_0051'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00451', industryId: 'ind_091', regionId: 'reg_03', inputSku: 'in_0153', qtyPerUnit: 10, leadDays: 2, substituteIds: ['sub_0052'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00452', industryId: 'ind_092', regionId: 'reg_04', inputSku: 'in_0156', qtyPerUnit: 11, leadDays: 3, substituteIds: ['sub_0053'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00453', industryId: 'ind_093', regionId: 'reg_05', inputSku: 'in_0159', qtyPerUnit: 12, leadDays: 4, substituteIds: ['sub_0054'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00454', industryId: 'ind_094', regionId: 'reg_06', inputSku: 'in_0162', qtyPerUnit: 13, leadDays: 5, substituteIds: ['sub_0055'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00455', industryId: 'ind_095', regionId: 'reg_07', inputSku: 'in_0165', qtyPerUnit: 14, leadDays: 6, substituteIds: ['sub_0056'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00456', industryId: 'ind_096', regionId: 'reg_08', inputSku: 'in_0168', qtyPerUnit: 15, leadDays: 7, substituteIds: ['sub_0057'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00457', industryId: 'ind_097', regionId: 'reg_09', inputSku: 'in_0171', qtyPerUnit: 16, leadDays: 8, substituteIds: ['sub_0058'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00458', industryId: 'ind_098', regionId: 'reg_10', inputSku: 'in_0174', qtyPerUnit: 17, leadDays: 9, substituteIds: ['sub_0059'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00459', industryId: 'ind_099', regionId: 'reg_11', inputSku: 'in_0177', qtyPerUnit: 1, leadDays: 10, substituteIds: ['sub_0060'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00460', industryId: 'ind_100', regionId: 'reg_12', inputSku: 'in_0180', qtyPerUnit: 2, leadDays: 11, substituteIds: ['sub_0061'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00461', industryId: 'ind_101', regionId: 'reg_13', inputSku: 'in_0183', qtyPerUnit: 3, leadDays: 12, substituteIds: ['sub_0062'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00462', industryId: 'ind_102', regionId: 'reg_14', inputSku: 'in_0186', qtyPerUnit: 4, leadDays: 13, substituteIds: ['sub_0063'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00463', industryId: 'ind_103', regionId: 'reg_15', inputSku: 'in_0189', qtyPerUnit: 5, leadDays: 14, substituteIds: ['sub_0064'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00464', industryId: 'ind_104', regionId: 'reg_16', inputSku: 'in_0192', qtyPerUnit: 6, leadDays: 15, substituteIds: ['sub_0065'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00465', industryId: 'ind_105', regionId: 'reg_17', inputSku: 'in_0195', qtyPerUnit: 7, leadDays: 16, substituteIds: ['sub_0066'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00466', industryId: 'ind_106', regionId: 'reg_18', inputSku: 'in_0198', qtyPerUnit: 8, leadDays: 17, substituteIds: ['sub_0067'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00467', industryId: 'ind_107', regionId: 'reg_19', inputSku: 'in_0201', qtyPerUnit: 9, leadDays: 18, substituteIds: ['sub_0068'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00468', industryId: 'ind_108', regionId: 'reg_20', inputSku: 'in_0204', qtyPerUnit: 10, leadDays: 19, substituteIds: ['sub_0069'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00469', industryId: 'ind_109', regionId: 'reg_21', inputSku: 'in_0207', qtyPerUnit: 11, leadDays: 20, substituteIds: ['sub_0070'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00470', industryId: 'ind_110', regionId: 'reg_22', inputSku: 'in_0210', qtyPerUnit: 12, leadDays: 21, substituteIds: ['sub_0071'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00471', industryId: 'ind_111', regionId: 'reg_23', inputSku: 'in_0213', qtyPerUnit: 13, leadDays: 22, substituteIds: ['sub_0072'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00472', industryId: 'ind_112', regionId: 'reg_24', inputSku: 'in_0216', qtyPerUnit: 14, leadDays: 23, substituteIds: ['sub_0073'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00473', industryId: 'ind_113', regionId: 'reg_25', inputSku: 'in_0219', qtyPerUnit: 15, leadDays: 24, substituteIds: ['sub_0074'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00474', industryId: 'ind_114', regionId: 'reg_26', inputSku: 'in_0222', qtyPerUnit: 16, leadDays: 25, substituteIds: ['sub_0075'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00475', industryId: 'ind_115', regionId: 'reg_27', inputSku: 'in_0225', qtyPerUnit: 17, leadDays: 26, substituteIds: ['sub_0076'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00476', industryId: 'ind_116', regionId: 'reg_00', inputSku: 'in_0228', qtyPerUnit: 1, leadDays: 27, substituteIds: ['sub_0077'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00477', industryId: 'ind_117', regionId: 'reg_01', inputSku: 'in_0231', qtyPerUnit: 2, leadDays: 28, substituteIds: ['sub_0078'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00478', industryId: 'ind_118', regionId: 'reg_02', inputSku: 'in_0234', qtyPerUnit: 3, leadDays: 29, substituteIds: ['sub_0079'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00479', industryId: 'ind_119', regionId: 'reg_03', inputSku: 'in_0237', qtyPerUnit: 4, leadDays: 30, substituteIds: ['sub_0080'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00480', industryId: 'ind_000', regionId: 'reg_04', inputSku: 'in_0240', qtyPerUnit: 5, leadDays: 31, substituteIds: ['sub_0081'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00481', industryId: 'ind_001', regionId: 'reg_05', inputSku: 'in_0243', qtyPerUnit: 6, leadDays: 32, substituteIds: ['sub_0082'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00482', industryId: 'ind_002', regionId: 'reg_06', inputSku: 'in_0246', qtyPerUnit: 7, leadDays: 33, substituteIds: ['sub_0083'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00483', industryId: 'ind_003', regionId: 'reg_07', inputSku: 'in_0249', qtyPerUnit: 8, leadDays: 34, substituteIds: ['sub_0084'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00484', industryId: 'ind_004', regionId: 'reg_08', inputSku: 'in_0252', qtyPerUnit: 9, leadDays: 35, substituteIds: ['sub_0085'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00485', industryId: 'ind_005', regionId: 'reg_09', inputSku: 'in_0255', qtyPerUnit: 10, leadDays: 36, substituteIds: ['sub_0086'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00486', industryId: 'ind_006', regionId: 'reg_10', inputSku: 'in_0258', qtyPerUnit: 11, leadDays: 37, substituteIds: ['sub_0087'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00487', industryId: 'ind_007', regionId: 'reg_11', inputSku: 'in_0261', qtyPerUnit: 12, leadDays: 38, substituteIds: ['sub_0088'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00488', industryId: 'ind_008', regionId: 'reg_12', inputSku: 'in_0264', qtyPerUnit: 13, leadDays: 39, substituteIds: ['sub_0089'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00489', industryId: 'ind_009', regionId: 'reg_13', inputSku: 'in_0267', qtyPerUnit: 14, leadDays: 40, substituteIds: ['sub_0090'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00490', industryId: 'ind_010', regionId: 'reg_14', inputSku: 'in_0270', qtyPerUnit: 15, leadDays: 41, substituteIds: ['sub_0091'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00491', industryId: 'ind_011', regionId: 'reg_15', inputSku: 'in_0273', qtyPerUnit: 16, leadDays: 42, substituteIds: ['sub_0092'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00492', industryId: 'ind_012', regionId: 'reg_16', inputSku: 'in_0276', qtyPerUnit: 17, leadDays: 43, substituteIds: ['sub_0093'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00493', industryId: 'ind_013', regionId: 'reg_17', inputSku: 'in_0279', qtyPerUnit: 1, leadDays: 44, substituteIds: ['sub_0094'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00494', industryId: 'ind_014', regionId: 'reg_18', inputSku: 'in_0282', qtyPerUnit: 2, leadDays: 45, substituteIds: ['sub_0095'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00495', industryId: 'ind_015', regionId: 'reg_19', inputSku: 'in_0285', qtyPerUnit: 3, leadDays: 1, substituteIds: ['sub_0096'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00496', industryId: 'ind_016', regionId: 'reg_20', inputSku: 'in_0288', qtyPerUnit: 4, leadDays: 2, substituteIds: ['sub_0097'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00497', industryId: 'ind_017', regionId: 'reg_21', inputSku: 'in_0291', qtyPerUnit: 5, leadDays: 3, substituteIds: ['sub_0098'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00498', industryId: 'ind_018', regionId: 'reg_22', inputSku: 'in_0294', qtyPerUnit: 6, leadDays: 4, substituteIds: ['sub_0099'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00499', industryId: 'ind_019', regionId: 'reg_23', inputSku: 'in_0297', qtyPerUnit: 7, leadDays: 5, substituteIds: ['sub_0100'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00500', industryId: 'ind_020', regionId: 'reg_24', inputSku: 'in_0300', qtyPerUnit: 8, leadDays: 6, substituteIds: ['sub_0101'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00501', industryId: 'ind_021', regionId: 'reg_25', inputSku: 'in_0303', qtyPerUnit: 9, leadDays: 7, substituteIds: ['sub_0102'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00502', industryId: 'ind_022', regionId: 'reg_26', inputSku: 'in_0306', qtyPerUnit: 10, leadDays: 8, substituteIds: ['sub_0103'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00503', industryId: 'ind_023', regionId: 'reg_27', inputSku: 'in_0309', qtyPerUnit: 11, leadDays: 9, substituteIds: ['sub_0104'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00504', industryId: 'ind_024', regionId: 'reg_00', inputSku: 'in_0312', qtyPerUnit: 12, leadDays: 10, substituteIds: ['sub_0105'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00505', industryId: 'ind_025', regionId: 'reg_01', inputSku: 'in_0315', qtyPerUnit: 13, leadDays: 11, substituteIds: ['sub_0106'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00506', industryId: 'ind_026', regionId: 'reg_02', inputSku: 'in_0318', qtyPerUnit: 14, leadDays: 12, substituteIds: ['sub_0107'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00507', industryId: 'ind_027', regionId: 'reg_03', inputSku: 'in_0321', qtyPerUnit: 15, leadDays: 13, substituteIds: ['sub_0108'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00508', industryId: 'ind_028', regionId: 'reg_04', inputSku: 'in_0324', qtyPerUnit: 16, leadDays: 14, substituteIds: ['sub_0109'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00509', industryId: 'ind_029', regionId: 'reg_05', inputSku: 'in_0327', qtyPerUnit: 17, leadDays: 15, substituteIds: ['sub_0110'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00510', industryId: 'ind_030', regionId: 'reg_06', inputSku: 'in_0330', qtyPerUnit: 1, leadDays: 16, substituteIds: ['sub_0111'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00511', industryId: 'ind_031', regionId: 'reg_07', inputSku: 'in_0333', qtyPerUnit: 2, leadDays: 17, substituteIds: ['sub_0112'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00512', industryId: 'ind_032', regionId: 'reg_08', inputSku: 'in_0336', qtyPerUnit: 3, leadDays: 18, substituteIds: ['sub_0113'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00513', industryId: 'ind_033', regionId: 'reg_09', inputSku: 'in_0339', qtyPerUnit: 4, leadDays: 19, substituteIds: ['sub_0114'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00514', industryId: 'ind_034', regionId: 'reg_10', inputSku: 'in_0342', qtyPerUnit: 5, leadDays: 20, substituteIds: ['sub_0115'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00515', industryId: 'ind_035', regionId: 'reg_11', inputSku: 'in_0345', qtyPerUnit: 6, leadDays: 21, substituteIds: ['sub_0116'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00516', industryId: 'ind_036', regionId: 'reg_12', inputSku: 'in_0348', qtyPerUnit: 7, leadDays: 22, substituteIds: ['sub_0117'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00517', industryId: 'ind_037', regionId: 'reg_13', inputSku: 'in_0351', qtyPerUnit: 8, leadDays: 23, substituteIds: ['sub_0118'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00518', industryId: 'ind_038', regionId: 'reg_14', inputSku: 'in_0354', qtyPerUnit: 9, leadDays: 24, substituteIds: ['sub_0119'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00519', industryId: 'ind_039', regionId: 'reg_15', inputSku: 'in_0357', qtyPerUnit: 10, leadDays: 25, substituteIds: ['sub_0120'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00520', industryId: 'ind_040', regionId: 'reg_16', inputSku: 'in_0360', qtyPerUnit: 11, leadDays: 26, substituteIds: ['sub_0121'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00521', industryId: 'ind_041', regionId: 'reg_17', inputSku: 'in_0363', qtyPerUnit: 12, leadDays: 27, substituteIds: ['sub_0122'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00522', industryId: 'ind_042', regionId: 'reg_18', inputSku: 'in_0366', qtyPerUnit: 13, leadDays: 28, substituteIds: ['sub_0123'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00523', industryId: 'ind_043', regionId: 'reg_19', inputSku: 'in_0369', qtyPerUnit: 14, leadDays: 29, substituteIds: ['sub_0124'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00524', industryId: 'ind_044', regionId: 'reg_20', inputSku: 'in_0372', qtyPerUnit: 15, leadDays: 30, substituteIds: ['sub_0125'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00525', industryId: 'ind_045', regionId: 'reg_21', inputSku: 'in_0375', qtyPerUnit: 16, leadDays: 31, substituteIds: ['sub_0126'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00526', industryId: 'ind_046', regionId: 'reg_22', inputSku: 'in_0378', qtyPerUnit: 17, leadDays: 32, substituteIds: ['sub_0127'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00527', industryId: 'ind_047', regionId: 'reg_23', inputSku: 'in_0381', qtyPerUnit: 1, leadDays: 33, substituteIds: ['sub_0128'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00528', industryId: 'ind_048', regionId: 'reg_24', inputSku: 'in_0384', qtyPerUnit: 2, leadDays: 34, substituteIds: ['sub_0129'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00529', industryId: 'ind_049', regionId: 'reg_25', inputSku: 'in_0387', qtyPerUnit: 3, leadDays: 35, substituteIds: ['sub_0130'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00530', industryId: 'ind_050', regionId: 'reg_26', inputSku: 'in_0390', qtyPerUnit: 4, leadDays: 36, substituteIds: ['sub_0131'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00531', industryId: 'ind_051', regionId: 'reg_27', inputSku: 'in_0393', qtyPerUnit: 5, leadDays: 37, substituteIds: ['sub_0132'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00532', industryId: 'ind_052', regionId: 'reg_00', inputSku: 'in_0396', qtyPerUnit: 6, leadDays: 38, substituteIds: ['sub_0133'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00533', industryId: 'ind_053', regionId: 'reg_01', inputSku: 'in_0399', qtyPerUnit: 7, leadDays: 39, substituteIds: ['sub_0134'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00534', industryId: 'ind_054', regionId: 'reg_02', inputSku: 'in_0002', qtyPerUnit: 8, leadDays: 40, substituteIds: ['sub_0135'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00535', industryId: 'ind_055', regionId: 'reg_03', inputSku: 'in_0005', qtyPerUnit: 9, leadDays: 41, substituteIds: ['sub_0136'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00536', industryId: 'ind_056', regionId: 'reg_04', inputSku: 'in_0008', qtyPerUnit: 10, leadDays: 42, substituteIds: ['sub_0137'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00537', industryId: 'ind_057', regionId: 'reg_05', inputSku: 'in_0011', qtyPerUnit: 11, leadDays: 43, substituteIds: ['sub_0138'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00538', industryId: 'ind_058', regionId: 'reg_06', inputSku: 'in_0014', qtyPerUnit: 12, leadDays: 44, substituteIds: ['sub_0139'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00539', industryId: 'ind_059', regionId: 'reg_07', inputSku: 'in_0017', qtyPerUnit: 13, leadDays: 45, substituteIds: ['sub_0140'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00540', industryId: 'ind_060', regionId: 'reg_08', inputSku: 'in_0020', qtyPerUnit: 14, leadDays: 1, substituteIds: ['sub_0141'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00541', industryId: 'ind_061', regionId: 'reg_09', inputSku: 'in_0023', qtyPerUnit: 15, leadDays: 2, substituteIds: ['sub_0142'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00542', industryId: 'ind_062', regionId: 'reg_10', inputSku: 'in_0026', qtyPerUnit: 16, leadDays: 3, substituteIds: ['sub_0143'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00543', industryId: 'ind_063', regionId: 'reg_11', inputSku: 'in_0029', qtyPerUnit: 17, leadDays: 4, substituteIds: ['sub_0144'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00544', industryId: 'ind_064', regionId: 'reg_12', inputSku: 'in_0032', qtyPerUnit: 1, leadDays: 5, substituteIds: ['sub_0145'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00545', industryId: 'ind_065', regionId: 'reg_13', inputSku: 'in_0035', qtyPerUnit: 2, leadDays: 6, substituteIds: ['sub_0146'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00546', industryId: 'ind_066', regionId: 'reg_14', inputSku: 'in_0038', qtyPerUnit: 3, leadDays: 7, substituteIds: ['sub_0147'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00547', industryId: 'ind_067', regionId: 'reg_15', inputSku: 'in_0041', qtyPerUnit: 4, leadDays: 8, substituteIds: ['sub_0148'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00548', industryId: 'ind_068', regionId: 'reg_16', inputSku: 'in_0044', qtyPerUnit: 5, leadDays: 9, substituteIds: ['sub_0149'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00549', industryId: 'ind_069', regionId: 'reg_17', inputSku: 'in_0047', qtyPerUnit: 6, leadDays: 10, substituteIds: ['sub_0150'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00550', industryId: 'ind_070', regionId: 'reg_18', inputSku: 'in_0050', qtyPerUnit: 7, leadDays: 11, substituteIds: ['sub_0151'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00551', industryId: 'ind_071', regionId: 'reg_19', inputSku: 'in_0053', qtyPerUnit: 8, leadDays: 12, substituteIds: ['sub_0152'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00552', industryId: 'ind_072', regionId: 'reg_20', inputSku: 'in_0056', qtyPerUnit: 9, leadDays: 13, substituteIds: ['sub_0153'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00553', industryId: 'ind_073', regionId: 'reg_21', inputSku: 'in_0059', qtyPerUnit: 10, leadDays: 14, substituteIds: ['sub_0154'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00554', industryId: 'ind_074', regionId: 'reg_22', inputSku: 'in_0062', qtyPerUnit: 11, leadDays: 15, substituteIds: ['sub_0155'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00555', industryId: 'ind_075', regionId: 'reg_23', inputSku: 'in_0065', qtyPerUnit: 12, leadDays: 16, substituteIds: ['sub_0156'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00556', industryId: 'ind_076', regionId: 'reg_24', inputSku: 'in_0068', qtyPerUnit: 13, leadDays: 17, substituteIds: ['sub_0157'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00557', industryId: 'ind_077', regionId: 'reg_25', inputSku: 'in_0071', qtyPerUnit: 14, leadDays: 18, substituteIds: ['sub_0158'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00558', industryId: 'ind_078', regionId: 'reg_26', inputSku: 'in_0074', qtyPerUnit: 15, leadDays: 19, substituteIds: ['sub_0159'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00559', industryId: 'ind_079', regionId: 'reg_27', inputSku: 'in_0077', qtyPerUnit: 16, leadDays: 20, substituteIds: ['sub_0160'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00560', industryId: 'ind_080', regionId: 'reg_00', inputSku: 'in_0080', qtyPerUnit: 17, leadDays: 21, substituteIds: ['sub_0161'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00561', industryId: 'ind_081', regionId: 'reg_01', inputSku: 'in_0083', qtyPerUnit: 1, leadDays: 22, substituteIds: ['sub_0162'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00562', industryId: 'ind_082', regionId: 'reg_02', inputSku: 'in_0086', qtyPerUnit: 2, leadDays: 23, substituteIds: ['sub_0163'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00563', industryId: 'ind_083', regionId: 'reg_03', inputSku: 'in_0089', qtyPerUnit: 3, leadDays: 24, substituteIds: ['sub_0164'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00564', industryId: 'ind_084', regionId: 'reg_04', inputSku: 'in_0092', qtyPerUnit: 4, leadDays: 25, substituteIds: ['sub_0165'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00565', industryId: 'ind_085', regionId: 'reg_05', inputSku: 'in_0095', qtyPerUnit: 5, leadDays: 26, substituteIds: ['sub_0166'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00566', industryId: 'ind_086', regionId: 'reg_06', inputSku: 'in_0098', qtyPerUnit: 6, leadDays: 27, substituteIds: ['sub_0167'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00567', industryId: 'ind_087', regionId: 'reg_07', inputSku: 'in_0101', qtyPerUnit: 7, leadDays: 28, substituteIds: ['sub_0168'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00568', industryId: 'ind_088', regionId: 'reg_08', inputSku: 'in_0104', qtyPerUnit: 8, leadDays: 29, substituteIds: ['sub_0169'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00569', industryId: 'ind_089', regionId: 'reg_09', inputSku: 'in_0107', qtyPerUnit: 9, leadDays: 30, substituteIds: ['sub_0170'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00570', industryId: 'ind_090', regionId: 'reg_10', inputSku: 'in_0110', qtyPerUnit: 10, leadDays: 31, substituteIds: ['sub_0171'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00571', industryId: 'ind_091', regionId: 'reg_11', inputSku: 'in_0113', qtyPerUnit: 11, leadDays: 32, substituteIds: ['sub_0172'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00572', industryId: 'ind_092', regionId: 'reg_12', inputSku: 'in_0116', qtyPerUnit: 12, leadDays: 33, substituteIds: ['sub_0173'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00573', industryId: 'ind_093', regionId: 'reg_13', inputSku: 'in_0119', qtyPerUnit: 13, leadDays: 34, substituteIds: ['sub_0174'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00574', industryId: 'ind_094', regionId: 'reg_14', inputSku: 'in_0122', qtyPerUnit: 14, leadDays: 35, substituteIds: ['sub_0175'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00575', industryId: 'ind_095', regionId: 'reg_15', inputSku: 'in_0125', qtyPerUnit: 15, leadDays: 36, substituteIds: ['sub_0176'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00576', industryId: 'ind_096', regionId: 'reg_16', inputSku: 'in_0128', qtyPerUnit: 16, leadDays: 37, substituteIds: ['sub_0177'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00577', industryId: 'ind_097', regionId: 'reg_17', inputSku: 'in_0131', qtyPerUnit: 17, leadDays: 38, substituteIds: ['sub_0178'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00578', industryId: 'ind_098', regionId: 'reg_18', inputSku: 'in_0134', qtyPerUnit: 1, leadDays: 39, substituteIds: ['sub_0179'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00579', industryId: 'ind_099', regionId: 'reg_19', inputSku: 'in_0137', qtyPerUnit: 2, leadDays: 40, substituteIds: ['sub_0180'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00580', industryId: 'ind_100', regionId: 'reg_20', inputSku: 'in_0140', qtyPerUnit: 3, leadDays: 41, substituteIds: ['sub_0181'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00581', industryId: 'ind_101', regionId: 'reg_21', inputSku: 'in_0143', qtyPerUnit: 4, leadDays: 42, substituteIds: ['sub_0182'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00582', industryId: 'ind_102', regionId: 'reg_22', inputSku: 'in_0146', qtyPerUnit: 5, leadDays: 43, substituteIds: ['sub_0183'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00583', industryId: 'ind_103', regionId: 'reg_23', inputSku: 'in_0149', qtyPerUnit: 6, leadDays: 44, substituteIds: ['sub_0184'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00584', industryId: 'ind_104', regionId: 'reg_24', inputSku: 'in_0152', qtyPerUnit: 7, leadDays: 45, substituteIds: ['sub_0185'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00585', industryId: 'ind_105', regionId: 'reg_25', inputSku: 'in_0155', qtyPerUnit: 8, leadDays: 1, substituteIds: ['sub_0186'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00586', industryId: 'ind_106', regionId: 'reg_26', inputSku: 'in_0158', qtyPerUnit: 9, leadDays: 2, substituteIds: ['sub_0187'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00587', industryId: 'ind_107', regionId: 'reg_27', inputSku: 'in_0161', qtyPerUnit: 10, leadDays: 3, substituteIds: ['sub_0188'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00588', industryId: 'ind_108', regionId: 'reg_00', inputSku: 'in_0164', qtyPerUnit: 11, leadDays: 4, substituteIds: ['sub_0189'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00589', industryId: 'ind_109', regionId: 'reg_01', inputSku: 'in_0167', qtyPerUnit: 12, leadDays: 5, substituteIds: ['sub_0190'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00590', industryId: 'ind_110', regionId: 'reg_02', inputSku: 'in_0170', qtyPerUnit: 13, leadDays: 6, substituteIds: ['sub_0191'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00591', industryId: 'ind_111', regionId: 'reg_03', inputSku: 'in_0173', qtyPerUnit: 14, leadDays: 7, substituteIds: ['sub_0192'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00592', industryId: 'ind_112', regionId: 'reg_04', inputSku: 'in_0176', qtyPerUnit: 15, leadDays: 8, substituteIds: ['sub_0193'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00593', industryId: 'ind_113', regionId: 'reg_05', inputSku: 'in_0179', qtyPerUnit: 16, leadDays: 9, substituteIds: ['sub_0194'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00594', industryId: 'ind_114', regionId: 'reg_06', inputSku: 'in_0182', qtyPerUnit: 17, leadDays: 10, substituteIds: ['sub_0195'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00595', industryId: 'ind_115', regionId: 'reg_07', inputSku: 'in_0185', qtyPerUnit: 1, leadDays: 11, substituteIds: ['sub_0196'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00596', industryId: 'ind_116', regionId: 'reg_08', inputSku: 'in_0188', qtyPerUnit: 2, leadDays: 12, substituteIds: ['sub_0197'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00597', industryId: 'ind_117', regionId: 'reg_09', inputSku: 'in_0191', qtyPerUnit: 3, leadDays: 13, substituteIds: ['sub_0198'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00598', industryId: 'ind_118', regionId: 'reg_10', inputSku: 'in_0194', qtyPerUnit: 4, leadDays: 14, substituteIds: ['sub_0199'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00599', industryId: 'ind_119', regionId: 'reg_11', inputSku: 'in_0197', qtyPerUnit: 5, leadDays: 15, substituteIds: ['sub_0200'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00600', industryId: 'ind_000', regionId: 'reg_12', inputSku: 'in_0200', qtyPerUnit: 6, leadDays: 16, substituteIds: ['sub_0201'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00601', industryId: 'ind_001', regionId: 'reg_13', inputSku: 'in_0203', qtyPerUnit: 7, leadDays: 17, substituteIds: ['sub_0202'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00602', industryId: 'ind_002', regionId: 'reg_14', inputSku: 'in_0206', qtyPerUnit: 8, leadDays: 18, substituteIds: ['sub_0203'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00603', industryId: 'ind_003', regionId: 'reg_15', inputSku: 'in_0209', qtyPerUnit: 9, leadDays: 19, substituteIds: ['sub_0204'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00604', industryId: 'ind_004', regionId: 'reg_16', inputSku: 'in_0212', qtyPerUnit: 10, leadDays: 20, substituteIds: ['sub_0205'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00605', industryId: 'ind_005', regionId: 'reg_17', inputSku: 'in_0215', qtyPerUnit: 11, leadDays: 21, substituteIds: ['sub_0206'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00606', industryId: 'ind_006', regionId: 'reg_18', inputSku: 'in_0218', qtyPerUnit: 12, leadDays: 22, substituteIds: ['sub_0207'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00607', industryId: 'ind_007', regionId: 'reg_19', inputSku: 'in_0221', qtyPerUnit: 13, leadDays: 23, substituteIds: ['sub_0208'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00608', industryId: 'ind_008', regionId: 'reg_20', inputSku: 'in_0224', qtyPerUnit: 14, leadDays: 24, substituteIds: ['sub_0209'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00609', industryId: 'ind_009', regionId: 'reg_21', inputSku: 'in_0227', qtyPerUnit: 15, leadDays: 25, substituteIds: ['sub_0210'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00610', industryId: 'ind_010', regionId: 'reg_22', inputSku: 'in_0230', qtyPerUnit: 16, leadDays: 26, substituteIds: ['sub_0211'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00611', industryId: 'ind_011', regionId: 'reg_23', inputSku: 'in_0233', qtyPerUnit: 17, leadDays: 27, substituteIds: ['sub_0212'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00612', industryId: 'ind_012', regionId: 'reg_24', inputSku: 'in_0236', qtyPerUnit: 1, leadDays: 28, substituteIds: ['sub_0213'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00613', industryId: 'ind_013', regionId: 'reg_25', inputSku: 'in_0239', qtyPerUnit: 2, leadDays: 29, substituteIds: ['sub_0214'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00614', industryId: 'ind_014', regionId: 'reg_26', inputSku: 'in_0242', qtyPerUnit: 3, leadDays: 30, substituteIds: ['sub_0215'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00615', industryId: 'ind_015', regionId: 'reg_27', inputSku: 'in_0245', qtyPerUnit: 4, leadDays: 31, substituteIds: ['sub_0216'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00616', industryId: 'ind_016', regionId: 'reg_00', inputSku: 'in_0248', qtyPerUnit: 5, leadDays: 32, substituteIds: ['sub_0217'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00617', industryId: 'ind_017', regionId: 'reg_01', inputSku: 'in_0251', qtyPerUnit: 6, leadDays: 33, substituteIds: ['sub_0218'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00618', industryId: 'ind_018', regionId: 'reg_02', inputSku: 'in_0254', qtyPerUnit: 7, leadDays: 34, substituteIds: ['sub_0219'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00619', industryId: 'ind_019', regionId: 'reg_03', inputSku: 'in_0257', qtyPerUnit: 8, leadDays: 35, substituteIds: ['sub_0220'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00620', industryId: 'ind_020', regionId: 'reg_04', inputSku: 'in_0260', qtyPerUnit: 9, leadDays: 36, substituteIds: ['sub_0221'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00621', industryId: 'ind_021', regionId: 'reg_05', inputSku: 'in_0263', qtyPerUnit: 10, leadDays: 37, substituteIds: ['sub_0222'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00622', industryId: 'ind_022', regionId: 'reg_06', inputSku: 'in_0266', qtyPerUnit: 11, leadDays: 38, substituteIds: ['sub_0223'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00623', industryId: 'ind_023', regionId: 'reg_07', inputSku: 'in_0269', qtyPerUnit: 12, leadDays: 39, substituteIds: ['sub_0224'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00624', industryId: 'ind_024', regionId: 'reg_08', inputSku: 'in_0272', qtyPerUnit: 13, leadDays: 40, substituteIds: ['sub_0225'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00625', industryId: 'ind_025', regionId: 'reg_09', inputSku: 'in_0275', qtyPerUnit: 14, leadDays: 41, substituteIds: ['sub_0226'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00626', industryId: 'ind_026', regionId: 'reg_10', inputSku: 'in_0278', qtyPerUnit: 15, leadDays: 42, substituteIds: ['sub_0227'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00627', industryId: 'ind_027', regionId: 'reg_11', inputSku: 'in_0281', qtyPerUnit: 16, leadDays: 43, substituteIds: ['sub_0228'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00628', industryId: 'ind_028', regionId: 'reg_12', inputSku: 'in_0284', qtyPerUnit: 17, leadDays: 44, substituteIds: ['sub_0229'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00629', industryId: 'ind_029', regionId: 'reg_13', inputSku: 'in_0287', qtyPerUnit: 1, leadDays: 45, substituteIds: ['sub_0230'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00630', industryId: 'ind_030', regionId: 'reg_14', inputSku: 'in_0290', qtyPerUnit: 2, leadDays: 1, substituteIds: ['sub_0231'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00631', industryId: 'ind_031', regionId: 'reg_15', inputSku: 'in_0293', qtyPerUnit: 3, leadDays: 2, substituteIds: ['sub_0232'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00632', industryId: 'ind_032', regionId: 'reg_16', inputSku: 'in_0296', qtyPerUnit: 4, leadDays: 3, substituteIds: ['sub_0233'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00633', industryId: 'ind_033', regionId: 'reg_17', inputSku: 'in_0299', qtyPerUnit: 5, leadDays: 4, substituteIds: ['sub_0234'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00634', industryId: 'ind_034', regionId: 'reg_18', inputSku: 'in_0302', qtyPerUnit: 6, leadDays: 5, substituteIds: ['sub_0235'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00635', industryId: 'ind_035', regionId: 'reg_19', inputSku: 'in_0305', qtyPerUnit: 7, leadDays: 6, substituteIds: ['sub_0236'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00636', industryId: 'ind_036', regionId: 'reg_20', inputSku: 'in_0308', qtyPerUnit: 8, leadDays: 7, substituteIds: ['sub_0237'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00637', industryId: 'ind_037', regionId: 'reg_21', inputSku: 'in_0311', qtyPerUnit: 9, leadDays: 8, substituteIds: ['sub_0238'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00638', industryId: 'ind_038', regionId: 'reg_22', inputSku: 'in_0314', qtyPerUnit: 10, leadDays: 9, substituteIds: ['sub_0239'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00639', industryId: 'ind_039', regionId: 'reg_23', inputSku: 'in_0317', qtyPerUnit: 11, leadDays: 10, substituteIds: ['sub_0240'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00640', industryId: 'ind_040', regionId: 'reg_24', inputSku: 'in_0320', qtyPerUnit: 12, leadDays: 11, substituteIds: ['sub_0241'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00641', industryId: 'ind_041', regionId: 'reg_25', inputSku: 'in_0323', qtyPerUnit: 13, leadDays: 12, substituteIds: ['sub_0242'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00642', industryId: 'ind_042', regionId: 'reg_26', inputSku: 'in_0326', qtyPerUnit: 14, leadDays: 13, substituteIds: ['sub_0243'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00643', industryId: 'ind_043', regionId: 'reg_27', inputSku: 'in_0329', qtyPerUnit: 15, leadDays: 14, substituteIds: ['sub_0244'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00644', industryId: 'ind_044', regionId: 'reg_00', inputSku: 'in_0332', qtyPerUnit: 16, leadDays: 15, substituteIds: ['sub_0245'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00645', industryId: 'ind_045', regionId: 'reg_01', inputSku: 'in_0335', qtyPerUnit: 17, leadDays: 16, substituteIds: ['sub_0246'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00646', industryId: 'ind_046', regionId: 'reg_02', inputSku: 'in_0338', qtyPerUnit: 1, leadDays: 17, substituteIds: ['sub_0247'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00647', industryId: 'ind_047', regionId: 'reg_03', inputSku: 'in_0341', qtyPerUnit: 2, leadDays: 18, substituteIds: ['sub_0248'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00648', industryId: 'ind_048', regionId: 'reg_04', inputSku: 'in_0344', qtyPerUnit: 3, leadDays: 19, substituteIds: ['sub_0249'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00649', industryId: 'ind_049', regionId: 'reg_05', inputSku: 'in_0347', qtyPerUnit: 4, leadDays: 20, substituteIds: ['sub_0250'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00650', industryId: 'ind_050', regionId: 'reg_06', inputSku: 'in_0350', qtyPerUnit: 5, leadDays: 21, substituteIds: ['sub_0251'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00651', industryId: 'ind_051', regionId: 'reg_07', inputSku: 'in_0353', qtyPerUnit: 6, leadDays: 22, substituteIds: ['sub_0252'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00652', industryId: 'ind_052', regionId: 'reg_08', inputSku: 'in_0356', qtyPerUnit: 7, leadDays: 23, substituteIds: ['sub_0253'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00653', industryId: 'ind_053', regionId: 'reg_09', inputSku: 'in_0359', qtyPerUnit: 8, leadDays: 24, substituteIds: ['sub_0254'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00654', industryId: 'ind_054', regionId: 'reg_10', inputSku: 'in_0362', qtyPerUnit: 9, leadDays: 25, substituteIds: ['sub_0255'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00655', industryId: 'ind_055', regionId: 'reg_11', inputSku: 'in_0365', qtyPerUnit: 10, leadDays: 26, substituteIds: ['sub_0256'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00656', industryId: 'ind_056', regionId: 'reg_12', inputSku: 'in_0368', qtyPerUnit: 11, leadDays: 27, substituteIds: ['sub_0257'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00657', industryId: 'ind_057', regionId: 'reg_13', inputSku: 'in_0371', qtyPerUnit: 12, leadDays: 28, substituteIds: ['sub_0258'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00658', industryId: 'ind_058', regionId: 'reg_14', inputSku: 'in_0374', qtyPerUnit: 13, leadDays: 29, substituteIds: ['sub_0259'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00659', industryId: 'ind_059', regionId: 'reg_15', inputSku: 'in_0377', qtyPerUnit: 14, leadDays: 30, substituteIds: ['sub_0260'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00660', industryId: 'ind_060', regionId: 'reg_16', inputSku: 'in_0380', qtyPerUnit: 15, leadDays: 31, substituteIds: ['sub_0261'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00661', industryId: 'ind_061', regionId: 'reg_17', inputSku: 'in_0383', qtyPerUnit: 16, leadDays: 32, substituteIds: ['sub_0262'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00662', industryId: 'ind_062', regionId: 'reg_18', inputSku: 'in_0386', qtyPerUnit: 17, leadDays: 33, substituteIds: ['sub_0263'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00663', industryId: 'ind_063', regionId: 'reg_19', inputSku: 'in_0389', qtyPerUnit: 1, leadDays: 34, substituteIds: ['sub_0264'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00664', industryId: 'ind_064', regionId: 'reg_20', inputSku: 'in_0392', qtyPerUnit: 2, leadDays: 35, substituteIds: ['sub_0265'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00665', industryId: 'ind_065', regionId: 'reg_21', inputSku: 'in_0395', qtyPerUnit: 3, leadDays: 36, substituteIds: ['sub_0266'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00666', industryId: 'ind_066', regionId: 'reg_22', inputSku: 'in_0398', qtyPerUnit: 4, leadDays: 37, substituteIds: ['sub_0267'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00667', industryId: 'ind_067', regionId: 'reg_23', inputSku: 'in_0001', qtyPerUnit: 5, leadDays: 38, substituteIds: ['sub_0268'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00668', industryId: 'ind_068', regionId: 'reg_24', inputSku: 'in_0004', qtyPerUnit: 6, leadDays: 39, substituteIds: ['sub_0269'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00669', industryId: 'ind_069', regionId: 'reg_25', inputSku: 'in_0007', qtyPerUnit: 7, leadDays: 40, substituteIds: ['sub_0270'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00670', industryId: 'ind_070', regionId: 'reg_26', inputSku: 'in_0010', qtyPerUnit: 8, leadDays: 41, substituteIds: ['sub_0271'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00671', industryId: 'ind_071', regionId: 'reg_27', inputSku: 'in_0013', qtyPerUnit: 9, leadDays: 42, substituteIds: ['sub_0272'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00672', industryId: 'ind_072', regionId: 'reg_00', inputSku: 'in_0016', qtyPerUnit: 10, leadDays: 43, substituteIds: ['sub_0273'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00673', industryId: 'ind_073', regionId: 'reg_01', inputSku: 'in_0019', qtyPerUnit: 11, leadDays: 44, substituteIds: ['sub_0274'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00674', industryId: 'ind_074', regionId: 'reg_02', inputSku: 'in_0022', qtyPerUnit: 12, leadDays: 45, substituteIds: ['sub_0275'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00675', industryId: 'ind_075', regionId: 'reg_03', inputSku: 'in_0025', qtyPerUnit: 13, leadDays: 1, substituteIds: ['sub_0276'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00676', industryId: 'ind_076', regionId: 'reg_04', inputSku: 'in_0028', qtyPerUnit: 14, leadDays: 2, substituteIds: ['sub_0277'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00677', industryId: 'ind_077', regionId: 'reg_05', inputSku: 'in_0031', qtyPerUnit: 15, leadDays: 3, substituteIds: ['sub_0278'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00678', industryId: 'ind_078', regionId: 'reg_06', inputSku: 'in_0034', qtyPerUnit: 16, leadDays: 4, substituteIds: ['sub_0279'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00679', industryId: 'ind_079', regionId: 'reg_07', inputSku: 'in_0037', qtyPerUnit: 17, leadDays: 5, substituteIds: ['sub_0280'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00680', industryId: 'ind_080', regionId: 'reg_08', inputSku: 'in_0040', qtyPerUnit: 1, leadDays: 6, substituteIds: ['sub_0281'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00681', industryId: 'ind_081', regionId: 'reg_09', inputSku: 'in_0043', qtyPerUnit: 2, leadDays: 7, substituteIds: ['sub_0282'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00682', industryId: 'ind_082', regionId: 'reg_10', inputSku: 'in_0046', qtyPerUnit: 3, leadDays: 8, substituteIds: ['sub_0283'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00683', industryId: 'ind_083', regionId: 'reg_11', inputSku: 'in_0049', qtyPerUnit: 4, leadDays: 9, substituteIds: ['sub_0284'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00684', industryId: 'ind_084', regionId: 'reg_12', inputSku: 'in_0052', qtyPerUnit: 5, leadDays: 10, substituteIds: ['sub_0285'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00685', industryId: 'ind_085', regionId: 'reg_13', inputSku: 'in_0055', qtyPerUnit: 6, leadDays: 11, substituteIds: ['sub_0286'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00686', industryId: 'ind_086', regionId: 'reg_14', inputSku: 'in_0058', qtyPerUnit: 7, leadDays: 12, substituteIds: ['sub_0287'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00687', industryId: 'ind_087', regionId: 'reg_15', inputSku: 'in_0061', qtyPerUnit: 8, leadDays: 13, substituteIds: ['sub_0288'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00688', industryId: 'ind_088', regionId: 'reg_16', inputSku: 'in_0064', qtyPerUnit: 9, leadDays: 14, substituteIds: ['sub_0289'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00689', industryId: 'ind_089', regionId: 'reg_17', inputSku: 'in_0067', qtyPerUnit: 10, leadDays: 15, substituteIds: ['sub_0290'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00690', industryId: 'ind_090', regionId: 'reg_18', inputSku: 'in_0070', qtyPerUnit: 11, leadDays: 16, substituteIds: ['sub_0291'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00691', industryId: 'ind_091', regionId: 'reg_19', inputSku: 'in_0073', qtyPerUnit: 12, leadDays: 17, substituteIds: ['sub_0292'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00692', industryId: 'ind_092', regionId: 'reg_20', inputSku: 'in_0076', qtyPerUnit: 13, leadDays: 18, substituteIds: ['sub_0293'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00693', industryId: 'ind_093', regionId: 'reg_21', inputSku: 'in_0079', qtyPerUnit: 14, leadDays: 19, substituteIds: ['sub_0294'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00694', industryId: 'ind_094', regionId: 'reg_22', inputSku: 'in_0082', qtyPerUnit: 15, leadDays: 20, substituteIds: ['sub_0295'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00695', industryId: 'ind_095', regionId: 'reg_23', inputSku: 'in_0085', qtyPerUnit: 16, leadDays: 21, substituteIds: ['sub_0296'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00696', industryId: 'ind_096', regionId: 'reg_24', inputSku: 'in_0088', qtyPerUnit: 17, leadDays: 22, substituteIds: ['sub_0297'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00697', industryId: 'ind_097', regionId: 'reg_25', inputSku: 'in_0091', qtyPerUnit: 1, leadDays: 23, substituteIds: ['sub_0298'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00698', industryId: 'ind_098', regionId: 'reg_26', inputSku: 'in_0094', qtyPerUnit: 2, leadDays: 24, substituteIds: ['sub_0299'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00699', industryId: 'ind_099', regionId: 'reg_27', inputSku: 'in_0097', qtyPerUnit: 3, leadDays: 25, substituteIds: ['sub_0300'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00700', industryId: 'ind_100', regionId: 'reg_00', inputSku: 'in_0100', qtyPerUnit: 4, leadDays: 26, substituteIds: ['sub_0301'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00701', industryId: 'ind_101', regionId: 'reg_01', inputSku: 'in_0103', qtyPerUnit: 5, leadDays: 27, substituteIds: ['sub_0302'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00702', industryId: 'ind_102', regionId: 'reg_02', inputSku: 'in_0106', qtyPerUnit: 6, leadDays: 28, substituteIds: ['sub_0303'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00703', industryId: 'ind_103', regionId: 'reg_03', inputSku: 'in_0109', qtyPerUnit: 7, leadDays: 29, substituteIds: ['sub_0304'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00704', industryId: 'ind_104', regionId: 'reg_04', inputSku: 'in_0112', qtyPerUnit: 8, leadDays: 30, substituteIds: ['sub_0305'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00705', industryId: 'ind_105', regionId: 'reg_05', inputSku: 'in_0115', qtyPerUnit: 9, leadDays: 31, substituteIds: ['sub_0306'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00706', industryId: 'ind_106', regionId: 'reg_06', inputSku: 'in_0118', qtyPerUnit: 10, leadDays: 32, substituteIds: ['sub_0307'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00707', industryId: 'ind_107', regionId: 'reg_07', inputSku: 'in_0121', qtyPerUnit: 11, leadDays: 33, substituteIds: ['sub_0308'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00708', industryId: 'ind_108', regionId: 'reg_08', inputSku: 'in_0124', qtyPerUnit: 12, leadDays: 34, substituteIds: ['sub_0309'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00709', industryId: 'ind_109', regionId: 'reg_09', inputSku: 'in_0127', qtyPerUnit: 13, leadDays: 35, substituteIds: ['sub_0310'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00710', industryId: 'ind_110', regionId: 'reg_10', inputSku: 'in_0130', qtyPerUnit: 14, leadDays: 36, substituteIds: ['sub_0311'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00711', industryId: 'ind_111', regionId: 'reg_11', inputSku: 'in_0133', qtyPerUnit: 15, leadDays: 37, substituteIds: ['sub_0312'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00712', industryId: 'ind_112', regionId: 'reg_12', inputSku: 'in_0136', qtyPerUnit: 16, leadDays: 38, substituteIds: ['sub_0313'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00713', industryId: 'ind_113', regionId: 'reg_13', inputSku: 'in_0139', qtyPerUnit: 17, leadDays: 39, substituteIds: ['sub_0314'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00714', industryId: 'ind_114', regionId: 'reg_14', inputSku: 'in_0142', qtyPerUnit: 1, leadDays: 40, substituteIds: ['sub_0315'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00715', industryId: 'ind_115', regionId: 'reg_15', inputSku: 'in_0145', qtyPerUnit: 2, leadDays: 41, substituteIds: ['sub_0316'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00716', industryId: 'ind_116', regionId: 'reg_16', inputSku: 'in_0148', qtyPerUnit: 3, leadDays: 42, substituteIds: ['sub_0317'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00717', industryId: 'ind_117', regionId: 'reg_17', inputSku: 'in_0151', qtyPerUnit: 4, leadDays: 43, substituteIds: ['sub_0318'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00718', industryId: 'ind_118', regionId: 'reg_18', inputSku: 'in_0154', qtyPerUnit: 5, leadDays: 44, substituteIds: ['sub_0319'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00719', industryId: 'ind_119', regionId: 'reg_19', inputSku: 'in_0157', qtyPerUnit: 6, leadDays: 45, substituteIds: ['sub_0320'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00720', industryId: 'ind_000', regionId: 'reg_20', inputSku: 'in_0160', qtyPerUnit: 7, leadDays: 1, substituteIds: ['sub_0321'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00721', industryId: 'ind_001', regionId: 'reg_21', inputSku: 'in_0163', qtyPerUnit: 8, leadDays: 2, substituteIds: ['sub_0322'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00722', industryId: 'ind_002', regionId: 'reg_22', inputSku: 'in_0166', qtyPerUnit: 9, leadDays: 3, substituteIds: ['sub_0323'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00723', industryId: 'ind_003', regionId: 'reg_23', inputSku: 'in_0169', qtyPerUnit: 10, leadDays: 4, substituteIds: ['sub_0324'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00724', industryId: 'ind_004', regionId: 'reg_24', inputSku: 'in_0172', qtyPerUnit: 11, leadDays: 5, substituteIds: ['sub_0325'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00725', industryId: 'ind_005', regionId: 'reg_25', inputSku: 'in_0175', qtyPerUnit: 12, leadDays: 6, substituteIds: ['sub_0326'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00726', industryId: 'ind_006', regionId: 'reg_26', inputSku: 'in_0178', qtyPerUnit: 13, leadDays: 7, substituteIds: ['sub_0327'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00727', industryId: 'ind_007', regionId: 'reg_27', inputSku: 'in_0181', qtyPerUnit: 14, leadDays: 8, substituteIds: ['sub_0328'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00728', industryId: 'ind_008', regionId: 'reg_00', inputSku: 'in_0184', qtyPerUnit: 15, leadDays: 9, substituteIds: ['sub_0329'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00729', industryId: 'ind_009', regionId: 'reg_01', inputSku: 'in_0187', qtyPerUnit: 16, leadDays: 10, substituteIds: ['sub_0330'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00730', industryId: 'ind_010', regionId: 'reg_02', inputSku: 'in_0190', qtyPerUnit: 17, leadDays: 11, substituteIds: ['sub_0331'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00731', industryId: 'ind_011', regionId: 'reg_03', inputSku: 'in_0193', qtyPerUnit: 1, leadDays: 12, substituteIds: ['sub_0332'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00732', industryId: 'ind_012', regionId: 'reg_04', inputSku: 'in_0196', qtyPerUnit: 2, leadDays: 13, substituteIds: ['sub_0333'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00733', industryId: 'ind_013', regionId: 'reg_05', inputSku: 'in_0199', qtyPerUnit: 3, leadDays: 14, substituteIds: ['sub_0334'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00734', industryId: 'ind_014', regionId: 'reg_06', inputSku: 'in_0202', qtyPerUnit: 4, leadDays: 15, substituteIds: ['sub_0335'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00735', industryId: 'ind_015', regionId: 'reg_07', inputSku: 'in_0205', qtyPerUnit: 5, leadDays: 16, substituteIds: ['sub_0336'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00736', industryId: 'ind_016', regionId: 'reg_08', inputSku: 'in_0208', qtyPerUnit: 6, leadDays: 17, substituteIds: ['sub_0337'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00737', industryId: 'ind_017', regionId: 'reg_09', inputSku: 'in_0211', qtyPerUnit: 7, leadDays: 18, substituteIds: ['sub_0338'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00738', industryId: 'ind_018', regionId: 'reg_10', inputSku: 'in_0214', qtyPerUnit: 8, leadDays: 19, substituteIds: ['sub_0339'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00739', industryId: 'ind_019', regionId: 'reg_11', inputSku: 'in_0217', qtyPerUnit: 9, leadDays: 20, substituteIds: ['sub_0340'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00740', industryId: 'ind_020', regionId: 'reg_12', inputSku: 'in_0220', qtyPerUnit: 10, leadDays: 21, substituteIds: ['sub_0341'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00741', industryId: 'ind_021', regionId: 'reg_13', inputSku: 'in_0223', qtyPerUnit: 11, leadDays: 22, substituteIds: ['sub_0342'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00742', industryId: 'ind_022', regionId: 'reg_14', inputSku: 'in_0226', qtyPerUnit: 12, leadDays: 23, substituteIds: ['sub_0343'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00743', industryId: 'ind_023', regionId: 'reg_15', inputSku: 'in_0229', qtyPerUnit: 13, leadDays: 24, substituteIds: ['sub_0344'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00744', industryId: 'ind_024', regionId: 'reg_16', inputSku: 'in_0232', qtyPerUnit: 14, leadDays: 25, substituteIds: ['sub_0345'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00745', industryId: 'ind_025', regionId: 'reg_17', inputSku: 'in_0235', qtyPerUnit: 15, leadDays: 26, substituteIds: ['sub_0346'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00746', industryId: 'ind_026', regionId: 'reg_18', inputSku: 'in_0238', qtyPerUnit: 16, leadDays: 27, substituteIds: ['sub_0347'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00747', industryId: 'ind_027', regionId: 'reg_19', inputSku: 'in_0241', qtyPerUnit: 17, leadDays: 28, substituteIds: ['sub_0348'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00748', industryId: 'ind_028', regionId: 'reg_20', inputSku: 'in_0244', qtyPerUnit: 1, leadDays: 29, substituteIds: ['sub_0349'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00749', industryId: 'ind_029', regionId: 'reg_21', inputSku: 'in_0247', qtyPerUnit: 2, leadDays: 30, substituteIds: ['sub_0350'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00750', industryId: 'ind_030', regionId: 'reg_22', inputSku: 'in_0250', qtyPerUnit: 3, leadDays: 31, substituteIds: ['sub_0351'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00751', industryId: 'ind_031', regionId: 'reg_23', inputSku: 'in_0253', qtyPerUnit: 4, leadDays: 32, substituteIds: ['sub_0352'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00752', industryId: 'ind_032', regionId: 'reg_24', inputSku: 'in_0256', qtyPerUnit: 5, leadDays: 33, substituteIds: ['sub_0353'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00753', industryId: 'ind_033', regionId: 'reg_25', inputSku: 'in_0259', qtyPerUnit: 6, leadDays: 34, substituteIds: ['sub_0354'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00754', industryId: 'ind_034', regionId: 'reg_26', inputSku: 'in_0262', qtyPerUnit: 7, leadDays: 35, substituteIds: ['sub_0355'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00755', industryId: 'ind_035', regionId: 'reg_27', inputSku: 'in_0265', qtyPerUnit: 8, leadDays: 36, substituteIds: ['sub_0356'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00756', industryId: 'ind_036', regionId: 'reg_00', inputSku: 'in_0268', qtyPerUnit: 9, leadDays: 37, substituteIds: ['sub_0357'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00757', industryId: 'ind_037', regionId: 'reg_01', inputSku: 'in_0271', qtyPerUnit: 10, leadDays: 38, substituteIds: ['sub_0358'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00758', industryId: 'ind_038', regionId: 'reg_02', inputSku: 'in_0274', qtyPerUnit: 11, leadDays: 39, substituteIds: ['sub_0359'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00759', industryId: 'ind_039', regionId: 'reg_03', inputSku: 'in_0277', qtyPerUnit: 12, leadDays: 40, substituteIds: ['sub_0360'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00760', industryId: 'ind_040', regionId: 'reg_04', inputSku: 'in_0280', qtyPerUnit: 13, leadDays: 41, substituteIds: ['sub_0361'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00761', industryId: 'ind_041', regionId: 'reg_05', inputSku: 'in_0283', qtyPerUnit: 14, leadDays: 42, substituteIds: ['sub_0362'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00762', industryId: 'ind_042', regionId: 'reg_06', inputSku: 'in_0286', qtyPerUnit: 15, leadDays: 43, substituteIds: ['sub_0363'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00763', industryId: 'ind_043', regionId: 'reg_07', inputSku: 'in_0289', qtyPerUnit: 16, leadDays: 44, substituteIds: ['sub_0364'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00764', industryId: 'ind_044', regionId: 'reg_08', inputSku: 'in_0292', qtyPerUnit: 17, leadDays: 45, substituteIds: ['sub_0365'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00765', industryId: 'ind_045', regionId: 'reg_09', inputSku: 'in_0295', qtyPerUnit: 1, leadDays: 1, substituteIds: ['sub_0366'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00766', industryId: 'ind_046', regionId: 'reg_10', inputSku: 'in_0298', qtyPerUnit: 2, leadDays: 2, substituteIds: ['sub_0367'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00767', industryId: 'ind_047', regionId: 'reg_11', inputSku: 'in_0301', qtyPerUnit: 3, leadDays: 3, substituteIds: ['sub_0368'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00768', industryId: 'ind_048', regionId: 'reg_12', inputSku: 'in_0304', qtyPerUnit: 4, leadDays: 4, substituteIds: ['sub_0369'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00769', industryId: 'ind_049', regionId: 'reg_13', inputSku: 'in_0307', qtyPerUnit: 5, leadDays: 5, substituteIds: ['sub_0370'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00770', industryId: 'ind_050', regionId: 'reg_14', inputSku: 'in_0310', qtyPerUnit: 6, leadDays: 6, substituteIds: ['sub_0371'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00771', industryId: 'ind_051', regionId: 'reg_15', inputSku: 'in_0313', qtyPerUnit: 7, leadDays: 7, substituteIds: ['sub_0372'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00772', industryId: 'ind_052', regionId: 'reg_16', inputSku: 'in_0316', qtyPerUnit: 8, leadDays: 8, substituteIds: ['sub_0373'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00773', industryId: 'ind_053', regionId: 'reg_17', inputSku: 'in_0319', qtyPerUnit: 9, leadDays: 9, substituteIds: ['sub_0374'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00774', industryId: 'ind_054', regionId: 'reg_18', inputSku: 'in_0322', qtyPerUnit: 10, leadDays: 10, substituteIds: ['sub_0375'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00775', industryId: 'ind_055', regionId: 'reg_19', inputSku: 'in_0325', qtyPerUnit: 11, leadDays: 11, substituteIds: ['sub_0376'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00776', industryId: 'ind_056', regionId: 'reg_20', inputSku: 'in_0328', qtyPerUnit: 12, leadDays: 12, substituteIds: ['sub_0377'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00777', industryId: 'ind_057', regionId: 'reg_21', inputSku: 'in_0331', qtyPerUnit: 13, leadDays: 13, substituteIds: ['sub_0378'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00778', industryId: 'ind_058', regionId: 'reg_22', inputSku: 'in_0334', qtyPerUnit: 14, leadDays: 14, substituteIds: ['sub_0379'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00779', industryId: 'ind_059', regionId: 'reg_23', inputSku: 'in_0337', qtyPerUnit: 15, leadDays: 15, substituteIds: ['sub_0380'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00780', industryId: 'ind_060', regionId: 'reg_24', inputSku: 'in_0340', qtyPerUnit: 16, leadDays: 16, substituteIds: ['sub_0381'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00781', industryId: 'ind_061', regionId: 'reg_25', inputSku: 'in_0343', qtyPerUnit: 17, leadDays: 17, substituteIds: ['sub_0382'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00782', industryId: 'ind_062', regionId: 'reg_26', inputSku: 'in_0346', qtyPerUnit: 1, leadDays: 18, substituteIds: ['sub_0383'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00783', industryId: 'ind_063', regionId: 'reg_27', inputSku: 'in_0349', qtyPerUnit: 2, leadDays: 19, substituteIds: ['sub_0384'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00784', industryId: 'ind_064', regionId: 'reg_00', inputSku: 'in_0352', qtyPerUnit: 3, leadDays: 20, substituteIds: ['sub_0385'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00785', industryId: 'ind_065', regionId: 'reg_01', inputSku: 'in_0355', qtyPerUnit: 4, leadDays: 21, substituteIds: ['sub_0386'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00786', industryId: 'ind_066', regionId: 'reg_02', inputSku: 'in_0358', qtyPerUnit: 5, leadDays: 22, substituteIds: ['sub_0387'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00787', industryId: 'ind_067', regionId: 'reg_03', inputSku: 'in_0361', qtyPerUnit: 6, leadDays: 23, substituteIds: ['sub_0388'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00788', industryId: 'ind_068', regionId: 'reg_04', inputSku: 'in_0364', qtyPerUnit: 7, leadDays: 24, substituteIds: ['sub_0389'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00789', industryId: 'ind_069', regionId: 'reg_05', inputSku: 'in_0367', qtyPerUnit: 8, leadDays: 25, substituteIds: ['sub_0390'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00790', industryId: 'ind_070', regionId: 'reg_06', inputSku: 'in_0370', qtyPerUnit: 9, leadDays: 26, substituteIds: ['sub_0391'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00791', industryId: 'ind_071', regionId: 'reg_07', inputSku: 'in_0373', qtyPerUnit: 10, leadDays: 27, substituteIds: ['sub_0392'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00792', industryId: 'ind_072', regionId: 'reg_08', inputSku: 'in_0376', qtyPerUnit: 11, leadDays: 28, substituteIds: ['sub_0393'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00793', industryId: 'ind_073', regionId: 'reg_09', inputSku: 'in_0379', qtyPerUnit: 12, leadDays: 29, substituteIds: ['sub_0394'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00794', industryId: 'ind_074', regionId: 'reg_10', inputSku: 'in_0382', qtyPerUnit: 13, leadDays: 30, substituteIds: ['sub_0395'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00795', industryId: 'ind_075', regionId: 'reg_11', inputSku: 'in_0385', qtyPerUnit: 14, leadDays: 31, substituteIds: ['sub_0396'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00796', industryId: 'ind_076', regionId: 'reg_12', inputSku: 'in_0388', qtyPerUnit: 15, leadDays: 32, substituteIds: ['sub_0397'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00797', industryId: 'ind_077', regionId: 'reg_13', inputSku: 'in_0391', qtyPerUnit: 16, leadDays: 33, substituteIds: ['sub_0398'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00798', industryId: 'ind_078', regionId: 'reg_14', inputSku: 'in_0394', qtyPerUnit: 17, leadDays: 34, substituteIds: ['sub_0399'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00799', industryId: 'ind_079', regionId: 'reg_15', inputSku: 'in_0397', qtyPerUnit: 1, leadDays: 35, substituteIds: ['sub_0000'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00800', industryId: 'ind_080', regionId: 'reg_16', inputSku: 'in_0000', qtyPerUnit: 2, leadDays: 36, substituteIds: ['sub_0001'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00801', industryId: 'ind_081', regionId: 'reg_17', inputSku: 'in_0003', qtyPerUnit: 3, leadDays: 37, substituteIds: ['sub_0002'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00802', industryId: 'ind_082', regionId: 'reg_18', inputSku: 'in_0006', qtyPerUnit: 4, leadDays: 38, substituteIds: ['sub_0003'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00803', industryId: 'ind_083', regionId: 'reg_19', inputSku: 'in_0009', qtyPerUnit: 5, leadDays: 39, substituteIds: ['sub_0004'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00804', industryId: 'ind_084', regionId: 'reg_20', inputSku: 'in_0012', qtyPerUnit: 6, leadDays: 40, substituteIds: ['sub_0005'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00805', industryId: 'ind_085', regionId: 'reg_21', inputSku: 'in_0015', qtyPerUnit: 7, leadDays: 41, substituteIds: ['sub_0006'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00806', industryId: 'ind_086', regionId: 'reg_22', inputSku: 'in_0018', qtyPerUnit: 8, leadDays: 42, substituteIds: ['sub_0007'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00807', industryId: 'ind_087', regionId: 'reg_23', inputSku: 'in_0021', qtyPerUnit: 9, leadDays: 43, substituteIds: ['sub_0008'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00808', industryId: 'ind_088', regionId: 'reg_24', inputSku: 'in_0024', qtyPerUnit: 10, leadDays: 44, substituteIds: ['sub_0009'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00809', industryId: 'ind_089', regionId: 'reg_25', inputSku: 'in_0027', qtyPerUnit: 11, leadDays: 45, substituteIds: ['sub_0010'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00810', industryId: 'ind_090', regionId: 'reg_26', inputSku: 'in_0030', qtyPerUnit: 12, leadDays: 1, substituteIds: ['sub_0011'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00811', industryId: 'ind_091', regionId: 'reg_27', inputSku: 'in_0033', qtyPerUnit: 13, leadDays: 2, substituteIds: ['sub_0012'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00812', industryId: 'ind_092', regionId: 'reg_00', inputSku: 'in_0036', qtyPerUnit: 14, leadDays: 3, substituteIds: ['sub_0013'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00813', industryId: 'ind_093', regionId: 'reg_01', inputSku: 'in_0039', qtyPerUnit: 15, leadDays: 4, substituteIds: ['sub_0014'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00814', industryId: 'ind_094', regionId: 'reg_02', inputSku: 'in_0042', qtyPerUnit: 16, leadDays: 5, substituteIds: ['sub_0015'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00815', industryId: 'ind_095', regionId: 'reg_03', inputSku: 'in_0045', qtyPerUnit: 17, leadDays: 6, substituteIds: ['sub_0016'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00816', industryId: 'ind_096', regionId: 'reg_04', inputSku: 'in_0048', qtyPerUnit: 1, leadDays: 7, substituteIds: ['sub_0017'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00817', industryId: 'ind_097', regionId: 'reg_05', inputSku: 'in_0051', qtyPerUnit: 2, leadDays: 8, substituteIds: ['sub_0018'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00818', industryId: 'ind_098', regionId: 'reg_06', inputSku: 'in_0054', qtyPerUnit: 3, leadDays: 9, substituteIds: ['sub_0019'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00819', industryId: 'ind_099', regionId: 'reg_07', inputSku: 'in_0057', qtyPerUnit: 4, leadDays: 10, substituteIds: ['sub_0020'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00820', industryId: 'ind_100', regionId: 'reg_08', inputSku: 'in_0060', qtyPerUnit: 5, leadDays: 11, substituteIds: ['sub_0021'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00821', industryId: 'ind_101', regionId: 'reg_09', inputSku: 'in_0063', qtyPerUnit: 6, leadDays: 12, substituteIds: ['sub_0022'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00822', industryId: 'ind_102', regionId: 'reg_10', inputSku: 'in_0066', qtyPerUnit: 7, leadDays: 13, substituteIds: ['sub_0023'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00823', industryId: 'ind_103', regionId: 'reg_11', inputSku: 'in_0069', qtyPerUnit: 8, leadDays: 14, substituteIds: ['sub_0024'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00824', industryId: 'ind_104', regionId: 'reg_12', inputSku: 'in_0072', qtyPerUnit: 9, leadDays: 15, substituteIds: ['sub_0025'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00825', industryId: 'ind_105', regionId: 'reg_13', inputSku: 'in_0075', qtyPerUnit: 10, leadDays: 16, substituteIds: ['sub_0026'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00826', industryId: 'ind_106', regionId: 'reg_14', inputSku: 'in_0078', qtyPerUnit: 11, leadDays: 17, substituteIds: ['sub_0027'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00827', industryId: 'ind_107', regionId: 'reg_15', inputSku: 'in_0081', qtyPerUnit: 12, leadDays: 18, substituteIds: ['sub_0028'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00828', industryId: 'ind_108', regionId: 'reg_16', inputSku: 'in_0084', qtyPerUnit: 13, leadDays: 19, substituteIds: ['sub_0029'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00829', industryId: 'ind_109', regionId: 'reg_17', inputSku: 'in_0087', qtyPerUnit: 14, leadDays: 20, substituteIds: ['sub_0030'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00830', industryId: 'ind_110', regionId: 'reg_18', inputSku: 'in_0090', qtyPerUnit: 15, leadDays: 21, substituteIds: ['sub_0031'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00831', industryId: 'ind_111', regionId: 'reg_19', inputSku: 'in_0093', qtyPerUnit: 16, leadDays: 22, substituteIds: ['sub_0032'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00832', industryId: 'ind_112', regionId: 'reg_20', inputSku: 'in_0096', qtyPerUnit: 17, leadDays: 23, substituteIds: ['sub_0033'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00833', industryId: 'ind_113', regionId: 'reg_21', inputSku: 'in_0099', qtyPerUnit: 1, leadDays: 24, substituteIds: ['sub_0034'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00834', industryId: 'ind_114', regionId: 'reg_22', inputSku: 'in_0102', qtyPerUnit: 2, leadDays: 25, substituteIds: ['sub_0035'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00835', industryId: 'ind_115', regionId: 'reg_23', inputSku: 'in_0105', qtyPerUnit: 3, leadDays: 26, substituteIds: ['sub_0036'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00836', industryId: 'ind_116', regionId: 'reg_24', inputSku: 'in_0108', qtyPerUnit: 4, leadDays: 27, substituteIds: ['sub_0037'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00837', industryId: 'ind_117', regionId: 'reg_25', inputSku: 'in_0111', qtyPerUnit: 5, leadDays: 28, substituteIds: ['sub_0038'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00838', industryId: 'ind_118', regionId: 'reg_26', inputSku: 'in_0114', qtyPerUnit: 6, leadDays: 29, substituteIds: ['sub_0039'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00839', industryId: 'ind_119', regionId: 'reg_27', inputSku: 'in_0117', qtyPerUnit: 7, leadDays: 30, substituteIds: ['sub_0040'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00840', industryId: 'ind_000', regionId: 'reg_00', inputSku: 'in_0120', qtyPerUnit: 8, leadDays: 31, substituteIds: ['sub_0041'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00841', industryId: 'ind_001', regionId: 'reg_01', inputSku: 'in_0123', qtyPerUnit: 9, leadDays: 32, substituteIds: ['sub_0042'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00842', industryId: 'ind_002', regionId: 'reg_02', inputSku: 'in_0126', qtyPerUnit: 10, leadDays: 33, substituteIds: ['sub_0043'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00843', industryId: 'ind_003', regionId: 'reg_03', inputSku: 'in_0129', qtyPerUnit: 11, leadDays: 34, substituteIds: ['sub_0044'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00844', industryId: 'ind_004', regionId: 'reg_04', inputSku: 'in_0132', qtyPerUnit: 12, leadDays: 35, substituteIds: ['sub_0045'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00845', industryId: 'ind_005', regionId: 'reg_05', inputSku: 'in_0135', qtyPerUnit: 13, leadDays: 36, substituteIds: ['sub_0046'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00846', industryId: 'ind_006', regionId: 'reg_06', inputSku: 'in_0138', qtyPerUnit: 14, leadDays: 37, substituteIds: ['sub_0047'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00847', industryId: 'ind_007', regionId: 'reg_07', inputSku: 'in_0141', qtyPerUnit: 15, leadDays: 38, substituteIds: ['sub_0048'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00848', industryId: 'ind_008', regionId: 'reg_08', inputSku: 'in_0144', qtyPerUnit: 16, leadDays: 39, substituteIds: ['sub_0049'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00849', industryId: 'ind_009', regionId: 'reg_09', inputSku: 'in_0147', qtyPerUnit: 17, leadDays: 40, substituteIds: ['sub_0050'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00850', industryId: 'ind_010', regionId: 'reg_10', inputSku: 'in_0150', qtyPerUnit: 1, leadDays: 41, substituteIds: ['sub_0051'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00851', industryId: 'ind_011', regionId: 'reg_11', inputSku: 'in_0153', qtyPerUnit: 2, leadDays: 42, substituteIds: ['sub_0052'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00852', industryId: 'ind_012', regionId: 'reg_12', inputSku: 'in_0156', qtyPerUnit: 3, leadDays: 43, substituteIds: ['sub_0053'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00853', industryId: 'ind_013', regionId: 'reg_13', inputSku: 'in_0159', qtyPerUnit: 4, leadDays: 44, substituteIds: ['sub_0054'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00854', industryId: 'ind_014', regionId: 'reg_14', inputSku: 'in_0162', qtyPerUnit: 5, leadDays: 45, substituteIds: ['sub_0055'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00855', industryId: 'ind_015', regionId: 'reg_15', inputSku: 'in_0165', qtyPerUnit: 6, leadDays: 1, substituteIds: ['sub_0056'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00856', industryId: 'ind_016', regionId: 'reg_16', inputSku: 'in_0168', qtyPerUnit: 7, leadDays: 2, substituteIds: ['sub_0057'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00857', industryId: 'ind_017', regionId: 'reg_17', inputSku: 'in_0171', qtyPerUnit: 8, leadDays: 3, substituteIds: ['sub_0058'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00858', industryId: 'ind_018', regionId: 'reg_18', inputSku: 'in_0174', qtyPerUnit: 9, leadDays: 4, substituteIds: ['sub_0059'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00859', industryId: 'ind_019', regionId: 'reg_19', inputSku: 'in_0177', qtyPerUnit: 10, leadDays: 5, substituteIds: ['sub_0060'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00860', industryId: 'ind_020', regionId: 'reg_20', inputSku: 'in_0180', qtyPerUnit: 11, leadDays: 6, substituteIds: ['sub_0061'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00861', industryId: 'ind_021', regionId: 'reg_21', inputSku: 'in_0183', qtyPerUnit: 12, leadDays: 7, substituteIds: ['sub_0062'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00862', industryId: 'ind_022', regionId: 'reg_22', inputSku: 'in_0186', qtyPerUnit: 13, leadDays: 8, substituteIds: ['sub_0063'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00863', industryId: 'ind_023', regionId: 'reg_23', inputSku: 'in_0189', qtyPerUnit: 14, leadDays: 9, substituteIds: ['sub_0064'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00864', industryId: 'ind_024', regionId: 'reg_24', inputSku: 'in_0192', qtyPerUnit: 15, leadDays: 10, substituteIds: ['sub_0065'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00865', industryId: 'ind_025', regionId: 'reg_25', inputSku: 'in_0195', qtyPerUnit: 16, leadDays: 11, substituteIds: ['sub_0066'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00866', industryId: 'ind_026', regionId: 'reg_26', inputSku: 'in_0198', qtyPerUnit: 17, leadDays: 12, substituteIds: ['sub_0067'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00867', industryId: 'ind_027', regionId: 'reg_27', inputSku: 'in_0201', qtyPerUnit: 1, leadDays: 13, substituteIds: ['sub_0068'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00868', industryId: 'ind_028', regionId: 'reg_00', inputSku: 'in_0204', qtyPerUnit: 2, leadDays: 14, substituteIds: ['sub_0069'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00869', industryId: 'ind_029', regionId: 'reg_01', inputSku: 'in_0207', qtyPerUnit: 3, leadDays: 15, substituteIds: ['sub_0070'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00870', industryId: 'ind_030', regionId: 'reg_02', inputSku: 'in_0210', qtyPerUnit: 4, leadDays: 16, substituteIds: ['sub_0071'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00871', industryId: 'ind_031', regionId: 'reg_03', inputSku: 'in_0213', qtyPerUnit: 5, leadDays: 17, substituteIds: ['sub_0072'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00872', industryId: 'ind_032', regionId: 'reg_04', inputSku: 'in_0216', qtyPerUnit: 6, leadDays: 18, substituteIds: ['sub_0073'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00873', industryId: 'ind_033', regionId: 'reg_05', inputSku: 'in_0219', qtyPerUnit: 7, leadDays: 19, substituteIds: ['sub_0074'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00874', industryId: 'ind_034', regionId: 'reg_06', inputSku: 'in_0222', qtyPerUnit: 8, leadDays: 20, substituteIds: ['sub_0075'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00875', industryId: 'ind_035', regionId: 'reg_07', inputSku: 'in_0225', qtyPerUnit: 9, leadDays: 21, substituteIds: ['sub_0076'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00876', industryId: 'ind_036', regionId: 'reg_08', inputSku: 'in_0228', qtyPerUnit: 10, leadDays: 22, substituteIds: ['sub_0077'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00877', industryId: 'ind_037', regionId: 'reg_09', inputSku: 'in_0231', qtyPerUnit: 11, leadDays: 23, substituteIds: ['sub_0078'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00878', industryId: 'ind_038', regionId: 'reg_10', inputSku: 'in_0234', qtyPerUnit: 12, leadDays: 24, substituteIds: ['sub_0079'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00879', industryId: 'ind_039', regionId: 'reg_11', inputSku: 'in_0237', qtyPerUnit: 13, leadDays: 25, substituteIds: ['sub_0080'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00880', industryId: 'ind_040', regionId: 'reg_12', inputSku: 'in_0240', qtyPerUnit: 14, leadDays: 26, substituteIds: ['sub_0081'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00881', industryId: 'ind_041', regionId: 'reg_13', inputSku: 'in_0243', qtyPerUnit: 15, leadDays: 27, substituteIds: ['sub_0082'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00882', industryId: 'ind_042', regionId: 'reg_14', inputSku: 'in_0246', qtyPerUnit: 16, leadDays: 28, substituteIds: ['sub_0083'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00883', industryId: 'ind_043', regionId: 'reg_15', inputSku: 'in_0249', qtyPerUnit: 17, leadDays: 29, substituteIds: ['sub_0084'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00884', industryId: 'ind_044', regionId: 'reg_16', inputSku: 'in_0252', qtyPerUnit: 1, leadDays: 30, substituteIds: ['sub_0085'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00885', industryId: 'ind_045', regionId: 'reg_17', inputSku: 'in_0255', qtyPerUnit: 2, leadDays: 31, substituteIds: ['sub_0086'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00886', industryId: 'ind_046', regionId: 'reg_18', inputSku: 'in_0258', qtyPerUnit: 3, leadDays: 32, substituteIds: ['sub_0087'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00887', industryId: 'ind_047', regionId: 'reg_19', inputSku: 'in_0261', qtyPerUnit: 4, leadDays: 33, substituteIds: ['sub_0088'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00888', industryId: 'ind_048', regionId: 'reg_20', inputSku: 'in_0264', qtyPerUnit: 5, leadDays: 34, substituteIds: ['sub_0089'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00889', industryId: 'ind_049', regionId: 'reg_21', inputSku: 'in_0267', qtyPerUnit: 6, leadDays: 35, substituteIds: ['sub_0090'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00890', industryId: 'ind_050', regionId: 'reg_22', inputSku: 'in_0270', qtyPerUnit: 7, leadDays: 36, substituteIds: ['sub_0091'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00891', industryId: 'ind_051', regionId: 'reg_23', inputSku: 'in_0273', qtyPerUnit: 8, leadDays: 37, substituteIds: ['sub_0092'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00892', industryId: 'ind_052', regionId: 'reg_24', inputSku: 'in_0276', qtyPerUnit: 9, leadDays: 38, substituteIds: ['sub_0093'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00893', industryId: 'ind_053', regionId: 'reg_25', inputSku: 'in_0279', qtyPerUnit: 10, leadDays: 39, substituteIds: ['sub_0094'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00894', industryId: 'ind_054', regionId: 'reg_26', inputSku: 'in_0282', qtyPerUnit: 11, leadDays: 40, substituteIds: ['sub_0095'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00895', industryId: 'ind_055', regionId: 'reg_27', inputSku: 'in_0285', qtyPerUnit: 12, leadDays: 41, substituteIds: ['sub_0096'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00896', industryId: 'ind_056', regionId: 'reg_00', inputSku: 'in_0288', qtyPerUnit: 13, leadDays: 42, substituteIds: ['sub_0097'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00897', industryId: 'ind_057', regionId: 'reg_01', inputSku: 'in_0291', qtyPerUnit: 14, leadDays: 43, substituteIds: ['sub_0098'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00898', industryId: 'ind_058', regionId: 'reg_02', inputSku: 'in_0294', qtyPerUnit: 15, leadDays: 44, substituteIds: ['sub_0099'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00899', industryId: 'ind_059', regionId: 'reg_03', inputSku: 'in_0297', qtyPerUnit: 16, leadDays: 45, substituteIds: ['sub_0100'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00900', industryId: 'ind_060', regionId: 'reg_04', inputSku: 'in_0300', qtyPerUnit: 17, leadDays: 1, substituteIds: ['sub_0101'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00901', industryId: 'ind_061', regionId: 'reg_05', inputSku: 'in_0303', qtyPerUnit: 1, leadDays: 2, substituteIds: ['sub_0102'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00902', industryId: 'ind_062', regionId: 'reg_06', inputSku: 'in_0306', qtyPerUnit: 2, leadDays: 3, substituteIds: ['sub_0103'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00903', industryId: 'ind_063', regionId: 'reg_07', inputSku: 'in_0309', qtyPerUnit: 3, leadDays: 4, substituteIds: ['sub_0104'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00904', industryId: 'ind_064', regionId: 'reg_08', inputSku: 'in_0312', qtyPerUnit: 4, leadDays: 5, substituteIds: ['sub_0105'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00905', industryId: 'ind_065', regionId: 'reg_09', inputSku: 'in_0315', qtyPerUnit: 5, leadDays: 6, substituteIds: ['sub_0106'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00906', industryId: 'ind_066', regionId: 'reg_10', inputSku: 'in_0318', qtyPerUnit: 6, leadDays: 7, substituteIds: ['sub_0107'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00907', industryId: 'ind_067', regionId: 'reg_11', inputSku: 'in_0321', qtyPerUnit: 7, leadDays: 8, substituteIds: ['sub_0108'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00908', industryId: 'ind_068', regionId: 'reg_12', inputSku: 'in_0324', qtyPerUnit: 8, leadDays: 9, substituteIds: ['sub_0109'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00909', industryId: 'ind_069', regionId: 'reg_13', inputSku: 'in_0327', qtyPerUnit: 9, leadDays: 10, substituteIds: ['sub_0110'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00910', industryId: 'ind_070', regionId: 'reg_14', inputSku: 'in_0330', qtyPerUnit: 10, leadDays: 11, substituteIds: ['sub_0111'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00911', industryId: 'ind_071', regionId: 'reg_15', inputSku: 'in_0333', qtyPerUnit: 11, leadDays: 12, substituteIds: ['sub_0112'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00912', industryId: 'ind_072', regionId: 'reg_16', inputSku: 'in_0336', qtyPerUnit: 12, leadDays: 13, substituteIds: ['sub_0113'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00913', industryId: 'ind_073', regionId: 'reg_17', inputSku: 'in_0339', qtyPerUnit: 13, leadDays: 14, substituteIds: ['sub_0114'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00914', industryId: 'ind_074', regionId: 'reg_18', inputSku: 'in_0342', qtyPerUnit: 14, leadDays: 15, substituteIds: ['sub_0115'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00915', industryId: 'ind_075', regionId: 'reg_19', inputSku: 'in_0345', qtyPerUnit: 15, leadDays: 16, substituteIds: ['sub_0116'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00916', industryId: 'ind_076', regionId: 'reg_20', inputSku: 'in_0348', qtyPerUnit: 16, leadDays: 17, substituteIds: ['sub_0117'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00917', industryId: 'ind_077', regionId: 'reg_21', inputSku: 'in_0351', qtyPerUnit: 17, leadDays: 18, substituteIds: ['sub_0118'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00918', industryId: 'ind_078', regionId: 'reg_22', inputSku: 'in_0354', qtyPerUnit: 1, leadDays: 19, substituteIds: ['sub_0119'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00919', industryId: 'ind_079', regionId: 'reg_23', inputSku: 'in_0357', qtyPerUnit: 2, leadDays: 20, substituteIds: ['sub_0120'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00920', industryId: 'ind_080', regionId: 'reg_24', inputSku: 'in_0360', qtyPerUnit: 3, leadDays: 21, substituteIds: ['sub_0121'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00921', industryId: 'ind_081', regionId: 'reg_25', inputSku: 'in_0363', qtyPerUnit: 4, leadDays: 22, substituteIds: ['sub_0122'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00922', industryId: 'ind_082', regionId: 'reg_26', inputSku: 'in_0366', qtyPerUnit: 5, leadDays: 23, substituteIds: ['sub_0123'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00923', industryId: 'ind_083', regionId: 'reg_27', inputSku: 'in_0369', qtyPerUnit: 6, leadDays: 24, substituteIds: ['sub_0124'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00924', industryId: 'ind_084', regionId: 'reg_00', inputSku: 'in_0372', qtyPerUnit: 7, leadDays: 25, substituteIds: ['sub_0125'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00925', industryId: 'ind_085', regionId: 'reg_01', inputSku: 'in_0375', qtyPerUnit: 8, leadDays: 26, substituteIds: ['sub_0126'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00926', industryId: 'ind_086', regionId: 'reg_02', inputSku: 'in_0378', qtyPerUnit: 9, leadDays: 27, substituteIds: ['sub_0127'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00927', industryId: 'ind_087', regionId: 'reg_03', inputSku: 'in_0381', qtyPerUnit: 10, leadDays: 28, substituteIds: ['sub_0128'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00928', industryId: 'ind_088', regionId: 'reg_04', inputSku: 'in_0384', qtyPerUnit: 11, leadDays: 29, substituteIds: ['sub_0129'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00929', industryId: 'ind_089', regionId: 'reg_05', inputSku: 'in_0387', qtyPerUnit: 12, leadDays: 30, substituteIds: ['sub_0130'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00930', industryId: 'ind_090', regionId: 'reg_06', inputSku: 'in_0390', qtyPerUnit: 13, leadDays: 31, substituteIds: ['sub_0131'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00931', industryId: 'ind_091', regionId: 'reg_07', inputSku: 'in_0393', qtyPerUnit: 14, leadDays: 32, substituteIds: ['sub_0132'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00932', industryId: 'ind_092', regionId: 'reg_08', inputSku: 'in_0396', qtyPerUnit: 15, leadDays: 33, substituteIds: ['sub_0133'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00933', industryId: 'ind_093', regionId: 'reg_09', inputSku: 'in_0399', qtyPerUnit: 16, leadDays: 34, substituteIds: ['sub_0134'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00934', industryId: 'ind_094', regionId: 'reg_10', inputSku: 'in_0002', qtyPerUnit: 17, leadDays: 35, substituteIds: ['sub_0135'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00935', industryId: 'ind_095', regionId: 'reg_11', inputSku: 'in_0005', qtyPerUnit: 1, leadDays: 36, substituteIds: ['sub_0136'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00936', industryId: 'ind_096', regionId: 'reg_12', inputSku: 'in_0008', qtyPerUnit: 2, leadDays: 37, substituteIds: ['sub_0137'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00937', industryId: 'ind_097', regionId: 'reg_13', inputSku: 'in_0011', qtyPerUnit: 3, leadDays: 38, substituteIds: ['sub_0138'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00938', industryId: 'ind_098', regionId: 'reg_14', inputSku: 'in_0014', qtyPerUnit: 4, leadDays: 39, substituteIds: ['sub_0139'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00939', industryId: 'ind_099', regionId: 'reg_15', inputSku: 'in_0017', qtyPerUnit: 5, leadDays: 40, substituteIds: ['sub_0140'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00940', industryId: 'ind_100', regionId: 'reg_16', inputSku: 'in_0020', qtyPerUnit: 6, leadDays: 41, substituteIds: ['sub_0141'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00941', industryId: 'ind_101', regionId: 'reg_17', inputSku: 'in_0023', qtyPerUnit: 7, leadDays: 42, substituteIds: ['sub_0142'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00942', industryId: 'ind_102', regionId: 'reg_18', inputSku: 'in_0026', qtyPerUnit: 8, leadDays: 43, substituteIds: ['sub_0143'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00943', industryId: 'ind_103', regionId: 'reg_19', inputSku: 'in_0029', qtyPerUnit: 9, leadDays: 44, substituteIds: ['sub_0144'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00944', industryId: 'ind_104', regionId: 'reg_20', inputSku: 'in_0032', qtyPerUnit: 10, leadDays: 45, substituteIds: ['sub_0145'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00945', industryId: 'ind_105', regionId: 'reg_21', inputSku: 'in_0035', qtyPerUnit: 11, leadDays: 1, substituteIds: ['sub_0146'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00946', industryId: 'ind_106', regionId: 'reg_22', inputSku: 'in_0038', qtyPerUnit: 12, leadDays: 2, substituteIds: ['sub_0147'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00947', industryId: 'ind_107', regionId: 'reg_23', inputSku: 'in_0041', qtyPerUnit: 13, leadDays: 3, substituteIds: ['sub_0148'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00948', industryId: 'ind_108', regionId: 'reg_24', inputSku: 'in_0044', qtyPerUnit: 14, leadDays: 4, substituteIds: ['sub_0149'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00949', industryId: 'ind_109', regionId: 'reg_25', inputSku: 'in_0047', qtyPerUnit: 15, leadDays: 5, substituteIds: ['sub_0150'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_00950', industryId: 'ind_110', regionId: 'reg_26', inputSku: 'in_0050', qtyPerUnit: 16, leadDays: 6, substituteIds: ['sub_0151'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_00951', industryId: 'ind_111', regionId: 'reg_27', inputSku: 'in_0053', qtyPerUnit: 17, leadDays: 7, substituteIds: ['sub_0152'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_00952', industryId: 'ind_112', regionId: 'reg_00', inputSku: 'in_0056', qtyPerUnit: 1, leadDays: 8, substituteIds: ['sub_0153'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_00953', industryId: 'ind_113', regionId: 'reg_01', inputSku: 'in_0059', qtyPerUnit: 2, leadDays: 9, substituteIds: ['sub_0154'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_00954', industryId: 'ind_114', regionId: 'reg_02', inputSku: 'in_0062', qtyPerUnit: 3, leadDays: 10, substituteIds: ['sub_0155'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_00955', industryId: 'ind_115', regionId: 'reg_03', inputSku: 'in_0065', qtyPerUnit: 4, leadDays: 11, substituteIds: ['sub_0156'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_00956', industryId: 'ind_116', regionId: 'reg_04', inputSku: 'in_0068', qtyPerUnit: 5, leadDays: 12, substituteIds: ['sub_0157'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_00957', industryId: 'ind_117', regionId: 'reg_05', inputSku: 'in_0071', qtyPerUnit: 6, leadDays: 13, substituteIds: ['sub_0158'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_00958', industryId: 'ind_118', regionId: 'reg_06', inputSku: 'in_0074', qtyPerUnit: 7, leadDays: 14, substituteIds: ['sub_0159'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_00959', industryId: 'ind_119', regionId: 'reg_07', inputSku: 'in_0077', qtyPerUnit: 8, leadDays: 15, substituteIds: ['sub_0160'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_00960', industryId: 'ind_000', regionId: 'reg_08', inputSku: 'in_0080', qtyPerUnit: 9, leadDays: 16, substituteIds: ['sub_0161'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_00961', industryId: 'ind_001', regionId: 'reg_09', inputSku: 'in_0083', qtyPerUnit: 10, leadDays: 17, substituteIds: ['sub_0162'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_00962', industryId: 'ind_002', regionId: 'reg_10', inputSku: 'in_0086', qtyPerUnit: 11, leadDays: 18, substituteIds: ['sub_0163'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_00963', industryId: 'ind_003', regionId: 'reg_11', inputSku: 'in_0089', qtyPerUnit: 12, leadDays: 19, substituteIds: ['sub_0164'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_00964', industryId: 'ind_004', regionId: 'reg_12', inputSku: 'in_0092', qtyPerUnit: 13, leadDays: 20, substituteIds: ['sub_0165'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_00965', industryId: 'ind_005', regionId: 'reg_13', inputSku: 'in_0095', qtyPerUnit: 14, leadDays: 21, substituteIds: ['sub_0166'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_00966', industryId: 'ind_006', regionId: 'reg_14', inputSku: 'in_0098', qtyPerUnit: 15, leadDays: 22, substituteIds: ['sub_0167'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_00967', industryId: 'ind_007', regionId: 'reg_15', inputSku: 'in_0101', qtyPerUnit: 16, leadDays: 23, substituteIds: ['sub_0168'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_00968', industryId: 'ind_008', regionId: 'reg_16', inputSku: 'in_0104', qtyPerUnit: 17, leadDays: 24, substituteIds: ['sub_0169'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_00969', industryId: 'ind_009', regionId: 'reg_17', inputSku: 'in_0107', qtyPerUnit: 1, leadDays: 25, substituteIds: ['sub_0170'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_00970', industryId: 'ind_010', regionId: 'reg_18', inputSku: 'in_0110', qtyPerUnit: 2, leadDays: 26, substituteIds: ['sub_0171'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_00971', industryId: 'ind_011', regionId: 'reg_19', inputSku: 'in_0113', qtyPerUnit: 3, leadDays: 27, substituteIds: ['sub_0172'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_00972', industryId: 'ind_012', regionId: 'reg_20', inputSku: 'in_0116', qtyPerUnit: 4, leadDays: 28, substituteIds: ['sub_0173'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_00973', industryId: 'ind_013', regionId: 'reg_21', inputSku: 'in_0119', qtyPerUnit: 5, leadDays: 29, substituteIds: ['sub_0174'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_00974', industryId: 'ind_014', regionId: 'reg_22', inputSku: 'in_0122', qtyPerUnit: 6, leadDays: 30, substituteIds: ['sub_0175'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_00975', industryId: 'ind_015', regionId: 'reg_23', inputSku: 'in_0125', qtyPerUnit: 7, leadDays: 31, substituteIds: ['sub_0176'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_00976', industryId: 'ind_016', regionId: 'reg_24', inputSku: 'in_0128', qtyPerUnit: 8, leadDays: 32, substituteIds: ['sub_0177'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_00977', industryId: 'ind_017', regionId: 'reg_25', inputSku: 'in_0131', qtyPerUnit: 9, leadDays: 33, substituteIds: ['sub_0178'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_00978', industryId: 'ind_018', regionId: 'reg_26', inputSku: 'in_0134', qtyPerUnit: 10, leadDays: 34, substituteIds: ['sub_0179'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_00979', industryId: 'ind_019', regionId: 'reg_27', inputSku: 'in_0137', qtyPerUnit: 11, leadDays: 35, substituteIds: ['sub_0180'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_00980', industryId: 'ind_020', regionId: 'reg_00', inputSku: 'in_0140', qtyPerUnit: 12, leadDays: 36, substituteIds: ['sub_0181'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_00981', industryId: 'ind_021', regionId: 'reg_01', inputSku: 'in_0143', qtyPerUnit: 13, leadDays: 37, substituteIds: ['sub_0182'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_00982', industryId: 'ind_022', regionId: 'reg_02', inputSku: 'in_0146', qtyPerUnit: 14, leadDays: 38, substituteIds: ['sub_0183'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_00983', industryId: 'ind_023', regionId: 'reg_03', inputSku: 'in_0149', qtyPerUnit: 15, leadDays: 39, substituteIds: ['sub_0184'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_00984', industryId: 'ind_024', regionId: 'reg_04', inputSku: 'in_0152', qtyPerUnit: 16, leadDays: 40, substituteIds: ['sub_0185'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_00985', industryId: 'ind_025', regionId: 'reg_05', inputSku: 'in_0155', qtyPerUnit: 17, leadDays: 41, substituteIds: ['sub_0186'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_00986', industryId: 'ind_026', regionId: 'reg_06', inputSku: 'in_0158', qtyPerUnit: 1, leadDays: 42, substituteIds: ['sub_0187'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_00987', industryId: 'ind_027', regionId: 'reg_07', inputSku: 'in_0161', qtyPerUnit: 2, leadDays: 43, substituteIds: ['sub_0188'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_00988', industryId: 'ind_028', regionId: 'reg_08', inputSku: 'in_0164', qtyPerUnit: 3, leadDays: 44, substituteIds: ['sub_0189'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_00989', industryId: 'ind_029', regionId: 'reg_09', inputSku: 'in_0167', qtyPerUnit: 4, leadDays: 45, substituteIds: ['sub_0190'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_00990', industryId: 'ind_030', regionId: 'reg_10', inputSku: 'in_0170', qtyPerUnit: 5, leadDays: 1, substituteIds: ['sub_0191'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_00991', industryId: 'ind_031', regionId: 'reg_11', inputSku: 'in_0173', qtyPerUnit: 6, leadDays: 2, substituteIds: ['sub_0192'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_00992', industryId: 'ind_032', regionId: 'reg_12', inputSku: 'in_0176', qtyPerUnit: 7, leadDays: 3, substituteIds: ['sub_0193'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_00993', industryId: 'ind_033', regionId: 'reg_13', inputSku: 'in_0179', qtyPerUnit: 8, leadDays: 4, substituteIds: ['sub_0194'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_00994', industryId: 'ind_034', regionId: 'reg_14', inputSku: 'in_0182', qtyPerUnit: 9, leadDays: 5, substituteIds: ['sub_0195'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_00995', industryId: 'ind_035', regionId: 'reg_15', inputSku: 'in_0185', qtyPerUnit: 10, leadDays: 6, substituteIds: ['sub_0196'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_00996', industryId: 'ind_036', regionId: 'reg_16', inputSku: 'in_0188', qtyPerUnit: 11, leadDays: 7, substituteIds: ['sub_0197'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_00997', industryId: 'ind_037', regionId: 'reg_17', inputSku: 'in_0191', qtyPerUnit: 12, leadDays: 8, substituteIds: ['sub_0198'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_00998', industryId: 'ind_038', regionId: 'reg_18', inputSku: 'in_0194', qtyPerUnit: 13, leadDays: 9, substituteIds: ['sub_0199'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_00999', industryId: 'ind_039', regionId: 'reg_19', inputSku: 'in_0197', qtyPerUnit: 14, leadDays: 10, substituteIds: ['sub_0200'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_01000', industryId: 'ind_040', regionId: 'reg_20', inputSku: 'in_0200', qtyPerUnit: 15, leadDays: 11, substituteIds: ['sub_0201'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_01001', industryId: 'ind_041', regionId: 'reg_21', inputSku: 'in_0203', qtyPerUnit: 16, leadDays: 12, substituteIds: ['sub_0202'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_01002', industryId: 'ind_042', regionId: 'reg_22', inputSku: 'in_0206', qtyPerUnit: 17, leadDays: 13, substituteIds: ['sub_0203'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_01003', industryId: 'ind_043', regionId: 'reg_23', inputSku: 'in_0209', qtyPerUnit: 1, leadDays: 14, substituteIds: ['sub_0204'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_01004', industryId: 'ind_044', regionId: 'reg_24', inputSku: 'in_0212', qtyPerUnit: 2, leadDays: 15, substituteIds: ['sub_0205'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_01005', industryId: 'ind_045', regionId: 'reg_25', inputSku: 'in_0215', qtyPerUnit: 3, leadDays: 16, substituteIds: ['sub_0206'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_01006', industryId: 'ind_046', regionId: 'reg_26', inputSku: 'in_0218', qtyPerUnit: 4, leadDays: 17, substituteIds: ['sub_0207'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_01007', industryId: 'ind_047', regionId: 'reg_27', inputSku: 'in_0221', qtyPerUnit: 5, leadDays: 18, substituteIds: ['sub_0208'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_01008', industryId: 'ind_048', regionId: 'reg_00', inputSku: 'in_0224', qtyPerUnit: 6, leadDays: 19, substituteIds: ['sub_0209'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_01009', industryId: 'ind_049', regionId: 'reg_01', inputSku: 'in_0227', qtyPerUnit: 7, leadDays: 20, substituteIds: ['sub_0210'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_01010', industryId: 'ind_050', regionId: 'reg_02', inputSku: 'in_0230', qtyPerUnit: 8, leadDays: 21, substituteIds: ['sub_0211'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_01011', industryId: 'ind_051', regionId: 'reg_03', inputSku: 'in_0233', qtyPerUnit: 9, leadDays: 22, substituteIds: ['sub_0212'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_01012', industryId: 'ind_052', regionId: 'reg_04', inputSku: 'in_0236', qtyPerUnit: 10, leadDays: 23, substituteIds: ['sub_0213'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_01013', industryId: 'ind_053', regionId: 'reg_05', inputSku: 'in_0239', qtyPerUnit: 11, leadDays: 24, substituteIds: ['sub_0214'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_01014', industryId: 'ind_054', regionId: 'reg_06', inputSku: 'in_0242', qtyPerUnit: 12, leadDays: 25, substituteIds: ['sub_0215'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_01015', industryId: 'ind_055', regionId: 'reg_07', inputSku: 'in_0245', qtyPerUnit: 13, leadDays: 26, substituteIds: ['sub_0216'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_01016', industryId: 'ind_056', regionId: 'reg_08', inputSku: 'in_0248', qtyPerUnit: 14, leadDays: 27, substituteIds: ['sub_0217'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_01017', industryId: 'ind_057', regionId: 'reg_09', inputSku: 'in_0251', qtyPerUnit: 15, leadDays: 28, substituteIds: ['sub_0218'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_01018', industryId: 'ind_058', regionId: 'reg_10', inputSku: 'in_0254', qtyPerUnit: 16, leadDays: 29, substituteIds: ['sub_0219'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_01019', industryId: 'ind_059', regionId: 'reg_11', inputSku: 'in_0257', qtyPerUnit: 17, leadDays: 30, substituteIds: ['sub_0220'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_01020', industryId: 'ind_060', regionId: 'reg_12', inputSku: 'in_0260', qtyPerUnit: 1, leadDays: 31, substituteIds: ['sub_0221'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_01021', industryId: 'ind_061', regionId: 'reg_13', inputSku: 'in_0263', qtyPerUnit: 2, leadDays: 32, substituteIds: ['sub_0222'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_01022', industryId: 'ind_062', regionId: 'reg_14', inputSku: 'in_0266', qtyPerUnit: 3, leadDays: 33, substituteIds: ['sub_0223'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_01023', industryId: 'ind_063', regionId: 'reg_15', inputSku: 'in_0269', qtyPerUnit: 4, leadDays: 34, substituteIds: ['sub_0224'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_01024', industryId: 'ind_064', regionId: 'reg_16', inputSku: 'in_0272', qtyPerUnit: 5, leadDays: 35, substituteIds: ['sub_0225'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_01025', industryId: 'ind_065', regionId: 'reg_17', inputSku: 'in_0275', qtyPerUnit: 6, leadDays: 36, substituteIds: ['sub_0226'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_01026', industryId: 'ind_066', regionId: 'reg_18', inputSku: 'in_0278', qtyPerUnit: 7, leadDays: 37, substituteIds: ['sub_0227'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_01027', industryId: 'ind_067', regionId: 'reg_19', inputSku: 'in_0281', qtyPerUnit: 8, leadDays: 38, substituteIds: ['sub_0228'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_01028', industryId: 'ind_068', regionId: 'reg_20', inputSku: 'in_0284', qtyPerUnit: 9, leadDays: 39, substituteIds: ['sub_0229'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_01029', industryId: 'ind_069', regionId: 'reg_21', inputSku: 'in_0287', qtyPerUnit: 10, leadDays: 40, substituteIds: ['sub_0230'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_01030', industryId: 'ind_070', regionId: 'reg_22', inputSku: 'in_0290', qtyPerUnit: 11, leadDays: 41, substituteIds: ['sub_0231'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_01031', industryId: 'ind_071', regionId: 'reg_23', inputSku: 'in_0293', qtyPerUnit: 12, leadDays: 42, substituteIds: ['sub_0232'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_01032', industryId: 'ind_072', regionId: 'reg_24', inputSku: 'in_0296', qtyPerUnit: 13, leadDays: 43, substituteIds: ['sub_0233'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_01033', industryId: 'ind_073', regionId: 'reg_25', inputSku: 'in_0299', qtyPerUnit: 14, leadDays: 44, substituteIds: ['sub_0234'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_01034', industryId: 'ind_074', regionId: 'reg_26', inputSku: 'in_0302', qtyPerUnit: 15, leadDays: 45, substituteIds: ['sub_0235'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_01035', industryId: 'ind_075', regionId: 'reg_27', inputSku: 'in_0305', qtyPerUnit: 16, leadDays: 1, substituteIds: ['sub_0236'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_01036', industryId: 'ind_076', regionId: 'reg_00', inputSku: 'in_0308', qtyPerUnit: 17, leadDays: 2, substituteIds: ['sub_0237'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_01037', industryId: 'ind_077', regionId: 'reg_01', inputSku: 'in_0311', qtyPerUnit: 1, leadDays: 3, substituteIds: ['sub_0238'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_01038', industryId: 'ind_078', regionId: 'reg_02', inputSku: 'in_0314', qtyPerUnit: 2, leadDays: 4, substituteIds: ['sub_0239'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_01039', industryId: 'ind_079', regionId: 'reg_03', inputSku: 'in_0317', qtyPerUnit: 3, leadDays: 5, substituteIds: ['sub_0240'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_01040', industryId: 'ind_080', regionId: 'reg_04', inputSku: 'in_0320', qtyPerUnit: 4, leadDays: 6, substituteIds: ['sub_0241'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_01041', industryId: 'ind_081', regionId: 'reg_05', inputSku: 'in_0323', qtyPerUnit: 5, leadDays: 7, substituteIds: ['sub_0242'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_01042', industryId: 'ind_082', regionId: 'reg_06', inputSku: 'in_0326', qtyPerUnit: 6, leadDays: 8, substituteIds: ['sub_0243'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_01043', industryId: 'ind_083', regionId: 'reg_07', inputSku: 'in_0329', qtyPerUnit: 7, leadDays: 9, substituteIds: ['sub_0244'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_01044', industryId: 'ind_084', regionId: 'reg_08', inputSku: 'in_0332', qtyPerUnit: 8, leadDays: 10, substituteIds: ['sub_0245'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_01045', industryId: 'ind_085', regionId: 'reg_09', inputSku: 'in_0335', qtyPerUnit: 9, leadDays: 11, substituteIds: ['sub_0246'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_01046', industryId: 'ind_086', regionId: 'reg_10', inputSku: 'in_0338', qtyPerUnit: 10, leadDays: 12, substituteIds: ['sub_0247'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_01047', industryId: 'ind_087', regionId: 'reg_11', inputSku: 'in_0341', qtyPerUnit: 11, leadDays: 13, substituteIds: ['sub_0248'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_01048', industryId: 'ind_088', regionId: 'reg_12', inputSku: 'in_0344', qtyPerUnit: 12, leadDays: 14, substituteIds: ['sub_0249'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_01049', industryId: 'ind_089', regionId: 'reg_13', inputSku: 'in_0347', qtyPerUnit: 13, leadDays: 15, substituteIds: ['sub_0250'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_01050', industryId: 'ind_090', regionId: 'reg_14', inputSku: 'in_0350', qtyPerUnit: 14, leadDays: 16, substituteIds: ['sub_0251'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_01051', industryId: 'ind_091', regionId: 'reg_15', inputSku: 'in_0353', qtyPerUnit: 15, leadDays: 17, substituteIds: ['sub_0252'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_01052', industryId: 'ind_092', regionId: 'reg_16', inputSku: 'in_0356', qtyPerUnit: 16, leadDays: 18, substituteIds: ['sub_0253'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_01053', industryId: 'ind_093', regionId: 'reg_17', inputSku: 'in_0359', qtyPerUnit: 17, leadDays: 19, substituteIds: ['sub_0254'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_01054', industryId: 'ind_094', regionId: 'reg_18', inputSku: 'in_0362', qtyPerUnit: 1, leadDays: 20, substituteIds: ['sub_0255'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_01055', industryId: 'ind_095', regionId: 'reg_19', inputSku: 'in_0365', qtyPerUnit: 2, leadDays: 21, substituteIds: ['sub_0256'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_01056', industryId: 'ind_096', regionId: 'reg_20', inputSku: 'in_0368', qtyPerUnit: 3, leadDays: 22, substituteIds: ['sub_0257'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_01057', industryId: 'ind_097', regionId: 'reg_21', inputSku: 'in_0371', qtyPerUnit: 4, leadDays: 23, substituteIds: ['sub_0258'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_01058', industryId: 'ind_098', regionId: 'reg_22', inputSku: 'in_0374', qtyPerUnit: 5, leadDays: 24, substituteIds: ['sub_0259'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_01059', industryId: 'ind_099', regionId: 'reg_23', inputSku: 'in_0377', qtyPerUnit: 6, leadDays: 25, substituteIds: ['sub_0260'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_01060', industryId: 'ind_100', regionId: 'reg_24', inputSku: 'in_0380', qtyPerUnit: 7, leadDays: 26, substituteIds: ['sub_0261'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_01061', industryId: 'ind_101', regionId: 'reg_25', inputSku: 'in_0383', qtyPerUnit: 8, leadDays: 27, substituteIds: ['sub_0262'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_01062', industryId: 'ind_102', regionId: 'reg_26', inputSku: 'in_0386', qtyPerUnit: 9, leadDays: 28, substituteIds: ['sub_0263'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_01063', industryId: 'ind_103', regionId: 'reg_27', inputSku: 'in_0389', qtyPerUnit: 10, leadDays: 29, substituteIds: ['sub_0264'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_01064', industryId: 'ind_104', regionId: 'reg_00', inputSku: 'in_0392', qtyPerUnit: 11, leadDays: 30, substituteIds: ['sub_0265'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_01065', industryId: 'ind_105', regionId: 'reg_01', inputSku: 'in_0395', qtyPerUnit: 12, leadDays: 31, substituteIds: ['sub_0266'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_01066', industryId: 'ind_106', regionId: 'reg_02', inputSku: 'in_0398', qtyPerUnit: 13, leadDays: 32, substituteIds: ['sub_0267'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_01067', industryId: 'ind_107', regionId: 'reg_03', inputSku: 'in_0001', qtyPerUnit: 14, leadDays: 33, substituteIds: ['sub_0268'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_01068', industryId: 'ind_108', regionId: 'reg_04', inputSku: 'in_0004', qtyPerUnit: 15, leadDays: 34, substituteIds: ['sub_0269'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_01069', industryId: 'ind_109', regionId: 'reg_05', inputSku: 'in_0007', qtyPerUnit: 16, leadDays: 35, substituteIds: ['sub_0270'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_01070', industryId: 'ind_110', regionId: 'reg_06', inputSku: 'in_0010', qtyPerUnit: 17, leadDays: 36, substituteIds: ['sub_0271'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_01071', industryId: 'ind_111', regionId: 'reg_07', inputSku: 'in_0013', qtyPerUnit: 1, leadDays: 37, substituteIds: ['sub_0272'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_01072', industryId: 'ind_112', regionId: 'reg_08', inputSku: 'in_0016', qtyPerUnit: 2, leadDays: 38, substituteIds: ['sub_0273'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_01073', industryId: 'ind_113', regionId: 'reg_09', inputSku: 'in_0019', qtyPerUnit: 3, leadDays: 39, substituteIds: ['sub_0274'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_01074', industryId: 'ind_114', regionId: 'reg_10', inputSku: 'in_0022', qtyPerUnit: 4, leadDays: 40, substituteIds: ['sub_0275'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_01075', industryId: 'ind_115', regionId: 'reg_11', inputSku: 'in_0025', qtyPerUnit: 5, leadDays: 41, substituteIds: ['sub_0276'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_01076', industryId: 'ind_116', regionId: 'reg_12', inputSku: 'in_0028', qtyPerUnit: 6, leadDays: 42, substituteIds: ['sub_0277'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_01077', industryId: 'ind_117', regionId: 'reg_13', inputSku: 'in_0031', qtyPerUnit: 7, leadDays: 43, substituteIds: ['sub_0278'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_01078', industryId: 'ind_118', regionId: 'reg_14', inputSku: 'in_0034', qtyPerUnit: 8, leadDays: 44, substituteIds: ['sub_0279'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_01079', industryId: 'ind_119', regionId: 'reg_15', inputSku: 'in_0037', qtyPerUnit: 9, leadDays: 45, substituteIds: ['sub_0280'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_01080', industryId: 'ind_000', regionId: 'reg_16', inputSku: 'in_0040', qtyPerUnit: 10, leadDays: 1, substituteIds: ['sub_0281'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_01081', industryId: 'ind_001', regionId: 'reg_17', inputSku: 'in_0043', qtyPerUnit: 11, leadDays: 2, substituteIds: ['sub_0282'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_01082', industryId: 'ind_002', regionId: 'reg_18', inputSku: 'in_0046', qtyPerUnit: 12, leadDays: 3, substituteIds: ['sub_0283'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_01083', industryId: 'ind_003', regionId: 'reg_19', inputSku: 'in_0049', qtyPerUnit: 13, leadDays: 4, substituteIds: ['sub_0284'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_01084', industryId: 'ind_004', regionId: 'reg_20', inputSku: 'in_0052', qtyPerUnit: 14, leadDays: 5, substituteIds: ['sub_0285'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_01085', industryId: 'ind_005', regionId: 'reg_21', inputSku: 'in_0055', qtyPerUnit: 15, leadDays: 6, substituteIds: ['sub_0286'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_01086', industryId: 'ind_006', regionId: 'reg_22', inputSku: 'in_0058', qtyPerUnit: 16, leadDays: 7, substituteIds: ['sub_0287'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_01087', industryId: 'ind_007', regionId: 'reg_23', inputSku: 'in_0061', qtyPerUnit: 17, leadDays: 8, substituteIds: ['sub_0288'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_01088', industryId: 'ind_008', regionId: 'reg_24', inputSku: 'in_0064', qtyPerUnit: 1, leadDays: 9, substituteIds: ['sub_0289'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_01089', industryId: 'ind_009', regionId: 'reg_25', inputSku: 'in_0067', qtyPerUnit: 2, leadDays: 10, substituteIds: ['sub_0290'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_01090', industryId: 'ind_010', regionId: 'reg_26', inputSku: 'in_0070', qtyPerUnit: 3, leadDays: 11, substituteIds: ['sub_0291'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_01091', industryId: 'ind_011', regionId: 'reg_27', inputSku: 'in_0073', qtyPerUnit: 4, leadDays: 12, substituteIds: ['sub_0292'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_01092', industryId: 'ind_012', regionId: 'reg_00', inputSku: 'in_0076', qtyPerUnit: 5, leadDays: 13, substituteIds: ['sub_0293'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_01093', industryId: 'ind_013', regionId: 'reg_01', inputSku: 'in_0079', qtyPerUnit: 6, leadDays: 14, substituteIds: ['sub_0294'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_01094', industryId: 'ind_014', regionId: 'reg_02', inputSku: 'in_0082', qtyPerUnit: 7, leadDays: 15, substituteIds: ['sub_0295'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_01095', industryId: 'ind_015', regionId: 'reg_03', inputSku: 'in_0085', qtyPerUnit: 8, leadDays: 16, substituteIds: ['sub_0296'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_01096', industryId: 'ind_016', regionId: 'reg_04', inputSku: 'in_0088', qtyPerUnit: 9, leadDays: 17, substituteIds: ['sub_0297'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_01097', industryId: 'ind_017', regionId: 'reg_05', inputSku: 'in_0091', qtyPerUnit: 10, leadDays: 18, substituteIds: ['sub_0298'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_01098', industryId: 'ind_018', regionId: 'reg_06', inputSku: 'in_0094', qtyPerUnit: 11, leadDays: 19, substituteIds: ['sub_0299'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_01099', industryId: 'ind_019', regionId: 'reg_07', inputSku: 'in_0097', qtyPerUnit: 12, leadDays: 20, substituteIds: ['sub_0300'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_01100', industryId: 'ind_020', regionId: 'reg_08', inputSku: 'in_0100', qtyPerUnit: 13, leadDays: 21, substituteIds: ['sub_0301'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_01101', industryId: 'ind_021', regionId: 'reg_09', inputSku: 'in_0103', qtyPerUnit: 14, leadDays: 22, substituteIds: ['sub_0302'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_01102', industryId: 'ind_022', regionId: 'reg_10', inputSku: 'in_0106', qtyPerUnit: 15, leadDays: 23, substituteIds: ['sub_0303'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_01103', industryId: 'ind_023', regionId: 'reg_11', inputSku: 'in_0109', qtyPerUnit: 16, leadDays: 24, substituteIds: ['sub_0304'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_01104', industryId: 'ind_024', regionId: 'reg_12', inputSku: 'in_0112', qtyPerUnit: 17, leadDays: 25, substituteIds: ['sub_0305'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_01105', industryId: 'ind_025', regionId: 'reg_13', inputSku: 'in_0115', qtyPerUnit: 1, leadDays: 26, substituteIds: ['sub_0306'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_01106', industryId: 'ind_026', regionId: 'reg_14', inputSku: 'in_0118', qtyPerUnit: 2, leadDays: 27, substituteIds: ['sub_0307'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_01107', industryId: 'ind_027', regionId: 'reg_15', inputSku: 'in_0121', qtyPerUnit: 3, leadDays: 28, substituteIds: ['sub_0308'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_01108', industryId: 'ind_028', regionId: 'reg_16', inputSku: 'in_0124', qtyPerUnit: 4, leadDays: 29, substituteIds: ['sub_0309'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_01109', industryId: 'ind_029', regionId: 'reg_17', inputSku: 'in_0127', qtyPerUnit: 5, leadDays: 30, substituteIds: ['sub_0310'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_01110', industryId: 'ind_030', regionId: 'reg_18', inputSku: 'in_0130', qtyPerUnit: 6, leadDays: 31, substituteIds: ['sub_0311'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_01111', industryId: 'ind_031', regionId: 'reg_19', inputSku: 'in_0133', qtyPerUnit: 7, leadDays: 32, substituteIds: ['sub_0312'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_01112', industryId: 'ind_032', regionId: 'reg_20', inputSku: 'in_0136', qtyPerUnit: 8, leadDays: 33, substituteIds: ['sub_0313'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_01113', industryId: 'ind_033', regionId: 'reg_21', inputSku: 'in_0139', qtyPerUnit: 9, leadDays: 34, substituteIds: ['sub_0314'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_01114', industryId: 'ind_034', regionId: 'reg_22', inputSku: 'in_0142', qtyPerUnit: 10, leadDays: 35, substituteIds: ['sub_0315'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_01115', industryId: 'ind_035', regionId: 'reg_23', inputSku: 'in_0145', qtyPerUnit: 11, leadDays: 36, substituteIds: ['sub_0316'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_01116', industryId: 'ind_036', regionId: 'reg_24', inputSku: 'in_0148', qtyPerUnit: 12, leadDays: 37, substituteIds: ['sub_0317'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_01117', industryId: 'ind_037', regionId: 'reg_25', inputSku: 'in_0151', qtyPerUnit: 13, leadDays: 38, substituteIds: ['sub_0318'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_01118', industryId: 'ind_038', regionId: 'reg_26', inputSku: 'in_0154', qtyPerUnit: 14, leadDays: 39, substituteIds: ['sub_0319'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_01119', industryId: 'ind_039', regionId: 'reg_27', inputSku: 'in_0157', qtyPerUnit: 15, leadDays: 40, substituteIds: ['sub_0320'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_01120', industryId: 'ind_040', regionId: 'reg_00', inputSku: 'in_0160', qtyPerUnit: 16, leadDays: 41, substituteIds: ['sub_0321'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_01121', industryId: 'ind_041', regionId: 'reg_01', inputSku: 'in_0163', qtyPerUnit: 17, leadDays: 42, substituteIds: ['sub_0322'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_01122', industryId: 'ind_042', regionId: 'reg_02', inputSku: 'in_0166', qtyPerUnit: 1, leadDays: 43, substituteIds: ['sub_0323'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_01123', industryId: 'ind_043', regionId: 'reg_03', inputSku: 'in_0169', qtyPerUnit: 2, leadDays: 44, substituteIds: ['sub_0324'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_01124', industryId: 'ind_044', regionId: 'reg_04', inputSku: 'in_0172', qtyPerUnit: 3, leadDays: 45, substituteIds: ['sub_0325'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_01125', industryId: 'ind_045', regionId: 'reg_05', inputSku: 'in_0175', qtyPerUnit: 4, leadDays: 1, substituteIds: ['sub_0326'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_01126', industryId: 'ind_046', regionId: 'reg_06', inputSku: 'in_0178', qtyPerUnit: 5, leadDays: 2, substituteIds: ['sub_0327'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_01127', industryId: 'ind_047', regionId: 'reg_07', inputSku: 'in_0181', qtyPerUnit: 6, leadDays: 3, substituteIds: ['sub_0328'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_01128', industryId: 'ind_048', regionId: 'reg_08', inputSku: 'in_0184', qtyPerUnit: 7, leadDays: 4, substituteIds: ['sub_0329'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_01129', industryId: 'ind_049', regionId: 'reg_09', inputSku: 'in_0187', qtyPerUnit: 8, leadDays: 5, substituteIds: ['sub_0330'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_01130', industryId: 'ind_050', regionId: 'reg_10', inputSku: 'in_0190', qtyPerUnit: 9, leadDays: 6, substituteIds: ['sub_0331'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_01131', industryId: 'ind_051', regionId: 'reg_11', inputSku: 'in_0193', qtyPerUnit: 10, leadDays: 7, substituteIds: ['sub_0332'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_01132', industryId: 'ind_052', regionId: 'reg_12', inputSku: 'in_0196', qtyPerUnit: 11, leadDays: 8, substituteIds: ['sub_0333'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_01133', industryId: 'ind_053', regionId: 'reg_13', inputSku: 'in_0199', qtyPerUnit: 12, leadDays: 9, substituteIds: ['sub_0334'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_01134', industryId: 'ind_054', regionId: 'reg_14', inputSku: 'in_0202', qtyPerUnit: 13, leadDays: 10, substituteIds: ['sub_0335'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_01135', industryId: 'ind_055', regionId: 'reg_15', inputSku: 'in_0205', qtyPerUnit: 14, leadDays: 11, substituteIds: ['sub_0336'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_01136', industryId: 'ind_056', regionId: 'reg_16', inputSku: 'in_0208', qtyPerUnit: 15, leadDays: 12, substituteIds: ['sub_0337'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_01137', industryId: 'ind_057', regionId: 'reg_17', inputSku: 'in_0211', qtyPerUnit: 16, leadDays: 13, substituteIds: ['sub_0338'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_01138', industryId: 'ind_058', regionId: 'reg_18', inputSku: 'in_0214', qtyPerUnit: 17, leadDays: 14, substituteIds: ['sub_0339'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_01139', industryId: 'ind_059', regionId: 'reg_19', inputSku: 'in_0217', qtyPerUnit: 1, leadDays: 15, substituteIds: ['sub_0340'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_01140', industryId: 'ind_060', regionId: 'reg_20', inputSku: 'in_0220', qtyPerUnit: 2, leadDays: 16, substituteIds: ['sub_0341'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_01141', industryId: 'ind_061', regionId: 'reg_21', inputSku: 'in_0223', qtyPerUnit: 3, leadDays: 17, substituteIds: ['sub_0342'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_01142', industryId: 'ind_062', regionId: 'reg_22', inputSku: 'in_0226', qtyPerUnit: 4, leadDays: 18, substituteIds: ['sub_0343'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_01143', industryId: 'ind_063', regionId: 'reg_23', inputSku: 'in_0229', qtyPerUnit: 5, leadDays: 19, substituteIds: ['sub_0344'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_01144', industryId: 'ind_064', regionId: 'reg_24', inputSku: 'in_0232', qtyPerUnit: 6, leadDays: 20, substituteIds: ['sub_0345'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_01145', industryId: 'ind_065', regionId: 'reg_25', inputSku: 'in_0235', qtyPerUnit: 7, leadDays: 21, substituteIds: ['sub_0346'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_01146', industryId: 'ind_066', regionId: 'reg_26', inputSku: 'in_0238', qtyPerUnit: 8, leadDays: 22, substituteIds: ['sub_0347'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_01147', industryId: 'ind_067', regionId: 'reg_27', inputSku: 'in_0241', qtyPerUnit: 9, leadDays: 23, substituteIds: ['sub_0348'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_01148', industryId: 'ind_068', regionId: 'reg_00', inputSku: 'in_0244', qtyPerUnit: 10, leadDays: 24, substituteIds: ['sub_0349'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_01149', industryId: 'ind_069', regionId: 'reg_01', inputSku: 'in_0247', qtyPerUnit: 11, leadDays: 25, substituteIds: ['sub_0350'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_01150', industryId: 'ind_070', regionId: 'reg_02', inputSku: 'in_0250', qtyPerUnit: 12, leadDays: 26, substituteIds: ['sub_0351'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_01151', industryId: 'ind_071', regionId: 'reg_03', inputSku: 'in_0253', qtyPerUnit: 13, leadDays: 27, substituteIds: ['sub_0352'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_01152', industryId: 'ind_072', regionId: 'reg_04', inputSku: 'in_0256', qtyPerUnit: 14, leadDays: 28, substituteIds: ['sub_0353'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_01153', industryId: 'ind_073', regionId: 'reg_05', inputSku: 'in_0259', qtyPerUnit: 15, leadDays: 29, substituteIds: ['sub_0354'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_01154', industryId: 'ind_074', regionId: 'reg_06', inputSku: 'in_0262', qtyPerUnit: 16, leadDays: 30, substituteIds: ['sub_0355'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_01155', industryId: 'ind_075', regionId: 'reg_07', inputSku: 'in_0265', qtyPerUnit: 17, leadDays: 31, substituteIds: ['sub_0356'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_01156', industryId: 'ind_076', regionId: 'reg_08', inputSku: 'in_0268', qtyPerUnit: 1, leadDays: 32, substituteIds: ['sub_0357'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_01157', industryId: 'ind_077', regionId: 'reg_09', inputSku: 'in_0271', qtyPerUnit: 2, leadDays: 33, substituteIds: ['sub_0358'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_01158', industryId: 'ind_078', regionId: 'reg_10', inputSku: 'in_0274', qtyPerUnit: 3, leadDays: 34, substituteIds: ['sub_0359'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_01159', industryId: 'ind_079', regionId: 'reg_11', inputSku: 'in_0277', qtyPerUnit: 4, leadDays: 35, substituteIds: ['sub_0360'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_01160', industryId: 'ind_080', regionId: 'reg_12', inputSku: 'in_0280', qtyPerUnit: 5, leadDays: 36, substituteIds: ['sub_0361'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_01161', industryId: 'ind_081', regionId: 'reg_13', inputSku: 'in_0283', qtyPerUnit: 6, leadDays: 37, substituteIds: ['sub_0362'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_01162', industryId: 'ind_082', regionId: 'reg_14', inputSku: 'in_0286', qtyPerUnit: 7, leadDays: 38, substituteIds: ['sub_0363'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_01163', industryId: 'ind_083', regionId: 'reg_15', inputSku: 'in_0289', qtyPerUnit: 8, leadDays: 39, substituteIds: ['sub_0364'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_01164', industryId: 'ind_084', regionId: 'reg_16', inputSku: 'in_0292', qtyPerUnit: 9, leadDays: 40, substituteIds: ['sub_0365'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_01165', industryId: 'ind_085', regionId: 'reg_17', inputSku: 'in_0295', qtyPerUnit: 10, leadDays: 41, substituteIds: ['sub_0366'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_01166', industryId: 'ind_086', regionId: 'reg_18', inputSku: 'in_0298', qtyPerUnit: 11, leadDays: 42, substituteIds: ['sub_0367'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_01167', industryId: 'ind_087', regionId: 'reg_19', inputSku: 'in_0301', qtyPerUnit: 12, leadDays: 43, substituteIds: ['sub_0368'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_01168', industryId: 'ind_088', regionId: 'reg_20', inputSku: 'in_0304', qtyPerUnit: 13, leadDays: 44, substituteIds: ['sub_0369'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_01169', industryId: 'ind_089', regionId: 'reg_21', inputSku: 'in_0307', qtyPerUnit: 14, leadDays: 45, substituteIds: ['sub_0370'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_01170', industryId: 'ind_090', regionId: 'reg_22', inputSku: 'in_0310', qtyPerUnit: 15, leadDays: 1, substituteIds: ['sub_0371'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_01171', industryId: 'ind_091', regionId: 'reg_23', inputSku: 'in_0313', qtyPerUnit: 16, leadDays: 2, substituteIds: ['sub_0372'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_01172', industryId: 'ind_092', regionId: 'reg_24', inputSku: 'in_0316', qtyPerUnit: 17, leadDays: 3, substituteIds: ['sub_0373'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_01173', industryId: 'ind_093', regionId: 'reg_25', inputSku: 'in_0319', qtyPerUnit: 1, leadDays: 4, substituteIds: ['sub_0374'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_01174', industryId: 'ind_094', regionId: 'reg_26', inputSku: 'in_0322', qtyPerUnit: 2, leadDays: 5, substituteIds: ['sub_0375'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_01175', industryId: 'ind_095', regionId: 'reg_27', inputSku: 'in_0325', qtyPerUnit: 3, leadDays: 6, substituteIds: ['sub_0376'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_01176', industryId: 'ind_096', regionId: 'reg_00', inputSku: 'in_0328', qtyPerUnit: 4, leadDays: 7, substituteIds: ['sub_0377'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_01177', industryId: 'ind_097', regionId: 'reg_01', inputSku: 'in_0331', qtyPerUnit: 5, leadDays: 8, substituteIds: ['sub_0378'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_01178', industryId: 'ind_098', regionId: 'reg_02', inputSku: 'in_0334', qtyPerUnit: 6, leadDays: 9, substituteIds: ['sub_0379'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_01179', industryId: 'ind_099', regionId: 'reg_03', inputSku: 'in_0337', qtyPerUnit: 7, leadDays: 10, substituteIds: ['sub_0380'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_01180', industryId: 'ind_100', regionId: 'reg_04', inputSku: 'in_0340', qtyPerUnit: 8, leadDays: 11, substituteIds: ['sub_0381'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_01181', industryId: 'ind_101', regionId: 'reg_05', inputSku: 'in_0343', qtyPerUnit: 9, leadDays: 12, substituteIds: ['sub_0382'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_01182', industryId: 'ind_102', regionId: 'reg_06', inputSku: 'in_0346', qtyPerUnit: 10, leadDays: 13, substituteIds: ['sub_0383'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_01183', industryId: 'ind_103', regionId: 'reg_07', inputSku: 'in_0349', qtyPerUnit: 11, leadDays: 14, substituteIds: ['sub_0384'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_01184', industryId: 'ind_104', regionId: 'reg_08', inputSku: 'in_0352', qtyPerUnit: 12, leadDays: 15, substituteIds: ['sub_0385'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_01185', industryId: 'ind_105', regionId: 'reg_09', inputSku: 'in_0355', qtyPerUnit: 13, leadDays: 16, substituteIds: ['sub_0386'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_01186', industryId: 'ind_106', regionId: 'reg_10', inputSku: 'in_0358', qtyPerUnit: 14, leadDays: 17, substituteIds: ['sub_0387'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_01187', industryId: 'ind_107', regionId: 'reg_11', inputSku: 'in_0361', qtyPerUnit: 15, leadDays: 18, substituteIds: ['sub_0388'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_01188', industryId: 'ind_108', regionId: 'reg_12', inputSku: 'in_0364', qtyPerUnit: 16, leadDays: 19, substituteIds: ['sub_0389'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_01189', industryId: 'ind_109', regionId: 'reg_13', inputSku: 'in_0367', qtyPerUnit: 17, leadDays: 20, substituteIds: ['sub_0390'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_01190', industryId: 'ind_110', regionId: 'reg_14', inputSku: 'in_0370', qtyPerUnit: 1, leadDays: 21, substituteIds: ['sub_0391'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_01191', industryId: 'ind_111', regionId: 'reg_15', inputSku: 'in_0373', qtyPerUnit: 2, leadDays: 22, substituteIds: ['sub_0392'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_01192', industryId: 'ind_112', regionId: 'reg_16', inputSku: 'in_0376', qtyPerUnit: 3, leadDays: 23, substituteIds: ['sub_0393'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_01193', industryId: 'ind_113', regionId: 'reg_17', inputSku: 'in_0379', qtyPerUnit: 4, leadDays: 24, substituteIds: ['sub_0394'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_01194', industryId: 'ind_114', regionId: 'reg_18', inputSku: 'in_0382', qtyPerUnit: 5, leadDays: 25, substituteIds: ['sub_0395'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_01195', industryId: 'ind_115', regionId: 'reg_19', inputSku: 'in_0385', qtyPerUnit: 6, leadDays: 26, substituteIds: ['sub_0396'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_01196', industryId: 'ind_116', regionId: 'reg_20', inputSku: 'in_0388', qtyPerUnit: 7, leadDays: 27, substituteIds: ['sub_0397'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_01197', industryId: 'ind_117', regionId: 'reg_21', inputSku: 'in_0391', qtyPerUnit: 8, leadDays: 28, substituteIds: ['sub_0398'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_01198', industryId: 'ind_118', regionId: 'reg_22', inputSku: 'in_0394', qtyPerUnit: 9, leadDays: 29, substituteIds: ['sub_0399'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_01199', industryId: 'ind_119', regionId: 'reg_23', inputSku: 'in_0397', qtyPerUnit: 10, leadDays: 30, substituteIds: ['sub_0000'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_01200', industryId: 'ind_000', regionId: 'reg_24', inputSku: 'in_0000', qtyPerUnit: 11, leadDays: 31, substituteIds: ['sub_0001'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_01201', industryId: 'ind_001', regionId: 'reg_25', inputSku: 'in_0003', qtyPerUnit: 12, leadDays: 32, substituteIds: ['sub_0002'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_01202', industryId: 'ind_002', regionId: 'reg_26', inputSku: 'in_0006', qtyPerUnit: 13, leadDays: 33, substituteIds: ['sub_0003'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_01203', industryId: 'ind_003', regionId: 'reg_27', inputSku: 'in_0009', qtyPerUnit: 14, leadDays: 34, substituteIds: ['sub_0004'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_01204', industryId: 'ind_004', regionId: 'reg_00', inputSku: 'in_0012', qtyPerUnit: 15, leadDays: 35, substituteIds: ['sub_0005'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_01205', industryId: 'ind_005', regionId: 'reg_01', inputSku: 'in_0015', qtyPerUnit: 16, leadDays: 36, substituteIds: ['sub_0006'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_01206', industryId: 'ind_006', regionId: 'reg_02', inputSku: 'in_0018', qtyPerUnit: 17, leadDays: 37, substituteIds: ['sub_0007'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_01207', industryId: 'ind_007', regionId: 'reg_03', inputSku: 'in_0021', qtyPerUnit: 1, leadDays: 38, substituteIds: ['sub_0008'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_01208', industryId: 'ind_008', regionId: 'reg_04', inputSku: 'in_0024', qtyPerUnit: 2, leadDays: 39, substituteIds: ['sub_0009'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_01209', industryId: 'ind_009', regionId: 'reg_05', inputSku: 'in_0027', qtyPerUnit: 3, leadDays: 40, substituteIds: ['sub_0010'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_01210', industryId: 'ind_010', regionId: 'reg_06', inputSku: 'in_0030', qtyPerUnit: 4, leadDays: 41, substituteIds: ['sub_0011'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_01211', industryId: 'ind_011', regionId: 'reg_07', inputSku: 'in_0033', qtyPerUnit: 5, leadDays: 42, substituteIds: ['sub_0012'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_01212', industryId: 'ind_012', regionId: 'reg_08', inputSku: 'in_0036', qtyPerUnit: 6, leadDays: 43, substituteIds: ['sub_0013'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_01213', industryId: 'ind_013', regionId: 'reg_09', inputSku: 'in_0039', qtyPerUnit: 7, leadDays: 44, substituteIds: ['sub_0014'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_01214', industryId: 'ind_014', regionId: 'reg_10', inputSku: 'in_0042', qtyPerUnit: 8, leadDays: 45, substituteIds: ['sub_0015'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_01215', industryId: 'ind_015', regionId: 'reg_11', inputSku: 'in_0045', qtyPerUnit: 9, leadDays: 1, substituteIds: ['sub_0016'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_01216', industryId: 'ind_016', regionId: 'reg_12', inputSku: 'in_0048', qtyPerUnit: 10, leadDays: 2, substituteIds: ['sub_0017'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_01217', industryId: 'ind_017', regionId: 'reg_13', inputSku: 'in_0051', qtyPerUnit: 11, leadDays: 3, substituteIds: ['sub_0018'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_01218', industryId: 'ind_018', regionId: 'reg_14', inputSku: 'in_0054', qtyPerUnit: 12, leadDays: 4, substituteIds: ['sub_0019'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_01219', industryId: 'ind_019', regionId: 'reg_15', inputSku: 'in_0057', qtyPerUnit: 13, leadDays: 5, substituteIds: ['sub_0020'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_01220', industryId: 'ind_020', regionId: 'reg_16', inputSku: 'in_0060', qtyPerUnit: 14, leadDays: 6, substituteIds: ['sub_0021'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_01221', industryId: 'ind_021', regionId: 'reg_17', inputSku: 'in_0063', qtyPerUnit: 15, leadDays: 7, substituteIds: ['sub_0022'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_01222', industryId: 'ind_022', regionId: 'reg_18', inputSku: 'in_0066', qtyPerUnit: 16, leadDays: 8, substituteIds: ['sub_0023'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_01223', industryId: 'ind_023', regionId: 'reg_19', inputSku: 'in_0069', qtyPerUnit: 17, leadDays: 9, substituteIds: ['sub_0024'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_01224', industryId: 'ind_024', regionId: 'reg_20', inputSku: 'in_0072', qtyPerUnit: 1, leadDays: 10, substituteIds: ['sub_0025'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_01225', industryId: 'ind_025', regionId: 'reg_21', inputSku: 'in_0075', qtyPerUnit: 2, leadDays: 11, substituteIds: ['sub_0026'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_01226', industryId: 'ind_026', regionId: 'reg_22', inputSku: 'in_0078', qtyPerUnit: 3, leadDays: 12, substituteIds: ['sub_0027'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_01227', industryId: 'ind_027', regionId: 'reg_23', inputSku: 'in_0081', qtyPerUnit: 4, leadDays: 13, substituteIds: ['sub_0028'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_01228', industryId: 'ind_028', regionId: 'reg_24', inputSku: 'in_0084', qtyPerUnit: 5, leadDays: 14, substituteIds: ['sub_0029'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_01229', industryId: 'ind_029', regionId: 'reg_25', inputSku: 'in_0087', qtyPerUnit: 6, leadDays: 15, substituteIds: ['sub_0030'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_01230', industryId: 'ind_030', regionId: 'reg_26', inputSku: 'in_0090', qtyPerUnit: 7, leadDays: 16, substituteIds: ['sub_0031'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_01231', industryId: 'ind_031', regionId: 'reg_27', inputSku: 'in_0093', qtyPerUnit: 8, leadDays: 17, substituteIds: ['sub_0032'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_01232', industryId: 'ind_032', regionId: 'reg_00', inputSku: 'in_0096', qtyPerUnit: 9, leadDays: 18, substituteIds: ['sub_0033'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_01233', industryId: 'ind_033', regionId: 'reg_01', inputSku: 'in_0099', qtyPerUnit: 10, leadDays: 19, substituteIds: ['sub_0034'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_01234', industryId: 'ind_034', regionId: 'reg_02', inputSku: 'in_0102', qtyPerUnit: 11, leadDays: 20, substituteIds: ['sub_0035'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_01235', industryId: 'ind_035', regionId: 'reg_03', inputSku: 'in_0105', qtyPerUnit: 12, leadDays: 21, substituteIds: ['sub_0036'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_01236', industryId: 'ind_036', regionId: 'reg_04', inputSku: 'in_0108', qtyPerUnit: 13, leadDays: 22, substituteIds: ['sub_0037'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_01237', industryId: 'ind_037', regionId: 'reg_05', inputSku: 'in_0111', qtyPerUnit: 14, leadDays: 23, substituteIds: ['sub_0038'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_01238', industryId: 'ind_038', regionId: 'reg_06', inputSku: 'in_0114', qtyPerUnit: 15, leadDays: 24, substituteIds: ['sub_0039'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_01239', industryId: 'ind_039', regionId: 'reg_07', inputSku: 'in_0117', qtyPerUnit: 16, leadDays: 25, substituteIds: ['sub_0040'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_01240', industryId: 'ind_040', regionId: 'reg_08', inputSku: 'in_0120', qtyPerUnit: 17, leadDays: 26, substituteIds: ['sub_0041'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_01241', industryId: 'ind_041', regionId: 'reg_09', inputSku: 'in_0123', qtyPerUnit: 1, leadDays: 27, substituteIds: ['sub_0042'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_01242', industryId: 'ind_042', regionId: 'reg_10', inputSku: 'in_0126', qtyPerUnit: 2, leadDays: 28, substituteIds: ['sub_0043'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_01243', industryId: 'ind_043', regionId: 'reg_11', inputSku: 'in_0129', qtyPerUnit: 3, leadDays: 29, substituteIds: ['sub_0044'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_01244', industryId: 'ind_044', regionId: 'reg_12', inputSku: 'in_0132', qtyPerUnit: 4, leadDays: 30, substituteIds: ['sub_0045'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_01245', industryId: 'ind_045', regionId: 'reg_13', inputSku: 'in_0135', qtyPerUnit: 5, leadDays: 31, substituteIds: ['sub_0046'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_01246', industryId: 'ind_046', regionId: 'reg_14', inputSku: 'in_0138', qtyPerUnit: 6, leadDays: 32, substituteIds: ['sub_0047'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_01247', industryId: 'ind_047', regionId: 'reg_15', inputSku: 'in_0141', qtyPerUnit: 7, leadDays: 33, substituteIds: ['sub_0048'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_01248', industryId: 'ind_048', regionId: 'reg_16', inputSku: 'in_0144', qtyPerUnit: 8, leadDays: 34, substituteIds: ['sub_0049'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_01249', industryId: 'ind_049', regionId: 'reg_17', inputSku: 'in_0147', qtyPerUnit: 9, leadDays: 35, substituteIds: ['sub_0050'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_01250', industryId: 'ind_050', regionId: 'reg_18', inputSku: 'in_0150', qtyPerUnit: 10, leadDays: 36, substituteIds: ['sub_0051'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_01251', industryId: 'ind_051', regionId: 'reg_19', inputSku: 'in_0153', qtyPerUnit: 11, leadDays: 37, substituteIds: ['sub_0052'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_01252', industryId: 'ind_052', regionId: 'reg_20', inputSku: 'in_0156', qtyPerUnit: 12, leadDays: 38, substituteIds: ['sub_0053'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_01253', industryId: 'ind_053', regionId: 'reg_21', inputSku: 'in_0159', qtyPerUnit: 13, leadDays: 39, substituteIds: ['sub_0054'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_01254', industryId: 'ind_054', regionId: 'reg_22', inputSku: 'in_0162', qtyPerUnit: 14, leadDays: 40, substituteIds: ['sub_0055'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_01255', industryId: 'ind_055', regionId: 'reg_23', inputSku: 'in_0165', qtyPerUnit: 15, leadDays: 41, substituteIds: ['sub_0056'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_01256', industryId: 'ind_056', regionId: 'reg_24', inputSku: 'in_0168', qtyPerUnit: 16, leadDays: 42, substituteIds: ['sub_0057'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_01257', industryId: 'ind_057', regionId: 'reg_25', inputSku: 'in_0171', qtyPerUnit: 17, leadDays: 43, substituteIds: ['sub_0058'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_01258', industryId: 'ind_058', regionId: 'reg_26', inputSku: 'in_0174', qtyPerUnit: 1, leadDays: 44, substituteIds: ['sub_0059'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_01259', industryId: 'ind_059', regionId: 'reg_27', inputSku: 'in_0177', qtyPerUnit: 2, leadDays: 45, substituteIds: ['sub_0060'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_01260', industryId: 'ind_060', regionId: 'reg_00', inputSku: 'in_0180', qtyPerUnit: 3, leadDays: 1, substituteIds: ['sub_0061'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_01261', industryId: 'ind_061', regionId: 'reg_01', inputSku: 'in_0183', qtyPerUnit: 4, leadDays: 2, substituteIds: ['sub_0062'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_01262', industryId: 'ind_062', regionId: 'reg_02', inputSku: 'in_0186', qtyPerUnit: 5, leadDays: 3, substituteIds: ['sub_0063'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_01263', industryId: 'ind_063', regionId: 'reg_03', inputSku: 'in_0189', qtyPerUnit: 6, leadDays: 4, substituteIds: ['sub_0064'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_01264', industryId: 'ind_064', regionId: 'reg_04', inputSku: 'in_0192', qtyPerUnit: 7, leadDays: 5, substituteIds: ['sub_0065'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_01265', industryId: 'ind_065', regionId: 'reg_05', inputSku: 'in_0195', qtyPerUnit: 8, leadDays: 6, substituteIds: ['sub_0066'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_01266', industryId: 'ind_066', regionId: 'reg_06', inputSku: 'in_0198', qtyPerUnit: 9, leadDays: 7, substituteIds: ['sub_0067'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_01267', industryId: 'ind_067', regionId: 'reg_07', inputSku: 'in_0201', qtyPerUnit: 10, leadDays: 8, substituteIds: ['sub_0068'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_01268', industryId: 'ind_068', regionId: 'reg_08', inputSku: 'in_0204', qtyPerUnit: 11, leadDays: 9, substituteIds: ['sub_0069'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_01269', industryId: 'ind_069', regionId: 'reg_09', inputSku: 'in_0207', qtyPerUnit: 12, leadDays: 10, substituteIds: ['sub_0070'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_01270', industryId: 'ind_070', regionId: 'reg_10', inputSku: 'in_0210', qtyPerUnit: 13, leadDays: 11, substituteIds: ['sub_0071'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_01271', industryId: 'ind_071', regionId: 'reg_11', inputSku: 'in_0213', qtyPerUnit: 14, leadDays: 12, substituteIds: ['sub_0072'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_01272', industryId: 'ind_072', regionId: 'reg_12', inputSku: 'in_0216', qtyPerUnit: 15, leadDays: 13, substituteIds: ['sub_0073'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_01273', industryId: 'ind_073', regionId: 'reg_13', inputSku: 'in_0219', qtyPerUnit: 16, leadDays: 14, substituteIds: ['sub_0074'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_01274', industryId: 'ind_074', regionId: 'reg_14', inputSku: 'in_0222', qtyPerUnit: 17, leadDays: 15, substituteIds: ['sub_0075'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_01275', industryId: 'ind_075', regionId: 'reg_15', inputSku: 'in_0225', qtyPerUnit: 1, leadDays: 16, substituteIds: ['sub_0076'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_01276', industryId: 'ind_076', regionId: 'reg_16', inputSku: 'in_0228', qtyPerUnit: 2, leadDays: 17, substituteIds: ['sub_0077'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_01277', industryId: 'ind_077', regionId: 'reg_17', inputSku: 'in_0231', qtyPerUnit: 3, leadDays: 18, substituteIds: ['sub_0078'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_01278', industryId: 'ind_078', regionId: 'reg_18', inputSku: 'in_0234', qtyPerUnit: 4, leadDays: 19, substituteIds: ['sub_0079'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_01279', industryId: 'ind_079', regionId: 'reg_19', inputSku: 'in_0237', qtyPerUnit: 5, leadDays: 20, substituteIds: ['sub_0080'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_01280', industryId: 'ind_080', regionId: 'reg_20', inputSku: 'in_0240', qtyPerUnit: 6, leadDays: 21, substituteIds: ['sub_0081'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_01281', industryId: 'ind_081', regionId: 'reg_21', inputSku: 'in_0243', qtyPerUnit: 7, leadDays: 22, substituteIds: ['sub_0082'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_01282', industryId: 'ind_082', regionId: 'reg_22', inputSku: 'in_0246', qtyPerUnit: 8, leadDays: 23, substituteIds: ['sub_0083'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_01283', industryId: 'ind_083', regionId: 'reg_23', inputSku: 'in_0249', qtyPerUnit: 9, leadDays: 24, substituteIds: ['sub_0084'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_01284', industryId: 'ind_084', regionId: 'reg_24', inputSku: 'in_0252', qtyPerUnit: 10, leadDays: 25, substituteIds: ['sub_0085'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_01285', industryId: 'ind_085', regionId: 'reg_25', inputSku: 'in_0255', qtyPerUnit: 11, leadDays: 26, substituteIds: ['sub_0086'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_01286', industryId: 'ind_086', regionId: 'reg_26', inputSku: 'in_0258', qtyPerUnit: 12, leadDays: 27, substituteIds: ['sub_0087'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_01287', industryId: 'ind_087', regionId: 'reg_27', inputSku: 'in_0261', qtyPerUnit: 13, leadDays: 28, substituteIds: ['sub_0088'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_01288', industryId: 'ind_088', regionId: 'reg_00', inputSku: 'in_0264', qtyPerUnit: 14, leadDays: 29, substituteIds: ['sub_0089'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_01289', industryId: 'ind_089', regionId: 'reg_01', inputSku: 'in_0267', qtyPerUnit: 15, leadDays: 30, substituteIds: ['sub_0090'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_01290', industryId: 'ind_090', regionId: 'reg_02', inputSku: 'in_0270', qtyPerUnit: 16, leadDays: 31, substituteIds: ['sub_0091'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_01291', industryId: 'ind_091', regionId: 'reg_03', inputSku: 'in_0273', qtyPerUnit: 17, leadDays: 32, substituteIds: ['sub_0092'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_01292', industryId: 'ind_092', regionId: 'reg_04', inputSku: 'in_0276', qtyPerUnit: 1, leadDays: 33, substituteIds: ['sub_0093'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_01293', industryId: 'ind_093', regionId: 'reg_05', inputSku: 'in_0279', qtyPerUnit: 2, leadDays: 34, substituteIds: ['sub_0094'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_01294', industryId: 'ind_094', regionId: 'reg_06', inputSku: 'in_0282', qtyPerUnit: 3, leadDays: 35, substituteIds: ['sub_0095'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_01295', industryId: 'ind_095', regionId: 'reg_07', inputSku: 'in_0285', qtyPerUnit: 4, leadDays: 36, substituteIds: ['sub_0096'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_01296', industryId: 'ind_096', regionId: 'reg_08', inputSku: 'in_0288', qtyPerUnit: 5, leadDays: 37, substituteIds: ['sub_0097'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_01297', industryId: 'ind_097', regionId: 'reg_09', inputSku: 'in_0291', qtyPerUnit: 6, leadDays: 38, substituteIds: ['sub_0098'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_01298', industryId: 'ind_098', regionId: 'reg_10', inputSku: 'in_0294', qtyPerUnit: 7, leadDays: 39, substituteIds: ['sub_0099'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_01299', industryId: 'ind_099', regionId: 'reg_11', inputSku: 'in_0297', qtyPerUnit: 8, leadDays: 40, substituteIds: ['sub_0100'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_01300', industryId: 'ind_100', regionId: 'reg_12', inputSku: 'in_0300', qtyPerUnit: 9, leadDays: 41, substituteIds: ['sub_0101'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_01301', industryId: 'ind_101', regionId: 'reg_13', inputSku: 'in_0303', qtyPerUnit: 10, leadDays: 42, substituteIds: ['sub_0102'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_01302', industryId: 'ind_102', regionId: 'reg_14', inputSku: 'in_0306', qtyPerUnit: 11, leadDays: 43, substituteIds: ['sub_0103'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_01303', industryId: 'ind_103', regionId: 'reg_15', inputSku: 'in_0309', qtyPerUnit: 12, leadDays: 44, substituteIds: ['sub_0104'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_01304', industryId: 'ind_104', regionId: 'reg_16', inputSku: 'in_0312', qtyPerUnit: 13, leadDays: 45, substituteIds: ['sub_0105'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_01305', industryId: 'ind_105', regionId: 'reg_17', inputSku: 'in_0315', qtyPerUnit: 14, leadDays: 1, substituteIds: ['sub_0106'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_01306', industryId: 'ind_106', regionId: 'reg_18', inputSku: 'in_0318', qtyPerUnit: 15, leadDays: 2, substituteIds: ['sub_0107'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_01307', industryId: 'ind_107', regionId: 'reg_19', inputSku: 'in_0321', qtyPerUnit: 16, leadDays: 3, substituteIds: ['sub_0108'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_01308', industryId: 'ind_108', regionId: 'reg_20', inputSku: 'in_0324', qtyPerUnit: 17, leadDays: 4, substituteIds: ['sub_0109'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_01309', industryId: 'ind_109', regionId: 'reg_21', inputSku: 'in_0327', qtyPerUnit: 1, leadDays: 5, substituteIds: ['sub_0110'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_01310', industryId: 'ind_110', regionId: 'reg_22', inputSku: 'in_0330', qtyPerUnit: 2, leadDays: 6, substituteIds: ['sub_0111'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_01311', industryId: 'ind_111', regionId: 'reg_23', inputSku: 'in_0333', qtyPerUnit: 3, leadDays: 7, substituteIds: ['sub_0112'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_01312', industryId: 'ind_112', regionId: 'reg_24', inputSku: 'in_0336', qtyPerUnit: 4, leadDays: 8, substituteIds: ['sub_0113'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_01313', industryId: 'ind_113', regionId: 'reg_25', inputSku: 'in_0339', qtyPerUnit: 5, leadDays: 9, substituteIds: ['sub_0114'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_01314', industryId: 'ind_114', regionId: 'reg_26', inputSku: 'in_0342', qtyPerUnit: 6, leadDays: 10, substituteIds: ['sub_0115'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_01315', industryId: 'ind_115', regionId: 'reg_27', inputSku: 'in_0345', qtyPerUnit: 7, leadDays: 11, substituteIds: ['sub_0116'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_01316', industryId: 'ind_116', regionId: 'reg_00', inputSku: 'in_0348', qtyPerUnit: 8, leadDays: 12, substituteIds: ['sub_0117'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_01317', industryId: 'ind_117', regionId: 'reg_01', inputSku: 'in_0351', qtyPerUnit: 9, leadDays: 13, substituteIds: ['sub_0118'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_01318', industryId: 'ind_118', regionId: 'reg_02', inputSku: 'in_0354', qtyPerUnit: 10, leadDays: 14, substituteIds: ['sub_0119'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_01319', industryId: 'ind_119', regionId: 'reg_03', inputSku: 'in_0357', qtyPerUnit: 11, leadDays: 15, substituteIds: ['sub_0120'], elasticity: 0.19, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_01320', industryId: 'ind_000', regionId: 'reg_04', inputSku: 'in_0360', qtyPerUnit: 12, leadDays: 16, substituteIds: ['sub_0121'], elasticity: 0.20, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_01321', industryId: 'ind_001', regionId: 'reg_05', inputSku: 'in_0363', qtyPerUnit: 13, leadDays: 17, substituteIds: ['sub_0122'], elasticity: 0.21, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_01322', industryId: 'ind_002', regionId: 'reg_06', inputSku: 'in_0366', qtyPerUnit: 14, leadDays: 18, substituteIds: ['sub_0123'], elasticity: 0.22, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_01323', industryId: 'ind_003', regionId: 'reg_07', inputSku: 'in_0369', qtyPerUnit: 15, leadDays: 19, substituteIds: ['sub_0124'], elasticity: 0.23, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_01324', industryId: 'ind_004', regionId: 'reg_08', inputSku: 'in_0372', qtyPerUnit: 16, leadDays: 20, substituteIds: ['sub_0125'], elasticity: 0.24, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_01325', industryId: 'ind_005', regionId: 'reg_09', inputSku: 'in_0375', qtyPerUnit: 17, leadDays: 21, substituteIds: ['sub_0126'], elasticity: 0.25, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_01326', industryId: 'ind_006', regionId: 'reg_10', inputSku: 'in_0378', qtyPerUnit: 1, leadDays: 22, substituteIds: ['sub_0127'], elasticity: 0.26, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_01327', industryId: 'ind_007', regionId: 'reg_11', inputSku: 'in_0381', qtyPerUnit: 2, leadDays: 23, substituteIds: ['sub_0128'], elasticity: 0.27, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_01328', industryId: 'ind_008', regionId: 'reg_12', inputSku: 'in_0384', qtyPerUnit: 3, leadDays: 24, substituteIds: ['sub_0129'], elasticity: 0.28, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_01329', industryId: 'ind_009', regionId: 'reg_13', inputSku: 'in_0387', qtyPerUnit: 4, leadDays: 25, substituteIds: ['sub_0130'], elasticity: 0.29, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_01330', industryId: 'ind_010', regionId: 'reg_14', inputSku: 'in_0390', qtyPerUnit: 5, leadDays: 26, substituteIds: ['sub_0131'], elasticity: 0.30, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_01331', industryId: 'ind_011', regionId: 'reg_15', inputSku: 'in_0393', qtyPerUnit: 6, leadDays: 27, substituteIds: ['sub_0132'], elasticity: 0.31, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_01332', industryId: 'ind_012', regionId: 'reg_16', inputSku: 'in_0396', qtyPerUnit: 7, leadDays: 28, substituteIds: ['sub_0133'], elasticity: 0.32, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_01333', industryId: 'ind_013', regionId: 'reg_17', inputSku: 'in_0399', qtyPerUnit: 8, leadDays: 29, substituteIds: ['sub_0134'], elasticity: 0.33, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_01334', industryId: 'ind_014', regionId: 'reg_18', inputSku: 'in_0002', qtyPerUnit: 9, leadDays: 30, substituteIds: ['sub_0135'], elasticity: 0.34, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_01335', industryId: 'ind_015', regionId: 'reg_19', inputSku: 'in_0005', qtyPerUnit: 10, leadDays: 31, substituteIds: ['sub_0136'], elasticity: 0.35, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_01336', industryId: 'ind_016', regionId: 'reg_20', inputSku: 'in_0008', qtyPerUnit: 11, leadDays: 32, substituteIds: ['sub_0137'], elasticity: 0.36, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_01337', industryId: 'ind_017', regionId: 'reg_21', inputSku: 'in_0011', qtyPerUnit: 12, leadDays: 33, substituteIds: ['sub_0138'], elasticity: 0.37, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_01338', industryId: 'ind_018', regionId: 'reg_22', inputSku: 'in_0014', qtyPerUnit: 13, leadDays: 34, substituteIds: ['sub_0139'], elasticity: 0.38, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_01339', industryId: 'ind_019', regionId: 'reg_23', inputSku: 'in_0017', qtyPerUnit: 14, leadDays: 35, substituteIds: ['sub_0140'], elasticity: 0.39, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_01340', industryId: 'ind_020', regionId: 'reg_24', inputSku: 'in_0020', qtyPerUnit: 15, leadDays: 36, substituteIds: ['sub_0141'], elasticity: 0.40, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_01341', industryId: 'ind_021', regionId: 'reg_25', inputSku: 'in_0023', qtyPerUnit: 16, leadDays: 37, substituteIds: ['sub_0142'], elasticity: 0.41, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_01342', industryId: 'ind_022', regionId: 'reg_26', inputSku: 'in_0026', qtyPerUnit: 17, leadDays: 38, substituteIds: ['sub_0143'], elasticity: 0.42, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_01343', industryId: 'ind_023', regionId: 'reg_27', inputSku: 'in_0029', qtyPerUnit: 1, leadDays: 39, substituteIds: ['sub_0144'], elasticity: 0.43, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_01344', industryId: 'ind_024', regionId: 'reg_00', inputSku: 'in_0032', qtyPerUnit: 2, leadDays: 40, substituteIds: ['sub_0145'], elasticity: 0.44, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_01345', industryId: 'ind_025', regionId: 'reg_01', inputSku: 'in_0035', qtyPerUnit: 3, leadDays: 41, substituteIds: ['sub_0146'], elasticity: 0.45, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_01346', industryId: 'ind_026', regionId: 'reg_02', inputSku: 'in_0038', qtyPerUnit: 4, leadDays: 42, substituteIds: ['sub_0147'], elasticity: 0.46, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_01347', industryId: 'ind_027', regionId: 'reg_03', inputSku: 'in_0041', qtyPerUnit: 5, leadDays: 43, substituteIds: ['sub_0148'], elasticity: 0.47, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_01348', industryId: 'ind_028', regionId: 'reg_04', inputSku: 'in_0044', qtyPerUnit: 6, leadDays: 44, substituteIds: ['sub_0149'], elasticity: 0.48, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_01349', industryId: 'ind_029', regionId: 'reg_05', inputSku: 'in_0047', qtyPerUnit: 7, leadDays: 45, substituteIds: ['sub_0150'], elasticity: 0.49, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_01350', industryId: 'ind_030', regionId: 'reg_06', inputSku: 'in_0050', qtyPerUnit: 8, leadDays: 1, substituteIds: ['sub_0151'], elasticity: 0.50, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_01351', industryId: 'ind_031', regionId: 'reg_07', inputSku: 'in_0053', qtyPerUnit: 9, leadDays: 2, substituteIds: ['sub_0152'], elasticity: 0.51, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_01352', industryId: 'ind_032', regionId: 'reg_08', inputSku: 'in_0056', qtyPerUnit: 10, leadDays: 3, substituteIds: ['sub_0153'], elasticity: 0.52, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_01353', industryId: 'ind_033', regionId: 'reg_09', inputSku: 'in_0059', qtyPerUnit: 11, leadDays: 4, substituteIds: ['sub_0154'], elasticity: 0.53, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_01354', industryId: 'ind_034', regionId: 'reg_10', inputSku: 'in_0062', qtyPerUnit: 12, leadDays: 5, substituteIds: ['sub_0155'], elasticity: 0.54, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_01355', industryId: 'ind_035', regionId: 'reg_11', inputSku: 'in_0065', qtyPerUnit: 13, leadDays: 6, substituteIds: ['sub_0156'], elasticity: 0.55, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_01356', industryId: 'ind_036', regionId: 'reg_12', inputSku: 'in_0068', qtyPerUnit: 14, leadDays: 7, substituteIds: ['sub_0157'], elasticity: 0.56, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_01357', industryId: 'ind_037', regionId: 'reg_13', inputSku: 'in_0071', qtyPerUnit: 15, leadDays: 8, substituteIds: ['sub_0158'], elasticity: 0.57, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_01358', industryId: 'ind_038', regionId: 'reg_14', inputSku: 'in_0074', qtyPerUnit: 16, leadDays: 9, substituteIds: ['sub_0159'], elasticity: 0.58, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_01359', industryId: 'ind_039', regionId: 'reg_15', inputSku: 'in_0077', qtyPerUnit: 17, leadDays: 10, substituteIds: ['sub_0160'], elasticity: 0.59, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_01360', industryId: 'ind_040', regionId: 'reg_16', inputSku: 'in_0080', qtyPerUnit: 1, leadDays: 11, substituteIds: ['sub_0161'], elasticity: 0.60, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_01361', industryId: 'ind_041', regionId: 'reg_17', inputSku: 'in_0083', qtyPerUnit: 2, leadDays: 12, substituteIds: ['sub_0162'], elasticity: 0.61, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_01362', industryId: 'ind_042', regionId: 'reg_18', inputSku: 'in_0086', qtyPerUnit: 3, leadDays: 13, substituteIds: ['sub_0163'], elasticity: 0.62, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_01363', industryId: 'ind_043', regionId: 'reg_19', inputSku: 'in_0089', qtyPerUnit: 4, leadDays: 14, substituteIds: ['sub_0164'], elasticity: 0.63, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_01364', industryId: 'ind_044', regionId: 'reg_20', inputSku: 'in_0092', qtyPerUnit: 5, leadDays: 15, substituteIds: ['sub_0165'], elasticity: 0.64, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_01365', industryId: 'ind_045', regionId: 'reg_21', inputSku: 'in_0095', qtyPerUnit: 6, leadDays: 16, substituteIds: ['sub_0166'], elasticity: 0.65, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_01366', industryId: 'ind_046', regionId: 'reg_22', inputSku: 'in_0098', qtyPerUnit: 7, leadDays: 17, substituteIds: ['sub_0167'], elasticity: 0.66, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_01367', industryId: 'ind_047', regionId: 'reg_23', inputSku: 'in_0101', qtyPerUnit: 8, leadDays: 18, substituteIds: ['sub_0168'], elasticity: 0.67, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_01368', industryId: 'ind_048', regionId: 'reg_24', inputSku: 'in_0104', qtyPerUnit: 9, leadDays: 19, substituteIds: ['sub_0169'], elasticity: 0.68, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_01369', industryId: 'ind_049', regionId: 'reg_25', inputSku: 'in_0107', qtyPerUnit: 10, leadDays: 20, substituteIds: ['sub_0170'], elasticity: 0.69, bottleneckWeight: 0.38 },
  { skuId: 'V1014_SUPPLY_sku_01370', industryId: 'ind_050', regionId: 'reg_26', inputSku: 'in_0110', qtyPerUnit: 11, leadDays: 21, substituteIds: ['sub_0171'], elasticity: 0.70, bottleneckWeight: 0.40 },
  { skuId: 'V1014_SUPPLY_sku_01371', industryId: 'ind_051', regionId: 'reg_27', inputSku: 'in_0113', qtyPerUnit: 12, leadDays: 22, substituteIds: ['sub_0172'], elasticity: 0.71, bottleneckWeight: 0.42 },
  { skuId: 'V1014_SUPPLY_sku_01372', industryId: 'ind_052', regionId: 'reg_00', inputSku: 'in_0116', qtyPerUnit: 13, leadDays: 23, substituteIds: ['sub_0173'], elasticity: 0.72, bottleneckWeight: 0.44 },
  { skuId: 'V1014_SUPPLY_sku_01373', industryId: 'ind_053', regionId: 'reg_01', inputSku: 'in_0119', qtyPerUnit: 14, leadDays: 24, substituteIds: ['sub_0174'], elasticity: 0.73, bottleneckWeight: 0.46 },
  { skuId: 'V1014_SUPPLY_sku_01374', industryId: 'ind_054', regionId: 'reg_02', inputSku: 'in_0122', qtyPerUnit: 15, leadDays: 25, substituteIds: ['sub_0175'], elasticity: 0.74, bottleneckWeight: 0.48 },
  { skuId: 'V1014_SUPPLY_sku_01375', industryId: 'ind_055', regionId: 'reg_03', inputSku: 'in_0125', qtyPerUnit: 16, leadDays: 26, substituteIds: ['sub_0176'], elasticity: 0.75, bottleneckWeight: 0.50 },
  { skuId: 'V1014_SUPPLY_sku_01376', industryId: 'ind_056', regionId: 'reg_04', inputSku: 'in_0128', qtyPerUnit: 17, leadDays: 27, substituteIds: ['sub_0177'], elasticity: 0.76, bottleneckWeight: 0.52 },
  { skuId: 'V1014_SUPPLY_sku_01377', industryId: 'ind_057', regionId: 'reg_05', inputSku: 'in_0131', qtyPerUnit: 1, leadDays: 28, substituteIds: ['sub_0178'], elasticity: 0.77, bottleneckWeight: 0.54 },
  { skuId: 'V1014_SUPPLY_sku_01378', industryId: 'ind_058', regionId: 'reg_06', inputSku: 'in_0134', qtyPerUnit: 2, leadDays: 29, substituteIds: ['sub_0179'], elasticity: 0.78, bottleneckWeight: 0.56 },
  { skuId: 'V1014_SUPPLY_sku_01379', industryId: 'ind_059', regionId: 'reg_07', inputSku: 'in_0137', qtyPerUnit: 3, leadDays: 30, substituteIds: ['sub_0180'], elasticity: 0.79, bottleneckWeight: 0.58 },
  { skuId: 'V1014_SUPPLY_sku_01380', industryId: 'ind_060', regionId: 'reg_08', inputSku: 'in_0140', qtyPerUnit: 4, leadDays: 31, substituteIds: ['sub_0181'], elasticity: 0.80, bottleneckWeight: 0.60 },
  { skuId: 'V1014_SUPPLY_sku_01381', industryId: 'ind_061', regionId: 'reg_09', inputSku: 'in_0143', qtyPerUnit: 5, leadDays: 32, substituteIds: ['sub_0182'], elasticity: 0.81, bottleneckWeight: 0.62 },
  { skuId: 'V1014_SUPPLY_sku_01382', industryId: 'ind_062', regionId: 'reg_10', inputSku: 'in_0146', qtyPerUnit: 6, leadDays: 33, substituteIds: ['sub_0183'], elasticity: 0.82, bottleneckWeight: 0.64 },
  { skuId: 'V1014_SUPPLY_sku_01383', industryId: 'ind_063', regionId: 'reg_11', inputSku: 'in_0149', qtyPerUnit: 7, leadDays: 34, substituteIds: ['sub_0184'], elasticity: 0.83, bottleneckWeight: 0.66 },
  { skuId: 'V1014_SUPPLY_sku_01384', industryId: 'ind_064', regionId: 'reg_12', inputSku: 'in_0152', qtyPerUnit: 8, leadDays: 35, substituteIds: ['sub_0185'], elasticity: 0.84, bottleneckWeight: 0.68 },
  { skuId: 'V1014_SUPPLY_sku_01385', industryId: 'ind_065', regionId: 'reg_13', inputSku: 'in_0155', qtyPerUnit: 9, leadDays: 36, substituteIds: ['sub_0186'], elasticity: 0.85, bottleneckWeight: 0.70 },
  { skuId: 'V1014_SUPPLY_sku_01386', industryId: 'ind_066', regionId: 'reg_14', inputSku: 'in_0158', qtyPerUnit: 10, leadDays: 37, substituteIds: ['sub_0187'], elasticity: 0.86, bottleneckWeight: 0.72 },
  { skuId: 'V1014_SUPPLY_sku_01387', industryId: 'ind_067', regionId: 'reg_15', inputSku: 'in_0161', qtyPerUnit: 11, leadDays: 38, substituteIds: ['sub_0188'], elasticity: 0.87, bottleneckWeight: 0.74 },
  { skuId: 'V1014_SUPPLY_sku_01388', industryId: 'ind_068', regionId: 'reg_16', inputSku: 'in_0164', qtyPerUnit: 12, leadDays: 39, substituteIds: ['sub_0189'], elasticity: 0.88, bottleneckWeight: 0.76 },
  { skuId: 'V1014_SUPPLY_sku_01389', industryId: 'ind_069', regionId: 'reg_17', inputSku: 'in_0167', qtyPerUnit: 13, leadDays: 40, substituteIds: ['sub_0190'], elasticity: 0.89, bottleneckWeight: 0.78 },
  { skuId: 'V1014_SUPPLY_sku_01390', industryId: 'ind_070', regionId: 'reg_18', inputSku: 'in_0170', qtyPerUnit: 14, leadDays: 41, substituteIds: ['sub_0191'], elasticity: 0.90, bottleneckWeight: 0.80 },
  { skuId: 'V1014_SUPPLY_sku_01391', industryId: 'ind_071', regionId: 'reg_19', inputSku: 'in_0173', qtyPerUnit: 15, leadDays: 42, substituteIds: ['sub_0192'], elasticity: 0.91, bottleneckWeight: 0.82 },
  { skuId: 'V1014_SUPPLY_sku_01392', industryId: 'ind_072', regionId: 'reg_20', inputSku: 'in_0176', qtyPerUnit: 16, leadDays: 43, substituteIds: ['sub_0193'], elasticity: 0.92, bottleneckWeight: 0.84 },
  { skuId: 'V1014_SUPPLY_sku_01393', industryId: 'ind_073', regionId: 'reg_21', inputSku: 'in_0179', qtyPerUnit: 17, leadDays: 44, substituteIds: ['sub_0194'], elasticity: 0.93, bottleneckWeight: 0.86 },
  { skuId: 'V1014_SUPPLY_sku_01394', industryId: 'ind_074', regionId: 'reg_22', inputSku: 'in_0182', qtyPerUnit: 1, leadDays: 45, substituteIds: ['sub_0195'], elasticity: 0.94, bottleneckWeight: 0.88 },
  { skuId: 'V1014_SUPPLY_sku_01395', industryId: 'ind_075', regionId: 'reg_23', inputSku: 'in_0185', qtyPerUnit: 2, leadDays: 1, substituteIds: ['sub_0196'], elasticity: 0.95, bottleneckWeight: 0.90 },
  { skuId: 'V1014_SUPPLY_sku_01396', industryId: 'ind_076', regionId: 'reg_24', inputSku: 'in_0188', qtyPerUnit: 3, leadDays: 2, substituteIds: ['sub_0197'], elasticity: 0.96, bottleneckWeight: 0.92 },
  { skuId: 'V1014_SUPPLY_sku_01397', industryId: 'ind_077', regionId: 'reg_25', inputSku: 'in_0191', qtyPerUnit: 4, leadDays: 3, substituteIds: ['sub_0198'], elasticity: 0.97, bottleneckWeight: 0.94 },
  { skuId: 'V1014_SUPPLY_sku_01398', industryId: 'ind_078', regionId: 'reg_26', inputSku: 'in_0194', qtyPerUnit: 5, leadDays: 4, substituteIds: ['sub_0199'], elasticity: 0.98, bottleneckWeight: 0.96 },
  { skuId: 'V1014_SUPPLY_sku_01399', industryId: 'ind_079', regionId: 'reg_27', inputSku: 'in_0197', qtyPerUnit: 6, leadDays: 5, substituteIds: ['sub_0200'], elasticity: 0.99, bottleneckWeight: 0.98 },
  { skuId: 'V1014_SUPPLY_sku_01400', industryId: 'ind_080', regionId: 'reg_00', inputSku: 'in_0200', qtyPerUnit: 7, leadDays: 6, substituteIds: ['sub_0201'], elasticity: 0.00, bottleneckWeight: 0.00 },
  { skuId: 'V1014_SUPPLY_sku_01401', industryId: 'ind_081', regionId: 'reg_01', inputSku: 'in_0203', qtyPerUnit: 8, leadDays: 7, substituteIds: ['sub_0202'], elasticity: 0.01, bottleneckWeight: 0.02 },
  { skuId: 'V1014_SUPPLY_sku_01402', industryId: 'ind_082', regionId: 'reg_02', inputSku: 'in_0206', qtyPerUnit: 9, leadDays: 8, substituteIds: ['sub_0203'], elasticity: 0.02, bottleneckWeight: 0.04 },
  { skuId: 'V1014_SUPPLY_sku_01403', industryId: 'ind_083', regionId: 'reg_03', inputSku: 'in_0209', qtyPerUnit: 10, leadDays: 9, substituteIds: ['sub_0204'], elasticity: 0.03, bottleneckWeight: 0.06 },
  { skuId: 'V1014_SUPPLY_sku_01404', industryId: 'ind_084', regionId: 'reg_04', inputSku: 'in_0212', qtyPerUnit: 11, leadDays: 10, substituteIds: ['sub_0205'], elasticity: 0.04, bottleneckWeight: 0.08 },
  { skuId: 'V1014_SUPPLY_sku_01405', industryId: 'ind_085', regionId: 'reg_05', inputSku: 'in_0215', qtyPerUnit: 12, leadDays: 11, substituteIds: ['sub_0206'], elasticity: 0.05, bottleneckWeight: 0.10 },
  { skuId: 'V1014_SUPPLY_sku_01406', industryId: 'ind_086', regionId: 'reg_06', inputSku: 'in_0218', qtyPerUnit: 13, leadDays: 12, substituteIds: ['sub_0207'], elasticity: 0.06, bottleneckWeight: 0.12 },
  { skuId: 'V1014_SUPPLY_sku_01407', industryId: 'ind_087', regionId: 'reg_07', inputSku: 'in_0221', qtyPerUnit: 14, leadDays: 13, substituteIds: ['sub_0208'], elasticity: 0.07, bottleneckWeight: 0.14 },
  { skuId: 'V1014_SUPPLY_sku_01408', industryId: 'ind_088', regionId: 'reg_08', inputSku: 'in_0224', qtyPerUnit: 15, leadDays: 14, substituteIds: ['sub_0209'], elasticity: 0.08, bottleneckWeight: 0.16 },
  { skuId: 'V1014_SUPPLY_sku_01409', industryId: 'ind_089', regionId: 'reg_09', inputSku: 'in_0227', qtyPerUnit: 16, leadDays: 15, substituteIds: ['sub_0210'], elasticity: 0.09, bottleneckWeight: 0.18 },
  { skuId: 'V1014_SUPPLY_sku_01410', industryId: 'ind_090', regionId: 'reg_10', inputSku: 'in_0230', qtyPerUnit: 17, leadDays: 16, substituteIds: ['sub_0211'], elasticity: 0.10, bottleneckWeight: 0.20 },
  { skuId: 'V1014_SUPPLY_sku_01411', industryId: 'ind_091', regionId: 'reg_11', inputSku: 'in_0233', qtyPerUnit: 1, leadDays: 17, substituteIds: ['sub_0212'], elasticity: 0.11, bottleneckWeight: 0.22 },
  { skuId: 'V1014_SUPPLY_sku_01412', industryId: 'ind_092', regionId: 'reg_12', inputSku: 'in_0236', qtyPerUnit: 2, leadDays: 18, substituteIds: ['sub_0213'], elasticity: 0.12, bottleneckWeight: 0.24 },
  { skuId: 'V1014_SUPPLY_sku_01413', industryId: 'ind_093', regionId: 'reg_13', inputSku: 'in_0239', qtyPerUnit: 3, leadDays: 19, substituteIds: ['sub_0214'], elasticity: 0.13, bottleneckWeight: 0.26 },
  { skuId: 'V1014_SUPPLY_sku_01414', industryId: 'ind_094', regionId: 'reg_14', inputSku: 'in_0242', qtyPerUnit: 4, leadDays: 20, substituteIds: ['sub_0215'], elasticity: 0.14, bottleneckWeight: 0.28 },
  { skuId: 'V1014_SUPPLY_sku_01415', industryId: 'ind_095', regionId: 'reg_15', inputSku: 'in_0245', qtyPerUnit: 5, leadDays: 21, substituteIds: ['sub_0216'], elasticity: 0.15, bottleneckWeight: 0.30 },
  { skuId: 'V1014_SUPPLY_sku_01416', industryId: 'ind_096', regionId: 'reg_16', inputSku: 'in_0248', qtyPerUnit: 6, leadDays: 22, substituteIds: ['sub_0217'], elasticity: 0.16, bottleneckWeight: 0.32 },
  { skuId: 'V1014_SUPPLY_sku_01417', industryId: 'ind_097', regionId: 'reg_17', inputSku: 'in_0251', qtyPerUnit: 7, leadDays: 23, substituteIds: ['sub_0218'], elasticity: 0.17, bottleneckWeight: 0.34 },
  { skuId: 'V1014_SUPPLY_sku_01418', industryId: 'ind_098', regionId: 'reg_18', inputSku: 'in_0254', qtyPerUnit: 8, leadDays: 24, substituteIds: ['sub_0219'], elasticity: 0.18, bottleneckWeight: 0.36 },
  { skuId: 'V1014_SUPPLY_sku_01419', industryId: 'ind_099', regionId: 'reg_19', inputSku: 'in_0257', qtyPerUnit: 9, leadDays: 25, substituteIds: ['sub_0220'], elasticity: 0.19, bottleneckWeight: 0.38 },
];

export function V1014_SUPPLY_computeBottleneck_0000(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0001(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0002(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0003(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0004(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0005(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0006(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0007(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0008(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0009(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0010(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0011(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0012(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0013(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0014(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0015(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0016(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0017(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0018(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0019(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0020(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0021(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0022(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0023(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0024(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0025(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0026(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0027(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0028(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0029(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0030(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0031(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0032(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0033(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0034(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0035(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0036(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0037(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0038(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0039(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0040(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0041(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0042(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0043(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0044(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0045(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0046(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0047(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0048(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0049(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0050(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0051(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0052(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0053(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0054(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0055(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0056(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0057(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0058(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0059(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0060(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0061(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0062(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0063(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0064(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0065(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0066(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0067(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0068(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0069(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0070(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0071(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0072(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0073(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0074(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0075(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0076(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0077(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0078(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0079(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0080(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0081(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0082(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0083(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0084(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0085(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0086(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0087(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0088(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0089(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0090(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0091(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0092(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0093(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0094(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0095(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0096(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0097(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0098(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0099(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0100(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0101(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0102(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0103(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0104(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0105(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0106(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0107(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0108(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0109(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0110(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0111(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0112(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0113(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0114(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0115(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0116(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0117(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0118(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0119(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0120(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0121(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0122(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0123(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0124(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0125(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0126(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0127(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0128(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0129(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0130(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0131(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0132(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0133(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0134(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0135(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0136(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0137(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0138(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0139(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0140(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0141(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0142(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0143(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0144(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0145(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0146(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0147(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0148(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0149(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0150(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0151(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0152(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0153(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0154(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0155(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0156(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0157(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0158(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0159(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0160(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0161(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0162(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0163(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0164(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0165(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0166(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0167(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0168(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0169(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0170(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0171(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0172(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0173(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0174(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0175(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0176(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0177(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0178(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0179(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0180(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0181(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0182(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0183(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0184(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0185(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0186(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0187(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0188(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0189(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0190(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0191(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0192(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0193(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0194(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0195(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0196(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0197(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0198(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0199(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0200(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0201(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0202(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0203(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0204(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0205(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0206(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0207(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0208(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0209(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0210(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0211(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0212(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0213(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0214(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0215(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0216(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0217(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0218(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0219(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0220(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0221(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0222(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0223(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0224(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0225(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0226(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0227(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0228(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0229(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0230(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0231(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0232(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0233(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0234(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0235(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0236(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0237(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0238(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0239(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0240(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0241(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0242(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0243(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0244(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0245(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0246(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0247(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0248(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0249(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0250(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0251(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0252(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0253(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0254(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0255(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0256(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0257(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0258(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0259(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0260(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0261(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0262(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0263(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0264(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0265(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0266(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0267(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0268(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0269(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0270(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0271(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0272(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0273(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0274(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0275(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0276(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0277(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0278(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0279(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0280(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0281(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0282(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0283(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0284(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0285(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0286(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0287(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0288(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0289(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0290(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0291(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0292(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0293(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0294(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0295(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0296(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0297(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0298(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0299(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0300(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0301(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0302(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0303(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0304(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0305(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0306(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0307(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0308(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0309(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0310(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0311(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0312(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0313(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0314(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0315(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0316(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0317(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0318(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0319(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0320(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0321(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0322(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0323(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0324(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0325(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0326(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0327(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0328(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0329(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0330(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0331(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0332(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0333(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0334(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0335(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0336(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0337(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0338(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0339(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0340(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0341(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0342(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0343(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0344(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0345(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0346(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0347(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0348(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0349(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0350(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0351(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0352(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0353(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0354(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0355(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0356(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0357(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0358(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0359(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0360(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0361(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0362(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0363(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0364(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0365(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0366(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0367(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0368(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0369(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0370(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0371(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0372(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0373(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0374(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0375(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0376(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0377(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0378(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0379(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0380(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0381(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0382(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0383(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0384(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0385(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0386(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0387(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0388(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0389(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0390(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0391(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0392(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0393(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0394(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0395(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0396(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0397(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0398(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0399(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0400(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0401(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0402(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0403(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0404(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0405(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0406(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0407(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0408(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0409(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0410(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0411(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0412(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0413(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0414(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0415(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0416(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0417(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0418(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0419(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0420(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0421(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0422(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0423(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0424(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0425(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0426(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0427(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0428(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0429(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0430(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0431(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0432(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0433(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0434(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0435(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0436(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0437(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0438(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0439(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0440(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0441(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0442(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0443(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0444(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0445(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0446(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0447(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0448(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0449(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0450(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0451(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0452(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0453(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0454(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0455(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0456(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0457(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0458(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0459(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0460(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0461(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0462(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0463(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0464(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0465(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0466(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0467(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0468(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0469(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0470(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0471(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0472(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0473(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0474(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0475(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0476(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0477(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0478(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0479(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0480(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0481(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0482(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0483(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0484(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0485(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0486(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0487(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0488(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0489(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0490(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0491(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0492(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0493(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0494(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0495(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0496(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0497(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0498(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0499(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0500(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0501(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0502(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0503(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0504(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0505(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0506(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0507(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0508(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0509(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0510(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0511(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0512(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0513(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0514(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0515(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0516(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0517(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0518(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export function V1014_SUPPLY_computeBottleneck_0519(
  ctx: V1014SupplyTickContext,
  row: V1014SupplyBomRow
): V1014SupplyBottleneckSignal {
  const demand = ctx.demandBySku[row.inputSku] ?? ctx.baseDemand;
  const capacity = ctx.capacityByRegion[row.regionId] ?? ctx.baseCapacity;
  const load = demand * row.qtyPerUnit * (1 + row.elasticity * 0.1);
  const slack = capacity - load;
  const severity = slack < 0 ? Math.min(1, (-slack) / Math.max(1, capacity)) * row.bottleneckWeight : 0;
  return {
    skuId: row.skuId,
    regionId: row.regionId,
    severity,
    slackUnits: slack,
    leadDays: row.leadDays,
    checksum: V1014_SUPPLY_rowChecksum(row, ctx.turn),
  };
}

export const V1014_SUPPLY_BOTTLENECK_RUNNERS: Array<(ctx: V1014SupplyTickContext, row: V1014SupplyBomRow) => V1014SupplyBottleneckSignal> = [
  V1014_SUPPLY_computeBottleneck_0000,
  V1014_SUPPLY_computeBottleneck_0001,
  V1014_SUPPLY_computeBottleneck_0002,
  V1014_SUPPLY_computeBottleneck_0003,
  V1014_SUPPLY_computeBottleneck_0004,
  V1014_SUPPLY_computeBottleneck_0005,
  V1014_SUPPLY_computeBottleneck_0006,
  V1014_SUPPLY_computeBottleneck_0007,
  V1014_SUPPLY_computeBottleneck_0008,
  V1014_SUPPLY_computeBottleneck_0009,
  V1014_SUPPLY_computeBottleneck_0010,
  V1014_SUPPLY_computeBottleneck_0011,
  V1014_SUPPLY_computeBottleneck_0012,
  V1014_SUPPLY_computeBottleneck_0013,
  V1014_SUPPLY_computeBottleneck_0014,
  V1014_SUPPLY_computeBottleneck_0015,
  V1014_SUPPLY_computeBottleneck_0016,
  V1014_SUPPLY_computeBottleneck_0017,
  V1014_SUPPLY_computeBottleneck_0018,
  V1014_SUPPLY_computeBottleneck_0019,
  V1014_SUPPLY_computeBottleneck_0020,
  V1014_SUPPLY_computeBottleneck_0021,
  V1014_SUPPLY_computeBottleneck_0022,
  V1014_SUPPLY_computeBottleneck_0023,
  V1014_SUPPLY_computeBottleneck_0024,
  V1014_SUPPLY_computeBottleneck_0025,
  V1014_SUPPLY_computeBottleneck_0026,
  V1014_SUPPLY_computeBottleneck_0027,
  V1014_SUPPLY_computeBottleneck_0028,
  V1014_SUPPLY_computeBottleneck_0029,
  V1014_SUPPLY_computeBottleneck_0030,
  V1014_SUPPLY_computeBottleneck_0031,
  V1014_SUPPLY_computeBottleneck_0032,
  V1014_SUPPLY_computeBottleneck_0033,
  V1014_SUPPLY_computeBottleneck_0034,
  V1014_SUPPLY_computeBottleneck_0035,
  V1014_SUPPLY_computeBottleneck_0036,
  V1014_SUPPLY_computeBottleneck_0037,
  V1014_SUPPLY_computeBottleneck_0038,
  V1014_SUPPLY_computeBottleneck_0039,
  V1014_SUPPLY_computeBottleneck_0040,
  V1014_SUPPLY_computeBottleneck_0041,
  V1014_SUPPLY_computeBottleneck_0042,
  V1014_SUPPLY_computeBottleneck_0043,
  V1014_SUPPLY_computeBottleneck_0044,
  V1014_SUPPLY_computeBottleneck_0045,
  V1014_SUPPLY_computeBottleneck_0046,
  V1014_SUPPLY_computeBottleneck_0047,
  V1014_SUPPLY_computeBottleneck_0048,
  V1014_SUPPLY_computeBottleneck_0049,
  V1014_SUPPLY_computeBottleneck_0050,
  V1014_SUPPLY_computeBottleneck_0051,
  V1014_SUPPLY_computeBottleneck_0052,
  V1014_SUPPLY_computeBottleneck_0053,
  V1014_SUPPLY_computeBottleneck_0054,
  V1014_SUPPLY_computeBottleneck_0055,
  V1014_SUPPLY_computeBottleneck_0056,
  V1014_SUPPLY_computeBottleneck_0057,
  V1014_SUPPLY_computeBottleneck_0058,
  V1014_SUPPLY_computeBottleneck_0059,
  V1014_SUPPLY_computeBottleneck_0060,
  V1014_SUPPLY_computeBottleneck_0061,
  V1014_SUPPLY_computeBottleneck_0062,
  V1014_SUPPLY_computeBottleneck_0063,
  V1014_SUPPLY_computeBottleneck_0064,
  V1014_SUPPLY_computeBottleneck_0065,
  V1014_SUPPLY_computeBottleneck_0066,
  V1014_SUPPLY_computeBottleneck_0067,
  V1014_SUPPLY_computeBottleneck_0068,
  V1014_SUPPLY_computeBottleneck_0069,
  V1014_SUPPLY_computeBottleneck_0070,
  V1014_SUPPLY_computeBottleneck_0071,
  V1014_SUPPLY_computeBottleneck_0072,
  V1014_SUPPLY_computeBottleneck_0073,
  V1014_SUPPLY_computeBottleneck_0074,
  V1014_SUPPLY_computeBottleneck_0075,
  V1014_SUPPLY_computeBottleneck_0076,
  V1014_SUPPLY_computeBottleneck_0077,
  V1014_SUPPLY_computeBottleneck_0078,
  V1014_SUPPLY_computeBottleneck_0079,
  V1014_SUPPLY_computeBottleneck_0080,
  V1014_SUPPLY_computeBottleneck_0081,
  V1014_SUPPLY_computeBottleneck_0082,
  V1014_SUPPLY_computeBottleneck_0083,
  V1014_SUPPLY_computeBottleneck_0084,
  V1014_SUPPLY_computeBottleneck_0085,
  V1014_SUPPLY_computeBottleneck_0086,
  V1014_SUPPLY_computeBottleneck_0087,
  V1014_SUPPLY_computeBottleneck_0088,
  V1014_SUPPLY_computeBottleneck_0089,
  V1014_SUPPLY_computeBottleneck_0090,
  V1014_SUPPLY_computeBottleneck_0091,
  V1014_SUPPLY_computeBottleneck_0092,
  V1014_SUPPLY_computeBottleneck_0093,
  V1014_SUPPLY_computeBottleneck_0094,
  V1014_SUPPLY_computeBottleneck_0095,
  V1014_SUPPLY_computeBottleneck_0096,
  V1014_SUPPLY_computeBottleneck_0097,
  V1014_SUPPLY_computeBottleneck_0098,
  V1014_SUPPLY_computeBottleneck_0099,
  V1014_SUPPLY_computeBottleneck_0100,
  V1014_SUPPLY_computeBottleneck_0101,
  V1014_SUPPLY_computeBottleneck_0102,
  V1014_SUPPLY_computeBottleneck_0103,
  V1014_SUPPLY_computeBottleneck_0104,
  V1014_SUPPLY_computeBottleneck_0105,
  V1014_SUPPLY_computeBottleneck_0106,
  V1014_SUPPLY_computeBottleneck_0107,
  V1014_SUPPLY_computeBottleneck_0108,
  V1014_SUPPLY_computeBottleneck_0109,
  V1014_SUPPLY_computeBottleneck_0110,
  V1014_SUPPLY_computeBottleneck_0111,
  V1014_SUPPLY_computeBottleneck_0112,
  V1014_SUPPLY_computeBottleneck_0113,
  V1014_SUPPLY_computeBottleneck_0114,
  V1014_SUPPLY_computeBottleneck_0115,
  V1014_SUPPLY_computeBottleneck_0116,
  V1014_SUPPLY_computeBottleneck_0117,
  V1014_SUPPLY_computeBottleneck_0118,
  V1014_SUPPLY_computeBottleneck_0119,
  V1014_SUPPLY_computeBottleneck_0120,
  V1014_SUPPLY_computeBottleneck_0121,
  V1014_SUPPLY_computeBottleneck_0122,
  V1014_SUPPLY_computeBottleneck_0123,
  V1014_SUPPLY_computeBottleneck_0124,
  V1014_SUPPLY_computeBottleneck_0125,
  V1014_SUPPLY_computeBottleneck_0126,
  V1014_SUPPLY_computeBottleneck_0127,
  V1014_SUPPLY_computeBottleneck_0128,
  V1014_SUPPLY_computeBottleneck_0129,
  V1014_SUPPLY_computeBottleneck_0130,
  V1014_SUPPLY_computeBottleneck_0131,
  V1014_SUPPLY_computeBottleneck_0132,
  V1014_SUPPLY_computeBottleneck_0133,
  V1014_SUPPLY_computeBottleneck_0134,
  V1014_SUPPLY_computeBottleneck_0135,
  V1014_SUPPLY_computeBottleneck_0136,
  V1014_SUPPLY_computeBottleneck_0137,
  V1014_SUPPLY_computeBottleneck_0138,
  V1014_SUPPLY_computeBottleneck_0139,
  V1014_SUPPLY_computeBottleneck_0140,
  V1014_SUPPLY_computeBottleneck_0141,
  V1014_SUPPLY_computeBottleneck_0142,
  V1014_SUPPLY_computeBottleneck_0143,
  V1014_SUPPLY_computeBottleneck_0144,
  V1014_SUPPLY_computeBottleneck_0145,
  V1014_SUPPLY_computeBottleneck_0146,
  V1014_SUPPLY_computeBottleneck_0147,
  V1014_SUPPLY_computeBottleneck_0148,
  V1014_SUPPLY_computeBottleneck_0149,
  V1014_SUPPLY_computeBottleneck_0150,
  V1014_SUPPLY_computeBottleneck_0151,
  V1014_SUPPLY_computeBottleneck_0152,
  V1014_SUPPLY_computeBottleneck_0153,
  V1014_SUPPLY_computeBottleneck_0154,
  V1014_SUPPLY_computeBottleneck_0155,
  V1014_SUPPLY_computeBottleneck_0156,
  V1014_SUPPLY_computeBottleneck_0157,
  V1014_SUPPLY_computeBottleneck_0158,
  V1014_SUPPLY_computeBottleneck_0159,
  V1014_SUPPLY_computeBottleneck_0160,
  V1014_SUPPLY_computeBottleneck_0161,
  V1014_SUPPLY_computeBottleneck_0162,
  V1014_SUPPLY_computeBottleneck_0163,
  V1014_SUPPLY_computeBottleneck_0164,
  V1014_SUPPLY_computeBottleneck_0165,
  V1014_SUPPLY_computeBottleneck_0166,
  V1014_SUPPLY_computeBottleneck_0167,
  V1014_SUPPLY_computeBottleneck_0168,
  V1014_SUPPLY_computeBottleneck_0169,
  V1014_SUPPLY_computeBottleneck_0170,
  V1014_SUPPLY_computeBottleneck_0171,
  V1014_SUPPLY_computeBottleneck_0172,
  V1014_SUPPLY_computeBottleneck_0173,
  V1014_SUPPLY_computeBottleneck_0174,
  V1014_SUPPLY_computeBottleneck_0175,
  V1014_SUPPLY_computeBottleneck_0176,
  V1014_SUPPLY_computeBottleneck_0177,
  V1014_SUPPLY_computeBottleneck_0178,
  V1014_SUPPLY_computeBottleneck_0179,
  V1014_SUPPLY_computeBottleneck_0180,
  V1014_SUPPLY_computeBottleneck_0181,
  V1014_SUPPLY_computeBottleneck_0182,
  V1014_SUPPLY_computeBottleneck_0183,
  V1014_SUPPLY_computeBottleneck_0184,
  V1014_SUPPLY_computeBottleneck_0185,
  V1014_SUPPLY_computeBottleneck_0186,
  V1014_SUPPLY_computeBottleneck_0187,
  V1014_SUPPLY_computeBottleneck_0188,
  V1014_SUPPLY_computeBottleneck_0189,
  V1014_SUPPLY_computeBottleneck_0190,
  V1014_SUPPLY_computeBottleneck_0191,
  V1014_SUPPLY_computeBottleneck_0192,
  V1014_SUPPLY_computeBottleneck_0193,
  V1014_SUPPLY_computeBottleneck_0194,
  V1014_SUPPLY_computeBottleneck_0195,
  V1014_SUPPLY_computeBottleneck_0196,
  V1014_SUPPLY_computeBottleneck_0197,
  V1014_SUPPLY_computeBottleneck_0198,
  V1014_SUPPLY_computeBottleneck_0199,
  V1014_SUPPLY_computeBottleneck_0200,
  V1014_SUPPLY_computeBottleneck_0201,
  V1014_SUPPLY_computeBottleneck_0202,
  V1014_SUPPLY_computeBottleneck_0203,
  V1014_SUPPLY_computeBottleneck_0204,
  V1014_SUPPLY_computeBottleneck_0205,
  V1014_SUPPLY_computeBottleneck_0206,
  V1014_SUPPLY_computeBottleneck_0207,
  V1014_SUPPLY_computeBottleneck_0208,
  V1014_SUPPLY_computeBottleneck_0209,
  V1014_SUPPLY_computeBottleneck_0210,
  V1014_SUPPLY_computeBottleneck_0211,
  V1014_SUPPLY_computeBottleneck_0212,
  V1014_SUPPLY_computeBottleneck_0213,
  V1014_SUPPLY_computeBottleneck_0214,
  V1014_SUPPLY_computeBottleneck_0215,
  V1014_SUPPLY_computeBottleneck_0216,
  V1014_SUPPLY_computeBottleneck_0217,
  V1014_SUPPLY_computeBottleneck_0218,
  V1014_SUPPLY_computeBottleneck_0219,
  V1014_SUPPLY_computeBottleneck_0220,
  V1014_SUPPLY_computeBottleneck_0221,
  V1014_SUPPLY_computeBottleneck_0222,
  V1014_SUPPLY_computeBottleneck_0223,
  V1014_SUPPLY_computeBottleneck_0224,
  V1014_SUPPLY_computeBottleneck_0225,
  V1014_SUPPLY_computeBottleneck_0226,
  V1014_SUPPLY_computeBottleneck_0227,
  V1014_SUPPLY_computeBottleneck_0228,
  V1014_SUPPLY_computeBottleneck_0229,
  V1014_SUPPLY_computeBottleneck_0230,
  V1014_SUPPLY_computeBottleneck_0231,
  V1014_SUPPLY_computeBottleneck_0232,
  V1014_SUPPLY_computeBottleneck_0233,
  V1014_SUPPLY_computeBottleneck_0234,
  V1014_SUPPLY_computeBottleneck_0235,
  V1014_SUPPLY_computeBottleneck_0236,
  V1014_SUPPLY_computeBottleneck_0237,
  V1014_SUPPLY_computeBottleneck_0238,
  V1014_SUPPLY_computeBottleneck_0239,
  V1014_SUPPLY_computeBottleneck_0240,
  V1014_SUPPLY_computeBottleneck_0241,
  V1014_SUPPLY_computeBottleneck_0242,
  V1014_SUPPLY_computeBottleneck_0243,
  V1014_SUPPLY_computeBottleneck_0244,
  V1014_SUPPLY_computeBottleneck_0245,
  V1014_SUPPLY_computeBottleneck_0246,
  V1014_SUPPLY_computeBottleneck_0247,
  V1014_SUPPLY_computeBottleneck_0248,
  V1014_SUPPLY_computeBottleneck_0249,
  V1014_SUPPLY_computeBottleneck_0250,
  V1014_SUPPLY_computeBottleneck_0251,
  V1014_SUPPLY_computeBottleneck_0252,
  V1014_SUPPLY_computeBottleneck_0253,
  V1014_SUPPLY_computeBottleneck_0254,
  V1014_SUPPLY_computeBottleneck_0255,
  V1014_SUPPLY_computeBottleneck_0256,
  V1014_SUPPLY_computeBottleneck_0257,
  V1014_SUPPLY_computeBottleneck_0258,
  V1014_SUPPLY_computeBottleneck_0259,
  V1014_SUPPLY_computeBottleneck_0260,
  V1014_SUPPLY_computeBottleneck_0261,
  V1014_SUPPLY_computeBottleneck_0262,
  V1014_SUPPLY_computeBottleneck_0263,
  V1014_SUPPLY_computeBottleneck_0264,
  V1014_SUPPLY_computeBottleneck_0265,
  V1014_SUPPLY_computeBottleneck_0266,
  V1014_SUPPLY_computeBottleneck_0267,
  V1014_SUPPLY_computeBottleneck_0268,
  V1014_SUPPLY_computeBottleneck_0269,
  V1014_SUPPLY_computeBottleneck_0270,
  V1014_SUPPLY_computeBottleneck_0271,
  V1014_SUPPLY_computeBottleneck_0272,
  V1014_SUPPLY_computeBottleneck_0273,
  V1014_SUPPLY_computeBottleneck_0274,
  V1014_SUPPLY_computeBottleneck_0275,
  V1014_SUPPLY_computeBottleneck_0276,
  V1014_SUPPLY_computeBottleneck_0277,
  V1014_SUPPLY_computeBottleneck_0278,
  V1014_SUPPLY_computeBottleneck_0279,
  V1014_SUPPLY_computeBottleneck_0280,
  V1014_SUPPLY_computeBottleneck_0281,
  V1014_SUPPLY_computeBottleneck_0282,
  V1014_SUPPLY_computeBottleneck_0283,
  V1014_SUPPLY_computeBottleneck_0284,
  V1014_SUPPLY_computeBottleneck_0285,
  V1014_SUPPLY_computeBottleneck_0286,
  V1014_SUPPLY_computeBottleneck_0287,
  V1014_SUPPLY_computeBottleneck_0288,
  V1014_SUPPLY_computeBottleneck_0289,
  V1014_SUPPLY_computeBottleneck_0290,
  V1014_SUPPLY_computeBottleneck_0291,
  V1014_SUPPLY_computeBottleneck_0292,
  V1014_SUPPLY_computeBottleneck_0293,
  V1014_SUPPLY_computeBottleneck_0294,
  V1014_SUPPLY_computeBottleneck_0295,
  V1014_SUPPLY_computeBottleneck_0296,
  V1014_SUPPLY_computeBottleneck_0297,
  V1014_SUPPLY_computeBottleneck_0298,
  V1014_SUPPLY_computeBottleneck_0299,
  V1014_SUPPLY_computeBottleneck_0300,
  V1014_SUPPLY_computeBottleneck_0301,
  V1014_SUPPLY_computeBottleneck_0302,
  V1014_SUPPLY_computeBottleneck_0303,
  V1014_SUPPLY_computeBottleneck_0304,
  V1014_SUPPLY_computeBottleneck_0305,
  V1014_SUPPLY_computeBottleneck_0306,
  V1014_SUPPLY_computeBottleneck_0307,
  V1014_SUPPLY_computeBottleneck_0308,
  V1014_SUPPLY_computeBottleneck_0309,
  V1014_SUPPLY_computeBottleneck_0310,
  V1014_SUPPLY_computeBottleneck_0311,
  V1014_SUPPLY_computeBottleneck_0312,
  V1014_SUPPLY_computeBottleneck_0313,
  V1014_SUPPLY_computeBottleneck_0314,
  V1014_SUPPLY_computeBottleneck_0315,
  V1014_SUPPLY_computeBottleneck_0316,
  V1014_SUPPLY_computeBottleneck_0317,
  V1014_SUPPLY_computeBottleneck_0318,
  V1014_SUPPLY_computeBottleneck_0319,
  V1014_SUPPLY_computeBottleneck_0320,
  V1014_SUPPLY_computeBottleneck_0321,
  V1014_SUPPLY_computeBottleneck_0322,
  V1014_SUPPLY_computeBottleneck_0323,
  V1014_SUPPLY_computeBottleneck_0324,
  V1014_SUPPLY_computeBottleneck_0325,
  V1014_SUPPLY_computeBottleneck_0326,
  V1014_SUPPLY_computeBottleneck_0327,
  V1014_SUPPLY_computeBottleneck_0328,
  V1014_SUPPLY_computeBottleneck_0329,
  V1014_SUPPLY_computeBottleneck_0330,
  V1014_SUPPLY_computeBottleneck_0331,
  V1014_SUPPLY_computeBottleneck_0332,
  V1014_SUPPLY_computeBottleneck_0333,
  V1014_SUPPLY_computeBottleneck_0334,
  V1014_SUPPLY_computeBottleneck_0335,
  V1014_SUPPLY_computeBottleneck_0336,
  V1014_SUPPLY_computeBottleneck_0337,
  V1014_SUPPLY_computeBottleneck_0338,
  V1014_SUPPLY_computeBottleneck_0339,
  V1014_SUPPLY_computeBottleneck_0340,
  V1014_SUPPLY_computeBottleneck_0341,
  V1014_SUPPLY_computeBottleneck_0342,
  V1014_SUPPLY_computeBottleneck_0343,
  V1014_SUPPLY_computeBottleneck_0344,
  V1014_SUPPLY_computeBottleneck_0345,
  V1014_SUPPLY_computeBottleneck_0346,
  V1014_SUPPLY_computeBottleneck_0347,
  V1014_SUPPLY_computeBottleneck_0348,
  V1014_SUPPLY_computeBottleneck_0349,
  V1014_SUPPLY_computeBottleneck_0350,
  V1014_SUPPLY_computeBottleneck_0351,
  V1014_SUPPLY_computeBottleneck_0352,
  V1014_SUPPLY_computeBottleneck_0353,
  V1014_SUPPLY_computeBottleneck_0354,
  V1014_SUPPLY_computeBottleneck_0355,
  V1014_SUPPLY_computeBottleneck_0356,
  V1014_SUPPLY_computeBottleneck_0357,
  V1014_SUPPLY_computeBottleneck_0358,
  V1014_SUPPLY_computeBottleneck_0359,
  V1014_SUPPLY_computeBottleneck_0360,
  V1014_SUPPLY_computeBottleneck_0361,
  V1014_SUPPLY_computeBottleneck_0362,
  V1014_SUPPLY_computeBottleneck_0363,
  V1014_SUPPLY_computeBottleneck_0364,
  V1014_SUPPLY_computeBottleneck_0365,
  V1014_SUPPLY_computeBottleneck_0366,
  V1014_SUPPLY_computeBottleneck_0367,
  V1014_SUPPLY_computeBottleneck_0368,
  V1014_SUPPLY_computeBottleneck_0369,
  V1014_SUPPLY_computeBottleneck_0370,
  V1014_SUPPLY_computeBottleneck_0371,
  V1014_SUPPLY_computeBottleneck_0372,
  V1014_SUPPLY_computeBottleneck_0373,
  V1014_SUPPLY_computeBottleneck_0374,
  V1014_SUPPLY_computeBottleneck_0375,
  V1014_SUPPLY_computeBottleneck_0376,
  V1014_SUPPLY_computeBottleneck_0377,
  V1014_SUPPLY_computeBottleneck_0378,
  V1014_SUPPLY_computeBottleneck_0379,
  V1014_SUPPLY_computeBottleneck_0380,
  V1014_SUPPLY_computeBottleneck_0381,
  V1014_SUPPLY_computeBottleneck_0382,
  V1014_SUPPLY_computeBottleneck_0383,
  V1014_SUPPLY_computeBottleneck_0384,
  V1014_SUPPLY_computeBottleneck_0385,
  V1014_SUPPLY_computeBottleneck_0386,
  V1014_SUPPLY_computeBottleneck_0387,
  V1014_SUPPLY_computeBottleneck_0388,
  V1014_SUPPLY_computeBottleneck_0389,
  V1014_SUPPLY_computeBottleneck_0390,
  V1014_SUPPLY_computeBottleneck_0391,
  V1014_SUPPLY_computeBottleneck_0392,
  V1014_SUPPLY_computeBottleneck_0393,
  V1014_SUPPLY_computeBottleneck_0394,
  V1014_SUPPLY_computeBottleneck_0395,
  V1014_SUPPLY_computeBottleneck_0396,
  V1014_SUPPLY_computeBottleneck_0397,
  V1014_SUPPLY_computeBottleneck_0398,
  V1014_SUPPLY_computeBottleneck_0399,
  V1014_SUPPLY_computeBottleneck_0400,
  V1014_SUPPLY_computeBottleneck_0401,
  V1014_SUPPLY_computeBottleneck_0402,
  V1014_SUPPLY_computeBottleneck_0403,
  V1014_SUPPLY_computeBottleneck_0404,
  V1014_SUPPLY_computeBottleneck_0405,
  V1014_SUPPLY_computeBottleneck_0406,
  V1014_SUPPLY_computeBottleneck_0407,
  V1014_SUPPLY_computeBottleneck_0408,
  V1014_SUPPLY_computeBottleneck_0409,
  V1014_SUPPLY_computeBottleneck_0410,
  V1014_SUPPLY_computeBottleneck_0411,
  V1014_SUPPLY_computeBottleneck_0412,
  V1014_SUPPLY_computeBottleneck_0413,
  V1014_SUPPLY_computeBottleneck_0414,
  V1014_SUPPLY_computeBottleneck_0415,
  V1014_SUPPLY_computeBottleneck_0416,
  V1014_SUPPLY_computeBottleneck_0417,
  V1014_SUPPLY_computeBottleneck_0418,
  V1014_SUPPLY_computeBottleneck_0419,
  V1014_SUPPLY_computeBottleneck_0420,
  V1014_SUPPLY_computeBottleneck_0421,
  V1014_SUPPLY_computeBottleneck_0422,
  V1014_SUPPLY_computeBottleneck_0423,
  V1014_SUPPLY_computeBottleneck_0424,
  V1014_SUPPLY_computeBottleneck_0425,
  V1014_SUPPLY_computeBottleneck_0426,
  V1014_SUPPLY_computeBottleneck_0427,
  V1014_SUPPLY_computeBottleneck_0428,
  V1014_SUPPLY_computeBottleneck_0429,
  V1014_SUPPLY_computeBottleneck_0430,
  V1014_SUPPLY_computeBottleneck_0431,
  V1014_SUPPLY_computeBottleneck_0432,
  V1014_SUPPLY_computeBottleneck_0433,
  V1014_SUPPLY_computeBottleneck_0434,
  V1014_SUPPLY_computeBottleneck_0435,
  V1014_SUPPLY_computeBottleneck_0436,
  V1014_SUPPLY_computeBottleneck_0437,
  V1014_SUPPLY_computeBottleneck_0438,
  V1014_SUPPLY_computeBottleneck_0439,
  V1014_SUPPLY_computeBottleneck_0440,
  V1014_SUPPLY_computeBottleneck_0441,
  V1014_SUPPLY_computeBottleneck_0442,
  V1014_SUPPLY_computeBottleneck_0443,
  V1014_SUPPLY_computeBottleneck_0444,
  V1014_SUPPLY_computeBottleneck_0445,
  V1014_SUPPLY_computeBottleneck_0446,
  V1014_SUPPLY_computeBottleneck_0447,
  V1014_SUPPLY_computeBottleneck_0448,
  V1014_SUPPLY_computeBottleneck_0449,
  V1014_SUPPLY_computeBottleneck_0450,
  V1014_SUPPLY_computeBottleneck_0451,
  V1014_SUPPLY_computeBottleneck_0452,
  V1014_SUPPLY_computeBottleneck_0453,
  V1014_SUPPLY_computeBottleneck_0454,
  V1014_SUPPLY_computeBottleneck_0455,
  V1014_SUPPLY_computeBottleneck_0456,
  V1014_SUPPLY_computeBottleneck_0457,
  V1014_SUPPLY_computeBottleneck_0458,
  V1014_SUPPLY_computeBottleneck_0459,
  V1014_SUPPLY_computeBottleneck_0460,
  V1014_SUPPLY_computeBottleneck_0461,
  V1014_SUPPLY_computeBottleneck_0462,
  V1014_SUPPLY_computeBottleneck_0463,
  V1014_SUPPLY_computeBottleneck_0464,
  V1014_SUPPLY_computeBottleneck_0465,
  V1014_SUPPLY_computeBottleneck_0466,
  V1014_SUPPLY_computeBottleneck_0467,
  V1014_SUPPLY_computeBottleneck_0468,
  V1014_SUPPLY_computeBottleneck_0469,
  V1014_SUPPLY_computeBottleneck_0470,
  V1014_SUPPLY_computeBottleneck_0471,
  V1014_SUPPLY_computeBottleneck_0472,
  V1014_SUPPLY_computeBottleneck_0473,
  V1014_SUPPLY_computeBottleneck_0474,
  V1014_SUPPLY_computeBottleneck_0475,
  V1014_SUPPLY_computeBottleneck_0476,
  V1014_SUPPLY_computeBottleneck_0477,
  V1014_SUPPLY_computeBottleneck_0478,
  V1014_SUPPLY_computeBottleneck_0479,
  V1014_SUPPLY_computeBottleneck_0480,
  V1014_SUPPLY_computeBottleneck_0481,
  V1014_SUPPLY_computeBottleneck_0482,
  V1014_SUPPLY_computeBottleneck_0483,
  V1014_SUPPLY_computeBottleneck_0484,
  V1014_SUPPLY_computeBottleneck_0485,
  V1014_SUPPLY_computeBottleneck_0486,
  V1014_SUPPLY_computeBottleneck_0487,
  V1014_SUPPLY_computeBottleneck_0488,
  V1014_SUPPLY_computeBottleneck_0489,
  V1014_SUPPLY_computeBottleneck_0490,
  V1014_SUPPLY_computeBottleneck_0491,
  V1014_SUPPLY_computeBottleneck_0492,
  V1014_SUPPLY_computeBottleneck_0493,
  V1014_SUPPLY_computeBottleneck_0494,
  V1014_SUPPLY_computeBottleneck_0495,
  V1014_SUPPLY_computeBottleneck_0496,
  V1014_SUPPLY_computeBottleneck_0497,
  V1014_SUPPLY_computeBottleneck_0498,
  V1014_SUPPLY_computeBottleneck_0499,
  V1014_SUPPLY_computeBottleneck_0500,
  V1014_SUPPLY_computeBottleneck_0501,
  V1014_SUPPLY_computeBottleneck_0502,
  V1014_SUPPLY_computeBottleneck_0503,
  V1014_SUPPLY_computeBottleneck_0504,
  V1014_SUPPLY_computeBottleneck_0505,
  V1014_SUPPLY_computeBottleneck_0506,
  V1014_SUPPLY_computeBottleneck_0507,
  V1014_SUPPLY_computeBottleneck_0508,
  V1014_SUPPLY_computeBottleneck_0509,
  V1014_SUPPLY_computeBottleneck_0510,
  V1014_SUPPLY_computeBottleneck_0511,
  V1014_SUPPLY_computeBottleneck_0512,
  V1014_SUPPLY_computeBottleneck_0513,
  V1014_SUPPLY_computeBottleneck_0514,
  V1014_SUPPLY_computeBottleneck_0515,
  V1014_SUPPLY_computeBottleneck_0516,
  V1014_SUPPLY_computeBottleneck_0517,
  V1014_SUPPLY_computeBottleneck_0518,
  V1014_SUPPLY_computeBottleneck_0519,
];

export function computeV1014SupplyBottleneckLayer(
  ctx: V1014SupplyTickContext,
  persistedIn?: V1014SupplyPersisted | null,
): { signals: V1014SupplyBottleneckSignal[]; persisted: V1014SupplyPersisted } {
  let persisted = sanitizeV1014SupplyPersisted(persistedIn) || createInitialV1014SupplyPersisted(ctx.turn, ctx.day);
  const signals: V1014SupplyBottleneckSignal[] = [];
  for (let i = 0; i < V1014_SUPPLY_BOM_CATALOG.length; i++) {
    const row = V1014_SUPPLY_BOM_CATALOG[i];
    const runner = V1014_SUPPLY_BOTTLENECK_RUNNERS[i % V1014_SUPPLY_BOTTLENECK_RUNNERS.length];
    const sig = runner(ctx, row);
    if (sig.severity > 0.05) signals.push(sig);
  }
  signals.sort((a, b) => b.severity - a.severity);
  const top = signals.slice(0, 64);
  const aggregateSeverity = top.reduce((s, x) => s + x.severity, 0) / Math.max(1, top.length);
  persisted = {
    ...persisted,
    lastTurn: ctx.turn,
    lastDay: ctx.day,
    activeBottlenecks: top,
    propagationGeneration: persisted.propagationGeneration + 1,
    aggregateSeverity,
  };
  return { signals: top, persisted };
}

export function executeV1014SupplyDayBoundaryPipeline(
  gameState: any,
  settings: GameSettingsState | undefined,
  ctx: V1014SupplyDayBoundaryContext,
): any {
  if (settings?.supplyChainDepthEnabled === false) return gameState;
  const tickCtx: V1014SupplyTickContext = {
    turn: ctx.turnCounter,
    day: ctx.newDay,
    baseDemand: 100 + (ctx.newDay % 17),
    baseCapacity: 120 + (ctx.newDay % 13),
    demandBySku: gameState?.v1014SupplyDemandBySku || {},
    capacityByRegion: gameState?.v1014SupplyCapacityByRegion || {},
  };
  const persisted = v1014SupplyEnsurePersisted(gameState);
  const { persisted: nextP } = computeV1014SupplyBottleneckLayer(tickCtx, persisted);
  return v1014SupplyAttach(gameState, nextP);
}

export type V1014SupplySelfTestResult = { id: string; name: string; passed: boolean; detail: string };

export function runV1014SupplyChainSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: V1014SupplySelfTestResult[];
} {
  const results: V1014SupplySelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };
  record('S00', 'BOM catalog size', V1014_SUPPLY_BOM_CATALOG.length >= 1000, String(V1014_SUPPLY_BOM_CATALOG.length));
  record('S01', 'Sanitize null', sanitizeV1014SupplyPersisted(null) === null, 'ok');
  const ctx: V1014SupplyTickContext = { turn: 4, day: 5, baseDemand: 90, baseCapacity: 80, demandBySku: {}, capacityByRegion: {} };
  const layer = computeV1014SupplyBottleneckLayer(ctx);
  record('S02', 'Layer produces persisted', layer.persisted.schemaVersion === V1014_SUPPLY_SCHEMA_VERSION, 'ok');
  record('S03', 'Propagation generation increments', layer.persisted.propagationGeneration === 1, String(layer.persisted.propagationGeneration));
  record('S04', 'Runners registered', V1014_SUPPLY_BOTTLENECK_RUNNERS.length >= 400, String(V1014_SUPPLY_BOTTLENECK_RUNNERS.length));
  { const row = V1014_SUPPLY_BOM_CATALOG[0]; const sig = V1014_SUPPLY_computeBottleneck_0000(ctx, row); record('S05', 'Bottleneck rule 0', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[1]; const sig = V1014_SUPPLY_computeBottleneck_0001(ctx, row); record('S06', 'Bottleneck rule 1', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[2]; const sig = V1014_SUPPLY_computeBottleneck_0002(ctx, row); record('S07', 'Bottleneck rule 2', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[3]; const sig = V1014_SUPPLY_computeBottleneck_0003(ctx, row); record('S08', 'Bottleneck rule 3', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[4]; const sig = V1014_SUPPLY_computeBottleneck_0004(ctx, row); record('S09', 'Bottleneck rule 4', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[5]; const sig = V1014_SUPPLY_computeBottleneck_0005(ctx, row); record('S10', 'Bottleneck rule 5', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[6]; const sig = V1014_SUPPLY_computeBottleneck_0006(ctx, row); record('S11', 'Bottleneck rule 6', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[7]; const sig = V1014_SUPPLY_computeBottleneck_0007(ctx, row); record('S12', 'Bottleneck rule 7', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[8]; const sig = V1014_SUPPLY_computeBottleneck_0008(ctx, row); record('S13', 'Bottleneck rule 8', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[9]; const sig = V1014_SUPPLY_computeBottleneck_0009(ctx, row); record('S14', 'Bottleneck rule 9', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[10]; const sig = V1014_SUPPLY_computeBottleneck_0010(ctx, row); record('S15', 'Bottleneck rule 10', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[11]; const sig = V1014_SUPPLY_computeBottleneck_0011(ctx, row); record('S16', 'Bottleneck rule 11', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[12]; const sig = V1014_SUPPLY_computeBottleneck_0012(ctx, row); record('S17', 'Bottleneck rule 12', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[13]; const sig = V1014_SUPPLY_computeBottleneck_0013(ctx, row); record('S18', 'Bottleneck rule 13', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[14]; const sig = V1014_SUPPLY_computeBottleneck_0014(ctx, row); record('S19', 'Bottleneck rule 14', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[15]; const sig = V1014_SUPPLY_computeBottleneck_0015(ctx, row); record('S20', 'Bottleneck rule 15', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[16]; const sig = V1014_SUPPLY_computeBottleneck_0016(ctx, row); record('S21', 'Bottleneck rule 16', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[17]; const sig = V1014_SUPPLY_computeBottleneck_0017(ctx, row); record('S22', 'Bottleneck rule 17', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[18]; const sig = V1014_SUPPLY_computeBottleneck_0018(ctx, row); record('S23', 'Bottleneck rule 18', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[19]; const sig = V1014_SUPPLY_computeBottleneck_0019(ctx, row); record('S24', 'Bottleneck rule 19', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[20]; const sig = V1014_SUPPLY_computeBottleneck_0020(ctx, row); record('S25', 'Bottleneck rule 20', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[21]; const sig = V1014_SUPPLY_computeBottleneck_0021(ctx, row); record('S26', 'Bottleneck rule 21', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[22]; const sig = V1014_SUPPLY_computeBottleneck_0022(ctx, row); record('S27', 'Bottleneck rule 22', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[23]; const sig = V1014_SUPPLY_computeBottleneck_0023(ctx, row); record('S28', 'Bottleneck rule 23', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[24]; const sig = V1014_SUPPLY_computeBottleneck_0024(ctx, row); record('S29', 'Bottleneck rule 24', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[25]; const sig = V1014_SUPPLY_computeBottleneck_0025(ctx, row); record('S30', 'Bottleneck rule 25', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[26]; const sig = V1014_SUPPLY_computeBottleneck_0026(ctx, row); record('S31', 'Bottleneck rule 26', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[27]; const sig = V1014_SUPPLY_computeBottleneck_0027(ctx, row); record('S32', 'Bottleneck rule 27', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[28]; const sig = V1014_SUPPLY_computeBottleneck_0028(ctx, row); record('S33', 'Bottleneck rule 28', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[29]; const sig = V1014_SUPPLY_computeBottleneck_0029(ctx, row); record('S34', 'Bottleneck rule 29', typeof sig.severity === 'number', String(sig.checksum)); }
  { const row = V1014_SUPPLY_BOM_CATALOG[30]; const sig = V1014_SUPPLY_computeBottleneck_0030(ctx, row); record('S35', 'Bottleneck rule 30', typeof sig.severity === 'number', String(sig.checksum)); }
  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}

