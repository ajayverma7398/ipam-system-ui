"use client";

import { useMemo } from "react";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { UtilizationBar } from "@/components/common/data-display";

export function CapacityDashboard() {
  const router = useRouter();

  const capacityStatus = useMemo(() => {
    const totalHosts = pools.reduce((sum, pool) => sum + pool.total_hosts, 0);
    const totalAllocated = pools.reduce((sum, pool) => sum + pool.utilization.allocated, 0);
    const totalAvailable = pools.reduce((sum, pool) => sum + pool.utilization.available, 0);
    const overallUtilization = (totalAllocated / totalHosts) * 100;

    return {
      totalHosts,
      totalAllocated,
      totalAvailable,
      overallUtilization: Math.round(overallUtilization * 10) / 10,
    };
  }, []);

  const highRiskPools = useMemo(() => {
    return pools
      .filter((pool) => pool.utilization.percentage > 80)
      .sort((a, b) => b.utilization.percentage - a.utilization.percentage)
      .slice(0, 10);
  }, []);

  const projectedExhaustion = useMemo(() => {
    const now = new Date();
    const growthRate = 1.5;
    
    return pools
      .map((pool) => {
        const utilization = pool.utilization.percentage;
        if (utilization >= 100) {
          return { pool, months: 0, date: "Exhausted" };
        }
        if (utilization >= 90) {
          const monthsToExhaustion = (100 - utilization) / growthRate;
          const exhaustionDate = new Date(now);
          exhaustionDate.setMonth(exhaustionDate.getMonth() + monthsToExhaustion);
          return {
            pool,
            months: Math.round(monthsToExhaustion * 10) / 10,
            date: exhaustionDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.months - b.months)
      .slice(0, 5);
  }, []);

  const availableCapacity = useMemo(() => {
    const byType = {
      private: pools
        .filter((p) => p.type === "private")
        .reduce((sum, p) => sum + p.utilization.available, 0),
      public: pools
        .filter((p) => p.type === "public")
        .reduce((sum, p) => sum + p.utilization.available, 0),
      multicast: pools
        .filter((p) => p.type === "multicast")
        .reduce((sum, p) => sum + p.utilization.available, 0),
    };

    return {
      total: capacityStatus.totalAvailable,
      byType,
    };
  }, [capacityStatus]);

  const getRiskLevel = (utilization: number) => {
    if (utilization >= 90) return { level: "Critical", color: "red" };
    if (utilization >= 75) return { level: "High", color: "orange" };
    if (utilization >= 50) return { level: "Medium", color: "yellow" };
    return { level: "Low", color: "green" };
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Capacity Dashboard</h3>
          <p className="text-sm text-slate-600">Current capacity status and projections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Total Capacity</p>
            <p className="text-2xl font-bold text-blue-900">{capacityStatus.totalHosts.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-1">IP addresses</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Available</p>
            <p className="text-2xl font-bold text-green-900">{capacityStatus.totalAvailable.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">
              {((capacityStatus.totalAvailable / capacityStatus.totalHosts) * 100).toFixed(1)}% free
            </p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-medium text-red-700 mb-1">Allocated</p>
            <p className="text-2xl font-bold text-red-900">{capacityStatus.totalAllocated.toLocaleString()}</p>
            <p className="text-xs text-red-600 mt-1">
              {capacityStatus.overallUtilization}% utilized
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Risk Level</p>
            <p className="text-2xl font-bold text-purple-900">
              {getRiskLevel(capacityStatus.overallUtilization).level}
            </p>
            <p className="text-xs text-purple-600 mt-1">Overall system</p>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Available Capacity by Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">Private IPs</p>
              <p className="text-2xl font-bold text-slate-900">{availableCapacity.byType.private.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">Public IPs</p>
              <p className="text-2xl font-bold text-slate-900">{availableCapacity.byType.public.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">Multicast IPs</p>
              <p className="text-2xl font-bold text-slate-900">{availableCapacity.byType.multicast.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {highRiskPools.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">⚠️ High-Risk Pools</h4>
            <div className="space-y-2">
              {highRiskPools.map((pool) => {
                const risk = getRiskLevel(pool.utilization.percentage);
                return (
                  <div
                    key={pool.id}
                    className="p-4 border-2 border-red-200 bg-red-50 rounded-lg hover:border-red-300 transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/pools/${encodeURIComponent(pool.cidr)}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-semibold text-slate-900">{pool.cidr}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            risk.color === "red"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {risk.level} Risk
                        </span>
                      </div>
                      <span className="text-lg font-bold text-red-900">
                        {pool.utilization.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <UtilizationBar
                        used={pool.utilization.allocated}
                        total={pool.total_hosts}
                        showPercentage={false}
                      />
                    </div>
                    <div className="mt-2 text-xs text-slate-600">
                      {pool.utilization.available.toLocaleString()} IPs remaining
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {projectedExhaustion.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Projected Exhaustion Dates</h4>
            <div className="space-y-2">
              {projectedExhaustion.map((item) => (
                <div
                  key={item.pool.id}
                  className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900 font-mono">{item.pool.cidr}</p>
                      <p className="text-xs text-slate-600">
                        Current: {item.pool.utilization.percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-yellow-900">
                        {item.months === 0 ? item.date : `${item.months} months`}
                      </p>
                      <p className="text-xs text-yellow-700">{item.date}</p>
                    </div>
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

