
import React, { useState, useEffect, useCallback } from 'react';
import { translations } from './translations'; 
import './print.css'; 

// Components
import Sidebar from './components/Sidebar';
import LoginForm from './components/LoginForm';
import CommandPalette from './components/CommandPalette';
import SCMAIStrategist from './components/SCMAIStrategist';
import TeamChat from './components/Tabs/TeamChat';
import ExchangeRateView from './components/Tabs/ExchangeRateView';

// Tabs
import Dashboard from './components/Tabs/Dashboard';
import ProductCatalog from './components/Tabs/ProductCatalog';
import ProductWorkspace from './components/Tabs/ProductWorkspace';
import FactoryMaster from './components/Tabs/FactoryMaster';
import Jobs from './components/Tabs/Jobs';
import LogisticsTower from './components/Tabs/LogisticsTower';
import CustomerDirectory from './components/Tabs/CustomerDirectory';
import AdminPanel from './components/Tabs/AdminPanel';

// Wizards
import NewProductWizard from './components/Tabs/NewProductWizard';
import NewSupplierWizard from './components/Tabs/NewSupplierWizard';
import CreateJobWizard from './components/Tabs/CreateJobWizard';
import NewSampleWizard from './components/Tabs/NewSampleWizard';
import AddCustomerWizard from './components/Tabs/AddCustomerWizard';
import CreateShipmentWizard from './components/Tabs/CreateShipmentWizard';

// Context & Types
import { ThemeProvider } from './hooks/useTheme';
import { GlobalConfigProvider, useGlobalConfig } from './context/GlobalConfigContext';
import { MOCK_PRODUCTS, MOCK_FACTORIES, MOCK_JOBS, MOCK_USERS, MOCK_SHIPMENTS, MOCK_CUSTOMERS, MOCK_SAMPLES } from './components/Tabs/constants';
import { User, TabType, Product, Factory, Job, Shipment, Customer, SampleRequest, Language, UserRole, AuditLogEntry } from './types';

