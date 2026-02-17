
// src/translations.tsx

export const translations: any = {
  en: {
    common: {
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      refresh: "Refresh",
      share: "Share",
      clickToEdit: "Click to edit",
      copied: "Copied to clipboard",
      search: "Search...",
      loading: "Loading...",
      actions: "Actions",
      view: "View",
      export: "Export",
      print: "Print",
      submit: "Submit",
      next: "Next",
      back: "Back",
      finish: "Finish",
      command: "Command",
      close: "Close"
    },
    nav: {
      dashboard: "Dashboard",
      productCatalog: "Product Catalog",
      productWorkspace: "Workspace",
      factoryMaster: "Supplier & Factory Portfolio",
      production: "Order Manager",
      shopFloor: "Shop Floor",
      logistics: "Logistics Tower",
      crm: "Customer Directory",
      collaboration: "Collaboration Hub",
      teamChat: "Team Chat",
      admin: "Admin",
      newProduct: "New Product",
      analytics: "Analytics",
      sourcing: "Sourcing",
      executionGroup: "Execution",
      system: "System",
      aiStrategist: "AI Strategist",
      calendar: "Calendar",
      hub: "Hub"
    },
    calendar: {
      title: "Constraint Calendar",
      subtitle: "Global Production & Logistics Constraints",
      addEvent: "Add Event",
      addPlan: "Add Plan to Calendar",
      calculator: "Lead Time Calculator",
      eta: "Est. Arrival (ETA)",
      totalDays: "Total Days",
      start: "Start Date",
      end: "End Date",
      region: "Region",
      // --- CALCULATOR TRANSLATIONS ---
      calculationFor: "Calculation For",
      selectItem: "Select Item",
      quantity: "Quantity",
      destination: "Destination",
      breakdown: "Breakdown (Days)",
      production: "Production",
      qualityCheck: "Quality Check",
      shipping: "Shipping",
      customs: "Customs",
      enterCity: "Enter city or port...",
      // --- NEW: TYPES & DROPDOWN ---
      typeJob: "Job",
      typeSample: "Sample",
      typeProduct: "Product",
      select: "Select"
    },
    hub: {
      title: "Collaboration Hub",
      subtitle: "Global Message Board",
      newThread: "New Thread",
      startNewThread: "Start New Thread",
      topic: "Topic",
      message: "Message",
      selectCustomer: "Select Customer...",
      startConversation: "Select a thread to start collaborating",
      initialMessage: "Initial message...",
      pinThread: "Pin Thread",
      unpinThread: "Unpin Thread",
      clearHistory: "Clear History",
      resetDemo: "Reset Demo Data",
      participants: "Participants",
      linkType: "Link Type",
      selectItem: "Select Item..."
    },
    dashboard: {
      title: "Operations Dashboard",
      subtitle: "Global Supply Chain Pulse",
      activeJobs: "Active Orders",
      globalSkus: "Global SKUs",
      inventoryVal: "Inventory Value",
      supplierHealth: "Supplier Health",
      recentActivity: "Recent Activity",
      refreshPulse: "Refresh Pulse"
    },
    production: {
      title: "Order Manager",
      sampleTracker: "Sample Tracker",
      newJob: "New Order",
      requestSample: "Request Sample",
      status: "Production Status",
      factory: "Assigned Factory",
      timeline: "Delivery Timeline",
      priority: "Priority",
      quantity: "Quantity",
      tabs: {
        production: "Production",
        samples: "Samples"
      }
    },
    shopFloor: {
      title: "Shop Floor",
      refresh: "Refresh Pulse"
    },
    catalog: {
      subtitle: "Global SKU Directory",
      addNew: "Add New Product",
      sku: "SKU",
      category: "Category",
      cost: "Unit Cost"
    },
    workspace: {
      tabs: {
        specs: "Specs",
        costing: "Costing",
        tariffs: "Tariffs",
        exchange: "Exchange",
        competitors: "Intelligence",
        timeline: "Timeline",
        ai: "AI Strategy"
      }
    },
    teamChat: {
      title: "Team Collaboration",
      channels: "Channels",
      directMessages: "Direct Messages",
      typeMessage: "Type a message...",
      online: "Online",
      offline: "Offline",
      teamGeneral: "General Team",
      logisticsOps: "Logistics Ops",
      productDesign: "Product Design",
      qaTeam: "QA Team",
      shareVia: "Share via",
      recording: "Recording...",
      deleteMsg: "Delete Message"
    },
    competitor: {
      title: "Competitor Intelligence",
      subtitle: "Market Analysis & Tracking",
      trackNew: "Track Competitor",
      marketShare: "Market Share",
      pricePosition: "Price Position",
      headers: { brand: "Brand", price: "Price", origin: "Origin", strength: "Key Strength" }
    },
    timeline: {
      title: "Product Launch Timeline",
      subtitle: "Critical Path Management",
      phases: {
        concept: { market: "Global", activity: "Concept" },
        sampling: { market: "Asia", activity: "Sampling" },
        production: { market: "USA", activity: "Production" },
        logistics: { market: "Europe", activity: "Logistics" },
        p1: { market: "Global", activity: "Concept Validation" },
        p2: { market: "Asia", activity: "Prototyping" },
        p3: { market: "Europe", activity: "Pilot Run" },
        p4: { market: "USA", activity: "Mass Production" },
        p5: { market: "Global", activity: "Official Launch" }
      },
      status: {
        completed: "Completed",
        inProgress: "In Progress",
        pending: "Pending",
        delayed: "Delayed"
      },
      addMilestone: "Add Milestone"
    },
    hsLookup: {
      title: "HS Code Intelligence",
      subtitle: "Global Classification & Compliance",
      searchPlaceholder: "Search product description (e.g. 'cotton shirt')...",
      results: "Classification Results",
      code: "HS Code",
      description: "Description",
      duty: "Duty Rate"
    },
    exchange: {
      title: "Currency Exchange",
      subtitle: "Real-time Forex Rates",
      base: "Base Currency",
      target: "Target Currency",
      rate: "Current Rate",
      calculator: "Converter"
    },
    scorecard: {
      title: "Supplier Scorecard",
      subtitle: "Performance Metrics",
      grade: "Overall Grade",
      metrics: {
        quality: "Quality",
        speed: "Speed / Lead Time",
        price: "Pricing",
        risk: "Risk Profile",
        communication: "Communication"
      }
    },
    ai: {
      title: "SCM AI Strategist",
      subtitle: "Predictive Analytics & Insights",
      promptPlaceholder: "Ask about inventory, risks, or suppliers...",
      analyze: "Analyze",
      suggestions: "Strategic Suggestions",
      thinking: "Analyzing data points..."
    },
    logistics: {
      title: "Logistics Tower",
      subtitle: "Real-time freight tracking",
      addShipment: "Add Shipment",
      sortBy: "Sort by ETA",
      inboundAir: "Inbound Air",
      inboundOcean: "Inbound Ocean",
      customsHold: "Customs Hold",
      activeUnits: "Active Shipments",
      nextArrival: "Next Arrival",
      shipments: "Shipments",
      origin: "Origin",
      destination: "Destination",
      status: "Status"
    },
    crm: {
      title: "Customer Directory",
      addCustomer: "Add Customer",
      search: "Search customers..."
    },
    admin: {
      title: "Admin Panel",
      subtitle: "System Configuration & Governance",
      users: {
        title: "User Management",
        createBtn: "Create User",
        registerIdentity: "Register Identity",
        tableUser: "User",
        tableRole: "Role",
        tableActions: "Actions"
      },
      system: {
        dbStatus: "Database Status",
        connected: "Connected",
        version: "System Version",
        editVersion: "Edit Version",
        updateVersion: "Update Version",
        versionWarning: "Warning: Manually changing the system version will update global metadata."
      },
      backup: {
        jsonTitle: "Export DB",
        jsonDesc: "Download full system snapshot",
        downloadJson: "Download",
        generate: "Generate Snapshot",
        restoreDB: "Restore DB",
        upload: "Upload & Restore",
        csvTitle: "CSV Export",
        csvDesc: "Export data to spreadsheet",
        productsBtn: "Products",
        jobsBtn: "Orders"
      },
      audit: {
        exportCSV: "Export CSV"
      },
      preferences: {
        theme: "Interface Theme",
        localization: "Localization",
        startPage: "Default Start Page"
      },
      tabs: {
        system: "System",
        users: "Users",
        backup: "Backup",
        audit: "Audit",
        preferences: "Preferences"
      }
    },
    login: {
      subtitle: "Enterprise Supply Chain Manager",
      email: "Email Address",
      password: "Password",
      signIn: "Sign In"
    },
    specs: {
      title: "Product Specifications",
      dna: "Product DNA",
      fabrication: "Fabrication",
      material: "Material",
      construction: "Construction",
      logistics: "Logistics",
      hsCode: "HS Code",
      dims: "Dimensions",
      skuMatrix: "SKU Matrix"
    },
    costing: {
      title: "Unit Cost Calculator",
      subtitle: "Granular breakdown of production costs",
      headers: { variable: "Variable", value: "Value", notes: "Notes" },
      variables: {
        materials: "Raw Materials",
        labor: "Labor",
        packaging: "Packaging",
        overhead: "Overhead",
        logistics: "Inbound Logistics",
        inspection: "Quality Control"
      },
      logisticsVolume: "Logistics Volume",
      labels: { weight: "Weight", length: "Length", width: "Width", height: "Height" }
    },
    tariffs: {
      title: "Global Tariff Matrix",
      subtitle: "Import duty estimates by region",
      headers: { country: "Region", base: "Base Rate", fees: "Fees", total: "Total Duty", notes: "Notes" },
      entries: {
        usa: { name: "USA", notes: "Section 301 applies" },
        sa: { name: "South Africa", notes: "SADC preferential" },
        bahamas: { name: "Bahamas", notes: "CARICOM" },
        nigeria: { name: "Nigeria", notes: "CET rates" },
        tanzania: { name: "Tanzania", notes: "EAC rates" }
      }
    },
    factory: {
      title: "Supplier & Factory Portfolio",
      subtitle: "Manage global manufacturing partners",
      search: "Search suppliers...",
      addBtn: "Add Supplier",
      form: { name: "Factory Name", location: "Location", contact: "Contact Person", contactNo: "Phone Number", moq: "Minimum Order Quantity" }
    }
  },
  'zh-Hans': { 
    common: {
      save: "保存",
      cancel: "取消",
      edit: "编辑",
      delete: "删除",
      refresh: "刷新",
      share: "分享",
      clickToEdit: "点击编辑",
      copied: "已复制到剪贴板",
      search: "搜索...",
      loading: "加载中...",
      actions: "操作",
      view: "查看",
      export: "导出",
      print: "打印",
      submit: "提交",
      next: "下一步",
      back: "返回",
      finish: "完成",
      command: "命令",
      close: "关闭"
    },
    nav: {
      dashboard: "仪表板",
      productCatalog: "产品目录",
      productWorkspace: "工作区",
      factoryMaster: "供应商与工厂组合",
      production: "订单管理",
      shopFloor: "生产车间",
      logistics: "物流塔",
      crm: "客户名录",
      collaboration: "协作中心",
      teamChat: "团队聊天",
      admin: "管理",
      newProduct: "新增产品",
      analytics: "数据分析",
      sourcing: "采购管理",
      executionGroup: "执行中心",
      system: "系统设置",
      aiStrategist: "AI 策略师",
      calendar: "日历",
      hub: "中心"
    },
    calendar: {
      title: "约束日历",
      subtitle: "全球生产与物流约束",
      addEvent: "添加事件",
      addPlan: "添加计划到日历",
      calculator: "提前期计算器",
      eta: "预计到达时间 (ETA)",
      totalDays: "总天数",
      start: "开始日期",
      end: "结束日期",
      region: "地区",
      // --- CALCULATOR TRANSLATIONS ---
      calculationFor: "计算对象",
      selectItem: "选择项目",
      quantity: "数量",
      destination: "目的地",
      breakdown: "明细 (天)",
      production: "生产",
      qualityCheck: "质检",
      shipping: "运输",
      customs: "报关",
      enterCity: "输入城市或港口...",
      // --- NEW: TYPES & DROPDOWN ---
      typeJob: "订单",
      typeSample: "样品",
      typeProduct: "产品",
      select: "选择"
    },
    hub: {
      title: "协作中心",
      subtitle: "全球留言板",
      newThread: "新话题",
      startNewThread: "开始新话题",
      topic: "话题",
      message: "消息",
      selectCustomer: "选择客户...",
      startConversation: "选择一个话题开始协作",
      initialMessage: "初始消息...",
      pinThread: "固定话题",
      unpinThread: "取消固定话题",
      clearHistory: "清除历史",
      resetDemo: "重置演示数据",
      participants: "参与者",
      linkType: "链接类型",
      selectItem: "选择项目..."
    },
    dashboard: {
      title: "运营仪表板",
      subtitle: "全球供应链脉动",
      activeJobs: "活跃订单",
      globalSkus: "全球SKU数量",
      inventoryVal: "库存价值",
      supplierHealth: "供应商评分",
      recentActivity: "近期动态",
      refreshPulse: "刷新脉动"
    },
    production: {
      title: "订单管理",
      sampleTracker: "样品追踪",
      newJob: "新增订单",
      requestSample: "请求样品",
      status: "生产状态",
      factory: "指定工厂",
      timeline: "交货时间线",
      priority: "优先级",
      quantity: "数量",
      tabs: {
        production: "生产",
        samples: "样品"
      }
    },
    shopFloor: {
      title: "生产车间",
      refresh: "刷新脉动"
    },
    catalog: {
      subtitle: "全球 SKU 目录",
      addNew: "新增产品",
      sku: "SKU",
      category: "类别",
      cost: "单位成本"
    },
    workspace: {
      tabs: {
        specs: "规格",
        costing: "成本",
        tariffs: "关税",
        exchange: "汇率",
        competitors: "情报",
        timeline: "时间表",
        ai: "AI 策略"
      }
    },
    teamChat: {
      title: "团队协作",
      channels: "频道",
      directMessages: "私信",
      typeMessage: "输入消息...",
      online: "在线",
      offline: "离线",
      teamGeneral: "综合团队",
      logisticsOps: "物流运营",
      productDesign: "产品设计",
      qaTeam: "QA团队",
      shareVia: "分享至",
      recording: "录音中...",
      deleteMsg: "删除消息"
    },
    competitor: {
      title: "竞争对手情报",
      subtitle: "市场分析与追踪",
      trackNew: "追踪新对手",
      marketShare: "市场份额",
      pricePosition: "价格定位",
      headers: { brand: "品牌", price: "价格", origin: "原产地", strength: "核心优势" }
    },
    timeline: {
      title: "产品发布时间表",
      subtitle: "关键路径管理",
      phases: {
        concept: { market: "全球", activity: "概念" },
        sampling: { market: "亚洲", activity: "样品" },
        production: { market: "美国", activity: "生产" },
        logistics: { market: "欧洲", activity: "物流" },
        p1: { market: "全球", activity: "概念验证" },
        p2: { market: "亚洲", activity: "原型制作" },
        p3: { market: "欧洲", activity: "试产" },
        p4: { market: "美国", activity: "批量生产" },
        p5: { market: "全球", activity: "正式发布" }
      },
      status: {
        completed: "已完成",
        inProgress: "进行中",
        pending: "待定",
        delayed: "延误"
      },
      addMilestone: "添加里程碑"
    },
    hsLookup: {
      title: "HS 编码情报",
      subtitle: "全球分类与合规",
      searchPlaceholder: "搜索产品描述 (例如 '棉衬衫')...",
      results: "分类结果",
      code: "HS 编码",
      description: "描述",
      duty: "税率"
    },
    exchange: {
      title: "货币汇率",
      subtitle: "实时外汇汇率",
      base: "基础货币",
      target: "目标货币",
      rate: "当前汇率",
      calculator: "转换器"
    },
    scorecard: {
      title: "供应商评分卡",
      subtitle: "绩效指标",
      grade: "总体评级",
      metrics: {
        quality: "质量",
        speed: "速度/交货期",
        price: "定价",
        risk: "风险状况",
        communication: "沟通"
      }
    },
    ai: {
      title: "SCM AI 策略师",
      subtitle: "预测分析与洞察",
      promptPlaceholder: "询问有关库存、风险或供应商的问题...",
      analyze: "分析",
      suggestions: "战略建议",
      thinking: "分析数据点..."
    },
    logistics: {
      title: "物流塔",
      subtitle: "全球货运追踪",
      addShipment: "添加运输",
      sortBy: "按预计到达时间排序",
      inboundAir: "入境空运",
      inboundOcean: "入境海运",
      customsHold: "海关扣留",
      activeUnits: "活跃运输",
      nextArrival: "下次到达",
      shipments: "运输",
      origin: "原产地",
      destination: "目的地",
      status: "状态"
    },
    crm: {
      title: "客户名录",
      addCustomer: "添加客户",
      search: "搜索客户..."
    },
    admin: {
      title: "管理面板",
      subtitle: "系统配置与治理",
      users: {
        title: "用户管理",
        createBtn: "创建用户",
        registerIdentity: "注册身份",
        tableUser: "用户",
        tableRole: "角色",
        tableActions: "操作"
      },
      system: {
        dbStatus: "数据库状态",
        connected: "已连接",
        version: "系统版本",
        editVersion: "编辑版本",
        updateVersion: "更新版本",
        versionWarning: "警告：手动更改系统版本将更新所有全局元数据。"
      },
      backup: {
        jsonTitle: "导出数据库",
        jsonDesc: "下载完整系统快照",
        downloadJson: "下载",
        generate: "生成快照",
        restoreDB: "恢复数据库",
        upload: "上传并恢复",
        csvTitle: "CSV 导出",
        csvDesc: "将数据导出到表格",
        productsBtn: "产品",
        jobsBtn: "订单"
      },
      audit: {
        exportCSV: "导出 CSV"
      },
      preferences: {
        theme: "界面主题",
        localization: "语言设置",
        startPage: "默认启动页"
      },
      tabs: {
        system: "系统",
        users: "用户",
        backup: "备份",
        audit: "审计",
        preferences: "个人设置"
      }
    },
    login: {
      subtitle: "企业级供应链管理器",
      email: "电子邮件地址",
      password: "密码",
      signIn: "登录"
    },
    specs: {
      title: "产品规格",
      dna: "产品 DNA",
      fabrication: "制造",
      material: "材料",
      construction: "结构",
      logistics: "物流",
      hsCode: "海关编码",
      dims: "尺寸",
      skuMatrix: "SKU 矩阵"
    },
    costing: {
      title: "单位成本计算器",
      subtitle: "生产成本详细明细",
      headers: { variable: "变量", value: "数值", notes: "备注" },
      variables: {
        materials: "原材料",
        labor: "人工",
        packaging: "包装",
        overhead: "日常开支",
        logistics: "入境物流",
        inspection: "质量控制"
      },
      logisticsVolume: "物流体积",
      labels: { weight: "重量", length: "长度", width: "宽度", height: "高度" }
    },
    tariffs: {
      title: "全球关税矩阵",
      subtitle: "各地区进口关税估算",
      headers: { country: "地区", base: "基本税率", fees: "费用", total: "总税率", notes: "备注" },
      entries: {
        usa: { name: "美国", notes: "适用301条款" },
        sa: { name: "南非", notes: "SADC优惠" },
        bahamas: { name: "巴哈马", notes: "CARICOM" },
        nigeria: { name: "尼日利亚", notes: "CET税率" },
        tanzania: { name: "坦桑尼亚", notes: "EAC税率" }
      }
    },
    factory: {
      title: "供应商与工厂组合",
      subtitle: "管理全球制造合作伙伴",
      search: "搜索供应商...",
      addBtn: "添加供应商",
      form: { name: "工厂名称", location: "地点", contact: "联系人", contactNo: "电话号码", moq: "最小起订量" }
    }
  },
  'zh-Hant': { 
    common: {
      save: "儲存",
      cancel: "取消",
      edit: "編輯",
      delete: "刪除",
      refresh: "重新整理",
      share: "分享",
      clickToEdit: "點擊編輯",
      copied: "已複製",
      search: "搜尋...",
      loading: "載入中...",
      actions: "操作",
      view: "檢視",
      export: "導出",
      print: "列印",
      submit: "提交",
      next: "下一步",
      back: "返回",
      finish: "完成",
      command: "命令",
      close: "關閉"
    },
    nav: {
      dashboard: "儀表板",
      productCatalog: "產品目錄",
      productWorkspace: "工作區",
      factoryMaster: "供應商與工廠組合",
      production: "訂單管理",
      shopFloor: "生產車間",
      logistics: "物流塔",
      crm: "客戶名錄",
      collaboration: "協作中心",
      teamChat: "團隊聊天",
      admin: "管理", 
      newProduct: "新增產品",
      analytics: "數據分析",
      sourcing: "採購管理",
      executionGroup: "執行中心",
      system: "系統設置",
      aiStrategist: "AI 策略師",
      calendar: "約束日曆",
      hub: "中心"
    },
    calendar: {
      title: "約束日曆",
      subtitle: "全球生產與物流約束",
      addEvent: "添加事件",
      addPlan: "添加計劃到日曆",
      calculator: "提前期計算器",
      eta: "預計到達時間 (ETA)",
      totalDays: "總天數",
      start: "開始日期",
      end: "結束日期",
      region: "地區",
      // --- CALCULATOR TRANSLATIONS ---
      calculationFor: "計算對象",
      selectItem: "選擇項目",
      quantity: "數量",
      destination: "目的地",
      breakdown: "明細 (天)",
      production: "生產",
      qualityCheck: "質檢",
      shipping: "運輸",
      customs: "報關",
      enterCity: "輸入城市或港口...",
      // --- NEW: TYPES & DROPDOWN ---
      typeJob: "訂單",
      typeSample: "樣品",
      typeProduct: "產品",
      select: "選擇"
    },
    hub: {
      title: "協作中心",
      subtitle: "全球留言板",
      newThread: "新話題",
      startNewThread: "開始新話題",
      topic: "話題",
      message: "消息",
      selectCustomer: "選擇客戶...",
      startConversation: "選擇一個話題開始協作",
      initialMessage: "初始消息..."
    },
    dashboard: {
      title: "運營儀表板",
      subtitle: "全球供應鏈脈動",
      activeJobs: "活躍訂單",
      globalSkus: "全球SKU數量",
      inventoryVal: "庫存價值",
      supplierHealth: "供應商評分",
      recentActivity: "近期動態",
      refreshPulse: "刷新脈動"
    },
    production: {
      title: "訂單管理",
      sampleTracker: "樣品追蹤",
      newJob: "新增訂單",
      requestSample: "請求樣品",
      status: "生產狀態",
      factory: "指定工廠",
      timeline: "交貨時間線",
      priority: "優先級",
      quantity: "數量",
      tabs: {
        production: "生產",
        samples: "樣品"
      }
    },
    shopFloor: {
      title: "生產車間",
      refresh: "刷新脈動"
    },
    catalog: {
      subtitle: "全球 SKU 目錄",
      addNew: "新增產品",
      sku: "SKU",
      category: "類別",
      cost: "單位成本"
    },
    workspace: {
      tabs: {
        specs: "規格",
        costing: "成本",
        tariffs: "關稅",
        exchange: "匯率",
        competitors: "情報",
        timeline: "時間表",
        ai: "AI 策略"
      }
    },
    teamChat: {
      title: "團隊協作",
      channels: "頻道",
      directMessages: "私信",
      typeMessage: "輸入訊息...",
      online: "在線",
      offline: "離線",
      teamGeneral: "綜合團隊",
      logisticsOps: "物流運營",
      productDesign: "產品設計",
      qaTeam: "QA團隊",
      shareVia: "分享至",
      recording: "錄音中...",
      deleteMsg: "刪除訊息"
    },
    competitor: {
      title: "競爭對手情報",
      subtitle: "市場分析與追蹤",
      trackNew: "追蹤新對手",
      marketShare: "市場份額",
      pricePosition: "價格定位",
      headers: { brand: "品牌", price: "價格", origin: "原產地", strength: "核心優勢" }
    },
    timeline: {
      title: "產品發布時間表",
      subtitle: "關鍵路徑管理",
      phases: {
        concept: { market: "全球", activity: "概念" },
        sampling: { market: "亞洲", activity: "樣品" },
        production: { market: "美國", activity: "生產" },
        logistics: { market: "歐洲", activity: "物流" },
        p1: { market: "全球", activity: "概念驗證" },
        p2: { market: "亞洲", activity: "原型製作" },
        p3: { market: "歐洲", activity: "試產" },
        p4: { market: "美國", activity: "批量生產" },
        p5: { market: "全球", activity: "正式發布" }
      },
      status: {
        completed: "已完成",
        inProgress: "進行中",
        pending: "待定",
        delayed: "延誤"
      },
      addMilestone: "添加里程碑"
    },
    hsLookup: {
      title: "HS 編碼情報",
      subtitle: "全球分類與合規",
      searchPlaceholder: "搜尋產品描述 (例如 '棉襯衫')...",
      results: "分類結果",
      code: "HS 編碼",
      description: "描述",
      duty: "稅率"
    },
    exchange: {
      title: "貨幣匯率",
      subtitle: "實時外匯匯率",
      base: "基礎貨幣",
      target: "目標貨幣",
      rate: "當前匯率",
      calculator: "轉換器"
    },
    scorecard: {
      title: "供應商評分卡",
      subtitle: "績效指標",
      grade: "總體評級",
      metrics: {
        quality: "質量",
        speed: "速度/交貨期",
        price: "定價",
        risk: "風險狀況",
        communication: "溝通"
      }
    },
    ai: {
      title: "SCM AI 策略師",
      subtitle: "預測分析與洞察",
      promptPlaceholder: "詢問有關庫存、風險或供應商的問題...",
      analyze: "分析",
      suggestions: "戰略建議",
      thinking: "分析數據點..."
    },
    logistics: {
      title: "物流塔",
      subtitle: "全球貨運追踪",
      addShipment: "添加運輸",
      sortBy: "按預計到達時間排序",
      inboundAir: "入境空運",
      inboundOcean: "入境海運",
      customsHold: "海關扣留",
      activeUnits: "活躍運輸",
      nextArrival: "下次到達",
      shipments: "運輸",
      origin: "原產地",
      destination: "目的地",
      status: "狀態"
    },
    crm: {
      title: "客戶名錄",
      addCustomer: "添加客戶",
      search: "搜尋客戶..."
    },
    admin: {
      title: "管理面板",
      subtitle: "系統配置與治理",
      users: {
        title: "用戶管理",
        createBtn: "創建用戶",
        registerIdentity: "註冊身份",
        tableUser: "用戶",
        tableRole: "角色",
        tableActions: "操作"
      },
      system: {
        dbStatus: "數據庫狀態",
        connected: "已連接",
        version: "系統版本",
        editVersion: "編輯版本",
        updateVersion: "更新版本",
        versionWarning: "警告：手動更改系統版本將更新所有全局元數據。"
      },
      backup: {
        jsonTitle: "匯出資料庫",
        jsonDesc: "下載完整系統快照",
        downloadJson: "下載",
        generate: "生成快照",
        restoreDB: "恢復資料庫",
        upload: "上傳並恢復",
        csvTitle: "CSV 導出",
        csvDesc: "將數據導出到表格",
        productsBtn: "產品",
        jobsBtn: "訂單"
      },
      audit: {
        exportCSV: "導出 CSV"
      },
      preferences: {
        theme: "介面主題",
        localization: "語言設置",
        startPage: "預設啟動頁"
      },
      tabs: {
        system: "系統",
        users: "用戶",
        backup: "備份",
        audit: "審計",
        preferences: "個人設置"
      }
    },
    login: {
      subtitle: "企業級供應鏈管理器",
      email: "電子郵件地址",
      password: "密碼",
      signIn: "登錄"
    },
    specs: {
      title: "產品規格",
      dna: "產品 DNA",
      fabrication: "製造",
      material: "材料",
      construction: "結構",
      logistics: "物流",
      hsCode: "海關編碼",
      dims: "尺寸",
      skuMatrix: "SKU 矩陣"
    },
    costing: {
      title: "單位成本計算器",
      subtitle: "生產成本詳細明細",
      headers: { variable: "變量", value: "數值", notes: "備註" },
      variables: {
        materials: "原材料",
        labor: "人工",
        packaging: "包裝",
        overhead: "日常開支",
        logistics: "入境物流",
        inspection: "質量控制"
      },
      logisticsVolume: "物流體積",
      labels: { weight: "重量", length: "長度", width: "寬度", height: "高度" }
    },
    tariffs: {
      title: "全球關稅矩陣",
      subtitle: "各地區進口關稅估算",
      headers: { country: "地區", base: "基本稅率", fees: "費用", total: "總稅率", notes: "備註" },
      entries: {
        usa: { name: "美國", notes: "適用301條款" },
        sa: { name: "南非", notes: "SADC優惠" },
        bahamas: { name: "巴哈馬", notes: "CARICOM" },
        nigeria: { name: "尼日利亞", notes: "CET稅率" },
        tanzania: { name: "坦桑尼亞", notes: "EAC稅率" }
      }
    },
    factory: {
      title: "供應商與工廠組合",
      subtitle: "管理全球製造合作伙伴",
      search: "搜尋供應商...",
      addBtn: "添加供應商",
      form: { name: "工廠名稱", location: "地點", contact: "聯繫人", contactNo: "電話號碼", moq: "最小起訂量" }
    }
  }
};