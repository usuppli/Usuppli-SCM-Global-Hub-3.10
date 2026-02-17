
// src/types.tsx

// ==========================================
// CORE APP TYPES
// ==========================================

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  password?: string;
  lastActive?: string;
}

export type TabType = 
  | 'DASHBOARD' 
  | 'PRODUCT_CATALOG' 
  | 'PRODUCT_WORKSPACE'
  | 'FACTORY_MASTER'
  | 'ORDER_MANAGER' 
  | 'PRODUCTION_FLOOR' 
  | 'LOGISTICS_TOWER' 
  | 'CRM' 
  | 'ADMIN'
  | 'EXCHANGE'
  | 'TEAM_CHAT'
  | 'AI_STRATEGIST';

export type Language = 'en' | 'zh-Hans' | 'zh-Hant';

// ==========================================
// TRANSLATION TYPES (NEWLY ADDED)
// ==========================================

export interface HubTranslations {
  title: string;
  subtitle: string;
  newThread: string;
  startNewThread: string;
  topic: string;
  message: string;
  selectCustomer: string;
  startConversation: string;
  initialMessage: string;
  pinThread: string;
  unpinThread: string;
  clearHistory: string;
  resetDemo: string;
  participants: string;
  linkType: string;
  selectItem: string;
}

export interface CalendarTranslations {
  title: string;
  subtitle: string;
  addEvent: string;
  addPlan: string;
  calculator: string;
  eta: string;
  totalDays: string;
  start: string;
  end: string;
  region: string;
  // --- NEW CALCULATOR CONSTANTS ---
  calculationFor: string;
  selectItem: string;
  quantity: string;
  destination: string;
  breakdown: string;
  production: string;
  qualityCheck: string;
  shipping: string;
  customs: string;
  enterCity: string;
  // --- ADDED MISSING TYPES ---
  typeJob: string;
  typeSample: string;
  typeProduct: string;
  select: string;
}

export interface CrmTranslations {
  title: string;
  addCustomer: string;
  search: string;
}

export interface Translation {
  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    refresh: string;
    share: string;
    clickToEdit: string;
    copied: string;
    search: string;
    loading: string;
    actions: string;
    view: string;
    export: string;
    print: string;
    submit: string;
    next: string;
    back: string;
    finish: string;
    command: string;
    close: string;
  };
  nav: {
    dashboard: string;
    productCatalog: string;
    productWorkspace: string;
    factoryMaster: string;
    production: string;
    shopFloor: string;
    logistics: string;
    crm: string;
    collaboration: string;
    teamChat: string;
    admin: string;
    newProduct: string;
    analytics: string;
    sourcing: string;
    executionGroup: string;
    system: string;
    aiStrategist: string;
    calendar: string;
    hub: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    activeJobs: string;
    globalSkus: string;
    inventoryVal: string;
    supplierHealth: string;
    recentActivity: string;
    refreshPulse: string;
  };
  // ... existing sections mapped dynamically ...
  production: any;
  catalog: any;
  workspace: any;
  teamChat: any;
  competitor: any;
  timeline: any;
  hsLookup: any;
  exchange: any;
  scorecard: any;
  ai: any;
  logistics: any;
  admin: any;
  login: any;
  specs: any;
  costing: any;
  tariffs: any;
  factory: any;
  shopFloor: any;
  
  // NEW SECTIONS
  hub: HubTranslations;
  calendar: CalendarTranslations;
  crm: CrmTranslations;
}

// ==========================================
// THEME & ANALYTICS TYPES
// ==========================================

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueTrend: number;
  activeOrders: number;
  orderTrend: number;
  avgMargin: number;
  marginTrend: number;
  pendingShipments: number;
  shipmentTrend: number;
}

// ==========================================
// GLOBAL SOURCING & SCORECARD TYPES
// ==========================================

export type ProductSector = 'Electronics' | 'Textiles' | 'Industrial' | 'Consumer' | 'Raw Materials' | 'Other';

