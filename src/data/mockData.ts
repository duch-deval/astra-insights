export interface NSNRecord {
  nsn: string;
  nomenclature: string;
  subsystem: string;
  oem: string;
  platform: string;
  platformCategory: string;
  supplyChain: 'Aviation' | 'Land' | 'Maritime';
  adv: number;
  soleSource: boolean;
  criticalityTier: 'WSGC-A' | 'WSGC-B' | 'WSGC-C';
}

export const subsystems = [
  'Airframe Structure', 'Landing Gear', 'Hydraulics', 'Jet Engines',
  'Avionics', 'Fasteners & Hardware', 'Cable & Wire', 'Valves', 'Instruments'
] as const;

export const oems = [
  { name: 'Boeing', totalAdv: 13500000 },
  { name: 'Northrop Grumman', totalAdv: 10700000 },
  { name: 'Sikorsky', totalAdv: 10400000 },
  { name: 'Bell Textron', totalAdv: 6200000 },
  { name: 'L3 Technologies', totalAdv: 5900000 },
  { name: 'Lockheed Martin', totalAdv: 18200000 },
  { name: 'Raytheon', totalAdv: 9800000 },
  { name: 'General Dynamics', totalAdv: 8100000 },
  { name: 'BAE Systems', totalAdv: 7300000 },
  { name: 'Honeywell', totalAdv: 4900000 },
  { name: 'Collins Aerospace', totalAdv: 6700000 },
  { name: 'Curtiss-Wright', totalAdv: 3200000 },
  { name: 'Parker Hannifin', totalAdv: 2800000 },
  { name: 'Moog Inc.', totalAdv: 2400000 },
  { name: 'Ducommun', totalAdv: 1900000 },
];

export const platforms = [
  { name: 'F-16 Fighting Falcon', category: 'Fixed Wing Aircraft', chain: 'Aviation' as const, tier: 'WSGC-A' as const },
  { name: 'F-15 Eagle', category: 'Fixed Wing Aircraft', chain: 'Aviation' as const, tier: 'WSGC-A' as const },
  { name: 'F-35 Lightning II', category: 'Fixed Wing Aircraft', chain: 'Aviation' as const, tier: 'WSGC-A' as const },
  { name: 'B-52 Stratofortress', category: 'Strategic Bomber', chain: 'Aviation' as const, tier: 'WSGC-A' as const },
  { name: 'B-1B Lancer', category: 'Strategic Bomber', chain: 'Aviation' as const, tier: 'WSGC-A' as const },
  { name: 'C-130 Hercules', category: 'Transport Aircraft', chain: 'Aviation' as const, tier: 'WSGC-B' as const },
  { name: 'C-17 Globemaster III', category: 'Transport Aircraft', chain: 'Aviation' as const, tier: 'WSGC-B' as const },
  { name: 'AH-64 Apache', category: 'Rotary Wing Aircraft', chain: 'Aviation' as const, tier: 'WSGC-A' as const },
  { name: 'UH-60 Black Hawk', category: 'Rotary Wing Aircraft', chain: 'Aviation' as const, tier: 'WSGC-B' as const },
  { name: 'CH-47 Chinook', category: 'Rotary Wing Aircraft', chain: 'Aviation' as const, tier: 'WSGC-B' as const },
  { name: 'V-22 Osprey', category: 'Tiltrotor Aircraft', chain: 'Aviation' as const, tier: 'WSGC-A' as const },
  { name: 'KC-135 Stratotanker', category: 'Tanker Aircraft', chain: 'Aviation' as const, tier: 'WSGC-B' as const },
  { name: 'E-3 Sentry', category: 'C4ISR Aircraft', chain: 'Aviation' as const, tier: 'WSGC-B' as const },
  { name: 'MQ-9 Reaper', category: 'Unmanned Aerial System', chain: 'Aviation' as const, tier: 'WSGC-B' as const },
  { name: 'P-8 Poseidon', category: 'Maritime Patrol Aircraft', chain: 'Aviation' as const, tier: 'WSGC-A' as const },
  { name: 'Arleigh Burke DDG', category: 'Guided Missile Destroyer', chain: 'Maritime' as const, tier: 'WSGC-A' as const },
  { name: 'Ticonderoga CG', category: 'Guided Missile Cruiser', chain: 'Maritime' as const, tier: 'WSGC-A' as const },
  { name: 'Virginia SSN', category: 'Nuclear Submarine', chain: 'Maritime' as const, tier: 'WSGC-A' as const },
  { name: 'Nimitz CVN', category: 'Aircraft Carrier', chain: 'Maritime' as const, tier: 'WSGC-A' as const },
  { name: 'San Antonio LPD', category: 'Amphibious Transport Dock', chain: 'Maritime' as const, tier: 'WSGC-B' as const },
  { name: 'Freedom LCS', category: 'Littoral Combat Ship', chain: 'Maritime' as const, tier: 'WSGC-C' as const },
  { name: 'Independence LCS', category: 'Littoral Combat Ship', chain: 'Maritime' as const, tier: 'WSGC-C' as const },
  { name: 'Minuteman III', category: 'ICBM', chain: 'Land' as const, tier: 'WSGC-A' as const },
  { name: 'M1A2 Abrams', category: 'Main Battle Tank', chain: 'Land' as const, tier: 'WSGC-A' as const },
  { name: 'M2 Bradley', category: 'Infantry Fighting Vehicle', chain: 'Land' as const, tier: 'WSGC-A' as const },
  { name: 'Stryker', category: 'Armored Fighting Vehicle', chain: 'Land' as const, tier: 'WSGC-B' as const },
  { name: 'HIMARS', category: 'Rocket Artillery', chain: 'Land' as const, tier: 'WSGC-A' as const },
  { name: 'Patriot PAC-3', category: 'Air Defense System', chain: 'Land' as const, tier: 'WSGC-A' as const },
  { name: 'THAAD', category: 'Missile Defense System', chain: 'Land' as const, tier: 'WSGC-A' as const },
  { name: 'M109 Paladin', category: 'Self-Propelled Howitzer', chain: 'Land' as const, tier: 'WSGC-B' as const },
  { name: 'JLTV', category: 'Light Tactical Vehicle', chain: 'Land' as const, tier: 'WSGC-C' as const },
  { name: 'M-ATV', category: 'MRAP Vehicle', chain: 'Land' as const, tier: 'WSGC-C' as const },
];

