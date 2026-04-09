import { AlertTriangle, DollarSign, Layers, Shield } from 'lucide-react';

interface KPICardsProps {
  totalNSNs: number;
  soleSourcePct: number;
  totalAdv: number;
  platformCount: number;
}

export function KPICards({ totalNSNs, soleSourcePct, totalAdv, platformCount }: KPICardsProps) {
  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val}`;
  };

  const cards = [
    { label: 'Open No-Bid NSNs', value: totalNSNs.toLocaleString(), icon: Layers, accent: 'text-primary' },
    { label: '% Sole Source', value: `${soleSourcePct.toFixed(1)}%`, icon: AlertTriangle, accent: 'text-sole' },
    { label: 'Annual Demand Value at Risk', value: formatCurrency(totalAdv), icon: DollarSign, accent: 'text-warning' },
    { label: 'Platforms Affected', value: platformCount.toString(), icon: Shield, accent: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card border border-kpi-border rounded-md p-4 flex items-start gap-3"
        >
          <div className={`mt-0.5 ${card.accent}`}>
            <card.icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-kpi-value font-mono">{card.value}</div>
            <div className="text-xs text-kpi-label uppercase tracking-wide mt-0.5">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
