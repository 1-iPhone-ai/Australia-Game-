import { o6kAgent24Fingerprint, o6kAgent24StableStringify } from './fingerprint.ts';

/** Minimal ledger event shape for replay-safe causal indexing (matches V9.4 ledger fields). */
export interface Agent24LedgerEventLike {
  id?: string;
  eventId?: string;
  turn?: number;
  day?: number;
  title?: string;
  description?: string;
  message?: string;
  eventType?: string;
  parentEventId?: string;
  rootEventId?: string;
  causalChainId?: string;
  causalDepth?: number;
  causalLinkage?: {
    causalChainId?: string;
    parentEventId?: string;
    rootEventId?: string;
    causalDepth?: number;
  };
}

export interface Agent24CausalRecord {
  recordId: string;
  eventId: string;
  turn: number;
  day: number;
  sequence: number;
  causalChainId: string;
  parentEventId: string | null;
  rootEventId: string | null;
  causalDepth: number;
  summary: string;
  fingerprint: string;
}

export interface Agent24CausalRecordIndex {
  indexId: string;
  recordCount: number;
  chainCount: number;
  maxDepth: number;
  recordsByEventId: Record<string, Agent24CausalRecord>;
  chainsById: Record<string, string[]>;
  deterministicFingerprint: string;
}

function linkageOf(evt: Agent24LedgerEventLike) {
  return {
    causalChainId:
      evt.causalLinkage?.causalChainId || evt.causalChainId || evt.causalLinkage?.rootEventId || evt.rootEventId || 'chain_root',
    parentEventId: evt.causalLinkage?.parentEventId || evt.parentEventId || null,
    rootEventId: evt.causalLinkage?.rootEventId || evt.rootEventId || null,
    causalDepth:
      typeof evt.causalLinkage?.causalDepth === 'number'
        ? evt.causalLinkage.causalDepth
        : typeof evt.causalDepth === 'number'
          ? evt.causalDepth
          : 0,
  };
}

export function buildAgent24CausalRecordIndex(events: Agent24LedgerEventLike[]): Agent24CausalRecordIndex {
  const recordsByEventId: Record<string, Agent24CausalRecord> = {};
  const chainsById: Record<string, string[]> = {};
  let maxDepth = 0;
  let seq = 0;

  for (const evt of events) {
    seq++;
    const eventId = String(evt.id || evt.eventId || `evt_${seq}`);
    const link = linkageOf(evt);
    const turn = Number(evt.turn ?? evt.day ?? 1);
    const day = Number(evt.day ?? evt.turn ?? 1);
    const summary = String(evt.title || evt.description || evt.message || evt.eventType || '').slice(0, 160);
    const record: Agent24CausalRecord = {
      recordId: o6kAgent24Fingerprint('causal_record', { eventId, seq, turn, link }),
      eventId,
      turn,
      day,
      sequence: seq,
      causalChainId: link.causalChainId,
      parentEventId: link.parentEventId,
      rootEventId: link.rootEventId,
      causalDepth: link.causalDepth,
      summary,
      fingerprint: o6kAgent24Fingerprint('causal_evt', { eventId, turn, summary, link }),
    };
    recordsByEventId[eventId] = record;
    if (!chainsById[link.causalChainId]) chainsById[link.causalChainId] = [];
    chainsById[link.causalChainId].push(eventId);
    if (link.causalDepth > maxDepth) maxDepth = link.causalDepth;
  }

  for (const chainId of Object.keys(chainsById)) {
    chainsById[chainId].sort((a, b) => {
      const ra = recordsByEventId[a];
      const rb = recordsByEventId[b];
      return (ra?.sequence ?? 0) - (rb?.sequence ?? 0) || a.localeCompare(b);
    });
  }

  const chainKeys = Object.keys(chainsById).sort();
  const payload = {
    chainKeys,
    recordFingerprints: Object.keys(recordsByEventId)
      .sort()
      .map(id => recordsByEventId[id].fingerprint),
  };

  return {
    indexId: o6kAgent24Fingerprint('causal_index', payload),
    recordCount: Object.keys(recordsByEventId).length,
    chainCount: chainKeys.length,
    maxDepth,
    recordsByEventId,
    chainsById,
    deterministicFingerprint: o6kAgent24Fingerprint('causal_index_body', o6kAgent24StableStringify(payload)),
  };
}

export function pickCausalChain(index: Agent24CausalRecordIndex, chainId: string): Agent24CausalRecord[] {
  const ids = index.chainsById[chainId] || [];
  return ids.map(id => index.recordsByEventId[id]).filter(Boolean);
}
