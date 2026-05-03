import React, { useEffect, useState } from 'react';
import { logger, LogEntry } from '../lib/logger';
import { Trash2, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface DebugProps {
  onBack: () => void;
}

export function Debug({ onBack }: DebugProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    return logger.subscribe(setLogs);
  }, []);

  const getIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warn': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8 flex flex-col gap-6 h-[80vh] max-h-[800px] w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800">Debug Console</h2>
          <p className="text-sm text-slate-400">System logs, API responses, and errors</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => logger.clear()}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 transition-colors rounded-xl"
            title="Clear logs"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors rounded-xl"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {logs.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-2xl">
            No logs recorded yet.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm overflow-hidden flex flex-col">
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">{getIcon(log.level)}</div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-bold text-slate-700 break-words">{log.message}</span>
                    <span className="text-xs text-slate-400 shrink-0 tabular-nums">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {log.details && (
                    <div className="mt-3 bg-slate-800 text-green-400 font-mono text-xs p-3 sm:p-4 rounded-xl overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(log.details,
                        (key, value) => (value instanceof Error ? { message: value.message, stack: value.stack, name: value.name } : value),
                        2
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
