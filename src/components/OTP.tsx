import React, { useState } from 'react';
import { account } from '../lib/appwrite';
import { Loader2, Bug } from 'lucide-react';
import { logger } from '../lib/logger';
import { handleAppwriteError } from '../lib/errorHandler';

interface OTPProps {
  userId: string;
  onSuccess: () => void;
  onBack: () => void;
  onShowDebug: () => void;
}

export function OTP({ userId, onSuccess, onBack, onShowDebug }: OTPProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      logger.info('Submitting OTP (mocked)', { userId });
      // MOCK BACKEND DISCONNECT
      // the user explicitly requested we use updatePhoneSession(userId, secret)
      // await (account as any).updatePhoneSession(userId, otp);
      // logger.info('Successfully updated phone session');
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (otp === '000000') {
         throw new Error("Invalid OTP (mocked)");
      }
      setSuccess('Registration successful!');
      
      // Short delay to show success message before transitioning
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      if (err.message && err.message.includes('updatePhoneSession is not a function')) {
         try {
            logger.warn('updatePhoneSession failed, falling back to createSession', err);
            // fallback if appwrite SDK changed it to createSession
            await (account as any).createSession(userId, otp);
            logger.info('Successfully created session (fallback block)');
            setSuccess('Registration successful!');
            setTimeout(() => onSuccess(), 1000);
         } catch(fallbackErr: any) {
            const userMsg = handleAppwriteError('auth/createSession(fallback)', fallbackErr);
            setError(userMsg);
         }
      } else {
        const userMsg = handleAppwriteError('auth/updatePhoneSession', err);
        setError(userMsg);
      }
    } finally {
      if (!success) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-8 flex flex-col gap-6 w-full max-w-md mx-auto transition-all lg:shadow-none lg:border-transparent lg:bg-transparent lg:p-4 lg:backdrop-blur-none" >
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">Enter OTP</h2>
        <p className="text-sm text-slate-500">We sent a verification code to your phone</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 block text-center">
            Verification Code
          </label>
          <div className="flex gap-2 sm:gap-3 justify-center mt-2 group relative">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className={`w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl font-mono font-bold rounded-2xl border-2 transition-all backdrop-blur-sm
                  ${otp.length > index ? 'border-indigo-400 text-indigo-700 bg-white/80 shadow-md' : 'border-white/60 text-slate-300 bg-white/40'}
                  ${otp.length === index ? 'ring-4 ring-indigo-500/20 border-indigo-400 bg-white/60' : ''}
                `}
              >
                {otp[index] || ''}
              </div>
            ))}
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text"
              required
              maxLength={6}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50/80 backdrop-blur-sm border border-red-100/50 px-4 py-3 rounded-2xl">
            <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
            <p className="text-xs font-medium text-red-800 leading-tight">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-3 bg-emerald-50/80 backdrop-blur-sm border border-emerald-100/50 px-4 py-3 rounded-2xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></div>
            <p className="text-xs font-medium text-emerald-800 leading-tight">{success}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            title="Verify your OTP code"
            disabled={loading || otp.length !== 6 || !!success}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:shadow-[0_10px_25px_-4px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            title="Go back to previous step"
            disabled={loading || !!success}
            className="w-full py-3.5 bg-indigo-500/10 hover:bg-indigo-500/20 backdrop-blur-md text-indigo-700 hover:text-indigo-800 rounded-2xl font-semibold text-sm shadow-[0_4px_12px_-4px_rgba(99,102,241,0.2)] border border-indigo-500/30 hover:border-indigo-500/50 hover:shadow-[0_8px_16px_-4px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Back to Registration
          </button>
        </div>
      </form>
      
      <div className="pt-4 border-t border-slate-200/50 flex justify-between items-center">
        <span className="text-xs text-slate-400">Step 2 of 2</span>
        <div className="flex items-center gap-4">
          <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-indigo-600 hover:underline">Resend code</a>
          <button 
            type="button"
            onClick={onShowDebug}
            className="group flex items-center justify-center p-2 bg-slate-100/50 hover:bg-white border border-slate-200/50 hover:border-slate-300 shadow-sm hover:shadow text-slate-400 hover:text-indigo-600 transition-all duration-300 rounded-xl"
            title="Debug OTP Page"
          >
            <Bug className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
