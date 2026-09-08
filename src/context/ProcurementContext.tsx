import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Supplier,
  RFQ,
  Quotation,
  PurchaseOrder,
  InventoryItem,
  SpendRecord,
  PriceForecast,
  AIRecommendation,
  Notification,
  User,
  ChatMessage,
  ScoringWeights
} from '../types/procurement';
import {
  initialUser,
  initialSuppliers,
  initialRFQs,
  initialQuotations,
  initialPurchaseOrders,
  initialInventory,
  initialSpendData,
  priceForecasts as initialPriceForecasts,
  initialRecommendations,
  initialNotifications,
  presetChatMessages
} from '../data/mockData';

interface AIProcessingState {
  isOpen: boolean;
  title: string;
  steps: string[];
  currentStep: number;
  isComplete: boolean;
  resultData?: any;
}

interface ProcurementContextType {
  activePage: string;
  setActivePage: (page: string, params?: { supplierId?: string; rfqId?: string; material?: string; targetId?: string }) => void;
  selectedSupplierId: string | null;
  setSelectedSupplierId: (id: string | null) => void;
  selectedRFQId: string | null;
  setSelectedRFQId: (id: string | null) => void;
  selectedMaterial: string;
  setSelectedMaterial: (mat: string) => void;
  
  isAuthenticated: boolean;
  user: User;
  suppliers: Supplier[];
  rfqs: RFQ[];
  quotations: Quotation[];
  purchaseOrders: PurchaseOrder[];
  inventory: InventoryItem[];
  spendData: SpendRecord[];
  forecasts: Record<string, PriceForecast>;
  recommendations: AIRecommendation[];
  notifications: Notification[];
  chatMessages: ChatMessage[];
  scoringWeights: ScoringWeights;
  
  // Search & Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  aiProcessing: AIProcessingState;
  setAiProcessing: React.Dispatch<React.SetStateAction<AIProcessingState>>;
  
