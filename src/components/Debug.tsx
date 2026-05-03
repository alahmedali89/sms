import React, { useEffect, useState } from 'react';
import { logger, LogEntry, LogLevel } from '../lib/logger';
import { Trash2, X, AlertCircle, Info, AlertTriangle, Copy, Check, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DebugProps {
  onBack: () => void;
}

export function Debug({ onBack }: DebugProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<LogLevel | 'all'>('all');

  useEffect(() => {
    return logger.subscribe(setLogs);
  }, []);

  const getIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'warn': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };

  const getLogStyles = (level: string) => {
    switch (level) {
      case 'error': return 'bg-rose-50/50 border-rose-200/50 text-rose-800';
      case 'warn': return 'bg-amber-50/50 border-amber-200/50 text-amber-800';
      case 'info': return 'bg-blue-50/50 border-blue-200/50 text-blue-800';
      default: return 'bg-slate-50/50 border-slate-200/50 text-slate-800';
    }
  };

  const handleCopy = () => {
    const errorLogs = logs.map(l => `[${new Date(l.timestamp).toLocaleTimeString()}] ${l.level.toUpperCase()}: ${l.message} \n ${l.details ? JSON.stringify(l.details, null, 2) : ''}`).join('\n\n');
    navigator.clipboard.writeText(errorLogs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = logs.filter(log => filter === 'all' || log.level === filter);

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 flex flex-col gap-6 h-[85vh] max-h-[850px] w-full max-w-4xl mx-auto shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Debug Console</h2>
            <div className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Beta</div>
          </div>
          <p className="text-sm text-slate-500">System logs, API responses, and errors</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-200/50 rounded-xl p-1 border border-slate-300/30">
            {(['all', 'error', 'warn', 'info'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="w-px h-6 bg-slate-200 mx-1"></div>

          <button 
            onClick={handleCopy}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-xl flex items-center gap-2 group relative"
            title="Copy all logs"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          </button>
          <button 
            onClick={() => logger.clear()}
            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-colors rounded-xl group"
            title="Clear logs"
          >
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors rounded-xl group"
            title="Close"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {filteredLogs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center p-12 text-slate-400 text-sm border-2 border-dashed border-slate-200/60 rounded-3xl"
            >
               <Filter className="w-8 h-8 text-slate-300 mb-3" />
              {logs.length === 0 ? 'No logs recorded yet.' : 'No logs match the current filter.'}
            </motion.div>
          ) : (
            filteredLogs.map((log) => (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                className={`p-4 sm:p-5 rounded-2xl border text-sm overflow-hidden flex flex-col shadow-sm ${getLogStyles(log.level)}`}
              >
                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">{getIcon(log.level)}</div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <span className="font-bold flex-1 break-words leading-relaxed">{log.message}</span>
                      <span className="text-xs opacity-60 font-mono tracking-tight shrink-0 pt-0.5">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })}
                      </span>
                    </div>
                    {log.details && (
                      <div className="mt-3 bg-slate-900/90 text-emerald-400 font-mono text-xs p-4 rounded-xl overflow-x-auto whitespace-pre-wrap shadow-inner border border-slate-800">
                        {JSON.stringify(log.details,
                          (key, value) => (value instanceof Error ? { message: value.message, stack: value.stack, name: value.name } : value),
                          2
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
