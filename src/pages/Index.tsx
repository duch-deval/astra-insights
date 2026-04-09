import { useState, useMemo } from 'react';
import { mockData, getKPIs } from '@/data/mockData';
import { KPICards } from '@/components/dashboard/KPICards';
import { FilterSidebar, SupplyChainFilter, SoleSourceFilter, CriticalityFilter } from '@/components/dashboard/FilterSidebar';
import { HeatmapMatrix } from '@/components/dashboard/HeatmapMatrix';
import { PlatformDrawer } from '@/components/dashboard/PlatformDrawer';

export default function Index() {
  const [supplyChain, setSupplyChain] = useState<SupplyChainFilter>('All');
  const [soleSourceFilter, setSoleSourceFilter] = useState<SoleSourceFilter>('All');
  const [criticalityFilter, setCriticalityFilter] = useState<CriticalityFilter>('All');
  const [selectedOems, setSelectedOems] = useState<string[]>([]);
  const [platformSearch, setPlatformSearch] = useState('');
  const [selectedCell, setSelectedCell] = useState<{ platform: string; subsystem: string } | null>(null);

  const filteredData = useMemo(() => {
    let d = mockData;
    if (supplyChain !== 'All') d = d.filter(r => r.supplyChain === supplyChain);
    if (soleSourceFilter === 'Sole Source') d = d.filter(r => r.soleSource);
    if (soleSourceFilter === 'Competitive') d = d.filter(r => !r.soleSource);
    if (criticalityFilter === 'WSGC-A') d = d.filter(r => r.criticalityTier === 'WSGC-A');
    if (selectedOems.length > 0) d = d.filter(r => selectedOems.includes(r.oem));
    if (platformSearch) {
      const q = platformSearch.toLowerCase();
      d = d.filter(r => r.platform.toLowerCase().includes(q));
    }
    return d;
  }, [supplyChain, soleSourceFilter, criticalityFilter, selectedOems, platformSearch]);

  const kpis = useMemo(() => getKPIs(filteredData), [filteredData]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <FilterSidebar
        supplyChain={supplyChain}
        setSupplyChain={setSupplyChain}
        soleSourceFilter={soleSourceFilter}
        setSoleSourceFilter={setSoleSourceFilter}
        criticalityFilter={criticalityFilter}
        setCriticalityFilter={setCriticalityFilter}
        selectedOems={selectedOems}
        setSelectedOems={setSelectedOems}
        platformSearch={platformSearch}
        setPlatformSearch={setPlatformSearch}
      />

      <main className="flex-1 min-w-0 p-6 space-y-5">
        <div>
          <h1 className="text-lg font-bold text-foreground">No-Bid NSN Intelligence Dashboard</h1>
          <p className="text-xs text-muted-foreground">DLA Monthly Solicitation Analysis · Platform × Subsystem Heat Map</p>
        </div>

        <KPICards {...kpis} />

        <HeatmapMatrix
          data={filteredData}
          onCellClick={(platform, subsystem) => setSelectedCell({ platform, subsystem })}
        />
      </main>

      {selectedCell && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 z-40"
            onClick={() => setSelectedCell(null)}
          />
          <PlatformDrawer
            platform={selectedCell.platform}
            subsystem={selectedCell.subsystem}
            data={filteredData}
            onClose={() => setSelectedCell(null)}
          />
        </>
      )}
    </div>
  );
}
