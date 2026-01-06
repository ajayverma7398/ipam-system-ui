"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/common/data-display";

interface UserAuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
}

export function UserAuditLog() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [actionFilter, setActionFilter] = useState<string>("all");

  const auditEntries: UserAuditEntry[] = useMemo(() => {
    const baseTime = 1700000000000;
    return [
      {
        id: "audit-001",
        timestamp: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString(),
        user: "admin@example.com",
        action: "user_created",
        target: "johndoe",
        details: "Created new user account",
        ipAddress: "192.168.1.100",
      },
      {
        id: "audit-002",
        timestamp: new Date(baseTime - 5 * 60 * 60 * 1000).toISOString(),
        user: "admin@example.com",
        action: "role_assigned",
        target: "janesmith",
        details: "Assigned role: network_engineer",
        ipAddress: "192.168.1.100",
      },
      {
        id: "audit-003",
        timestamp: new Date(baseTime - 24 * 60 * 60 * 1000).toISOString(),
        user: "admin@example.com",
        action: "permission_granted",
        target: "bobjohnson",
        details: "Granted permission: manage_allocations",
        ipAddress: "192.168.1.101",
      },
      {
        id: "audit-004",
        timestamp: new Date(baseTime - 48 * 60 * 60 * 1000).toISOString(),
        user: "admin@example.com",
        action: "user_deleted",
        target: "olduser",
        details: "Deleted user account",
        ipAddress: "192.168.1.100",
      },
    ];
  }, []);

  const filteredEntries = useMemo(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : Infinity;
    const cutoff = days === Infinity ? 0 : 1700000000000 - days * 24 * 60 * 60 * 1000;

    return auditEntries
      .filter((entry) => {
        const matchesTime = new Date(entry.timestamp).getTime() >= cutoff;
        const matchesAction = actionFilter === "all" || entry.action === actionFilter;
        return matchesTime && matchesAction;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [auditEntries, timeRange, actionFilter]);

  const getActionBadge = (action: string) => {
    const actionColors: Record<string, { bg: string; text: string; label: string }> = {
      user_created: { bg: "bg-green-100", text: "text-green-800", label: "User Created" },
      user_deleted: { bg: "bg-red-100", text: "text-red-800", label: "User Deleted" },
      role_assigned: { bg: "bg-blue-100", text: "text-blue-800", label: "Role Assigned" },
      permission_granted: { bg: "bg-purple-100", text: "text-purple-800", label: "Permission Granted" },
      permission_revoked: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Permission Revoked" },
    };
    const config = actionColors[action] || { bg: "bg-slate-100", text: "text-slate-800", label: action };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const columns: Column<UserAuditEntry>[] = [
    {
      key: "timestamp",
      label: "Timestamp",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">
          {new Date(value as string).toLocaleString()}
        </span>
      ),
    },
    {
      key: "user",
      label: "User",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">{value as string}</span>
      ),
    },
    {
      key: "action",
      label: "Action",
      sortable: true,
      render: (value: unknown) => getActionBadge(value as string),
    },
    {
      key: "target",
      label: "Target",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm font-medium text-slate-900">{value as string}</span>
      ),
    },
    {
      key: "details",
      label: "Details",
      sortable: false,
      render: (value: unknown) => (
        <span className="text-sm text-slate-600">{value as string}</span>
      ),
    },
    {
      key: "ipAddress",
      label: "IP Address",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm font-mono text-slate-900">{value as string}</span>
      ),
    },
  ];

  const actions = Array.from(new Set(auditEntries.map((e) => e.action)));

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">User Management Audit Log</h3>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Actions</option>
              {actions.map((action) => (
                <option key={action} value={action}>
                  {action.replace(/_/g, " ")}
                </option>
              ))}
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

        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={filteredEntries as unknown as Record<string, unknown>[]}
          pagination={{ pageSize: 20 }}
          emptyMessage="No audit log entries found"
        />
      </div>
    </Card>
  );
}