export interface SupplierMetric {
  id: string;
  label: string;
  value: string | number;
  score: number;
  trend: 'up' | 'down' | 'neutral';
  isPrivate: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  sector: string;
  country: string;
  overallGrade: 'A' | 'B' | 'C' | 'D';
  metrics: SupplierMetric[];
  lastAuditDate: string;
  certifications: string[];
  contactEmail?: string;
}

// ==========================================
// FACTORY & SUPPLY CHAIN TYPES
// ==========================================

export interface Factory {
  id: string;
  name: string;
  location: string;
  country: string;
  address?: string;
  contact?: string;
  contactPerson: string;
  jobTitle?: string;
  phone?: string;
  contactPhone?: string;
  contactEmail: string;
  email?: string; // Alias for contactEmail
  website?: string;
  websiteUrl?: string; // Wizard compatibility
  rating: number; // For Factory Master
  overallGrade?: 'A' | 'B' | 'C' | 'D'; // For Supplier Scorecard
  businessType?: 'Manufacturer' | 'Trading Company' | 'Agent' | 'Wholesaler';
  supplierType?: string; // Wizard compatibility
  capabilities?: string[];
  mainCategory?: string;
  productCategories?: string[]; // Wizard compatibility
  moq?: number;
  capacity?: number;
  productionCapacity?: string; // Wizard compatibility
  leadTimeDays?: number;
  certificationsList?: string;
  certifications?: string[];
  source?: string;
  connection?: string;
  notes?: string;
  attachmentsCount?: number;
  status?: 'Active' | 'Probation' | 'Inactive' | 'Vetting' | 'Blacklisted' | 'Pending';
  scorecardData?: Supplier;
  taxId?: string;
  region?: 'Asia' | 'Africa' | 'Americas' | 'Europe' | 'Middle East';
  currency?: string;
  incoterms?: string;
}

export interface Job {
  id: string;
  jobName?: string; // Alias
  orderNumber?: string; // Alias
  description?: string;
  poNumber?: string;
  customer?: string; 
  customerName?: string;
  customerId?: string;
  factory?: string;
  factoryName?: string;
  factoryId: string;
  sku?: string;
  productRefId?: string; // Alias
  productId?: string; // Alias
  quantity: number;
  value?: number;
  status: string;
  date?: string;
  orderDate?: string;
  startDate?: string;
  deliveryDate?: string;
  targetDelivery?: string;
  progress?: number;
  completionPercent?: number;
  productionStage?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  isSoncapRequired?: boolean;
  notes?: string;
  leadBuyer?: string;
  packagingInstructions?: string;
  incoterms?: 'EXW' | 'FOB' | 'CIF' | 'DDP' | 'DAP' | string;
  destinationAddress?: string;
  shippingMethod?: 'Air' | 'Sea' | 'Rail' | 'Truck' | 'Express' | string;
  paymentTerms?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  origin?: string;
  destination?: string; 
  currentLocation?: string;
  eta: string;
  status: 'Booked' | 'In Transit' | 'Customs' | 'Delivered' | 'Exception' | 'Delayed';
  carrier: string;
  method?: string; // Alias for type
  type?: 'Air' | 'Ocean' | 'Road';
  jobId?: string;
  lastUpdated?: string;
  linkedSampleId?: string;
  accountManager?: string;
  shipmentType?: 'Production' | 'Sample';
  accountType?: 'Usuppli/Axcess' | 'Existing Customer' | 'New Customer';
  items?: string[]; 
}

export interface Customer {
  id: string;
  name?: string; 
  companyName?: string; // Alias
  company?: string; // Alias
  email: string;
  contactPerson?: string;
  contactName?: string;
  phone?: string;
  location?: string;
  region: string;
  totalOrders: number;
  totalSpend?: number;
  tier?: 'VIP' | 'Standard' | 'New' | 'Strategic' | 'Probation';
  businessType?: string;
  customerNo?: string;
  status?: 'Active' | 'Lead' | 'Inactive' | 'Pending' | 'Probation';
  address?: string;
  stateRegion?: string;
  postalCode?: string;
  website?: string;
  industry?: string;
  accountOwner?: string;
  communicationPreference?: string[];
  accountSource?: string;
  currency?: string;
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  billingCountry?: string;
  shippingStreet?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  shippingCountry?: string;
  shippingSameAsBilling?: boolean;
  incoterms?: string;
  notes?: string;
  lastOrder?: string;
  orders?: number;
}

