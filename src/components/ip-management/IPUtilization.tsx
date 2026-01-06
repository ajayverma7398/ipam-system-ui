"use client";

import { useMemo } from "react";
import { pools } from "@/lib/data/pools";
import { allocations } from "@/lib/data/allocations";
import Card from "@/components/ui/Card";
import { UtilizationBar, ClientOnlyChart } from "@/components/common/data-display";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function IPUtilization() {
  const globalStats = useMemo(() => {
    const totalHosts = pools.reduce((sum, pool) => sum + pool.total_hosts, 0);
    const totalAllocated = pools.reduce((sum, pool) => sum + pool.utilization.allocated, 0);
    const totalAvailable = pools.reduce((sum, pool) => sum + pool.utilization.available, 0);
    const totalReserved = pools.reduce((sum, pool) => sum + pool.utilization.reserved, 0);
    const utilizationRate = totalHosts > 0 ? (totalAllocated / totalHosts) * 100 : 0;

    return {
      totalHosts,
      totalAllocated,
      totalAvailable,
      totalReserved,
      utilizationRate,
    };
  }, []);

  const expiringSoon = useMemo(() => {
    const now = new Date();
    const in30Days = new Date();
    in30Days.setDate(now.getDate() + 30);

    return allocations.filter((alloc) => {
      if (!alloc.expires_at) return false;
      const expiryDate = new Date(alloc.expires_at);
      return expiryDate >= now && expiryDate <= in30Days;
    }).length;
  }, []);

  const poolUtilizationData = useMemo(() => {
    return pools
      .map((pool) => ({
        name: pool.cidr.split("/")[0].split(".").slice(-1)[0] + "/" + pool.cidr.split("/")[1],
        utilization: pool.utilization.percentage,
        allocated: pool.utilization.allocated,
        available: pool.utilization.available,
      }))
      .slice(0, 10)
      .sort((a, b) => b.utilization - a.utilization);
  }, []);

  const getColor = (utilization: number) => {
    if (utilization >= 75) return "#ef4444";
    if (utilization >= 50) return "#f59e0b";
    if (utilization >= 25) return "#10b981";
    return "#3b82f6";
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Global Utilization</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Total IPs</p>
            <p className="text-2xl font-bold text-slate-900">{globalStats.totalHosts.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Allocated</p>
            <p className="text-2xl font-bold text-red-600">{globalStats.totalAllocated.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Available</p>
            <p className="text-2xl font-bold text-green-600">{globalStats.totalAvailable.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Utilization</p>
            <p className="text-2xl font-bold text-blue-600">{globalStats.utilizationRate.toFixed(1)}%</p>
          </div>
        </div>
        <div className="mt-4">
          <UtilizationBar
            used={globalStats.totalAllocated}
            total={globalStats.totalHosts}
            showPercentage={true}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Pools by Utilization</h3>
        <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={poolUtilizationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: "12px" }} />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value: number | undefined) => value != null ? `${value.toFixed(1)}%` : ""}
              />
              <Bar dataKey="utilization" radius={[8, 8, 0, 0]}>
                {poolUtilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.utilization)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ClientOnlyChart>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Expiring Soon</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-yellow-600">{expiringSoon}</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">IPs expiring in the next 30 days</p>
              <p className="text-xs text-slate-500 mt-1">Review and renew as needed</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Capacity Planning</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Available Capacity</span>
              <span className="font-semibold text-slate-900">
                {globalStats.totalAvailable.toLocaleString()} IPs
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Reserved</span>
              <span className="font-semibold text-slate-900">
                {globalStats.totalReserved.toLocaleString()} IPs
              </span>
            </div>
            {globalStats.utilizationRate > 75 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900">High Utilization Alert</p>
                <p className="text-xs text-red-700 mt-1">
                  Consider creating new pools or releasing unused IPs
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

