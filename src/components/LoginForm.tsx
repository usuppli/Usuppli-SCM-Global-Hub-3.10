
import React, { useState } from 'react';
import { User, Language } from '../types';
import { translations } from '../translations';
import { MOCK_USERS } from './Tabs/constants';
import { Logo } from './Logo';

interface Props {
  onLogin: (u: User) => void;
  lang: Language;
}

type AuthView = 'LOGIN' | 'FORGOT_PASSWORD' | 'VERIFY_CODE' | 'RESET_PASSWORD';

const LoginForm: React.FC<Props> = ({ onLogin, lang }) => {
  const t = translations[lang].login;
  
  // State for flow control
  const [view, setView] = useState<AuthView>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Feedback
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- ACTIONS ---

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate API Delay
    setTimeout(() => {
        // Find user by email (Case insensitive)
        const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (user) {
            onLogin(user);
        } else {
            setError("Invalid credentials. Please check your email.");
            setIsLoading(false);
        }
    }, 1000);
  };

  const handleQuickLogin = (role: string) => {
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[3];
    onLogin(user);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // SIMULATION: Check if email exists
    setTimeout(() => {
        const userExists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
            setSuccessMsg(`Reset code sent to ${email}`);
            setView('VERIFY_CODE');
        } else {
            setError("No account found with that email address.");
        }
        setIsLoading(false);
    }, 1500);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    // SIMULATION: Accept any 6 digit code
    if (resetCode.length === 6) {
        setView('RESET_PASSWORD');
        setSuccessMsg(null);
    } else {
        setError("Invalid code. Try '123456'");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setView('LOGIN');
        setSuccessMsg("Password updated successfully. Please login.");
        setPassword('');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      
      {/* 1. WORLD MAP BACKGROUND */}
      <div 
        className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')" }}
      ></div>

      {/* 2. GRADIENT OVERLAY (For readability) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-900/80 to-slate-950 pointer-events-none"></div>
      
      {/* 3. LOGIN CARD */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* LOGO SECTION - FIXED SIZING */}
        <div className="flex flex-col items-center justify-center mb-8">
           <div className="w-64 text-white"> 
              <Logo className="w-full h-auto text-white" variant="full" />
           </div>
           <h2 className="text-xl font-bold text-slate-300 mt-4">{t.subtitle}</h2>
        </div>

        {/* FEEDBACK MESSAGES */}
        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs font-bold text-center">{error}</div>}
        {successMsg && <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-200 text-xs font-bold text-center">{successMsg}</div>}
        
        {/* VIEW: LOGIN */}
        {view === 'LOGIN' && (
            <div className="space-y-6">
                <form onSubmit={handleCredentialLogin} className="space-y-4">
                    <div>
                        <input 
                            type="email" 
                            required 
                            placeholder="Email Address"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            required 
                            placeholder="Password"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-500 transition-all shadow-lg disabled:opacity-50"
                    >
                        {isLoading ? 'Authenticating...' : 'Secure Login'}
                    </button>
                </form>

                <div className="flex justify-between items-center text-xs">
                    <button onClick={() => setView('FORGOT_PASSWORD')} className="text-sky-300 hover:text-sky-200 font-bold">Forgot Password?</button>
                </div>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-widest">Or Quick Access (Dev)</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {['super_admin', 'admin', 'editor', 'viewer'].map(role => (
                        <button key={role} onClick={() => handleQuickLogin(role)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-[10px] font-bold text-slate-300 uppercase transition-colors">
                            {role.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* VIEW: FORGOT PASSWORD */}
        {view === 'FORGOT_PASSWORD' && (
            <form onSubmit={handleForgotPassword} className="space-y-4 animate-in slide-in-from-right">
                <p className="text-sm text-slate-300 text-center">Enter your registered email address to receive a verification code.</p>
                <input 
                    type="email" 
                    required 
                    placeholder="name@company.com"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 outline-none"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <button type="submit" disabled={isLoading} className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-500 shadow-lg disabled:opacity-50">
                    {isLoading ? 'Sending...' : 'Send Reset Code'}
                </button>
                <button type="button" onClick={() => setView('LOGIN')} className="w-full text-center text-xs text-slate-400 hover:text-white mt-2">Back to Login</button>
            </form>
        )}

        {/* VIEW: VERIFY CODE */}
        {view === 'VERIFY_CODE' && (
            <form onSubmit={handleVerifyCode} className="space-y-4 animate-in slide-in-from-right">
                <p className="text-sm text-slate-300 text-center">Enter the 6-digit code sent to <b>{email}</b></p>
                <input 
                    type="text" 
                    maxLength={6}
                    placeholder="123456"
                    className="w-full p-3 text-center text-2xl tracking-[0.5em] font-mono rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-sky-500 outline-none"
                    value={resetCode}
                    onChange={e => setResetCode(e.target.value)}
                />
                <button type="submit" className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-500 shadow-lg">Verify Code</button>
                <button type="button" onClick={() => setView('FORGOT_PASSWORD')} className="w-full text-center text-xs text-slate-400 hover:text-white mt-2">Resend Code</button>
            </form>
        )}

        {/* VIEW: RESET PASSWORD */}
        {view === 'RESET_PASSWORD' && (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-in slide-in-from-right">
                <p className="text-sm text-slate-300 text-center">Create a new secure password.</p>
                <input 
                    type="password" 
                    required 
                    placeholder="New Password"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 outline-none"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />
                 <input 
                    type="password" 
                    required 
                    placeholder="Confirm Password"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 outline-none"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                <button type="submit" disabled={isLoading} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 shadow-lg disabled:opacity-50">
                    {isLoading ? 'Updating...' : 'Set New Password'}
                </button>
            </form>
        )}

      </div>
    </div>
  );
};

export default LoginForm;