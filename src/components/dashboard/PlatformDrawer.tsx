import { X } from 'lucide-react';
import { NSNRecord, platforms } from '@/data/mockData';
import { useMemo } from 'react';

interface PlatformDrawerProps {
  platform: string | null;
  data: NSNRecord[];
  onClose: () => void;
}

const tierLabels: Record<string, { label: string; className: string }> = {
  'WSGC-A': { label: 'WSGC-A — Critical to Fight', className: 'bg-sole/15 text-sole border-sole/30' },
  'WSGC-B': { label: 'WSGC-B — Important', className: 'bg-warning/15 text-warning border-warning/30' },
  'WSGC-C': { label: 'WSGC-C — Sustainment', className: 'bg-primary/15 text-primary border-primary/30' },
};

export function PlatformDrawer({ platform, data, onClose }: PlatformDrawerProps) {
  const platformInfo = platforms.find(p => p.name === platform);
  const platformData = useMemo(() => data.filter(d => d.platform === platform), [data, platform]);

  const samTalkingPoints = useMemo(() => {
    const oemMap = new Map<string, NSNRecord[]>();
    for (const r of platformData) {
      if (!oemMap.has(r.oem)) oemMap.set(r.oem, []);
      oemMap.get(r.oem)!.push(r);
    }
    return Array.from(oemMap.entries())
      .map(([oem, records]) => ({
        oem,
        count: records.length,
        totalAdv: records.reduce((s, r) => s + r.adv, 0),
        topParts: [...records].sort((a, b) => b.adv - a.adv).slice(0, 3),
      }))
      .sort((a, b) => b.totalAdv - a.totalAdv)
      .slice(0, 3);
  }, [platformData]);

  if (!platform) return null;

  const tier = platformInfo?.tier || 'WSGC-C';
  const tierInfo = tierLabels[tier];

  return (
    <div className="fixed inset-y-0 right-0 w-[520px] bg-card border-l border-border shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">{platform}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{platformInfo?.category || 'Unknown Category'}</p>
          <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded border ${tierInfo.className}`}>
            {tierInfo.label}
          </span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* NSN Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
            No-Bid NSNs ({platformData.length})
          </h3>
          <div className="border border-border rounded overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">NSN</th>
                  <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">Nomenclature</th>
                  <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">Subsystem</th>
                  <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">OEM</th>
                  <th className="text-right px-2 py-1.5 font-medium text-muted-foreground">ADV</th>
                  <th className="text-center px-2 py-1.5 font-medium text-muted-foreground">SS</th>
                </tr>
              </thead>
              <tbody>
                {platformData.slice(0, 50).map((r, i) => (
                  <tr key={r.nsn} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                    <td className="px-2 py-1 font-mono text-[10px]">{r.nsn}</td>
                    <td className="px-2 py-1 truncate max-w-[100px]">{r.nomenclature}</td>
                    <td className="px-2 py-1 truncate max-w-[70px]">{r.subsystem}</td>
                    <td className="px-2 py-1 truncate max-w-[80px]">{r.oem}</td>
                    <td className="px-2 py-1 text-right font-mono">${(r.adv / 1000).toFixed(1)}K</td>
                    <td className="px-2 py-1 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${r.soleSource ? 'bg-sole' : 'bg-competitive'}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {platformData.length > 50 && (
              <div className="px-2 py-1.5 text-[10px] text-muted-foreground bg-muted text-center">
                Showing 50 of {platformData.length} NSNs
              </div>
            )}
          </div>
        </div>

        {/* SAM Talking Points */}
        <div className="p-4 border-t border-border">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
            SAM Talking Points
          </h3>
          <div className="space-y-3">
            {samTalkingPoints.map(tp => (
              <div key={tp.oem} className="bg-muted/50 rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">{tp.oem}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {tp.count} NSNs · ${(tp.totalAdv / 1000).toFixed(0)}K ADV
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1.5">
                  <span className="font-medium">Top parts:</span>
                  {tp.topParts.map((p, i) => (
                    <span key={p.nsn}>{i > 0 ? ', ' : ' '}{p.nomenclature} (${(p.adv / 1000).toFixed(1)}K)</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
