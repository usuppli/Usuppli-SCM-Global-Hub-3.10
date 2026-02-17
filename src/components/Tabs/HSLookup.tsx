
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Search, BookOpen, AlertCircle, Loader2, Sparkles, ArrowRight, Globe, Check, Zap } from 'lucide-react';
import { Product, Language } from '../../types';
import { translations } from '../../translations';

interface Props {
  product?: Product;
  lang: Language;
  onSave?: (product: Product) => void;
  // This remains to support global communication if ever needed, 
  // but we are prioritizing the Product Override below.
  onUpdateGlobalTariff?: (country: string, rate: string | number) => void;
}

export default function HSLookup({ product, lang, onSave, onUpdateGlobalTariff }: Props) {
  // Safe Translation Access
  const t = (translations[lang] || translations['en'])?.hsLookup || translations['en'].hsLookup;

  const [query, setQuery] = useState(''); 
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [syncedToProduct, setSyncedToProduct] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setSaved(false);
    setSyncedToProduct(false);

    try {
      // Always use process.env.API_KEY as per coding guidelines
      const apiKey = process.env.API_KEY || "";
      
      if (!apiKey) {
         // Simulation Mode if no API Key
         setTimeout(() => {
             setResult({
                 code: '6203.42',
                 desc: 'Men\'s or boys\' trousers, bib and brace overalls, breeches and shorts, of cotton',
                 rate: 0.166,
                 duty: 'Medium Impact',
                 reason: 'Simulation: Cotton trousers fall under chapter 6203 based on material composition.'
             });
             setLoading(false);
         }, 1500);
         return;
      }

      // Initialize GoogleGenAI with named parameter
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are an expert Customs Broker. 
      Identify the most likely Harmonized System (HS) Code (6-digit international standard) for the following product description: "${query}".
      
      Provide the response in this exact format:
      Code: [The HS Code]
      Description: [Official Technical Description]
      Duty_Rate: [Numeric decimal, e.g. 0.053 for 5.3%]
      Duty_Indication: [Low/Medium/High] (Estimate based on general US/EU rates)
      Reasoning: [Brief explanation why this code applies]
      
      Do not include markdown formatting like ** or ##. Just plain text lines.`;

      // Use ai.models.generateContent directly with the model and prompt
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      const text = response.text; // Use .text property directly

      if (text) {
        const lines = text.split('\n');
        
        // Extract numeric rate for the precision override feature
        const rawRateLine = lines.find(l => l.includes('Duty_Rate:'));
        const rawRateValue = rawRateLine ? rawRateLine.split('Duty_Rate:')[1].trim() : '0';
        const cleanNumericRate = parseFloat(rawRateValue.replace(/[^0-9.]/g, ''));

        const parsed = {
          code: lines.find(l => l.includes('Code:'))?.split('Code:')[1]?.trim() || 'Unknown',
          desc: lines.find(l => l.includes('Description:'))?.split('Description:')[1]?.trim() || 'No description found',
          rate: isNaN(cleanNumericRate) ? 0 : cleanNumericRate,
          duty: lines.find(l => l.includes('Duty_Indication:'))?.split('Duty_Indication:')[1]?.trim() || 'N/A',
          reason: lines.find(l => l.includes('Reasoning:'))?.split('Reasoning:')[1]?.trim() || text
        };
        setResult(parsed);
      } else {
        throw new Error('No analysis generated');
      }

    } catch (err) {
      console.error(err);
      setError('Failed to connect to Gemini API. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // OPTION 1 MERGE: Applies the rate specifically to THIS product's cost sheet
  const handleApplyPrecisionRate = () => {
    if (product && onSave && result) {
      const updatedProduct = { 
        ...product, 
        hsCode: result.code,
        tariffCode: result.code, // Sync both fields
        dutyOverrides: {
          ...(product.dutyOverrides || {}),
          'USA': result.rate // Sets the precision rate for USA for this product only
        }
      };
      onSave(updatedProduct);
      setSyncedToProduct(true);
      setSaved(true); // Marks both as done
      setTimeout(() => setSyncedToProduct(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-600" />
          {t?.title || "Precision HS Lookup"}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {t?.subtitle || "Global Classification & Compliance"}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t?.searchPlaceholder || "e.g. Stainless steel insulated travel mug"}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg flex items-center gap-2 transition-colors min-w-[140px] justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Analyzing...' : 'Identify'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 border border-red-100 dark:border-red-900">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-900 p-6 text-white flex justify-between items-end border-b border-slate-800">
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{t?.code || "Recommended HS Code"}</div>
              <div className="text-4xl font-mono font-bold text-blue-400">{result.code}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Detected Rate</div>
              <div className="text-3xl font-mono font-bold">{(result.rate * 100).toFixed(1)}%</div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" /> {t?.description || "Description"}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                  {result.desc}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-400" /> Duty Classification
                </h3>
                <div className={`p-4 rounded-lg border ${
                  result.duty.toLowerCase().includes('high') 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-700 dark:text-red-400'
                    : result.duty.toLowerCase().includes('low')
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-700 dark:text-green-400'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400'
                }`}>
                  <span className="font-bold">{result.duty} Relative Impact</span>
                  <p className="text-[10px] uppercase font-bold mt-1 opacity-70">Cross-reference with Chapter 39 HTS Tables</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-2">AI Broker Logic</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 italic border-l-4 border-blue-500 pl-4 py-1">
                "{result.reason}"
              </p>
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button 
                  onClick={handleApplyPrecisionRate}
                  disabled={syncedToProduct || !product}
                  className={`text-sm font-bold flex items-center gap-2 transition-all px-6 py-2.5 rounded-xl shadow-sm border ${
                    syncedToProduct 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-400'
                  }`}
                >
                  {syncedToProduct ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-current" />}
                  {syncedToProduct ? "Precision Rate Locked" : `Apply to ${product?.name || 'Product'} Costing`}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
