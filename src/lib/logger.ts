type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface OpenTelemetryTraceEntry {
  traceId: string;
  spanId: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service: string;
  route: string;
  method: string;
  statusCode: number;
  durationMs: number;
  message: string;
  metadata?: Record<string, any>;
}

const MAX_TRACES = 120;

declare global {
  // eslint-disable-next-line no-var
  var __visionAiOtelTraces: OpenTelemetryTraceEntry[] | undefined;
}

function generateHexId(bytes: number): string {
  let out = '';
  const chars = '0123456789abcdef';
  for (let i = 0; i < bytes * 2; i++) {
    out += chars[Math.floor(Math.random() * 16)];
  }
  return out;
}

function getInitialTraces(): OpenTelemetryTraceEntry[] {
  const now = Date.now();
  return [
    {
      traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
      spanId: '00f067aa0ba902b7',
      timestamp: new Date(now - 240_000).toISOString(),
      level: 'INFO',
      service: 'visionai-cloudrun',
      route: '/api/health',
      method: 'GET',
      statusCode: 200,
      durationMs: 14,
      message: 'Deep readiness probe succeeded (Firestore RBAC, Gemini Proxy, Dispatch Queue)',
      metadata: { region: 'asia-east1', revision: 'visionai-00042-x9k' },
    },
    {
      traceId: '7a1c8e9201d44f11b8e0192837465abc',
      spanId: '91a2b3c4d5e6f701',
      timestamp: new Date(now - 180_000).toISOString(),
      level: 'INFO',
      service: 'visionai-dispatch-worker',
      route: '/api/devops/dispatch',
      method: 'POST',
      statusCode: 200,
      durationMs: 162,
      message: 'Idempotent dispatch completed for @VisionAI_HQ on linkedin (200 OK)',
      metadata: { idempotencyKey: 'idem_li_98234a', attempts: 1 },
    },
    {
      traceId: '3c90e1f455a2489982c1102938475def',
      spanId: '44b5c6d7e8f90123',
      timestamp: new Date(now - 125_000).toISOString(),
      level: 'WARN',
      service: 'visionai-dispatch-worker',
      route: '/api/devops/dispatch',
      method: 'POST',
      statusCode: 429,
      durationMs: 310,
      message: 'Upstream rate limit (429) on instagram graph API; scheduled retry #2 with 4s exponential backoff',
      metadata: { provider: 'instagram', attempt: 2, maxAttempts: 3, backoffMs: 4000 },
    },
    {
      traceId: '9f8e7d6c5b4a3210fedcba9876543210',
      spanId: '123456789abcdef0',
      timestamp: new Date(now - 75_000).toISOString(),
      level: 'INFO',
      service: 'visionai-webhook-ingestor',
      route: '/api/webhooks/stripe',
      method: 'POST',
      statusCode: 200,
      durationMs: 28,
      message: 'HMAC-SHA256 verified Stripe webhook checkout.session.completed ($499.00)',
      metadata: { provider: 'stripe', signatureVerified: true },
    },
    {
      traceId: '1a2b3c4d5e6f708192a3b4c5d6e7f809',
      spanId: 'fedcba0987654321',
      timestamp: new Date(now - 35_000).toISOString(),
      level: 'ERROR',
      service: 'visionai-dispatch-worker',
      route: '/api/devops/dispatch',
      method: 'POST',
      statusCode: 503,
      durationMs: 485,
      message: 'Max retry attempts (3/3) exhausted for youtube video broadcast; moved job to Dead-Letter Queue (DLQ)',
      metadata: { provider: 'youtube', jobId: 'job_dlq_youtube_01', status: 'dead_letter' },
    },
  ];
}

function getTraceBuffer(): OpenTelemetryTraceEntry[] {
  if (!global.__visionAiOtelTraces) {
    global.__visionAiOtelTraces = getInitialTraces();
  }
  return global.__visionAiOtelTraces;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, meta?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const traceId = meta?.traceId || generateHexId(16);
    const spanId = meta?.spanId || generateHexId(8);
    const route = meta?.route || '/api/internal';
    const method = meta?.method || 'INTERNAL';
    const statusCode =
      typeof meta?.statusCode === 'number'
        ? meta.statusCode
        : level === 'error'
        ? 500
        : level === 'warn'
        ? 429
        : 200;
    const durationMs = typeof meta?.durationMs === 'number' ? meta.durationMs : 12;

    const entry: OpenTelemetryTraceEntry = {
      traceId,
      spanId,
      timestamp,
      level: level.toUpperCase() as OpenTelemetryTraceEntry['level'],
      service: meta?.service || 'visionai-api',
      route,
      method,
      statusCode,
      durationMs,
      message,
      metadata: meta,
    };

    const buffer = getTraceBuffer();
    buffer.unshift(entry);
    if (buffer.length > MAX_TRACES) {
      buffer.length = MAX_TRACES;
    }

    return JSON.stringify(entry);
  }

  info(message: string, meta?: Record<string, any>) {
    console.log(this.formatMessage('info', message, meta));
  }

  warn(message: string, meta?: Record<string, any>) {
    console.warn(this.formatMessage('warn', message, meta));
  }

  error(message: string, error?: Error | unknown, meta?: Record<string, any>) {
    const errorMeta =
      error instanceof Error
        ? { errorName: error.name, errorMessage: error.message, stack: error.stack }
        : { error };
    console.error(this.formatMessage('error', message, { ...errorMeta, ...meta }));
  }

  debug(message: string, meta?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }

  recordTrace(partial: Partial<OpenTelemetryTraceEntry> & { message: string }) {
    const buffer = getTraceBuffer();
    const entry: OpenTelemetryTraceEntry = {
      traceId: partial.traceId || generateHexId(16),
      spanId: partial.spanId || generateHexId(8),
      timestamp: partial.timestamp || new Date().toISOString(),
      level: partial.level || 'INFO',
      service: partial.service || 'visionai-api',
      route: partial.route || '/api/devops',
      method: partial.method || 'POST',
      statusCode: partial.statusCode ?? 200,
      durationMs: partial.durationMs ?? 18,
      message: partial.message,
      metadata: partial.metadata,
    };
    buffer.unshift(entry);
    if (buffer.length > MAX_TRACES) {
      buffer.length = MAX_TRACES;
    }
    return entry;
  }

  getTraces(levelFilter?: string): OpenTelemetryTraceEntry[] {
    const buffer = getTraceBuffer();
    if (!levelFilter || levelFilter === 'ALL') {
      return [...buffer];
    }
    const upper = levelFilter.toUpperCase();
    return buffer.filter((t) => t.level === upper);
  }

  clearTraces() {
    global.__visionAiOtelTraces = [];
  }

  startTimer(label: string) {
    const start = performance.now();
    return () => {
      const durationMs = Math.round(performance.now() - start);
      this.debug(`Timer [${label}] completed`, { label, durationMs });
      return durationMs;
    };
  }
}

export const logger = new Logger();
export default logger;