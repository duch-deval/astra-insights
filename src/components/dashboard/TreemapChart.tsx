import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { NSNRecord } from '@/data/mockData';
import { useMemo } from 'react';

export type ViewMode = 'platform' | 'subsystem' | 'oem';

interface TreemapChartProps {
  data: NSNRecord[];
  viewMode: ViewMode;
  onPlatformClick: (platform: string) => void;
}

interface TreeNode {
  name: string;
  size?: number;
  children?: TreeNode[];
  soleSourceRatio?: number;
  adv?: number;
  platform?: string;
}

function buildPlatformTree(data: NSNRecord[]): TreeNode[] {
  const platformMap = new Map<string, { oems: Map<string, NSNRecord[]> }>();
  for (const r of data) {
    if (!platformMap.has(r.platform)) platformMap.set(r.platform, { oems: new Map() });
    const p = platformMap.get(r.platform)!;
    if (!p.oems.has(r.oem)) p.oems.set(r.oem, []);
    p.oems.get(r.oem)!.push(r);
  }
  return Array.from(platformMap.entries()).map(([platform, { oems }]) => {
    const allRecords = Array.from(oems.values()).flat();
    const soleCount = allRecords.filter(r => r.soleSource).length;
    return {
      name: platform,
      platform,
      soleSourceRatio: allRecords.length > 0 ? soleCount / allRecords.length : 0,
      children: Array.from(oems.entries()).map(([oem, records]) => ({
        name: oem,
        size: records.length,
        platform,
        adv: records.reduce((s, r) => s + r.adv, 0),
      })),
    };
  });
}

function buildSubsystemTree(data: NSNRecord[]): TreeNode[] {
  const subsystemMap = new Map<string, Map<string, NSNRecord[]>>();
  for (const r of data) {
    if (!subsystemMap.has(r.subsystem)) subsystemMap.set(r.subsystem, new Map());
    const s = subsystemMap.get(r.subsystem)!;
    if (!s.has(r.platform)) s.set(r.platform, []);
    s.get(r.platform)!.push(r);
  }
  return Array.from(subsystemMap.entries()).map(([subsystem, platforms]) => ({
    name: subsystem,
    children: Array.from(platforms.entries()).map(([platform, records]) => ({
      name: platform,
      size: records.length,
      platform,
      adv: records.reduce((s, r) => s + r.adv, 0),
    })),
  }));
}

function buildOEMTree(data: NSNRecord[]): TreeNode[] {
  const oemMap = new Map<string, Map<string, NSNRecord[]>>();
  for (const r of data) {
    if (!oemMap.has(r.oem)) oemMap.set(r.oem, new Map());
    const o = oemMap.get(r.oem)!;
    if (!o.has(r.platform)) o.set(r.platform, []);
    o.get(r.platform)!.push(r);
  }
  return Array.from(oemMap.entries()).map(([oem, platforms]) => {
    const allRecords = Array.from(platforms.values()).flat();
    const totalAdv = allRecords.reduce((s, r) => s + r.adv, 0);
    return {
      name: `${oem} ($${(totalAdv / 1_000_000).toFixed(1)}M)`,
      adv: totalAdv,
      children: Array.from(platforms.entries()).map(([platform, records]) => ({
        name: platform,
        size: records.length,
        platform,
        adv: records.reduce((s, r) => s + r.adv, 0),
      })),
    };
  });
}

const SOLE_COLOR = 'hsl(0, 72%, 51%)';
const COMPETITIVE_COLOR = 'hsl(152, 60%, 42%)';
const MIXED_COLORS = [
  'hsl(0, 72%, 45%)', 'hsl(0, 65%, 55%)', 'hsl(0, 55%, 60%)',
  'hsl(38, 70%, 50%)', 'hsl(152, 50%, 45%)', 'hsl(152, 60%, 42%)',
];

function getColor(node: any, viewMode: ViewMode): string {
  if (viewMode === 'platform' && node.soleSourceRatio !== undefined) {
    const ratio = node.soleSourceRatio;
    if (ratio > 0.8) return SOLE_COLOR;
    if (ratio < 0.3) return COMPETITIVE_COLOR;
    return `hsl(${Math.round(38 - (ratio - 0.3) * 76)}, 65%, 50%)`;
  }
  // For subsystem/oem use index-based coloring
  const colors = [
    'hsl(220, 50%, 35%)', 'hsl(220, 45%, 42%)', 'hsl(220, 40%, 50%)',
    'hsl(200, 45%, 40%)', 'hsl(200, 40%, 48%)', 'hsl(210, 35%, 55%)',
    'hsl(215, 50%, 30%)', 'hsl(225, 45%, 38%)', 'hsl(230, 40%, 45%)',
  ];
  return colors[node.depth % colors.length] || colors[0];
}

