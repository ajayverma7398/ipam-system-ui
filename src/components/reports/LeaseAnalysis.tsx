"use client";

import { useState, useMemo } from "react";
import { allocations } from "@/lib/data/allocations";
import { leaseExpiration } from "@/lib/data/lease-expiration";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

type ExpirationFilter = "all" | "7d" | "30d" | "90d";

export function LeaseAnalysis() {
  const { showToast } = useToast();
  const [expirationFilter, setExpirationFilter] = useState<ExpirationFilter>("30d");

  const leasesWithDuration = allocations.filter((alloc): alloc is typeof alloc & { allocated_at: string; expires_at: string } => {
    return alloc.allocated_at != null && alloc.expires_at != null;
  });

  const leaseStats = leasesWithDuration.length === 0
    ? { averageDays: 0, medianDays: 0, minDays: 0, maxDays: 0 }
    : (() => {
        const durations = leasesWithDuration.map((alloc) => {
          const allocated = new Date(alloc.allocated_at);
          const expires = new Date(alloc.expires_at);
          return Math.floor((expires.getTime() - allocated.getTime()) / (1000 * 60 * 60 * 24));
        }).sort((a, b) => a - b);

        return {
          averageDays: Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length),
          medianDays: durations[Math.floor(durations.length / 2)] || 0,
          minDays: durations[0] || 0,
          maxDays: durations[durations.length - 1] || 0,
        };
      })();

  const expirationPattern = useMemo(() => {
    if (expirationFilter === "all") {
      return leaseExpiration["30d"] || [];
    }
    return leaseExpiration[expirationFilter] || [];
  }, [expirationFilter]);

  const now = new Date();
  const orphaned: typeof allocations = [];

  allocations.forEach((alloc) => {
    if (alloc.expires_at && alloc.status === "allocated") {
      const expires = new Date(alloc.expires_at);
      if (expires < now) {
        orphaned.push(alloc);
      }
    }
    if (alloc.expires_at && !alloc.device_id && !alloc.hostname) {
      const expires = new Date(alloc.expires_at);
      if (expires < now) {
        orphaned.push(alloc);
      }
    }
  });

  const orphanedIPs = orphaned.slice(0, 20);

  const totalExpired = allocations.filter((alloc) => {
    if (!alloc.expires_at) return false;
    return new Date(alloc.expires_at) < new Date();
  }).length;

  const renewed = allocations.filter((alloc) => {
    if (!alloc.allocated_at) return false;
    const allocated = new Date(alloc.allocated_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return allocated > thirtyDaysAgo && alloc.status === "allocated";
  }).length;

  const renewalRate = totalExpired > 0 ? (renewed / totalExpired) * 100 : 0;

  const renewalRates = {
    totalExpired,
    renewed,
    renewalRate: Math.round(renewalRate * 10) / 10,
    notRenewed: totalExpired - renewed,
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Lease Analysis</h3>
          <p className="text-sm text-slate-600">Lease duration, renewal rates, and expiration patterns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Average Duration</p>
            <p className="text-2xl font-bold text-blue-900">{leaseStats.averageDays} days</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Median Duration</p>
            <p className="text-2xl font-bold text-green-900">{leaseStats.medianDays} days</p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-medium text-yellow-700 mb-1">Min Duration</p>
            <p className="text-2xl font-bold text-yellow-900">{leaseStats.minDays} days</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Max Duration</p>
            <p className="text-2xl font-bold text-purple-900">{leaseStats.maxDays} days</p>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Lease Renewal Rates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Total Expired</p>
                  <p className="text-lg font-bold text-slate-900">{renewalRates.totalExpired}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-700 mb-1">Renewed</p>
                  <p className="text-lg font-bold text-green-900">{renewalRates.renewed}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-700 mb-1">Not Renewed</p>
                  <p className="text-lg font-bold text-red-900">{renewalRates.notRenewed}</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1">Renewal Rate</p>
                <p className="text-3xl font-bold text-blue-900">{renewalRates.renewalRate}%</p>
              </div>
            </div>
            <ClientOnlyChart className="h-48" style={{ minHeight: 192 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Renewed", value: renewalRates.renewed },
                      { name: "Not Renewed", value: renewalRates.notRenewed },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${percent != null ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ClientOnlyChart>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-semibold text-slate-900">Expiration Patterns</h4>
            <select
              value={expirationFilter}
              onChange={(e) => setExpirationFilter(e.target.value as ExpirationFilter)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="7d">Next 7 days</option>
              <option value="30d">Next 30 days</option>
              <option value="90d">Next 90 days</option>
            </select>
          </div>
          {expirationPattern.length > 0 ? (
            <ClientOnlyChart className="h-48" style={{ minHeight: 192 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expirationPattern}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="label"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#f59e0b" name="Expiring IPs" />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnlyChart>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg">
              No expiring IPs in the selected period
            </div>
          )}
        </div>

        {orphanedIPs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-semibold text-slate-900">Orphaned IPs Detected</h4>
              <button
                onClick={() => showToast("Orphaned IP cleanup initiated", "info")}
                className="px-3 py-1 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
              >
                Cleanup
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {orphanedIPs.map((alloc) => (
                <div
                  key={alloc.id}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900 font-mono">{alloc.ip_address}</p>
                      <p className="text-xs text-slate-600">
                        Expired: {alloc.expires_at ? new Date(alloc.expires_at).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                      Orphaned
                    </span>
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

