
import { Product, Factory, Job, User, Shipment, Customer, SampleRequest, Supplier } from '../../types';

// Add missing exports for categories and translations
export const TOP_30_CATEGORIES = [
  'Apparel',
  'Electronics',
  'Beauty',
  'Home Decor',
  'Kitchenware',
  'Footwear',
  'Accessories',
  'Toys',
  'Sporting Goods',
  'Industrial',
  'Packaging',
  'Textiles',
  'Cups',
  'Furniture',
  'Pet Supplies'
];

export const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Apparel': { en: 'Apparel', 'zh-Hans': '服装', 'zh-Hant': '服裝' },
  'Electronics': { en: 'Electronics', 'zh-Hans': '电子产品', 'zh-Hant': '電子產品' },
  'Beauty': { en: 'Beauty', 'zh-Hans': '美妆', 'zh-Hant': '美妝' },
  'Home Decor': { en: 'Home Decor', 'zh-Hans': '家居装饰', 'zh-Hant': '家居裝飾' },
  'Kitchenware': { en: 'Kitchenware', 'zh-Hans': '厨具', 'zh-Hant': '廚具' },
  'Footwear': { en: 'Footwear', 'zh-Hans': '鞋类', 'zh-Hant': '鞋類' },
  'Accessories': { en: 'Accessories', 'zh-Hans': '配饰', 'zh-Hant': '配飾' },
  'Cups': { en: 'Cups', 'zh-Hans': '杯具', 'zh-Hant': '杯具' },
  'Packaging': { en: 'Packaging', 'zh-Hans': '包装', 'zh-Hant': '包裝' }
};

export const generateMockScorecard = (
  id: string, 
  name: string, 
  sector: string, 
  country: string, 
  grade: 'A' | 'B' | 'C' | 'D'
): Supplier => {
  const scores = {
    A: { quality: 98, delivery: 96, cost: 92 },
    B: { quality: 88, delivery: 85, cost: 80 },
    C: { quality: 78, delivery: 75, cost: 70 },
    D: { quality: 65, delivery: 60, cost: 55 },
  };

  const currentScore = scores[grade];

  return {
    id,
    name,
    sector,
    country,
    overallGrade: grade,
    lastAuditDate: '2025-02-15',
    certifications: ['ISO9001', 'SA8000', 'GRS'],
    metrics: [
      { id: 'm1', label: 'Quality Acceptance Rate', value: `${currentScore.quality}%`, score: currentScore.quality, trend: 'up', isPrivate: false },
      { id: 'm2', label: 'On-Time Delivery (OTD)', value: `${currentScore.delivery}%`, score: currentScore.delivery, trend: grade === 'D' ? 'down' : 'neutral', isPrivate: false },
      { id: 'm3', label: 'Cost Variance', value: grade === 'A' ? '-2.4%' : '+1.5%', score: currentScore.cost, trend: grade === 'A' ? 'up' : 'down', isPrivate: true },
      { id: 'm4', label: 'Social Compliance', value: 'Pass', score: 100, trend: 'neutral', isPrivate: false },
    ]
  };
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'PROD-STAN-001',
    name: 'Stanley Ice Flow 2.0',
    brand: 'Stanley',
    category: 'Cups',
    // Added missing 'sku' property
    sku: 'ICE-FLOW-2.0',
    image: 'https://uk.stanley1913.com/cdn/shop/files/Web_PNG_Square-2025-10-07_TheIceFlow_FlipStraw2.0Tumbler30OZ-BlueSky-Front.png?v=1767114959&width=1515',
    hsCode: '6109.10.00',
    status: 'Production',
    material: 'Stainless Steel, Plastic',
    construction: 'Silverescent™ technology to reduce odor, seamless construction to prevent chafing.',
    moq: 1000,
    dimensions: { lengthCm: 25, widthCm: 20, heightCm: 2, weightKg: 0.18 },
    costVariables: { materials: 8.50, labor: 4.20, packaging: 0.80, overhead: 1.50, logistics: 2.10, inspection: 0.50, production: 0, exportInternal: 0, exportExternal: 0, shipping: 0, design: 0 },
    skus: [{ code: 'LULU-PRT-BLK-M', size: 'M', prices: { USA: 68.00 } }, { code: 'LULU-PRT-BLK-L', size: 'L', prices: { USA: 45.00 } }],
    cadLink: 'https://specs.usuppli.com/lulu/LM3GGHS-3D.obj'
  },
  {
    id: 'PROD-TOC-002',
    name: 'Classic Racerback Bra',
    brand: 'Toccara',
    category: 'Apparel',
    // Added missing 'sku' property
    sku: 'RACERBACK-BRA',
    image: 'https://www.iamtoccara.com/cdn/shop/products/B0000082.jpg?v=1606785700',
    hsCode: '6212.10.00',
    status: 'Sampling',
    material: 'High-Compression Nylon Blend',
    construction: 'Double-layered front panel with reinforced racerback straps for high-impact support.',
    moq: 500,
    dimensions: { lengthCm: 15, widthCm: 15, heightCm: 3, weightKg: 0.12 },
    costVariables: { materials: 12.00, labor: 6.50, packaging: 1.20, overhead: 2.00, logistics: 1.50, inspection: 0.75, production: 0, exportInternal: 0, exportExternal: 0, shipping: 0, design: 0 },
    skus: [{ code: 'TOC-CRB-NAV-S', size: 'S', prices: { USA: 45.00 } }, { code: 'TOC-CRB-NAV-M', size: 'M', prices: { USA: 45.00 } }],
    cadLink: 'https://specs.usuppli.com/toccara/B0000082-TECH.pdf'
  }
];