interface CustomContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  depth: number;
  soleSourceRatio?: number;
  platform?: string;
  size?: number;
  adv?: number;
  root?: any;
  index?: number;
  viewMode: ViewMode;
  onPlatformClick: (platform: string) => void;
}

function CustomContent(props: CustomContentProps) {
  const { x, y, width, height, name, depth, soleSourceRatio, platform, size, viewMode, onPlatformClick } = props;

  if (width < 4 || height < 4) return null;

  const isLeaf = depth === 2;
  const isParent = depth === 1;

  let fill: string;
  if (viewMode === 'platform' && isParent && soleSourceRatio !== undefined) {
    if (soleSourceRatio > 0.8) fill = SOLE_COLOR;
    else if (soleSourceRatio < 0.3) fill = COMPETITIVE_COLOR;
    else fill = `hsl(${Math.round(38)}, 65%, 50%)`;
  } else if (isLeaf) {
    fill = viewMode === 'platform'
      ? (soleSourceRatio !== undefined && soleSourceRatio > 0.5 ? 'hsl(0, 60%, 58%)' : 'hsl(152, 45%, 50%)')
      : `hsl(${210 + (props.index || 0) * 7}, 40%, ${45 + (props.index || 0) % 3 * 5}%)`;
  } else {
    fill = `hsl(220, 35%, ${30 + depth * 10}%)`;
  }

  const showLabel = width > 30 && height > 18;
  const showSize = width > 50 && height > 32 && isLeaf;

  return (
    <g
      onClick={() => {
        const p = platform || (isParent ? name : undefined);
        if (p) onPlatformClick(p);
      }}
      style={{ cursor: platform || isParent ? 'pointer' : 'default' }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="hsl(220, 30%, 95%)"
        strokeWidth={isParent ? 2 : 1}
        rx={2}
        opacity={isLeaf ? 0.9 : 1}
      />
      {showLabel && (
        <text
          x={x + 4}
          y={y + (isParent ? 13 : 13)}
          fill="white"
          fontSize={isParent ? 11 : 9}
          fontWeight={isParent ? 600 : 400}
          fontFamily="'IBM Plex Sans', sans-serif"
        >
          {name.length > Math.floor(width / 6) ? name.slice(0, Math.floor(width / 6)) + '…' : name}
        </text>
      )}
      {showSize && size && (
        <text
          x={x + 4}
          y={y + 25}
          fill="hsla(0, 0%, 100%, 0.7)"
          fontSize={8}
          fontFamily="'IBM Plex Mono', monospace"
        >
          {size} NSNs
        </text>
      )}
    </g>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-foreground">{data.name}</p>
      {data.size && <p className="text-muted-foreground">{data.size} NSNs</p>}
      {data.adv && <p className="text-muted-foreground">ADV: ${(data.adv / 1000).toFixed(0)}K</p>}
    </div>
  );
};

export function TreemapChart({ data, viewMode, onPlatformClick }: TreemapChartProps) {
  const treeData = useMemo(() => {
    switch (viewMode) {
      case 'platform': return buildPlatformTree(data);
      case 'subsystem': return buildSubsystemTree(data);
      case 'oem': return buildOEMTree(data);
    }
  }, [data, viewMode]);

  return (
    <div className="bg-card border border-border rounded-md p-4">
      <ResponsiveContainer width="100%" height={520}>
        <Treemap
          data={treeData}
          dataKey="size"
          aspectRatio={viewMode === 'subsystem' ? 1 : 4 / 3}
          stroke="hsl(220, 30%, 95%)"
          content={<CustomContent viewMode={viewMode} onPlatformClick={onPlatformClick} x={0} y={0} width={0} height={0} name="" depth={0} />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>

      {viewMode === 'platform' && (
        <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-sole inline-block" />
            Sole Source (&gt;80%)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-competitive inline-block" />
            Competitive (&lt;30%)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-warning inline-block" />
            Mixed
          </div>
        </div>
      )}
    </div>
  );
}
