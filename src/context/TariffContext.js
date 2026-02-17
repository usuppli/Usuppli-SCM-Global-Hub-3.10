
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Define Immutable System Defaults (2026 Protocol)
const DEFAULT_RATES = {
    'USA': 0.156,          // 15.6%
    'South Africa': 0.45,  // 45%
    'Nigeria': 0.35,       // 35%
    'Tanzania': 0.35,      // 35%
    'Bahamas': 0.45        // 45%
};

const STORAGE_KEY = 'usuppli_tariff_rates';

const TariffContext = createContext();

export const useTariff = () => {
    const context = useContext(TariffContext);
    if (!context) {
        throw new Error('useTariff must be used within a TariffProvider');
    }
    return context;
};

export const TariffProvider = ({ children }) => {
    // 2. Initialize State: Lazy load from storage or fallback to defaults
    const [rates, setRates] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : DEFAULT_RATES;
        } catch (error) {
            console.error("Tariff Context: Failed to parse storage", error);
            return DEFAULT_RATES;
        }
    });

    // 3. Action: Update a specific country's rate
    const updateRate = (country, newRate) => {
        const val = parseFloat(newRate);
        // Ensure we don't store NaNs, default to 0 if invalid
        const cleanVal = isNaN(val) ? 0 : val;
        
        const updatedRates = {
            ...rates,
            [country]: cleanVal
        };

        setRates(updatedRates);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRates));
    };

    // 4. Action: Security Reset (Restore Factory Defaults)
    const resetToDefaults = () => {
        setRates(DEFAULT_RATES);
        localStorage.removeItem(STORAGE_KEY);
        console.warn("Tariff System: Reset to 2026 Defaults executed.");
    };

    return (
        <TariffContext.Provider value={{ rates, updateRate, resetToDefaults }}>
            {children}
        </TariffContext.Provider>
    );
};
