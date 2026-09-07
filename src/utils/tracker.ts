/**
 * DOCUSHIELD PDF - PRIVACY-FIRST ANONYMIZED TELEMETRY & TRACKING
 *
 * PRIVACY GUARANTEE:
 * Never logs or transmits personal user files, document names, or PDF contents.
 * Only tracks anonymized operational metrics:
 * - Tool Name (e.g. 'merge_pdf', 'split_pdf')
 * - Processing duration (in milliseconds)
 * - Page count & file count
 * - Status: 'success' | 'error'
 */

export interface AnalyticsEvent {
  id: string;
  timestamp: string; // ISO string
  timeMs: number;    // Unix timestamp in ms
  tool: string;
  status: 'success' | 'error';
  durationMs: number;
  pageCount?: number;
  fileCount?: number;
  errorMessage?: string;
}

export interface AnalyticsSummary {
  totalOperations: number;
  successOperations: number;
  errorOperations: number;
  successRate: number; // percentage (0-100)
  avgDurationMs: number;
  mostPopularTool: { name: string; count: number; percentage: number } | null;
  toolBreakdown: Record<
    string,
    {
      count: number;
      percentage: number;
      avgDurationMs: number;
      successCount: number;
      errorCount: number;
    }
  >;
}

const STORAGE_KEY = 'docushield_analytics_events';
const MAX_STORED_EVENTS = 1000;

// Declare global Google Analytics gtag
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Initialize Google Analytics 4 dynamically if VITE_GA_MEASUREMENT_ID is defined
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!gaId || gaId.includes('G-XXXXXXXXXX')) {
    // GA4 ID not configured; analytics operates in offline/local storage mode
    return;
  }

  // Prevent duplicate script injection
  if (document.getElementById('ga4-script')) return;

  try {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId, {
      anonymize_ip: true,
      send_page_view: true,
    });
  } catch (err) {
    console.warn('Analytics initialization error:', err);
  }
}

/**
 * Record a telemetry event to both GA4 and local browser cache
 */
export function trackEvent(
  tool: string,
  status: 'success' | 'error',
  metrics: {
    durationMs: number;
    pageCount?: number;
    fileCount?: number;
    errorMessage?: string;
  }
): void {
  const event: AnalyticsEvent = {
    id: Math.random().toString(36).substring(2, 10),
    timestamp: new Date().toISOString(),
    timeMs: Date.now(),
    tool,
    status,
    durationMs: Math.max(0, Math.round(metrics.durationMs)),
    pageCount: metrics.pageCount,
    fileCount: metrics.fileCount,
    errorMessage: metrics.errorMessage ? metrics.errorMessage.substring(0, 100) : undefined,
  };

  // 1. Dispatch to Google Analytics 4 (if loaded)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'pdf_tool_action', {
        tool_name: event.tool,
        status: event.status,
        duration_ms: event.durationMs,
        page_count: event.pageCount || 0,
        file_count: event.fileCount || 1,
      });
    } catch (err) {
      console.debug('Failed to send GA4 event', err);
    }
  }

  // 2. Persist to localStorage for internal Admin Dashboard inspection
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = getStoredEvents();
      // Prepend recent event and cap to max limit
      const updated = [event, ...stored].slice(0, MAX_STORED_EVENTS);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.debug('Failed to save event to localStorage', err);
    }
  }
}

/**
 * Start tool execution timer
 * Returns current timestamp in milliseconds
 */
export function trackToolStart(toolName: string): number {
  return performance.now();
}

/**
 * Log tool execution success
 */
export function trackToolSuccess(
  toolName: string,
  meta: {
    startTime?: number;
    durationMs?: number;
    pageCount?: number;
    fileCount?: number;
  }
): void {
  const durationMs =
    meta.durationMs !== undefined
      ? meta.durationMs
      : meta.startTime !== undefined
      ? performance.now() - meta.startTime
      : 0;

  trackEvent(toolName, 'success', {
    durationMs,
    pageCount: meta.pageCount,
    fileCount: meta.fileCount,
  });
}

/**
 * Log tool execution error
 */
export function trackToolError(
  toolName: string,
  meta: {
    startTime?: number;
    durationMs?: number;
    errorMessage: string;
  }
): void {
  const durationMs =
    meta.durationMs !== undefined
      ? meta.durationMs
      : meta.startTime !== undefined
      ? performance.now() - meta.startTime
      : 0;

  trackEvent(toolName, 'error', {
    durationMs,
    errorMessage: meta.errorMessage,
  });
}

/**
 * Retrieve all logged events from localStorage
 */
