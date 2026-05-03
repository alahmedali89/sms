export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  details?: any;
}

class Logger {
  logs: LogEntry[] = [];
  listeners: ((logs: LogEntry[]) => void)[] = [];

  add(level: LogLevel, message: string, details?: any) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      level,
      message,
      details,
    };
    this.logs = [entry, ...this.logs];
    this.notify();
  }

  error(message: string, details?: any) {
    this.add('error', message, details);
  }

  warn(message: string, details?: any) {
    this.add('warn', message, details);
  }

  info(message: string, details?: any) {
    this.add('info', message, details);
  }

  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener);
    listener([...this.logs]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l([...this.logs]));
  }

  clear() {
    this.logs = [];
    this.notify();
  }
}

export const logger = new Logger();

// Capture unhandled errors on the window conditionally if it's browser
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    logger.error(`Uncaught Error: ${e.message}`, { filename: e.filename, lineno: e.lineno, colno: e.colno, error: e.error });
  });
  window.addEventListener('unhandledrejection', (e) => {
    logger.error(`Unhandled Promise Rejection`, { reason: e.reason });
  });
}
