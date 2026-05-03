import React, { useState } from 'react';
import { account, ID } from '../lib/appwrite';
import { ClipboardPaste, Loader2, Bug } from 'lucide-react';
import { logger } from '../lib/logger';
import { handleAppwriteError } from '../lib/errorHandler';

interface RegistrationProps {
  onSuccess: (userId: string) => void;
  onShowDebug: () => void;
}

export function Registration({ onSuccess, onShowDebug }: RegistrationProps) {
  const [phone, setPhone] = useState('');
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
      logger.info('Requesting phone token', { phone });
      const sessionToken = await account.createPhoneToken(ID.unique(), phone);
      logger.info('Phone token created', { userId: sessionToken.userId });
      onSuccess(sessionToken.userId);
    } catch (err: any) {
      const userMessage = handleAppwriteError('auth/createPhoneToken', err);
      setError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 flex flex-col gap-6 w-full max-w-md mx-auto transition-all lg:shadow-none lg:border-transparent lg:bg-transparent lg:p-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">Verify your number</h2>
        <p className="text-sm text-slate-400">We'll send a 6-digit code to verify your account.</p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div className="group space-y-2">
          <label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 block">
            Phone Number
          </label>
          <div className="relative flex items-center transition-all focus-within:ring-4 focus-within:ring-indigo-50 rounded-2xl">
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-3 p-2 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
              title="Paste from clipboard"
            >
              <ClipboardPaste className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl">
            <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
            <p className="text-xs font-medium text-red-800 leading-tight">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !phone}
          className="w-full py-4 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg shadow-[inset_0px_1px_0px_rgba(255,255,255,0.2),0px_4px_20px_-4px_rgba(79,70,229,0.5)] hover:shadow-[inset_0px_1px_0px_rgba(255,255,255,0.3),0px_8px_25px_-4px_rgba(79,70,229,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            'Get Verification Code'
          )}
        </button>
        
      </form>
      
      <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-1 -ml-1">
          <span className="text-xs text-slate-400 ml-1">Step 1 of 2</span>
          <button 
            type="button"
            onClick={onShowDebug}
            className="p-1.5 text-slate-300 hover:text-indigo-500 transition-colors rounded-full"
            title="Open Debug Console"
          >
            <Bug className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
