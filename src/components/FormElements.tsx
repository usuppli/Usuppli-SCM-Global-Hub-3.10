
import React from 'react';

// --- MASTER STYLE CONFIGURATION ---
const STYLES = {
  wrapper: "w-full",
  label: "block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5",
  inputBase: "w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none transition-all duration-200",
  inputFocus: "focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20 dark:focus:ring-blue-500/20",
  inputError: "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200",
  disabled: "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800",
  errorText: "mt-1 text-xs text-red-500 font-bold"
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, disabled, ...props }) => (
  <div className={STYLES.wrapper}>
    {label && <label className={STYLES.label}>{label}</label>}
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          {icon}
        </div>
      )}
      <input 
        disabled={disabled}
        className={`
          ${STYLES.inputBase} 
          ${disabled ? STYLES.disabled : STYLES.inputFocus} 
          ${error ? STYLES.inputError : ''} 
          ${icon ? 'pl-10' : ''} 
          ${className || ''}
        `}
        {...props} 
      />
    </div>
    {error && <p className={STYLES.errorText}>{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, disabled, ...props }) => (
  <div className={STYLES.wrapper}>
    {label && <label className={STYLES.label}>{label}</label>}
    <div className="relative">
      <select 
        disabled={disabled}
        className={`
          ${STYLES.inputBase} appearance-none 
          ${disabled ? STYLES.disabled : STYLES.inputFocus}
          ${error ? STYLES.inputError : ''} 
          ${className || ''}
        `} 
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="dark:bg-slate-900">{opt.label}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
    {error && <p className={STYLES.errorText}>{error}</p>}
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className, disabled, ...props }) => (
  <div className={STYLES.wrapper}>
    {label && <label className={STYLES.label}>{label}</label>}
    <textarea 
      disabled={disabled}
      className={`
        ${STYLES.inputBase} 
        ${disabled ? STYLES.disabled : STYLES.inputFocus}
        ${error ? STYLES.inputError : ''} 
        ${className || ''}
      `} 
      {...props} 
    />
    {error && <p className={STYLES.errorText}>{error}</p>}
  </div>
);
