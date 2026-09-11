export interface HsnSacItem {
  code: string;
  description: string;
  type: 'GOODS' | 'SERVICES';
}

export const HSN_SAC_CATALOG: HsnSacItem[] = [
  // Services (SAC - chapter 99)
  {
    code: '998311',
    description: 'Management consulting and management services including corporate governance, strategy and operational advice',
    type: 'SERVICES'
  },
  {
    code: '998313',
    description: 'Information technology (IT) consulting and support services',
    type: 'SERVICES'
  },
  {
    code: '998314',
    description: 'Information technology (IT) design and development services for applications and web platforms',
    type: 'SERVICES'
  },
  {
    code: '998315',
    description: 'Hosting and information technology (IT) infrastructure provisioning services',
    type: 'SERVICES'
  },
  {
    code: '998221',
    description: 'Financial auditing and accounting services, tax consultancy',
    type: 'SERVICES'
  },
  {
    code: '998399',
    description: 'Other professional, scientific and technical services n.e.c.',
    type: 'SERVICES'
  },
  {
    code: '998599',
    description: 'Other business support services n.e.c.',
    type: 'SERVICES'
  },
  {
    code: '997212',
    description: 'Rental or leasing services involving own or leased non-residential property',
    type: 'SERVICES'
  },
  // Goods (HSN - 2 to 6 digits)
  {
    code: '847130',
    description: 'Portable automatic data processing machines, weighing not more than 10 kg, consisting of at least a CPU, keyboard and display',
    type: 'GOODS'
  },
  {
    code: '847141',
    description: 'Other automatic data processing machines comprising in the same housing at least a CPU and an input and output unit',
    type: 'GOODS'
  },
  {
    code: '851713',
    description: 'Smartphones and wireless telecommunication terminals',
    type: 'GOODS'
  },
  {
    code: '851762',
    description: 'Machines for the reception, conversion and transmission or regeneration of voice, images or other data',
    type: 'GOODS'
  },
  {
    code: '850440',
    description: 'Static converters (e.g. UPS, inverters, power supply units)',
    type: 'GOODS'
  },
  {
    code: '480255',
    description: 'Uncoated paper and paperboard, of a kind used for writing, printing or other graphic purposes',
    type: 'GOODS'
  },
  {
    code: '940310',
    description: 'Metal furniture of a kind used in offices',
    type: 'GOODS'
  }
];

export function searchHsnSac(query: string, filterType?: 'GOODS' | 'SERVICES'): HsnSacItem[] {
  const clean = query.trim().toLowerCase();
  return HSN_SAC_CATALOG.filter(item => {
    if (filterType && item.type !== filterType) return false;
    if (!clean) return true;
    return item.code.includes(clean) || item.description.toLowerCase().includes(clean);
  });
}
