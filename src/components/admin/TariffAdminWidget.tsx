
import React, { useState } from 'react';
import { useGlobalConfig } from '../../context/GlobalConfigContext';

const TariffAdminWidget: React.FC<{ user: { role: string } }> = ({ user }) => {
    const config = useGlobalConfig();
    const [vInput, setVInput] = useState(config?.systemVersion || "");

    // Safety Guard: Show loading instead of crashing if Provider is missing
    if (!config) return <div className="p-4 bg-yellow-100">Loading Configuration...</div>;
    
    // Security Gate
    if (user.role !== 'SUPER_ADMIN') return null;

    return (
        <div className="p-6 bg-white shadow rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Global Configuration</h3>
            
            <div className="mb-6 pb-6 border-b">
                <label className="block text-sm font-medium text-gray-700">System Version Message</label>
                <div className="flex gap-2 mt-1">
                    <input 
                        className="border p-2 rounded w-full"
                        value={vInput} 
                        onChange={(e) => setVInput(e.target.value)} 
                    />
                    <button 
                        onClick={() => config.updateVersion(vInput)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >Save</button>
                </div>
            </div>

            <table className="w-full text-left mb-4">
                <thead>
                    <tr className="text-gray-500 border-b">
                        <th className="pb-2">Country</th>
                        <th className="pb-2 text-right">Rate (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(config.tariffs).map(([country, rate]) => (
                        <tr key={country} className="border-b last:border-0">
                            <td className="py-3 font-medium">{country}</td>
                            <td className="py-3 text-right">
                                <input 
                                    type="number" 
                                    className="border p-1 w-20 text-right"
                                    defaultValue={rate as number}
                                    onBlur={(e) => config.updateTariff(country, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <button 
                onClick={config.resetAll}
                className="text-red-600 text-sm hover:underline"
            >Reset to 2026 System Defaults</button>
        </div>
    );
};

export default TariffAdminWidget;
