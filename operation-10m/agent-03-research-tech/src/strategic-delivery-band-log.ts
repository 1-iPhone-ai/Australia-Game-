import type {
  ResearchStrategicDeliveryBand,
  ResearchStrategicDeliveryBandEvent,
  ResearchStrategicDeliveryOutlook,
  ResearchStrategicDeliverySnapshot,
} from './types.ts';

export const RESEARCH_STRATEGIC_DELIVERY_BAND_LOG_CAP = 32;

export const RESEARCH_STRATEGIC_DELIVERY_BANDS: ResearchStrategicDeliveryBand[] = [35, 50, 65, 80];

function deliveryScore(outlook: ResearchStrategicDeliveryOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.nationalDeliveryScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchStrategicDeliveryBandEvent[],
  phase: ResearchStrategicDeliveryBandEvent['phase']
): ResearchStrategicDeliveryBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchStrategicDeliveryBand;
}

export function emptyStrategicDeliveryBandLog(): ResearchStrategicDeliveryBandEvent[] {
  return [];
}

export function rebuildStrategicDeliveryBandLogFromSnapshot(
  snapshot: ResearchStrategicDeliverySnapshot | null,
  outlook: ResearchStrategicDeliveryOutlook,
  turn: number
): ResearchStrategicDeliveryBandEvent[] {
  if (!snapshot) return emptyStrategicDeliveryBandLog();
  return appendStrategicDeliveryBandEvents(emptyStrategicDeliveryBandLog(), snapshot, outlook, turn);
}

export function appendStrategicDeliveryBandEvents(
  previousLog: ResearchStrategicDeliveryBandEvent[],
  previousSnapshot: ResearchStrategicDeliverySnapshot | null,
  outlook: ResearchStrategicDeliveryOutlook,
  turn: number
): ResearchStrategicDeliveryBandEvent[] {
  const score = deliveryScore(outlook);
  const priorScore = previousSnapshot?.nationalDeliveryScore ?? 0;
  const appended: ResearchStrategicDeliveryBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_STRATEGIC_DELIVERY_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalDeliveryScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_STRATEGIC_DELIVERY_BANDS[RESEARCH_STRATEGIC_DELIVERY_BANDS.length - 1]);
    for (const band of [...RESEARCH_STRATEGIC_DELIVERY_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalDeliveryScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_STRATEGIC_DELIVERY_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_STRATEGIC_DELIVERY_BAND_LOG_CAP);
}
