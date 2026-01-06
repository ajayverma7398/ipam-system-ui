"use client";

import { useMemo, useState } from "react";
import { activities } from "@/lib/data/activities";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui";
import { DataTable, type Column } from "@/components/common/data-display";

type ActivityType = "all" | "ip_allocation" | "ip_release" | "pool_creation" | "pool_deletion" | "user_login" | "system_alert";

export function AuditTrail() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState({
    activityType: "all" as ActivityType,
    userId: "all",
    poolId: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [selectedActivity, setSelectedActivity] = useState<typeof activities[0] | null>(null);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (filters.activityType !== "all" && activity.type !== filters.activityType) return false;
      if (filters.userId !== "all" && activity.user !== filters.userId) return false;
      if (filters.poolId !== "all" && activity.pool_id !== filters.poolId) return false;
      
      if (filters.dateFrom) {
        const activityDate = new Date(activity.timestamp);
        const fromDate = new Date(filters.dateFrom);
        if (activityDate < fromDate) return false;
      }
      
      if (filters.dateTo) {
        const activityDate = new Date(activity.timestamp);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (activityDate > toDate) return false;
      }
      
      return true;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filters]);

  const handleExport = (format: "csv" | "json" | "pdf") => {
    if (format === "csv") {
      const csvContent = [
        ["Timestamp", "Type", "User", "Description", "IP Address", "Pool ID", "Severity"].join(","),
        ...filteredActivities.map((activity) =>
          [
            activity.timestamp,
            activity.type,
            activity.user,
            `"${activity.description.replace(/"/g, '""')}"`,
            activity.ip_address || "",
            activity.pool_id || "",
            activity.severity || "",
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-trail-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast("Audit trail exported as CSV", "success");
    } else if (format === "json") {
      const jsonContent = JSON.stringify(filteredActivities, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-trail-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast("Audit trail exported as JSON", "success");
    } else {
      showToast("PDF export coming soon", "info");
    }
  };

  const getActivityTypeBadge = (type: string) => {
    const typeColors: Record<string, { bg: string; text: string }> = {
      ip_allocation: { bg: "bg-green-100", text: "text-green-800" },
      ip_release: { bg: "bg-red-100", text: "text-red-800" },
      pool_creation: { bg: "bg-blue-100", text: "text-blue-800" },
      pool_deletion: { bg: "bg-red-100", text: "text-red-800" },
      user_login: { bg: "bg-purple-100", text: "text-purple-800" },
      system_alert: { bg: "bg-yellow-100", text: "text-yellow-800" },
    };
    const config = typeColors[type] || { bg: "bg-slate-100", text: "text-slate-800" };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {type.replace(/_/g, " ")}
      </span>
    );
  };

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;
    const severityColors: Record<string, { bg: string; text: string }> = {
      info: { bg: "bg-blue-100", text: "text-blue-800" },
      warning: { bg: "bg-yellow-100", text: "text-yellow-800" },
      error: { bg: "bg-red-100", text: "text-red-800" },
    };
    const config = severityColors[severity] || { bg: "bg-slate-100", text: "text-slate-800" };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {severity}
      </span>
    );
  };

  const columns: Column<typeof activities[0]>[] = [
    {
      key: "timestamp",
      label: "Timestamp",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900 whitespace-nowrap">
          {new Date(value as string).toLocaleString()}
        </span>
      ),
      className: "whitespace-nowrap",
    },
    {
      key: "type",
      label: "Activity Type",
      sortable: true,
      render: (value: unknown) => getActivityTypeBadge(value as string),
      className: "whitespace-nowrap",
    },
    {
      key: "user",
      label: "User",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900 whitespace-nowrap">{value as string}</span>
      ),
      className: "whitespace-nowrap",
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900 max-w-xs truncate block" title={value as string}>{value as string}</span>
      ),
      className: "max-w-xs",
    },
    {
      key: "ip_address",
      label: "IP Address",
      sortable: true,
      render: (value: unknown, row: typeof activities[0]) => (
        <span className="text-sm font-mono text-slate-900 whitespace-nowrap">
          {row.ip_address || "-"}
        </span>
      ),
      className: "whitespace-nowrap",
    },
    {
      key: "pool_id",
      label: "Pool",
      sortable: true,
      render: (value: unknown, row: typeof activities[0]) => (
        <span className="text-sm text-slate-900 whitespace-nowrap">
          {row.pool_id ? pools.find((p) => p.id === row.pool_id)?.cidr || row.pool_id : "-"}
        </span>
      ),
      className: "whitespace-nowrap",
    },
    {
      key: "severity",
      label: "Severity",
      sortable: true,
      render: (value: unknown, row: typeof activities[0]) => getSeverityBadge(row.severity),
      className: "whitespace-nowrap",
    },
    {
      key: "details",
      label: "Details",
      sortable: false,
      render: (value: unknown, row: typeof activities[0]) => {
        if (!row.details || Object.keys(row.details).length === 0) return <span className="text-sm text-slate-400">-</span>;
        return (
          <button
            onClick={() => setSelectedActivity(row)}
            className="text-xs text-[#2b6cb0] hover:text-[#2563eb] font-medium transition-colors whitespace-nowrap"
          >
            View
          </button>
        );
      },
      className: "whitespace-nowrap",
    },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="space-y-6 w-full min-w-0 max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Complete Audit Trail</h3>
            <p className="text-sm text-slate-600">All system changes and user activities</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleExport("csv")}
              className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors text-sm whitespace-nowrap"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport("json")}
              className="px-3 py-2 bg-green-50 text-green-700 border border-green-300 rounded-lg hover:bg-green-100 transition-colors text-sm whitespace-nowrap"
            >
              Export JSON
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Activity Type</label>
            <select
              value={filters.activityType}
              onChange={(e) => setFilters({ ...filters, activityType: e.target.value as ActivityType })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Types</option>
              <option value="ip_allocation">IP Allocation</option>
              <option value="ip_release">IP Release</option>
              <option value="pool_creation">Pool Creation</option>
              <option value="pool_deletion">Pool Deletion</option>
              <option value="user_login">User Login</option>
              <option value="system_alert">System Alert</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">User</label>
            <select
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Users</option>
              {Array.from(new Set(activities.map((a) => a.user))).map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
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
              {pools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.cidr}
                </option>
              ))}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Total Activities</p>
            <p className="text-2xl font-bold text-blue-900">{filteredActivities.length}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Unique Users</p>
            <p className="text-2xl font-bold text-green-900">
              {new Set(filteredActivities.map((a) => a.user)).size}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-medium text-yellow-700 mb-1">Warnings</p>
            <p className="text-2xl font-bold text-yellow-900">
              {filteredActivities.filter((a) => a.severity === "warning").length}
            </p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-medium text-red-700 mb-1">Errors</p>
            <p className="text-2xl font-bold text-red-900">
              {filteredActivities.filter((a) => a.severity === "error").length}
            </p>
          </div>
        </div>

        <div className="w-full max-w-full min-w-0">
          <DataTable
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            data={filteredActivities as unknown as Record<string, unknown>[]}
            pagination={{ pageSize: 10 }}
            emptyMessage="No audit trail entries found"
          />
        </div>
      </div>

      <Modal
        isOpen={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
        title="Activity Details"
        size="lg"
      >
        {selectedActivity && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Activity Type</p>
                <div className="text-sm">{getActivityTypeBadge(selectedActivity.type)}</div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Timestamp</p>
                <p className="text-sm text-slate-900">{new Date(selectedActivity.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">User</p>
                <p className="text-sm text-slate-900">{selectedActivity.user}</p>
              </div>
              {selectedActivity.severity && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Severity</p>
                  <div className="text-sm">{getSeverityBadge(selectedActivity.severity)}</div>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Description</p>
              <p className="text-sm text-slate-900">{selectedActivity.description}</p>
            </div>

            {(selectedActivity.ip_address || selectedActivity.pool_id) && (
              <div className="grid grid-cols-2 gap-4">
                {selectedActivity.ip_address && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">IP Address</p>
                    <p className="text-sm font-mono text-slate-900">{selectedActivity.ip_address}</p>
                  </div>
                )}
                {selectedActivity.pool_id && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Pool</p>
                    <p className="text-sm text-slate-900">
                      {pools.find((p) => p.id === selectedActivity.pool_id)?.cidr || selectedActivity.pool_id}
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedActivity.details && Object.keys(selectedActivity.details).length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Details</p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-slate-900 font-mono whitespace-pre-wrap">
                    {JSON.stringify(selectedActivity.details, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
}

