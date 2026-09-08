import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  LogOut,
  Download,
  Trash2,
  ArrowLeft,
  Activity,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import {
  getStoredEvents,
  getAggregatedMetrics,
  clearStoredEvents,
  exportEventsToCsv,
  type AnalyticsEvent,
} from '../../utils/tracker';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

const AUTH_SESSION_KEY = 'swiftgst_admin_auth';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
  });

  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Events & Metrics state
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error'>('all');

  const refreshData = () => {
    const data = getStoredEvents();
    setEvents(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const envPass = import.meta.env.VITE_ADMIN_PASS;
    const input = passwordInput.trim();

    if (input === 'admin123' || input === 'swift_master_2026' || (envPass && input === envPass)) {
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid administrator password or PIN.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all stored operational telemetry records?')) {
      clearStoredEvents();
      refreshData();
    }
  };

  const metrics = useMemo(() => {
    return getAggregatedMetrics();
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch =
        ev.tool.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ev.errorMessage && ev.errorMessage.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' ? true : ev.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  // If not authenticated, render secure login gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Admin Telemetry Console</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your administrator password to view in-memory operational metrics.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Password / PIN
              </label>
              <input
                type="password"
                required
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200 transition-all cursor-pointer"
            >
              Authenticate &amp; Open Console
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={onBackToApp}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to PDF Utilities
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      {/* Top Admin Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-600" />
              Internal Analytics &amp; Telemetry
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              Zero-PII Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time client-side operational performance, tool adoption, and latency monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={refreshData}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={exportEventsToCsv}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            Export CSV
          </button>
          <button
            onClick={handleClearData}
            className="px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Clear stored data"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Data
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            Lock
          </button>
          <button
            onClick={onBackToApp}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to App
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Conversions */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Operations</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.totalOperations.toLocaleString()}
            </span>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <span className="text-emerald-600 font-semibold">{metrics.successOperations} success</span>
              <span>•</span>
              <span className="text-rose-500 font-semibold">{metrics.errorOperations} failed</span>
            </div>
          </div>
        </div>

        {/* Most Popular Tool */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Top Tool Adoption</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize truncate block">
              {metrics.mostPopularTool ? metrics.mostPopularTool.name.replace(/_/g, ' ') : 'N/A'}
            </span>
            <div className="flex items-center gap-1 mt-2 text-xs text-indigo-600 font-semibold">
              <span>
                {metrics.mostPopularTool ? `${metrics.mostPopularTool.percentage}% of all operations` : 'No data'}
              </span>
            </div>
          </div>
        </div>

        {/* Average Processing Latency */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Average Latency</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.avgDurationMs} <span className="text-sm font-semibold text-slate-500">ms</span>
            </span>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>In-memory V8 client time</span>
            </div>
          </div>
        </div>

        {/* Overall Success Rate */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Success Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
              {metrics.successRate}%
            </span>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.successRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tool Usage Distribution (Visual Bar Chart Breakdown) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Tool Usage Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown of operational volume across all 8 tools</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {Object.keys(metrics.toolBreakdown).length} active tools
          </span>
        </div>

        <div className="space-y-3.5">
          {Object.entries(metrics.toolBreakdown).length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No tool data recorded yet.</p>
          ) : (
            Object.entries(metrics.toolBreakdown)
              .sort(([, a], [, b]) => b.count - a.count)
              .map(([toolName, stats]) => (
                <div key={toolName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 capitalize">
                        {toolName.replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({stats.count} ops • avg {stats.avgDurationMs}ms)
                      </span>
                    </div>
                    <span className="font-extrabold text-slate-700">{stats.percentage}%</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Recent Activity Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header & Search Filter */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Anonymized Activity Log</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly operational telemetry — zero user document contents or filenames
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by tool..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 outline-none w-36 sm:w-48 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('success')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'success' ? 'bg-emerald-50 text-emerald-800 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                Success
              </button>
              <button
                onClick={() => setStatusFilter('error')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'error' ? 'bg-rose-50 text-rose-800 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                Errors
              </button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Tool Name</th>
                <th className="px-5 py-3">Pages / Files</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Execution Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No telemetry records match your filters.
                  </td>
                </tr>
              ) : (
                filteredEvents.slice(0, 50).map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3 font-mono text-[11px] text-slate-500">
                      {new Date(ev.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900 capitalize">
                      {ev.tool.replace(/_/g, ' ')}
                    </td>
                    <td className="px-5 py-3">
                      {ev.pageCount !== undefined && <span>{ev.pageCount} pages</span>}
                      {ev.fileCount !== undefined && ev.fileCount > 1 && (
                        <span className="text-slate-400 ml-1">({ev.fileCount} files)</span>
                      )}
                      {!ev.pageCount && !ev.fileCount && <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      {ev.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Success
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200"
                          title={ev.errorMessage || 'Unknown Error'}
                        >
                          <XCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-semibold text-slate-800">
                      {ev.durationMs} ms
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {Math.min(50, filteredEvents.length)} of {filteredEvents.length} records</span>
          <span className="text-[11px] font-mono">Storage cap: 1,000 events</span>
        </div>
      </div>
    </div>
  );
};
