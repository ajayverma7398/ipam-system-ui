"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { dashboardData, type DashboardAlert } from "@/lib/data";
import { pools } from "@/lib/data/pools";
import { DataTable, type Column, StatusBadge } from "@/components/common/data-display";
import { useToast } from "@/components/ui";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

type AlertTypeFilter = "all" | "warning" | "error" | "info";
type SeverityFilter = "all" | "low" | "medium" | "high";

export default function AlertsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    alertType: "all" as AlertTypeFilter,
    severity: "all" as SeverityFilter,
    poolId: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());

  const filteredAlerts = useMemo(() => {
    let result = dashboardData.alerts.filter((alert: DashboardAlert) => !dismissedAlerts.has(alert.id));

    if (filters.alertType !== "all") {
      result = result.filter((alert: DashboardAlert) => alert.type === filters.alertType);
    }

    if (filters.severity !== "all") {
      result = result.filter((alert: DashboardAlert) => alert.severity === filters.severity);
    }

    if (filters.poolId !== "all") {
      result = result.filter((alert: DashboardAlert) => alert.pool_id === filters.poolId);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter((alert: DashboardAlert) => new Date(alert.timestamp) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((alert: DashboardAlert) => new Date(alert.timestamp) <= toDate);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (alert: DashboardAlert) =>
          alert.message.toLowerCase().includes(query) ||
          alert.type.toLowerCase().includes(query) ||
          (alert.ip_address && alert.ip_address.includes(query)) ||
          (alert.pool_id && alert.pool_id.includes(query)) ||
          (alert.severity && alert.severity.toLowerCase().includes(query))
      );
    }

    return result.sort((a: DashboardAlert, b: DashboardAlert) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filters, searchQuery, dismissedAlerts]);

  const handleAcknowledge = (alertId: string) => {
    setAcknowledgedAlerts((prev) => new Set(prev).add(alertId));
    showToast("Alert has been marked as acknowledged", "success");
  };

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(alertId));
    showToast("Alert has been dismissed", "success");
  };

  const handleBulkAcknowledge = () => {
    const unacknowledged = filteredAlerts.filter((alert: DashboardAlert) => !acknowledgedAlerts.has(alert.id));
    setAcknowledgedAlerts((prev) => {
      const next = new Set(prev);
      unacknowledged.forEach((alert: DashboardAlert) => next.add(alert.id));
      return next;
    });
    showToast(`${unacknowledged.length} alerts acknowledged`, "success");
  };

  const handleBulkDismiss = () => {
    const undismissed = filteredAlerts.filter((alert: DashboardAlert) => !dismissedAlerts.has(alert.id));
    setDismissedAlerts((prev) => {
      const next = new Set(prev);
      undismissed.forEach((alert: DashboardAlert) => next.add(alert.id));
      return next;
    });
    showToast(`${undismissed.length} alerts dismissed`, "success");
  };

  const handleExport = (format: "csv" | "json") => {
    const headers = ["ID", "Timestamp", "Type", "Severity", "Message", "IP Address", "Pool ID"];
    let content = "";

    if (format === "csv") {
      content = [
        headers.join(","),
        ...filteredAlerts.map((alert: DashboardAlert) =>
          [
            alert.id,
            alert.timestamp,
            alert.type,
            alert.severity || "",
            `"${alert.message.replace(/"/g, '""')}"`,
            alert.ip_address || "",
            alert.pool_id || "",
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([content], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `alerts-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      content = JSON.stringify(filteredAlerts, null, 2);
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `alerts-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    showToast(`Alerts exported as ${format.toUpperCase()}`, "success");
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "info":
      default:
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };


  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const mapAlertTypeToStatus = (alertType: "warning" | "error" | "info"): "allocated" | "pending" | "system" => {
    switch (alertType) {
      case "error":
        return "allocated"; // Red color
      case "warning":
        return "pending"; // Orange color
      case "info":
        return "system"; // Purple color
    }
  };

  const uniquePools = Array.from(new Set(dashboardData.alerts.filter((a: DashboardAlert) => a.pool_id).map((a: DashboardAlert) => a.pool_id!))).sort();

  const columns: Column<DashboardAlert>[] = [
    {
      key: "timestamp",
      label: "Timestamp",
      sortable: true,
      render: (value: unknown, row: DashboardAlert) => (
        <span className="text-sm text-slate-700 font-mono">
          {formatTimestamp(row.timestamp)}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: unknown, row: DashboardAlert) => {
        return (
          <div className="flex items-center gap-2">
            {getAlertIcon(row.type)}
            <StatusBadge status={mapAlertTypeToStatus(row.type)} type="pool" />
          </div>
        );
      },
    },
    {
      key: "message",
      label: "Message",
      sortable: true,
      render: (value: unknown, row: DashboardAlert) => (
        <span className="text-sm text-slate-900 max-w-md" title={row.message}>
          {row.message}
        </span>
      ),
    },
    {
      key: "severity",
      label: "Severity",
      sortable: true,
      render: (value: unknown, row: DashboardAlert) => {
        if (!row.severity) return <span className="text-sm text-slate-400">—</span>;
        return (
          <span
            className={`text-xs px-2 py-1 rounded border font-medium ${getSeverityColor(row.severity)}`}
          >
            {row.severity.toUpperCase()}
          </span>
        );
      },
    },
    {
      key: "ip_address",
      label: "IP Address",
      sortable: true,
      render: (value: unknown, row: DashboardAlert) => {
        if (!row.ip_address) return <span className="text-sm text-slate-400">—</span>;
        return (
          <button
            onClick={() => router.push(`/dashboard/pools?search=${row.ip_address}`)}
            className="text-sm text-blue-600 hover:text-blue-700 font-mono"
          >
            {row.ip_address}
          </button>
        );
      },
    },
    {
      key: "pool_id",
      label: "Pool",
      sortable: true,
      render: (value: unknown, row: DashboardAlert) => {
        if (!row.pool_id) return <span className="text-sm text-slate-400">—</span>;
        const pool = pools.find((p) => p.id === row.pool_id);
        return (
          <button
            onClick={() => router.push(`/dashboard/pools/${row.pool_id}`)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {pool?.cidr || row.pool_id}
          </button>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (value: unknown, row: DashboardAlert) => {
        const isAcknowledged = acknowledgedAlerts.has(row.id);
        const isDismissed = dismissedAlerts.has(row.id);

        if (isDismissed) {
          return <span className="text-xs text-slate-400">Dismissed</span>;
        }

        return (
          <div className="flex items-center gap-2">
            {!isAcknowledged && (
              <button
                onClick={() => handleAcknowledge(row.id)}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Acknowledge
              </button>
            )}
            <button
              onClick={() => handleDismiss(row.id)}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Dismiss
            </button>
          </div>
        );
      },
    },
  ];

  const alertTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredAlerts.forEach((alert: DashboardAlert) => {
      counts[alert.type] = (counts[alert.type] || 0) + 1;
    });
    return counts;
  }, [filteredAlerts]);

  const unreadCount = filteredAlerts.filter((alert: DashboardAlert) => !acknowledgedAlerts.has(alert.id) && !dismissedAlerts.has(alert.id)).length;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
        <div className="mb-6">
          <div className="flex items-center justify-end mb-2">
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 mr-2 rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkAcknowledge}
                disabled={unreadCount === 0}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Acknowledge All
              </button>
              <button
                onClick={handleBulkDismiss}
                disabled={filteredAlerts.length === 0}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Dismiss All
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </button>
              <button
                onClick={() => handleExport("json")}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export JSON
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-xs font-medium text-slate-600 mb-1">Total Alerts</p>
            <p className="text-2xl font-bold text-slate-900">{filteredAlerts.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-slate-600 mb-1">Errors</p>
            <p className="text-2xl font-bold text-red-600">{alertTypeCounts.error || 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-slate-600 mb-1">Warnings</p>
            <p className="text-2xl font-bold text-yellow-600">{alertTypeCounts.warning || 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-slate-600 mb-1">Info</p>
            <p className="text-2xl font-bold text-blue-600">{alertTypeCounts.info || 0}</p>
          </Card>
        </div>

        <Card className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by message, type, IP address, pool, or severity..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Alert Type</label>
                <select
                  value={filters.alertType}
                  onChange={(e) => setFilters({ ...filters, alertType: e.target.value as AlertTypeFilter })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="error">Error</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value as SeverityFilter })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pool</label>
                <select
                  value={filters.poolId}
                  onChange={(e) => setFilters({ ...filters, poolId: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Pools</option>
                  {uniquePools.map((poolId) => {
                    const pool = pools.find((p) => p.id === poolId);
                    return (
                      <option key={poolId} value={poolId}>
                        {pool?.cidr || poolId}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {(filters.alertType !== "all" ||
              filters.severity !== "all" ||
              filters.poolId !== "all" ||
              filters.dateFrom ||
              filters.dateTo ||
              searchQuery) && (
              <div>
                <button
                  onClick={() => {
                    setFilters({
                      alertType: "all",
                      severity: "all",
                      poolId: "all",
                      dateFrom: "",
                      dateTo: "",
                    });
                    setSearchQuery("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="w-full max-w-full min-w-0">
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={filteredAlerts as unknown as Record<string, unknown>[]}
              pagination={{ pageSize: 25 }}
              emptyMessage="No alerts found matching your filters"
            />
          </div>
        </Card>
      </div>
  );
}

