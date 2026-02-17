
import React, { useState } from 'react';

export interface FormattedAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  fullAddress: string;
}

interface Props {
  onChange: (address: FormattedAddress) => void;
  initialValue?: string;
}

export const ManualAddressForm: React.FC<Props> = ({ onChange }) => {
  const [fields, setFields] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  });

  const handleChange = (field: string, value: string) => {
    const newFields = { ...fields, [field]: value };
    setFields(newFields);
    
    const fullAddress = `${newFields.street}, ${newFields.city}, ${newFields.state} ${newFields.zip}, ${newFields.country}`;
    
    onChange({
      ...newFields,
      fullAddress: fullAddress.replace(/^, /, '').replace(/ ,/, '')
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="col-span-2">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:border-blue-500 outline-none dark:text-white"
          placeholder="e.g. 123 Logistics Way"
          value={fields.street}
          onChange={(e) => handleChange('street', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:border-blue-500 outline-none dark:text-white"
          placeholder="City"
          value={fields.city}
          onChange={(e) => handleChange('city', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:border-blue-500 outline-none dark:text-white"
          placeholder="State"
          value={fields.state}
          onChange={(e) => handleChange('state', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Zip</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:border-blue-500 outline-none dark:text-white"
          placeholder="Zip Code"
          value={fields.zip}
          onChange={(e) => handleChange('zip', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Country</label>
        <select 
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:border-blue-500 outline-none dark:text-white"
          value={fields.country}
          onChange={(e) => handleChange('country', e.target.value)}
        >
          <option value="USA">United States</option>
          <option value="CAN">Canada</option>
          <option value="GBR">United Kingdom</option>
          <option value="DEU">Germany</option>
          <option value="CHN">China</option>
          <option value="VNM">Vietnam</option>
        </select>
      </div>
    </div>
  );
};