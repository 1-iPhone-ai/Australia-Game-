import React from 'react';
import type { RegionMapNode } from '../types.ts';
import { nrDashOwnerLabel } from '../core/util.ts';

export interface RegionPositionMapProps {
  nodes: RegionMapNode[];
  focusRegionId?: string | null;
  width?: number;
  height?: number;
  onSelect?: (regionId: string) => void;
}

const OWNER_RING: Record<RegionMapNode['owner'], string> = {
  you: '#38bdf8',
  rival: '#f87171',
  neutral: '#94a3b8',
  unknown: '#475569',
};

/** SVG strategic map — node size from momentum history activity weight in snapshot. */
export const RegionPositionMap: React.FC<RegionPositionMapProps> = ({
  nodes,
  focusRegionId = null,
  width = 420,
  height = 260,
  onSelect,
}) => (
  <svg
    viewBox="0 0 100 115"
    width={width}
    height={height}
    className="rounded-lg border border-slate-700 bg-slate-950/80"
    data-testid="agent23-region-position-map"
    role="img"
    aria-label="Australian regions strategic map"
  >
    <rect x={0} y={0} width={100} height={115} fill="#0f172a" />
    {nodes.map(n => {
      const r = 2.2 + n.activityWeight * 2.8;
      const focused = focusRegionId === n.regionId;
      return (
        <g key={n.regionId} data-testid={`agent23-map-node-${n.regionId}`}>
          <circle
            cx={n.x}
            cy={n.y}
            r={r + (focused ? 1.2 : 0)}
            fill={n.color}
            fillOpacity={0.85}
            stroke={OWNER_RING[n.owner]}
            strokeWidth={focused ? 1.4 : 0.9}
            onClick={() => onSelect?.(n.regionId)}
            style={{ cursor: onSelect ? 'pointer' : 'default' }}
          />
          <text x={n.x} y={n.y + r + 4} textAnchor="middle" fontSize={3.2} fill="#e2e8f0">
            {n.regionId}
          </text>
          <title>
            {`${n.name} · ${nrDashOwnerLabel(n.owner)} · ${n.momentumBand} · needs ${n.openNeeds} · risks ${n.highRisks}${
              n.resilience != null ? ` · resilience ${n.resilience}` : ''
            }`}
          </title>
        </g>
      );
    })}
  </svg>
);