export function getStoredEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    if (!data) return getInitialDemoEvents();
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Clear all events from localStorage
 */
export function clearStoredEvents(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/**
 * Compute aggregated KPI metrics across stored operational events
 */
export function getAggregatedMetrics(): AnalyticsSummary {
  const events = getStoredEvents();

  if (events.length === 0) {
    return {
      totalOperations: 0,
      successOperations: 0,
      errorOperations: 0,
      successRate: 100,
      avgDurationMs: 0,
      mostPopularTool: null,
      toolBreakdown: {},
    };
  }

  let totalDuration = 0;
  let successCount = 0;
  let errorCount = 0;
  const toolCounts: Record<
    string,
    { count: number; totalDuration: number; successCount: number; errorCount: number }
  > = {};

  for (const ev of events) {
    totalDuration += ev.durationMs || 0;
    if (ev.status === 'success') {
      successCount++;
    } else {
      errorCount++;
    }

    if (!toolCounts[ev.tool]) {
      toolCounts[ev.tool] = { count: 0, totalDuration: 0, successCount: 0, errorCount: 0 };
    }
    toolCounts[ev.tool].count++;
    toolCounts[ev.tool].totalDuration += ev.durationMs || 0;
    if (ev.status === 'success') {
      toolCounts[ev.tool].successCount++;
    } else {
      toolCounts[ev.tool].errorCount++;
    }
  }

  const toolBreakdown: AnalyticsSummary['toolBreakdown'] = {};
  let popularTool: { name: string; count: number } | null = null;

  for (const [toolName, data] of Object.entries(toolCounts)) {
    const pct = parseFloat(((data.count / events.length) * 100).toFixed(1));
    toolBreakdown[toolName] = {
      count: data.count,
      percentage: pct,
      avgDurationMs: Math.round(data.totalDuration / data.count),
      successCount: data.successCount,
      errorCount: data.errorCount,
    };

    if (!popularTool || data.count > popularTool.count) {
      popularTool = { name: toolName, count: data.count };
    }
  }

  const mostPopularTool = popularTool
    ? {
        name: popularTool.name,
        count: popularTool.count,
        percentage: parseFloat(((popularTool.count / events.length) * 100).toFixed(1)),
      }
    : null;

  return {
    totalOperations: events.length,
    successOperations: successCount,
    errorOperations: errorCount,
    successRate: parseFloat(((successCount / events.length) * 100).toFixed(1)),
    avgDurationMs: Math.round(totalDuration / events.length),
    mostPopularTool,
    toolBreakdown,
  };
}

/**
 * Export all analytics events to a clean CSV file
 */
export function exportEventsToCsv(): void {
  const events = getStoredEvents();
  if (events.length === 0) {
    alert('No telemetry records available to export.');
    return;
  }

  const headers = ['ID', 'Timestamp', 'Tool', 'Status', 'Duration (ms)', 'Page Count', 'File Count', 'Error'];
  const rows = events.map((ev) => [
    ev.id,
    ev.timestamp,
    ev.tool,
    ev.status,
    ev.durationMs,
    ev.pageCount ?? '',
    ev.fileCount ?? '',
    ev.errorMessage ? `"${ev.errorMessage.replace(/"/g, '""')}"` : '',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `docushield_analytics_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Initial sample metrics so the admin dashboard presents helpful charts upon first visit
 */
function getInitialDemoEvents(): AnalyticsEvent[] {
  const tools = [
    'merge_pdf',
    'split_pdf',
    'rotate_pdf',
    'delete_pages',
    'images_to_pdf',
    'pdf_to_images',
    'watermark_pdf',
    'protect_pdf',
  ];

  const now = Date.now();
  const demoEvents: AnalyticsEvent[] = [];

  for (let i = 0; i < 28; i++) {
    const tool = tools[i % tools.length];
    const isError = i === 14 || i === 25;
    const duration = Math.floor(180 + Math.random() * 850);
    const pages = Math.floor(1 + Math.random() * 12);
    const timeMs = now - (28 - i) * 3600 * 1000 * 3;

    demoEvents.push({
      id: Math.random().toString(36).substring(2, 10),
      timestamp: new Date(timeMs).toISOString(),
      timeMs,
      tool,
      status: isError ? 'error' : 'success',
      durationMs: duration,
      pageCount: pages,
      fileCount: tool === 'merge_pdf' ? Math.floor(2 + Math.random() * 3) : 1,
      errorMessage: isError ? 'User aborted or memory threshold' : undefined,
    });
  }

  return demoEvents.reverse();
}
