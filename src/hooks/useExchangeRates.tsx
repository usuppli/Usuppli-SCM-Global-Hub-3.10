
import { useState, useEffect, useCallback } from 'react';

// 1. UPDATED: Full List (Western Majors + Emerging Markets)
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  CNY: 7.19,   // China
  CAD: 1.36,   // Canada
  JPY: 150.2,  // Japan
  INR: 82.9,   // India
  MXN: 17.05,  // Mexico
  TWD: 31.55,  // Taiwan
  KRW: 1335.0, // South Korea
  ZAR: 19.15,  // South Africa
  PHP: 56.20,  // Philippines
  NGN: 1600.0, // Nigeria
  KES: 145.5,  // Kenya
  TZS: 2550.0, // Tanzania
  GHS: 12.80,  // Ghana
  GYD: 209.0   // Guyana
};

// 2. NEW: History Generator (Simulates 30-day trends)
const generateHistory = (baseRate: number, days = 30) => {
  const data = [];
  let current = baseRate;
  const volatility = 0.02; // 2% variance

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random math to make the line go up and down realistically
    const change = current * (Math.random() * volatility - (volatility / 2));
    current += change;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Number(current.toFixed(4))
    });
  }
  // Ensure the last point matches the actual current rate
  data[data.length - 1].value = baseRate;
  return data;
};

export const useExchangeRates = () => {
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async (force = false) => {
    setLoading(true);
    try {
      // Use import.meta.env for Vite compatibility
      // Cast import.meta to any to avoid TS error about 'env' property
      const apiKey = (import.meta as any).env.VITE_EXCHANGE_RATE_API_KEY;
      
      // Cache Logic (12 Hours)
      const cached = localStorage.getItem('exchange_rates_cache');
      const meta = localStorage.getItem('exchange_rates_meta');
      
      if (!force && cached && meta) {
         const lastTime = JSON.parse(meta).timestamp;
         if (Date.now() - lastTime < 12 * 60 * 60 * 1000) {
            setRates(JSON.parse(cached));
            setLastUpdated(lastTime);
            setLoading(false);
            return;
         }
      }

      if (!apiKey) throw new Error("No API Key");

      const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
      if (!response.ok) throw new Error("Fetch failed");
      
      const data = await response.json();
      
      // Merge: Keep our specific fallback keys even if API returns 160 currencies
      const mergedRates = { ...FALLBACK_RATES };
      Object.keys(FALLBACK_RATES).forEach(key => {
        if (data.conversion_rates[key]) {
          mergedRates[key] = data.conversion_rates[key];
        }
      });

      setRates(mergedRates);
      setLastUpdated(Date.now());
      
      localStorage.setItem('exchange_rates_cache', JSON.stringify(mergedRates));
      localStorage.setItem('exchange_rates_meta', JSON.stringify({ timestamp: Date.now() }));

    } catch (err) {
      console.warn("Using offline rates");
      setRates(FALLBACK_RATES); 
      setError("Offline Mode");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRates(); }, []);

  // The function the Widget calls to draw the graph
  const getTrendData = useCallback((currencyCode: string) => {
    const rate = rates[currencyCode] || FALLBACK_RATES[currencyCode] || 1;
    return generateHistory(rate);
  }, [rates]);

  return { 
    rates, 
    loading, 
    error, 
    lastUpdated, 
    refresh: () => fetchRates(true),
    getTrendData
  };
};
