import { ReactNode } from 'react';

interface FscOverlap {
  code: string;
  description: string;
  approvals: number;
}

interface PlatformQuadChartProps {
  platformName?: string;
  totalNoBidNSNs?: number;
  wsgcA?: number;
  soleSource?: number;
  avgDaysOutstanding?: number;
  strongNoBidSignal?: number;
  competitive?: number;
  sarPath?: number;
  blocked?: number;
  review?: number;
  fscOverlaps?: FscOverlap[];
  hunting?: string[];
  farming?: string[];
}

const defaults: Required<PlatformQuadChartProps> = {
  platformName: 'F/A-18 Hornet',
  totalNoBidNSNs: 346,
  wsgcA: 265,
  soleSource: 218,
  avgDaysOutstanding: 187,
  strongNoBidSignal: 43,
  competitive: 29,
  sarPath: 187,
  blocked: 52,
  review: 78,
  fscOverlaps: [
    { code: '3110', description: 'Bearings', approvals: 12 },
    { code: '5306', description: 'Bolts', approvals: 8 },
    { code: '2840', description: 'Turbine Engine Components', approvals: 5 },
    { code: '5330', description: 'Seals', approvals: 11 },
  ],
  hunting: [
    'Competitive bids above $75K',
    'SAR submissions for 3C/3D parts',
    'Platform-specific approval expansion',
  ],
  farming: [
    'Expand existing SAR approvals to adjacent FSC codes',
    'Monitor solicitation recurrence',
    'Support equipment identification',
  ],
};

interface QuadrantProps {
  title: string;
  subtitle?: string;
  accentClass: string;
  children: ReactNode;
}

function Quadrant({ title, subtitle, accentClass, children }: QuadrantProps) {
  return (
    <div className={`relative bg-card p-6 border-l-4 ${accentClass} flex flex-col min-h-0`}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground tracking-tight uppercase">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

interface BarRowProps {
  label: string;
  codes: string;
  count: number;
  max: number;
  colorClass: string;
}

function BarRow({ label, codes, count, max, colorClass }: BarRowProps) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-foreground">{label}</span>
          <span className="text-muted-foreground font-mono">{codes}</span>
        </div>
        <span className="font-mono font-semibold text-foreground">{count} NSNs</span>
      </div>
      <div className="h-2.5 bg-muted rounded-sm overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="bg-muted/40 border border-border rounded-sm p-3">
      <div className={`text-2xl font-bold font-mono ${accent ?? 'text-foreground'}`}>
        {value.toLocaleString()}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1 leading-tight">
        {label}
      </div>
    </div>
  );
}

