import React, { useState } from 'react';
import { account } from '../lib/appwrite';
import { Loader2 } from 'lucide-react';
import { logger } from '../lib/logger';
import { handleAppwriteError } from '../lib/errorHandler';

interface OTPProps {
  userId: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function OTP({ userId, onSuccess, onBack }: OTPProps) {
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
      logger.info('Submitting OTP', { userId });
      // the user explicitly requested we use updatePhoneSession(userId, secret)
      await (account as any).updatePhoneSession(userId, otp);
      logger.info('Successfully updated phone session');
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
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 flex flex-col gap-6 w-full max-w-md mx-auto transition-all lg:shadow-none lg:border-transparent lg:bg-transparent lg:p-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">Enter OTP</h2>
        <p className="text-sm text-slate-400">We sent a verification code to your phone</p>
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
                className={`w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl font-mono font-bold rounded-2xl border-2 transition-all
                  ${otp.length > index ? 'border-indigo-500 text-indigo-700 bg-indigo-50/30' : 'border-slate-200 text-slate-300 bg-slate-50'}
                  ${otp.length === index ? 'ring-4 ring-indigo-50 border-indigo-400' : ''}
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
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl">
            <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
            <p className="text-xs font-medium text-red-800 leading-tight">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-2xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></div>
            <p className="text-xs font-medium text-emerald-800 leading-tight">{success}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading || otp.length !== 6 || !!success}
            className="w-full py-4 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg shadow-[inset_0px_1px_0px_rgba(255,255,255,0.2),0px_4px_20px_-4px_rgba(79,70,229,0.5)] hover:shadow-[inset_0px_1px_0px_rgba(255,255,255,0.3),0px_8px_25px_-4px_rgba(79,70,229,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Login'
            )}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            disabled={loading || !!success}
            className="w-full py-4 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-2xl font-bold text-sm shadow-[0px_2px_4px_rgba(0,0,0,0.02),0px_4px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0px_4px_8px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(0,0,0,0.05)] ring-1 ring-inset ring-slate-200 hover:ring-slate-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Back to Registration
          </button>
        </div>
      </form>
      
      <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
        <span className="text-xs text-slate-400">Step 2 of 2</span>
        <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-indigo-600 hover:underline">Resend code</a>
      </div>
    </div>
  );
}
