
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. DEFAULT VALUES
const DEFAULT_TARIFFS: Record<string, number> = {
    'USA': 0.156,
    'South Africa': 0.45,
    'Nigeria': 0.35,
    'Tanzania': 0.35,
    'Bahamas': 0.45
};

const DEFAULT_VERSION = "v3.05 (2026 Build)";

const KEYS = {
    TARIFFS: 'usuppli_tariffs',
    LOCKED: 'usuppli_locked_tariffs',
    VERSION: 'usuppli_version'
};

// 2. TYPES
interface GlobalConfigContextType {
    tariffs: Record<string, number>;
    lockedTariffs: string[];
    systemVersion: string;
    updateTariff: (country: string, newRate: string | number) => void;
    toggleTariffLock: (country: string) => void;
    updateVersion: (newVersionString: string) => void;
    resetAll: () => void;
}

// 3. CREATE CONTEXT
const GlobalConfigContext = createContext<GlobalConfigContextType | undefined>(undefined);

// 4. EXPORT HOOK
export const useGlobalConfig = () => {
    const context = useContext(GlobalConfigContext);
    if (context === undefined) {
        // Fallback for safety, though provider should be present
        return {} as GlobalConfigContextType;
    }
    return context;
};

// 5. EXPORT PROVIDER
export const GlobalConfigProvider = ({ children }: { children: ReactNode }) => {
    // Initialize Tariffs
    const [tariffs, setTariffs] = useState<Record<string, number>>(() => {
        try {
            const saved = localStorage.getItem(KEYS.TARIFFS);
            return saved ? JSON.parse(saved) : DEFAULT_TARIFFS;
        } catch (error) {
            console.error("Config Load Error:", error);
            return DEFAULT_TARIFFS;
        }
    });

    // Initialize Locked Tariffs
    const [lockedTariffs, setLockedTariffs] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem(KEYS.LOCKED);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Initialize Version
    const [systemVersion, setSystemVersion] = useState<string>(() => {
        return localStorage.getItem(KEYS.VERSION) || DEFAULT_VERSION;
    });

    // Action: Update Tariff
    const updateTariff = (country: string, newRate: string | number) => {
        const val = parseFloat(newRate as string);
        const validRate = isNaN(val) ? 0 : val;
        
        const updatedTariffs = { ...tariffs, [country]: validRate };
        setTariffs(updatedTariffs);
        localStorage.setItem(KEYS.TARIFFS, JSON.stringify(updatedTariffs));
    };

    // Action: Toggle Tariff Lock
    const toggleTariffLock = (country: string) => {
        const next = lockedTariffs.includes(country) 
            ? lockedTariffs.filter(c => c !== country) 
            : [...lockedTariffs, country];
        setLockedTariffs(next);
        localStorage.setItem(KEYS.LOCKED, JSON.stringify(next));
    };

    // Action: Update Version
    const updateVersion = (newVersionString: string) => {
        setSystemVersion(newVersionString);
        localStorage.setItem(KEYS.VERSION, newVersionString);
    };

    // Action: Reset
    const resetAll = () => {
        setTariffs(DEFAULT_TARIFFS);
        setLockedTariffs([]);
        setSystemVersion(DEFAULT_VERSION);
        localStorage.removeItem(KEYS.TARIFFS);
        localStorage.removeItem(KEYS.LOCKED);
        localStorage.removeItem(KEYS.VERSION);
    };

    return (
        <GlobalConfigContext.Provider value={{ 
            tariffs, 
            lockedTariffs, 
            systemVersion, 
            updateTariff, 
            toggleTariffLock, 
            updateVersion, 
            resetAll 
        }}>
            {children}
        </GlobalConfigContext.Provider>
    );
};
