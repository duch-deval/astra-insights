import { useMemo } from 'react';
import { NSNRecord, subsystems, platforms } from '@/data/mockData';

interface HeatmapMatrixProps {
  data: NSNRecord[];
  onCellClick: (platform: string, subsystem: string) => void;
}

const tierBadge: Record<string, { label: string; className: string }> = {
  'WSGC-A': { label: 'CRITICAL', className: 'bg-sole/20 text-sole border border-sole/40' },
  'WSGC-B': { label: 'IMPORTANT', className: 'bg-warning/20 text-warning border border-warning/40' },
};

export function HeatmapMatrix({ data, onCellClick }: HeatmapMatrixProps) {
  const { matrix, maxCount, colTotals, rowTotals, visiblePlatforms } = useMemo(() => {
    const mat: Record<string, Record<string, number>> = {};
    const rowT: Record<string, number> = {};
    const colT: Record<string, number> = {};

    for (const sub of subsystems) colT[sub] = 0;

    const platformSet = new Set(data.map(d => d.platform));
    const visible = platforms.filter(p => platformSet.has(p.name));

    for (const p of visible) {
      mat[p.name] = {};
      rowT[p.name] = 0;
      for (const sub of subsystems) mat[p.name][sub] = 0;
    }

    for (const r of data) {
      if (!mat[r.platform]) continue;
      if (mat[r.platform][r.subsystem] !== undefined) {
        mat[r.platform][r.subsystem]++;
        rowT[r.platform]++;
        colT[r.subsystem]++;
      }
    }

    let mx = 0;
    for (const p of visible) {
      for (const sub of subsystems) {
        if (mat[p.name][sub] > mx) mx = mat[p.name][sub];
      }
    }

    return { matrix: mat, maxCount: mx, colTotals: colT, rowTotals: rowT, visiblePlatforms: visible };
  }, [data]);

  const getCellColor = (count: number): string => {
    if (count === 0) return 'bg-muted/50';
    const ratio = count / maxCount;
    if (ratio < 0.2) return 'bg-orange-50 text-orange-900';
    if (ratio < 0.4) return 'bg-orange-100 text-orange-900';
    if (ratio < 0.6) return 'bg-orange-200 text-orange-900';
    if (ratio < 0.8) return 'bg-orange-300 text-orange-950';
    return 'bg-red-500 text-white';
  };

  const subLabels = subsystems.map(s => {
    const parts = s.split(/[\s/&]+/);
    return parts.length > 1 ? [parts.slice(0, Math.ceil(parts.length / 2)).join(' '), parts.slice(Math.ceil(parts.length / 2)).join(' ')] : [s];
  });

  return (
    <div className="bg-card border border-border rounded overflow-x-auto">
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-card px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider min-w-[180px]">
              Platform
            </th>
            {subsystems.map((sub, i) => (
              <th key={sub} className="px-1 py-2 text-center text-[9px] font-medium text-muted-foreground uppercase tracking-wider min-w-[62px] leading-tight">
                {subLabels[i].map((line, li) => (
                  <span key={li} className="block">{line}</span>
                ))}
              </th>
            ))}
            <th className="px-2 py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider min-w-[50px] bg-muted/30">
              Total
            </th>
            <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider min-w-[110px]">
              Primary OEM
            </th>
          </tr>
        </thead>
        <tbody>
          {visiblePlatforms.map((plat, rowIdx) => {
            const badge = tierBadge[plat.tier];
            return (
              <tr key={plat.name} className={rowIdx % 2 === 0 ? '' : 'bg-muted/20'}>
                <td className="sticky left-0 z-10 px-3 py-1.5 font-medium text-foreground whitespace-nowrap" style={{ backgroundColor: rowIdx % 2 === 0 ? 'hsl(var(--card))' : 'hsl(var(--muted) / 0.2)' }}>
                  <div className="flex items-center gap-1.5">
                    <span className="truncate max-w-[120px]">{plat.name}</span>
                    {badge && (
                      <span className={`px-1 py-0 text-[7px] font-bold rounded ${badge.className} whitespace-nowrap`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                </td>
                {subsystems.map(sub => {
                  const count = matrix[plat.name]?.[sub] || 0;
                  return (
                    <td
                      key={sub}
                      onClick={() => count > 0 && onCellClick(plat.name, sub)}
                      className={`px-1 py-1.5 text-center font-mono text-[10px] border-l border-border/50 ${getCellColor(count)} ${count > 0 ? 'cursor-pointer hover:ring-2 hover:ring-primary hover:ring-inset' : ''} transition-shadow`}
                    >
                      {count > 0 ? count : ''}
                    </td>
                  );
                })}
                <td className="px-2 py-1.5 text-center font-mono text-[11px] font-semibold text-foreground bg-muted/30 border-l border-border">
                  {rowTotals[plat.name] || 0}
                </td>
                <td className="px-2 py-1.5 text-[10px] text-muted-foreground truncate border-l border-border">
                  {plat.primaryOem}
                </td>
              </tr>
            );
          })}
          {/* Column totals row */}
          <tr className="border-t-2 border-border bg-muted/40">
            <td className="sticky left-0 z-10 px-3 py-2 font-semibold text-[10px] text-foreground uppercase bg-muted/40">
              Totals
            </td>
            {subsystems.map(sub => (
              <td key={sub} className="px-1 py-2 text-center font-mono text-[10px] font-semibold text-foreground border-l border-border/50">
                {colTotals[sub] || 0}
              </td>
            ))}
            <td className="px-2 py-2 text-center font-mono text-[11px] font-bold text-foreground bg-muted/30 border-l border-border">
              {data.length}
            </td>
            <td className="border-l border-border" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
