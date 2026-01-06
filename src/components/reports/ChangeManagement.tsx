"use client";

import { useMemo, useState } from "react";
import { changeManagement } from "@/lib/data/change-management";
import Card from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

type ChangeType = "all" | "ip_allocation" | "ip_release" | "pool_creation" | "pool_deletion";
type TimeRange = "7d" | "30d" | "90d";

export function ChangeManagement() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [changeType, setChangeType] = useState<ChangeType>("all");

  const changeStats = useMemo(() => {
    return changeManagement.changeStats[timeRange][changeType] || {
      total: 0,
      successful: 0,
      failed: 0,
      successRate: 0,
    };
  }, [timeRange, changeType]);

  const changeImpact = useMemo(() => {
    return changeManagement.changeImpact || [];
  }, []);

  const changeTimeline = useMemo(() => {
    return changeManagement.changeTimeline[timeRange][changeType] || [];
  }, [timeRange, changeType]);

  const rollbackAnalysis = useMemo(() => {
    return changeManagement.rollbackAnalysis || { count: 0, recent: [] };
  }, []);

  const approvalWorkflow = useMemo(() => {
    return changeManagement.approvalWorkflow || {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      approvalRate: 0,
    };
  }, []);

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Change Management</h3>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={changeType}
              onChange={(e) => setChangeType(e.target.value as ChangeType)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Changes</option>
              <option value="ip_allocation">IP Allocations</option>
              <option value="ip_release">IP Releases</option>
              <option value="pool_creation">Pool Creations</option>
              <option value="pool_deletion">Pool Deletions</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Total Changes</p>
            <p className="text-2xl font-bold text-blue-900">{changeStats.total}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Successful</p>
            <p className="text-2xl font-bold text-green-900">{changeStats.successful}</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-medium text-red-700 mb-1">Failed</p>
            <p className="text-2xl font-bold text-red-900">{changeStats.failed}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-purple-900">{changeStats.successRate}%</p>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Change Success Trend</h4>
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={changeTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="successRate"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Success Rate %"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        {changeImpact.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Change Impact by Type</h4>
            <ClientOnlyChart className="h-48" style={{ minHeight: 192 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={changeImpact}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="type"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Total Changes" />
                  <Bar dataKey="errors" fill="#ef4444" name="Errors" />
                  <Bar dataKey="warnings" fill="#f59e0b" name="Warnings" />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnlyChart>
          </div>
        )}

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Approval Workflow</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-xs font-medium text-slate-700 mb-1">Total Changes</p>
              <p className="text-2xl font-bold text-slate-900">{approvalWorkflow.total}</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs font-medium text-green-700 mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-900">{approvalWorkflow.approved}</p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs font-medium text-yellow-700 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{approvalWorkflow.pending}</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-medium text-blue-700 mb-1">Approval Rate</p>
              <p className="text-2xl font-bold text-blue-900">{approvalWorkflow.approvalRate}%</p>
            </div>
          </div>
        </div>

        {rollbackAnalysis.count > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Rollback Analysis</h4>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
              <p className="text-sm font-medium text-yellow-900 mb-1">Total Rollbacks</p>
              <p className="text-2xl font-bold text-yellow-900">{rollbackAnalysis.count}</p>
            </div>
            <div className="space-y-2">
              {rollbackAnalysis.recent.map((rollback, index) => (
                <div key={index} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-900 mb-1">{rollback.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>User: {rollback.user}</span>
                    <span>•</span>
                    <span>{new Date(rollback.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

