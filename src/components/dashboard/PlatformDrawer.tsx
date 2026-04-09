import { X } from 'lucide-react';
import { NSNRecord, platforms } from '@/data/mockData';
import { useMemo } from 'react';

interface PlatformDrawerProps {
  platform: string;
  subsystem: string;
  data: NSNRecord[];
  onClose: () => void;
}

const tierLabels: Record<string, { label: string; className: string }> = {
  'WSGC-A': { label: 'WSGC-A — Critical to Fight', className: 'bg-sole/15 text-sole border-sole/30' },
  'WSGC-B': { label: 'WSGC-B — Important', className: 'bg-warning/15 text-warning border-warning/30' },
  'WSGC-C': { label: 'WSGC-C — Sustainment', className: 'bg-primary/15 text-primary border-primary/30' },
};

export function PlatformDrawer({ platform, subsystem, data, onClose }: PlatformDrawerProps) {
  const platformInfo = platforms.find(p => p.name === platform);
  const cellData = useMemo(
    () => data.filter(d => d.platform === platform && d.subsystem === subsystem),
    [data, platform, subsystem]
  );

  const samSnippet = useMemo(() => {
    const oemMap = new Map<string, { count: number; totalAdv: number }>();
    for (const r of cellData) {
      const entry = oemMap.get(r.oem) || { count: 0, totalAdv: 0 };
      entry.count++;
      entry.totalAdv += r.adv;
      oemMap.set(r.oem, entry);
    }
    const sorted = Array.from(oemMap.entries()).sort((a, b) => b[1].totalAdv - a[1].totalAdv);
    return sorted.slice(0, 3).map(([oem, stats]) => ({
      oem,
      ...stats,
      topParts: cellData.filter(d => d.oem === oem).sort((a, b) => b.adv - a.adv).slice(0, 3),
    }));
  }, [cellData]);

  const tier = platformInfo?.tier || 'WSGC-C';
  const tierInfo = tierLabels[tier];

  return (
    <div className="fixed inset-y-0 right-0 w-[540px] bg-card border-l border-border shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">{platform}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{platformInfo?.category || 'Unknown'} · {subsystem}</p>
          <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded border ${tierInfo.className}`}>
            {tierInfo.label}
          </span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* SAM Talking Points */}
      {samSnippet.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-2">SAM Talking Points</h3>
          <div className="space-y-2">
            {samSnippet.map(tp => (
              <div key={tp.oem} className="bg-muted/50 rounded p-2.5 text-[11px] text-foreground">
                <span className="font-semibold">{tp.oem}</span> has{' '}
                <span className="font-mono font-semibold">{tp.count}</span> no-bid NSNs in the{' '}
                <span className="font-semibold">{subsystem}</span> subsystem on the{' '}
                <span className="font-semibold">{platform}</span> worth{' '}
                <span className="font-mono font-semibold">${(tp.totalAdv / 1000).toFixed(1)}K</span> annually.
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NSN Table */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h3 className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-2 mt-3">
          No-Bid NSNs ({cellData.length})
        </h3>
        <div className="border border-border rounded overflow-hidden">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-muted">
                <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">NSN</th>
                <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">Part Name</th>
                <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">OEM</th>
                <th className="text-right px-2 py-1.5 font-medium text-muted-foreground">ADV ($)</th>
                <th className="text-center px-2 py-1.5 font-medium text-muted-foreground">Source</th>
              </tr>
            </thead>
            <tbody>
              {cellData.map((r, i) => (
                <tr key={r.nsn} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                  <td className="px-2 py-1 font-mono text-[10px]">{r.nsn}</td>
                  <td className="px-2 py-1 truncate max-w-[120px]">{r.nomenclature}</td>
                  <td className="px-2 py-1 truncate max-w-[90px]">{r.oem}</td>
                  <td className="px-2 py-1 text-right font-mono">${(r.adv / 1000).toFixed(1)}K</td>
                  <td className="px-2 py-1 text-center">
                    {r.soleSource ? (
                      <span className="px-1.5 py-0.5 text-[8px] font-bold bg-sole/15 text-sole rounded border border-sole/30">SOLE</span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[8px] font-bold bg-competitive/15 text-competitive rounded border border-competitive/30">COMP</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
