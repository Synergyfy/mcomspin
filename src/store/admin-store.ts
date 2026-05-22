import { create } from 'zustand';

export interface AdminBusiness {
  id: string;
  name: string;
  email: string;
  owner: string;
  avatar: string;
  category: string;
  registrationDate: string;
  status: 'pending' | 'active' | 'suspended';
  riskScore: number; // 0 to 100
  leadConversion: number; // percentage
  campaignsCount: number;
  partnerTier: 'Silver' | 'Gold' | 'Platinum';
  spotlightState: 'active' | 'scheduled' | 'inactive';
}

export interface ProbabilitySegment {
  id: string;
  rewardName: string;
  provider: string;
  currentWeight: number; // 0 - 100
  capPerDay: number;
  allocatedToday: number;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  type: 'lead_route' | 'reward_unlock' | 'partner_sync' | 'security_flag';
  description: string;
  nodeOrigin: string;
  nodeDest: string;
  status: 'completed' | 'routing' | 'flagged';
}

export interface SecurityAlert {
  id: string;
  businessName: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  pattern: string;
  status: 'unresolved' | 'resolved' | 'dismissed';
}

export interface SpotlightCampaign {
  id: string;
  businessName: string;
  campaignName: string;
  day: string; // e.g. 'Monday', 'Tuesday'
  weight: number;
  status: 'active' | 'scheduled';
}

interface AdminState {
  // KPIs
  totalActiveBusinesses: number;
  totalRewardsAllocated: number;
  leadConversionRate: number;
  totalPlatformRevenue: number;

  // Primary states
  businesses: AdminBusiness[];
  probabilities: ProbabilitySegment[];
  telemetryLogs: TelemetryLog[];
  securityAlerts: SecurityAlert[];
  spotlights: SpotlightCampaign[];
  systemHealthIndex: number;
  activeInspectorId: string | null;
  activeInspectorType: 'business' | 'probability' | 'alert' | null;

  // Actions
  verifyBusiness: (id: string) => void;
  suspendBusiness: (id: string) => void;
  deleteBusiness: (id: string) => void;
  setProbabilityWeight: (id: string, weight: number) => void;
  resolveAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  setInspector: (type: 'business' | 'probability' | 'alert' | null, id: string | null) => void;
  addBusiness: (business: Omit<AdminBusiness, 'id' | 'registrationDate' | 'status' | 'riskScore' | 'campaignsCount'>) => void;
  addTelemetryLog: (log: Omit<TelemetryLog, 'id' | 'timestamp'>) => void;
  updateSpotlightWeight: (id: string, weight: number) => void;
  triggerSecurityAlert: (alert: Omit<SecurityAlert, 'id' | 'timestamp' | 'status'>) => void;
}

const initialBusinesses: AdminBusiness[] = [
  {
    id: 'b-1',
    name: 'Meridian Apparel',
    email: 'contact@meridianapparel.co',
    owner: 'Sarah Jenkins',
    avatar: 'MA',
    category: 'Luxury Fashion',
    registrationDate: '2026-01-10',
    status: 'active',
    riskScore: 8,
    leadConversion: 28.4,
    campaignsCount: 3,
    partnerTier: 'Platinum',
    spotlightState: 'active',
  },
  {
    id: 'b-2',
    name: 'Elara Wellness',
    email: 'info@elarawellness.com',
    owner: 'Elena Rostova',
    avatar: 'EW',
    category: 'Spa Services',
    registrationDate: '2026-02-14',
    status: 'active',
    riskScore: 3,
    leadConversion: 34.2,
    campaignsCount: 2,
    partnerTier: 'Gold',
    spotlightState: 'scheduled',
  },
  {
    id: 'b-3',
    name: 'Vantage Electronics',
    email: 'hello@vantage-electronics.io',
    owner: 'Henry Chen',
    avatar: 'VE',
    category: 'Consumer Tech',
    registrationDate: '2026-03-01',
    status: 'active',
    riskScore: 12,
    leadConversion: 21.8,
    campaignsCount: 4,
    partnerTier: 'Platinum',
    spotlightState: 'inactive',
  },
  {
    id: 'b-4',
    name: 'Soleil Dining Group',
    email: 'reservations@soleildining.net',
    owner: 'Marcus Aurel',
    avatar: 'SD',
    category: 'Hospitality',
    registrationDate: '2026-03-18',
    status: 'active',
    riskScore: 5,
    leadConversion: 19.5,
    campaignsCount: 2,
    partnerTier: 'Gold',
    spotlightState: 'active',
  },
  {
    id: 'b-5',
    name: 'Nebula Coffee Labs',
    email: 'franchise@nebulacoffeelabs.com',
    owner: 'Cassandra Croft',
    avatar: 'NC',
    category: 'Hospitality',
    registrationDate: '2026-05-19',
    status: 'pending',
    riskScore: 15,
    leadConversion: 0,
    campaignsCount: 0,
    partnerTier: 'Silver',
    spotlightState: 'inactive',
  },
  {
    id: 'b-6',
    name: 'Aether Skincare',
    email: 'support@aetherskin.com',
    owner: 'Javier Castillo',
    avatar: 'AS',
    category: 'Spa Services',
    registrationDate: '2026-05-20',
    status: 'pending',
    riskScore: 24,
    leadConversion: 0,
    campaignsCount: 0,
    partnerTier: 'Silver',
    spotlightState: 'inactive',
  },
  {
    id: 'b-7',
    name: 'Zephyr Activewear',
    email: 'wholesale@zephyractive.com',
    owner: 'Maya Lin',
    avatar: 'ZA',
    category: 'Luxury Fashion',
    registrationDate: '2026-04-12',
    status: 'suspended',
    riskScore: 88,
    leadConversion: 14.2,
    campaignsCount: 1,
    partnerTier: 'Silver',
    spotlightState: 'inactive',
  },
];