export interface SampleRequest {
  id: string;
  productId: string;
  productName?: string;
  factoryId?: string;
  factoryName?: string;
  customerId?: string;
  customerName?: string;
  type?: string;
  status: string; 
  requestDate: string;
  estimatedCompletion?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  courier?: string;
  cost?: number;
  courierCost?: number;
  feedback?: string;
  notes?: string;
  jobId?: string; 
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'file';
  }[];
  comments?: {
    id: string;
    userId: string;
    userName: string;
    text: string;
    date: string;
  }[];
}

// ==========================================
// FINANCE & HS CODE TYPES
// ==========================================

export interface ExchangeRate {
  id: string;
  pair: string;
  rate: number;
  trend: 'up' | 'down' | 'neutral';
  change: number;
  lastUpdated: string;
}

export interface HSCodeData {
  code: string;
  description: string;
  dutyRate: number;
}

// ==========================================
// PRODUCT & COSTING TYPES
// ==========================================

export interface CostVariables {
  [key: string]: number | undefined; 
  materials: number;
  labor?: number;
  packaging?: number;
  overhead?: number;
  logistics?: number;
  exportInternal?: number;
  exportExternal?: number;
  shipping?: number;
  design?: number;
  inspection?: number;
  production?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  status: string;
  thumbnail?: string;
  image?: string;
  cadLink?: string;
  hsCode?: string;
  material?: string;
  construction?: string;
  moq?: number;
  cost?: number; // Alias
  costPrice?: number; // Alias
  currency?: string;
  supplierId?: string;
  specs?: any;
  tariffCode?: string;
  dimensions?: {
      lengthCm: number;
      widthCm: number;
      heightCm: number;
      weightKg: number;
  };
  skus?: {
      code: string;
      size: string;
      prices: Record<string, number>;
      color?: string;
  }[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'file';
  }[];
  comments?: {
    id: string;
    userId: string;
    userName: string;
    text: string;
    date: string;
  }[];
  costVariables?: CostVariables;
  primaryFactoryId?: string;
  factories?: Factory[];
  competitors?: any[];
  timeline?: any[];
  tariffOverrides?: any;
  dutyOverrides?: Record<string, number>;
  additionalFees?: Record<string, number>;
  customerId?: string;
  sku: string;
  leadTime?: string | number; 
  weight?: string;
  retailPrice?: number;
  targetMargin?: number;
  description?: string;
  packagingType?: string;
  sourcingCountry?: string;
}

// ==========================================
// AUDIT, LOG & CHAT TYPES
// ==========================================

export interface AuditLogEntry {
  id: string;
  timestamp: string | Date;
  user: string;
  userId?: string;
  userRole?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'SYSTEM' | 'EXPORT' | 'STATUS_CHANGE';
  module: string; 
  entity?: 'Product' | 'Order' | 'Customer' | 'Factory' | 'System' | 'Shipment' | 'User';
  entityId?: string;
  details: string;
}

export interface ChatAttachment {
  type: 'image' | 'file' | 'audio';
  url: string;
  name?: string;
  size?: string;
  duration?: string;
  mimeType?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
  attachment?: ChatAttachment; 
}

export interface ChatThread {
  id: string;       
  name: string;       
  type: 'group' | 'direct'; 
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: Date;
  isOnline?: boolean;
  isTyping?: boolean;
}

// ==========================================
// UTILITY & FILTER TYPES
// ==========================================

export interface FilterRule {
  id: string;
  field: string;
  operator: 'contains' | 'equals' | 'gt' | 'lt' | 'startsWith' | 'endsWith';
  value: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  rules: FilterRule[];
}