import { Search } from 'lucide-react';
import { oems } from '@/data/mockData';

export type SupplyChainFilter = 'All' | 'Aviation' | 'Land' | 'Maritime';
export type SoleSourceFilter = 'All' | 'Sole Source' | 'Competitive';
export type CriticalityFilter = 'All' | 'WSGC-A';

interface FilterSidebarProps {
  supplyChain: SupplyChainFilter;
  setSupplyChain: (v: SupplyChainFilter) => void;
  soleSourceFilter: SoleSourceFilter;
  setSoleSourceFilter: (v: SoleSourceFilter) => void;
  criticalityFilter: CriticalityFilter;
  setCriticalityFilter: (v: CriticalityFilter) => void;
  selectedOems: string[];
  setSelectedOems: (v: string[]) => void;
  platformSearch: string;
  setPlatformSearch: (v: string) => void;
}

export function FilterSidebar({
  supplyChain, setSupplyChain,
  soleSourceFilter, setSoleSourceFilter,
  criticalityFilter, setCriticalityFilter,
  selectedOems, setSelectedOems,
  platformSearch, setPlatformSearch,
}: FilterSidebarProps) {
  const chainOptions: SupplyChainFilter[] = ['All', 'Aviation', 'Land', 'Maritime'];
  const soleOptions: SoleSourceFilter[] = ['All', 'Sole Source', 'Competitive'];
  const critOptions: { value: CriticalityFilter; label: string }[] = [
    { value: 'All', label: 'All Tiers' },
    { value: 'WSGC-A', label: 'Critical (WSGC-A) Only' },
  ];

  const toggleOem = (name: string) => {
    setSelectedOems(
      selectedOems.includes(name)
        ? selectedOems.filter(o => o !== name)
        : [...selectedOems, name]
    );
  };

  return (
    <aside className="w-56 min-h-screen bg-navy text-navy-foreground flex flex-col shrink-0">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-sm font-bold text-navy-foreground-active tracking-wider uppercase">Astra</h1>
        <p className="text-[10px] text-navy-foreground mt-0.5 uppercase tracking-widest">NSN No-Bid Tracker</p>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto text-xs">
        {/* Supply Chain */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-navy-foreground mb-2 block font-medium">Supply Chain</label>
          <div className="space-y-1">
            {chainOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setSupplyChain(opt)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                  supplyChain === opt
                    ? 'bg-sidebar-accent text-navy-foreground-active'
                    : 'hover:bg-sidebar-accent/50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Sole Source */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-navy-foreground mb-2 block font-medium">Source Type</label>
          <div className="space-y-1">
            {soleOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setSoleSourceFilter(opt)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                  soleSourceFilter === opt
                    ? 'bg-sidebar-accent text-navy-foreground-active'
                    : 'hover:bg-sidebar-accent/50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Criticality */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-navy-foreground mb-2 block font-medium">Criticality</label>
          <div className="space-y-1">
            {critOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setCriticalityFilter(opt.value)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                  criticalityFilter === opt.value
                    ? 'bg-sidebar-accent text-navy-foreground-active'
                    : 'hover:bg-sidebar-accent/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* OEM Multi-select */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-navy-foreground mb-2 block font-medium">
            OEMs {selectedOems.length > 0 && `(${selectedOems.length})`}
          </label>
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {oems.map(oem => (
              <label key={oem.name} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-sidebar-accent/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOems.includes(oem.name)}
                  onChange={() => toggleOem(oem.name)}
                  className="rounded border-sidebar-border bg-transparent h-3 w-3 accent-primary"
                />
                <span className="text-xs truncate">{oem.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Platform Search */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-navy-foreground mb-2 block font-medium">Platform Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-navy-foreground" />
            <input
              type="text"
              value={platformSearch}
              onChange={(e) => setPlatformSearch(e.target.value)}
              placeholder="e.g. F-16, Abrams..."
              className="w-full bg-sidebar-accent border border-sidebar-border rounded pl-7 pr-2 py-1.5 text-xs text-navy-foreground-active placeholder:text-navy-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-[9px] text-navy-foreground/50 uppercase">DLA No-Bid Monthly Feed</p>
        <p className="text-[9px] text-navy-foreground/50">Last Updated: Mar 2026</p>
      </div>
    </aside>
  );
}