const initialProbabilities: ProbabilitySegment[] = [
  {
    id: 'p-1',
    rewardName: '20% Off Styling Session',
    provider: 'Meridian Apparel',
    currentWeight: 45,
    capPerDay: 150,
    allocatedToday: 42,
  },
  {
    id: 'p-2',
    rewardName: 'Complimentary Detox Facial',
    provider: 'Elara Wellness',
    currentWeight: 15,
    capPerDay: 20,
    allocatedToday: 8,
  },
  {
    id: 'p-3',
    rewardName: 'Premium Multi-Adapter Charger',
    provider: 'Vantage Electronics',
    currentWeight: 10,
    capPerDay: 50,
    allocatedToday: 14,
  },
  {
    id: 'p-4',
    rewardName: '$50 Gourmet Tasting Credit',
    provider: 'Soleil Dining Group',
    currentWeight: 15,
    capPerDay: 30,
    allocatedToday: 11,
  },
  {
    id: 'p-5',
    rewardName: 'VIP Apparel Showcase Pass',
    provider: 'Meridian Apparel',
    currentWeight: 10,
    capPerDay: 40,
    allocatedToday: 9,
  },
  {
    id: 'p-6',
    rewardName: 'Signature Organic Massage',
    provider: 'Elara Wellness',
    currentWeight: 5,
    capPerDay: 10,
    allocatedToday: 3,
  },
];

const initialTelemetry: TelemetryLog[] = [
  {
    id: 'log-1',
    timestamp: '20:19:45',
    type: 'lead_route',
    description: 'Routing verification tag for user "David K." to Meridian Apparel',
    nodeOrigin: 'MComSpin Gateway',
    nodeDest: 'Meridian CRM',
    status: 'completed',
  },
  {
    id: 'log-2',
    timestamp: '20:18:12',
    type: 'reward_unlock',
    description: 'Unlocked reward credit ID #77192 (Complimentary Facial)',
    nodeOrigin: 'Ecosystem Spin Engine',
    nodeDest: 'Elara Wallet Node',
    status: 'completed',
  },
  {
    id: 'log-3',
    timestamp: '20:17:05',
    type: 'partner_sync',
    description: 'Spotlight dynamic weight synchronization triggered',
    nodeOrigin: 'Platform Scheduler',
    nodeDest: 'Partner Ad Server',
    status: 'completed',
  },
  {
    id: 'log-4',
    timestamp: '20:15:30',
    type: 'security_flag',
    description: 'Rapid rotation requests detected from localized IP (suspicion of automation)',
    nodeOrigin: 'WAF Rate Limiter',
    nodeDest: 'Fraud Detection Ledger',
    status: 'flagged',
  },
];

const initialAlerts: SecurityAlert[] = [
  {
    id: 'alert-1',
    businessName: 'Zephyr Activewear',
    severity: 'high',
    timestamp: '2026-05-21 19:12:00',
    pattern: 'Automated script generated 42 fictitious customer emails in 180 seconds.',
    status: 'unresolved',
  },
  {
    id: 'alert-2',
    businessName: 'Vantage Electronics',
    severity: 'medium',
    timestamp: '2026-05-21 17:40:00',
    pattern: 'Unusually high redemption rate (94%) detected on free adapter codes.',
    status: 'unresolved',
  },
  {
    id: 'alert-3',
    businessName: 'Meridian Apparel',
    severity: 'low',
    timestamp: '2026-05-21 14:22:00',
    pattern: 'Partner API key initialized from secondary geographical region.',
    status: 'resolved',
  },
];

const initialSpotlights: SpotlightCampaign[] = [
  { id: 's-1', businessName: 'Meridian Apparel', campaignName: 'Summer Lead Blitz', day: 'Monday', weight: 40, status: 'active' },
  { id: 's-2', businessName: 'Elara Wellness', campaignName: 'Partner Spotlight Q3', day: 'Wednesday', weight: 25, status: 'scheduled' },
  { id: 's-3', businessName: 'Soleil Dining Group', campaignName: 'Gourmet Lounge Rotating Spotlight', day: 'Friday', weight: 35, status: 'active' },
  { id: 's-4', businessName: 'Vantage Electronics', campaignName: 'Tech Core Stock Release', day: 'Sunday', weight: 20, status: 'scheduled' },
];

