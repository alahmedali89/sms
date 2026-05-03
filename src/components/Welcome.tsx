import React, { useState, useEffect } from 'react';
import { account } from '../lib/appwrite';
import { Loader2, LogOut, User, Bug } from 'lucide-react';
import { logger } from '../lib/logger';
import { handleAppwriteError } from '../lib/errorHandler';

interface WelcomeProps {
  onLogout: () => void;
  onShowDebug: () => void;
}

export function Welcome({ onLogout, onShowDebug }: WelcomeProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        logger.info('Fetching user account details (mocked)');
        // MOCK BACKEND DISCONNECT
        // const user = await account.get();
        // logger.info('Successfully fetched user account', { userId: user.$id });
        // setPhoneNumber(user.phone || 'Phone number not available');
        await new Promise(resolve => setTimeout(resolve, 500));
        setPhoneNumber('+1 (555) Mock-User');
      } catch (err: any) {
        const userMsg = handleAppwriteError('auth/getUserDetails', err);
        setError(userMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      logger.info('Logging out user...');
      // MOCK BACKEND DISCONNECT
      // await account.deleteSession('current');
      logger.info('Logout successful');
      onLogout();
    } catch (err) {
      handleAppwriteError('auth/deleteSession', err);
      // Even if Appwrite logout fails, clear local app state so user isn't stuck
      onLogout(); 
    }
  };

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 p-8 flex justify-center items-center h-64 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-8 flex flex-col gap-6 text-center w-full max-w-md mx-auto transition-all lg:shadow-none lg:border-transparent lg:bg-transparent lg:p-4 lg:backdrop-blur-none">
      <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mt-2 shadow-sm border border-white/60">
        <User className="w-8 h-8 text-indigo-600" />
      </div>
      
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800 drop-shadow-sm">Welcome!</h2>
        <p className="text-sm text-slate-500">You have successfully verified your number.</p>
      </div>
      
      {error ? (
        <div className="flex items-center justify-center gap-3 bg-red-50/80 backdrop-blur-sm border border-red-100/50 px-4 py-3 rounded-2xl text-left">
          <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
          <p className="text-xs font-medium text-red-800 leading-tight">{error}</p>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl p-6 mb-2 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Logged in account</p>
          <p className="font-mono text-xl text-slate-800 font-medium">{phoneNumber}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        title="Logout from your account"
        className="w-full py-4 relative overflow-hidden bg-rose-500/10 hover:bg-rose-500/20 backdrop-blur-md text-rose-600 hover:text-rose-700 rounded-2xl font-bold text-base shadow-[0_4px_15px_-3px_rgba(225,29,72,0.15)] border border-rose-500/30 hover:border-rose-500/50 hover:shadow-[0_8px_25px_-5px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/10 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        Logout
      </button>

      <div className="pt-4 border-t border-slate-200/50 flex justify-between items-center">
        <span className="text-xs text-slate-400">Secure Session</span>
        <button 
          type="button"
          onClick={onShowDebug}
          className="group flex items-center justify-center p-2 bg-slate-100/50 hover:bg-white border border-slate-200/50 hover:border-slate-300 shadow-sm hover:shadow text-slate-400 hover:text-indigo-600 transition-all duration-300 rounded-xl"
          title="Debug Welcome Page"
        >
          <Bug className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