const nomenclatures: Record<string, string[]> = {
  'Airframe Structure': ['Fuselage Panel Assy', 'Wing Skin Segment', 'Bulkhead Frame', 'Canopy Seal', 'Radome Housing', 'Vertical Stabilizer Rib', 'Dorsal Fin Panel', 'Access Door Assy'],
  'Landing Gear': ['Main Gear Strut', 'Nose Gear Actuator', 'Wheel Bearing Assy', 'Brake Disc', 'Torque Link', 'Shimmy Damper', 'Retract Cylinder', 'Drag Brace'],
  'Hydraulics': ['Hydraulic Pump Assy', 'Servo Valve', 'Pressure Accumulator', 'Filter Element', 'Reservoir Tank', 'Flow Control Valve', 'Relief Valve', 'Manifold Block'],
  'Jet Engines': ['Turbine Blade Set', 'Combustor Liner', 'Fuel Nozzle Assy', 'Compressor Stator', 'Exhaust Nozzle Ring', 'Afterburner Duct', 'Igniter Plug', 'Oil Cooler'],
  'Avionics': ['Radar Processor Unit', 'GPS Receiver Module', 'Display Controller', 'Signal Processor Card', 'Antenna Coupler', 'IFF Transponder', 'HUD Combiner Glass', 'Data Bus Controller'],
  'Fasteners & Hardware': ['Hi-Lok Fastener Kit', 'Titanium Bolt Set', 'Structural Rivet Kit', 'Lock Wire Spool', 'Self-Sealing Nut Plate', 'Clamp Assembly', 'Shear Pin Set', 'Retaining Ring Kit'],
  'Cable & Wire': ['Wiring Harness Assy', 'Coaxial Cable Seg', 'Fiber Optic Bundle', 'Connector Shell', 'Terminal Block', 'EMI Shield Braid', 'Cannon Plug Assy', 'Wire Bundle Clamp'],
  'Valves': ['Check Valve Assy', 'Solenoid Valve', 'Bleed Air Valve', 'Fuel Shutoff Valve', 'Pneumatic Regulator', 'Butterfly Valve', 'Priority Valve', 'Sequence Valve'],
  'Instruments': ['Pressure Gauge', 'Temperature Sensor', 'Tachometer Generator', 'Altimeter Module', 'Airspeed Indicator', 'Fuel Quantity Probe', 'Torque Indicator', 'Vibration Sensor'],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateNSN(rand: () => number): string {
  const fsg = String(Math.floor(rand() * 90 + 10));
  const country = '00';
  const seq = String(Math.floor(rand() * 900000 + 100000));
  const check = String(Math.floor(rand() * 9000 + 1000));
  return `${fsg}${country}-${seq}-${check}`;
}

export function generateMockData(): NSNRecord[] {
  const rand = seededRandom(42);
  const records: NSNRecord[] = [];

  for (const platform of platforms) {
    const nsnCount = Math.floor(rand() * 280 + 40);
    const primaryOems = oems.filter(() => rand() > 0.5).slice(0, 4);
    if (primaryOems.length === 0) primaryOems.push(oems[0]);

    for (let i = 0; i < nsnCount; i++) {
      const subsystem = subsystems[Math.floor(rand() * subsystems.length)];
      const oem = primaryOems[Math.floor(rand() * primaryOems.length)];
      const noms = nomenclatures[subsystem];
      const nomenclature = noms[Math.floor(rand() * noms.length)];
      const soleSource = rand() < 0.904;
      const adv = Math.floor(rand() * 85000 + 1500);

      records.push({
        nsn: generateNSN(rand),
        nomenclature,
        subsystem,
        oem: oem.name,
        platform: platform.name,
        platformCategory: platform.category,
        supplyChain: platform.chain,
        adv,
        soleSource,
        criticalityTier: platform.tier,
      });
    }
  }

  return records;
}

export const mockData = generateMockData();

export function getKPIs(data: NSNRecord[]) {
  const total = data.length;
  const soleSourceCount = data.filter(d => d.soleSource).length;
  const totalAdv = data.reduce((s, d) => s + d.adv, 0);
  const platformCount = new Set(data.map(d => d.platform)).size;
  return {
    totalNSNs: total,
    soleSourcePct: total > 0 ? (soleSourceCount / total * 100) : 0,
    totalAdv,
    platformCount,
  };
}
