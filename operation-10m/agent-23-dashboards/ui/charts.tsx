import React from 'react';
import { NR_DASH_COND_COLOR } from '../core/constants.ts';
import { nrDashClamp01 } from '../core/util.ts';
import type { NationalNetworkCondition, NrDashHeatCell } from '../types.ts';
import { NATIONAL_CONDITION_ICON } from '../core/constants.ts';

export interface NrDashSparklineProps {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  ariaLabel: string;
}

export const NrDashSparkline: React.FC<NrDashSparklineProps> = ({
  values,
  width = 120,
  height = 28,
  stroke = '#38bdf8',
  fill = 'rgba(56,189,248,0.15)',
  ariaLabel,
}) => {
  const pts = (values || []).filter(v => Number.isFinite(v));
  if (pts.length < 2) {
    return (
      <svg width={width} height={height} aria-label={ariaLabel} role="img" data-testid="nr-dash-sparkline-empty">
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#475569" strokeDasharray="4 3" />
      </svg>
    );
  }
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;
  const coords = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * width;
    const y = height - 2 - ((v - min) / span) * (height - 4);
    return `${x},${y}`;
  });
  const poly = `${coords.join(' ')} ${width},${height} 0,${height}`;
  return (
    <svg width={width} height={height} aria-label={ariaLabel} role="img" data-testid="nr-dash-sparkline">
      <polygon points={poly} fill={fill} stroke="none" />
      <polyline
        points={coords.join(' ')}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export interface NrDashBarChartProps {
  items: Array<{ key: string; label: string; value: number; sublabel?: string; color?: string }>;
  maxValue?: number;
  height?: number;
}

export const NrDashBarChart: React.FC<NrDashBarChartProps> = ({ items, maxValue }) => {
  const max = maxValue ?? Math.max(1, ...items.map(i => i.value));
  return (
    <div className="space-y-1" data-testid="nr-dash-bar-chart" role="list">
      {items.map(it => (
        <div key={it.key} role="listitem" className="grid grid-cols-[minmax(6rem,8rem)_1fr_auto] gap-2 items-center text-xs">
          <span className="truncate opacity-90" title={it.label}>
            {it.label}
          </span>
          <div className="h-3 bg-slate-800 rounded overflow-hidden" aria-hidden="true">
            <div
              className="h-full rounded transition-all duration-300"
              style={{
                width: `${Math.round(nrDashClamp01(it.value / max) * 100)}%`,
                background: it.color || '#38bdf8',
              }}
            />
          </div>
          <span className="font-mono opacity-80 w-10 text-right">
            {Math.round(it.value * (max <= 1 ? 100 : 1))}
            {max <= 1 ? '%' : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

export const NrDashHeatMatrix: React.FC<{
  cells: NrDashHeatCell[];
  rowLabels: string[];
  colLabels: string[];
}> = ({ cells, rowLabels, colLabels }) => (
  <div className="overflow-x-auto" data-testid="nr-dash-heat-matrix">
    <table className="text-[10px] border-collapse min-w-full">
      <thead>
        <tr>
          <th className="p-1 text-left opacity-70" />
          {colLabels.map(c => (
            <th key={c} className="p-1 font-normal opacity-80">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowLabels.map(row => (
          <tr key={row}>
            <th className="p-1 text-left font-semibold pr-2">{row}</th>
            {colLabels.map(col => {
              const cell = cells.find(x => x.row === row && x.col === col);
              const bg = cell ? NR_DASH_COND_COLOR[cell.tone as NationalNetworkCondition] : '#334155';
              return (
                <td key={col} className="p-0.5">
                  <div
                    className="w-8 h-6 rounded border border-slate-700/80 flex items-center justify-center text-[9px]"
                    style={{ backgroundColor: `${bg}33`, borderColor: bg }}
                    title={cell?.title || 'No data'}
                  >
                    {cell ? NATIONAL_CONDITION_ICON[cell.tone as NationalNetworkCondition] : '·'}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
