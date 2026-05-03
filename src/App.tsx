/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Registration } from './components/Registration';
import { OTP } from './components/OTP';
import { Welcome } from './components/Welcome';
import { Debug } from './components/Debug';
import { ErrorBoundary } from './components/ErrorBoundary';
import { account } from './lib/appwrite';
import { Loader2, Bug, ShieldCheck, Lock, Zap } from 'lucide-react';
import { logger } from './lib/logger';

type ViewState = 'loading' | 'registration' | 'otp' | 'welcome';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('loading');
  const [userId, setUserId] = useState<string>('');
  const [showDebug, setShowDebug] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const session = await account.get();
        logger.info('Session found', { session });
        setCurrentView('welcome');
      } catch (err) {
        logger.warn('No active session found', err);
        // Not logged in or session expired
        setCurrentView('registration');
      }
    };
    
    checkSession();
  }, []);

  const handleRegistrationSuccess = (id: string) => {
    logger.info('Registration step 1 success', { userId: id });
    setUserId(id);
    setCurrentView('otp');
  };

  const handleOtpSuccess = () => {
    logger.info('OTP verification success');
    setCurrentView('welcome');
  };

  const handleOtpBack = () => {
    logger.info('User navigated back from OTP to Registration');
    setCurrentView('registration');
    setUserId('');
  };

  const handleLogout = () => {
    logger.info('User logged out');
    setCurrentView('registration');
    setUserId('');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 sm:bg-slate-100/50 flex items-center justify-center p-4 sm:p-8 overflow-hidden font-sans w-full relative">
        {/* Debug Dialog overlay */}
        {showDebug && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-4xl relative">
              <Debug onBack={() => setShowDebug(false)} />
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row w-full max-w-5xl z-10 bg-slate-50 lg:bg-white lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] lg:rounded-[2.5rem] overflow-hidden min-h-[600px] lg:border border-slate-200/60">
          
          {/* Desktop Left Panel */}
          <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-between p-12 xl:p-16 text-white min-h-[600px]">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 blur-3xl opacity-60 mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-500 to-indigo-400 blur-3xl opacity-60 mix-blend-screen pointer-events-none"></div>
            
            <div className="relative z-10 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md border border-white/20 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                Secure Authentication
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                Passwordless <br /> Verification.
              </h1>
              <p className="text-indigo-100 text-lg max-w-sm leading-relaxed">
                Experience seamless and secure login. We verify your identity instantly via SMS.
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-6 mt-12">
               <div className="flex items-center gap-4 group cursor-default">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-colors shadow-sm">
                   <Lock className="w-6 h-6 text-indigo-50" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-white">Enterprise Security</h3>
                   <p className="text-sm text-indigo-100/80">End-to-end encrypted validation</p>
                 </div>
               </div>
               <div className="flex items-center gap-4 group cursor-default">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-colors shadow-sm">
                   <Zap className="w-6 h-6 text-indigo-50" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-white">Lightning Fast</h3>
                   <p className="text-sm text-indigo-100/80">Instant OTP delivery & login</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Panel (Forms Layout) */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative bg-transparent">
            {/* Mobile Header */}
            <div className="lg:hidden text-center space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                Secure Authentication
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Registration</h1>
            </div>

            <div className="relative w-full max-w-md mx-auto">
              {/* Mobile Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-indigo-100 rounded-full blur-xl opacity-50 z-0 lg:hidden"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-60 z-0 lg:hidden"></div>
              
              <div className="relative z-10 w-full lg:[&>div]:shadow-none lg:[&>div]:border-transparent lg:[&>div]:bg-transparent lg:[&>div]:p-4">
                {currentView === 'loading' && (
                  <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 flex justify-center items-center h-64 lg:shadow-none lg:border-transparent lg:bg-transparent lg:p-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                  </div>
                )}
                
                {currentView === 'registration' && (
                  <Registration onSuccess={handleRegistrationSuccess} onShowDebug={() => setShowDebug(true)} />
                )}
                
                {currentView === 'otp' && (
                  <OTP 
                    userId={userId} 
                    onSuccess={handleOtpSuccess} 
                    onBack={handleOtpBack} 
                  />
                )}
                
                {currentView === 'welcome' && (
                  <Welcome onLogout={handleLogout} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
