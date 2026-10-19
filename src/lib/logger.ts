import { env } from '@/ai/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(level: LogLevel, message: string, data?: any, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
      ...(error && { error }),
    };
  }

  private store(entry: LogEntry) {
    // Keep only last MAX_LOGS entries
    this.logs = [...this.logs.slice(-this.MAX_LOGS + 1), entry];
    
    // In development, also console log
    if (env.NODE_ENV === 'development') {
      const { timestamp, level, message, data, error } = entry;
      console[level](`[${timestamp}] ${message}`, data || '', error || '');
    }
  }

  debug(message: string, data?: any) {
    this.store(this.formatLog('debug', message, data));
  }

  info(message: string, data?: any) {
    this.store(this.formatLog('info', message, data));
  }

  warn(message: string, data?: any) {
    this.store(this.formatLog('warn', message, data));
  }

  error(message: string, error?: Error, data?: any) {
    this.store(this.formatLog('error', message, data, error));
  }

  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Performance monitoring
  startTimer(label: string): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.debug(`Timer [${label}]`, { duration: `${duration.toFixed(2)}ms` });
      return duration;
    };
  }
}

export const logger = Logger.getInstance(); 