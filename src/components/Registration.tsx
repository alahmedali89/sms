import React, { useState } from 'react';
import { account, ID } from '../lib/appwrite';
import { ClipboardPaste, Loader2, Bug, ChevronDown } from 'lucide-react';
import { logger } from '../lib/logger';
import { handleAppwriteError } from '../lib/errorHandler';

interface RegistrationProps {
  onSuccess: (userId: string) => void;
  onShowDebug: () => void;
}

const countryCodes = [
  { code: '+1', label: 'US/CA' },
  { code: '+44', label: 'UK' },
  { code: '+91', label: 'IN' },
  { code: '+61', label: 'AU' },
  { code: '+81', label: 'JP' },
  { code: '+49', label: 'DE' },
  { code: '+33', label: 'FR' },
  { code: '+86', label: 'CN' },
  { code: '+55', label: 'BR' },
  { code: '+52', label: 'MX' },
  { code: '+971', label: 'AE' },
  { code: '+27', label: 'ZA' },
  { code: '+234', label: 'NG' },
];

export function Registration({ onSuccess, onShowDebug }: RegistrationProps) {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPhone(text);
      logger.info('Pasted phone number from clipboard');
    } catch (err) {
      logger.error('Failed to read clipboard contents', err);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clean up the phone number and format it
      const cleanPhone = phone.replace(/[^\d+]/g, '');
      const fullPhone = cleanPhone.startsWith('+') ? cleanPhone : `${countryCode}${cleanPhone}`;
      
      logger.info('Requesting phone token (mocked)', { phone: fullPhone });
      // MOCK BACKEND DISCONNECT
      // const sessionToken = await account.createPhoneToken(ID.unique(), fullPhone);
      // logger.info('Phone token created', { userId: sessionToken.userId });
      // onSuccess(sessionToken.userId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess("mocked_user_id_" + fullPhone);
    } catch (err: any) {
      const userMessage = handleAppwriteError('auth/createPhoneToken', err);
      setError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-8 flex flex-col gap-6 w-full max-w-md mx-auto transition-all lg:shadow-none lg:border-transparent lg:bg-transparent lg:p-4 lg:backdrop-blur-none">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">Verify your number</h2>
        <p className="text-sm text-slate-500">We'll send a 6-digit code to verify your account.</p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div className="group space-y-2">
          <label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 block">
            Phone Number
          </label>
          <div className="relative flex items-center transition-all focus-within:ring-4 focus-within:ring-indigo-500/20 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/50 overflow-hidden shadow-sm">
            <div className="relative flex items-center border-r border-slate-200/50 text-slate-700 bg-slate-50/50 focus-within:bg-white/80 transition-colors w-[88px] shrink-0">
              <input
                type="tel"
                list="country-codes"
                value={countryCode}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^\d+]/g, '');
                  if (val.length > 0 && !val.startsWith('+')) {
                    val = '+' + val;
                  }
                  if (val.length <= 5) {
                    setCountryCode(val);
                  }
                }}
                className="w-full bg-transparent py-3 pr-2 pl-2 font-semibold text-slate-700 focus:outline-none text-center placeholder:text-slate-400/70 text-base"
                placeholder="+1"
                aria-label="Country Code"
              />
              <datalist id="country-codes">
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </datalist>
            </div>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter Number"
              className="w-full pl-4 pr-10 py-3 bg-transparent text-slate-800 font-medium placeholder:text-slate-500 focus:outline-none transition-colors text-base"
              required
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-1 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white/80 hover:shadow-sm rounded-xl transition-all"
              title="Paste from clipboard"
            >
              <ClipboardPaste className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50/80 backdrop-blur-sm border border-red-100/50 px-4 py-3 rounded-2xl">
            <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
            <p className="text-xs font-medium text-red-800 leading-tight">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !phone}
          title="Secure Authentication"
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:shadow-[0_10px_25px_-4px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            'Registration'
          )}
        </button>
        
      </form>
      
      <div className="pt-4 border-t border-slate-200/50 flex justify-between items-center">
        <span className="text-xs text-slate-400 ml-1">Step 1 of 2</span>
        <button 
          type="button"
          onClick={onShowDebug}
          className="group flex items-center justify-center p-2.5 bg-slate-100/50 hover:bg-white border border-slate-200/50 hover:border-slate-300 shadow-sm hover:shadow text-slate-400 hover:text-indigo-600 transition-all duration-300 rounded-xl"
          title="Debug Registration Page"
        >
          <Bug className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