  // Actions
  createRFQ: (data: Omit<RFQ, 'id' | 'createdAt' | 'status' | 'responseCount'>) => RFQ;
  evaluateQuotationsAI: (rfqId: string) => void;
  runSupplierRiskAnalysisAI: (supplierId: string) => void;
  generatePurchasePlanAI: (material: string) => void;
  generateReorderRecommendationAI: (inventoryId: string) => void;
  sendChatMessage: (text: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateScoringWeights: (newWeights: ScoringWeights) => void;
  loginWithDemo: () => void;
  logout: () => void;
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

export const ProcurementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<string>('dashboard');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>('sup-001');
  const [selectedRFQId, setSelectedRFQId] = useState<string | null>('RFQ-2026-001');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('Steel');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('procureai_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('procureai_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [rfqs, setRfqs] = useState<RFQ[]>(() => {
    const saved = localStorage.getItem('procureai_rfqs');
    return saved ? JSON.parse(saved) : initialRFQs;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('procureai_quotations');
    return saved ? JSON.parse(saved) : initialQuotations;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('procureai_orders');
    return saved ? JSON.parse(saved) : initialPurchaseOrders;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('procureai_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('procureai_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(initialRecommendations);
  const [spendData] = useState<SpendRecord[]>(initialSpendData);
  const [forecasts] = useState<Record<string, PriceForecast>>(initialPriceForecasts);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(presetChatMessages);

  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>({
    price: 30,
    quality: 25,
    delivery: 20,
    risk: 15,
    performance: 10
  });

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [aiProcessing, setAiProcessing] = useState<AIProcessingState>({
    isOpen: false,
    title: '',
    steps: [],
    currentStep: 0,
    isComplete: false
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('procureai_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('procureai_rfqs', JSON.stringify(rfqs));
  }, [rfqs]);

  useEffect(() => {
    localStorage.setItem('procureai_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('procureai_orders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('procureai_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('procureai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const setActivePage = (page: string, params?: { supplierId?: string; rfqId?: string; material?: string; targetId?: string }) => {
    setActivePageState(page);
    if (params?.supplierId) setSelectedSupplierId(params.supplierId);
    if (params?.rfqId) setSelectedRFQId(params.rfqId);
    if (params?.material) setSelectedMaterial(params.material);
    if (params?.targetId) {
      if (page === 'suppliers' || page === 'risk') setSelectedSupplierId(params.targetId);
      if (page === 'rfqs' || page === 'quotations') setSelectedRFQId(params.targetId);
      if (page === 'forecast') setSelectedMaterial(params.targetId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createRFQ = (data: Omit<RFQ, 'id' | 'createdAt' | 'status' | 'responseCount'>): RFQ => {
    const newId = `RFQ-2026-${String(rfqs.length + 1).padStart(3, '0')}`;
    const newRFQ: RFQ = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'OPEN',
      responseCount: 0
    };

    setRfqs(prev => [newRFQ, ...prev]);

    // Create notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'New RFQ Created',
      description: `${newRFQ.id} for ${newRFQ.product} dispatched to ${newRFQ.invitedSuppliersCount} suppliers.`,
      timestamp: 'Just now',
      type: 'QUOTE',
      isRead: false,
      targetPage: 'rfqs',
      targetId: newId
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newRFQ;
  };

  const evaluateQuotationsAI = (rfqId: string) => {
    setAiProcessing({
      isOpen: true,
      title: 'ProcureAI Quotation Optimizer',
      steps: [
        'Parsing supplier pricing, lead times & quality certifications...',
        'Cross-referencing historical ERP performance & defect rates...',
        'Applying weighted multi-criteria decision decision matrix...',
        'Generating optimal awarding rationale & risk trade-offs...'
      ],
      currentStep: 0,
      isComplete: false
    });

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < 4) {
        setAiProcessing(prev => ({ ...prev, currentStep: current }));
      } else {
        clearInterval(interval);
        setQuotations(prev =>
          prev.map(q => {
            if (q.rfqId === rfqId) {
              if (q.supplierId === 'sup-005' || q.id.endsWith('-c')) {
                return { ...q, status: 'RECOMMENDED', overallScore: 94 };
              }
              return { ...q, status: 'SHORTLISTED' };
            }
            return q;
          })
        );
        setAiProcessing(prev => ({ ...prev, isComplete: true }));
      }
    }, 900);
  };

  const runSupplierRiskAnalysisAI = (supplierId: string) => {
    const targetSupplier = suppliers.find(s => s.id === supplierId);
    setAiProcessing({
      isOpen: true,
      title: `AI Risk Deep-Dive: ${targetSupplier?.name || 'Supplier'}`,
      steps: [
        'Ingesting credit solvency & financial liquidity feeds...',
        'Evaluating port log telemetry & shipment delay rates...',
        'Scanning quality audit complaints & RMA returns...',
        'Synthesizing supply chain risk mitigation recommendations...'
      ],
      currentStep: 0,
      isComplete: false
    });

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < 4) {
        setAiProcessing(prev => ({ ...prev, currentStep: current }));
      } else {
        clearInterval(interval);
        setSuppliers(prev =>
          prev.map(s => {
            if (s.id === supplierId) {
              return {
                ...s,
                riskScore: 85,
                financialRiskScore: 92,
                deliveryRiskScore: 84,
                riskReason: 'AI Real-Time Analysis: Delivery delay variance +29%, solvency score dropped to CCC rating, and lead time extended to 18 days.'
              };
            }
            return s;
          })
        );
        setAiProcessing(prev => ({ ...prev, isComplete: true }));
      }
    }, 900);
  };

  const generatePurchasePlanAI = (material: string) => {
    setAiProcessing({
      isOpen: true,
      title: `Strategic Purchase Plan: ${material}`,
      steps: [
        'Analyzing global commodity futures & market supply curves...',
        'Predicting 30/60/90 day price movement probabilities...',
        'Calculating optimal order split to minimize cost risk...',
        'Drafting blanket purchase order parameters...'
      ],
      currentStep: 0,
      isComplete: false
    });

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < 4) {
        setAiProcessing(prev => ({ ...prev, currentStep: current }));
      } else {
        clearInterval(interval);
        setAiProcessing(prev => ({
          ...prev,
          isComplete: true,
          resultData: {
            material,
            action: 'Purchase Plan Generated',
            details: `Recommended action: Procure 60% (6,000 units) now at current ₹72/kg rate, and reserve 40% for post-tariff price stabilization.`
          }
        }));
      }
    }, 900);
  };

  const generateReorderRecommendationAI = (inventoryId: string) => {
    const item = inventory.find(i => i.id === inventoryId);
    setAiProcessing({
      isOpen: true,
      title: `Inventory Demand Prediction: ${item?.product || 'Item'}`,
      steps: [
        'Fetching 90-day daily burn rate & production line schedule...',
        'Evaluating supplier lead time variance & transit buffers...',
        'Generating optimal Economic Order Quantity (EOQ)...',
        'Creating automated replenishment RFQ draft...'
      ],
      currentStep: 0,
      isComplete: false
    });

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < 4) {
        setAiProcessing(prev => ({ ...prev, currentStep: current }));
      } else {
        clearInterval(interval);
        if (item) {
          createRFQ({
            title: `Replenishment: ${item.product}`,
            product: item.product,
            category: item.category,
            quantity: item.reorderPoint * 2,
            unit: item.unit,
            targetPrice: item.unitPrice,
            deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            invitedSuppliersCount: 3,
            deliveryDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
            description: `Automated AI replenishment RFQ triggered due to critical stock buffer threshold.`,
            invitedSupplierIds: ['sup-003', 'sup-005', 'sup-016']
          });
        }
        setAiProcessing(prev => ({ ...prev, isComplete: true }));
      }
    }, 900);
  };

  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Simulated AI response generation logic based on keywords
    setTimeout(() => {
      let aiText = '';
      let dataTable: any = undefined;
      let actionLink: any = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('high risk') || lower.includes('risky') || lower.includes('risk')) {
        aiText = 'Based on our real-time risk index, **Global Materials Ltd.** (Score: 82/100, HIGH) and **Shenzhen Micro Semi** (Score: 79/100, HIGH) pose the highest operational threat due to financial liquidity strains and high defect rates.';
        dataTable = {
          headers: ['Supplier', 'Risk Score', 'Risk Level', 'Primary Driver'],
          rows: [
            ['Global Materials Ltd.', '82 / 100', 'HIGH', 'Financial liquidity & +27% delays'],
            ['Shenzhen Micro Semi', '79 / 100', 'HIGH', 'Quality complaints & price volatility'],
            ['Dynaco Fasteners', '64 / 100', 'MEDIUM', 'Inconsistent lead times']
          ]
        };
        actionLink = { label: 'Open Supplier Risk Dashboard', page: 'risk' };
      } else if (lower.includes('best quotation') || lower.includes('rfq') || lower.includes('quote')) {
        aiText = 'For **RFQ-2026-001 (Industrial Steel Components)**, **Supplier C (SteelWorks India)** is the recommended awardee. Although its unit price (₹101) is 3% higher than Supplier B (₹92), it offers a **5-day delivery (9 days faster)**, a **97% quality score**, and a **94% overall multi-criteria AI rating**.';
        actionLink = { label: 'Compare Quotations for RFQ-2026-001', page: 'quotations', targetId: 'RFQ-2026-001' };
      } else if (lower.includes('reduce') || lower.includes('save') || lower.includes('cost')) {
        aiText = 'ProcureAI has identified **$184,000 in potential annual savings** across your direct materials and electronics categories. The top opportunity is **Supplier Consolidation** across 3 raw material vendors (est. $84,000 savings).';
        actionLink = { label: 'View All AI Recommendations', page: 'recommendations' };
      } else if (lower.includes('steel') || lower.includes('buy now') || lower.includes('price')) {
        aiText = 'Steel prices are forecasted to rise **+8.3% from ₹72/kg to ₹78/kg** over the next 30 days with **87% confidence**. We recommend procuring **60% of your planned Q4 volume now** to lock in existing prices.';
        actionLink = { label: 'View Steel Price Forecast', page: 'forecast', targetId: 'Steel' };
      } else {
        aiText = `Analyzing your procurement database for "${text}"... Currently, your active spend is **$1.24M** across 128 suppliers with **24 open RFQs**. All systems are operating normally.`;
      }

      const aiMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dataTable,
        actionLink
      };

      setChatMessages(prev => [...prev, aiMsg]);
    }, 800);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateScoringWeights = (newWeights: ScoringWeights) => {
    setScoringWeights(newWeights);
  };

  const loginWithDemo = () => {
    setIsAuthenticated(true);
    setUser(initialUser);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ProcurementContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedSupplierId,
        setSelectedSupplierId,
        selectedRFQId,
        setSelectedRFQId,
        selectedMaterial,
        setSelectedMaterial,
        isAuthenticated,
        user,
        suppliers,
        rfqs,
        quotations,
        purchaseOrders,
        inventory,
        spendData,
        forecasts,
        recommendations,
        notifications,
        chatMessages,
        scoringWeights,
        isSearchOpen,
        setIsSearchOpen,
        aiProcessing,
        setAiProcessing,
        createRFQ,
        evaluateQuotationsAI,
        runSupplierRiskAnalysisAI,
        generatePurchasePlanAI,
        generateReorderRecommendationAI,
        sendChatMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateScoringWeights,
        loginWithDemo,
        logout
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};