export const useAdminStore = create<AdminState>((set) => ({
  totalActiveBusinesses: 4,
  totalRewardsAllocated: 2840,
  leadConversionRate: 26.2,
  totalPlatformRevenue: 142850,

  businesses: initialBusinesses,
  probabilities: initialProbabilities,
  telemetryLogs: initialTelemetry,
  securityAlerts: initialAlerts,
  spotlights: initialSpotlights,
  systemHealthIndex: 99.98,
  activeInspectorId: null,
  activeInspectorType: null,

  verifyBusiness: (id) =>
    set((state) => {
      const updated = state.businesses.map((b) =>
        b.id === id ? { ...b, status: 'active' as const } : b
      );
      const activeCount = updated.filter((b) => b.status === 'active').length;
      return {
        businesses: updated,
        totalActiveBusinesses: activeCount,
        telemetryLogs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toTimeString().split(' ')[0],
            type: 'partner_sync',
            description: `Verified and onboarded merchant profile ${updated.find(x => x.id === id)?.name || id}`,
            nodeOrigin: 'Admin Governance Panel',
            nodeDest: 'Partner Registry Gateway',
            status: 'completed',
          },
          ...state.telemetryLogs,
        ],
      };
    }),

  suspendBusiness: (id) =>
    set((state) => {
      const updated = state.businesses.map((b) =>
        b.id === id ? { ...b, status: 'suspended' as const } : b
      );
      const activeCount = updated.filter((b) => b.status === 'active').length;
      return {
        businesses: updated,
        totalActiveBusinesses: activeCount,
        telemetryLogs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toTimeString().split(' ')[0],
            type: 'security_flag',
            description: `Suspended partner credentials for account ${updated.find(x => x.id === id)?.name || id}`,
            nodeOrigin: 'Admin Governance Panel',
            nodeDest: 'Partner Authentication Broker',
            status: 'flagged',
          },
          ...state.telemetryLogs,
        ],
      };
    }),

  deleteBusiness: (id) =>
    set((state) => {
      const updated = state.businesses.filter((b) => b.id !== id);
      const activeCount = updated.filter((b) => b.status === 'active').length;
      return {
        businesses: updated,
        totalActiveBusinesses: activeCount,
      };
    }),

  setProbabilityWeight: (id, weight) =>
    set((state) => ({
      probabilities: state.probabilities.map((p) =>
        p.id === id ? { ...p, currentWeight: weight } : p
      ),
      telemetryLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toTimeString().split(' ')[0],
          type: 'partner_sync',
          description: `Updated segment weighting target balance value: ${weight}`,
          nodeOrigin: 'Orchestrator Weight Controller',
          nodeDest: 'Ecosystem Spin Engine',
          status: 'completed',
        },
        ...state.telemetryLogs,
      ],
    })),

  resolveAlert: (id) =>
    set((state) => ({
      securityAlerts: state.securityAlerts.map((a) =>
        a.id === id ? { ...a, status: 'resolved' as const } : a
      ),
    })),

  dismissAlert: (id) =>
    set((state) => ({
      securityAlerts: state.securityAlerts.map((a) =>
        a.id === id ? { ...a, status: 'dismissed' as const } : a
      ),
    })),

  setInspector: (type, id) =>
    set({
      activeInspectorType: type,
      activeInspectorId: id,
    }),

  addBusiness: (business) =>
    set((state) => {
      const newId = `b-${state.businesses.length + 1}`;
      const newBiz: AdminBusiness = {
        ...business,
        id: newId,
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        riskScore: Math.floor(Math.random() * 20) + 1,
        campaignsCount: 0,
      };
      return {
        businesses: [...state.businesses, newBiz],
        telemetryLogs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toTimeString().split(' ')[0],
            type: 'partner_sync',
            description: `Queued verification application for "${business.name}"`,
            nodeOrigin: 'Partner Self-Service Portal',
            nodeDest: 'Admin Verification Queue',
            status: 'completed',
          },
          ...state.telemetryLogs,
        ],
      };
    }),

  addTelemetryLog: (log) =>
    set((state) => ({
      telemetryLogs: [
        {
          ...log,
          id: `log-${Date.now()}`,
          timestamp: new Date().toTimeString().split(' ')[0],
        },
        ...state.telemetryLogs.slice(0, 49), // Cap logs at 50
      ],
    })),

  updateSpotlightWeight: (id, weight) =>
    set((state) => ({
      spotlights: state.spotlights.map((s) =>
        s.id === id ? { ...s, weight } : s
      ),
    })),

  triggerSecurityAlert: (alert) =>
    set((state) => {
      const newId = `alert-${state.securityAlerts.length + 1}`;
      return {
        securityAlerts: [
          {
            ...alert,
            id: newId,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'unresolved',
          },
          ...state.securityAlerts,
        ],
        systemHealthIndex: parseFloat((state.systemHealthIndex - 0.05).toFixed(2)),
      };
    }),
}));
