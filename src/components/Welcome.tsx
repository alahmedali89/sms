import React, { useState, useEffect } from 'react';
import { account } from '../lib/appwrite';
import { Loader2, LogOut, User } from 'lucide-react';
import { logger } from '../lib/logger';
import { handleAppwriteError } from '../lib/errorHandler';

interface WelcomeProps {
  onLogout: () => void;
}

export function Welcome({ onLogout }: WelcomeProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        logger.info('Fetching user account details');
        const user = await account.get();
        logger.info('Successfully fetched user account', { userId: user.$id });
        setPhoneNumber(user.phone || 'Phone number not available');
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
      await account.deleteSession('current');
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
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 flex flex-col gap-6 text-center w-full max-w-md mx-auto transition-all lg:shadow-none lg:border-transparent lg:bg-transparent lg:p-4">
      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mt-2">
        <User className="w-8 h-8 text-indigo-600" />
      </div>
      
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">Welcome!</h2>
        <p className="text-sm text-slate-400">You have successfully verified your number.</p>
      </div>
      
      {error ? (
        <div className="flex items-center justify-center gap-3 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl text-left">
          <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
          <p className="text-xs font-medium text-red-800 leading-tight">{error}</p>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Logged in account</p>
          <p className="font-mono text-xl text-slate-800 font-medium">{phoneNumber}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full py-4 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-2xl font-bold text-lg shadow-[0px_2px_4px_rgba(0,0,0,0.02),0px_4px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0px_4px_8px_rgba(0,0,0,0.02),0px_8px_16px_-4px_rgba(225,29,72,0.15)] ring-1 ring-inset ring-slate-200 hover:ring-rose-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}
