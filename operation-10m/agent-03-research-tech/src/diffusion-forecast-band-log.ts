import type {
  ResearchDiffusionForecast,
  ResearchDiffusionForecastBand,
  ResearchDiffusionForecastBandEvent,
  ResearchDiffusionForecastSnapshot,
} from './types.ts';

export const RESEARCH_DIFFUSION_FORECAST_BAND_LOG_CAP = 32;

export const RESEARCH_DIFFUSION_FORECAST_BANDS: ResearchDiffusionForecastBand[] = [20, 35, 50, 65];

function peakScorePercent(forecast: ResearchDiffusionForecast): number {
  return Math.round(Math.min(100, Math.max(0, (forecast.peakProjectedScore ?? 0) * 100)));
}

function highestLoggedBand(
  log: ResearchDiffusionForecastBandEvent[],
  phase: ResearchDiffusionForecastBandEvent['phase']
): ResearchDiffusionForecastBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchDiffusionForecastBand;
}

export function emptyDiffusionForecastBandLog(): ResearchDiffusionForecastBandEvent[] {
  return [];
}

export function rebuildDiffusionForecastBandLogFromSnapshot(
  snapshot: ResearchDiffusionForecastSnapshot | null,
  forecast: ResearchDiffusionForecast,
  turn: number
): ResearchDiffusionForecastBandEvent[] {
  if (!snapshot) return emptyDiffusionForecastBandLog();
  return appendDiffusionForecastBandEvents(emptyDiffusionForecastBandLog(), snapshot, forecast, turn);
}

export function appendDiffusionForecastBandEvents(
  previousLog: ResearchDiffusionForecastBandEvent[],
  previousSnapshot: ResearchDiffusionForecastSnapshot | null,
  forecast: ResearchDiffusionForecast,
  turn: number
): ResearchDiffusionForecastBandEvent[] {
  const score = peakScorePercent(forecast);
  const priorScore = previousSnapshot?.peakProjectedPercent ?? 0;
  const appended: ResearchDiffusionForecastBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_DIFFUSION_FORECAST_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        peakProjectedPercent: score,
        horizonTurns: forecast.horizonTurns,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_DIFFUSION_FORECAST_BANDS[RESEARCH_DIFFUSION_FORECAST_BANDS.length - 1]);
    for (const band of [...RESEARCH_DIFFUSION_FORECAST_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        peakProjectedPercent: score,
        horizonTurns: forecast.horizonTurns,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_DIFFUSION_FORECAST_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_DIFFUSION_FORECAST_BAND_LOG_CAP);
}
