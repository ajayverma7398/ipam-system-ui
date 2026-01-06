"use client";

import { useMemo, useState } from "react";
import { reportHistory } from "@/lib/data/report-history";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { DataTable, type Column } from "@/components/common/data-display";

interface ReportExecution {
  id: string;
  scheduleId: string;
  scheduleName: string;
  reportType: string;
  status: "success" | "failed" | "running";
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  recipients: number;
  formats: string[];
  error: string | null;
  fileSize: number | null;
}

export function ReportHistory() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed" | "running">("all");
  const [selectedExecution, setSelectedExecution] = useState<ReportExecution | null>(null);

  const executions: ReportExecution[] = useMemo(() => {
    if (!reportHistory?.executions || reportHistory.executions.length === 0) {
      return [];
    }
    
    const now = new Date();
    const allDates = reportHistory.executions.map(exec => new Date(exec.startedAt).getTime());
    const mostRecentDate = new Date(Math.max(...allDates));
    
    const daysDiff = Math.floor((now.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let daysToShift = 0;
    if (daysDiff < 0) {
      daysToShift = Math.abs(daysDiff) + 5;
    } else if (daysDiff < 5) {
      daysToShift = 5 - daysDiff;
    }
    
    return reportHistory.executions.map((exec) => {
      const execDate = new Date(exec.startedAt);
      const adjustedDate = new Date(execDate.getTime() - daysToShift * 24 * 60 * 60 * 1000);
      
      return {
        ...exec,
        startedAt: adjustedDate.toISOString(),
        completedAt: exec.completedAt ? (() => {
          const completedDate = new Date(exec.completedAt);
          const adjustedCompleted = new Date(completedDate.getTime() - daysToShift * 24 * 60 * 60 * 1000);
          return adjustedCompleted.toISOString();
        })() : null,
      };
    });
  }, []);

  const filteredExecutions = useMemo(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : Infinity;
    const now = new Date();
    const cutoff = days === Infinity ? new Date(0) : new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return executions
      .filter((exec) => {
        const execDate = new Date(exec.startedAt);
        const matchesTime = days === Infinity || execDate >= cutoff;
        const matchesStatus = statusFilter === "all" || exec.status === statusFilter;
        return matchesTime && matchesStatus;
      })
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }, [executions, timeRange, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string }> = {
      success: { bg: "bg-green-100", text: "text-green-800" },
      failed: { bg: "bg-red-100", text: "text-red-800" },
      running: { bg: "bg-blue-100", text: "text-blue-800" },
    };
    const config = statusColors[status] || { bg: "bg-slate-100", text: "text-slate-800" };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const columns: Column<ReportExecution>[] = [
    {
      key: "scheduleName",
      label: "Schedule",
      sortable: true,
      render: (value: unknown, row: ReportExecution) => (
        <div>
          <div className="text-sm font-medium text-slate-900">{value as string}</div>
          <div className="text-xs text-slate-500">{row.reportType}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: unknown) => getStatusBadge(value as string),
    },
    {
      key: "startedAt",
      label: "Started At",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">
          {new Date(value as string).toLocaleString()}
        </span>
      ),
    },
    {
      key: "completedAt",
      label: "Completed At",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">
          {value ? new Date(value as string).toLocaleString() : "-"}
        </span>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">
          {value ? `${value as number}s` : "-"}
        </span>
      ),
    },
    {
      key: "recipients",
      label: "Recipients",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">{value as number}</span>
      ),
    },
    {
      key: "formats",
      label: "Formats",
      sortable: false,
      render: (value: unknown) => (
        <div className="flex flex-wrap gap-1">
          {(value as string[]).map((format, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
            >
              {format}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "fileSize",
      label: "Size",
      sortable: true,
      render: (value: unknown, row: ReportExecution) => {
        void value;
        return <span className="text-sm text-slate-900">{formatFileSize(row.fileSize)}</span>;
      },
    },
    {
      key: "error",
      label: "Error",
      sortable: false,
      render: (value: unknown, row: ReportExecution) =>
        value ? (
          <button
            onClick={() => setSelectedExecution(row)}
            className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            View Error
          </button>
        ) : (
          <span className="text-sm text-slate-400">-</span>
        ),
    },
  ];

  const stats = useMemo(() => {
    const total = filteredExecutions.length;
    const successful = filteredExecutions.filter((e) => e.status === "success").length;
    const failed = filteredExecutions.filter((e) => e.status === "failed").length;
    const avgDuration =
      filteredExecutions.filter((e) => e.duration !== null).reduce((sum, e) => sum + (e.duration || 0), 0) /
      filteredExecutions.filter((e) => e.duration !== null).length || 0;

    return { total, successful, failed, avgDuration: Math.round(avgDuration * 10) / 10 };
  }, [filteredExecutions]);

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Execution History</h3>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="running">Running</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Total Executions</p>
            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Successful</p>
            <p className="text-2xl font-bold text-green-900">{stats.successful}</p>
            <p className="text-xs text-green-600 mt-1">
              {stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0}% success rate
            </p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-medium text-red-700 mb-1">Failed</p>
            <p className="text-2xl font-bold text-red-900">{stats.failed}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Avg Duration</p>
            <p className="text-2xl font-bold text-purple-900">{stats.avgDuration}s</p>
          </div>
        </div>

        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={filteredExecutions as unknown as Record<string, unknown>[]}
          pagination={{ pageSize: 10 }}
          emptyMessage="No execution history found"
        />
      </div>

      <Modal
        isOpen={selectedExecution !== null && selectedExecution.error !== null}
        onClose={() => setSelectedExecution(null)}
        title="Error Details"
        size="md"
      >
        {selectedExecution && selectedExecution.error && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Schedule</p>
                <p className="text-sm text-slate-900">{selectedExecution.scheduleName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Report Type</p>
                <p className="text-sm text-slate-900 capitalize">{selectedExecution.reportType}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Started At</p>
                <p className="text-sm text-slate-900">{new Date(selectedExecution.startedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
                <div className="text-sm">{getStatusBadge(selectedExecution.status)}</div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Error Message</p>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 whitespace-pre-wrap">{selectedExecution.error}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Execution ID</p>
              <p className="text-sm font-mono text-slate-900">{selectedExecution.id}</p>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
}

