import React from 'react';
import type { RegionMapNode, NrDashMapLink } from '../types.ts';
import { nrDashOwnerLabel } from '../core/util.ts';
import { nrDashLinkEndpoints } from '../core/map-links.ts';

export interface RegionPositionMapProps {
  nodes: RegionMapNode[];
  links?: NrDashMapLink[];
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
  links = [],
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
    {links.map(link => {
      const seg = nrDashLinkEndpoints(link, nodes);
      if (!seg) return null;
      return (
        <line
          key={link.id}
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          stroke={link.stroke}
          strokeWidth={(link.kind === 'dependency' ? 0.9 : 0.5) + (link.stressLevel ?? 0) * 0.8}
          strokeDasharray={link.dash}
          opacity={0.55 + (link.stressLevel ?? 0) * 0.45}
          data-testid={`agent23-map-link-${link.id}`}
        >
          <title>{link.title}</title>
        </line>
      );
    })}
    {nodes.map(n => {
      const r = 2.2 + n.activityWeight * 2.8;
      const focused = focusRegionId === n.regionId;
      const opacity = n.dimmed ? 0.35 : 0.85;
      const pulse = n.pulseIntensity ?? 0;
      return (
        <g key={n.regionId} data-testid={`agent23-map-node-${n.regionId}`} opacity={opacity}>
          {pulse > 0.15 && (
            <circle
              cx={n.x}
              cy={n.y}
              r={r + 2.4 + pulse * 2}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={0.35 + pulse * 0.5}
              opacity={0.25 + pulse * 0.45}
              data-testid={`agent23-map-pulse-${n.regionId}`}
            />
          )}
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
          <text x={n.x} y={n.y + r + 4} textAnchor="middle" fontSize={3.2} fill="#e2e8f0" opacity={n.dimmed ? 0.5 : 1}>
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