export const MOCK_FACTORIES: Factory[] = [
  { 
    id: 'f1', 
    name: 'Shenzhen Tech Mfg', 
    location: 'Shenzhen, China', 
    country: 'China',
    contactPerson: 'John Wu',
    contactEmail: 'john@shenzhentech.com',
    contact: 'John Wu', 
    phone: '+86 755 1234 5678', 
    rating: 5, 
    capabilities: ['PCB Assembly', 'Plastic Molding'], 
    moq: 1000, 
    capacity: 50000, 
    source: 'Alibaba',
    scorecardData: generateMockScorecard('f1', 'Shenzhen Tech Mfg', 'Electronics', 'China', 'A')
  },
  { 
    id: 'f2', 
    name: 'Vietnam Textiles Co', 
    location: 'Ho Chi Minh, Vietnam', 
    country: 'Vietnam',
    contactPerson: 'Sarah Le',
    contactEmail: 'sarah.le@vietnamtextiles.vn',
    contact: 'Sarah Le', 
    phone: '+84 28 9876 5432', 
    rating: 4, 
    capabilities: ['Cut & Sew', 'Embroidery'], 
    moq: 500, 
    capacity: 20000, 
    source: 'Referral',
    scorecardData: generateMockScorecard('f2', 'Vietnam Textiles Co', 'Textiles', 'Vietnam', 'B')
  },
  {
    id: 'f3',
    name: 'Shijiazhuang Tianquan Textile Co., Ltd',
    location: 'Hebei, China',
    country: 'China',
    contactPerson: 'Li Ming',
    contactEmail: 'li.ming@tianquan.cn',
    contact: 'Li Ming',
    phone: '+86 311 8888 9999',
    rating: 4,
    capabilities: ['Fabric'],
    mainCategory: 'Textiles',
    status: 'Active',
    moq: 2000,
    source: 'Trade Show',
    scorecardData: generateMockScorecard('f3', 'Shijiazhuang Tianquan Textile Co., Ltd', 'Textiles', 'China', 'B')
  },
  {
    id: 'f4',
    name: 'Shantou Chao Jin Sheng Clothing Co., Ltd.',
    location: 'Guangdong, China',
    country: 'China',
    contactPerson: 'Chen Wei',
    contactEmail: 'chen.wei@chaojinsheng.com',
    contact: 'Chen Wei',
    phone: '+86 754 8888 7777',
    rating: 5,
    capabilities: ['T-Shirts'],
    mainCategory: 'Apparel',
    status: 'Active',
    moq: 1000,
    source: 'Internet',
    scorecardData: generateMockScorecard('f4', 'Shantou Chao Jin Sheng Clothing Co., Ltd.', 'Apparel', 'China', 'A')
  },
  {
    id: 'f5',
    name: 'Foshan Gumaoning Garment Co., Ltd',
    location: 'Guangdong, China',
    country: 'China',
    contactPerson: 'Zhuang Xia',
    contactEmail: 'zhuang.xia@gumaoning.cn',
    contact: 'Zhuang Xia',
    phone: '+86 757 6666 5555',
    rating: 3,
    capabilities: ['Yoga', 'T-Shirts'],
    mainCategory: 'Apparel',
    status: 'Vetting',
    moq: 500,
    source: 'Alibaba',
    scorecardData: generateMockScorecard('f5', 'Foshan Gumaoning Garment Co., Ltd', 'Apparel', 'China', 'C')
  },
  {
    id: 'f6',
    name: 'Shantou Zhenshangmei Clothing Co., Ltd.',
    location: 'Guangdong, China',
    country: 'China',
    contactPerson: 'Huang Yan',
    contactEmail: 'huang.yan@zhenshangmei.com',
    contact: 'Huang Yan',
    phone: '+86 754 2222 3333',
    rating: 4,
    capabilities: ['Lingerie'],
    mainCategory: 'Apparel',
    status: 'Active',
    moq: 1200,
    source: 'Relationship',
    scorecardData: generateMockScorecard('f6', 'Shantou Zhenshangmei Clothing Co., Ltd.', 'Apparel', 'China', 'B')
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'JOB-2024-001',
    jobName: 'Summer Leggings Run',
    customer: 'Urban Outfitters',
    customerName: 'Urban Outfitters',
    customerId: 'CUST-001',
    factory: 'Shenzhen TexMaster Ltd',
    factoryName: 'Shenzhen TexMaster Ltd',
    factoryId: 'FAC-001',
    sku: 'BEMA-LEG-BLK-S',
    productRefId: 'PROD-STAN-001',
    quantity: 5000,
    status: 'Production',
    productionStage: 'Sewing',
    date: '2024-02-01',
    deliveryDate: '2024-04-15',
    targetDelivery: '2024-04-15',
    completionPercent: 65,
    priority: 'High',
    incoterms: 'FOB',
    shippingMethod: 'Sea',
    destinationAddress: 'Distribution Center, NJ',
    description: 'Main summer stock replenishment.',
    paymentTerms: '30% Deposit, 70% BL'
  },
  {
    id: 'JOB-2024-002',
    jobName: 'Bamboo Tees Q2',
    customer: 'Zalando SE',
    customerName: 'Zalando SE',
    customerId: 'CUST-002',
    factory: 'GreenLeaf Eco Fabrics',
    factoryName: 'GreenLeaf Eco Fabrics',
    factoryId: 'FAC-002',
    sku: 'BEMA-TEE-WHT-M',
    productRefId: 'PROD-TOC-002',
    quantity: 2000,
    status: 'Inquiry',
    productionStage: 'Inquiry',
    date: '2024-02-05',
    deliveryDate: '2024-05-01',
    targetDelivery: '2024-05-01',
    completionPercent: 10,
    priority: 'Medium',
    incoterms: 'CIF',
    shippingMethod: 'Air',
    destinationAddress: 'Berlin Hub',
    description: 'Initial test order for eco line.',
    paymentTerms: '100% LC'
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CUST-001', customerNo: 'C-2023-001', companyName: 'Urban Outfitters', contactPerson: 'Sarah Jenkins', email: 'buying@urban.com', region: 'North America', status: 'Active', totalOrders: 15, totalSpend: 250000, tier: 'VIP', businessType: 'Wholesale' },
  { id: 'CUST-002', customerNo: 'C-2023-089', companyName: 'Zalando SE', contactPerson: 'Markus Weber', email: 'procurement@zalando.de', region: 'Europe', status: 'Active', totalOrders: 42, totalSpend: 1200000, tier: 'VIP', businessType: 'E-commerce' }
];

export const MOCK_SAMPLES: SampleRequest[] = [];

export const MOCK_SHIPMENTS: Shipment[] = [
  { id: 'SHP-001', trackingNumber: 'MSKU9876543', carrier: 'Maersk', status: 'In Transit', origin: 'Shenzhen', destination: 'Log Angeles', eta: '2024-03-20', method: 'Sea', jobId: 'JOB-2024-001', lastUpdated: '2024-02-28' }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@usuppli.com', role: 'super_admin', department: 'Executive' },
  { id: 'u2', name: 'Sourcing Mgr', email: 'buyer@usuppli.com', role: 'editor', department: 'Procurement' },
  { id: 'u3', name: 'Logistics', email: 'logistics@usuppli.com', role: 'viewer', department: 'Supply Chain' },
  { id: 'u4', name: 'Demo User', email: 'demo@usuppli.com', role: 'admin', department: 'IT' }
];