const AppContent = () => {
  const config = useGlobalConfig();

  // --- 1. AUTH & PREFERENCES STATE ---
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('usuppli_user_data');
    return saved ? JSON.parse(saved) : null;
  });

  const [lang, setLang] = useState<Language>(() => 
    (localStorage.getItem('usuppli-language') as Language) || 'en'
  );

  // --- 2. INITIAL TAB MAPPING ---
  const getTabMapping = (key: string | null): TabType => {
    const mapping: Record<string, TabType> = {
      'dashboard': 'DASHBOARD',
      'workspace': 'PRODUCT_CATALOG',
      'orders': 'ORDER_MANAGER',
      'logistics': 'LOGISTICS_TOWER',
      'suppliers': 'FACTORY_MASTER',
      'customers': 'CRM'
    };
    return (key && mapping[key]) ? mapping[key] : 'DASHBOARD';
  };

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    return getTabMapping(localStorage.getItem('usuppli-start-page'));
  });
  
  // --- 3. UI STATE ---
  const [isSidebarPinned, setIsSidebarPinned] = useState(true);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeWizard, setActiveWizard] = useState<string | null>(null);

  // --- 4. DATA PERSISTENCE ---
  const loadData = useCallback(<T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return (saved && saved !== 'null' && saved !== 'undefined') ? JSON.parse(saved) : fallback;
    } catch (e) { return fallback; }
  }, []);

  const [products, setProducts] = useState<Product[]>(() => loadData('usuppli_products', MOCK_PRODUCTS));
  const [customers, setCustomers] = useState<Customer[]>(() => loadData('usuppli_customers', MOCK_CUSTOMERS));
  const [shipments, setShipments] = useState<Shipment[]>(() => loadData('usuppli_shipments', MOCK_SHIPMENTS));
  const [factories, setFactories] = useState<Factory[]>(() => loadData('usuppli_factories', MOCK_FACTORIES));
  const [jobs, setJobs] = useState<Job[]>(() => loadData('usuppli_jobs', MOCK_JOBS));
  const [samples, setSamples] = useState<SampleRequest[]>(() => loadData('usuppli_samples', MOCK_SAMPLES));
  const [users, setUsers] = useState<User[]>(() => loadData('usuppli_users', MOCK_USERS));
  
  // NEW: Audit Log State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadData('usuppli_audit_logs', []));

  useEffect(() => {
    localStorage.setItem('usuppli_products', JSON.stringify(products));
    localStorage.setItem('usuppli_customers', JSON.stringify(customers));
    localStorage.setItem('usuppli_shipments', JSON.stringify(shipments));
    localStorage.setItem('usuppli_factories', JSON.stringify(factories));
    localStorage.setItem('usuppli_jobs', JSON.stringify(jobs));
    localStorage.setItem('usuppli_samples', JSON.stringify(samples));
    localStorage.setItem('usuppli_users', JSON.stringify(users));
    localStorage.setItem('usuppli_audit_logs', JSON.stringify(auditLogs));
  }, [products, customers, shipments, factories, jobs, samples, users, auditLogs]);

  // --- 5. LOGGING HELPER ---
  const logEvent = (action: AuditLogEntry['action'], module: string, details: string, actor?: User | null) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      user: actor?.name || user?.name || 'System',
      action,
      module,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // --- 6. ACTION HANDLERS ---
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('usuppli-language', newLang);
  };

  const handleLogin = (u: User) => {
    localStorage.setItem('usuppli_user_data', JSON.stringify(u));
    setUser(u);
    setIsSidebarHidden(false);
    logEvent('LOGIN', 'Auth', 'User Logged In', u);
    setActiveTab(getTabMapping(localStorage.getItem('usuppli-start-page')));
  };

  const handleLogout = () => {
    logEvent('LOGOUT', 'Auth', 'User Logged Out');
    setActiveTab('DASHBOARD');
    setSelectedProductId(null);

    const theme = localStorage.getItem('usuppli-theme');
    const start = localStorage.getItem('usuppli-start-page');
    const language = localStorage.getItem('usuppli-language');

    localStorage.clear();

    if (theme) localStorage.setItem('usuppli-theme', theme);
    if (start) localStorage.setItem('usuppli-start-page', start);
    if (language) localStorage.setItem('usuppli-language', language);

    setUser(null);
  };

  const handleOpenWorkspace = (id: string) => {
    setSelectedProductId(id);
    setActiveTab('PRODUCT_WORKSPACE');
  };

  // --- 7. RENDERING ENGINE ---
  const renderActiveTab = () => {
    const canAccessAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    const current = (activeTab === 'ADMIN' && !canAccessAdmin) ? 'DASHBOARD' : activeTab;
    const commonProps = { lang, isReadOnly: user?.role === 'viewer' };

    switch (current) {
      // Added missing activeTab prop to Dashboard
      case 'DASHBOARD': return <Dashboard {...commonProps} activeTab={activeTab} products={products} factories={factories} jobs={jobs} onSelectProduct={handleOpenWorkspace} onViewCatalog={() => setActiveTab('PRODUCT_CATALOG')} onViewLogistics={() => setActiveTab('LOGISTICS_TOWER')} onSave={(u: Product) => setProducts(prev => prev.map(p => p.id === u.id ? u : p))} onMasterSave={() => {}} />;
      case 'PRODUCT_CATALOG': return <ProductCatalog {...commonProps} products={products} onAddProduct={() => setActiveWizard('product')} onUpdateProduct={(u) => {setProducts(p => p.map(x => x.id === u.id ? u : x)); logEvent('UPDATE', 'Product Catalog', `Updated product: ${u.name}`);}} onOpenWorkspace={handleOpenWorkspace} userRole={user?.role as UserRole} />;
      case 'PRODUCT_WORKSPACE': return <ProductWorkspace {...commonProps} products={products} customers={customers} factories={factories} onSave={(u) => {setProducts(p => p.map(x => x.id === u.id ? u : x)); logEvent('UPDATE', 'Product Catalog', `Modified workspace for: ${u.name}`);}} onAddProduct={(n) => { setProducts(p => [n, ...p]); handleOpenWorkspace(n.id); logEvent('CREATE', 'Product Catalog', `Created new product: ${n.name}`);}} onSaveSample={(s) => setSamples(prev => [...prev, s])} initialSelectedId={selectedProductId} onSelectProduct={setSelectedProductId} userRole={user?.role as UserRole} globalTariffs={config?.tariffs} lockedTariffs={config?.lockedTariffs} />;
      case 'FACTORY_MASTER': return <FactoryMaster {...commonProps} factories={factories} products={products} onSaveFactory={(f) => {setFactories(prev => prev.some(x => x.id === f.id) ? prev.map(x => x.id === f.id ? f : x) : [...prev, f]); logEvent('UPDATE', 'Factory Master', `Updated factory: ${f.name}`);}} onDeleteFactory={(id) => setFactories(p => p.filter(x => x.id !== id))} onOpenWizard={() => setActiveWizard('supplier')} />;
      case 'ORDER_MANAGER': return <Jobs {...commonProps} products={products} customers={customers} factories={factories} jobs={jobs} samples={samples} onSaveJobsList={setJobs} onRequestNewJob={() => setActiveWizard('job')} onRequestNewSample={() => setActiveWizard('sample')} onSaveSample={(s) => setSamples(prev => prev.map(x => x.id === s.id ? s : x))} />;
      case 'LOGISTICS_TOWER': return <LogisticsTower {...commonProps} shipments={shipments} jobs={jobs} onUpdateShipment={(s) => setShipments(p => p.map(x => x.id === s.id ? s : x))} onCreateShipment={(s) => setShipments(p => [...p, s])} onOpenWizard={() => setActiveWizard('shipment')} />;
      case 'CRM': return <CustomerDirectory {...commonProps} customers={customers} users={users} jobs={jobs} shipments={shipments} onAddCustomer={(c) => {setCustomers(p => [...p, c]); logEvent('CREATE', 'CRM', `Added customer: ${c.companyName}`);}} onUpdateCustomer={(u) => setCustomers(p => p.map(x => x.id === u.id ? u : x))} onDeleteCustomer={(id) => setCustomers(p => p.filter(x => x.id !== id))} onOpenCustomerWizard={() => setActiveWizard('customer')} samples={samples} />;
      case 'ADMIN': return <AdminPanel {...commonProps} setLang={handleLanguageChange} products={products} setProducts={setProducts} users={users} setUsers={setUsers} jobs={jobs} currentUser={user} setSelectedProductId={setSelectedProductId} systemVersion={config?.systemVersion} globalTariffs={config?.tariffs} lockedTariffs={config?.lockedTariffs} onUpdateVersion={config?.updateVersion} onUpdateTariff={config?.updateTariff} onToggleTariffLock={config?.toggleTariffLock} auditLogs={auditLogs} />;
      case 'EXCHANGE': return <ExchangeRateView />;
      case 'TEAM_CHAT': return <TeamChat currentUser={user!} users={users} lang={lang} isOpen={true} onClose={() => setActiveTab('DASHBOARD')} />;
      case 'AI_STRATEGIST': return <SCMAIStrategist />;
      default: return <Dashboard {...commonProps} activeTab={activeTab} products={products} factories={factories} jobs={jobs} onSelectProduct={handleOpenWorkspace} onViewCatalog={() => setActiveTab('PRODUCT_CATALOG')} onViewLogistics={() => setActiveTab('LOGISTICS_TOWER')} onSave={(u: Product) => setProducts(prev => prev.map(p => p.id === u.id ? u : p))} onMasterSave={() => {}} />;
    }
  };

  if (!user) return <LoginForm onLogin={handleLogin} lang={lang} />;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden relative">
      {!isSidebarHidden && (
        <Sidebar 
          user={user} activeTab={activeTab} setActiveTab={setActiveTab} 
          currentLang={lang} setCurrentLang={handleLanguageChange}
          // Added missing isReadOnly prop to Sidebar
          isReadOnly={user?.role === 'viewer'}
          onOpenProductWizard={() => setActiveWizard('product')} onLogout={handleLogout}
          onToggleChat={() => setChatOpen(!chatOpen)} onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          isPinned={isSidebarPinned} setIsPinned={setIsSidebarPinned} onHide={() => setIsSidebarHidden(true)}
          systemVersion={config?.systemVersion}
        />
      )}

      <main className={`flex-1 h-full overflow-y-auto custom-scrollbar transition-all duration-500 ${isSidebarHidden ? 'w-full' : ''}`}>
        <div className="p-4 md:p-8 pb-24 max-w-[1600px] mx-auto">
          {renderActiveTab()}
        </div>
      </main>

      {/* COMMAND PALETTE & WIZARDS */}
      <CommandPalette 
        isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} 
        lang={lang} products={products} jobs={jobs} customers={customers}
        onNavigate={(t) => { setActiveTab(t); setCommandPaletteOpen(false); }}
        onCreateProduct={() => { setActiveWizard('product'); setCommandPaletteOpen(false); }}
        // Added missing onCreateJob prop to CommandPalette
        onCreateJob={() => { setActiveWizard('job'); setCommandPaletteOpen(false); }}
      />

      {activeWizard === 'product' && <NewProductWizard factories={factories} customers={customers} onComplete={(n) => { setProducts(p => [n, ...p]); setActiveWizard(null); handleOpenWorkspace(n.id); logEvent('CREATE', 'Product Catalog', `Created new product: ${n.name}`); }} onCancel={() => setActiveWizard(null)} />}
      {activeWizard === 'supplier' && <NewSupplierWizard lang={lang} onComplete={(f) => { setFactories(p => [...p, f]); setActiveWizard(null); logEvent('CREATE', 'Factory Master', `Added factory: ${f.name}`); }} onCancel={() => setActiveWizard(null)} />}
      {['job', 'sample', 'customer', 'shipment'].includes(activeWizard || '') && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          {activeWizard === 'job' && <CreateJobWizard products={products} customers={customers} factories={factories} lang={lang} onComplete={(j) => { setJobs(p => [j, ...p]); setActiveWizard(null); setActiveTab('ORDER_MANAGER'); logEvent('CREATE', 'Order Manager', `Created job: ${j.orderNumber}`); }} onCancel={() => setActiveWizard(null)} />}
          {activeWizard === 'sample' && <NewSampleWizard products={products} customers={customers} factories={factories} lang={lang} onComplete={(s) => { setSamples(p => [s, ...p]); setActiveWizard(null); }} onCancel={() => setActiveWizard(null)} />}
          {activeWizard === 'customer' && <AddCustomerWizard isOpen={true} onClose={() => setActiveWizard(null)} onSave={(c) => { setCustomers(p => [...p, c]); setActiveWizard(null); logEvent('CREATE', 'CRM', `Added customer: ${c.companyName}`); }} />}
          {activeWizard === 'shipment' && <CreateShipmentWizard jobs={jobs} samples={samples} onComplete={(s) => { setShipments(p => [...p, s]); setActiveWizard(null); }} onClose={() => setActiveWizard(null)} />}
        </div>
      )}
    </div>
  );
};

const App = () => (
  <GlobalConfigProvider>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </GlobalConfigProvider>
);

export default App;
