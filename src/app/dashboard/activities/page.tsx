"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { activities, type Activity, type ActivityType } from "@/lib/data/activities";
import { pools } from "@/lib/data/pools";
import { users } from "@/lib/data/users";
import { DataTable, type Column } from "@/components/common/data-display";
import { useToast } from "@/components/ui";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

/**
 * Activities Page
 * 
 * Full page view of all system activities with filtering, search, and export capabilities.
 * Displays complete activity log with detailed information.
 */

type ActivityTypeFilter = "all" | ActivityType;

export default function ActivitiesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    activityType: "all" as ActivityTypeFilter,
    userId: "all",
    poolId: "all",
    severity: "all" as "all" | "info" | "warning" | "error",
    dateFrom: "",
    dateTo: "",
  });

  const filteredActivities = useMemo(() => {
    let result = activities;

    // Filter by activity type
    if (filters.activityType !== "all") {
      result = result.filter((activity) => activity.type === filters.activityType);
    }

    // Filter by user
    if (filters.userId !== "all") {
      result = result.filter((activity) => activity.user === filters.userId);
    }

    // Filter by pool
    if (filters.poolId !== "all") {
      result = result.filter((activity) => activity.pool_id === filters.poolId);
    }

    // Filter by severity
    if (filters.severity !== "all") {
      result = result.filter((activity) => activity.severity === filters.severity);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter((activity) => new Date(activity.timestamp) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((activity) => new Date(activity.timestamp) <= toDate);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (activity) =>
          activity.description.toLowerCase().includes(query) ||
          activity.user.toLowerCase().includes(query) ||
          activity.type.toLowerCase().includes(query) ||
          (activity.ip_address && activity.ip_address.includes(query)) ||
          (activity.pool_id && activity.pool_id.includes(query))
      );
    }

    // Sort by timestamp (newest first)
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filters, searchQuery]);

  const handleExport = (format: "csv" | "json") => {
    const headers = ["ID", "Timestamp", "Type", "User", "Description", "IP Address", "Pool ID", "Severity"];
    let content = "";

    if (format === "csv") {
      content = [
        headers.join(","),
        ...filteredActivities.map((activity) =>
          [
            activity.id,
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

      const blob = new Blob([content], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `activities-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      content = JSON.stringify(filteredActivities, null, 2);
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `activities-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    showToast(`Activities exported as ${format.toUpperCase()}`, "success");
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case "ip_allocation":
        return "bg-green-500";
      case "ip_release":
        return "bg-red-500";
      case "pool_creation":
        return "bg-blue-500";
      case "pool_deletion":
        return "bg-orange-500";
      case "user_login":
        return "bg-purple-500";
      case "system_alert":
        return "bg-yellow-500";
      default:
        return "bg-slate-500";
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "info":
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

  const uniqueUsers = Array.from(new Set(activities.map((a) => a.user))).sort();
  const uniquePools = Array.from(new Set(activities.filter((a) => a.pool_id).map((a) => a.pool_id!))).sort();

  const columns: Column<Activity>[] = [
    {
      key: "timestamp",
      label: "Timestamp",
      sortable: true,
      render: (value: unknown, row: Activity) => (
        <span className="text-sm text-slate-700 font-mono">
          {formatTimestamp(row.timestamp)}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: unknown, row: Activity) => {
        const type = row.type;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getActivityColor(type)}`} />
            <span className="text-sm text-slate-700 capitalize">
              {type.replace(/_/g, " ")}
            </span>
          </div>
        );
      },
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (value: unknown, row: Activity) => (
        <span className="text-sm text-slate-900 max-w-md truncate" title={row.description}>
          {row.description}
        </span>
      ),
    },
    {
      key: "user",
      label: "User",
      sortable: true,
      render: (value: unknown, row: Activity) => {
        const userEmail = row.user;
        const user = users.find((u) => u.email === userEmail);
        return (
          <span className="text-sm text-slate-700" title={userEmail}>
            {user?.name || userEmail}
          </span>
        );
      },
    },
    {
      key: "ip_address",
      label: "IP Address",
      sortable: true,
      render: (value: unknown, row: Activity) => {
        const ip = row.ip_address;
        if (!ip) return <span className="text-sm text-slate-400">—</span>;
        return (
          <button
            onClick={() => router.push(`/dashboard/pools?search=${ip}`)}
            className="text-sm text-blue-600 hover:text-blue-700 font-mono"
          >
            {ip}
          </button>
        );
      },
    },
    {
      key: "pool_id",
      label: "Pool",
      sortable: true,
      render: (value: unknown, row: Activity) => {
        const poolId = row.pool_id;
        if (!poolId) return <span className="text-sm text-slate-400">—</span>;
        const pool = pools.find((p) => p.id === poolId);
        return (
          <button
            onClick={() => router.push(`/dashboard/pools/${poolId}`)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {pool?.cidr || poolId}
          </button>
        );
      },
    },
    {
      key: "severity",
      label: "Severity",
      sortable: true,
      render: (value: unknown, row: Activity) => {
        const severity = row.severity;
        if (!severity) return <span className="text-sm text-slate-400">—</span>;
        return (
          <span
            className={`text-xs px-2 py-1 rounded border font-medium ${getSeverityColor(severity)}`}
          >
            {severity.toUpperCase()}
          </span>
        );
      },
    },
  ];


  return (
    <div className="flex flex-col w-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
        <div className="mb-6">
          <div className="flex items-center justify-end mb-2">
            <div className="flex items-center gap-3">
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
            <p className="text-xs font-medium text-slate-600 mb-1">Total Activities</p>
            <p className="text-2xl font-bold text-slate-900">{filteredActivities.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-slate-600 mb-1">Unique Users</p>
            <p className="text-2xl font-bold text-slate-900">
              {new Set(filteredActivities.map((a) => a.user)).size}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-slate-600 mb-1">Warnings</p>
            <p className="text-2xl font-bold text-yellow-600">
              {filteredActivities.filter((a) => a.severity === "warning").length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-slate-600 mb-1">Errors</p>
            <p className="text-2xl font-bold text-red-600">
              {filteredActivities.filter((a) => a.severity === "error").length}
            </p>
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
                placeholder="Search by description, user, IP address, or pool..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Activity Type</label>
                <select
                  value={filters.activityType}
                  onChange={(e) => setFilters({ ...filters, activityType: e.target.value as ActivityTypeFilter })}
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
                  {uniqueUsers.map((user) => {
                    const userObj = users.find((u) => u.email === user);
                    return (
                      <option key={user} value={user}>
                        {userObj?.name || user}
                      </option>
                    );
                  })}
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value as typeof filters.severity })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
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

            {(filters.activityType !== "all" ||
              filters.userId !== "all" ||
              filters.poolId !== "all" ||
              filters.severity !== "all" ||
              filters.dateFrom ||
              filters.dateTo ||
              searchQuery) && (
              <div>
                <button
                  onClick={() => {
                    setFilters({
                      activityType: "all",
                      userId: "all",
                      poolId: "all",
                      severity: "all",
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
              data={filteredActivities as unknown as Record<string, unknown>[]}
              pagination={{ pageSize: 10 }}
              emptyMessage="No activities found matching your filters"
            />
          </div>
        </Card>
      </div>
  );
}

