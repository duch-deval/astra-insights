import { useState, useMemo } from 'react';
import { mockData, getKPIs } from '@/data/mockData';
import { KPICards } from '@/components/dashboard/KPICards';
import { FilterSidebar, SupplyChainFilter, SoleSourceFilter } from '@/components/dashboard/FilterSidebar';
import { TreemapChart, ViewMode } from '@/components/dashboard/TreemapChart';
import { PlatformDrawer } from '@/components/dashboard/PlatformDrawer';

const viewLabels: { key: ViewMode; label: string }[] = [
  { key: 'platform', label: 'Platform View' },
  { key: 'subsystem', label: 'Subsystem View' },
  { key: 'oem', label: 'OEM / Prime Strategy' },
];

export default function Index() {
  const [supplyChain, setSupplyChain] = useState<SupplyChainFilter>('All');
  const [soleSourceFilter, setSoleSourceFilter] = useState<SoleSourceFilter>('All');
  const [selectedOems, setSelectedOems] = useState<string[]>([]);
  const [platformSearch, setPlatformSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    let d = mockData;
    if (supplyChain !== 'All') d = d.filter(r => r.supplyChain === supplyChain);
    if (soleSourceFilter === 'Sole Source') d = d.filter(r => r.soleSource);
    if (soleSourceFilter === 'Competitive') d = d.filter(r => !r.soleSource);
    if (selectedOems.length > 0) d = d.filter(r => selectedOems.includes(r.oem));
    if (platformSearch) {
      const q = platformSearch.toLowerCase();
      d = d.filter(r => r.platform.toLowerCase().includes(q));
    }
    return d;
  }, [supplyChain, soleSourceFilter, selectedOems, platformSearch]);

  const kpis = useMemo(() => getKPIs(filteredData), [filteredData]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <FilterSidebar
        supplyChain={supplyChain}
        setSupplyChain={setSupplyChain}
        soleSourceFilter={soleSourceFilter}
        setSoleSourceFilter={setSoleSourceFilter}
        selectedOems={selectedOems}
        setSelectedOems={setSelectedOems}
        platformSearch={platformSearch}
        setPlatformSearch={setPlatformSearch}
      />

      <main className="flex-1 min-w-0 p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">No-Bid NSN Intelligence Dashboard</h1>
            <p className="text-xs text-muted-foreground">DLA Monthly Solicitation Analysis · Defense Logistics Intelligence</p>
          </div>
          <div className="flex items-center bg-muted rounded-md p-0.5">
            {viewLabels.map(v => (
              <button
                key={v.key}
                onClick={() => setViewMode(v.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  viewMode === v.key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <KPICards {...kpis} />

        {/* Treemap */}
        <TreemapChart
          data={filteredData}
          viewMode={viewMode}
          onPlatformClick={setSelectedPlatform}
        />
      </main>

      {/* Platform Drawer */}
      {selectedPlatform && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 z-40"
            onClick={() => setSelectedPlatform(null)}
          />
          <PlatformDrawer
            platform={selectedPlatform}
            data={filteredData}
            onClose={() => setSelectedPlatform(null)}
          />
        </>
      )}
    </div>
  );
}
