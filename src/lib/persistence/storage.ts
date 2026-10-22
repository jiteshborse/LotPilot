import { CalculationResult, InstrumentSpecification, RiskMode } from '../calculations/types';

export interface UserPreferences {
  accountCurrency: string;
  riskMode: RiskMode;
  defaultRiskCash: number;
  defaultRiskPct: number;
  defaultAccountEquity: number;
  defaultBrokerProfileId?: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  accountCurrency: 'USD',
  riskMode: 'fixed_cash',
  defaultRiskCash: 50,
  defaultRiskPct: 1.0,
  defaultAccountEquity: 10000,
  defaultBrokerProfileId: 'raw-ecn',
};

export interface HistoryItem {
  id: string;
  timestamp: number;
  result: CalculationResult;
  notes?: string;
}

export interface StagedTrade {
  id: string;
  timestamp: number;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: string;
  stopLossPrice: string;
  permittedQuantity: string;
  quantityUnit: string;
  grossEstimatedRisk: string;
  accountCurrency: string;
  notes?: string;
}

const STORAGE_KEYS = {
  PREFERENCES: 'lotpilot_v1_preferences',
  HISTORY: 'lotpilot_v1_history',
  CUSTOM_INSTRUMENTS: 'lotpilot_v1_custom_instruments',
  STAGED_TRADES: 'lotpilot_v1_staged_trades',
};

export class PersistenceManager {
  // -------------------------------------------------------------
  // Preferences
  // -------------------------------------------------------------
  public static getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (!stored) return DEFAULT_PREFERENCES;
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  public static savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch {
      console.warn('Failed to save preferences to localStorage.');
    }
    return updated;
  }

  // -------------------------------------------------------------
  // Calculation History
  // -------------------------------------------------------------
  public static getHistory(): HistoryItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public static addHistoryItem(result: CalculationResult, notes?: string): HistoryItem {
    const history = this.getHistory();
    const newItem: HistoryItem = {
      id: `calc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      result,
      notes,
    };

    // Keep most recent 100 items
    const updated = [newItem, ...history].slice(0, 100);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch {
      console.warn('Failed to save calculation history.');
    }
    return newItem;
  }

  public static removeHistoryItem(id: string): void {
    const history = this.getHistory();
    const updated = history.filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch {
      console.warn('Failed to update calculation history.');
    }
  }

  public static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {
      console.warn('Failed to clear calculation history.');
    }
  }

  // -------------------------------------------------------------
  // Custom Instruments
  // -------------------------------------------------------------
  public static getCustomInstruments(): InstrumentSpecification[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_INSTRUMENTS);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public static saveCustomInstrument(spec: InstrumentSpecification): void {
    const current = this.getCustomInstruments();
    const existingIndex = current.findIndex((i) => i.id === spec.id);
    let updated: InstrumentSpecification[];

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = spec;
    } else {
      updated = [spec, ...current];
    }

    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_INSTRUMENTS, JSON.stringify(updated));
    } catch {
      console.warn('Failed to save custom instrument.');
    }
  }

  public static deleteCustomInstrument(id: string): void {
    const current = this.getCustomInstruments();
    const updated = current.filter((i) => i.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_INSTRUMENTS, JSON.stringify(updated));
    } catch {
      console.warn('Failed to delete custom instrument.');
    }
  }

  // -------------------------------------------------------------
  // Multi-Trade Planner (Staged Positions)
  // -------------------------------------------------------------
  public static getStagedTrades(): StagedTrade[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STAGED_TRADES);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public static stageTrade(trade: Omit<StagedTrade, 'id' | 'timestamp'>): StagedTrade {
    const list = this.getStagedTrades();
    const newTrade: StagedTrade = {
      ...trade,
      id: `stage-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    const updated = [newTrade, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.STAGED_TRADES, JSON.stringify(updated));
    } catch {
      console.warn('Failed to stage trade.');
    }
    return newTrade;
  }

  public static removeStagedTrade(id: string): void {
    const list = this.getStagedTrades();
    const updated = list.filter((t) => t.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.STAGED_TRADES, JSON.stringify(updated));
    } catch {
      console.warn('Failed to remove staged trade.');
    }
  }

  public static clearStagedTrades(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.STAGED_TRADES);
    } catch {
      console.warn('Failed to clear staged trades.');
    }
  }

  // -------------------------------------------------------------
  // Export History as CSV
  // -------------------------------------------------------------
  public static exportHistoryToCsv(): string {
    const history = this.getHistory();
    if (history.length === 0) return '';

    const headers = [
      'Timestamp',
      'Date',
      'Asset Class',
      'Symbol',
      'Direction',
      'Entry Price',
      'Stop Loss Price',
      'Stop Distance',
      'Risk Budget',
      'Account Currency',
      'Theoretical Quantity',
      'Permitted Quantity',
      'Quantity Unit',
      'Gross Risk',
      'All-In Risk',
      'Notional Exposure',
      'Specification Source',
    ];

    const rows = history.map((item) => {
      const r = item.result;
      return [
        item.timestamp,
        new Date(item.timestamp).toISOString(),
        r.assetClass,
        r.instrumentSymbol,
        r.direction.toUpperCase(),
        r.entryPrice,
        r.stopLossPrice,
        `"${r.stopLossDistanceDisplay}"`,
        r.riskBudget,
        r.accountCurrency,
        r.theoreticalQuantity,
        r.permittedQuantity,
        r.quantityUnit,
        r.grossEstimatedRisk,
        r.allInEstimatedRisk,
        r.notionalExposure,
        r.specificationSource,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }
}
