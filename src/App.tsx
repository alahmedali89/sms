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
import { motion, AnimatePresence } from 'motion/react';

type ViewState = 'loading' | 'registration' | 'otp' | 'welcome';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('loading');
  const [userId, setUserId] = useState<string>('');
  const [showDebug, setShowDebug] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        // MOCK BACKEND DISCONNECT
        // const session = await account.get();
        // logger.info('Session found', { session });
        // setCurrentView('welcome');
        throw new Error('Backend disconnected for preview');
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

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } }
  };

    const getPageContext = () => {
      switch (currentView) {
        case 'registration':
          return {
            title: 'Registration',
            badge: 'Secure Authentication',
            mobileBadge: 'Secure Authentication'
          };
        case 'otp':
          return {
            title: 'Secure OTP',
            badge: 'Validation Step',
            mobileBadge: 'Verification'
          };
        case 'welcome':
          return {
            title: 'Portal Access',
            badge: 'Verified User',
            mobileBadge: 'Verified'
          };
        default:
          return {
            title: 'Access Portal',
            badge: 'Secure Authentication',
            mobileBadge: 'Secure Authentication'
          };
      }
    };
  
    const { title, badge, mobileBadge } = getPageContext();

    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-50 sm:bg-slate-100/50 flex items-center justify-center p-4 sm:p-8 overflow-hidden font-sans w-full relative">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200/50 via-slate-50/50 to-slate-100/50 pointer-events-none"></div>

          {/* Debug Dialog overlay */}
          <AnimatePresence>
            {showDebug && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8"
              >
                <div className="w-full max-w-4xl relative">
                  <Debug onBack={() => setShowDebug(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row w-full max-w-5xl z-10 glass lg:rounded-[2.5rem] rounded-3xl overflow-hidden min-h-[600px]">
            
            {/* Desktop Left Panel */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-16 text-white min-h-[600px] border-r border-white/20">
              {/* Background Gradients */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/90 via-purple-500/90 to-indigo-600/90 z-0 mix-blend-multiply"></div>
              <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-300 to-indigo-100 blur-3xl opacity-40 mix-blend-overlay pointer-events-none z-0"></div>
              <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-300 to-purple-300 blur-3xl opacity-40 mix-blend-overlay pointer-events-none z-0"></div>
              
              <div className="relative z-10 w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md shadow-sm border border-white/30 transition-all duration-300">
                  <ShieldCheck className="w-4 h-4" />
                  {badge}
                </div>
                <h1 className="text-4xl xl:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm transition-all duration-300">
                  {currentView === 'welcome' ? (
                    <>Access <br /> Granted.</>
                  ) : (
                    <>Passwordless <br /> Verification.</>
                  )}
                </h1>
                <p className="text-indigo-50/90 text-lg max-w-sm leading-relaxed transition-all duration-300">
                  {currentView === 'welcome' 
                    ? "Welcome to your securely verified portal dashboard." 
                    : "Experience seamless and secure login. We verify your identity instantly via SMS."}
                </p>
              </div>

              <div className="relative z-10 flex flex-col gap-6 mt-12">
                 <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-4 group cursor-default">
                   <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors shadow-sm">
                     <Lock className="w-6 h-6 text-white" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-white drop-shadow-sm">Enterprise Security</h3>
                     <p className="text-sm text-indigo-50/80">End-to-end encrypted validation</p>
                   </div>
                 </motion.div>
                 <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-4 group cursor-default">
                   <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors shadow-sm">
                     <Zap className="w-6 h-6 text-white" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-white drop-shadow-sm">Lightning Fast</h3>
                     <p className="text-sm text-indigo-50/80">Instant OTP delivery & login</p>
                   </div>
                 </motion.div>
              </div>
            </div>

            {/* Right Panel (Forms Layout) */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative bg-white/40 xl:bg-white/50 backdrop-blur-md">
              {/* Mobile Header */}
              <div className="lg:hidden text-center space-y-2 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 backdrop-blur-sm text-indigo-600 border border-indigo-100 text-xs font-semibold uppercase tracking-wider transition-all duration-300">
                  <ShieldCheck className="w-3 h-3" />
                  {mobileBadge}
                </div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight transition-all duration-300">{title}</h1>
              </div>

            <div className="relative w-full max-w-md mx-auto">
              <div className="relative z-10 w-full lg:[&>div]:shadow-none lg:[&>div]:border-transparent lg:[&>div]:bg-transparent lg:[&>div]:p-4 lg:backdrop-blur-none">
                <AnimatePresence mode="wait">
                  {currentView === 'loading' && (
                    <motion.div key="loading" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 p-8 flex justify-center items-center h-64 lg:p-4">
                      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    </motion.div>
                  )}
                  
                  {currentView === 'registration' && (
                    <motion.div key="registration" variants={slideVariants} initial="initial" animate="enter" exit="exit">
                      <Registration onSuccess={handleRegistrationSuccess} onShowDebug={() => setShowDebug(true)} />
                    </motion.div>
                  )}
                  
                  {currentView === 'otp' && (
                    <motion.div key="otp" variants={slideVariants} initial="initial" animate="enter" exit="exit">
                      <OTP 
                        userId={userId} 
                        onSuccess={handleOtpSuccess} 
                        onBack={handleOtpBack} 
                        onShowDebug={() => setShowDebug(true)}
                      />
                    </motion.div>
                  )}
                  
                  {currentView === 'welcome' && (
                    <motion.div key="welcome" variants={slideVariants} initial="initial" animate="enter" exit="exit">
                      <Welcome onLogout={handleLogout} onShowDebug={() => setShowDebug(true)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