export default function PlatformQuadChart(props: PlatformQuadChartProps) {
  const p = { ...defaults, ...props };
  const maxBar = Math.max(p.competitive, p.sarPath, p.blocked, p.review);
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Header */}
      <header className="bg-navy text-navy-foreground-active px-6 py-3 flex items-center justify-between border-b border-sidebar-border">
        <div>
          <h1 className="text-lg font-bold tracking-tight">No-Bid Platform Intelligence</h1>
          <p className="text-xs text-navy-foreground">Quad Chart Brief</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-sidebar-border rounded-sm">
          <div className="h-6 w-6 bg-primary-foreground/10 rounded-sm flex items-center justify-center text-[10px] font-bold">
            PLI
          </div>
          <span className="text-xs font-semibold tracking-wide">PARTS LIFE INC.</span>
        </div>
      </header>

      {/* Quad Chart */}
      <main className="flex-1 p-4 lg:p-6">
        <div className="relative h-full max-w-[1600px] mx-auto bg-border grid grid-cols-2 grid-rows-2 gap-px aspect-[16/9]">
          {/* TL — Acquisition Pathway */}
          <Quadrant title="Acquisition Pathway" accentClass="border-l-primary">
            <div className="space-y-3">
              <BarRow
                label="Competitive"
                codes="1G / 2G"
                count={p.competitive}
                max={maxBar}
                colorClass="bg-competitive"
              />
              <BarRow
                label="SAR Path"
                codes="3C / 3D / 3Q"
                count={p.sarPath}
                max={maxBar}
                colorClass="bg-warning"
              />
              <BarRow
                label="Blocked"
                codes="3P / 3S / 3V"
                count={p.blocked}
                max={maxBar}
                colorClass="bg-sole-source"
              />
              <BarRow
                label="Review"
                codes="3B / 3R / 3M"
                count={p.review}
                max={maxBar}
                colorClass="bg-orange-500"
              />
            </div>
          </Quadrant>

          {/* TR — No-Bid Intelligence */}
          <Quadrant title="No-Bid Intelligence" accentClass="border-l-warning">
            <div className="grid grid-cols-2 gap-2">
              <Metric label="Total No-Bid NSNs" value={p.totalNoBidNSNs} />
              <Metric label="WSGC-A Critical to Fight" value={p.wsgcA} accent="text-sole-source" />
              <Metric label="Sole Source" value={p.soleSource} accent="text-sole-source" />
              <Metric label="Avg Days Outstanding" value={p.avgDaysOutstanding} />
              <Metric
                label="Strong No-Bid Signal (90+ days, 2+ sols)"
                value={p.strongNoBidSignal}
                accent="text-warning"
              />
            </div>
          </Quadrant>

          {/* BL — Past Performance */}
          <Quadrant
            title="Past Performance"
            subtitle="Parts Life Inc. Approved SARs — Same FSC Categories"
            accentClass="border-l-competitive"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wide text-muted-foreground border-b border-border">
                  <th className="text-left font-semibold py-2">FSC</th>
                  <th className="text-left font-semibold py-2">Description</th>
                  <th className="text-right font-semibold py-2">Approvals</th>
                </tr>
              </thead>
              <tbody>
                {p.fscOverlaps.map((row) => (
                  <tr key={row.code} className="border-b border-border/50">
                    <td className="py-2 font-mono font-semibold text-primary">{row.code}</td>
                    <td className="py-2 text-foreground">{row.description}</td>
                    <td className="py-2 text-right font-mono font-bold text-foreground">
                      {row.approvals}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Quadrant>

          {/* BR — Strategy */}
          <Quadrant
            title="Our Strategy"
            subtitle="Hunting & Farming Approach"
            accentClass="border-l-orange-500"
          >
            <div className="grid grid-cols-2 gap-4 h-full">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-2 pb-1 border-b border-orange-500/30">
                  Hunting
                </div>
                <p className="text-[10px] text-muted-foreground mb-2 italic">New opportunities</p>
                <ul className="space-y-1.5 text-xs text-foreground">
                  {p.hunting.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-orange-500 font-bold">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-competitive mb-2 pb-1 border-b border-competitive/30">
                  Farming
                </div>
                <p className="text-[10px] text-muted-foreground mb-2 italic">
                  Existing relationships
                </p>
                <ul className="space-y-1.5 text-xs text-foreground">
                  {p.farming.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-competitive font-bold">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Quadrant>

          {/* Center Label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="bg-navy text-navy-foreground-active rounded-full h-32 w-32 lg:h-40 lg:w-40 flex flex-col items-center justify-center shadow-2xl border-4 border-background text-center px-3">
              <div className="text-[10px] uppercase tracking-widest text-navy-foreground">
                Platform
              </div>
              <div className="text-sm lg:text-base font-bold leading-tight mt-1">
                {p.platformName}
              </div>
              <div className="mt-2 pt-2 border-t border-sidebar-border w-full">
                <div className="text-xl lg:text-2xl font-bold font-mono">
                  {p.totalNoBidNSNs.toLocaleString()}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-navy-foreground">
                  No-Bid NSNs
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy text-navy-foreground px-6 py-2 flex items-center justify-between text-xs border-t border-sidebar-border">
        <span>Confidential — Parts Life Inc. / Deval Corporation</span>
        <span className="font-mono">{today}</span>
      </footer>
    </div>
  );
}
